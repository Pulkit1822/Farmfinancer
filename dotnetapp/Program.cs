using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Text.Json;
using dotnetapp.Data;
using dotnetapp.Services;
using Microsoft.OpenApi.Models;
using Microsoft.Extensions.FileProviders;
using log4net;
using log4net.Config;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add Controllers with PascalCase JSON options preservation
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

// Configure Database Context (Supports both SQL Server and In-Memory Fallback)
var connectionString = builder.Configuration.GetConnectionString("con");
var useInMemoryConfig = builder.Configuration.GetValue<bool?>("UseInMemoryDatabase");
var isEfDesign = AppDomain.CurrentDomain.FriendlyName.Contains("ef", StringComparison.OrdinalIgnoreCase)
    || (Assembly.GetEntryAssembly()?.GetName().Name?.Contains("ef", StringComparison.OrdinalIgnoreCase) ?? false);

var useInMemory = !isEfDesign && (useInMemoryConfig ?? (string.IsNullOrWhiteSpace(connectionString) || connectionString.Contains("localhost", StringComparison.OrdinalIgnoreCase)));

if (useInMemory)
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseInMemoryDatabase("FarmFinancerDb"));
}
else
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(connectionString ?? "Server=localhost;Database=appdb;Trusted_Connection=True;", sqlServerOptions =>
        {
            sqlServerOptions.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(30),
                errorNumbersToAdd: null);
        }));
}

// Dependency Injection Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<LoanApplicationService>();
builder.Services.AddScoped<LoanService>();
builder.Services.AddScoped<FeedbackService>();
builder.Services.AddSingleton<ILogService, LogService>();

// JWT Authentication Configuration
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "DefaultSuperSecretKeyForJWTTokenGeneration12345"))
        };
    });

// Flexible CORS Configuration supporting Vercel and configured origins
var configuredOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[]
{
    "https://8081-eafabdeccdfbafdeaaabcfdceffaacaaae.premiumproject.examly.io",
    "http://localhost:4200",
    "http://localhost:8081"
};

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrWhiteSpace(origin)) return false;
            try
            {
                var uri = new Uri(origin);
                // Allow localhost, *.vercel.app, and configured domains
                return uri.Host == "localhost" ||
                       uri.Host.EndsWith(".vercel.app", StringComparison.OrdinalIgnoreCase) ||
                       configuredOrigins.Any(o => o.TrimEnd('/').Equals(origin.TrimEnd('/'), StringComparison.OrdinalIgnoreCase));
            }
            catch
            {
                return false;
            }
        })
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

// Swagger/OpenAPI Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Farm Financer API",
        Version = "v1",
        Description = "API for managing Farm Finances with JWT authentication"
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

// Configure log4net
var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
var logConfigFile = new FileInfo("log4net.config");
if (logConfigFile.Exists)
{
    XmlConfigurator.Configure(logRepository, logConfigFile);
}

var app = builder.Build();

// Ensure upload directory exists for static file serving
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "uploadedFiles");
if (!Directory.Exists(uploadsPath))
{
    Directory.CreateDirectory(uploadsPath);
}

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/proofs"
});

// Swagger in Development or Staging
var enableSwagger = app.Environment.IsDevelopment() ||
                    app.Configuration.GetValue<bool>("EnableSwagger", true);
if (enableSwagger)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();

// Redirect root URL to Swagger documentation UI
app.MapGet("/", () => Results.Redirect("/swagger"));

// Health check endpoints for uptime monitoring & cloud readiness
app.MapGet("/health", () => Results.Ok(new 
{ 
    status = "Healthy", 
    service = "FarmFinancer API",
    database = useInMemory ? "InMemory" : "SqlServer",
    version = useInMemory ? "inmemory-v1" : "sqlserver-v1",
    timestamp = DateTime.UtcNow 
}));

app.MapGet("/api/health", () => Results.Ok(new 
{ 
    status = "Healthy", 
    service = "FarmFinancer API",
    database = useInMemory ? "InMemory" : "SqlServer",
    version = useInMemory ? "inmemory-v1" : "sqlserver-v1",
    timestamp = DateTime.UtcNow 
}));

app.MapControllers();

// Automatic database initialization & migration on startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        if (context.Database.IsRelational())
        {
            Console.WriteLine("[Startup DB] Applying relational migrations to SQL Server...");
            context.Database.Migrate();
            Console.WriteLine("[Startup DB] Migrations applied successfully!");
        }
        else
        {
            Console.WriteLine("[Startup DB] Initializing in-memory database...");
            context.Database.EnsureCreated();
        }
        DbInitializer.SeedData(context);
        Console.WriteLine("[Startup DB] Seed data initialized successfully!");
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"[Startup DB ERROR] Failed to initialize database: {ex.Message}");
        var logger = services.GetService<ILogService>();
        logger?.LogUserAction(500, "System", $"Startup DB init failed: {ex.Message}", "fail");
    }
}

app.Run();
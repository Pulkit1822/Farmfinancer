 
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using dotnetapp.Data;
// using dotnetapp.Services;
// using dotnetapp.Models;
// using Microsoft.OpenApi.Models;

// var builder = WebApplication.CreateBuilder(args);
 
// // Add services to the container
// builder.Services.AddControllers();
 
// // Configure DbContext
// builder.Services.AddDbContext<ApplicationDbContext>(options =>
//     options.UseSqlServer(builder.Configuration.GetConnectionString("con")));
 
// // Register Services
// builder.Services.AddScoped<IAuthService, AuthService>();
// builder.Services.AddScoped<LoanApplicationService>();
// builder.Services.AddScoped<LoanService>();
// builder.Services.AddScoped<FeedbackService>();
 
// // Configure JWT Authentication
// builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,
//             ValidIssuer = builder.Configuration["Jwt:Issuer"],
//             ValidAudience = builder.Configuration["Jwt:Audience"],
//             IssuerSigningKey = new SymmetricSecurityKey(
//                 Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
//         };
//     });
 
// // Configure CORS
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy("AllowAngular",
//         policy =>
//         {
//             policy.WithOrigins("https://8081-dfcbafbffabafdeaaabcfdceffaacaaae.premiumproject.examly.io")
//                   .AllowAnyHeader()
//                   .AllowAnyMethod();
//         });
// });
 
// // Add Swagger/OpenAPI
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen(options =>
// {
//     options.SwaggerDoc("v1", new OpenApiInfo
//     {
//         Title = "Farm Financer API",
//         Version = "v1",
//         Description = "API for Farm Finance Management with JWT authentication"
//     });
//     // Define the Bearer security scheme
//     options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
//     {
//         Name = "Authorization",
//         Type = SecuritySchemeType.Http,
//         Scheme = "Bearer",
//         BearerFormat = "JWT",
//         In = ParameterLocation.Header,
//         Description = "Enter 'Bearer' [space] and then your valid token.\n\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\""
//     });
//     // Add the security requirement globally
//     options.AddSecurityRequirement(new OpenApiSecurityRequirement
//     {
//         {
//             new OpenApiSecurityScheme
//             {
//                 Reference = new OpenApiReference
//                 {
//                     Type = ReferenceType.SecurityScheme,
//                     Id = "Bearer"
//                 }
//             },
//             new string[] {}
//         }
//     });
// });
 
// var app = builder.Build();
 
// // Configure the HTTP request pipeline
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }
 
// app.UseCors("AllowAngular");
 
// app.UseAuthentication();
// app.UseAuthorization();
 
// app.MapControllers();
 
// app.Run();

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
 
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });
 
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("con")));
 
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<LoanApplicationService>();
builder.Services.AddScoped<LoanService>();
builder.Services.AddScoped<FeedbackService>();
builder.Services.AddSingleton<ILogService, LogService>();

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
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });
 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("https://8081-aecacdfbffdbcacafdeaaabcfdceffaacaaae.premiumproject.examly.io")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
 
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
 
var logRepository = LogManager.GetRepository(Assembly.GetEntryAssembly());
XmlConfigurator.Configure(logRepository, new FileInfo("log4net.config"));

var app = builder.Build();

app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(
        Path.Combine(Directory.GetCurrentDirectory(), "uploadedFiles")),
    RequestPath = "/proofs"
});
 
 
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
 
app.UseHttpsRedirection();
 
app.UseCors("AllowAngular");
 
app.UseAuthentication();
 
app.UseAuthorization();
 
app.MapControllers();
 
app.Run();

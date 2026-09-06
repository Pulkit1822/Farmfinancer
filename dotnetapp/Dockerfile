# Stage 1: Build & Publish
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy project files and restore dependencies
COPY dotnetapp/dotnetapp.csproj ./dotnetapp/
RUN dotnet restore ./dotnetapp/dotnetapp.csproj

# Copy the rest of the application code
COPY dotnetapp/ ./dotnetapp/

# Build and publish release output
WORKDIR /src/dotnetapp
RUN dotnet publish dotnetapp.csproj -c Release -o /app/publish /p:UseAppHost=false

# Stage 2: Production Runtime
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app

# Configure ASP.NET Core URL and Port
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080

# Configure OpenSSL for SQL Server TLS pre-login handshake compatibility
RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=0/g' /etc/ssl/openssl.cnf || true \
    && sed -i 's/DEFAULT:@SECLEVEL=2/DEFAULT:@SECLEVEL=0/g' /etc/ssl/openssl.cnf || true \
    && sed -i 's/CipherString = DEFAULT@SECLEVEL=2/CipherString = DEFAULT@SECLEVEL=0/g' /etc/ssl/openssl.cnf || true


# Create directory for file uploads
RUN mkdir -p /app/uploadedFiles

# Copy published files from build stage
COPY --from=build /app/publish .

# Run the API
ENTRYPOINT ["dotnet", "dotnetapp.dll"]

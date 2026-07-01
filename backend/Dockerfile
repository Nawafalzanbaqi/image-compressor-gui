# ── Build stage ──────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Restore first (better layer caching).
COPY Directory.Build.props ./
COPY SoftwareFactory.sln ./
COPY src/SoftwareFactory.Domain/*.csproj src/SoftwareFactory.Domain/
COPY src/SoftwareFactory.Application/*.csproj src/SoftwareFactory.Application/
COPY src/SoftwareFactory.Infrastructure/*.csproj src/SoftwareFactory.Infrastructure/
COPY src/SoftwareFactory.Web/*.csproj src/SoftwareFactory.Web/
COPY tests/Application.UnitTests/*.csproj tests/Application.UnitTests/
COPY tests/Integration.Tests/*.csproj tests/Integration.Tests/
RUN dotnet restore src/SoftwareFactory.Web/SoftwareFactory.Web.csproj

COPY . .
RUN dotnet publish src/SoftwareFactory.Web/SoftwareFactory.Web.csproj -c Release -o /app/publish /p:UseAppHost=false

# ── Runtime stage ────────────────────────────────────────────────────────────
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SoftwareFactory.Web.dll"]

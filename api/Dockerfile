FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

COPY ["api.csproj", "./"]
RUN dotnet restore

COPY . .
RUN dotnet publish "api.csproj" -c Release -o /out


FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /out .

ENTRYPOINT ["dotnet", "api.dll"]
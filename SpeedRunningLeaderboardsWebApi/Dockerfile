#See https://aka.ms/containerfastmode to understand how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:5.0 AS base
WORKDIR /app
COPY ./SpeedRunningLeaderboards/SQL/ SQL/
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY ["SpeedRunningLeaderboardsWebApi/SpeedRunningLeaderboardsWebApi.csproj", "SpeedRunningLeaderboardsWebApi/"]
COPY ["SpeedRunningLeaderboards/SpeedRunningLeaderboards.csproj", "SpeedRunningLeaderboards/"]
RUN dotnet restore "SpeedRunningLeaderboardsWebApi/SpeedRunningLeaderboardsWebApi.csproj"
COPY . .
WORKDIR "/src/SpeedRunningLeaderboardsWebApi"
RUN dotnet build "SpeedRunningLeaderboardsWebApi.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SpeedRunningLeaderboardsWebApi.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SpeedRunningLeaderboardsWebApi.dll"]
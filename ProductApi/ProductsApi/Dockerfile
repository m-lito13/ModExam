FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY *.slnx .
COPY ProductsApi.Domain/*.csproj ProductsApi.Domain/
COPY ProductsApi.Application/*.csproj ProductsApi.Application/
COPY ProductsApi.Infrastructure/*.csproj ProductsApi.Infrastructure/
COPY ProductsApi/*.csproj ProductsApi/
RUN dotnet restore ProductsApi/ProductsApi.csproj

COPY . .
RUN dotnet publish ProductsApi/ProductsApi.csproj -c Release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app .

ENV ASPNETCORE_URLS=http://+:5259
EXPOSE 5259
ENTRYPOINT ["dotnet", "ProductsApi.dll"]

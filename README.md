# Shopping Application

A shopping app made up of three services:

- **shopping-app** — React/Vite frontend UI, state managed with Redux (Redux Toolkit)
- **ProductApi** — .NET product catalog API (SQL Server)
- **orders-api** — Node/Express orders API (Elasticsearch)

Data stores (SQL Server, Elasticsearch) always run in Docker. The apps themselves can run either directly on your machine (Mode 1) or also in Docker (Mode 2).

## Getting the code

```bash
git clone https://github.com/m-lito13/ModExam.git
cd ModExam 
```

`ModExam` here is just the folder name git creates from the repo name (the local clone's root folder) — it's not a fixed requirement. All commands below (docker compose, npm, dotnet) assume you are in that repository root folder unless a `cd` is shown.

## Prerequisites

- Docker Desktop (or another engine that provides the `docker`/`docker compose` CLI, e.g. Rancher Desktop, Docker Engine on WSL2) — must be running in the background; no GUI interaction is needed, everything below is run from the command line
- Node.js 20 (for `shopping-app` and `orders-api`, matches the Docker images used in Mode 2)
- .NET SDK 10 (for `ProductApi`, matches the Docker images used in Mode 2)

## Environment files

Before running anything, copy the example env files. `.env` is gitignored and not committed to source control (so each environment can hold its own values without risking secrets/local overrides leaking into the repo); `.env.example` is the committed template you copy from.

Bash / Git Bash:

```bash
cp shopping-app/.env.example shopping-app/.env
cp orders-api/.env.example orders-api/.env
```

Windows CMD:

```cmd
copy shopping-app\.env.example shopping-app\.env
copy orders-api\.env.example orders-api\.env
```

`ProductApi` does not use a `.env` file — its configuration lives in `appsettings.json` / `appsettings.Development.json`.

## Mode 1 — Data in Docker, apps run locally

Run from the `ModExam` root folder (where `docker-compose.yml` lives). Start only the data services (Elasticsearch, Kibana, SQL Server):

```bash
docker compose -f docker-compose.yml up -d --wait
```

`--wait` blocks until containers report healthy instead of returning as soon as they're started, so the apps below don't try to connect too early. Elasticsearch has a real healthcheck; SQL Server doesn't define one, so `--wait` only confirms its container is running, not that it's ready to accept connections yet — give it a few extra seconds before starting ProductApi, and retry if the first connection attempt fails.

**SQL Server must be up and healthy before ProductApi starts** — as soon as ProductApi starts (`dotnet run`, or the container in Mode 2) it calls `Database.Migrate()` against it, which needs a live connection; starting ProductApi before SQL Server is ready will just fail/retry until it is.

Then run each app locally, in its own terminal:

```bash
# ProductApi (http://localhost:5259)
cd ProductApi/ProductsApi
dotnet run
# no separate build step needed — `dotnet run` builds first — and no manual
# migration step either: Program.cs calls Database.Migrate() on startup, so
# the schema is created/updated automatically. Seed data is a separate,
# one-time step — see "Seed data" below.

# orders-api (http://localhost:4000)
cd orders-api
npm install
npm run dev

# shopping-app (http://localhost:3000, per package.json's vite dev server default)
cd shopping-app
npm install
npm run dev
```

### Seed data

`ProductApi` ships a sample data script at `ProductApi/ProductsApi.Infrastructure/Persistence/SeedData/SeedData.sql` (categories + products). It is **not** run automatically — neither `dotnet run` nor the Docker image executes it, they only apply EF Core migrations — so the catalog is empty until you load it. Run ProductApi at least once first (above) so its startup migration creates the `ProductsApiDb` schema, then load the script once:

```bash
docker cp ProductApi/ProductsApi.Infrastructure/Persistence/SeedData/SeedData.sql sqlserver_1:/tmp/SeedData.sql
docker exec -it sqlserver_1 /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "Testpwd123!" -C -d ProductsApiDb -i /tmp/SeedData.sql
```

(Or point any SQL client — Azure Data Studio, SSMS, etc. — at `localhost,1433`, database `ProductsApiDb`, user `sa` / password `Testpwd123!`, and run the script from there.) The script is safe to re-run — it deletes existing rows first and reseeds identities.

**Note:** the prices in `SeedData.sql` are arbitrary testing values, not real-world prices — don't read anything into them.

### Default local URLs used by the apps

- ProductApi: `http://localhost:5259` (SQL Server on `127.0.0.1,1433`)
- orders-api: `http://localhost:4000` (Elasticsearch on `http://localhost:9200`)
- shopping-app: points at the two APIs above via `VITE_PRODUCT_API_URL` / `VITE_ORDER_API_URL` in its `.env`

Health checks and API docs (same URLs in Mode 2):

- ProductApi health: `http://localhost:5259/health` · Swagger: `http://localhost:5259/swagger`
- orders-api health: `http://localhost:4000/health` · Swagger: `http://localhost:4000/docs`

## Mode 2 — Everything in Docker

Run from the `ModExam` root folder (where both compose files live — their `build.context` paths like `./ProductApi` are relative to it). Start the data services first, then the apps:

```bash
docker compose -f docker-compose.yml up -d --wait
docker compose -f docker-compose.apps.yml up -d --build --wait
```

Same rule as Mode 1: `docker-compose.yml` (SQL Server, Elasticsearch) must be up before `docker-compose.apps.yml`, since `products-api` runs its `Database.Migrate()` on container startup. `docker-compose.apps.yml` doesn't define container healthchecks, so `--wait` there just confirms the containers started, not that each API has finished booting — give them a few seconds before hitting the URLs below, and load the seed script (same commands as in Mode 1) once `products-api` has started at least once.

This builds and runs `products-api`, `orders-api`, and `shopping-app` as containers on the same `local-data-network`, connecting to the dockerized SQL Server and Elasticsearch by container name.

### URLs

- shopping-app: `http://localhost:3000`
- ProductApi: `http://localhost:5259` (health: `/health`, Swagger: `/swagger`)
- orders-api: `http://localhost:4000` (health: `/health`, Swagger: `/docs`)

## Stopping

```bash
docker compose -f docker-compose.apps.yml down
docker compose -f docker-compose.yml down
```

Add `-v` to also remove the SQL Server / Elasticsearch data volumes.

## Implementation features and limitations

- **UI text / language** — all `shopping-app` labels are pulled from a single lookup (`src/i18n/t.ts`) backed by locale files under `src/locales` (e.g. `he.json`). Currently only Hebrew (`he`) is implemented; adding a language means adding a new locale file and wiring it into that lookup — no other UI code needs to change.
- **Mobile support** — layout uses responsive breakpoints (see `src/index.css`) so pages remain usable on mobile-sized viewports, not just desktop.
- **Pagination** — categories and products are paginated end-to-end: `CategoriesController` (`GET /api/categories`, `GET /api/categories/{id}/products`) accepts `pageNumber`/`pageSize` and returns a `PagedResult`, and the `shopping-app` UI fetches and displays one page at a time (`catalogSlice.ts`, `ProductList.tsx`) rather than loading a whole category up front.
- **Client-side page caching** — fetched product pages are cached in Redux state keyed by `${categoryId}:${pageNumber}` (`catalogSlice.ts`). Once a page has loaded successfully, navigating away and back to it re-renders from the cached state instead of firing another API call; only pages not yet fetched (or not yet succeeded) trigger a request.
- **Validations**:
  - Order form (`OrderForm.tsx`): full name required, address required, email required and must match a basic email format.
  - Cart (`cartSlice.ts` / `CartSummary.tsx`): quantity must be at least 1 (dropping to 0 removes the item); checkout is blocked while any item's quantity exceeds its available stock, with an inline error shown per item.
- **Unit tests** — both backends have unit test suites: `orders-api/test/` (run with `npm test`, uses Vitest) and `ProductApi/ProductsApi.Tests/` (run with `dotnet test`).
- **Elasticsearch mapping** — the index mapping used by `orders-api` is defined in `orders-api/elasticsearch/orders-mapping.json`.
- **Inventory: scope and known limitation** — Stock validation is client-side only, checked against the product catalog snapshot fetched from ProductApi (`GET /api/categories`) when the shopping screen loads. Adding an item to the cart and submitting the order are both validated against this snapshot's `stock` field, with no additional API calls made from the order summary screen.

  **Not implemented: server-side stock decrement on order.** Persisting an order (orders-api / Elasticsearch) does not update product stock (ProductApi / SQL Server). This is a deliberate scope decision, not an oversight: the assignment brief assigns ProductApi exclusively to the shopping screen and orders-api exclusively to the order summary screen, with no backend-to-backend communication implied anywhere. A real stock decrement would require either orders-api writing into ProductApi's database, or a synchronous call between the two backends — both introduce coupling that contradicts the brief's stated architecture and per-screen backend assignment.

  Consequence: this is a UX safeguard against obviously stale carts, not a concurrency-safe inventory guarantee — two concurrent shoppers could both pass validation against the same last unit. A production version of this feature would need an event-driven sync (e.g. an outbox pattern publishing "order placed" events that a separate consumer uses to decrement stock) to resolve that without violating the backend separation.

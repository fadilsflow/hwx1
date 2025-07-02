# hwx1

A lightweight RESTful API for a demo marketplace, built with [Hono](https://hono.dev/) and deployed to Cloudflare Workers via **wrangler**.

## Tech Stack

- TypeScript
- Hono 4
- Cloudflare Workers
- Wrangler

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server** (runs on <http://localhost:8787> by default):

   ```bash
   npm run dev
   ```

3. **Build** the worker:

   ```bash
   npm run build
   ```

4. **Deploy** to your Cloudflare account:

   ```bash
   npm run deploy
   ```

> Make sure you have the Cloudflare account configured (`wrangler login`) before deploying.

## Available Endpoints

| Method | Path                        | Description                                                                |
| ------ | --------------------------- | -------------------------------------------------------------------------- |
| GET    | `/`                         | Welcome page + route list                                                  |
| GET    | `/api/categories`           | List all sellers with the categories they sell                             |
| GET    | `/api/categories/:id`       | Get a single category and the sellers that carry it                        |
| GET    | `/api/products`             | List all products, optionally filter by `?category_id=`; grouped by seller |
| GET    | `/api/products/:id`         | Get a single product with seller & category info                           |
| GET    | `/api/sellers/:id/products` | List products for a specific seller                                        |

All responses follow the structure:

```jsonc
{
  "message": "<status message>",
  "data": <payload>,
  "meta": { /* pagination info when applicable */ }
}
```

## Configuration

`wrangler.toml` already points to `src/index.ts` as the entry and sets today's compatibility date. Adjust as needed.

## Project Scripts (`package.json`)

- `npm run dev` – Start local dev server
- `npm run build` – Build the worker
- `npm run deploy` – Deploy to Cloudflare Workers

## License

MIT

# System Overview — Hoodify Season 2

This doc maps the major subsystems and important files in the repository and provides a high-level Mermaid diagram of interactions.

**Subsystems**

- **Frontend (Next.js + React)**
  - Pages and client components live in `app/` and `components/`.
  - Key pages: `app/(user)/shop`, `app/(user)/cart`, `app/admin`.

- **State (Redux)**
  - Stored in `lib/features/*` (cart, products). `lib/store.ts` configures the store.

- **Server (Next.js API routes)**
  - `app/api/*` contains server handlers for auth, products, orders.

- **DB (Drizzle + Neon)**
  - `db/schema.ts` defines tables and relations. `lib/db` or `db/index.ts` provides the `db` instance.

**High-level interaction diagram**

```mermaid
flowchart LR
  subgraph FE[Frontend]
    PC[ProductCard]
    PGP[ProductClient]
    CART[CartPageClient]
    Hooks[Hooks: useAddToCart/useDeleteCartItem/useChangeQuantity]
    Store[Redux Store (cartSlice)]
  end

  subgraph API[Server API]
    OCreate[/api/orders/create]
    OUpdate[/api/orders/update]
    ODelete[/api/orders/delete]
    Auth[/api/auth/*]
  end

  subgraph DB[Database]
    Users[users_table]
    Orders[orders]
    Items[order_items]
    Products[products & product_variants]
  end

  PC -->|add click| Hooks
  PGP -->|add click| Hooks
  Hooks -->|dispatch| Store
  Hooks -->|POST| OCreate
  CART -->|patch| OUpdate
  CART -->|delete| ODelete

  OCreate --> DB
  OUpdate --> DB
  ODelete --> DB
  Auth --> Users
  OCreate --> Users
```

**Important files (quick index)**

- Frontend
  - [app/(user)/cart/CartPageClient.tsx](<app/(user)/cart/CartPageClient.tsx>)
  - [components/ProductCard.tsx](components/ProductCard.tsx)
  - [app/(user)/shop/[id]/ProductClient.tsx](<app/(user)/shop/[id]/ProductClient.tsx>)

- Hooks
  - [lib/hooks/useAddToCart.ts](lib/hooks/useAddToCart.ts)
  - [lib/hooks/useDeleteCartItem.ts](lib/hooks/useDeleteCartItem.ts)
  - [lib/hooks/useChangeQuantity.ts](lib/hooks/useChangeQuantity.ts)

- State
  - [lib/features/cartSlice.ts](lib/features/cartSlice.ts)
  - [lib/features/productsSlice.ts](lib/features/productsSlice.ts)
  - [lib/store.ts](lib/store.ts)

- Server
  - [app/api/orders/create/route.ts](app/api/orders/create/route.ts) (or app/api/orders/route.ts)
  - [app/api/orders/update/route.ts](app/api/orders/update/route.ts)
  - [app/api/orders/delete/route.ts](app/api/orders/delete/route.ts)
  - [app/api/products/route.ts](app/api/products/route.ts)
  - [app/api/auth/\*](app/api/auth)

- DB
  - [db/schema.ts](db/schema.ts)
  - [lib/actions/orderUtils.ts](lib/actions/orderUtils.ts)

**How to keep this map current**

- Add a short comment block to any file you modify with a `@docs` tag referencing the `docs/` file and a one-line summary.
- Run a small script (I can add one) that scans `app/api` and `lib/hooks` and regenerates a fresh map.

**Next steps I can do for you**

- Generate a full mindmap (JSON or Markdown) you can open with a mindmap tool (Figma, NotebookLM, MindNode). I can create a .mm or .json export.
- Render Mermaid diagrams to PNG/SVG and save to `docs/`.
- Add per-function documentation pages under `docs/functions/` automatically.

Tell me which of the above you want next: full repo mindmap export, PNG/SVG diagrams, or per-function docs generation.

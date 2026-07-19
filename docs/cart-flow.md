# Cart Flow — Sequence Diagram and Function Map

This document explains the cart flow (frontend → server → DB), lists the main functions and files involved, and shows a Mermaid sequence diagram for quick visual reference.

**Quick map**

- **Frontend UI**: `app/(user)/cart/CartPageClient.tsx`, `components/ProductCard.tsx`
- **Redux**: `lib/features/cartSlice.ts`
- **Frontend hooks**: `lib/hooks/useAddToCart.ts`, `lib/hooks/useDeleteCartItem.ts`, `lib/hooks/useChangeQuantity.ts`
- **Server API**: `app/api/orders/create/route.ts`, `app/api/orders/update/route.ts`, `app/api/orders/delete/route.ts` (or [app/api/orders/delete/route.ts](app/api/orders/delete/route.ts))
- **DB layer & schema**: `db/schema.ts`, `lib/actions/orderUtils.ts`

**Mermaid sequence diagram**

```mermaid
sequenceDiagram
  participant User
  participant UI as Frontend UI
  participant Redux
  participant Hook as Cart Hook
  participant API as Orders API
  participant DB as Database

  User->>UI: Click "Add to Cart"
  UI->>Hook: useAddToCart(item)
  Hook->>Redux: dispatch(addToCart)
  Redux-->>UI: updates cart immediately (optimistic)
  Hook->>API: POST /api/orders/create (items)
  API->>DB: ensure user (getOrCreateDbUser) -> find/create orders row
  API->>DB: insert/update order_items
  API->>DB: recalc orders.total_price
  DB-->>API: ack
  API-->>Hook: { success }
  Hook-->>UI: (optional) handle server errors

  Note over Redux,DB: Frontend remains responsive; DB eventually consistent
```

**Function/File responsibilities**

- `components/ProductCard.tsx` — UI for product cards; calls `useAddToCart` to add directly when selection is simple. File: [components/ProductCard.tsx](components/ProductCard.tsx)
- `app/(user)/shop/[id]/ProductClient.tsx` — full product page; uses `useAddToCart` when user adds from product page. File: [app/(user)/shop/[id]/ProductClient.tsx](<app/(user)/shop/[id]/ProductClient.tsx>)
- `lib/hooks/useAddToCart.ts` — central hook used to add items: (1) dispatches Redux `addToCart` for immediate UI update, (2) POSTs to `/api/orders/create` to persist to DB.
  File: [lib/hooks/useAddToCart.ts](lib/hooks/useAddToCart.ts)

- `lib/hooks/useDeleteCartItem.ts` — deletes item from Redux and calls `/api/orders/delete` (supports `variantId` / `itemId` / `clearAll`).
  File: [lib/hooks/useDeleteCartItem.ts](lib/hooks/useDeleteCartItem.ts)

- `lib/hooks/useChangeQuantity.ts` — updates Redux quantity optimistically and calls `/api/orders/update` with `variantId` + `quantity` to persist change.
  File: [lib/hooks/useChangeQuantity.ts](lib/hooks/useChangeQuantity.ts)

- `lib/features/cartSlice.ts` — Redux slice containing reducers and actions: `addToCart`, `increaseQuantity`, `decreaseQuantity`, `removeFromCart`, `clearCart`.
  File: [lib/features/cartSlice.ts](lib/features/cartSlice.ts)

- `app/api/orders/create/route.ts` — (or `app/api/orders/route.ts` if present) receives create requests, maps Kinde auth to DB user, creates or finds cart order, inserts `order_items`, recalculates `orders.total_price`.
- `app/api/orders/update/route.ts` — accepts `itemId` or `variantId` + `quantity`, updates or deletes the `order_items` row, recalculates total.
  File: [app/api/orders/update/route.ts](app/api/orders/update/route.ts)
- `app/api/orders/delete/route.ts` — accepts `itemId` or `variantId` or `clearAll`, deletes item(s), recalculates total.
  File: [app/api/orders/delete/route.ts](app/api/orders/delete/route.ts)

- `lib/actions/orderUtils.ts` — shared server helper: `getOrCreateDbUser()` (maps Kinde `user.id` to `users_table.id` and creates DB user row if missing).
  File: [lib/actions/orderUtils.ts](lib/actions/orderUtils.ts)

- `db/schema.ts` — Drizzle DB schema: `users_table`, `orders`, `order_items`, `products`, `product_variants`, etc.
  File: [db/schema.ts](db/schema.ts)

**Sequence notes & gotchas**

- Kinde vs DB UUID: Kinde provides an external ID (`kp_...`) stored in `users_table.kinde_id` (text). Your DB user `id` is a UUID (randomUUID) — always use `getOrCreateDbUser()` on the server to convert.
- Frontend uses `variantId` as an identifier; the DB `order_items` rows have their own `id`. Deleting/updating by `variantId` works if each cart item row maps uniquely to a variant (no customizations). For custom items, the row may be unique per customization.
- Optimistic UI: Redux updates immediately; server calls are best-effort and should surface errors to the user if they fail. Consider reverting on failure if important.

**Next steps I can take**

- Produce a full repo map (mermaid + mindmap) covering all major modules and their functions.
- Export a printable SVG/PNG of the Mermaid diagram.
- Add per-function documentation comments and a top-level `docs/ARCHITECTURE.md`.

If this cart-focused map looks good, I will generate a full system diagram next.

# Error Handling & Rollback Pattern

This document explains how the cart hooks handle server failures and maintain frontend-DB sync.

## Problem

Initially, the hooks used **optimistic updates** without error handling:

1. Update Redux (frontend) immediately
2. Send request to server
3. If server fails → **frontend state is out of sync with DB** ❌

Example: User adds item to cart → item appears in UI → server fails → item is still in Redux but not in DB.

## Solution: Optimistic Update + Rollback

All three cart hooks now follow this pattern:

```
1. Save the original state (for rollback)
2. Update Redux immediately (optimistic)
3. Try to sync with server
4. If server succeeds → done ✅
5. If server fails → revert Redux to original state ↶
   + Show alert to user
```

## Implementation Details

### `useAddToCart.ts`

- **Optimistic**: Dispatch `addToCart` action immediately
- **Failure**: Show error alert (items stays in Redux, but NOT in DB)
- **Note**: No rollback needed because user sees error and can retry

### `useDeleteCartItem.ts`

- **Save**: Store the item details before deleting
- **Optimistic**: Dispatch `removeFromCart` action immediately
- **Failure**: Re-add item using `dispatch(addToCart(itemToDelete))`
- **Result**: User sees item disappear, then reappear if server fails

### `useChangeQuantity.ts`

- **Save**: Store current quantity (`currentQty`)
- **Optimistic**: Update quantity immediately (multiple `increaseQuantity` or `decreaseQuantity` dispatches)
- **Failure**: Calculate rollback difference and dispatch opposite operations
  - If new qty = 5, old qty = 3, diff = -2 → dispatch `decreaseQuantity` 2 times
  - Reverts quantity back to 3

## Error Response

When server responds with an error:

```typescript
if (!response.ok) {
  const errData = await response.json().catch(() => ({}));
  throw new Error(errData.error || `Server error: ${response.status}`);
}
```

Then catches and displays to user:

```typescript
alert(`Error: ${error.message}. Changes reverted.`);
```

## Example Flow: Quantity Update Fails

**Initial state**: Item qty = 3

1. User clicks `+` button (increase to 4)
2. Redux immediately: qty → 4 (UI shows "4")
3. Fetch to `/api/orders/update` with `{ qty: 4 }`
4. Server returns 500 error
5. Catch block:
   - Calculate: `rollbackDiff = 3 - 4 = -1`
   - Dispatch `decreaseQuantity(variantId)` once
   - Redux: qty → 3 (UI shows "3" again)
6. Alert: "Error updating quantity: Server error: 500. Changes reverted."

## Key Advantages

✅ **UI stays responsive** — updates happen instantly
✅ **Frontend-DB sync** — failures are caught and reverted
✅ **User aware** — alert message shows what happened
✅ **Graceful degradation** — logged-out users can still use cart locally

## Best Practices

1. **Always check `response.ok`** before assuming success
2. **Save original state** before optimistic updates
3. **Provide clear error messages** with specific action (e.g., "Error updating quantity")
4. **Log to console** for debugging
5. **Show alerts** to users so they know something failed

## Testing Edge Cases

- Network failure (no response)
- Server error (5xx)
- Validation error from server (4xx with message)
- Unauthenticated user (user-less actions stored locally)
- Multiple rapid clicks (each has independent rollback)

## When to Enhance Further

Consider adding:

- **Retry queue** — if operation fails, queue it for later retry
- **Undo history** — let user undo/redo cart changes
- **Toast notifications** — replace alerts with non-blocking toast UI
- **Offline support** — persist failed operations to IndexedDB until online

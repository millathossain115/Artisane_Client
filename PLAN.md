# Merge Third-Party Delivery Plan Into `PLAN.md`

## Summary
Update `PLAN.md` from a frontend-only roadmap into a future development context file for both client and server. Preserve the existing roadmap, API list, and stack notes, then add the new RedX/Steadfast/Pathao delivery fulfillment plan as the current source of truth.

## Required `PLAN.md` Changes

- Rename title to:
  `# Artisane Development Roadmap & Memory Context`
- Add a short top section:
  - Client repo: `Artisane_Client`
  - Server repo: sibling `Artisane_Server`
  - Current order/payment flow exists
  - Next major work: third-party delivery fulfillment
- Update customer features:
  - My Orders must show fulfillment tracker: `confirmed -> processing -> shipped -> delivered`
  - Show courier provider, tracking code, tracking link, and delivery issue state when available
- Update admin features:
  - Manage orders must support shipment creation
  - Admin selects courier provider: `redx`, `steadfast`, or `pathao`
  - Admin can manually sync shipment status
  - Scheduled server polling keeps statuses updated

## Fulfillment Context To Add

- New orders start as `confirmed`.
- Admin creates shipment manually after reviewing an order.
- Delivery is handled by third-party platforms:
  - RedX
  - Steadfast
  - Pathao
- Server owns a common shipping adapter layer:
  - `createShipment(order)`
  - `getShipmentStatus(order)`
  - `cancelShipment(order)` where supported
- Server periodically polls courier APIs and maps courier status into Artisane order status.
- Internal order statuses remain:
  `confirmed | processing | shipped | delivered | cancelled`
- Keep `pending` only for backward compatibility with old orders.

## API / Type Contract Updates

Add order shipment fields:

```ts
type CourierProvider = 'redx' | 'steadfast' | 'pathao'

type Order = {
  courierProvider?: CourierProvider
  courierOrderId?: string
  trackingCode?: string
  trackingUrl?: string
  courierStatus?: string
  courierStatusRaw?: unknown
  shipmentCreatedAt?: string
  lastCourierSyncAt?: string
  shippedAt?: string
  deliveredAt?: string
}
```

Add planned endpoints:

```txt
POST /api/v1/orders/:id/shipment        admin
POST /api/v1/orders/:id/shipment/sync   admin
GET  /api/v1/orders/shipping-providers  admin
```

Update env context:

```env
REDX_API_KEY=
REDX_BASE_URL=

STEADFAST_API_KEY=
STEADFAST_SECRET_KEY=
STEADFAST_BASE_URL=

PATHAO_CLIENT_ID=
PATHAO_CLIENT_SECRET=
PATHAO_USERNAME=
PATHAO_PASSWORD=
PATHAO_BASE_URL=
```

## Test Plan Updates

- Customer places COD order; order starts as `confirmed`.
- Admin creates shipment with selected courier.
- Order stores courier provider, tracking code, and tracking URL.
- Courier-created shipment moves order to `processing`.
- Courier pickup/in-transit maps to `shipped`.
- Courier delivered maps to `delivered`.
- Customer My Orders tracker updates from server data.
- Admin manual sync works.
- Missing courier credentials show clear admin error.
- Cancel is blocked once order is shipped.
- Run server `npm run build`.
- Run client `npm run build`.

## Assumptions
- `PLAN.md` should become the durable memory/context file for future helpers.
- Do not remove existing roadmap sections; merge and update them.
- Courier credentials and final production API URLs will come from merchant accounts.
- Reference pages to keep in `PLAN.md`: RedX developer API `https://redx.com.bd/developer-api/`, Steadfast tracking `https://steadfast.com.bd/tracking`, Pathao merchant/tracking `https://merchant.pathao.com/`.

# Artisane Frontend Roadmap

## Summary
Build separate React client: `D:\2026- PROJECTS\ARTISANE\Artisane_Client`.

Use recommended stack: Vite React TypeScript, Redux Toolkit + RTK Query, React Router, Tailwind + shadcn/ui, Zod, React Hook Form, lucide-react. Vite official React TypeScript template supports this path, Redux Toolkit is official standard Redux approach, shadcn has Vite setup docs. ([vite.dev](https://vite.dev/guide/?utm_source=openai)) ([redux-toolkit.js.org](https://redux-toolkit.js.org/introduction/getting-started?utm_source=openai)) ([ui.shadcn.com](https://ui.shadcn.com/docs/installation/vite?utm_source=openai))

Backend fix first: change `GET /api/v1/auth/login` to `POST /api/v1/auth/login`, because login sends JSON body.

## Features
Customer:
- Home, product listing, product details, category filter, price filter, search, sort.
- Register, login, logout, profile.
- Cart in Redux + localStorage.
- Checkout: create order from cart.
- My orders, cancel order when allowed.
- Product reviews: create, update, delete own review.

Admin:
- Dashboard stats.
- Manage categories: create, read, update, delete.
- Manage products: create, read, update, delete.
- Manage users: list, create, view, delete.
- Manage orders: list, view, update status, delete.
- Manage reviews: list, delete.

UX:
- Responsive layout.
- Loading skeletons.
- Empty states.
- Toasts for success/error.
- Protected routes by role.
- Form validation before API call.
- Central API error handling.

## Folder Structure
```text
Artisane_Client/
  src/
    app/
      store.ts
      hooks.ts
      router.tsx
    assets/
    components/
      common/
      forms/
      layout/
      ui/
    config/
      env.ts
      routes.ts
    features/
      auth/
        authApi.ts
        authSlice.ts
        auth.types.ts
      products/
        productApi.ts
        product.types.ts
      categories/
        categoryApi.ts
        category.types.ts
      cart/
        cartSlice.ts
        cart.types.ts
      orders/
        orderApi.ts
        order.types.ts
      reviews/
        reviewApi.ts
        review.types.ts
      users/
        userApi.ts
        user.types.ts
      dashboard/
        dashboardApi.ts
        dashboard.types.ts
    hooks/
    lib/
      api.ts
      cn.ts
      storage.ts
      validators.ts
    pages/
      public/
      auth/
      customer/
      admin/
    providers/
      AppProvider.tsx
    styles/
      index.css
    types/
      api.types.ts
      common.types.ts
    main.tsx
```

## Step-by-Step Build Plan
1. Backend readiness:
   - Fix login route to `POST`.
   - Confirm CORS allows client origin.
   - Confirm all APIs pass in Postman.
   - Add `.env.example` later if missing.

2. Client setup:
   - Create Vite React TS app.
   - Add Tailwind + shadcn/ui.
   - Add Redux Toolkit, React Redux, React Router, React Hook Form, Zod.
   - Add `.env` with `VITE_API_BASE_URL=http://localhost:5000/api/v1`.

3. App foundation:
   - Configure router.
   - Configure Redux store.
   - Configure RTK Query base API with `Authorization: Bearer <token>`.
   - Add `authSlice` storing user + accessToken in Redux and localStorage.
   - Add `ProtectedRoute` and `RoleRoute`.

4. Public pages:
   - Home page with categories and featured products.
   - Product list with query params: `page`, `limit`, `searchTerm`, `category`, `minPrice`, `maxPrice`, `sortBy`, `sortOrder`.
   - Product details with reviews.
   - Login/register pages.

5. Customer flow:
   - Cart add/update/remove/clear.
   - Checkout page creates order.
   - My orders page.
   - Cancel order action.
   - Review create/update/delete.

6. Admin flow:
   - Admin layout with sidebar.
   - Dashboard stats page.
   - Products CRUD.
   - Categories CRUD.
   - Users management.
   - Orders management.
   - Reviews management.

7. Polish:
   - Skeleton loading.
   - Error boundaries.
   - Toast messages.
   - Confirm dialogs for delete/cancel.
   - Pagination component.
   - Reusable table component.
   - Mobile nav.

## API/Type Contracts
- Use backend response wrapper:
```ts
type ApiResponse<T> = {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  errorSources?: { path: string; message: string }[];
};
```

- Auth token source:
```text
response.data.accessToken
```

- Auth header:
```text
Authorization: Bearer <accessToken>
```

- Role values:
```ts
type UserRole = "admin" | "user";
```

- Order status values:
```ts
type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";
```

## Test Plan
- Build: `npm run build`.
- Lint: `npm run lint`.
- Manual browser tests:
  - Register/login/logout.
  - Reload page keeps user logged in.
  - User cannot open admin routes.
  - Product filters update URL and data.
  - Cart survives reload.
  - Checkout creates order and reduces stock.
  - User can view my orders.
  - Admin can create/update/delete category/product.
  - Admin can update order status.
  - API errors show clean toast messages.

## Assumptions
- First version uses `Redux + localStorage` token storage because backend returns JWT in JSON and has no cookie refresh flow yet.
- First version builds full customer + admin app.
- UI stack: Tailwind + shadcn/ui.
- Client stays separate from server repo as `Artisane_Client`.
- Payments, image upload, wishlist, coupons, and refresh-token flow are v2 after core app works.

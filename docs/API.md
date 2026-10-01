# API

- GET/POST /api/session — current identity / select demo identity
- GET /api/products — active catalog
- POST /api/orders — checkout (customer)
- GET /api/orders — customer's own orders
- GET /api/admin/dashboard — overview (staff/admin)
- GET /api/admin/products — catalog and inventory history (staff/admin)
- POST/PATCH /api/admin/products[/id] — product editing (admin)
- GET /api/admin/orders — all orders (staff/admin)
- PATCH /api/admin/orders/:id — status transition (staff/admin)
- GET/POST /api/admin/employees — team list / create (admin)
- PATCH /api/admin/employees/:id — change staff/admin role (admin)

Mutation requests use JSON. Error responses are {error: string} with appropriate HTTP status. Cookies use HttpOnly and SameSite=Strict. IDs and amounts are integers. Currency fields ending in \_cents use satang.

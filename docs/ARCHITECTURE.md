# Commerce architecture

Browser pages → JSON API routes → validation / service → repository → SQLite.

Checkout holds BEGIN IMMEDIATE while validating stock, computing prices from products, inserting order lines, decrementing inventory and recording movements. A failed line rolls back the whole order. Price and totals from the browser are ignored. Duplicate product IDs are rejected.

State machine: placed → packing → shipped → returned. placed/packing → cancelled. Terminal states cannot be repeated, preventing duplicate stock restoration. Revenue excludes cancelled/returned orders. Return is all items, not partial.

Customer can create and view their orders. Staff can read stock and process all orders. Admin can additionally create/edit products and employees. Every protected API checks current role loaded from DB. Demo session selection is not real authentication.

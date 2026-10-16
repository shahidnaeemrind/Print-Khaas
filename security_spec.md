# Security Specification: Print Khaas Firestore Rules

## 1. Data Invariants
- **Products Catalog**:
  - Public unauthenticated visitors can only `read` (get/list) products where `status == 'published'`.
  - Non-published products (`status == 'draft'`) can only be read by authorized administrators.
  - Only authenticated administrators (`isAdmin()`) can create, update, or delete products.
  - Authorized administrators include verified users with email `shahidnaeemrind@gmail.com` (bootstrapped admin) or users whose UID exists in `/admins/{uid}`.
  - Any product document must pass strict `isValidProduct()` validation on create and update.
  - Product IDs must pass `isValidId(productId)`.
  - Immutable fields: `createdAt` cannot be altered after creation.
- **Settings Collection**:
  - Public visitors can `read` company settings (to display current WhatsApp number, address, tagline, etc.).
  - Only administrators can create or update company settings.
- **Admins Collection**:
  - Only existing administrators can read or manage `/admins/{uid}`.

## 2. The "Dirty Dozen" Threat Payloads
1. **Unauthenticated Write**: An unauthenticated attacker attempts to create a product document in `/products/malicious-book`. (Expected: PERMISSION_DENIED)
2. **Draft Snooping**: An unauthenticated public user queries `/products` where `status == 'draft'`. (Expected: PERMISSION_DENIED)
3. **Ghost Field Poisoning**: An attacker sends a product with undeclared root properties like `backdoor_admin: true`. (Expected: PERMISSION_DENIED)
4. **Giant ID Attack**: An attacker attempts to write with a document ID exceeding 128 characters or containing illegal symbols. (Expected: PERMISSION_DENIED)
5. **Denial of Wallet String Bomb**: An attacker tries to write a 1MB string in `title` or `shortDescription`. (Expected: PERMISSION_DENIED)
6. **Email Spoofing (Unverified Token)**: An attacker creates an account with email `shahidnaeemrind@gmail.com` but with `email_verified == false` and attempts to publish a product. (Expected: PERMISSION_DENIED)
7. **Tampering with Immortal Timestamps**: An update modifies `createdAt` to a historical or future timestamp. (Expected: PERMISSION_DENIED)
8. **Invalid Enum Bypass**: An attacker sets `productType` to `magazine` or `stockStatus` to `hacked`. (Expected: PERMISSION_DENIED)
9. **Self-Promotion to Admin**: A regular user attempts to write their own UID document to `/admins/{uid}`. (Expected: PERMISSION_DENIED)
10. **Settings Hijack**: An unauthenticated user attempts to overwrite the official WhatsApp number in `/settings/company`. (Expected: PERMISSION_DENIED)
11. **Negative Price Injection**: An attacker attempts to submit a negative number for `parentPrice` or `schoolPrice`. (Expected: PERMISSION_DENIED)
12. **Unauthorized Deletion**: An unauthenticated user attempts to delete `/products/{productId}`. (Expected: PERMISSION_DENIED)

## 3. Security Assertions
- `isValidId(id)` checks length `<= 128` and regex `^[a-zA-Z0-9_\-]+$`.
- Admin check mandates `request.auth != null` and verified email or admin collection membership.
- Strict property key checking via `hasAll` and `hasOnly`.

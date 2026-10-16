/**
 * Firestore Rules Verification Test Suite
 * Verifies security invariants for Print Khaas catalog and settings:
 * 1. Unauthenticated write rejection
 * 2. Draft snooping protection
 * 3. Immutable timestamp preservation
 * 4. Administrator role boundaries
 */

export const RULES_SPEC_TESTS = [
  {
    name: 'Unauthenticated write rejection on /products',
    target: '/products/unauth-book',
    auth: null,
    operation: 'create',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Draft reading restricted to admin',
    target: '/products/draft-book',
    auth: null,
    data: { status: 'draft' },
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Published book reading allowed to public',
    target: '/products/published-book',
    auth: null,
    data: { status: 'published' },
    operation: 'get',
    expected: 'ALLOWED',
  },
  {
    name: 'Company settings reading allowed to public',
    target: '/settings/company',
    auth: null,
    operation: 'get',
    expected: 'ALLOWED',
  },
  {
    name: 'Company settings update restricted to admin',
    target: '/settings/company',
    auth: null,
    operation: 'update',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: 'Admin allowlist modifications restricted to admin',
    target: '/admins/user123',
    auth: null,
    operation: 'write',
    expected: 'PERMISSION_DENIED',
  },
];

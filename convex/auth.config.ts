/**
 * Authentication Configuration
 * 
 * We use Clerk for authentication and authorization.
 * Convex queries/mutations use ctx.auth.getUserIdentity() to get the Clerk user.
 * 
 * Clerk tokens are automatically passed by the ConvexProvider when ClerkProvider wraps it.
 */

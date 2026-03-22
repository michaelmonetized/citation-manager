import { QueryCtx } from "./_generated/server";

export const getAuthUserId = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return identity.subject;
};

export const getAuthUser = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  return {
    id: identity.subject,
    email: identity.email,
    name: identity.name,
  };
};

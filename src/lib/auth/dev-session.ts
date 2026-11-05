import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const DEV_AUTH_EMAIL = process.env.DEV_AUTH_EMAIL ?? "dev@nimora.local";

export const isDevAuthEnabled = () =>
  process.env.NODE_ENV !== "production"
  && process.env.DEV_AUTH_BYPASS === "true"
  && isLocalSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)
  && isConfiguredValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)
  && isConfiguredValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
  && isConfiguredValue(process.env.DEV_AUTH_PASSWORD);

export const DEV_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: DEV_AUTH_EMAIL,
};

function isLocalSupabaseUrl(value: string | undefined) {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:"
      && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
      && url.port === "54321";
  } catch {
    return false;
  }
}

function isConfiguredValue(value: string | undefined) {
  return Boolean(value?.trim() && !value.trim().startsWith("replace-with-"));
}

export function getDevAuthPassword() {
  const password = process.env.DEV_AUTH_PASSWORD;
  if (!password || password.trim().length === 0) {
    throw new Error("Development auth requires DEV_AUTH_PASSWORD to be set in the local environment.");
  }

  return password;
}

export function matchesDevLogin(email: string, password: string) {
  if (!isDevAuthEnabled()) return false;
  return email.trim().toLowerCase() === DEV_AUTH_EMAIL.toLowerCase() && password === getDevAuthPassword();
}

export async function ensureDevelopmentUser() {
  if (!isDevAuthEnabled()) return null;
  if (!isLocalSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL)) {
    throw new Error("Development auth is only available with a local Supabase instance.");
  }

  const { url } = getSupabaseEnv();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("Development auth requires SUPABASE_SERVICE_ROLE_KEY to be set on the server.");
  }

  const admin = createSupabaseAdminClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });

  const password = getDevAuthPassword();
  const { data: existingUsers, error: listError } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    throw new Error(`Could not inspect development users: ${listError.message}`);
  }

  const existingUser = existingUsers.users.find(
    (user) => user.email?.toLowerCase() === DEV_AUTH_EMAIL.toLowerCase(),
  );

  if (existingUser) {
    const { error: updateError } = await admin.auth.admin.updateUserById(existingUser.id, {
      password,
      email_confirm: true,
      user_metadata: {
        full_name: "Development User",
      },
    });

    if (updateError) {
      throw new Error(`Could not refresh the development account: ${updateError.message}`);
    }

    return existingUser.id;
  }

  const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
    email: DEV_AUTH_EMAIL,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Development User" },
  });

  if (createError) {
    throw new Error(`Could not create the development account: ${createError.message}`);
  }

  return createdUser.user?.id ?? null;
}

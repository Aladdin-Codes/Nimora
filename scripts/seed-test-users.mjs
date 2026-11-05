import { createClient } from "@supabase/supabase-js";

const ACCOUNT_DEFINITIONS = [
  { key: "owner", email: "owner@example.com", fullName: "Jordan Morgan" },
  { key: "parent", email: "parent@example.com", fullName: "Taylor Morgan" },
  { key: "caregiver", email: "caregiver@example.com", fullName: "Casey Morgan" },
  { key: "family2", email: "family2@example.com", fullName: "Avery Bennett" },
];

const HOUSEHOLDS = {
  a: {
    id: "10000000-0000-4000-8000-000000000001",
    name: "Synthetic development household A",
    owner: "owner",
    members: [
      { account: "owner", role: "owner" },
      { account: "parent", role: "parent" },
      { account: "caregiver", role: "caregiver" },
    ],
  },
  b: {
    id: "10000000-0000-4000-8000-000000000002",
    name: "Synthetic development household B",
    owner: "family2",
    members: [{ account: "family2", role: "owner" }],
  },
};

const CHILDREN = [
  {
    key: "childA1",
    id: "20000000-0000-4000-8000-000000000001",
    household: "a",
    firstName: "Mira",
    lastName: "Morgan",
    preferredName: "Mimi",
    birthDate: "2018-04-12",
  },
  {
    key: "childA2",
    id: "20000000-0000-4000-8000-000000000002",
    household: "a",
    firstName: "Noah",
    lastName: "Morgan",
    preferredName: null,
    birthDate: "2021-09-03",
  },
  {
    key: "childB1",
    id: "20000000-0000-4000-8000-000000000003",
    household: "b",
    firstName: "Zuri",
    lastName: "Bennett",
    preferredName: null,
    birthDate: "2019-02-25",
  },
];

const VACCINATIONS = [
  ["30000000-0000-4000-8000-000000000001", "childA1", "Synthetic vaccine example A", "Synthetic dose entry 1", "2018-05-12"],
  ["30000000-0000-4000-8000-000000000002", "childA2", "Synthetic vaccine example B", "Synthetic dose entry 1", "2021-10-03"],
  ["30000000-0000-4000-8000-000000000003", "childB1", "Synthetic vaccine example C", "Synthetic dose entry 1", "2019-03-25"],
].map(([id, childKey, vaccineName, doseLabel, administeredOn]) => ({
  id,
  child_id: CHILDREN.find((child) => child.key === childKey).id,
  vaccine_name: vaccineName,
  dose_label: doseLabel,
  administered_on: administeredOn,
  notes: "Synthetic development data only. Not a real vaccination record or medical guidance.",
  is_synthetic: true,
}));

const GROWTH_MEASUREMENTS = [
  ["40000000-0000-4000-8000-000000000001", "childA1", "2026-06-10", 25.4, 124.2],
  ["40000000-0000-4000-8000-000000000002", "childA2", "2026-06-12", 17.1, 103.6],
  ["40000000-0000-4000-8000-000000000003", "childB1", "2026-06-15", 22.8, 118.4],
].map(([id, childKey, measuredOn, weightKg, heightCm]) => ({
  id,
  child_id: CHILDREN.find((child) => child.key === childKey).id,
  measured_on: measuredOn,
  weight_kg: weightKg,
  height_cm: heightCm,
  notes: "Synthetic development measurement; not for clinical use.",
  is_synthetic: true,
}));

const HEALTH_TIMELINE_EVENTS = [
  ["50000000-0000-4000-8000-000000000001", "childA1", "Synthetic check-in entry", "2026-06-10T09:00:00.000Z"],
  ["50000000-0000-4000-8000-000000000002", "childA2", "Synthetic wellness-note placeholder", "2026-06-12T10:30:00.000Z"],
  ["50000000-0000-4000-8000-000000000003", "childB1", "Synthetic timeline example", "2026-06-15T11:00:00.000Z"],
].map(([id, childKey, title, occurredAt]) => ({
  id,
  child_id: CHILDREN.find((child) => child.key === childKey).id,
  event_type: "synthetic_development",
  title,
  details: "This timeline item is fictional development data and contains no clinical advice.",
  occurred_at: occurredAt,
  is_synthetic: true,
}));

const APPOINTMENTS = [
  ["60000000-0000-4000-8000-000000000001", "childA1", "Synthetic visit placeholder A", 14],
  ["60000000-0000-4000-8000-000000000002", "childA2", "Synthetic visit placeholder B", 21],
  ["60000000-0000-4000-8000-000000000003", "childB1", "Synthetic visit placeholder C", 30],
].map(([id, childKey, title, daysAhead]) => ({
  id,
  child_id: CHILDREN.find((child) => child.key === childKey).id,
  title,
  provider_name: "Example Community Clinic",
  scheduled_at: new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000).toISOString(),
  status: "scheduled",
  notes: "Fictional development appointment; not a medical recommendation.",
  is_synthetic: true,
}));

const MEDICAL_DOCUMENTS = CHILDREN.map((child, index) => ({
  id: `70000000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
  child_id: child.id,
  document_name: `synthetic-development-record-${String.fromCharCode(97 + index)}.pdf`,
  mime_type: "application/pdf",
  storage_path: `development-only/${child.id}/synthetic-record.pdf`,
  description: "Metadata placeholder only; no medical file is stored.",
  is_synthetic: true,
}));

const NOTIFICATION_DEFINITIONS = [
  { id: "80000000-0000-4000-8000-000000000001", account: "owner", child: "childA1" },
  { id: "80000000-0000-4000-8000-000000000002", account: "parent", child: "childA2" },
  { id: "80000000-0000-4000-8000-000000000003", account: "caregiver", child: "childA1" },
  { id: "80000000-0000-4000-8000-000000000004", account: "family2", child: "childB1" },
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function failIfError(operation, error) {
  if (error) {
    const code = error.code ?? error.status ?? "unknown";
    throw new Error(`${operation} failed (${code}).`);
  }
}

function getTargetEnvironment() {
  const urlValue = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const password = process.env.SEED_TEST_PASSWORD;

  assert(process.env.NODE_ENV !== "production", "Refusing to seed when NODE_ENV is production.");
  assert(process.env.SEED_ENVIRONMENT === "development", "Set SEED_ENVIRONMENT=development to enable test seeding.");
  assert(urlValue && publishableKey && serviceRoleKey, "Supabase URL, publishable key, and server-only service-role key are required.");
  assert(password && password.length >= 12, "Set SEED_TEST_PASSWORD to a private password of at least 12 characters.");

  let url;
  try {
    url = new URL(urlValue);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL.");
  }

  const isLocal = url.protocol === "http:"
    && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    && url.port === "54321";
  if (!isLocal) {
    const match = url.hostname.match(/^([a-z0-9-]+)\.supabase\.co$/i);
    const allowedRef = process.env.SEED_ALLOWED_PROJECT_REF;
    assert(
      process.env.SEED_ALLOW_REMOTE_DEV === "true"
        && url.protocol === "https:"
        && match
        && allowedRef
        && match[1] === allowedRef,
      "Refusing non-local Supabase. Remote development seeding requires an explicit matching project-ref allowlist.",
    );
  }

  return { url: urlValue, publishableKey, serviceRoleKey, password };
}

async function getAllUsers(admin) {
  const users = [];
  for (let page = 1; ; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    failIfError("Listing existing authentication users", error);
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return users;
}

async function ensureAuthUsers(admin, password) {
  const existingUsers = await getAllUsers(admin);
  const usersByEmail = new Map(
    existingUsers
      .filter((user) => user.email)
      .map((user) => [user.email.toLowerCase(), user]),
  );
  const accounts = {};

  for (const definition of ACCOUNT_DEFINITIONS) {
    const existing = usersByEmail.get(definition.email);
    if (existing) {
      const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: true,
        user_metadata: { full_name: definition.fullName },
      });
      failIfError("Refreshing an existing development authentication user", error);
      accounts[definition.key] = data.user;
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email: definition.email,
        password,
        email_confirm: true,
        user_metadata: { full_name: definition.fullName },
      });
      failIfError("Creating a development authentication user", error);
      accounts[definition.key] = data.user;
    }
  }

  return accounts;
}

async function upsertRows(admin, table, rows, conflict = "id") {
  if (rows.length === 0) return;
  const { error } = await admin.from(table).upsert(rows, { onConflict: conflict });
  failIfError(`Seeding ${table}`, error);
}

async function seedData(admin, accounts) {
  const profiles = ACCOUNT_DEFINITIONS.map(({ key, fullName }) => ({
    id: accounts[key].id,
    full_name: fullName,
  }));
  await upsertRows(admin, "profiles", profiles);

  const households = Object.values(HOUSEHOLDS).map((household) => ({
    id: household.id,
    name: household.name,
    created_by: accounts[household.owner].id,
    is_synthetic: true,
  }));
  await upsertRows(admin, "households", households);

  const memberships = Object.values(HOUSEHOLDS).flatMap((household) =>
    household.members.map(({ account, role }) => ({
      household_id: household.id,
      user_id: accounts[account].id,
      role,
      added_by: accounts[household.owner].id,
    })),
  );
  await upsertRows(admin, "household_memberships", memberships, "household_id,user_id");

  const children = CHILDREN.map((child) => ({
    id: child.id,
    owner_id: accounts[HOUSEHOLDS[child.household].owner].id,
    household_id: HOUSEHOLDS[child.household].id,
    first_name: child.firstName,
    last_name: child.lastName,
    preferred_name: child.preferredName,
    birth_date: child.birthDate,
    is_synthetic: true,
  }));
  await upsertRows(admin, "children", children);

  const notifications = NOTIFICATION_DEFINITIONS.map(({ id, account, child }) => ({
    id,
    user_id: accounts[account].id,
    child_id: CHILDREN.find((entry) => entry.key === child).id,
    title: "Synthetic development notification",
    message: "This is a fictional notification used for local development and QA.",
    is_synthetic: true,
  }));

  await upsertRows(admin, "vaccination_records", VACCINATIONS);
  await upsertRows(admin, "growth_measurements", GROWTH_MEASUREMENTS);
  await upsertRows(admin, "health_timeline_events", HEALTH_TIMELINE_EVENTS);
  await upsertRows(admin, "appointments", APPOINTMENTS);
  await upsertRows(admin, "medical_documents", MEDICAL_DOCUMENTS);
  await upsertRows(admin, "notifications", notifications);
}

function createUserClient(url, anonKey) {
  return createClient(url, anonKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });
}

async function visibleRow(client, table, id, columns = "id") {
  const { data, error } = await client.from(table).select(columns).eq("id", id).maybeSingle();
  failIfError(`Checking access to ${table}`, error);
  return data;
}

function assertDenied(result, label) {
  if (result.error) {
    assert(result.error.code === "42501", `${label} returned an unexpected database error.`);
    return;
  }
  assert(result.data?.length === 0, `${label} unexpectedly succeeded.`);
}

async function expectVisible(client, table, id, expected, label) {
  const row = await visibleRow(client, table, id);
  assert(Boolean(row) === expected, `${label} access check failed.`);
}

async function signInAccounts(url, publishableKey, password, accounts) {
  const clients = {};
  for (const definition of ACCOUNT_DEFINITIONS) {
    const client = createUserClient(url, publishableKey);
    const { data, error } = await client.auth.signInWithPassword({
      email: definition.email,
      password,
    });
    failIfError("Authenticating a development test account", error);
    assert(data.user?.id === accounts[definition.key].id, "An authenticated account did not match its stored profile.");
    clients[definition.key] = client;
  }
  return clients;
}

async function checkRls(admin, url, publishableKey, password, accounts) {
  const clients = await signInAccounts(url, publishableKey, password, accounts);
  const householdAChildren = CHILDREN.filter((child) => child.household === "a");
  const childA = householdAChildren[0];
  const childB = CHILDREN.find((child) => child.household === "b");
  const householdA = HOUSEHOLDS.a.id;
  const householdB = HOUSEHOLDS.b.id;

  for (const account of ["owner", "parent", "caregiver"]) {
    const client = clients[account];
    await expectVisible(client, "households", householdA, true, `${account} household A`);
    await expectVisible(client, "households", householdB, false, `${account} household B isolation`);
    for (const child of householdAChildren) {
      await expectVisible(client, "children", child.id, true, `${account} household A child`);
    }
    await expectVisible(client, "children", childB.id, false, `${account} household B isolation`);
    await expectVisible(client, "vaccination_records", VACCINATIONS.find((record) => record.child_id === childA.id).id, true, `${account} household A health record`);
    await expectVisible(client, "vaccination_records", VACCINATIONS.find((record) => record.child_id === childB.id).id, false, `${account} household B health-record isolation`);

    const { data: membership, error } = await client
      .from("household_memberships")
      .select("role")
      .eq("household_id", householdA)
      .eq("user_id", accounts[account].id)
      .maybeSingle();
    failIfError("Checking household membership role", error);
    const expectedRole = HOUSEHOLDS.a.members.find((member) => member.account === account).role;
    assert(membership?.role === expectedRole, `${account} household role was not seeded correctly.`);
  }

  const family2Client = clients.family2;
  await expectVisible(family2Client, "households", householdB, true, "Household B owner");
  await expectVisible(family2Client, "households", householdA, false, "Household B isolation");
  await expectVisible(family2Client, "children", childB.id, true, "Household B child");
  await expectVisible(family2Client, "children", childA.id, false, "Household B child isolation");
  await expectVisible(
    family2Client,
    "vaccination_records",
    VACCINATIONS.find((record) => record.child_id === childB.id).id,
    true,
    "Household B health record",
  );
  const { data: family2Membership, error: family2MembershipError } = await family2Client
    .from("household_memberships")
    .select("role")
    .eq("household_id", householdB)
    .eq("user_id", accounts.family2.id)
    .maybeSingle();
  failIfError("Checking Household B owner membership", family2MembershipError);
  assert(family2Membership?.role === "owner", "The separate household owner role was not seeded correctly.");

  const crossHouseholdMove = await clients.owner
    .from("children")
    .update({ household_id: householdB })
    .eq("id", childA.id)
    .select("id");
  assertDenied(crossHouseholdMove, "Cross-household child reassignment");

  const parentClient = clients.parent;
  const parentWrite = await parentClient
    .from("health_timeline_events")
    .update({ title: "Synthetic check-in entry" })
    .eq("id", HEALTH_TIMELINE_EVENTS[0].id)
    .select("id");
  failIfError("Checking parent record permissions", parentWrite.error);
  assert(parentWrite.data?.length === 1, "Authorized parent could not update a household health record.");

  const caregiverWrite = await clients.caregiver
    .from("health_timeline_events")
    .update({ title: "Unauthorized development edit" })
    .eq("id", HEALTH_TIMELINE_EVENTS[0].id)
    .select("id");
  assertDenied(caregiverWrite, "Caregiver health-record update");
  const unchangedEvent = await visibleRow(clients.owner, "health_timeline_events", HEALTH_TIMELINE_EVENTS[0].id, "id,title");
  assert(unchangedEvent?.title === "Synthetic check-in entry", "A denied caregiver update changed a health record.");

  const anonymousClient = createUserClient(url, publishableKey);
  const anonymousRead = await anonymousClient
    .from("children")
    .select("id")
    .eq("id", childA.id);
  assertDenied(anonymousRead, "Anonymous child-profile read");
  const anonymousHealthRead = await anonymousClient
    .from("vaccination_records")
    .select("id")
    .eq("id", VACCINATIONS[0].id);
  assertDenied(anonymousHealthRead, "Anonymous health-record read");

  const caregiverId = accounts.caregiver.id;
  const selfGrant = await clients.caregiver
    .from("household_memberships")
    .insert({
      household_id: householdB,
      user_id: caregiverId,
      role: "owner",
      added_by: caregiverId,
    })
    .select("user_id");
  assertDenied(selfGrant, "Self-granted household membership");

  const selfElevation = await clients.caregiver
    .from("household_memberships")
    .update({ role: "owner" })
    .eq("household_id", householdA)
    .eq("user_id", caregiverId)
    .select("role");
  assertDenied(selfElevation, "Self-elevated household role");

  const { data: unchangedMembership, error: membershipError } = await clients.caregiver
    .from("household_memberships")
    .select("role")
    .eq("household_id", householdA)
    .eq("user_id", caregiverId)
    .maybeSingle();
  failIfError("Verifying role elevation protection", membershipError);
  assert(unchangedMembership?.role === "caregiver", "A denied role elevation changed the membership.");

  const { data: syntheticChildren, error: childrenError } = await admin
    .from("children")
    .select("id, owner_id, household_id, is_synthetic")
    .in("id", CHILDREN.map((child) => child.id));
  failIfError("Verifying seeded child ownership", childrenError);
  assert(syntheticChildren?.length === CHILDREN.length, "A seeded child profile is missing or duplicated.");
  for (const child of CHILDREN) {
    const row = syntheticChildren.find((candidate) => candidate.id === child.id);
    assert(
      row?.owner_id === accounts[HOUSEHOLDS[child.household].owner].id
        && row.household_id === HOUSEHOLDS[child.household].id
        && row.is_synthetic,
      "A seeded child is associated with the wrong owner or household.",
    );
  }

  const { data: profiles, error: profilesError } = await admin
    .from("profiles")
    .select("id, full_name")
    .in("id", ACCOUNT_DEFINITIONS.map(({ key }) => accounts[key].id));
  failIfError("Verifying authentication profiles", profilesError);
  assert(profiles?.length === ACCOUNT_DEFINITIONS.length, "One or more authentication profiles are missing.");
  for (const { key, fullName } of ACCOUNT_DEFINITIONS) {
    assert(
      profiles.find((profile) => profile.id === accounts[key].id)?.full_name === fullName,
      "A development auth user is associated with the wrong profile.",
    );
  }

  const fixtureIds = {
    vaccination_records: VACCINATIONS.map(({ id }) => id),
    growth_measurements: GROWTH_MEASUREMENTS.map(({ id }) => id),
    health_timeline_events: HEALTH_TIMELINE_EVENTS.map(({ id }) => id),
    appointments: APPOINTMENTS.map(({ id }) => id),
    medical_documents: MEDICAL_DOCUMENTS.map(({ id }) => id),
    notifications: NOTIFICATION_DEFINITIONS.map(({ id }) => id),
  };
  for (const [table, ids] of Object.entries(fixtureIds)) {
    const { data, error } = await admin.from(table).select("id, is_synthetic").in("id", ids);
    failIfError(`Verifying ${table} fixtures`, error);
    assert(data?.length === ids.length && data.every((row) => row.is_synthetic), `${table} synthetic fixtures are incomplete.`);
  }
  const { data: notifications, error: notificationError } = await admin
    .from("notifications")
    .select("id, user_id, child_id")
    .in("id", NOTIFICATION_DEFINITIONS.map(({ id }) => id));
  failIfError("Verifying notification recipients", notificationError);
  for (const definition of NOTIFICATION_DEFINITIONS) {
    const notification = notifications.find((row) => row.id === definition.id);
    assert(
      notification?.user_id === accounts[definition.account].id
        && notification.child_id === CHILDREN.find((child) => child.key === definition.child).id,
      "A synthetic notification is associated with the wrong user or child.",
    );
  }

  console.info("Verified four confirmed authentication users and their profiles.");
  console.info("Verified household membership, household separation, and synthetic child ownership.");
  console.info("Verified parent/caregiver access, anonymous denial, and self-elevation protection.");
  console.info("Verified synthetic health data is accessible only within its household.");
}

async function main() {
  const { url, publishableKey, serviceRoleKey, password } = getTargetEnvironment();
  const admin = createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  });

  const accounts = await ensureAuthUsers(admin, password);
  console.info("Created or refreshed four email-confirmed development test accounts.");
  await seedData(admin, accounts);
  console.info("Upserted synthetic household and health-record fixtures.");
  await checkRls(admin, url, publishableKey, password, accounts);
  console.info("Development seed and authorization checks completed successfully.");
}

main().catch((error) => {
  console.error(`Development seed failed: ${error.message}`);
  process.exitCode = 1;
});

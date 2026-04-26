import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase";

export type DogRegistryRow = {
  id: string;
  callName: string;
  registeredName: string | null;
  role: string;
  status: string;
  sex: string | null;
  dateOfBirth: string | null;
  color: string | null;
  coat: string | null;
  registry: string | null;
  bloodline: string | null;
  breedingEligibility: string | null;
  provenStatus: string | null;
  photoUrl: string | null;
  notes: string | null;
  createdAt: string;
};

export type DogsRegistryData = {
  organizationId: string | null;
  organizationName: string;
  dogs: DogRegistryRow[];
  stats: {
    total: number;
    activeSires: number;
    activeDams: number;
    puppies: number;
    retired: number;
    eligible: number;
  };
};

const EMPTY_DOGS_DATA: DogsRegistryData = {
  organizationId: null,
  organizationName: "Your breeding program",
  dogs: [],
  stats: {
    total: 0,
    activeSires: 0,
    activeDams: 0,
    puppies: 0,
    retired: 0,
    eligible: 0,
  },
};

type AdminClient = NonNullable<ReturnType<typeof createSupabaseAdminClient>>;

type DogRow = {
  id: string;
  call_name: string | null;
  registered_name: string | null;
  role: string | null;
  status: string | null;
  sex: string | null;
  date_of_birth: string | null;
  color: string | null;
  coat: string | null;
  registry: string | null;
  bloodline: string | null;
  breeding_eligibility: string | null;
  proven_status: string | null;
  photo_url: string | null;
  notes: string | null;
  created_at: string;
};

export async function getDogsRegistryData(): Promise<DogsRegistryData> {
  const server = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!server || !admin) {
    return EMPTY_DOGS_DATA;
  }

  const { data: userData } = await server.auth.getUser();
  const user = userData.user;

  if (!user) {
    return EMPTY_DOGS_DATA;
  }

  const organization = await findOrganizationForUser(admin, user.id, user.email ?? null);

  if (!organization) {
    return EMPTY_DOGS_DATA;
  }

  const { data } = await admin
    .from("breeding_dogs")
    .select("id,call_name,registered_name,role,status,sex,date_of_birth,color,coat,registry,bloodline,breeding_eligibility,proven_status,photo_url,notes,created_at")
    .eq("organization_id", organization.id)
    .order("call_name", { ascending: true })
    .returns<DogRow[]>();

  const dogs = (data ?? []).map(mapDog);

  return {
    organizationId: organization.id,
    organizationName: organization.name,
    dogs,
    stats: buildStats(dogs),
  };
}

export async function getCurrentOrganizationId() {
  const server = await createSupabaseServerClient();
  const admin = createSupabaseAdminClient();

  if (!server || !admin) {
    return null;
  }

  const { data: userData } = await server.auth.getUser();
  const user = userData.user;

  if (!user) {
    return null;
  }

  const organization = await findOrganizationForUser(admin, user.id, user.email ?? null);
  return organization?.id ?? null;
}

async function findOrganizationForUser(admin: AdminClient, userId: string, email: string | null) {
  const { data: membership } = await admin
    .from("organization_users")
    .select("organization_id, organizations(id,name)")
    .eq("auth_user_id", userId)
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();

  const memberOrganization = Array.isArray(membership?.organizations)
    ? membership?.organizations[0]
    : membership?.organizations;

  if (memberOrganization) {
    return memberOrganization as { id: string; name: string };
  }

  if (!email) {
    return null;
  }

  const { data: organization } = await admin
    .from("organizations")
    .select("id,name")
    .eq("email", email)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return organization;
}

function mapDog(row: DogRow): DogRegistryRow {
  return {
    id: row.id,
    callName: row.call_name ?? "Unnamed dog",
    registeredName: row.registered_name,
    role: row.role ?? "breeding_dog",
    status: row.status ?? "active",
    sex: row.sex,
    dateOfBirth: row.date_of_birth,
    color: row.color,
    coat: row.coat,
    registry: row.registry,
    bloodline: row.bloodline,
    breedingEligibility: row.breeding_eligibility,
    provenStatus: row.proven_status,
    photoUrl: row.photo_url,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

function buildStats(dogs: DogRegistryRow[]) {
  return {
    total: dogs.length,
    activeSires: dogs.filter((dog) => dog.sex?.toLowerCase() === "male" && dog.status?.toLowerCase() === "active").length,
    activeDams: dogs.filter((dog) => dog.sex?.toLowerCase() === "female" && dog.status?.toLowerCase() === "active").length,
    puppies: dogs.filter((dog) => dog.role?.toLowerCase() === "puppy").length,
    retired: dogs.filter((dog) => dog.status?.toLowerCase() === "retired").length,
    eligible: dogs.filter((dog) => dog.breedingEligibility?.toLowerCase() === "eligible").length,
  };
}

import { revalidatePath } from "next/cache";
import type { OrganizationContext } from "@/lib/auth";
import { generateStructuredAiResponse } from "@/lib/ai-openai";
import { createSimplePdf } from "@/lib/pdf";
import { getAutomationWorkspaceData } from "@/lib/automation-data";
import { sendNoticeFromTemplate } from "@/lib/automation-service";
import { getBreederWorkspaceData } from "@/lib/breeder-data";
import { getBusinessWorkspaceData } from "@/lib/business-data";
import { createSupabaseAdminClient } from "@/lib/supabase";

type DocumentOptions = {
  refundPolicy: string;
  healthTerms: string;
  paymentStructure: string;
  breederGuarantees: string;
  buyerResponsibilities: string;
};

type WebsiteInput = {
  kennelName: string;
  location: string;
  breeds: string;
  tone: string;
  services: string;
};

type ChiChiAction = {
  type: "route" | "notice";
  label: string;
  route?: string;
};

type ChiChiResponse = {
  answer: string;
  suggestions: string[];
  actions: ChiChiAction[];
};

type DocumentGeneration = {
  title: string;
  contentText: string;
};

type WebsiteGeneration = {
  siteName: string;
  tone: string;
  location: string;
  breeds: string[];
  services: string[];
  pages: Array<{
    slug: string;
    title: string;
    hero: string;
    intro: string;
    sections: Array<{
      heading: string;
      body: string;
      bullets: string[];
    }>;
  }>;
};

const documentSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    contentText: { type: "string" },
  },
  required: ["title", "contentText"],
} satisfies Record<string, unknown>;

const websiteSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteName: { type: "string" },
    tone: { type: "string" },
    location: { type: "string" },
    breeds: { type: "array", items: { type: "string" } },
    services: { type: "array", items: { type: "string" } },
    pages: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          slug: { type: "string" },
          title: { type: "string" },
          hero: { type: "string" },
          intro: { type: "string" },
          sections: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                heading: { type: "string" },
                body: { type: "string" },
                bullets: { type: "array", items: { type: "string" } },
              },
              required: ["heading", "body", "bullets"],
            },
          },
        },
        required: ["slug", "title", "hero", "intro", "sections"],
      },
    },
  },
  required: ["siteName", "tone", "location", "breeds", "services", "pages"],
} satisfies Record<string, unknown>;

const chichiSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer: { type: "string" },
    suggestions: { type: "array", items: { type: "string" } },
    actions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          type: { type: "string", enum: ["route", "notice"] },
          label: { type: "string" },
          route: { type: "string" },
        },
        required: ["type", "label", "route"],
      },
    },
  },
  required: ["answer", "suggestions", "actions"],
} satisfies Record<string, unknown>;

export async function generateDocumentDraft({
  organization,
  documentType,
  state,
  options,
}: {
  organization: OrganizationContext;
  documentType: string;
  state: string;
  options: DocumentOptions;
}) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const generated = await generateStructuredAiResponse<DocumentGeneration>({
    schemaName: "breeder_document",
    schema: documentSchema,
    instructions:
      "You draft professional breeder documents. Use the supplied state and option choices. Write in clean contract language, avoid AI disclaimers, avoid generic filler, and do not claim legal perfection. Produce complete usable text with clear section headings.",
    input: [
      `Breeder workspace: ${organization.name}`,
      `Document type: ${documentType}`,
      `State: ${state}`,
      `Refund policy: ${options.refundPolicy}`,
      `Health terms: ${options.healthTerms}`,
      `Payment structure: ${options.paymentStructure}`,
      `Breeder guarantees: ${options.breederGuarantees}`,
      `Buyer responsibilities: ${options.buyerResponsibilities}`,
    ].join("\n"),
  });

  const { data, error } = await admin
    .from("generated_documents")
    .insert({
      breeder_id: organization.id,
      document_type: documentType,
      state,
      content_text: generated.contentText,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Document record could not be created.");
  }

  const pdfUrl = `/api/admin/generated-documents/${data.id}/pdf`;
  const { error: updateError } = await admin
    .from("generated_documents")
    .update({
      pdf_url: pdfUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", data.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/admin/documents");
  revalidatePath("/admin/documents/ai");

  return {
    id: data.id,
    title: generated.title,
    contentText: generated.contentText,
    pdfUrl,
  };
}

export async function updateGeneratedDocument({
  organizationId,
  documentId,
  contentText,
}: {
  organizationId: string;
  documentId: string;
  contentText: string;
}) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { error } = await admin
    .from("generated_documents")
    .update({
      content_text: contentText,
      updated_at: new Date().toISOString(),
    })
    .eq("id", documentId)
    .eq("breeder_id", organizationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/documents/ai");
}

export async function loadGeneratedDocumentPdf({
  organizationId,
  documentId,
}: {
  organizationId: string;
  documentId: string;
}) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { data, error } = await admin
    .from("generated_documents")
    .select("document_type, state, content_text")
    .eq("id", documentId)
    .eq("breeder_id", organizationId)
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Document not found.");
  }

  return createSimplePdf({
    title: `${data.document_type} - ${data.state}`,
    body: data.content_text,
  });
}

export async function generateWebsiteDraft({
  organization,
  input,
}: {
  organization: OrganizationContext;
  input: WebsiteInput;
}) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const generated = await generateStructuredAiResponse<WebsiteGeneration>({
    schemaName: "breeder_website",
    schema: websiteSchema,
    instructions:
      "You create breeder website copy. Write polished, breeder-specific website content with no placeholder language. Match the selected tone. Keep every page usable and realistic for a breeder business.",
    input: [
      `Breeder workspace: ${organization.name}`,
      `Kennel name: ${input.kennelName}`,
      `Location: ${input.location}`,
      `Breeds: ${input.breeds}`,
      `Tone: ${input.tone}`,
      `Services: ${input.services}`,
      "Required pages: homepage, about, puppies, contact",
    ].join("\n"),
  });

  const { data, error } = await admin
    .from("breeder_websites")
    .insert({
      breeder_id: organization.id,
      site_json: generated,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Website record could not be created.");
  }

  revalidatePath("/admin/website-builder");

  return {
    id: data.id,
    siteJson: generated,
  };
}

export async function updateBreederWebsite({
  organizationId,
  websiteId,
  siteJson,
}: {
  organizationId: string;
  websiteId: string;
  siteJson: Record<string, unknown>;
}) {
  const admin = createSupabaseAdminClient();

  if (!admin) {
    throw new Error("Supabase admin client is not configured.");
  }

  const { error } = await admin
    .from("breeder_websites")
    .update({
      site_json: siteJson,
      updated_at: new Date().toISOString(),
    })
    .eq("id", websiteId)
    .eq("breeder_id", organizationId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/website-builder");
}

export async function getChiChiResponse({
  organization,
  message,
}: {
  organization: OrganizationContext;
  message: string;
}) {
  const normalized = message.toLowerCase();
  const [business, breeder, automation] = await Promise.all([
    getBusinessWorkspaceData(organization.id),
    getBreederWorkspaceData(organization.id),
    getAutomationWorkspaceData(organization.id),
  ]);

  if (mentionsDocumentGeneration(normalized)) {
    return {
      answer: "I can open the document generator with the right agreement flow for your breeder file.",
      suggestions: ["Select the state and agreement type, then choose the contract terms you want included."],
      actions: [
        {
          type: "route",
          label: "Open AI Documents",
          route: "/admin/documents/ai",
        },
      ],
    } satisfies ChiChiResponse;
  }

  if (normalized.includes("website")) {
    return {
      answer: "I can open the breeder website builder and generate the editable site structure from your kennel details.",
      suggestions: ["Set kennel name, location, breeds, tone, and services before generating pages."],
      actions: [
        {
          type: "route",
          label: "Open Website Builder",
          route: "/admin/website-builder",
        },
      ],
    } satisfies ChiChiResponse;
  }

  if (normalized.includes("overdue") && normalized.includes("payment")) {
    const overdue = business.paymentPlans
      .map((plan) => {
        const buyer = business.buyers.find((item) => item.id === plan.buyerId) ?? null;
        const paid = business.payments
          .filter((payment) => payment.buyerId === plan.buyerId)
          .reduce((sum, payment) => sum + payment.amount, 0);
        const balance = Math.max(plan.totalPrice - paid, 0);
        return { plan, buyer, balance };
      })
      .filter((item) => item.balance > 0 && item.plan.nextDueDate && new Date(item.plan.nextDueDate) < new Date())
      .slice(0, 5);

    if (overdue.length === 0) {
      return {
        answer: "No buyer accounts are currently past due based on the payment plans in your workspace.",
        suggestions: ["Open Payments to review active plans and next due dates."],
        actions: [{ type: "route", label: "Open Payments", route: "/admin/payments" }],
      };
    }

    return {
      answer: overdue
        .map((item) => `${item.buyer?.fullName ?? "Buyer"} owes ${currency(item.balance)} and was due ${item.plan.nextDueDate}.`)
        .join(" "),
      suggestions: ["Review the Payments workspace to send reminders or update the ledger."],
      actions: [{ type: "route", label: "Open Payments", route: "/admin/payments" }],
    };
  }

  const matchedBuyer = matchBuyerFromMessage(message, business.buyers);

  if (matchedBuyer && (normalized.includes("owe") || normalized.includes("balance") || normalized.includes("payment status"))) {
    const plan = business.paymentPlans.find((item) => item.buyerId === matchedBuyer.id) ?? null;
    const paid = business.payments
      .filter((payment) => payment.buyerId === matchedBuyer.id)
      .reduce((sum, payment) => sum + payment.amount, 0);
    const balance = Math.max((plan?.totalPrice ?? 0) - paid, 0);

    return {
      answer: `${matchedBuyer.fullName} has paid ${currency(paid)}. The current balance is ${currency(balance)}${plan?.nextDueDate ? ` and the next due date is ${plan.nextDueDate}.` : "."}`,
      suggestions: ["Open the buyer file to review notices, documents, and linked puppy details."],
      actions: [{ type: "route", label: "Open Buyers", route: "/admin/buyers" }],
    };
  }

  if (matchedBuyer && (normalized.includes("send reminder") || normalized.includes("send notice") || normalized.includes("payment reminder"))) {
    await sendNoticeFromTemplate(organization.id, "payment_reminder", matchedBuyer.id);

    return {
      answer: `I sent a payment reminder to ${matchedBuyer.fullName} using the payment reminder template and recorded the delivery in the notice log.`,
      suggestions: ["Open Payments to confirm the buyer ledger and notice history."],
      actions: [{ type: "route", label: "Open Payments", route: "/admin/payments" }],
    };
  }

  if (normalized.includes("next action") || normalized.includes("what should i do next")) {
    const nextBreedingTask = breeder.tasks.find((task) => task.status !== "completed");
    const nextTransport = business.transportation.find((item) => item.date);

    const suggestions = [
      nextBreedingTask ? `${nextBreedingTask.title}${nextBreedingTask.dueDate ? ` by ${nextBreedingTask.dueDate}` : ""}` : null,
      nextTransport ? `Confirm ${nextTransport.type} coordination for ${nextTransport.date}` : null,
      business.paymentPlans.find((plan) => plan.nextDueDate)?.nextDueDate
        ? `Review payment notices due around ${business.paymentPlans.find((plan) => plan.nextDueDate)?.nextDueDate}`
        : null,
    ].filter((value): value is string => Boolean(value));

    return {
      answer: suggestions.length > 0
        ? `The next operational priorities are ${suggestions.join(", ")}.`
        : "Your current workspace does not show an immediate breeding, payment, or transportation action that needs attention.",
      suggestions: ["Use Dashboard and Automation together to keep the next task rail current."],
      actions: [{ type: "route", label: "Open Dashboard", route: "/admin" }],
    };
  }

  const compactContext = buildChiChiContext({ organization, business, breeder, automation });
  const generated = await generateStructuredAiResponse<ChiChiResponse>({
    schemaName: "chichi_answer",
    schema: chichiSchema,
    instructions:
      "You are ChiChi, a breeder operations assistant inside MyDogPortal.site. Use only the supplied breeder data. Do not invent buyers, money, dates, legal claims, or records. If the answer is missing from the supplied data, say that clearly. Keep answers concise, operational, and breeder-specific.",
    input: `User question:\n${message}\n\nBreeder data:\n${compactContext}`,
  });

  return generated;
}

function buildChiChiContext({
  organization,
  business,
  breeder,
  automation,
}: {
  organization: OrganizationContext;
  business: Awaited<ReturnType<typeof getBusinessWorkspaceData>>;
  breeder: Awaited<ReturnType<typeof getBreederWorkspaceData>>;
  automation: Awaited<ReturnType<typeof getAutomationWorkspaceData>>;
}) {
  const paymentSummary = business.paymentPlans.slice(0, 8).map((plan) => {
    const buyer = business.buyers.find((item) => item.id === plan.buyerId);
    const paid = business.payments
      .filter((payment) => payment.buyerId === plan.buyerId)
      .reduce((sum, payment) => sum + payment.amount, 0);
    return {
      buyer: buyer?.fullName ?? "Buyer",
      next_due_date: plan.nextDueDate,
      total_price: plan.totalPrice,
      paid,
      balance: Math.max(plan.totalPrice - paid, 0),
    };
  });

  return JSON.stringify(
    {
      organization: organization.name,
      buyers: business.buyers.slice(0, 8).map((buyer) => ({
        name: buyer.fullName,
        status: buyer.status,
        email: buyer.email,
      })),
      payment_summary: paymentSummary,
      documents: business.documents.slice(0, 6).map((document) => ({
        title: document.title,
        status: document.status,
        category: document.category,
      })),
      breeding_program: breeder.pairings.slice(0, 6).map((pairing) => ({
        pairing_name: pairing.pairingName,
        status: pairing.status,
        planned_start: pairing.plannedStart,
      })),
      tasks: breeder.tasks.slice(0, 6).map((task) => ({
        title: task.title,
        due_date: task.dueDate,
        status: task.status,
      })),
      notices: automation.logs.slice(0, 6).map((log) => ({
        notice_type: log.noticeType,
        delivery_status: log.deliveryStatus,
        buyer_id: log.buyerId,
      })),
    },
    null,
    2,
  );
}

function matchBuyerFromMessage(message: string, buyers: Awaited<ReturnType<typeof getBusinessWorkspaceData>>["buyers"]) {
  const normalized = message.toLowerCase();
  return buyers.find((buyer) => normalized.includes(buyer.fullName.toLowerCase()));
}

function mentionsDocumentGeneration(message: string) {
  return (
    message.includes("deposit agreement") ||
    message.includes("bill of sale") ||
    message.includes("health guarantee") ||
    message.includes("payment plan agreement") ||
    (message.includes("create") && message.includes("document"))
  );
}

function currency(value: number) {
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

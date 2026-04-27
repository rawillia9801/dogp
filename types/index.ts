export type OrganizationRole = "owner" | "staff";

export type PlanLimits = {
  dogs: number | "Unlimited";
  litters: number | "Unlimited";
  users: number | "Unlimited";
};

export type UpgradeEvent = {
  id: string;
  organizationId: string;
  triggerType: string;
  sourceArea: string;
  currentPlan: string;
  suggestedPlan: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type StoredPlanLimit = {
  id: string;
  planKey: string;
  featureKey: string;
  limitValue: number | null;
  createdAt: string;
};

export type DogRole = "dam" | "sire" | "prospect" | "retired";
export type DogStatus = "active" | "watch" | "retired" | "archived";
export type PuppyStatus = "available" | "reserved" | "matched" | "retained" | "placed";
export type LitterStatus = "planned" | "bred" | "confirmed" | "whelped" | "closed";
export type PairingStatus = "planned" | "review" | "bred" | "confirmed" | "closed";

export type Dog = {
  id: string;
  organizationId: string;
  callName: string;
  registeredName: string | null;
  role: DogRole | string;
  status: DogStatus | string;
  dateOfBirth: string | null;
  sex: string | null;
  color: string | null;
  coat: string | null;
  registry: string | null;
  bloodline: string | null;
  photoUrl: string | null;
  notes: string | null;
  breedingEligibility: string | null;
  provenStatus: string | null;
  cycleNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DogHealthRecord = { id: string; organizationId: string; dogId: string; testName: string; result: string | null; status: string; testedAt: string | null; notes: string | null; createdAt: string; updatedAt: string; };
export type DogGeneticRecord = { id: string; organizationId: string; dogId: string; carrierStates: string | null; colorGenetics: string | null; coatGenetics: string | null; coiPercent: number | null; notes: string | null; createdAt: string; updatedAt: string; };

export type Litter = {
  id: string; organizationId: string; pairingId: string | null; damId: string | null; sireId: string | null; litterName: string; status: LitterStatus | string; breedingDate: string | null; confirmationDate: string | null; dueDate: string | null; whelpDate: string | null; expectedSize: string | null; reservationGoal: number | null; notes: string | null; createdAt: string; updatedAt: string;
};

export type Puppy = {
  id: string;
  organizationId: string;
  litterId: string | null;
  buyerId?: string | null;
  puppyName: string | null;
  callName: string | null;
  dateOfBirth: string | null;
  sex: string | null;
  color: string | null;
  coat: string | null;
  status: PuppyStatus | string;
  price: number | null;
  deposit: number | null;
  balance: number | null;
  retained: boolean;
  publicVisible: boolean;
  portalVisible: boolean;
  goHomeReady: boolean;
  notes: string | null;
  description: string | null;
  photoUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type BreedingPair = { id: string; organizationId: string; damId: string | null; sireId: string | null; pairingName: string | null; status: PairingStatus | string; breedingMethod: string | null; plannedStart: string | null; plannedEnd: string | null; expectedLitterSize: string | null; colorCoatSummary: string | null; reservationGoal: number | null; goals: string | null; internalAnalysis: string | null; notes: string | null; createdAt: string; updatedAt: string; };
export type BreederTask = { id: string; organizationId: string; relatedType: string | null; relatedId: string | null; title: string; priority: string; dueDate: string | null; status: string; notes: string | null; createdAt: string; updatedAt: string; };
export type BreederEvent = { id: string; organizationId: string; relatedType: string | null; relatedId: string | null; title: string; eventType: string | null; eventDate: string; status: string; notes: string | null; createdAt: string; updatedAt: string; };
export type Buyer = { id: string; organizationId: string; fullName: string; email: string; phone: string | null; status: "lead" | "approved" | "active" | "completed" | string; notes: string | null; addressLine1: string | null; addressLine2: string | null; city: string | null; state: string | null; postalCode: string | null; country: string | null; createdAt: string; updatedAt: string; };
export type BuyerApplication = { id: string; organizationId: string; buyerId: string | null; status: "submitted" | "approved" | "denied" | string; answers: Record<string, unknown>; createdAt: string; updatedAt: string; };
export type BuyerPayment = { id: string; organizationId: string; buyerId: string; amount: number; paymentDate: string | null; type: "deposit" | "installment" | "adjustment" | string; method: string | null; status: string; createdAt: string; updatedAt: string; };
export type PaymentPlan = { id: string; organizationId: string; buyerId: string; totalPrice: number; deposit: number; monthlyAmount: number; months: number; apr: number; nextDueDate: string | null; createdAt: string; updatedAt: string; };
export type BuyerDocument = { id: string; organizationId: string; buyerId: string | null; title: string; category: "contracts" | "payment plan" | "health" | "delivery" | string; fileUrl: string | null; status: string; signedAt: string | null; visibleToUser: boolean; createdAt: string; updatedAt: string; };
export type TransportationRequest = { id: string; organizationId: string; buyerId: string | null; puppyId: string | null; type: "pickup" | "meet" | "delivery" | string; date: string | null; location: string | null; miles: number | null; fee: number | null; notes: string | null; createdAt: string; updatedAt: string; };
export type NoticeTemplate = { id: string; organizationId: string | null; templateKey: string; category: string; noticeType: string; subject: string; body: string; status: "enabled" | "disabled" | string; isActive?: boolean; timingRule: string | null; recipientRules: Record<string, unknown>; variables: string[]; createdAt: string; updatedAt: string; };
export type NoticeRule = { id: string; organizationId: string; ruleKey: string; name: string; enabled: boolean; isActive?: boolean; triggerType: string; conditionJson?: Record<string, unknown>; timingOffset: number; timingUnit: string; delayMinutes?: number; templateId: string | null; templateKey?: string | null; actionType?: string; retryLimit?: number; recipientBehavior: string; filters: Record<string, unknown>; createdAt: string; updatedAt: string; };
export type NoticeLog = { id: string; organizationId: string; noticeType: string; templateId: string | null; templateKey?: string | null; ruleId: string | null; buyerId: string | null; puppyId: string | null; relatedType: string | null; relatedId: string | null; scheduledAt: string | null; sentAt: string | null; deliveryStatus: "scheduled" | "queued" | "sent" | "delivered" | "failed" | "skipped" | "canceled" | string; failureReason: string | null; provider: string | null; providerMessageId: string | null; dedupeKey: string | null; retryCount?: number; metadata?: Record<string, unknown>; createdAt: string; updatedAt: string; };
export type WorkflowRun = { id: string; organizationId: string; runKey: string; status: string; startedAt: string | null; finishedAt: string | null; summary: Record<string, unknown>; createdAt: string; updatedAt: string; };
export type WorkflowEvent = { id: string; organizationId: string; runId: string | null; eventKey: string; eventType: string; relatedType: string | null; relatedId: string | null; status: string; payload: Record<string, unknown>; createdAt: string; };
export type AutomationSettings = { id: string; organizationId: string; noticesEnabled: boolean; paymentNoticesEnabled: boolean; documentNoticesEnabled: boolean; transportationNoticesEnabled: boolean; puppyMilestoneNoticesEnabled: boolean; providerName: string; fromEmail: string | null; replyToEmail: string | null; quietHours: Record<string, unknown>; createdAt: string; updatedAt: string; };
export type GeneratedDocument = { id: string; breederId: string; documentType: string; state: string; contentText: string; pdfUrl: string | null; createdAt: string; updatedAt: string; };
export type BreederWebsite = { id: string; breederId: string; siteJson: Record<string, unknown>; createdAt: string; updatedAt: string; };

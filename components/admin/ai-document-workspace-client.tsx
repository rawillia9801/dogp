"use client";

import { useState, useTransition } from "react";
import { Download, FilePenLine, FileText, Save, WandSparkles } from "lucide-react";
import type { GeneratedDocument } from "@/types";
import { Panel, StatusPill, WorkspaceHeader } from "@/components/admin/workspace-ui";
import { GuidedPanel } from "@/components/admin/business-ui";

export function AiDocumentWorkspaceClient({
  documents,
}: {
  documents: GeneratedDocument[];
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedDocumentId, setSelectedDocumentId] = useState(documents[0]?.id ?? "");
  const [stateValue, setStateValue] = useState("Texas");
  const [documentType, setDocumentType] = useState("Deposit Agreement");
  const [refundPolicy, setRefundPolicy] = useState("Deposit is non-refundable unless the breeder cannot provide the reserved puppy.");
  const [healthTerms, setHealthTerms] = useState("Seventy-two hour veterinary review, documented vaccination schedule, and clearly defined health guarantee coverage.");
  const [paymentStructure, setPaymentStructure] = useState("Deposit due at reservation, balance due before pickup or delivery.");
  const [breederGuarantees, setBreederGuarantees] = useState("Accurate identification, signed breeder records, and current health documentation at placement.");
  const [buyerResponsibilities, setBuyerResponsibilities] = useState("Timely payment, transport coordination, veterinary follow-up, and responsible daily care.");
  const [contentText, setContentText] = useState(documents[0]?.contentText ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedDocument = documents.find((document) => document.id === selectedDocumentId) ?? null;

  const generate = () => {
    setFeedback(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/documents/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state: stateValue,
            documentType,
            refundPolicy,
            healthTerms,
            paymentStructure,
            breederGuarantees,
            buyerResponsibilities,
          }),
        });
        const payload = (await response.json().catch(() => ({}))) as {
          error?: string;
          document?: { id: string; contentText: string };
        };

        if (!response.ok || !payload.document) {
          throw new Error(payload.error ?? "Document generation failed.");
        }

        window.location.reload();
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Document generation failed.");
      }
    });
  };

  const save = () => {
    if (!selectedDocument) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/generated-documents/${selectedDocument.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentText }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Document save failed.");
        }

        setFeedback("Document saved.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Document save failed.");
      }
    });
  };

  return (
    <div>
      <WorkspaceHeader
        eyebrow="DogBreederDocs"
        title="AI Documents"
        description="Generate editable breeder agreements that match your state, contract terms, and buyer responsibilities."
        actions={
          <>
            {selectedDocument?.pdfUrl ? (
              <a
                href={selectedDocument.pdfUrl}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-stone-100"
              >
                <Download className="size-4" />
                Download PDF
              </a>
            ) : null}
            <button
              type="button"
              onClick={generate}
              disabled={isPending}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold disabled:opacity-60"
            >
              <WandSparkles className="size-4" />
              Generate Document
            </button>
          </>
        }
      />

      {feedback ? (
        <div className="mt-5">
          <StatusPill tone="gold">{feedback}</StatusPill>
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 2xl:grid-cols-[320px_1fr_340px]">
        <Panel className="p-4" title="Generated Documents" eyebrow="Stored drafts">
          <div className="space-y-2">
            {documents.length > 0 ? (
              documents.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => {
                    setSelectedDocumentId(document.id);
                    setContentText(document.contentText);
                  }}
                  className={document.id === selectedDocumentId ? "block w-full rounded-md border border-gold/30 bg-gold/10 p-3 text-left" : "block w-full rounded-md border border-white/[0.06] bg-white/[0.025] p-3 text-left"}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md border border-gold/20 bg-gold/10 text-gold">
                      <FileText className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-100">{document.documentType}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">{document.state}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <GuidedPanel
                icon={<FileText className="size-4" />}
                title="Generate the first breeder document"
                body="Select the state, agreement type, and contract terms to create an editable breeder-ready document."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          <Panel className="p-5" title="Document Generator" eyebrow="State and contract terms">
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2 text-sm text-stone-300">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">State</span>
                <input value={stateValue} onChange={(event) => setStateValue(event.target.value)} className="form-input h-10" />
              </label>
              <label className="space-y-2 text-sm text-stone-300">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Document type</span>
                <select value={documentType} onChange={(event) => setDocumentType(event.target.value)} className="form-input h-10">
                  {["Deposit Agreement", "Bill of Sale", "Health Guarantee", "Payment Plan Agreement"].map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
              <FormArea label="Refund policy" value={refundPolicy} onChange={setRefundPolicy} />
              <FormArea label="Health terms" value={healthTerms} onChange={setHealthTerms} />
              <FormArea label="Payment structure" value={paymentStructure} onChange={setPaymentStructure} />
              <FormArea label="Breeder guarantees" value={breederGuarantees} onChange={setBreederGuarantees} />
              <div className="md:col-span-2">
                <FormArea label="Buyer responsibilities" value={buyerResponsibilities} onChange={setBuyerResponsibilities} />
              </div>
            </div>
          </Panel>

          <Panel className="p-5" title="Editable Document" eyebrow="Stored text">
            {selectedDocument ? (
              <>
                <textarea
                  value={contentText}
                  onChange={(event) => setContentText(event.target.value)}
                  className="form-input min-h-[560px] py-4 text-sm leading-7"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={save}
                    disabled={isPending}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold disabled:opacity-60"
                  >
                    <Save className="size-4" />
                    Save Document
                  </button>
                  {selectedDocument.pdfUrl ? (
                    <a
                      href={selectedDocument.pdfUrl}
                      className="inline-flex h-10 items-center gap-2 rounded-md border border-white/[0.12] bg-white/[0.04] px-4 text-sm font-semibold text-stone-100"
                    >
                      <Download className="size-4" />
                      Download PDF
                    </a>
                  ) : null}
                </div>
              </>
            ) : (
              <GuidedPanel
                icon={<FilePenLine className="size-4" />}
                title="Generate a document to begin editing"
                body="Each generated record stays editable in the system and can be exported as a PDF."
              />
            )}
          </Panel>
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Document Output" eyebrow="Stored version">
            {selectedDocument ? (
              <div className="space-y-3">
                <StatusPill tone="green">{selectedDocument.documentType}</StatusPill>
                <p className="text-sm text-stone-400">{selectedDocument.state}</p>
                <p className="text-sm leading-6 text-stone-300">
                  The generated text is stored in your breeder workspace and available for download as a PDF.
                </p>
              </div>
            ) : (
              <GuidedPanel
                icon={<FileText className="size-4" />}
                title="Stored output will appear here"
                body="After generation, the document type, state, and export link stay attached to the saved record."
              />
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function FormArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="space-y-2 text-sm text-stone-300">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">{label}</span>
      <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} className="form-input min-h-[120px] py-3" />
    </label>
  );
}

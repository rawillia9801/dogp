"use client";

import { useMemo, useState, useTransition } from "react";
import { Eye, Globe2, Save, WandSparkles } from "lucide-react";
import type { BreederWebsite } from "@/types";
import { GuidedPanel } from "@/components/admin/business-ui";
import { Panel, StatusPill, WorkspaceHeader } from "@/components/admin/workspace-ui";

export function WebsiteBuilderWorkspaceClient({
  websites,
}: {
  websites: BreederWebsite[];
}) {
  const [isPending, startTransition] = useTransition();
  const [selectedWebsiteId, setSelectedWebsiteId] = useState(websites[0]?.id ?? "");
  const [kennelName, setKennelName] = useState("Stonehaven Retrievers");
  const [location, setLocation] = useState("Austin, Texas");
  const [breeds, setBreeds] = useState("Labrador Retriever");
  const [tone, setTone] = useState("Premium");
  const [services, setServices] = useState("Puppies, stud service, placement support");
  const [siteJsonDrafts, setSiteJsonDrafts] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);

  const selectedWebsite = websites.find((website) => website.id === selectedWebsiteId) ?? null;
  const siteJson = (selectedWebsite?.siteJson ?? {}) as {
    siteName?: string;
    pages?: Array<{
      slug: string;
      title: string;
      hero: string;
      intro: string;
      sections: Array<{ heading: string; body: string; bullets: string[] }>;
    }>;
  };
  const siteJsonText = selectedWebsite
    ? siteJsonDrafts[selectedWebsite.id] ?? JSON.stringify(siteJson, null, 2)
    : "";

  const pagePreview = useMemo(() => siteJson.pages?.[0] ?? null, [siteJson.pages]);

  const generate = () => {
    setFeedback(null);
    startTransition(async () => {
      try {
        const response = await fetch("/api/admin/website-builder/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kennelName, location, breeds, tone, services }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Website generation failed.");
        }

        window.location.reload();
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Website generation failed.");
      }
    });
  };

  const save = () => {
    if (!selectedWebsite) {
      return;
    }

    setFeedback(null);
    startTransition(async () => {
      try {
        const parsedSiteJson = JSON.parse(siteJsonText) as Record<string, unknown>;
        const response = await fetch(`/api/admin/website-builder/${selectedWebsite.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ siteJson: parsedSiteJson }),
        });
        const payload = (await response.json().catch(() => ({}))) as { error?: string };

        if (!response.ok) {
          throw new Error(payload.error ?? "Website save failed.");
        }

        setFeedback("Website draft saved.");
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : "Website save failed.");
      }
    });
  };

  return (
    <div>
      <WorkspaceHeader
        eyebrow="DogBreederWeb"
        title="Website Builder"
        description="Generate editable breeder website copy for your kennel brand, services, puppy listings, and contact flow."
        actions={
          <button
            type="button"
            onClick={generate}
            disabled={isPending}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold disabled:opacity-60"
          >
            <WandSparkles className="size-4" />
            Generate Website
          </button>
        }
      />

      {feedback ? (
        <div className="mt-5">
          <StatusPill tone="gold">{feedback}</StatusPill>
        </div>
      ) : null}

      <div className="mt-8 grid gap-5 2xl:grid-cols-[320px_1fr_360px]">
        <Panel className="p-4" title="Saved Drafts" eyebrow="Breeder websites">
          <div className="space-y-2">
            {websites.length > 0 ? (
              websites.map((website) => (
                <button
                  key={website.id}
                  type="button"
                  onClick={() => setSelectedWebsiteId(website.id)}
                  className={website.id === selectedWebsiteId ? "block w-full rounded-md border border-gold/30 bg-gold/10 p-3 text-left" : "block w-full rounded-md border border-white/[0.06] bg-white/[0.025] p-3 text-left"}
                >
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 items-center justify-center rounded-md border border-gold/20 bg-gold/10 text-gold">
                      <Globe2 className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-stone-100">{((website.siteJson.siteName as string | undefined) ?? "Breeder website")}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">Website draft</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <GuidedPanel
                icon={<Globe2 className="size-4" />}
                title="Generate the first breeder site draft"
                body="Set the kennel brand, tone, breeds, and services to create an editable breeder website structure."
              />
            )}
          </div>
        </Panel>

        <main className="space-y-5">
          <Panel className="p-5" title="Website Generator" eyebrow="Brand and tone">
            <div className="grid gap-3 md:grid-cols-2">
              <Input label="Kennel name" value={kennelName} onChange={setKennelName} />
              <Input label="Location" value={location} onChange={setLocation} />
              <Input label="Breeds" value={breeds} onChange={setBreeds} />
              <Input label="Tone" value={tone} onChange={setTone} />
              <div className="md:col-span-2">
                <Input label="Services" value={services} onChange={setServices} />
              </div>
            </div>
          </Panel>

          <Panel className="p-5" title="Editable Site Structure" eyebrow="Stored pages">
            {selectedWebsite ? (
              <>
                <textarea
                  value={siteJsonText}
                  onChange={(event) =>
                    setSiteJsonDrafts((current) => ({
                      ...current,
                      [selectedWebsite.id]: event.target.value,
                    }))
                  }
                  className="form-input min-h-[560px] py-4 font-mono text-xs leading-6"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={save}
                    disabled={isPending}
                    className="inline-flex h-10 items-center gap-2 rounded-md border border-gold/35 bg-gold px-4 text-sm font-semibold text-[#20160c] shadow-gold disabled:opacity-60"
                  >
                    <Save className="size-4" />
                    Save Draft
                  </button>
                </div>
              </>
            ) : (
              <GuidedPanel
                icon={<WandSparkles className="size-4" />}
                title="Generate a website draft to begin editing"
                body="Each generated site stores editable homepage, about, puppies, and contact page content in your admin workspace."
              />
            )}
          </Panel>
        </main>

        <aside className="space-y-5">
          <Panel className="p-5" title="Preview" eyebrow="Admin preview">
            {pagePreview ? (
              <div className="rounded-lg border border-white/[0.08] bg-black/15 p-4">
                <div className="flex items-center gap-2 text-gold">
                  <Eye className="size-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">Page preview</p>
                </div>
                <h3 className="mt-3 text-xl font-semibold text-stone-50">{pagePreview.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-300">{pagePreview.hero}</p>
                <p className="mt-3 text-sm leading-6 text-stone-400">{pagePreview.intro}</p>
              </div>
            ) : (
              <GuidedPanel
                icon={<Globe2 className="size-4" />}
                title="Site preview will appear here"
                body="Once generated, the first page preview gives a live look at the editable website copy stored in the system."
              />
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Input({
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
      <input value={value} onChange={(event) => onChange(event.target.value)} className="form-input h-10" />
    </label>
  );
}

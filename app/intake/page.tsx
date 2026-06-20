import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { LeadForm } from "@/components/leads/LeadForm";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { createPublicLeadAction } from "@/lib/actions/leads";

type IntakePageProps = {
  searchParams: Promise<{
    submitted?: string;
  }>;
};

export default async function IntakePage({ searchParams }: IntakePageProps) {
  const params = await searchParams;

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm font-semibold text-cyan-700">
          Coastline Excavation
        </Link>

        {params.submitted ? (
          <Card className="mt-6 text-center">
            <CheckCircle2 className="mx-auto size-14 text-emerald-500" />
            <h1 className="mt-4 text-3xl font-bold text-slate-950">Request received</h1>
            <p className="mt-3 text-slate-500">
              Thanks for contacting Coastline Excavation. Your lead number is{" "}
              <span className="font-semibold text-slate-900">{params.submitted}</span>. Our office will review your project details and follow up soon.
            </p>
          </Card>
        ) : (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Request an excavation estimate</CardTitle>
              <CardDescription>
                Tell us about your project and upload any helpful site photos or documents.
              </CardDescription>
            </CardHeader>
            <LeadForm action={createPublicLeadAction} publicForm submitLabel="Submit request" />
          </Card>
        )}
      </div>
    </main>
  );
}

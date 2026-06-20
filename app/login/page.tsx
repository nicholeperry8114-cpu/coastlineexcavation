import { HardHat } from "lucide-react";

import { signInAction } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      <Card className="w-full max-w-md border-white/10 bg-white p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-cyan-700 text-white">
            <HardHat className="size-6" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">Coastline</p>
            <h1 className="text-2xl font-bold text-slate-950">Admin sign in</h1>
          </div>
        </div>

        {params.error ? (
          <div className="mb-5 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{params.error}</div>
        ) : null}

        <form action={signInAction} className="space-y-5">
          <input type="hidden" name="next" value={params.next || "/dashboard"} />
          <Field label="Email">
            <Input name="email" type="email" autoComplete="email" required />
          </Field>
          <Field label="Password">
            <Input name="password" type="password" autoComplete="current-password" required />
          </Field>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
      </Card>
    </main>
  );
}

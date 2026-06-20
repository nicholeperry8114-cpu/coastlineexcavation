"use client";

import { Printer } from "lucide-react";

import { Button } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <Button type="button" variant="secondary" onClick={() => window.print()}>
      <Printer className="mr-2 size-4" />
      Print / save PDF
    </Button>
  );
}

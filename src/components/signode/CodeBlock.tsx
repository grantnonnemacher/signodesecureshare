import * as React from "react";
import { Button } from "@/components/ui/button";
import { Printer, Copy, Check } from "lucide-react";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function DocPageShell({ title, subtitle, children }: Props) {
  const [copied, setCopied] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  function handleCopyAll() {
    if (!contentRef.current) return;
    const text = contentRef.current.innerText;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="flex items-start justify-between gap-4 mb-6 no-print">
        <div>
          <h1 className="text-3xl font-bold text-[hsl(var(--signode-black))]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" /> Copy document
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" /> Print to PDF
          </Button>
        </div>
      </div>
      <div ref={contentRef} className="space-y-6">
        {children}
      </div>
    </div>
  );
}
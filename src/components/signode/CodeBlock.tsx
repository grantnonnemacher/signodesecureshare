import * as React from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

type Props = {
  language?: string;
  code: string;
  filename?: string;
};

export function CodeBlock({ language, code, filename }: Props) {
  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-md border bg-[hsl(var(--signode-black))] text-white overflow-hidden my-4">
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/10 bg-white/5 text-xs">
        <div className="flex items-center gap-2">
          {language && (
            <span className="uppercase tracking-wider text-[hsl(var(--signode-orange-soft))]">
              {language}
            </span>
          )}
          {filename && (
            <span className="font-mono text-white/60">{filename}</span>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 text-white hover:bg-white/10 gap-1.5 text-xs"
          onClick={handleCopy}
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" /> Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" /> Copy
            </>
          )}
        </Button>
      </div>
      <pre className="p-4 text-xs overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
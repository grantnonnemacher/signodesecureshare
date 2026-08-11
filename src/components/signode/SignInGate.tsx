import * as React from "react";
import { usePersona } from "@/lib/persona-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, KeyRound, Smartphone } from "lucide-react";

type Step = "aup" | "mfa-method" | "mfa-fido2" | "mfa-authenticator";

export function SignInGate() {
  const { persona, isSignedIn, signIn } = usePersona();
  const [step, setStep] = React.useState<Step>("aup");
  const [numberMatch] = React.useState(() =>
    Math.floor(10 + Math.random() * 89).toString()
  );

  // Reset flow whenever a new sign-in is needed
  React.useEffect(() => {
    if (!isSignedIn) setStep("aup");
  }, [isSignedIn, persona.id]);

  return (
    <Dialog open={!isSignedIn}>
      <DialogContent
        className="sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        {step === "aup" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-[hsl(var(--signode-orange))]">
                <ShieldCheck className="h-6 w-6" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Signode SecureShare
                </span>
              </div>
              <DialogTitle>Acceptable Use Policy</DialogTitle>
              <DialogDescription>
                Signing in as <strong>{persona.displayName}</strong> (
                {persona.organization}).
              </DialogDescription>
            </DialogHeader>
            <Card className="p-4 max-h-56 overflow-auto text-xs text-muted-foreground space-y-2">
              <p>
                By using the Signode SecureShare Portal you agree to exchange
                files only for legitimate Signode business purposes.
              </p>
              <p>
                Uploads are scanned by Microsoft Purview DLP. Files containing
                sensitive information may be quarantined and reviewed.
              </p>
              <p>
                Access is limited to the folders assigned to your role. All
                activity is logged for audit purposes. Sharing your credentials
                or invitation links with unauthorized parties is prohibited.
              </p>
              <p>
                Questions? Contact{" "}
                <span className="font-mono">itservicecenter@signode.com</span>.
              </p>
            </Card>
            <DialogFooter>
              <Button
                onClick={() => setStep("mfa-method")}
                className="bg-[hsl(var(--signode-orange))] hover:bg-[hsl(var(--signode-orange-deep))] text-white w-full"
              >
                I agree — continue to MFA
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "mfa-method" && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2 text-[hsl(var(--signode-orange))]">
                <KeyRound className="h-6 w-6" />
                <span className="text-xs font-semibold uppercase tracking-widest">
                  Verify your identity
                </span>
              </div>
              <DialogTitle>Choose an MFA method</DialogTitle>
              <DialogDescription>
                Signode requires phishing-resistant MFA on every sign-in.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <Card
                className="p-4 cursor-pointer hover:border-[hsl(var(--signode-orange))] transition-colors"
                onClick={() => setStep("mfa-fido2")}
              >
                <div className="flex items-center gap-3">
                  <KeyRound className="h-8 w-8 text-[hsl(var(--signode-orange))]" />
                  <div>
                    <div className="font-semibold">FIDO2 Security Key</div>
                    <div className="text-xs text-muted-foreground">
                      Tap your hardware key or use Windows Hello
                    </div>
                  </div>
                </div>
              </Card>
              <Card
                className="p-4 cursor-pointer hover:border-[hsl(var(--signode-orange))] transition-colors"
                onClick={() => setStep("mfa-authenticator")}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="h-8 w-8 text-[hsl(var(--signode-orange))]" />
                  <div>
                    <div className="font-semibold">Microsoft Authenticator</div>
                    <div className="text-xs text-muted-foreground">
                      Approve a push with number matching
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {step === "mfa-fido2" && (
          <>
            <DialogHeader>
              <DialogTitle>Tap your security key</DialogTitle>
              <DialogDescription>
                Waiting for your FIDO2 authenticator...
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="h-24 w-24 rounded-full bg-[hsl(var(--signode-orange))]/10 border-2 border-[hsl(var(--signode-orange))] flex items-center justify-center animate-pulse">
                <KeyRound className="h-12 w-12 text-[hsl(var(--signode-orange))]" />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                (Simulation — click below to complete sign-in)
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep("mfa-method")}>
                Back
              </Button>
              <Button
                onClick={() => signIn()}
                className="bg-[hsl(var(--signode-orange))] hover:bg-[hsl(var(--signode-orange-deep))] text-white flex-1"
              >
                Simulate tap
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "mfa-authenticator" && (
          <>
            <DialogHeader>
              <DialogTitle>Approve on your phone</DialogTitle>
              <DialogDescription>
                Open Microsoft Authenticator and enter the number below.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="text-6xl font-bold text-[hsl(var(--signode-orange))] tracking-wider">
                {numberMatch}
              </div>
              <p className="text-sm text-muted-foreground text-center">
                (Simulation — click below to complete sign-in)
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => setStep("mfa-method")}>
                Back
              </Button>
              <Button
                onClick={() => signIn()}
                className="bg-[hsl(var(--signode-orange))] hover:bg-[hsl(var(--signode-orange-deep))] text-white flex-1"
              >
                Simulate approve
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
import * as React from "react";
import { PERSONAS, getPersonaById, type Persona, type PersonaId } from "@/lib/personas";

type PersonaContextValue = {
  persona: Persona;
  setPersonaId: (id: PersonaId) => void;
  isSignedIn: boolean;
  signIn: () => void;
  signOut: () => void;
  personas: Persona[];
};

const PersonaContext = React.createContext<PersonaContextValue | undefined>(
  undefined
);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [personaId, setPersonaId] = React.useState<PersonaId>("global-admin");
  const [isSignedIn, setIsSignedIn] = React.useState(false);

  const persona = React.useMemo(() => getPersonaById(personaId), [personaId]);

  // When you switch persona, you're signed out and need to re-sign in.
  const changePersona = React.useCallback((id: PersonaId) => {
    setPersonaId(id);
    setIsSignedIn(false);
  }, []);

  const value: PersonaContextValue = {
    persona,
    setPersonaId: changePersona,
    isSignedIn,
    signIn: () => setIsSignedIn(true),
    signOut: () => setIsSignedIn(false),
    personas: PERSONAS,
  };

  return (
    <PersonaContext.Provider value={value}>{children}</PersonaContext.Provider>
  );
}

export function usePersona() {
  const ctx = React.useContext(PersonaContext);
  if (!ctx) throw new Error("usePersona must be used inside <PersonaProvider>");
  return ctx;
}
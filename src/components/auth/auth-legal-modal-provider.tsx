"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  LegalModal,
  type LegalDocumentType,
} from "@/components/legal/legal-modal";

interface AuthLegalModalContextValue {
  openLegalModal: (type: LegalDocumentType) => void;
}

const AuthLegalModalContext = createContext<AuthLegalModalContextValue | null>(
  null,
);

export function AuthLegalModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [documentType, setDocumentType] = useState<LegalDocumentType>("terms");

  const openLegalModal = useCallback((type: LegalDocumentType) => {
    setDocumentType(type);
    setOpen(true);
  }, []);

  const value = useMemo(
    () => ({
      openLegalModal,
    }),
    [openLegalModal],
  );

  return (
    <AuthLegalModalContext.Provider value={value}>
      {children}
      <LegalModal type={documentType} open={open} onOpenChange={setOpen} />
    </AuthLegalModalContext.Provider>
  );
}

export function useAuthLegalModal(): AuthLegalModalContextValue {
  const context = useContext(AuthLegalModalContext);

  if (!context) {
    throw new Error(
      "useAuthLegalModal must be used within AuthLegalModalProvider",
    );
  }

  return context;
}

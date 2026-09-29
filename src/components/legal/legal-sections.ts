export interface LegalSectionItem {
  id: string;
  label: string;
}

export const TERMS_SECTIONS: LegalSectionItem[] = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "about", label: "About DSJourney" },
  { id: "registration", label: "Account Registration" },
  { id: "security", label: "Account Security" },
  { id: "sign-in-methods", label: "Email and Social Sign-In" },
  { id: "acceptable-use", label: "Acceptable Use" },
  { id: "user-content", label: "User Content and Data" },
  { id: "disclaimer-education", label: "Educational / Career Preparation Disclaimer" },
  { id: "availability", label: "Service Availability" },
  { id: "third-party", label: "Third-Party Services" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "suspension", label: "Account Suspension or Termination" },
  { id: "deletion", label: "Account Deletion" },
  { id: "warranties", label: "Disclaimer of Warranties" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "service-changes", label: "Changes to the Service" },
  { id: "terms-changes", label: "Changes to These Terms" },
  { id: "governing-law", label: "Governing / Applicable Law" },
  { id: "contact", label: "Contact" },
];

export const PRIVACY_SECTIONS: LegalSectionItem[] = [
  { id: "overview", label: "Overview" },
  { id: "information-collected", label: "Information We Collect" },
  { id: "account-information", label: "Account Information" },
  { id: "learning-data", label: "Learning and Progress Data" },
  { id: "portfolio-information", label: "Portfolio Information" },
  { id: "authentication-information", label: "Authentication Information" },
  { id: "technical-information", label: "Technical Information" },
  { id: "how-we-use", label: "How We Use Information" },
  { id: "legal-reasons", label: "Legal / Operational Reasons for Processing" },
  { id: "storage", label: "How Information Is Stored" },
  { id: "third-party-services", label: "Third-Party Services" },
  { id: "google-sign-in", label: "Google Sign-In" },
  { id: "cookies-storage", label: "Cookies and Local Storage" },
  { id: "retention", label: "Data Retention" },
  { id: "deletion", label: "Data Deletion" },
  { id: "security", label: "Security" },
  { id: "children", label: "Children's / Age Considerations" },
  { id: "international", label: "International Processing" },
  { id: "policy-changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact" },
];

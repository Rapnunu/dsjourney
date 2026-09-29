import { PortfolioView } from "@/features/portfolio";
import { createPrivateMetadata } from "@/lib/metadata";

export const metadata = createPrivateMetadata({ title: "Portfolio" });

export default function PortfolioPage() {
  return <PortfolioView />;
}

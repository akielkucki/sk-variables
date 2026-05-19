import { FeatureGrid } from "./components/FeatureGrid";
import { FinalCta } from "./components/FinalCta";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { HowItWorks } from "./components/HowItWorks";
import { LiveTicker } from "./components/LiveTicker";
import { Nav } from "./components/Nav";
import { SocialProof } from "./components/SocialProof";
import {getLatestReleaseDownloadUrl} from "@/lib/server-actions";

export default async function Home() {
    const url: string = await getLatestReleaseDownloadUrl();
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[800px] bg-glow" />

      <Nav downloadUrl={url} />

      <main className="relative">
        <Hero downloadUrl={url} />
        <LiveTicker />
        <HowItWorks />
        <FeatureGrid />
        <SocialProof />
        <FinalCta />
      </main>

      <Footer />
    </div>
  );
}

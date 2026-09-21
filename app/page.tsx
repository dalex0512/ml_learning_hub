import { getRoadmap } from "@/lib/roadmap";
import Hero from "@/components/Hero";
import RoadmapZigzag from "@/components/RoadmapZigzag";

export default function HomePage() {
  const roadmapData = getRoadmap();

  return (
    <div className="relative">
      {/* Hero Section (Bản C - Sổ tay) */}
      <Hero />

      {/* Roadmap 6 Module Section (Zigzag + SVG animation) */}
      <RoadmapZigzag modules={roadmapData.modules} />
    </div>
  );
}


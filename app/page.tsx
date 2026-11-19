import { getRoadmap } from "@/lib/roadmap";
import { getAllQuizItems, getTopicContent } from "@/lib/markdown";
import HomeRoadmap, { type HomeModule } from "@/components/HomeRoadmap";

export default function HomePage() {
  const modules: HomeModule[] = getRoadmap().modules.map((m) => ({
    id: m.id,
    order: m.order,
    title: m.title,
    subtitle: m.subtitle,
    topics: m.topics.map((t) => {
      const data = getTopicContent(m.id, t.file, t.id);
      return {
        id: t.id,
        order: t.order,
        title: t.title,
        group: t.group ?? "Khác",
        description: data?.description ?? "",
        sections: data?.sections.length ?? 0,
        practice: data?.layout === "practice",
      };
    }),
  }));
  return <HomeRoadmap modules={modules} questionCount={getAllQuizItems().length} />;
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getRoadmap } from "@/lib/roadmap";
import { getDependencyGraph, getTopicContent } from "@/lib/markdown";
import ReaderShell from "@/components/ReaderShell";
import PracticeRoadmap from "@/components/PracticeRoadmap";
import { getPracticeSteps } from "@/lib/practice";

export function generateStaticParams() {
  return getRoadmap().modules.map(module => ({ moduleId: module.id }));
}

export function generateMetadata({ params }: { params: { moduleId: string } }) {
  return { title: `${getModule(params.moduleId)?.title ?? "Module"} | ML Learning Hub` };
}

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const module = getModule(params.moduleId);
  if (!module) notFound();
  const lessons = module.topics.map(topic => ({ topic, data: getTopicContent(module.id, topic.file, topic.id) }));
  const groups = Array.from(new Set(lessons.map(({ topic }) => topic.group ?? "Khác")));
  const graph = getDependencyGraph();
  const isPractice = lessons.length > 0 && lessons.every(({ data }) => data?.layout === "practice");
  if (isPractice) {
    const parts = lessons.map(({ topic, data }) => ({
      topicId: topic.id,
      label: `${topic.group ?? "Thực hành"} · Phần ${String.fromCharCode(64 + topic.order)}`,
      title: topic.title,
      description: data?.description ?? "",
      steps: getPracticeSteps(data!.sections),
    }));
    return <PracticeRoadmap moduleId={module.id} title={module.title} intro={module.intro ?? module.subtitle} parts={parts} />;
  }
  const titleOf = new Map(graph.map(n => [n.topicId, n]));
  return <ReaderShell backHref="/#roadmap" backLabel="Roadmap" title={module.title}>
    <div className="reader-layout" style={{ display: "block" }}>
      <main className="reader-main" style={{ margin: "0 auto" }}>
        <div className="reader-eyebrow">Module {String(module.order).padStart(2, "0")} · {module.topics.length} bài học</div>
        <h1 className="reader-title">{module.title}</h1>
        <p className="reader-lead">{module.intro ?? module.subtitle}</p>
        {!lessons.length ? <p style={{ color: "var(--r-muted)" }}>Các bài học sẽ được bổ sung theo tiến độ tự học.</p> : groups.map(group => <section key={group} style={{ marginBottom: "2.8rem" }}>
          <div className="reader-label" style={{ fontSize: 14 }}>{group}</div>
          <div>
            {lessons.filter(({ topic }) => (topic.group ?? "Khác") === group).map(({ topic, data }) => <div key={topic.id} style={{ padding: "1rem 0", borderTop: "1px solid var(--r-line)" }}>
              <Link href={`/${module.id}/${topic.id}`} style={{ display: "flex", gap: "1rem", textDecoration: "none", color: "inherit" }}>
                <span style={{ minWidth: "2rem", fontWeight: 700, color: "var(--r-accent)" }}>{String(topic.order).padStart(2, "0")}</span>
                <span>
                  <span style={{ fontWeight: 600, display: "block" }}>{topic.title}</span>
                  <span style={{ color: "var(--r-muted)", fontSize: 15, lineHeight: 1.6, display: "block", marginTop: ".15rem" }}>{data?.description ?? "Nội dung đang được soạn thảo."}</span>
                </span>
              </Link>
              {data && data.needs.length > 0 && <div className="reader-trail" style={{ margin: ".5rem 0 0 3rem" }}>
                <span><span className="reader-trail-label">Cần biết trước</span>
                  {data.needs.map((id, k) => { const n = titleOf.get(id); return n ? <span key={id}>{k > 0 && ", "}<Link href={`/${n.moduleId}/${id}`}>{n.title}</Link></span> : null; })}
                </span>
              </div>}
            </div>)}
          </div>
        </section>)}
        <p><Link href="/phong-van" className="reader-btn">Ôn câu hỏi phỏng vấn →</Link></p>
      </main>
    </div>
  </ReaderShell>;
}

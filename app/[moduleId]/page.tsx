import Link from "next/link";
import { notFound } from "next/navigation";
import { getModule, getRoadmap } from "@/lib/roadmap";
import { getDependencyGraph, getTopicContent } from "@/lib/markdown";
import DependencyMap from "@/components/DependencyMap";
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
  const nodes = graph.filter(node => node.moduleId === module.id);
  const isPractice = lessons.length > 0 && lessons.every(({ data }) => data?.layout === "practice");
  if (isPractice) {
    const parts = lessons.map(({ topic, data }) => ({
      topicId: topic.id,
      label: `${topic.group ?? "Thực hành"} · Phần ${String.fromCharCode(64 + topic.order)}`,
      title: topic.title,
      description: data?.description ?? "",
      steps: getPracticeSteps(data!.sections),
    }));
    return <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Link href="/#roadmap" className="text-sm text-text-muted hover:text-accent-red">← Roadmap 6 Module</Link>
      <p className="font-hand text-accent-red text-xl mt-6">Module {String(module.order).padStart(2, "0")} · Thực hành từng bước</p>
      <h1 className="text-3xl sm:text-4xl font-bold mt-2">{module.title}</h1>
      <p className="text-text-muted mt-3 max-w-2xl leading-relaxed">Làm theo thứ tự từ trên xuống. Mỗi bước có: mục tiêu, phần hiểu nhanh, code để gõ, kết quả bạn phải thấy và bài tập tự làm. Tiến độ được lưu trên trình duyệt này.</p>
      <PracticeRoadmap moduleId={module.id} parts={parts} />
    </div>;
  }
  return <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
    <Link href="/#roadmap" className="text-sm text-text-muted hover:text-accent-red">← Roadmap 6 Module</Link>
    <p className="font-hand text-accent-red text-xl mt-6">Module {String(module.order).padStart(2, "0")} · {module.topics.length} bài học</p>
    <h1 className="text-3xl sm:text-4xl font-bold mt-2">{module.title}</h1>
    <p className="text-text-muted italic mt-3">{module.subtitle}</p>
    {!lessons.length ? <div className="paper-card p-8 mt-8"><h2 className="text-xl font-bold">Chưa có nội dung</h2><p className="mt-2 text-text-muted">Các bài học sẽ được bổ sung theo tiến độ tự học.</p></div> : <>
      <div className="grid gap-6 md:grid-cols-2 mt-8">
        {groups.map(group => <section key={group} className="paper-card p-5 sm:p-7">
          <h2 className="font-hand text-accent-red text-2xl mb-4">{group}</h2>
          <ol className="space-y-5">
            {lessons.filter(({ topic }) => (topic.group ?? "Khác") === group).map(({ topic, data }) => <li key={topic.id}>
              <Link href={`/${module.id}/${topic.id}`} className="flex gap-3 group">
                <span className="font-mono text-sm text-accent-red pt-0.5">{String(topic.order).padStart(2, "0")}</span>
                <div className="min-w-0"><h3 className="font-semibold group-hover:text-accent-red">{topic.title}</h3><p className="text-sm text-text-muted mt-1 leading-relaxed">{data?.description ?? "Nội dung đang được soạn thảo."}</p></div>
              </Link>
            </li>)}
          </ol>
        </section>)}
      </div>
      <DependencyMap nodes={nodes} lookupNodes={graph} />
      <Link href="/phong-van" className="inline-block mt-8 notebook-button">Ôn câu hỏi phỏng vấn →</Link>
    </>}
  </div>;
}

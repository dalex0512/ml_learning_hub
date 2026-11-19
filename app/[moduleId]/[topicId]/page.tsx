import React from "react";
import { notFound } from "next/navigation";
import { getRoadmap, getModule, getAdjacentTopics } from "@/lib/roadmap";
import { getTopicContent, getBacklinks, getLessonLookup } from "@/lib/markdown";
import TopicBreadcrumb from "@/components/TopicBreadcrumb";
import { SlideLightbox } from "@/components/SlideViewer";
import PracticeLesson from "@/components/PracticeLesson";
import TheoryLesson from "@/components/TheoryLesson";

interface PageProps {
  params: {
    moduleId: string;
    topicId: string;
  };
}

export function generateStaticParams() {
  const roadmap = getRoadmap();
  const paths: { moduleId: string; topicId: string }[] = [];

  for (const mod of roadmap.modules) {
    for (const top of mod.topics) {
      paths.push({
        moduleId: mod.id,
        topicId: top.id,
      });
    }
  }

  return paths;
}

export default function TopicPage({ params }: PageProps) {
  const { moduleId, topicId } = params;
  const currentModule = getModule(moduleId);

  if (!currentModule) {
    notFound();
  }

  const topicItem = currentModule.topics.find((t) => t.id === topicId);
  if (!topicItem) {
    // If it's another topic that hasn't been written yet
    notFound();
  }

  // Read markdown file content
  const topicData = getTopicContent(moduleId, topicItem.file, topicId);

  const { prev, next, totalTopicsInModule, topicOrderInModule } =
    getAdjacentTopics(moduleId, topicId);

  // If topic file is not yet created on disk
  if (!topicData) {
    return (
      <div className="min-h-screen pb-20">
        <TopicBreadcrumb
          moduleId={currentModule.id}
          moduleTitle={currentModule.title}
          topicTitle={topicItem.title}
          currentOrder={topicOrderInModule + 1}
          totalTopics={totalTopicsInModule}
        />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <div className="paper-card p-10 max-w-lg mx-auto">
            <span className="font-hand text-accent-red text-2xl font-bold block mb-2">
              ~ Đang soạn thảo ~
            </span>
            <h1 className="text-xl font-bold text-text-main mb-3">
              {topicItem.title}
            </h1>
            <p className="text-text-muted text-sm mb-6">
              Nội dung chủ đề này đang được cập nhật theo tiến độ học của Duong.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="/01-machine-learning/what-is-ml"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-dark text-panel text-sm font-semibold hover:bg-black transition-all"
              >
                ← Xem Bài 01: What is ML
              </a>
              <a
                href="/#roadmap"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sticky border border-paper-border text-sm font-medium hover:bg-[#F3EEDD] transition-all"
              >
                Về Roadmap
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const backlinks = getBacklinks(topicId);
  const needs = getLessonLookup(topicData.needs);
  const toItem = (x: { module: { id: string }; topic: { id: string; title: string } } | null) =>
    x ? { moduleId: x.module.id, topicId: x.topic.id, title: x.topic.title } : null;


  if (topicData.layout === "practice") {
    return (
      <div className="min-h-screen">
        <PracticeLesson
          topicData={topicData}
          moduleId={currentModule.id}
          partLabel={`${topicItem.group ?? "Thực hành"} · Phần ${String.fromCharCode(64 + topicItem.order)}`}
          prev={toItem(prev)}
          next={toItem(next)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SlideLightbox />
      <TheoryLesson
        topicData={topicData}
        moduleId={currentModule.id}
        moduleTitle={currentModule.title}
        moduleOrder={currentModule.order}
        topicOrder={topicOrderInModule + 1}
        needs={needs}
        prev={toItem(prev)}
        next={toItem(next)}
        backlinks={backlinks}
      />
    </div>
  );
}

import React from "react";
import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import { getRoadmap, getModule, getAdjacentTopics } from "@/lib/roadmap";
import { getTopicContent, getBacklinks, getLessonLookup } from "@/lib/markdown";
import TopicBreadcrumb from "@/components/TopicBreadcrumb";
import TopicTOC from "@/components/TopicTOC";
import DynamicTopicPanels from "@/components/DynamicTopicPanels";
import TopicNavigation from "@/components/TopicNavigation";
import LessonMap from "@/components/LessonMap";
import { SlideButton, SlideLightbox } from "@/components/SlideViewer";
import { TopicHeroIllustration } from "@/components/TopicIllustrations";
import PracticeLesson from "@/components/PracticeLesson";

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

  const hasIllustration = fs.existsSync(
    path.join(process.cwd(), "public", "illustrations", `${topicItem.id}.png`)
  );
  const backlinks = getBacklinks(topicId);
  const needs = getLessonLookup(topicData.needs);
  const toItem = (x: { module: { id: string }; topic: { id: string; title: string } } | null) =>
    x ? { moduleId: x.module.id, topicId: x.topic.id, title: x.topic.title } : null;


  if (topicData.layout === "practice") {
    return (
      <div className="min-h-screen">
        <TopicBreadcrumb
          moduleId={currentModule.id}
          moduleTitle={currentModule.title}
          topicTitle={topicItem.title}
          currentOrder={topicOrderInModule + 1}
          totalTopics={totalTopicsInModule}
        />
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
    <div className="min-h-screen pb-20">
      {/* Top Breadcrumb & Progress bar */}
      <TopicBreadcrumb
        moduleId={currentModule.id}
        moduleTitle={currentModule.title}
        topicTitle={topicItem.title}
        currentOrder={topicOrderInModule + 1}
        totalTopics={totalTopicsInModule}
      />

      <SlideLightbox />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* Title Block theo Bản F */}
        <div className="mb-10 max-w-3xl">
          {/* Eyebrow Caveat đỏ */}
          {/* Eyebrow Patrick Hand đỏ */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-hand text-accent-red text-xl sm:text-2xl font-bold transform -rotate-1">
              Module {String(currentModule.order).padStart(2, "0")} · {currentModule.title} · Bài {String(topicOrderInModule + 1).padStart(2, "0")}
            </span>
          </div>

          {/* H1 Topic Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-main font-sans">
            {topicItem.title}
          </h1>

          {/* Subhead in nghiêng */}
          <p className="text-sm sm:text-base text-text-muted italic font-sans mt-2 leading-relaxed">
            {topicData.description}
          </p>

          <div className="mt-4 space-y-3">
            <LessonMap
              needs={needs}
              prev={toItem(prev)}
              current={topicItem.title}
              next={toItem(next)}
              backlinks={backlinks}
            />
            {topicData.slides && <SlideButton from={topicData.slides.from} to={topicData.slides.to} />}
          </div>

          <div className="mt-5">
            {hasIllustration && <TopicHeroIllustration topicId={topicItem.id} />}
          </div>
        </div>

        {/* 2-Column Layout theo Bản F */}
        <div className="flex items-start gap-8 lg:gap-10">
          {/* Left Column: 190px Sticky TOC with Scrollspy */}
          <TopicTOC sections={topicData.sections} />

          {/* Right Column: Sections from lesson content */}
          <div className="flex-1 min-w-0">
            <DynamicTopicPanels topicData={topicData} />

            {/* Bottom Prev / Next Navigation with 3D Page Flip */}
            <TopicNavigation prev={prev} next={next} />
            <a href="/phong-van" className="block mt-6 text-center font-hand text-accent-red text-xl underline decoration-dashed underline-offset-4">Ôn lại trong ngân hàng phỏng vấn →</a>
          </div>
        </div>
      </div>
    </div>
  );
}


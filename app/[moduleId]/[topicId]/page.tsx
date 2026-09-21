import React from "react";
import { notFound } from "next/navigation";
import { getRoadmap, getModule, getAdjacentTopics } from "@/lib/roadmap";
import { getTopicContent } from "@/lib/markdown";
import TopicBreadcrumb from "@/components/TopicBreadcrumb";
import TopicTOC from "@/components/TopicTOC";
import DynamicTopicPanels from "@/components/DynamicTopicPanels";
import TopicNavigation from "@/components/TopicNavigation";
import { TopicHeroIllustration } from "@/components/TopicIllustrations";

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

  // Descriptions for subhead
  const getSubhead = (id: string) => {
    switch (id) {
      case "what-is-ml":
        return "Bức tranh toàn cảnh phân định ranh giới giữa AI, Machine Learning, Deep Learning và Data Science từ góc nhìn dữ liệu.";
      case "feature-and-data-types":
        return "Hiểu bản chất cấu trúc bảng dữ liệu (tabular data), mẫu (sample), thuộc tính (feature) và cách phân biệt numerical vs categorical.";
      case "learning-paradigms":
        return "Ba phương thức học cốt lõi: Supervised learning (học có giám sát), Unsupervised learning và Reinforcement learning.";
      case "labeled-data":
        return "Phân tích cấu trúc dữ liệu có nhãn: ma trận đặc trưng (X) và vector nhãn mục tiêu (y) trước khi đưa vào mô hình.";
      case "model-training-pipeline":
        return "Quá trình đưa vector đặc trưng qua mô hình để sinh ra dự đoán, chuẩn bị cho bước tính toán sai số bằng hàm mất mát.";
      case "loss-function":
        return "Hàm mục tiêu đo lường mức độ sai lệch giữa dự đoán và thực tế, đóng vai trò người chỉ đường để thuật toán tự sửa chữa sai sót qua từng vòng lặp huấn luyện.";
      default:
        return "Ghi chú trọng tâm từ khóa học, kết hợp giải thích trực quan, ví dụ tính tay và mã nguồn thực thi.";
    }
  };

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10">
        {/* Title Block theo Bản F */}
        <div className="mb-10 max-w-3xl">
          {/* Eyebrow Caveat đỏ */}
          {/* Eyebrow Patrick Hand đỏ */}
          <div className="flex items-center gap-2 mb-2">
            <span className="font-hand text-accent-red text-xl sm:text-2xl font-bold transform -rotate-1">
              Module 0{currentModule.order} · {currentModule.title} · Bài 0{topicOrderInModule + 1}
            </span>
          </div>

          {/* H1 Topic Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-text-main font-sans">
            {topicItem.title}
          </h1>

          {/* Subhead in nghiêng */}
          <p className="text-sm sm:text-base text-text-muted italic font-sans mt-2 leading-relaxed">
            {getSubhead(topicItem.id)}
          </p>

          <div className="mt-5">
            <TopicHeroIllustration topicId={topicItem.id} />
          </div>
        </div>

        {/* 2-Column Layout theo Bản F */}
        <div className="flex items-start gap-8 lg:gap-10">
          {/* Left Column: 190px Sticky TOC with Scrollspy */}
          <TopicTOC sections={topicData.sections} />

          {/* Right Column: 6 Continuous Paper Panels */}
          <div className="flex-1 min-w-0">
            <DynamicTopicPanels topicData={topicData} />

            {/* Bottom Prev / Next Navigation with 3D Page Flip */}
            <TopicNavigation prev={prev} next={next} />
          </div>
        </div>
      </div>
    </div>
  );
}


import fs from "fs";
import path from "path";

export interface TopicItem {
  id: string;
  order: number;
  title: string;
  file: string;
}

export interface ModuleItem {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  topics: TopicItem[];
}

export interface RoadmapData {
  source: string;
  modules: ModuleItem[];
}

const ROADMAP_PATH = path.join(process.cwd(), "roadmap.json");

export function getRoadmap(): RoadmapData {
  const fileContents = fs.readFileSync(ROADMAP_PATH, "utf-8");
  return JSON.parse(fileContents);
}

export function getModule(moduleId: string): ModuleItem | undefined {
  const roadmap = getRoadmap();
  return roadmap.modules.find((m) => m.id === moduleId);
}

export function getAllFlattenedTopics(): { module: ModuleItem; topic: TopicItem }[] {
  const roadmap = getRoadmap();
  const list: { module: ModuleItem; topic: TopicItem }[] = [];
  for (const mod of roadmap.modules) {
    for (const top of mod.topics) {
      list.push({ module: mod, topic: top });
    }
  }
  return list;
}

export function getAdjacentTopics(moduleId: string, topicId: string) {
  const list = getAllFlattenedTopics();
  const index = list.findIndex(
    (item) => item.module.id === moduleId && item.topic.id === topicId
  );

  return {
    prev: index > 0 ? list[index - 1] : null,
    next: index >= 0 && index < list.length - 1 ? list[index + 1] : null,
    currentIndex: index,
    totalTopicsInModule:
      getModule(moduleId)?.topics.length || 0,
    topicOrderInModule:
      getModule(moduleId)?.topics.findIndex((t) => t.id === topicId) ?? -1,
  };
}


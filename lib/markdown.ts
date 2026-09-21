import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface SectionContent {
  id: string;
  number: number;
  title: string;
  rawContent: string;
}

export interface TopicData {
  title: string;
  order: number;
  moduleId: string;
  topicId: string;
  sections: SectionContent[];
}

const SECTION_CONFIG = [
  { number: 1, id: "y-tuong", title: "1. Ý tưởng" },
  { number: 2, id: "vi-tri-pipeline", title: "2. Vị trí trong pipeline" },
  { number: 3, id: "cong-thuc", title: "3. Công thức / Cách hoạt động" },
  { number: 4, id: "vi-du-tay", title: "4. Ví dụ tay" },
  { number: 5, id: "code", title: "5. Code Python" },
  { number: 6, id: "cau-hoi-kiem-tra", title: "6. Câu hỏi tự kiểm tra" },
];

export function getTopicContent(moduleId: string, filename: string, topicId: string): TopicData | null {
  const filePath = path.join(process.cwd(), "content", moduleId, filename);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContents);

  // Split content by ## headings
  const sectionParts = content.split(/^##\s+/m);
  const sections: SectionContent[] = [];

  for (let i = 1; i < sectionParts.length; i++) {
    const part = sectionParts[i];
    const firstLineEnd = part.indexOf("\n");
    const heading = firstLineEnd !== -1 ? part.slice(0, firstLineEnd).trim() : part.trim();
    const body = firstLineEnd !== -1 ? part.slice(firstLineEnd).trim() : "";

    // Determine section index (1-based)
    const match = heading.match(/^(\d+)\.\s*(.*)$/);
    const num = match ? parseInt(match[1], 10) : i;
    const title = match ? match[2] : heading;
    const config = SECTION_CONFIG.find((s) => s.number === num) || {
      id: `section-${num}`,
      number: num,
      title: heading,
    };

    sections.push({
      id: config.id,
      number: num,
      title: heading,
      rawContent: body,
    });
  }

  return {
    title: data.title || "Topic",
    order: data.order || 1,
    moduleId,
    topicId,
    sections,
  };
}


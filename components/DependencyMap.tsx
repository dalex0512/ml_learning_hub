import Link from "next/link";
import type { DependencyNode } from "@/lib/markdown";

export default function DependencyMap({ nodes, lookupNodes = nodes }: {
  nodes: DependencyNode[];
  lookupNodes?: DependencyNode[];
}) {
  const lookup = new Map(lookupNodes.map(node => [node.topicId, node]));
  const groups = Array.from(new Set(nodes.map(node => node.group)));
  return <section className="paper-card p-5 sm:p-7 mt-10" aria-labelledby="dependency-title">
    <p className="font-hand text-accent-red text-lg">Đọc trước → hiểu tiếp</p>
    <h2 id="dependency-title" className="text-xl font-bold mt-1">Bản đồ phụ thuộc</h2>
    <p className="text-sm text-text-muted mt-2 mb-6">Trong mỗi thẻ, các bài phía trên mũi tên là kiến thức cần đọc trước bài phía dưới. Bấm vào tên để mở bài; thứ tự trên roadmap là lộ trình gợi ý.</p>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      {groups.map(group => <div key={group} className="min-w-0">
        <h3 className="font-hand text-accent-red text-lg mb-3">{group}</h3>
        <ol className="space-y-3">
          {nodes.filter(node => node.group === group).map(node => <li key={node.topicId} className="rounded-lg border border-dashed border-paper-dashed-dark bg-sticky/60 p-3 min-w-0">
            {node.needs.length ? <>
              <ul className="space-y-1 text-xs text-text-muted" aria-label="Kiến thức cần trước">
                {node.needs.map(id => {
                  const prerequisite = lookup.get(id);
                  return prerequisite ? <li key={id}><Link href={`/${prerequisite.moduleId}/${id}`} className="hover:text-accent-red underline decoration-dashed underline-offset-2">{String(prerequisite.order).padStart(2, "0")} · {prerequisite.title}</Link></li> : null;
                })}
              </ul>
              <div className="text-accent-red text-lg my-1" aria-label="dẫn tới">↓</div>
            </> : <p className="text-xs text-text-sub mb-2">Điểm bắt đầu</p>}
            <Link href={`/${node.moduleId}/${node.topicId}`} className="block text-sm font-semibold hover:text-accent-red break-words"><span className="font-mono text-accent-red">{String(node.order).padStart(2, "0")}</span> · {node.title}</Link>
          </li>)}
        </ol>
      </div>)}
    </div>
  </section>;
}

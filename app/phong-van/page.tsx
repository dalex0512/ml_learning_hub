import InterviewBank from "@/components/InterviewBank";
import ReaderShell from "@/components/ReaderShell";
import { getAllQuizItems } from "@/lib/markdown";

export const metadata = { title: "Ôn phỏng vấn | ML Learning Hub" };

export default function InterviewPage() {
  const items = getAllQuizItems();
  return (
    <ReaderShell backHref="/#roadmap" backLabel="Lộ trình" title="Ngân hàng phỏng vấn">
      <div className="reader-layout" style={{ display: "block" }}>
        <main className="reader-main" style={{ margin: "0 auto" }}>
          <div className="reader-eyebrow">Ôn tập</div>
          <h1 className="reader-title">Ngân hàng phỏng vấn</h1>
          <p className="reader-lead">
            Câu hỏi lý thuyết và tình huống rút ra từ các bài học. Trả lời thành lời trước, mở đáp án sau, rồi quay về bài gốc khi cần đọc lại. Các câu bạn đã mở được nhớ trên trình duyệt này.
          </p>
          <InterviewBank items={items} />
        </main>
      </div>
    </ReaderShell>
  );
}

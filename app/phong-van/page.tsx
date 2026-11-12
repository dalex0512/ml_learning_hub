import Link from "next/link";
import InterviewBank from "@/components/InterviewBank";
import { getAllQuizItems } from "@/lib/markdown";

export const metadata = { title: "Ôn phỏng vấn | ML Learning Hub" };

export default function InterviewPage() {
  const items = getAllQuizItems();
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
    <Link href="/" className="text-sm text-text-muted hover:text-accent-red">← Trang chủ</Link>
    <p className="font-hand text-accent-red text-xl mt-6">Gấp vở lại, thử trả lời thành lời</p>
    <h1 className="text-3xl sm:text-4xl font-bold mt-2">Ngân hàng phỏng vấn</h1>
    <p className="text-text-muted mt-3 mb-8 max-w-2xl">Ôn lý thuyết và tình huống doanh nghiệp từ các bài học. Trả lời trước, mở đáp án sau; quay về bài gốc khi cần đọc lại.</p>
    <InterviewBank items={items} />
  </div>;
}

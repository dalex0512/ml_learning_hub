# Prompt cho Codex — đợt 2: cập nhật theo ghi chú đến hết slide 63

Dán nguyên khối dưới đây cho Codex. Repo: `d:\ML_VNAI`, nhánh `main`.

```
Dự án ML Learning Hub (Next.js 14, ghi chú tự học ML của chủ repo). Đợt 1 đã
xong: 21 bài ở content/01-machine-learning/ đã chuyển sang khung linh hoạt
(:::intro/:::slides/:::formula/:::worked/:::compare/:::pitfall/:::recap/:::quiz/
:::next, quiz 3 tầng A/B/C, link [[bài:id]] [[slide:N]], slide viewer).

ĐỌC TRƯỚC, theo thứ tự:
1. codex-handoff.md  — cú pháp, quy trình viết bài, pitfalls, checklist verify.
2. project-brief.md  — design Notebook, quy ước nội dung.
3. lesson-restructure-report.md — kết quả đợt 1.
4. 2–3 bài đã chuyển làm mẫu giọng văn: 12-classification-metrics.md,
   17-missing-values-outliers.md, 21-imbalanced-data.md.
Mọi quy ước trong codex-handoff.md vẫn áp dụng nguyên; prompt này chỉ nói phần mới.

MỤC TIÊU ĐỢT 2
Chủ repo vừa học xong đến hết slide 63 và gửi ghi chú tay (ở cuối prompt). Việc:
(A) đối chiếu ghi chú với các bài 16–21 hiện có, bổ sung phần còn thiếu / sai lệch;
(B) viết bài mới cho phần slide 55–63 (chưa có bài nào);
(C) cập nhật roadmap, liên kết, trang phỏng vấn, index module, brief.
Ghi chú của chủ repo là nguồn "điều thầy nhấn mạnh" — giữ ý và cách diễn đạt
của họ, nhưng viết lại cho khoa học, đúng kỹ thuật, có giải thích vì sao.

BƯỚC 0 — Xem slide thật (bắt buộc, không đoán)
- Ảnh slide ở public/slides/slide-NNN.webp. Xem lần lượt slide 39–63, đặc biệt
  55–63 (chưa bài nào map). Ghi lại mỗi slide nói gì, kể cả chú thích tay/ảnh
  biểu đồ. Ghi ánh xạ slide → bài ở đầu báo cáo cuối.
- Ghi chú đề cập "Slide 46: Loại bỏ Outlier" nhưng mapping hiện tại là 45–46 =
  bài 17, 47 = bài 18. Đối chiếu slide thật xem số đó đúng chưa; nếu frontmatter
  `slides` của bài 17/18 lệch thì sửa.

PHẦN A — Đối chiếu bài cũ với ghi chú (sửa trực tiếp, không viết lại cả bài)
A1. 17-missing-values-outliers.md
  - Dữ liệu số bị khuyết: xoá hàng chỉ khi tỉ lệ rất nhỏ (<~5%); điền mean/median,
    ưu tiên median vì ít bị outlier ảnh hưởng. Categorical (ordinal/nominal):
    điền mode (giá trị xuất hiện nhiều nhất).
  - Nhược điểm của điền mean/median/mode (ghi chú có ảnh minh hoạ): làm méo phân
    phối gốc, co hẹp phương sai, làm yếu tương quan giữa các feature. Giải thích
    đúng bản chất + 1 ví dụ số tay (tính lại std trước/sau khi điền, kiểm bằng Python).
  - MissForest: dùng random forest dự đoán giá trị thiếu từng cột, lặp đến hội tụ
    → giữ được phân bố/quan hệ giữa các cột. Ghi chú nói "tần suất cao điền nhiều,
    thấp điền ít" — hiểu đúng là điền theo phân phối/quan hệ có điều kiện, hãy diễn
    đạt chính xác hơn, nhưng nêu rõ đó là điều ghi chú muốn nói. Thêm code ví dụ
    (thư viện missforest hoặc IterativeImputer + RandomForest của sklearn; chọn
    cái chạy được, ghi rõ pip install). Nhắc fit imputer CHỈ trên train (data leakage).
  - Outlier: KHÔNG phải lúc nào cũng loại. Ví dụ ung thư/gian lận: outlier chính là
    thứ cần phát hiện. Thêm :::pitfall + câu hỏi tầng C "khi nào không được xoá outlier".
  - Kiểm tra bài đã có mục này chưa; chưa có thì thêm, có rồi thì chỉ bổ sung ý thiếu.
A2. 18-feature-scaling.md
  - Lý do cần scale: mô hình bị feature có dải giá trị lớn chi phối (ví dụ Ox 0–10 km
    vs Oy 0–10000 m: cùng độ dài nhưng số lớn hơn → được "chú ý" hơn; trên Diabetes
    dataset, DiabetesPedigreeFunction dải 0–2 bị lấn át). Làm rõ: đúng với mô hình
    dựa khoảng cách/gradient (KNN, SVM, linear/NN), cây quyết định thì không cần.
  - MinMaxScaler: x' = (x − min)/(max − min), về [0,1]; nhược điểm: nhạy outlier
    (1 outlier kéo giãn cả dải, dữ liệu còn lại bị nén). StandardScaler: (x − μ)/σ,
    nếu gần chuẩn thì ~[−3,3]; vẫn bị outlier ảnh hưởng nhưng nhẹ hơn MinMax.
    Đối chiếu với nội dung hiện có; bổ sung ví dụ số nếu thiếu.
A3. 20-correlation-multicollinearity.md (Step 3.4)
  - Mô hình phi tuyến (cây, boosting…) không khai thác quan hệ tuyến tính nên đa
    cộng tuyến ít ảnh hưởng → không nhất thiết bỏ. Mô hình tuyến tính: nên bỏ
    feature cộng tuyến (ổn định hệ số, chạy nhanh hơn). Tóm lại: feature–target
    tương quan bậc 1 là tốt; feature–feature tương quan là xấu (với mô hình tuyến tính).
  - Thêm cảnh báo: "ít ảnh hưởng độ chính xác" ≠ "không ảnh hưởng khả năng diễn giải
    (feature importance bị chia/lệch)". Câu hỏi phỏng vấn tầng B/C xoay quanh điều này.
A4. 21-imbalanced-data.md (Step 3.5 — chỉ cho phân loại, hồi quy không có)
  - Thường class cần quan tâm là class thiểu số (ung thư, spam) → làm bớt lệch.
  - Over-sampling: nhân bản chỉ làm model gặp mẫu nhiều hơn chứ không đa dạng hơn
    → overfit; giải pháp tạo dữ liệu tổng hợp: SMOTE, ADASYN (giống data cũ nhưng
    có điểm mới). Under-sampling: bỏ bớt mẫu class đa số, nhược điểm có thể mất dữ
    liệu tốt. Đối chiếu bài hiện có đã nêu đủ chưa, bổ sung phần thiếu.
  - Bắt buộc có: chỉ resample trên TRAIN (không động vào val/test), và nhắc vì sao
    accuracy vô nghĩa khi lệch ([[bài:classification-metrics]]).
A5. Với mỗi bài sửa: cập nhật `description`, `needs`, `tags` nếu đổi; thêm/ điều
    chỉnh câu quiz cho phần mới (tầng A hiểu bài, B lý thuyết phỏng vấn, C tình
    huống doanh nghiệp). Không xoá kiến thức cũ.

PHẦN B — Bài mới cho slide 55–63
Sau BƯỚC 0 quyết định chia bài dựa trên nội dung slide thật. Theo ghi chú, dự kiến:
- Bài 22: Step 4 — Data Visualization (matplotlib). 5 loại biểu đồ, kèm nhận xét
  của chủ repo về mức độ hay dùng và khi nào dùng:
    1. Histogram — rời rạc hoá, nhìn toàn cảnh phân bố (dễ, hay dùng nhất)
    2. Density plot — bản "liên tục hoá" của histogram
    3. Box plot — tứ phân vị, outlier (ít dùng)
    4. Correlation matrix plot — chỉ cho dữ liệu số, hay dùng; nối sang
       [[bài:correlation-multicollinearity]]
    5. Scatter matrix plot — ít dùng
  Mỗi loại: dùng để trả lời câu hỏi gì, đọc thế nào, bẫy diễn giải (ví dụ histogram
  phụ thuộc số bin, correlation ≠ causation), code matplotlib/pandas chạy được
  trên Diabetes dataset (nếu có file dữ liệu trong repo thì dùng, nếu không dùng
  sklearn.datasets / dữ liệu giả lập, ghi rõ). Thêm bảng "câu hỏi → biểu đồ nên
  dùng". Nếu slide 55–63 có thêm nội dung trực quan hoá khác, gộp vào.
- Bài 23: Regular Expression (RegEx) — định nghĩa pattern cần tìm rồi dò trong
  chuỗi đầu vào. Slide thật có thể đi sâu hơn ghi chú: đọc kỹ rồi viết đủ. Gợi ý
  khung: regex là gì / vì sao dân data cần (làm sạch text, trích email/số điện
  thoại/ngày, kiểm tra định dạng) → cú pháp cơ bản (ký tự, lớp ký tự, lượng từ,
  anchor, group) → ví dụ làm tay từng bước (:::worked khớp từng ký tự) → code
  Python `re` (search/match/findall/sub, khác biệt search vs match) → bẫy (greedy vs
  lazy, escape, catastrophic backtracking) → công cụ thử regex (regexr.com).
- Nếu slide 55–63 chứa thêm chủ đề khác (kể cả Step 5 bắt đầu), tách bài riêng
  theo cùng cách và nêu rõ trong báo cáo. Nếu ít hơn dự kiến thì gộp.
Với mỗi bài mới:
  - File content/01-machine-learning/NN-<slug>.md, frontmatter đủ: title, order,
    description, slides (range thật), needs, tags.
  - Cấu trúc như bài mẫu: :::intro → :::slides → thân bài tự do → :::recap →
    :::quiz (A ≥4, B ≥4, C ≥2–3 câu, đáp án ẩn, B có EN, C có WANT) → :::next.
  - Mọi số liệu/ví dụ tay kiểm lại bằng Python trước khi ghi.
  - Chèn [[slide:N]] đúng slide thật.

PHẦN C — Roadmap & liên kết
- Thêm bài mới vào roadmap.json (bài 22 cùng group "Quy trình ML & tiền xử lý dữ
  liệu"; bài regex cùng group hoặc group riêng "Công cụ hỗ trợ" — chọn và nêu lý
  do). order liên tục, id khớp tên file.
- Cập nhật `:::next` của bài 21 cho khớp bài kế tiếp.
- Thêm [[bài:...]] chéo: bài 15 (pipeline) ↔ bài 22 (Step 4); bài 20 ↔ bài 22
  (correlation matrix plot); bài 17 ↔ bài 21 (outlier/imbalance cùng Step 3).
- Bài 15 là "bản đồ pipeline": đảm bảo nó trỏ đúng bài cho mỗi step, gồm Step 4.
- Cập nhật module index + bản đồ phụ thuộc (/01-machine-learning), kiểm
  /phong-van tự gom câu B/C của bài mới, project-brief.md (số bài, danh sách bài).
- Chỗ hard-code "21 bài" trong code/UI/README thì sửa (grep "21").

VERIFY (như codex-handoff.md, thêm)
- npm run build pass; mọi trang tĩnh sinh ra, không warning mới.
- Các bài sửa + 2 bài mới render đúng: TOC, slide chip mở đúng slide, link chéo
  đúng URL, quiz 3 tầng, code có nút copy, không tràn ngang ở 390px.
- /phong-van có câu của bài mới; module index/dependency map có bài mới.
- Không còn ký tự lạ (½…) trong code block (xem pitfalls trong handoff).
- Chạy lại mọi phép tính trong ví dụ tay bằng Python.

GIT
- Tạo nhánh feat/lesson-extend-55-63 từ main. Commit nhỏ theo nhóm
  (fix(content) bài cũ; feat(content) từng bài mới; feat cho roadmap/index).
- KHÔNG push, KHÔNG merge. Dừng và báo cáo để chủ repo duyệt.

BÁO CÁO CUỐI (ngắn): ánh xạ slide 39–63 → bài; thay đổi từng bài cũ; bài mới đã
tạo; điểm ghi chú của chủ repo mâu thuẫn hoặc chưa chính xác về kỹ thuật (nêu rõ
để họ quyết); việc chưa làm được.

--- GHI CHÚ CỦA CHỦ REPO (nguồn gốc, giữ ý) ---
[dán nguyên phần ghi chú bên dưới vào đây]
```

## Ghi chú của chủ repo (dán vào cuối prompt, thay dòng "[dán...]")

Đối với dữ liệu dạng bảng (Numerical features) bị khuyết, ta có các cách sau:

- Xoá các hàng có ô bị khuyết, tuy nhiên chỉ xoá khi tỉ lệ các hàng bị xoá rất nhỏ (khoảng dưới 5%)
- Điền vào các ô bị khuyết: với ô dạng số, lấy mean hoặc median của các ô không bị khuyết để điền. Nên dùng median trong hầu hết các trường hợp vì ít bị ảnh hưởng bởi outlier.

Còn với dữ liệu categorical feature (ordinal, nominal), lấy giá trị xuất hiện nhiều nhất (mốt) để điền.

→ NHƯỢC ĐIỂM (có ảnh minh hoạ trong slide)

Từ đó, ta dùng MissForest, vẫn đảm bảo độ phân bố dữ liệu ban đầu, dữ liệu nào tần suất cao thì điền nhiều, tần suất thấp thì điền ít. (Có thư viện hỗ trợ)

NOTE: Tips and Tricks for Data Science — Daily Dose of Data Science | Avi Chawla | Substack

### Slide 46: Loại bỏ Outlier

Có nhiều trường hợp không nên / không được phép loại bỏ outlier, mà cần tập trung đánh giá outlier. Ví dụ phát hiện người bị ung thư (là outlier).

Khi đưa dữ liệu vào mô hình huấn luyện, mô hình sẽ chú ý các feature có dải dữ liệu lớn. Ví dụ trong hệ trục Oxy, Ox từ 0 tới 10 km, Oy từ 0 tới 10000 m, tuy cùng giá trị nhưng dải số lớn hơn nên được tập trung nhiều hơn. Ví dụ bảng Diabetes: mô hình sẽ không để ý cột DiabetesPedigreeFunction vì dải giá trị quá thấp (loanh quanh 0 → 2).

→ Cần đưa các giá trị về cùng một dải tương đương nhau. Có 2 cách (slide sau), dùng sklearn:

- MinMaxScaler: ở từng ô, X = (X − min) / (Xmax − Xmin) → tất cả về cùng một dải như ảnh. Nhược điểm: dễ bị ảnh hưởng bởi outlier.
- StandardScaler: tính 2 thứ: μ (kỳ vọng/trung bình) và σ (độ lệch chuẩn). (Giá trị gốc − μ) / σ → giá trị mới. Giả sử phân phối chuẩn, kỳ vọng = 0, độ lệch chuẩn = 1 → dải giá trị mới nằm khoảng [−3; 3] → Gaussian distribution. Vẫn bị ảnh hưởng bởi outlier, nhưng nhẹ hơn MinMaxScaler.

### Lesson 6

Step 3.4: Mối quan hệ giữa các variables

- Những mô hình phi tuyến bản chất không khai thác mối quan hệ tuyến tính, nên feature có đa cộng tuyến không ảnh hưởng — vì mô hình không quan tâm — nên không nhất thiết phải bỏ.
- Mô hình tuyến tính nên bỏ đi để mô hình chạy nhanh hơn.
- Nói tóm lại: quan hệ bậc 1 (tuyến tính) giữa feature và target thì tốt, còn feature với nhau thì không.

Step 3.5: Balance Data — dành cho bài toán phân loại (bài toán hồi quy không có).

Thường class mà ta quan tâm, tập trung hơn là class thiểu số (ung thư, email spam). Muốn mô hình dự đoán tốt hơn cho class thiểu số thì làm cho sự chênh lệch giữa các class bớt lệch đi → kỹ thuật Balance Data. Mục đích hướng đến làm cho dữ liệu đỡ mất cân bằng.

Có 2 cách:

1. Over-sampling (tăng cường dữ liệu cho class thiểu số). Nhược điểm: mô hình gặp sample của class thiểu số thường xuyên hơn nhưng không đa dạng hơn (vì vẫn là sample đó nhưng gặp nhiều hơn). Muốn class thiểu số được mô hình gặp vừa nhiều vừa đa dạng, ta tạo dữ liệu tổng hợp (hao hao giống data cũ nhưng có những điểm mới), có 2 cách: SMOTE và ADASYN.
2. Under-sampling: bỏ bớt sample đi. Nhược điểm là có thể mất dữ liệu tốt.

Step 4: Data Visualization — trực quan hoá dữ liệu (thư viện matplotlib)

1. Histogram: rời rạc hoá, cho góc nhìn toàn cảnh về dữ liệu (dễ, hay dùng)
2. Density Plot: liên tục hoá
3. Box Plot: ít dùng, cho biết tứ phân vị
4. Correlation Matrix Plot: miễn là dữ liệu dạng số, thường dùng
5. Scatter Matrix Plot: ít dùng

Regular Expression (RegEx): định nghĩa pattern (khuôn mẫu) thứ muốn tìm, rồi tìm trong input đầu vào có thông tin đó không. (regexr.com)

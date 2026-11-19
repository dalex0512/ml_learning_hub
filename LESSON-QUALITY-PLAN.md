# LESSON-QUALITY-PLAN — đợt nâng chất từng bài lý thuyết

File này vừa là **kế hoạch**, vừa là **bảng theo dõi tiến độ**. Ai tiếp tục công việc (kể cả sau khi mất ngữ cảnh) chỉ cần đọc file này, rồi làm bài đầu tiên chưa được tick `[x]`. Đọc kèm `LESSON-REDESIGN-PLAN.md` (nguyên tắc và khuôn) và `PRACTICE-GUIDE.md` (nguyên tắc dạy chung).

**Bối cảnh:** cả 31 bài đã chuyển sang khuôn *lõi + Đào sâu*, nhưng 27 bài viết nhanh. Đợt này làm **từng bài một, thật kỹ**, mục tiêu: người học đọc đến đâu hiểu đến đó và đọc lại sau vài ngày vẫn dựng lại được ý chính.

## 1. Chuẩn chất lượng của một bài (phải đạt hết mới tick)

**Cấu trúc lõi (trước mục "Câu hỏi tự kiểm tra"):**
1. **6 đến 8 nhịp**, mỗi nhịp một ý, tiêu đề là câu hỏi hoặc phát biểu có nội dung. Lõi **1.500 đến 2.500 từ**.
2. Mở bằng `:::intro` (3 mục tiêu cụ thể, kiểm tra được), rồi **một tình huống cụ thể hoặc một thứ "sẽ hỏng"** trước khi định nghĩa.
3. **Ít nhất 1 ví dụ làm tay đầy đủ** bằng `:::steps` (số nhỏ, mỗi bước một phép tính, kết quả cuối kiểm được).
4. **Ít nhất 3 khối** `:::predict` hoặc `:::ck` (đoán trước, kiểm hiểu), đáp án giải thích **vì sao**, không chỉ nêu kết quả.
5. Một mục **"hiểu sai thường gặp"** (bẫy lớn nhất 2 đến 4 điều) viết thành văn xuôi có ví dụ.
6. **Công cụ tương tác** (`:::widget`) nếu thẻ thiết kế yêu cầu; nếu chưa có công cụ thì thêm vào bộ chung.
7. **Cầu nối:** liên kết `[[bài:...]]` tới bài tiên quyết và bài sau; bài nào có phần tương ứng ở **Project** thì dùng **cùng số liệu** và nêu "Project Bước N".
8. **Từ điển tại chỗ:** ít nhất 5 thuật ngữ mới dùng `[[từ:khoá]]` (thêm vào `content/glossary.json`).
9. `:::slides` đúng dải slide; mọi mô tả về slide phải khớp với ảnh slide thật (`public/slides/slide-NNN.webp`).
10. Cuối lõi có `:::card` (thẻ nhớ ≤ 8 dòng).

**Nội dung và số liệu:**
11. **Mọi con số** (tính tay, ví dụ, Diabetes) được chạy bằng Python; file kiểm đặt ở `scripts/theory_checks/NN-ten-bai.py` (in ra các số đã dùng).
12. Kết quả không như kỳ vọng thì ghi đúng như chạy và giải thích.
13. Không xóa kiến thức đúng: phần cũ còn giá trị nằm ở làn `## [sâu]` (đã có sẵn).
14. **Quiz** (ngân hàng phỏng vấn) giữ nguyên định dạng: tầng A ≥ 3, tầng B ≥ 3 (có `EN:`), tầng C ≥ 2 (có `WANT:`). Thiếu thì bổ sung; câu hỏi mới phải bám nội dung bài.

**Kiểm tra cuối mỗi bài:** `npx tsc --noEmit`; `npm run build`; mở trang xem thật (hoặc chụp ảnh); thử "đọc lại sau vài ngày": chỉ đọc tiêu đề các nhịp và thẻ nhớ có dựng lại được câu chuyện không; commit riêng cho bài (`feat(theory): deepen NN tên-bài`).

## 2. Quy trình cho mỗi bài

1. **Đọc** bài hiện tại: `content/0X-.../NN-....md` (cả lõi và làn sâu), cùng slide gốc của bài (xem vài ảnh slide nếu bài phụ thuộc slide).
2. **Viết file kiểm số** `scripts/theory_checks/NN-ten-bai.py`, chạy, ghi lại các số.
3. **Viết lõi mới** vào file tạm (ví dụ `/tmp/p/coreNN.md`), theo chuẩn mục 1.
4. **Thay lõi:** `python scripts/lesson_recompose.py <file bài> <core.md> ["mô tả mới"]` (giữ nguyên quiz, mục nối bài và làn Đào sâu).
5. **Công cụ mới (nếu cần):** thêm component trong `components/widgets/`, đăng ký ở `components/widgets/index.tsx`, thêm dữ liệu vào `scripts/make-widget-data.py` nếu cần dữ liệu thật.
6. **Kiểm tra** và **commit** (mục 1, cuối). Tick bài trong bảng bên dưới và ghi ngày.

Lưu ý kỹ thuật khi viết lõi: tiêu đề `:::predict` và `:::ck` để trống (nhãn có sẵn); trong bash tránh heredoc chứa dấu nháy đơn, dùng công cụ Write; `[[từ:khoá]]` phải có trong glossary; khối `:::` không lồng nhau.

## 3. Việc cần làm ngoài từng bài

| Việc | Trạng thái |
|---|---|
| Trang phỏng vấn `/phong-van` đổi sang giao diện đọc (sáng/tối, nhớ câu đã mở) | `[x]` xong |
| Bộ công cụ bổ sung cho bài chưa có công cụ: `column-peel`, `paradigm-chooser`, `xy-table`, `param-knob`, `fold-compare`, `scenario-cards`, `flow-map`, `describe-table`, `impute-compare`, `encode-table`, `viz-chooser`, `regex-tester`, `algo-filter` | `[ ]` làm cùng bài tương ứng |
| Cuối đợt: chạy lại toàn bộ file kiểm số; kiểm liên kết `[[bài:...]]` không chết; build toàn site | `[ ]` |
| Cập nhật `project-brief.md` | `[ ]` |

## 4. Bảng theo dõi từng bài

Cột "Cần nâng" là điều tôi thấy còn thiếu ở bản viết nhanh. `P` = bốn bài thí điểm (đã làm kỹ hơn; vẫn rà lại theo chuẩn).

### Module 01

| # | Bài | Cần nâng | Công cụ | Xong |
|---|---|---|---|---|
| 01 | what-is-ml | ví dụ spam có số liệu; bản đồ vòng tròn bấm được; bài "gọi đúng tên" | `flow-map` | `[ ]` |
| 02 | feature-and-data-types | bảng Diabetes bóc cột; phân biệt ordinal/nominal bằng ví dụ; dtype đánh lừa với code | `column-peel` | `[ ]` |
| 03 | learning-paradigms | cây chọn phương thức; 6 tình huống; bảng ví dụ thật cho từng loại | `paradigm-chooser` | `[ ]` |
| 04 | labeled-data | bảng bấm hàng ra x⁽ⁱ⁾, y⁽ⁱ⁾; demo xáo lệch X và y bằng số | `xy-table` | `[ ]` |
| 05 | model-training-pipeline | núm vặn a: kéo thấy loss, nút "một bước cập nhật"; vì sao bước nhảy η quan trọng | `param-knob` | `[ ]` |
| 06 | loss-function | thêm ví dụ giá nhà đầy đủ; L1/L2/Huber ngắn; loss với metric | có `loss-outlier` | `[ ]` |
| 07 | train-test-split | rò rỉ qua lựa chọn lặp (mô phỏng 20 lần chỉnh); chia theo nhóm; stratify | có `split-bar` | `[ ]` |
| 08 | k-fold-cross-validation | P: rà lại; thêm leave-one-out ngắn | có `fold-visualizer` | `[ ]` |
| 09 | stratified-k-fold | công cụ so KFold và Stratified; số liệu xác suất | `fold-compare` | `[ ]` |
| 10 | classification-vs-regression | tám thẻ tình huống bấm được; loss/metric tương ứng | `scenario-cards` | `[ ]` |
| 11 | confusion-matrix | P: rà lại | có `confusion-sorter` | `[ ]` |
| 12 | classification-metrics | P: rà lại | có `threshold-matrix` | `[ ]` |
| 13 | roc-auc | ví dụ Diabetes thật (ROC 154 mẫu); PR curve; chọn ngưỡng Youden | có `roc-sweep` | `[ ]` |
| 14 | regression-metrics | MAPE/R² chi tiết; so MAE vs RMSE trên Diabetes-style; code kiểm | có `loss-outlier` | `[ ]` |
| 15 | ml-pipeline | sơ đồ bấm được 7 bước; mỗi bước thẻ 4 dòng; liên kết Project từng bước | `flow-map` | `[ ]` |
| 16 | descriptive-statistics | bảng describe bấm được; tính tay describe 15 hàng; phân bố class | `describe-table` | `[ ]` |
| 17 | missing-values-outliers | chọn cách điền trên Insulin; IQR vs z-score tương tác; MissForest ngắn | `impute-compare` | `[ ]` |
| 18 | feature-scaling | P: rà lại | có `scaler-before-after` | `[ ]` |
| 19 | categorical-encoding | bảng chọn encoder; cosine; hash bằng tay | `encode-table` | `[ ]` |
| 20 | correlation-multicollinearity | tính r tay; VIF ví dụ số; hệ số bất ổn bằng mô phỏng | có `corr-drag` | `[ ]` |
| 21 | imbalanced-data | SMOTE tay; so cách trên Diabetes (số thật); quy tắc vàng demo | có `resample` | `[ ]` |
| 22 | data-visualization | chọn câu hỏi ra hình (hình thật từ Diabetes); đọc box plot từng vạch | `viz-chooser` | `[ ]` |
| 23 | regular-expressions | ô thử regex; bảng ký hiệu; ví dụ làm sạch dữ liệu | `regex-tester` | `[ ]` |

### Module 02

| # | Bài | Cần nâng | Công cụ | Xong |
|---|---|---|---|---|
| 01 | supervised-algorithms | bộ lọc thuật toán; so baseline thật trên Diabetes | `algo-filter` | `[ ]` |
| 02 | linear-regression | giả định bằng ví dụ; residual plot; ví dụ nhiều biến | có `linear-fit` | `[ ]` |
| 03 | polynomial-regression | hệ số bất ổn; Pipeline code; chọn bậc bằng CV bằng số thật | có `poly-degree` | `[ ]` |
| 04 | logistic-regression | odds/log-odds làm tay; hệ số Diabetes; hiệu chỉnh ngưỡng | có `logistic-play` | `[ ]` |
| 05 | svm | tính tay margin; ảnh hưởng C, gamma bằng số; so Logistic trên Diabetes | có `svm-margin` | `[ ]` |
| 06 | k-nearest-neighbours | KNN hồi quy tay; chọn K bằng CV; curse of dimensionality bằng số | có `knn-play` | `[ ]` |
| 07 | decision-tree | cây hồi quy tay; entropy; max_depth với train/test | có `gini-calc` | `[ ]` |
| 08 | random-forest | OOB tay; số cây; feature importance Diabetes | có `bootstrap-vote` | `[ ]` |

## 5. Nhật ký
- (điền khi làm: ngày, bài, ghi chú)

# LESSON-REDESIGN-PLAN — thiết kế lại từng bài lý thuyết và trang chủ

Kế hoạch này dành cho **31 bài lý thuyết** (Module 01: 23 bài; Module 02: 8 bài) và **trang chủ**. Mục tiêu duy nhất: người học **đọc đến đâu hiểu đến đó**, và đọc lại sau vài ngày vẫn dựng lại được ý chính. Bài thực hành vẫn theo `PRACTICE-GUIDE.md`; file này không thay thế nó, mà dùng lại các nguyên tắc dạy của nó cho lý thuyết.

Mỗi bài có một **thẻ thiết kế riêng** (mục 4): câu hỏi trục, khoảnh khắc "à, hiểu rồi", mạch đọc, hình/công cụ tương tác đặc trưng, phần đưa xuống làn sâu. Không có khuôn chung cứng cho mọi bài; có **bảy kiểu bài** (mục 3) để mỗi bài chọn bố cục hợp với bản chất kiến thức của nó.

---

## 1. Chẩn đoán: vì sao bài lý thuyết hiện tại khó đọc

Số liệu đo trên `content/` (đếm từ + mục):

| Chỉ số | Giá trị |
|---|---|
| Độ dài | 1.500 đến 8.650 từ mỗi bài; 14 bài trên 4.000 từ; dài nhất: Imbalanced data 8.651 từ, Logistic 8.006, SVM 7.751 |
| Số mục `##` | 8 đến 28 mỗi bài (Imbalanced data 28, Missing values 22, Correlation 22, Descriptive statistics 21) |
| Khối tính tay + bẫy | Logistic: 8 khối "ví dụ tay" và 9 khối "bẫy", SVM: 7 và 5, KNN: 5 và 6, Decision Tree: 8 và 5 |

Các lỗi lặp lại (đều là nguyên nhân người học "hiểu một phần sau vài ngày"):

1. **Không có trục.** 22 mục xếp ngang hàng; người đọc không biết mục nào là lõi, mục nào là phụ.
2. **Ý chính chìm trong chi tiết.** Cùng một bài trộn: ý tưởng, công thức, tính tay, code, bẫy, "ngoài slide", "bổ sung". Mọi thứ cùng độ nổi bật.
3. **Giải thích trước, lý do sau.** Nhiều bài bắt đầu bằng định nghĩa rồi mới nói vì sao cần. Người học nhớ quy tắc, không nhớ lý do.
4. **Tiêu đề mục kiểu mục lục, không phải câu hỏi.** "Bảng tổng hợp và mẹo nhớ", "Đối chiếu bảng trên slide". Đọc tiêu đề không biết mục trả lời điều gì.
5. **Nhãn nguồn nằm trong tiêu đề** ("(ngoài slide)", "(bổ sung)"): ồn và làm mục nào cũng có vẻ phụ.
6. **Không có điểm dừng kiểm hiểu giữa bài.** Câu hỏi tự kiểm tra dồn cuối bài, khi đã quên đầu bài.
7. **Chỉ có chữ, bảng, code.** Những ý vốn nên **thao tác được** (kéo ngưỡng, đổi K, xoay fold, kéo outlier) chỉ được mô tả bằng văn.
8. **Mối nối giữa các bài yếu.** Cùng một ví dụ (Diabetes) xuất hiện khắp nơi nhưng mỗi bài dựng lại từ đầu; người học không thấy chúng là một câu chuyện.

## 2. Nguyên tắc thiết kế cho lý thuyết (bổ sung cho 10 nguyên tắc ở `PRACTICE-GUIDE.md`)

Giữ nguyên PRACTICE-GUIDE mục 2 (câu hỏi trước, làm hỏng thử, một ý chính, trung thực với số liệu, giải thích thuật ngữ đúng lần đầu, v.v.). Thêm các nguyên tắc riêng cho lý thuyết:

1. **Mỗi bài có một trục.** Một câu hỏi (viết thành câu hỏi thật) và một **khoảnh khắc hiểu** (câu mà người đọc nói được sau bài: "à, vì …"). Mọi mục phải phục vụ trục; không phục vụ thì đưa xuống làn sâu hoặc bỏ.
2. **Hai làn: Lõi và Đào sâu.** *Lõi* là con đường 100% người học đọc, mục tiêu **1.200 đến 2.000 từ**, 5 đến 7 "nhịp" (beat). *Đào sâu* là mọi thứ còn lại, nằm sau nút bấm (`:::pop`, `:::more`): chứng minh đầy đủ, code, biến thể, bẫy phụ, nội dung "ngoài slide". Không có gì quan trọng nằm trong làn sâu mà lõi không nhắc tới.
3. **Một nhịp = một ý.** Cấu trúc nhịp: câu hỏi nhỏ → ví dụ hoặc hình → giải thích → (nếu cần) công thức → *kiểm hiểu*. Nhịp không dài quá khoảng 300 từ.
4. **Cụ thể trước, trừu tượng sau.** Ví dụ số hoặc tình huống đời thường dẫn đầu; công thức chỉ xuất hiện khi người đọc đã thấy nó cần để làm gì.
5. **Thao tác được thì cho thao tác.** Nếu một ý có thể hiểu bằng cách kéo, bấm, đổi (ngưỡng, K, bậc đa thức, tỉ lệ chia…), thì làm công cụ tương tác thay vì mô tả (mục 5).
6. **Đoán trước rồi mở (predict-reveal).** Ở chỗ kết quả hơi bất ngờ, hỏi "bạn đoán sao?" trước khi cho đáp án. Não nhớ lâu thứ nó đã đoán sai.
7. **Kiểm hiểu giữa bài.** Sau mỗi 2 nhịp, một câu kiểm tra nhỏ (đáp án gấp). Không đợi cuối bài.
8. **Tiêu đề mục là câu hỏi hoặc phát biểu có nội dung.** "Vì sao không chấm trên dữ liệu đã học?" chứ không phải "Ba tập, ba vai trò" (dùng làm phụ đề cũng được).
9. **Nhãn nguồn là chip nhỏ, không nằm trong tiêu đề.** `Slide 68` hoặc `Ngoài slide` hiện thành chip cạnh đoạn liên quan. Slide gốc vẫn mở được bằng lightbox.
10. **Một ví dụ xuyên suốt khi có thể.** Bộ dữ liệu Diabetes (đã dùng ở Project) và các ví dụ nhỏ có số, để người học thấy các bài là một câu chuyện. Bài nào có bài thực hành tương ứng thì **cùng ví dụ, cùng số** với bài thực hành và liên kết hai chiều.
11. **Số liệu phải kiểm bằng code.** Mọi con số trong bài chạy qua script (mở rộng `scripts/practice_verify.py` cho lý thuyết: cùng quy ước `:::out`). Công cụ tương tác dùng cùng dữ liệu và cùng kết quả.
12. **Thẻ nhớ cuối bài.** Một "thẻ" gọn (≤ 8 dòng): trục, ý chính, công thức/quy tắc, bẫy lớn nhất, bài liên quan. Là thứ người học in ra hoặc đọc lại.
13. **Giữ nguyên:** id bài, slide đã gán, `needs`, quiz ba tầng (đưa vào ngân hàng phỏng vấn), liên kết `[[bài:…]]` còn đúng. Nội dung đúng thì chuyển nơi, không viết lại tùy tiện.

### Giới hạn cứng mỗi bài sau khi thiết kế lại

| Hạng mục | Giới hạn |
|---|---|
| Lõi | 5 đến 7 nhịp, 1.200 đến 2.000 từ |
| Công cụ tương tác | tối đa 2 (một "chủ lực", một phụ) |
| Khối kiểm hiểu giữa bài | 1 sau mỗi 2 nhịp |
| Hình tĩnh | tối đa 4, mỗi hình có câu "nhìn gì" |
| Đào sâu | không giới hạn, nhưng mỗi mục một nút, tên nút nói rõ nội dung |
| Bài vượt 2.500 từ lõi | tách thành hai bài (đã nêu ở thẻ thiết kế) |

## 3. Bảy kiểu bài và bố cục đặc trưng

Mỗi bài chọn một kiểu; kiểu quyết định "hình đặc trưng" ở đầu bài và cách nhịp được dẫn.

| Kiểu | Bài thuộc kiểu | Bố cục đặc trưng |
|---|---|---|
| **A. Bản đồ khái niệm** | M01-01, 03, 15; M02-01 | Một sơ đồ lớn bấm được ở đầu bài; mỗi vùng mở thẻ giải thích ngắn và dẫn tới bài chi tiết. Đọc xong là có "bản đồ trong đầu". |
| **B. Biểu diễn dữ liệu** | M01-02, 04 | Một bảng dữ liệu thật ở trung tâm; bấm cột hoặc hàng để "bóc tách" (đây là feature, đây là nhãn, đây là mã định danh). |
| **C. Cơ chế có số** | M01-05, 06 | Vòng lặp vẽ thành sơ đồ chạy từng bước; một núm vặn tay (tham số) và con số loss đổi theo. |
| **D. Quy trình chia dữ liệu** | M01-07, 08, 09 | "Thanh dữ liệu" (một dải chia màu) làm hình chủ đạo; mọi ví dụ vẽ lại trên dải đó. |
| **E. Metric** | M01-10 (nền), 11, 12, 13, 14 | Ma trận hoặc đồ thị có **thanh trượt ngưỡng/outlier**; con số đổi trực tiếp khi kéo. |
| **F. Kỹ thuật tiền xử lý** | M01-16 đến 22 | Công tắc **Trước / Sau** trên cùng một dữ liệu; câu hỏi "cái gì hỏng nếu bỏ bước này" mở bài. |
| **G. Công cụ** | M01-23 | Ô thử nhanh + bảng ký hiệu; học bằng cách gõ. |
| **H. Mô hình** | M02-02 đến 08 | **Sân thử 2D** (một đám điểm, kéo tham số, thấy ranh giới/đường đổi), cùng khuôn: *vì sao cần → cơ chế → tính tay → tham số chính → khi nào dùng/không dùng*. |

## 4. Thẻ thiết kế từng bài

Quy ước mỗi thẻ: **Trục** (câu hỏi) · **Khoảnh khắc hiểu** · **Mạch đọc** (các nhịp theo thứ tự) · **Hình/công cụ** · **Xuống làn sâu / cắt** · **Cầu nối** (với Project và bài khác) · **Cảnh báo** (điều phải giữ đúng).

### Module 01 — Machine Learning nền tảng

#### 01 · AI, ML, Deep Learning và Data Science là gì — kiểu A (1.911 từ)
- **Trục:** Bốn cái tên này khác nhau chỗ nào, và ML thực sự làm gì?
- **Khoảnh khắc hiểu:** ML là *học quy tắc từ ví dụ* thay vì ta tự viết quy tắc.
- **Mạch đọc:** (1) Viết luật tay và học từ ví dụ: bộ lọc spam làm theo hai cách. (2) Sơ đồ input → model → output. (3) Bản đồ vòng tròn: AI chứa ML chứa DL; Data Science giao với cả ba. (4) Bốn mục tiêu dễ nhầm. (5) Nhìn vào công việc để gọi đúng tên.
- **Hình/công cụ:** sơ đồ vòng tròn bấm từng vùng; **bài "gọi đúng tên"**: 6 công việc, bấm chọn vòng đúng, có phản hồi ngay.
- **Xuống làn sâu / cắt:** định nghĩa lịch sử, các so sánh phụ.
- **Cầu nối:** nối thẳng sang 03 (cách học) và 15 (cả dự án).
- **Cảnh báo:** giữ đúng slide 1–? về giao nhau của các vòng; không khẳng định Data Science "nằm trong" AI.

#### 02 · Dataset, Feature và các loại dữ liệu — kiểu B (1.767 từ)
- **Trục:** Mỗi cột là loại thông tin gì, và loại đó quyết định ta được làm gì với nó?
- **Khoảnh khắc hiểu:** `dtype` không phải bản chất: mã định danh lưu bằng số vẫn không phải số đo.
- **Mạch đọc:** (1) Một bảng nói gì với model. (2) Số đo hay mã định danh. (3) Categorical: có thứ tự hay không. (4) Đọc các cột của Adult dataset. (5) `dtype` đánh lừa (predict-reveal).
- **Hình/công cụ:** **bảng bóc cột**: bấm một cột, chọn "số đo / mã / nhóm có thứ tự / nhóm không thứ tự", nhận phản hồi kèm lý do.
- **Xuống làn sâu:** code pandas kiểm `dtype`.
- **Cầu nối:** sang 04 (X và y), 19 (mã hóa).

#### 03 · Các phương thức học — kiểu A (1.772 từ)
- **Trục:** Model học từ loại phản hồi nào?
- **Khoảnh khắc hiểu:** *Nhãn* (có hay không có đáp án) quyết định phương thức học.
- **Mạch đọc:** (1) Ba loại phản hồi: đáp án, không đáp án, thưởng–phạt. (2) Nhãn quyết định điều gì. (3) Ba phương thức và dạng bài của mỗi loại. (4) Đặt bài toán qua ví dụ. (5) Đừng suy từ tên ứng dụng.
- **Hình/công cụ:** **cây câu hỏi chọn phương thức** ("Có đáp án sẵn? Có điểm thưởng sau mỗi hành động?") và 6 tình huống để tự đặt vào cây.
- **Cảnh báo:** chỉ nói điều slide có; phần "ngoài slide" đánh chip.

#### 04 · Labeled data: X và y — kiểu B (1.495 từ)
- **Trục:** Một mẫu có nhãn gồm gì, và X, y tách ra từ bảng thế nào?
- **Khoảnh khắc hiểu:** hàng i của X luôn đi cùng đúng nhãn y_i.
- **Mạch đọc:** (1) Một mẫu = feature + nhãn. (2) Từ bảng đến X và y. (3) Ký hiệu cho một mẫu và cả bộ. (4) Đọc một hàng Diabetes. (5) Tách target bằng pandas. (6) Hàng và nhãn phải khớp.
- **Hình/công cụ:** **bảng Diabetes tô màu**: bấm một hàng, hai bên hiện x⁽ⁱ⁾ (8 số) và y⁽ⁱ⁾; bấm "tách" thấy bảng chia thành X và y.
- **Cầu nối:** **Project Bước 3** dùng đúng bước này; thêm link hai chiều.

#### 05 · Model Training — kiểu C (1.491 từ)
- **Trục:** Khi "học", model thay đổi cái gì?
- **Khoảnh khắc hiểu:** model là bộ **tham số**; học là chỉnh tham số để loss nhỏ đi.
- **Mạch đọc:** (1) Tham số là núm vặn. (2) Prediction nối với loss. (3) Từ sai lệch đến tín hiệu cập nhật. (4) Vòng lặp. (5) Lúc dùng model: predict không cập nhật.
- **Hình/công cụ (chủ lực):** **núm vặn**: một đường thẳng `ŷ = a·x`, kéo `a`, thấy loss đổi trực tiếp và mũi tên "nên vặn về phía nào".
- **Xuống làn sâu:** toán gradient (chỉ nhắc, không bắt buộc).
- **Cầu nối:** ví dụ số nằm ở 06.

#### 06 · Loss Function — kiểu C (2.496 từ)
- **Trục:** Làm sao biến "sai bao nhiêu" thành một con số mà máy có thể giảm?
- **Khoảnh khắc hiểu:** loss chọn **cách phạt**: L1 phạt đều, L2 phạt nặng những điểm sai lớn.
- **Mạch đọc:** (1) Vì sao cần một con số. (2) Loss trong vòng huấn luyện. (3) L1. (4) L2. (5) Ví dụ giá nhà so L1 với L2. (6) Loss khác metric.
- **Hình/công cụ:** **kéo một căn nhà outlier**: thanh L1 và L2 đổi, thấy L2 nhảy mạnh hơn.
- **Xuống làn sâu:** code tự cài lại.
- **Cầu nối:** 14 (metric hồi quy dùng cùng công thức), 07 (loss để cập nhật hay để chọn).

#### 07 · Train / Validation / Test — kiểu D (2.089 từ)
- **Trục:** Vì sao không chấm trên dữ liệu đã học, và ba tập làm gì?
- **Khoảnh khắc hiểu:** test là *đề thi bí mật*; validation là *thi thử để chỉnh*; train là *bài tập*.
- **Mạch đọc:** (1) Học thuộc và hiểu bài khác nhau (cây 100% so với 74.7%: **cùng số với Project Bước 2**). (2) Ba tập, ba vai. (3) Loss để cập nhật hay để lựa chọn. (4) Chia 100 mẫu theo 80/10/10. (5) Tách test trước, validation sau. (6) Chia theo cách sẽ dùng model (thời gian, nhóm).
- **Hình/công cụ:** **thanh dữ liệu** kéo được; "ai dùng phần nào" ghép bằng bấm.
- **Cầu nối:** Project Bước 2; 08 (thay validation cứng bằng K-fold).

#### 08 · K-fold Cross Validation — kiểu D (2.555 từ)
- **Trục:** Một lần chia có đáng tin không?
- **Khoảnh khắc hiểu:** mỗi mẫu làm validation **đúng một lần**; ta báo cả trung bình lẫn độ dao động.
- **Mạch đọc:** (1) Một lần chia có thể may hoặc rủi (30 cách chia ra 65.6% đến 76.6%). (2) Tận dụng dữ liệu mà vẫn giữ test. (3) Xoay validation, rồi refit. (4) Bốn lượt trên 100 mẫu. (5) Model khởi tạo mới mỗi lượt. (6) Đọc điểm CV cùng giới hạn.
- **Hình/công cụ (chủ lực):** **bộ xoay fold**: thanh K từ 3 đến 10, bấm từng lượt thấy vùng validation sáng lên, bảng điểm từng fold tự tính mean ± std.
- **Cầu nối:** **Project Bước 6**.
- **Cảnh báo:** nhắc fold trong CV dùng chung split cố định, không "nhìn trộm" test.

#### 09 · Stratified K-fold — kiểu D (2.258 từ)
- **Trục:** Nếu một fold không có lớp hiếm thì sao?
- **Khoảnh khắc hiểu:** chia theo **tỉ lệ nhãn**, không chia đều số mẫu.
- **Mạch đọc:** (1) 90 Cat 10 Dog: fold xấu. (2) Giữ tỉ lệ. (3) Đối chiếu bảng slide. (4) Truyền cả y. (5) Giới hạn của lời hứa.
- **Hình/công cụ:** **nút "Xáo"**: KFold thường có lúc fold không có Dog; Stratified không bao giờ.
- **Cầu nối:** 21 (dữ liệu mất cân bằng).

#### 10 · Classification vs Regression — nền cho kiểu E (3.293 từ)
- **Trục:** Ta cần dự đoán nhãn hay một đại lượng?
- **Khoảnh khắc hiểu:** dạng đầu ra quyết định luôn loss và metric.
- **Mạch đọc:** (1) Câu hỏi chọn. (2) Dạng bài quyết định loss và metric. (3) Các dạng đầu ra (nhị phân, nhiều lớp, thứ tự, đếm). (4) **Tám tình huống** tự phân loại. (5) Target có thứ tự chưa quyết định cách làm.
- **Hình/công cụ (chủ lực):** **tám thẻ tình huống**: bấm chọn, nhận phản hồi và lý do ngay.
- **Xuống làn sâu / cắt:** code gợi ý, phần dài; giảm lõi xuống khoảng 1.800 từ.

#### 11 · Confusion Matrix — kiểu E (3.537 từ, 15 mục)
- **Trục:** Sai theo kiểu nào mới là điều quan trọng?
- **Khoảnh khắc hiểu:** bốn ô = hai loại đúng và hai loại sai **có giá khác nhau**.
- **Mạch đọc:** (1) Đặt prediction cạnh label. (2) Chọn lớp dương. (3) Bốn ô. (4) Type I và Type II. (5) Đếm từng ảnh dog/cat. (6) Đổi lớp dương thì ô đổi tên thế nào. (7) Bẫy: hàng/cột trong scikit-learn.
- **Hình/công cụ (chủ lực):** **ma trận kéo thả**: thả từng ảnh vào ô, ma trận tự đếm; công tắc "đổi lớp dương".
- **Xuống làn sâu:** ba cách đếm bằng code (Python thuần, NumPy, sklearn).
- **Cầu nối:** Project Bước 5.

#### 12 · Accuracy, Precision, Recall, F1 — kiểu E (4.463 từ, 15 mục)
- **Trục:** Từ bốn con số đến **một câu hỏi**: ta quan tâm lỗi nào?
- **Khoảnh khắc hiểu:** mỗi metric là một **câu hỏi khác nhau** về cùng bảng.
- **Mạch đọc:** (1) Accuracy: đúng chung. (2) Precision: "nói dương thì đáng tin đến đâu?". (3) Recall: "bắt được bao nhiêu trong số thật sự dương?". (4) F1. (5) Bẫy accuracy khi dữ liệu lệch (đoán toàn 0: 64.3% nhưng recall 0). (6) Ngưỡng đổi precision và recall. (7) Chọn metric theo bối cảnh.
- **Hình/công cụ (chủ lực):** **ma trận + thanh trượt ngưỡng**; bốn metric đổi live. Phụ: **bốn tình huống chọn metric** (y tế, spam, lừa đảo, tìm kiếm).
- **Xuống làn sâu:** specificity, F-beta, nhiều lớp.
- **Cầu nối:** Project Bước 5 (cùng số 79/20/18/37).

#### 13 · ROC và AUC — kiểu E (4.440 từ, 19 mục)
- **Trục:** So model khi ngưỡng thay đổi.
- **Khoảnh khắc hiểu:** ROC là **kết quả quét ngưỡng**; AUC là xác suất model xếp một ca dương cao hơn một ca âm.
- **Mạch đọc:** (1) Từ ma trận đến một đường cong. (2) Hai trục TPR và FPR. (3) Quét ngưỡng trên mười email. (4) Đọc hình ROC của slide. (5) AUC bằng diện tích và bằng đếm cặp. (6) Chọn ngưỡng (Youden). (7) Giới hạn của ROC, khi nào dùng PR.
- **Hình/công cụ (chủ lực):** **kéo ngưỡng**: bảng 10 email, điểm chạy trên đường ROC, ma trận cập nhật.
- **Xuống làn sâu:** tự cài ROC/AUC, code sklearn.
- **Cảnh báo:** giữ rõ ranh giới nội dung slide và phần bổ sung.

#### 14 · Metric hồi quy: MAE, RMSE — kiểu E (3.665 từ, 18 mục)
- **Trục:** Dự đoán lệch bao nhiêu?
- **Khoảnh khắc hiểu:** MAE và RMSE khác nhau ở **cách đối xử với sai số lớn**; R² so với việc "đoán bừa bằng trung bình".
- **Mạch đọc:** (1) Sai lệch. (2) Một công thức, hai vai (loss và metric). (3) MAE. (4) RMSE. (5) Khác nhau ra sao (thí nghiệm outlier). (6) R². (7) Đừng suy quá xa từ một con số.
- **Hình/công cụ (chủ lực):** **kéo một căn nhà outlier**: MAE, RMSE, R² đổi (cùng khuôn công cụ với bài 06).
- **Xuống làn sâu:** tự cài NumPy, MAPE.

#### 15 · ML Pipeline: 7 bước — kiểu A (5.126 từ)
- **Trục:** Từ các mảnh kiến thức đến một dự án trọn vẹn.
- **Khoảnh khắc hiểu:** bảy bước là **chu trình**, không phải đường thẳng.
- **Mạch đọc:** (1) Bản đồ bảy bước. (2) Mỗi bước trả lời một câu hỏi và đưa ra một sản phẩm. (3) Bản đồ học: bước nào học ở bài nào. (4) Pipeline không phải đường thẳng. (5) Đi qua pipeline trên Diabetes. (6) Ghép imputer, scaler, model.
- **Hình/công cụ (chủ lực):** **sơ đồ bảy bước bấm được**: mỗi bước mở thẻ 4 dòng (câu hỏi, đầu ra, lỗi hay gặp, bài chi tiết) và đánh dấu bài bạn đã đọc.
- **Xuống làn sâu / cắt:** các mục "Step N" trùng với bài sau chuyển thành thẻ; giảm lõi xuống khoảng 1.800 từ.
- **Cầu nối:** là cổng vào Project.

#### 16 · Thống kê mô tả — kiểu F (6.823 từ, 21 mục)
- **Trục:** Nhìn dữ liệu bằng số trước khi sửa gì.
- **Khoảnh khắc hiểu:** thống kê là **manh mối**, và số 0 có thể là "dữ liệu thiếu trá hình".
- **Mạch đọc:** (1) Dẫn tới quyết định tiền xử lý nào. (2) Xem dữ liệu, `dtypes`. (3) `describe()` đọc từng dòng. (4) Phân bố class. (5) Số 0 bất thường. (6) So theo class. (7) Tính tay `describe` trên 15 hàng.
- **Hình/công cụ (chủ lực):** **bảng `describe` bấm được**: bấm ô `min = 0` ở Glucose thì hiện cảnh báo và lý do.
- **Xuống làn sâu:** bản code từng slide 41–44 (11 khối code).
- **Cầu nối:** Project Bước 1.

#### 17 · Thiếu dữ liệu và Outlier — kiểu F, **tách thành hai bài** (7.369 từ, 22 mục)
- **17a. Dữ liệu thiếu.** Trục: điền thế nào mà không rò rỉ? Hiểu: điền bằng thống kê **học từ train**; median khác mean khi có giá trị lớn. Mạch: ba dạng thiếu → các cách xử lý → áp vào hai dataset → fit trên train. Công cụ: **chọn cách điền** trên 20 giá trị Insulin, xem phân phối trước/sau. Cầu nối: **Project Bước 7**.
- **17b. Outlier.** Trục: giá trị khác thường là lỗi hay tín hiệu? Hiểu: IQR và z-score là **công cụ điều tra**, không phải án quyết. Mạch: outlier từ đâu → IQR → z-score → cắt ngưỡng học từ train. Công cụ: **kéo một điểm**, thấy hộp IQR và z đổi.
- **Xuống làn sâu:** MissForest, các giả định khi điền, ghi chú của chủ repo.

#### 18 · Feature scaling — kiểu F (4.910 từ)
- **Trục:** Đơn vị đo làm lệch phép so sánh thế nào?
- **Khoảnh khắc hiểu:** cột có số lớn lấn át khoảng cách (Insulin chiếm **56.6%** khoảng cách, DPF gần 0%: **cùng số với Project Bước 3**).
- **Mạch đọc:** (1) Hai bệnh nhân, một khoảng cách. (2) MinMaxScaler. (3) StandardScaler. (4) Chọn scaler. (5) Model nào cần scale. (6) Fit trên train, transform trên test (thợ may).
- **Hình/công cụ (chủ lực):** **công tắc Trước/Sau**: đám điểm 2D và thanh "% khoảng cách do mỗi cột"; kéo một outlier để thấy MinMax bị nén.
- **Xuống làn sâu:** đọc từng dòng code slide 47; ví dụ tay.
- **Cầu nối:** Project Bước 3 (nút "Giải thích chi tiết" đã có).

#### 19 · Mã hóa categorical — kiểu F (5.397 từ)
- **Trục:** Đổi chữ thành số sao cho đúng nghĩa?
- **Khoảnh khắc hiểu:** đánh số thẳng tạo ra **thứ tự và khoảng cách giả**; one-hot không có thứ tự giả.
- **Mạch đọc:** (1) Vì sao không đánh số thẳng. (2) Ordinal. (3) Nominal và lỗi thứ tự giả. (4) One-hot. (5) Hash. (6) Embedding (cosine). (7) Chọn cách nào.
- **Hình/công cụ (chủ lực):** **bảng nhỏ + chọn encoder**: hiện ma trận số và "khoảng cách giữa Red và Blue" theo từng cách.
- **Xuống làn sâu:** hash bằng tay, `ColumnTransformer`.

#### 20 · Correlation và Multicollinearity — kiểu F, **tách thành hai phần** (6.222 từ)
- **Trục:** Hai câu hỏi khác nhau: feature với target, và feature với feature.
- **Khoảnh khắc hiểu:** r chỉ đo quan hệ **tuyến tính**; r = 0 vẫn có thể có quan hệ rõ (parabol).
- **Mạch đọc:** (1) Hai câu hỏi khác nhau. (2) Tính r tay trên 5 điểm. (3) Đọc r qua scatter. (4) Tương quan khác nhân quả. (5) Quan hệ rõ mà r = 0. (6) Multicollinearity và vì sao hệ số bất ổn. (7) VIF.
- **Hình/công cụ (chủ lực):** **kéo điểm trên scatter**, r đổi live; phụ: ma trận tương quan Diabetes bấm ô.
- **Cầu nối:** Project Bước 8 (bảng tương quan, câu phỏng vấn "tuyến tính hay phi tuyến").

#### 21 · Dữ liệu mất cân bằng — kiểu F, **tách thành hai bài** (8.651 từ, 28 mục)
- **21a. Vấn đề và cách nhẹ.** Trục: accuracy cao nhưng bỏ sót lớp cần tìm. Hiểu: đổi **ngưỡng** và **class_weight** nhẹ hơn resample. Mạch: vì sao model lệch → class_weight → đổi ngưỡng → khi nào cần resample.
- **21b. Resampling.** Trục: tạo hay bỏ mẫu thế nào? Hiểu: **chỉ resample trên train** (cách sai làm điểm bị thổi phồng). Mạch: random oversample → SMOTE (nội suy) → ADASYN → ClusterCentroids → quy tắc vàng → so sánh trên Diabetes.
- **Hình/công cụ (chủ lực):** đám điểm hai lớp, **nút chọn kỹ thuật**, thấy điểm mới xuất hiện; demo "cách sai".
- **Xuống làn sâu:** SMOTE, ADASYN, ClusterCentroids tính tay (đang chiếm phần lớn độ dài).

#### 22 · Data Visualization — kiểu F (3.266 từ)
- **Trục:** Hỏi gì thì chọn hình đó.
- **Khoảnh khắc hiểu:** chọn hình theo **câu hỏi**, không theo thói quen.
- **Mạch đọc:** (1) Bảng số chưa trả lời gì. (2) Bảng "câu hỏi → hình". (3) Histogram. (4) Density. (5) Box plot. (6) Correlation matrix. (7) Scatter matrix. (8) Figure, Axes, Axis.
- **Hình/công cụ (chủ lực):** **chọn câu hỏi, hiện hình tương ứng** trên Diabetes; hover box plot thấy ý nghĩa từng vạch.
- **Xuống làn sâu:** năm biểu đồ bằng code.

#### 23 · Regular Expression — kiểu G (2.668 từ)
- **Trục:** Tìm khuôn mẫu nào trong chuỗi?
- **Khoảnh khắc hiểu:** pattern mô tả **hình dạng** của chuỗi cần tìm.
- **Mạch đọc:** (1) Khuôn mẫu cần tìm. (2) Bộ ký hiệu đủ dùng. (3) `search`, `match`, `fullmatch`. (4) Code `re`: tìm, trích, kiểm, thay. (5) Greedy và lazy. (6) Thử pattern đúng engine.
- **Hình/công cụ:** **ô thử** (gõ chuỗi và pattern, thấy phần khớp tô màu). Cảnh báo bắt buộc: ô thử chạy engine JavaScript, **không** phải Python; chỉ dùng cho cú pháp chung và ghi rõ.
- **Cầu nối:** làm sạch dữ liệu chuỗi trong pipeline.

### Module 02 — Supervised Learning (kiểu H, trừ 01)

Khuôn kiểu H cho mọi mô hình: *vì sao cần (nó sửa điều gì của mô hình trước) → cơ chế một hình → tính tay một ví dụ nhỏ → tham số chính và đọc kết quả → khi nào dùng và không dùng → so với mô hình khác*. Dùng chung một **Sân thử 2D** (mục 5).

#### 01 · Bản đồ thuật toán Supervised — kiểu A (2.098 từ)
- **Trục:** Biết bài toán rồi, thử mô hình nào trước?
- **Khoảnh khắc hiểu:** không có mô hình tốt nhất; có **baseline** trước, rồi so bằng CV.
- **Mạch đọc:** (1) Đọc bảng slide 64 (hai cột, dấu sao). (2) Mỗi họ giải quyết điều gì. (3) Chọn ứng viên theo bài toán.
- **Hình/công cụ:** **bộ lọc**: chọn "target là số / nhãn" và "cần giải thích được", hiện ứng viên kèm link tới bài.

#### 02 · Linear Regression (3.868 từ)
- **Trục:** Đường thẳng nào đại diện cho đám điểm?
- **Khoảnh khắc hiểu:** chọn đường làm **tổng bình phương sai số nhỏ nhất**.
- **Mạch đọc:** (1) Đường thẳng và ε. (2) Học hệ số bằng bình phương tối thiểu. (3) Tính tay và residual. (4) Ưu nhược trên slide. (5) Giả định cho dự đoán và suy luận. (6) Bẫy khi mang ra thực tế.
- **Hình/công cụ (chủ lực):** **kéo hai núm (độ dốc, tung độ)**: thấy residual và tổng bình phương đổi; nút "đường tối ưu".
- **Cầu nối:** 05, 06, 14.

#### 03 · Polynomial Regression — **tách hai phần** (6.304 từ)
- **Trục:** Khi đường thẳng bỏ sót hình dạng, làm gì?
- **Khoảnh khắc hiểu:** thêm feature x² giữ nguyên cách học; bậc cao **nội suy** mọi điểm nhưng không hiểu thêm.
- **Phần 1 (khái niệm):** đường thẳng bỏ sót → thêm feature → bậc d và hệ số → tính tay bậc hai.
- **Phần 2 (chọn bậc):** lỗi ngoài train → nội suy không chứng minh học đúng → scale và hệ số bất ổn → Pipeline và CV.
- **Hình/công cụ (chủ lực):** **thanh trượt bậc 1–10**: đường cong cùng hai con số train error và test error.
- **Xuống làn sâu:** nhiều biến, center và scale.

#### 04 · Logistic Regression — **tách hai phần** (8.006 từ; 8 khối tính tay, 9 khối bẫy)
- **Trục:** Từ dự đoán một con số sang dự đoán một lớp.
- **Khoảnh khắc hiểu:** giữ điểm tuyến tính, đưa qua **sigmoid** thành xác suất; ngưỡng đổi precision/recall.
- **Phần 1 (cơ chế):** vì sao Linear hỏng với nhãn (chuột 10 kg) → sigmoid → đường phân tách → odds và log-odds → tính tay dự đoán và log loss.
- **Phần 2 (dùng):** ngưỡng và recall → ưu nhược → Linear so với Logistic → code sklearn → bẫy (gộp 9 khối bẫy còn 4 điều lớn nhất).
- **Hình/công cụ (chủ lực):** **kéo trọng số, hệ số chặn và ngưỡng** trên sân thử 2D cùng đường sigmoid.
- **Cầu nối:** **Project Bước 4** (trọng số Diabetes; p = 0.277 tính tay).

#### 05 · SVM (7.751 từ)
- **Trục:** Nhiều đường cùng đúng, chọn đường nào?
- **Khoảnh khắc hiểu:** chọn đường có **lề (margin) rộng nhất**; kernel cho ranh giới cong mà không phải dựng thêm chiều.
- **Mạch đọc:** (1) Nhiều đường cùng đúng. (2) Siêu phẳng, hai mép, support vector. (3) Không tách hoàn toàn: soft margin và C. (4) Thêm chiều (từ 1D sang 2D). (5) Kernel trick. (6) Scale, chọn C và γ bằng CV. (7) SVM hay Logistic.
- **Hình/công cụ (chủ lực):** **kéo điểm** thấy margin và support vector đổi; thanh trượt C, rồi γ cho RBF. (Tính trước bằng Python, nhúng kết quả: SVM không tối ưu trực tiếp trong trình duyệt.)

#### 06 · KNN (7.043 từ)
- **Trục:** Hỏi những người gần nhất.
- **Khoảnh khắc hiểu:** scale có thể đổi **chính người hàng xóm** gần nhất; "học" nằm ở lúc dự đoán (lazy).
- **Mạch đọc:** (1) Đo, lấy K, vote. (2) Tính tay tám khoảng cách, rồi đổi K. (3) K nhỏ hay lớn phải nhìn ngoài train. (4) Lazy learning. (5) Scale đổi hàng xóm. (6) KNN hồi quy. (7) Chọn K, weights, metric bằng CV. (8) Nhiều feature làm hàng xóm kém liên quan.
- **Hình/công cụ (chủ lực):** **bấm lên mặt phẳng**, thấy K hàng xóm và phiếu; thanh trượt K; công tắc scale (cùng bộ dữ liệu với bài 18).

#### 07 · Decision Tree (5.677 từ)
- **Trục:** Câu hỏi nào nên hỏi trước?
- **Khoảnh khắc hiểu:** chọn câu hỏi làm **hai nhóm thuần hơn**, đo bằng Gini có trọng số (không chỉ nhìn một nhánh lệch).
- **Mạch đọc:** (1) Đi từ root tới leaf, đọc luật. (2) "Chia càng lệch càng tốt" nghĩa chính xác là gì. (3) Tính lại Gini của slide 77. (4) Entropy, ngưỡng số, thuật toán tham lam. (5) Cây hồi quy và giới hạn ngoại suy. (6) Cây sâu thuộc bài (nối Project Bước 2). (7) Thực hành.
- **Hình/công cụ (chủ lực):** **máy tính Gini**: bảng 14 mẫu của slide 77, chọn feature để chia, hiện Gini từng nhánh và Gini có trọng số, đánh dấu "Best". Phụ: thanh trượt `max_depth`.

#### 08 · Random Forest (5.580 từ)
- **Trục:** Vì sao kết hợp nhiều cây?
- **Khoảnh khắc hiểu:** cây phải **đa dạng** (bootstrap + chọn feature ngẫu nhiên), vì khi đó lỗi của chúng triệt tiêu khi vote.
- **Mạch đọc:** (1) Một người hay một hội đồng (5 cây 70% → 84%, giả định độc lập). (2) Pipeline và phiếu trái cây (slide 78–80). (3) Hai nguồn ngẫu nhiên. (4) Bootstrap và out-of-bag (63.2%). (5) Chọn bao nhiêu cây. (6) Một cây và cả rừng. (7) Feature importance và giới hạn.
- **Hình/công cụ (chủ lực):** **bộ lấy mẫu bootstrap** (bấm lấy mẫu, đánh dấu mẫu trùng và OOB) và **mô phỏng bỏ phiếu** (số cây, độ chính xác mỗi cây, độc lập hay tương quan).

## 5. Bộ công cụ cần xây (dùng chung cho nhiều bài)

Ưu tiên theo số bài dùng và giá trị hiểu bài. Mọi công cụ: React client, chạy offline, có sáng/tối, có phương án chữ khi tắt JS.

| # | Công cụ | Dùng cho bài | Làm thế nào | Ưu tiên |
|---|---|---|---|---|
| 1 | **Khối nội dung mới**: `:::checkpoint` (kiểm hiểu), `:::predict` (đoán trước rồi mở), `:::steps` (làm tay từng bước), `:::widget tên` (nhúng công cụ), `:::card` (thẻ nhớ cuối bài), chip nguồn | tất cả | mở rộng `lib/blocks.ts` và `TheoryLesson` | **P0** |
| 2 | **Từ điển tại chỗ**: chạm vào thuật ngữ thấy một câu giải thích | tất cả | một file `glossary.json` dùng chung, link tới bài gốc | P0 |
| 3 | **Ma trận + thanh trượt ngưỡng** | 11, 12, 13 (+ Project) | JS thuần, dữ liệu 10 mẫu và 154 mẫu Diabetes | P1 |
| 4 | **Công tắc Trước/Sau cho scaler** (đám điểm 2D + thanh % khoảng cách) | 18, 06 KNN (+ Project) | JS thuần | P1 |
| 5 | **Thanh dữ liệu + bộ xoay fold** | 07, 08, 09 | SVG | P1 |
| 6 | **Kéo outlier**: loss, MAE, RMSE, IQR, r đổi live | 06, 14, 17b, 20 | SVG + JS | P1 |
| 7 | **Sân thử 2D** (khối dùng chung): đám điểm, kéo tham số, thấy đường/ranh giới; cắm được mô hình | 02, 03, 04, 06, 07 | JS thuần cho Linear, Poly, Logistic, KNN, Tree (nhỏ); **SVM tính trước bằng Python và nhúng JSON** | P2 |
| 8 | **Máy tính Gini** | 07 | JS thuần | P2 |
| 9 | **Bộ lấy mẫu bootstrap và mô phỏng vote** | 08 | JS thuần | P2 |
| 10 | **Bảng bóc cột / bảng bấm được** (describe, dtype, X–y) | 02, 04, 16 | JS thuần | P2 |
| 11 | **Sơ đồ bấm được** (bản đồ bảy bước, vòng tròn AI–ML–DL, bản đồ thuật toán) | 01, 03, 15, M02-01 | SVG | P2 |
| 12 | **Ô thử regex** | 23 | JS RegExp, cảnh báo engine | P3 |
| 13 | **Tiến độ và tiếp tục học**: nhớ bài và phần đang đọc | trang chủ, mọi bài | `localStorage` (đã có phần của nó) | P1 |

Quy tắc kỹ thuật cho công cụ: tính toán phải **trùng số** với script Python kiểm chứng (cùng dữ liệu, cùng kết quả); mô hình nặng tính trước bằng Python rồi nhúng JSON; không tải thư viện nặng (không three.js, không chart lib lớn khi SVG tự vẽ là đủ).

## 6. Quy trình thiết kế lại một bài (làm lần lượt từng bài)

1. Đọc bài cũ, slide gốc và thẻ thiết kế ở mục 4; chỉnh thẻ nếu đọc thấy chưa hợp.
2. **Viết trục và khoảnh khắc hiểu trước**; từ đó chọn 5 đến 7 nhịp. Nhịp nào không phục vụ trục thì xuống làn sâu.
3. Với mỗi nhịp: câu hỏi nhỏ, ví dụ/hình, giải thích, kiểm hiểu.
4. Chuyển mọi thứ còn lại vào `:::pop` hoặc `:::more` có tên nút rõ nghĩa. **Không xoá kiến thức đúng**, chỉ đổi chỗ.
5. Số liệu: viết code kiểm (`:::out` + script), chạy khớp.
6. Làm công cụ tương tác (nếu thẻ yêu cầu) bằng công cụ dùng chung ở mục 5; nếu cần công cụ mới, thêm vào bộ chung.
7. Thẻ nhớ cuối bài; cập nhật quiz nếu câu hỏi đổi; kiểm liên kết `[[bài:…]]`, link hai chiều với Project.
8. **Kiểm "đọc lại sau vài ngày":** chỉ đọc tiêu đề mục + khối "Nhớ lại": dựng lại được câu chuyện không? Mỗi khái niệm có một con số hoặc một thao tác chứng minh không?
9. `tsc` và `build` pass; mở trang thật (sáng và tối, rộng và hẹp); commit riêng cho từng bài.

## 7. Lộ trình thực hiện

| Giai đoạn | Nội dung | Kết quả kiểm |
|---|---|---|
| **P0 — nền** | Khối nội dung mới (mục 5 dòng 1), từ điển tại chỗ, chip nguồn, thẻ nhớ; mở rộng `practice_verify.py` cho lý thuyết | Một bài thử viết bằng khối mới chạy đúng, số được kiểm bằng script |
| **P1 — thí điểm (3 bài, chọn vì nối thẳng với Project)** | **18 Feature scaling**, **12 Classification metrics** (cùng 11 Confusion matrix), **08 K-fold** | Người học đọc xong tự nói lại được trục và khoảnh khắc hiểu; bạn duyệt trước khi làm hàng loạt |
| **P2 — Module 01 phần dữ liệu và đánh giá** | 02, 04, 05, 06, 07, 09, 10, 13, 14 | theo mục 6 |
| **P3 — Module 01 phần tiền xử lý** | 16, 17a/b, 19, 20, 21a/b, 22, 15, 01, 03, 23 | theo mục 6 |
| **P4 — Module 02** | Sân thử 2D rồi lần lượt 02, 03, 04, 06, 07, 08, 05, 01 | theo mục 6 |

Quyết định cần bạn duyệt trước khi bắt đầu hàng loạt: (a) việc **tách đôi** các bài 17, 20, 21, 03, 04 (id và thứ tự trong roadmap sẽ đổi); (b) 3 bài thí điểm có hợp lý không; (c) mức độ tương tác: có đồng ý làm công cụ (mục 5) hay chỉ làm hình tĩnh cho một số bài.

## 8. Trang chủ

### Vấn đề của trang chủ cũ
- Cảnh 3D (three.js) và đường zigzag có hiệu ứng: nặng, đẹp mắt nhưng **không giúp người học biết làm gì tiếp**.
- Sáu module trình bày như đồ trang trí, không cho thấy **mình đang ở đâu** và **bài nào nên đọc tiếp**.
- Giao diện kem chấm và nhiều màu, không đồng bộ với các trang bài (đã chuyển sang chế độ đọc dịu mắt).

### Thiết kế mới (đã xây dựng cùng đợt này)
Một cột, chế độ đọc (sáng/tối), từ trên xuống:

1. **Dải tiếp tục học**: nếu đã từng đọc, hiện "Tiếp tục: *tên bài*" kèm nút; nếu chưa, hiện "Bắt đầu: bài 01". Là thứ đầu tiên người học thấy.
2. **Giới thiệu một câu và cách dùng ba bước**: Đọc lý thuyết → Làm Project → Ôn phỏng vấn.
3. **Lộ trình** (trọng tâm): sáu module theo thứ tự, mỗi module một hàng gồm số, tên, mô tả, **số bài và phần trăm đã đọc**, trạng thái (có bài / sắp có). Bấm để mở danh sách bài theo nhóm, mỗi bài có mô tả một dòng và tiến độ. Dòng "đường đi" nối bốn giai đoạn: Nền tảng → Mô hình → Đánh giá → Dự án.
4. **Ba lối vào nhanh**: Project thực hành, Ngân hàng phỏng vấn, Bản đồ thuật toán.
5. **Chân trang tối giản.**

Không còn cảnh 3D, không hiệu ứng cuộn; trang tải nhanh và đọc ngay.

## 9. Việc chưa nằm trong kế hoạch này (ghi để không quên)
- Ngân hàng phỏng vấn (`/phong-van`) vẫn dùng giao diện kem cũ; nên đưa về chế độ đọc ở một đợt riêng.
- Module 03 đến 05 chưa có nội dung; khi viết, áp dụng ngay khuôn ở file này.
- Đồng bộ lại `project-brief.md` sau mỗi giai đoạn.

## 10. Tiến độ và cách làm (cập nhật)

**Đã xong (P0 và P1):** nền (khối mới, từ điển tại chỗ, chip nguồn, làn Đào sâu, thẻ nhớ), bốn công cụ tương tác, và bốn bài thí điểm viết lại: **18 Feature scaling, 12 Classification metrics, 11 Confusion matrix, 08 K-fold**.

### Cú pháp khối mới trong bài lý thuyết
| Khối | Dùng để | Ghi chú |
|---|---|---|
| `:::predict` ... `@answer` ... `:::` | Đoán trước rồi mở kết quả | không đặt tiêu đề (nhãn đã có) |
| `:::ck` ... `@answer` ... `:::` | Kiểm hiểu sau 1 đến 2 nhịp | |
| `:::steps` ... `@step` ... `:::` | Làm tay từng bước, bấm "Bước tiếp theo" | |
| `:::widget tên` ... `:::` | Nhúng công cụ tương tác | tên: `threshold-matrix`, `scaler-before-after`, `fold-visualizer`, `confusion-sorter` |
| `:::card Tên` | Thẻ nhớ cuối phần lõi | tối đa 8 dòng |
| `[[từ:khoá]]`, `[[từ:khoá|chữ hiện]]` | Từ điển tại chỗ | khoá trong `content/glossary.json` |
| `[[ngoài slide]]` | Chip nguồn nhỏ | thay cho "(ngoài slide)" trong tiêu đề |
| `## [sâu] Tên mục` | Mục nằm ở làn **Đào sâu** (gấp lại, có trong mục lục) | giữ nguyên mọi khối cũ bên trong |

### Quy trình đã dùng cho bài thí điểm (lặp lại cho các bài sau)
1. Viết **lõi** vào một file riêng (5 đến 7 nhịp theo thẻ thiết kế ở mục 4); mọi số tính tay phải kiểm bằng Python; mọi số từ dữ liệu Diabetes phải trùng với Project.
2. Ghép bài bằng cách giữ **mọi mục cũ còn giá trị** dưới dạng `[sâu]` (không xoá kiến thức), giữ quiz và mục "Nối sang bài sau".
3. Cần công cụ mới: thêm dữ liệu vào `scripts/make-widget-data.py` (sinh JSON), component trong `components/widgets/`, đăng ký ở `components/widgets/index.tsx`.
4. `npx tsc --noEmit`, `npm run build`, mở trang xem thật (sáng và tối).

### Còn lại
Module 01: 01 đến 07, 09, 10, 13 đến 17, 19 đến 23 (và tách đôi 17, 20, 21). Module 02: toàn bộ (cần Sân thử 2D). Thứ tự theo mục 7.

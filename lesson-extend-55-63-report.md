# Đợt 2 — đối chiếu ghi chú đến hết slide 63

## Ánh xạ đã xem bằng ảnh: slide 39–63 → bài

| Slide | Nội dung trên ảnh | Bài |
|---|---|---|
| 39 | Pipeline bảy bước | 15 |
| 40 | Bảng Pima Diabetes, Outcome tô đỏ | 16 |
| 41 | read_csv và xem bảng trong IDE | 16 |
| 42 | dtypes, hai feature float | 16 |
| 43 | describe, bảng thống kê | 16 |
| 44 | Category distribution 500/268 | 16 |
| 45 | Missing/invalid; bảng Titanic có ô trống | 17 |
| 46 | Remove outliers; chim cánh cụt trắng khác đàn | 17 |
| 47 | MinMaxScaler và StandardScaler, output Pregnancies | 18 |
| 48 | OrdinalEncoder với thứ tự size khai báo | 19 |
| 49 | One-hot, hash, embedding và ưu/nhược | 19 |
| 50 | Pearson r, scatter và quan hệ phi tuyến | 20 |
| 51 | Multicollinearity; ngưỡng tham khảo và sơ đồ Venn | 20 |
| 52 | Ranh giới Logistic Regression trước/sau RandomOverSampler | 21 |
| 53 | Original, RandomOverSampler, SMOTE, ADASYN | 21 |
| 54 | ClusterCentroids: tập resample và vùng quyết định | 21 |
| 55 | Step 4, matplotlib và seaborn | 22 |
| 56 | Histogram nhiều cột qua data.hist | 22 |
| 57 | Density plot, subplots và layout | 22 |
| 58 | Box plot nhiều cột | 22 |
| 59 | data.corr và bảng số | 22 |
| 60 | seaborn heatmap, annot=True | 22 |
| 61 | Scatter matrix, histogram đường chéo | 22 |
| 62 | Figure/Axes/Axis, title, nhãn trục và ticks | 22 |
| 63 | So có/không grid và có/không legend | 22 |

Không đổi mapping 17 = 45–46, 18 = 47. Ảnh 45 không có biểu đồ so phân phối
trước/sau imputation hay MissForest; phần đó được ghi rõ là bổ sung từ ghi chú.
Không có RegEx hoặc Step 5 trong dải 55–63. Theo lựa chọn bổ sung của chủ repo,
bài 23 vẫn được viết từ ghi chú, `slides: null`, có note nguồn và không có viewer giả.

## Thay đổi bài cũ

- **17:** bổ sung cách hiểu ngưỡng xóa khoảng 5%, median/mode, ví dụ co phương
  sai và yếu tương quan; MissForest và ví dụ IterativeImputer + RandomForest
  cho feature số, fit chỉ train. Pitfall outlier là tín hiệu; điều chỉnh câu
  C về khi không được xóa, thêm quiz cho kiến thức mới.
- **18:** ví dụ km/m; giới hạn thang đo theo thuật toán; ±3 chỉ là quy tắc
  gần chuẩn, không là biên StandardScaler; outlier và cột hằng. Sửa nhận xét
  chưa có cơ sở về tầm quan trọng y học và “10 lần quan trọng”; phần bình
  phương khoảng cách thực tế là 100 so với 1. Giữ code/ví dụ cũ.
- **20:** model phi tuyến vẫn học được quan hệ tuyến tính; phân biệt ổn định
  dự đoán với coefficient/importance, ảnh hưởng thay thế giữa feature,
  không tự động bỏ cột; thêm quiz và link sang heatmap/scatter ở bài 22.
- **21:** giới hạn phạm vi class balancing, phân biệt gặp mẫu nhiều hơn với
  đa dạng quan sát; nhắc train-only, accuracy cần baseline/metric theo class,
  nối về outlier bài 17 và sang Step 4 bài 22. Không chép lại cơ chế resampling
  vì bài đã có đủ RandomOverSampler, SMOTE, ADASYN và undersampling.
- **16/19:** đã bao phủ thống kê, dtype/ý nghĩa dữ liệu và encoding liên quan
  ghi chú; không sửa để tránh lặp nội dung.
- **15:** bản đồ Step 4 trỏ bài 22 ở module 01; thêm công cụ RegEx từ ghi chú.
  Module 04 vẫn trống, không sao chép bài sang đó.

## Bài mới và tích hợp

- **22 — data-visualization:** cả năm loại biểu đồ, cách đọc, bẫy, bảng chọn,
  bin/count/density và whisker tính tay; Figure/Axes/Axis, grid/legend từ
  slide 62–63. Code tạo đủ năm biểu đồ và hình nhãn/grid/legend.
- **23 — regular-expressions:** pattern, raw string/escape, character classes,
  quantifiers, anchors/groups, search/match/fullmatch/findall/finditer/sub,
  ví dụ trích mã đơn, kiểm ngày/điện thoại, greedy/lazy, backtracking và
  kiểm khác biệt engine RegExr/Python. Đây là bài bổ sung không có slide.
- Giữ nguyên ID/order/file của 01–21, thêm 22/23 liên tục. Bài 22 ở nhóm quy
  trình theo yêu cầu; bài 23 ở **Công cụ hỗ trợ** vì là kỹ năng xử lý chuỗi
  dùng xuyên pipeline, không tự coi là một Step ML trên slide.
- Index, bản đồ phụ thuộc và `/phong-van` lấy từ roadmap/parser nên tự có bài
  mới, không cần hard-code thêm trong component. Đã rà code/UI/brief: không
  có tổng 21 bài cố định cần thay. Báo cáo đợt 1 giữ số cũ như lịch sử.
- Tổng mới: **23 bài, 295 câu** (A 121, B 99, C 75), **174 câu B/C**, 30 quan hệ
  tiên quyết. Mỗi bài mới có A/B/C = 5/4/3; bốn bài cũ thêm mỗi tầng một câu.

## Các ý ghi chú đã làm rõ kỹ thuật

1. Xóa dưới khoảng 5% không tự an toàn nếu thiếu tập trung ở nhóm hiếm;
   median/mode là baseline, không luôn tốt nhất.
2. MissForest dùng quan hệ có điều kiện, không là quy tắc lấy theo tần suất
   và không bảo đảm giữ nguyên phân phối. Ví dụ regressor số không giả làm
   triển khai MissForest đầy đủ cho mixed types.
3. StandardScaler không Gaussian hóa, không chặn [−3,3], không luôn ít
   nhạy outlier hơn MinMax trên mọi tiêu chí. Scaling không quyết định
   “quan trọng về nghiệp vụ”.
4. Phi tuyến không có nghĩa bỏ qua quan hệ tuyến tính. Feature tương quan
   có thể làm importance khó đọc dù dự đoán vẫn ổn; bỏ cột cần kiểm chứng.
5. Class balancing thuộc classification; regression vẫn có thể có vùng
   target hiếm. Class thiểu số không đồng nghĩa outlier, và accuracy không
   vô nghĩa trong mọi cách sử dụng.
6. Histogram gom khoảng để biểu diễn; KDE ước lượng trơn, không đổi bản
   chất biến. “Box/scatter matrix ít dùng” giữ như ưu tiên trong buổi học,
   không khẳng định là quy luật chung. Pearson cần ý nghĩa định lượng,
   không chỉ dtype số.
7. RegExr hỗ trợ engine khác Python; định dạng đúng không chứng minh ngày,
   số điện thoại/email tồn tại. Không chạy mẫu catastrophic backtracking
   trên input dài trong ví dụ.

## Kiểm chứng và giới hạn

- `npx tsc --noEmit`, `npm run build`: pass, sinh **34/34** trang; không có
  warning mới từ build.
- Script tạm kiểm toàn bộ 23 bài: frontmatter, map slide, IDs/needs,
  container/fence, tier/EN/WANT, section không rỗng, key duy nhất, dependency
  không chu trình. Kiểm code block cũ trong bài sửa vẫn còn nguyên.
- Chạy code mới và tính lại ví dụ bằng Python. Ví dụ imputation: std phần
  quan sát 8.1649658 → sau điền 6.3245553; r 1 → 0.4472136. Forest imputer
  chạy xong trong 15 lượt với cấu hình ghi trong bài, không warning.
- Code biểu đồ dùng Diabetes **regression có sẵn trong sklearn**, không phải
  Pima CSV trên slide (repo không chứa CSV); nguồn và khác biệt đã ghi rõ.
  Đã tạo và xem ảnh đầu ra. RegEx dùng thư viện chuẩn `re`, ví dụ tự soạn.
- Kiểm Chrome headless desktop/mobile 390px: các bài sửa/thêm, TOC, quiz,
  code copy, slide chip/viewer (trừ ngoại lệ 23), link, Prev/Next, index/
  dependency map và lọc câu mới trong ngân hàng phỏng vấn.
- Script, dữ liệu kiểm và ảnh chụp nằm trong `%TEMP%/ml-hub-round2`, không
  commit. Không thêm dependency frontend, không đổi design Notebook.
- Không push, không merge. File prompt chưa track của chủ repo được giữ nguyên.

Nguồn đối chiếu: [MissForest](https://arxiv.org/abs/1105.0828),
[IterativeImputer](https://scikit-learn.org/stable/modules/generated/sklearn.impute.IterativeImputer.html),
[matplotlib](https://matplotlib.org/stable/users/explain/quick_start.html),
[pandas KDE](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.plot.density.html),
[Python re](https://docs.python.org/3/library/re.html), [RegExr](https://regexr.com/).

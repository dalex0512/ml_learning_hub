# Đợt 9 — Thực hành Diabetes

## Phạm vi

- Làm thẳng trên **main**, bắt đầu từ13b4784; đã xác nhận Tree/Forest có trong main.
  Không tạo nhánh, không push; giữ nguyên4 file codex-prompt chưa track.
- Module06 có2 bài: `diabetes-first-model` (6 mục chính, bước0–5) và
  `diabetes-evaluate-improve` (4 mục chính, bước6–9), nhóm “Thực hành 1 — Diabetes”.
  Toàn site33 bài (23+8+2). Unsupervised vẫn chưa viết.
- Mỗi bước mục tiêu → lý thuyết → code ≤15 dòng → kết quả → tự làm có đáp án gấp.
  Có15 bài tập chính bài1,12 bài tập bài2, thêm1 khởi động ở bước0; hai bộ code sạch
  gấp riêng để luyện gõ. Quiz bài1 A/B/C=3/3/2; bài2=4/5/3 theo prompt.
- Không sửa TS/React/CSS/dependency: slides vốn tùy chọn nên bỏ frontmatter slides,
  không viewer/chip giả. Container :::code chưa có loại riêng: dùng fenced python
  vốn có nút copy; details/summary HTML đã được renderer hỗ trợ để gấp đáp án/code.
- Commit CSV nguyên trạng,8 ảnh matplotlib từ code thật,2 bài; roadmap,8 link ngược
  tự nhiên từ module01/02, brief. Không thêm bài khác hay viết lại lý thuyết cũ.

## Bước0 — dữ liệu và đối chiếu ghi chú

Môi trường: Python3.14.6, pandas3.1.1, NumPy2.5.4, sklearn1.9.1.
768×9;7 cột int64, BMI/DPF float64;không NaN;Outcome0=500 (65.1042%),1=268 (34.8958%).
CSV không kèm metadata nguồn: bài dùng tên thông dụng Pima Diabetes nhưng không suy
thêm dân số/tính đại diện. Ảnh correlation gốc không có trong attachment lượt này;
chỉ đối chiếu các số được nêu trong prompt.

| Cột | Số0 | Cách hiểu trong bài |
|---|---|---|
| Pregnancies | 111 | Hợp lệ |
| Glucose | 5 | Coi là missing sentinel |
| BloodPressure | 35 | Coi là missing sentinel |
| SkinThickness | 227 | Coi là missing sentinel |
| Insulin | 374 | Coi là missing sentinel |
| BMI | 11 | Coi là missing sentinel |
| DPF | 0 | Không có số0 |
| Age | 0 | Không có số0 |
| Outcome | 500 | Nhãn0 hợp lệ, không impute |

Pearson và Spearman với Outcome (CSV thô):

| Feature | Pearson | Spearman |
|---|---|---|
| Glucose | 0.466581 | 0.475776 |
| BMI | 0.292695 | 0.309707 |
| Age | 0.238356 | 0.309040 |
| Pregnancies | 0.221898 | 0.198689 |
| DiabetesPedigreeFunction | 0.173844 | 0.175353 |
| Insulin | 0.130548 | 0.066472 |
| SkinThickness | 0.074752 | 0.089728 |
| BloodPressure | 0.065068 | 0.142921 |

Các giá trị Glucose.487/BMI.317/Age.314 trong prompt **không khớp cả Pearson lẫn
Spearman trên CSV thô này**; không gán ảnh là Spearman. Cần nguồn ảnh/bản dữ liệu/
quy trình làm sạch để giải thích chênh lệch. Correlation thấp không chứng minh
phải chọn phi tuyến, càng không chứng minh feature không ảnh hưởng target.

Đối chiếu từng ghi chú:

| Ghi chú | Kết quả/điều chỉnh |
|---|---|
| Correlation để chọn tuyến tính/phi tuyến | Chỉ gợi ý ứng viên; kiểm bằng CV, không suy mô hình bắt buộc. |
| axis=0 tìm hàng Outcome nên lỗi | Đã thử pandas3.1.1: KeyError("['Outcome'] not found in axis"). axis1 bỏ cột, y là Series. |
| test_size/train_size chỉ dùng1 | Chỉ cần1; cả hai vẫn hợp lệ nếu tổng≤1. Thử.6/.2 cho460/154,154 hàng không dùng; tổng>1 lỗi. |
| Index lộn xộn, cần random_state | Index train đầu[60,618,346,294,231]. Cùng42 lặp đúng; None thường đổi. Split seed42 và model seed200 là độc lập. |
| Fit chỉ trên train | Đúng với bước học thống kê; median/scale trong fold. transform test, không refit. Pipeline không tự chữa feature tương lai. |
| MinMax nhạy outlier, dùng Standard | Cả hai nhạy; không xếp hạng tuyệt đối. Ví dụ thợ may giữ nguyên; RobustScaler chỉ nhắc tên. |
| Cây không cần scale | Raw/scale đổi1/35/17/0/0 nhãn test với Logistic/KNN/SVM/Tree/Forest trong demo. Không hứa scale luôn tăng điểm hay cây bất biến tuyệt đối trước sai số số học. |
| Linear/logistic/SVM/KNN cần scale | Nhấn khoảng cách/tối ưu/penalty; Logistic mặc định L2,C1. Không khẳng định linear không penalty giải chính xác bắt buộc scale. |
| Thiếu import và X_test hoa | Nêu NameError hai import report/matrix, nhầm x_test/X_test; không sửa im lặng. |
| Chia60/20/20 | .25×.8=.2; kích thước thật460/154/154 do làm tròn. |
| “Phi tuyến tốt hơn” | Không là định lý. Logistic hơn Forest baseline ở split42; thứ hạng đổi khi seed split đổi; CV pipeline sau xử lý lại chọn Forest theo F1. |

## Số chính đã kiểm

- Split42 không stratify để giữ code gốc:614train/154test; nhãn train401/213,
  test99/55. Stratify cho400/214 và100/54. Tỉ lệ1 train/test lần lượt34.6906%/35.7143%
  ở bản gốc,34.8534%/35.0649% với stratify.
- Standard train mean≈0 (max abs≈5.7e-16), std(ddof0)≈1;test mean không0.
  MinMax test SkinThickness max1.571429. Cách sai scaler fit toàn bộ vẫn có
  accuracy.753247 bằng cách đúng, nhưng vẫn leakage. set_output(pandas) đã probe chạy được.
- Baseline Logistic matrix[[79,20],[18,37]], đúng116/154; baseline toàn0 đúng99/154,
  recall1=0. Report từng class, macro/weighted/support được tính lại trong bài.

| Baseline sau scale, chưa điền missing | Accuracy | Precision1 | Recall1 | F1 |
|---|---|---|---|---|
| Logistic | 0.753247 | 0.649123 | 0.672727 | 0.660714 |
| KNN | 0.694805 | 0.583333 | 0.509091 | 0.543689 |
| SVM | 0.733766 | 0.645833 | 0.563636 | 0.601942 |
| Tree | 0.753247 | 0.639344 | 0.709091 | 0.672414 |
| Forest | 0.740260 | 0.631579 | 0.654545 | 0.642857 |

Seed200 cho Tree/Forest/SVM, split42; Logistic max_iter1000 trong vòng so sánh cho cùng
kết quả default ở code gốc. Ngưỡng.3/.5/.7:precision=.545455/.649123/.818182,
recall=.763636/.672727/.490909. Ở.3 so.5:TP37→42,FN18→13,FP20→35.
Đây là đo để học, không chọn ngưỡng sàng lọc bằng test hay đưa khuyến nghị lâm sàng.

Median train năm cột=118/72/28.5/120/32;Insulin train quan sát324 giá trị,
mean154.330247,median120,max846. Logistic sau impute có accuracy.753247,
precision.666667,recall.618182,F1.641509:recall/F1 giảm,không tô vẽ cải thiện.

| Pipeline (median→scale→model),614development,5fold | CV F1 mean±std | CV Recall mean±std |
|---|---|---|
| Logistic | 0.602202 ± 0.071747 | 0.540089 ± 0.111092 |
| KNN | 0.622593 ± 0.041217 | 0.605648 ± 0.078152 |
| SVM | 0.593329 ± 0.059601 | 0.526135 ± 0.065986 |
| Forest | 0.641642 ± 0.044954 | 0.601550 ± 0.057183 |

CV StratifiedKFold shuffle42,ddof0. Demo chốt F1 rồi chọnForest;refit614development,
held-out demo accuracy.759740/precision.65/recall.709091/F1.678261. Nếu chốt recall,
KNN mean.605648 nhỉnh hơnForest.601550,không đủ để khẳng định vượt trội.
Pipeline Logistic và cách làm tay cho cùng toàn bộ prediction154 mẫu.
**Test đã được xem ở các bước trước**:CV không làm test mới trở lại. Báo rõ đây
là minh họa quy trình, cần test độc lập mới để có đánh giá cuối đáng tin.

## Kiểm chứng, độ dài và việc còn lại

- `python -I` với dependency paths tường minh: chạy2 bộ code hoàn chỉnh trong namespace
  mới và mọi snippet theo thứ tự, gồm27 bài tập và khởi động; không warning Python.
  Assert số đếm,shape,metrics,report,CV,proba,imputer/pipeline,fit/transform,splits.
  Khảo sát riêng chạy toàn bộ ví dụ seed7/42/123,raw/scale,leakage,correlation.
- Script/JSON/log/ảnh kiểm ở `%TEMP%/ml-hub-round9`,không đưa vào content/repo.
  Đã xem8 ảnh matplotlib; không dùng ảnhAI.
- Build44/44 trang,tsc,diff-check và parser pass:33 bài,430 câu(A170/B151/C109),
  bank260 B/C,67 needs,không link chết/chu trình.2 bài không slides;6/4 mục chính,
  mọi snippet hướng dẫn/bài tập≤15 dòng;chỉ2 bộ code hoàn chỉnh dài hơn.
- Chrome1300px/390px:TOC/progress,không slide giả,đáp án details đóng mặc định/mở được,
  copy nguyên văn mọi Python block kể cả bộ hoàn chỉnh,8 ảnh/linkgốc,quiz/tầng/EN/WANT,
  module06 có2 bài và map đúng,bank lọc bài/tag/tìm kiếm,prevnext và8 backlink:pass.
  Không lỗiJavaScript hay tràn ngang toàn trang;bảng/code cuộn trong khung.
- Chỗ còn dày:fit/transform ở bước4,report/ngưỡng ở bước6;đã gấp bài tập/setup/code
  hoàn chỉnh và nối bài lý thuyết thay vì lặp;khuyên học hai buổi,không mở mọi đáp án cùng lúc.
- Chưa làm:ảnhcorrelationgốc để xác minh khác biệt;datasetnguồn/metadata gốc;
  testđộc lập mới,calibration/tuningthreshold,ứng dụngy tế;Unsupervised và bàiProjects khác.
  Gợi ý tiếp:đổi sang bảngmới/tập holdout mới,hoặc học threshold từ out-of-fold.

## Phụ lục — Pearson đầy đủ (CSV thô)

Thứ tự cột:Pregnancies,Glucose,BloodPressure,SkinThickness,Insulin,BMI,DPF,Age,Outcome.

```text
 1.000  0.129  0.141 -0.082 -0.074  0.018 -0.034  0.544  0.222
 0.129  1.000  0.153  0.057  0.331  0.221  0.137  0.264  0.467
 0.141  0.153  1.000  0.207  0.089  0.282  0.041  0.240  0.065
-0.082  0.057  0.207  1.000  0.437  0.393  0.184 -0.114  0.075
-0.074  0.331  0.089  0.437  1.000  0.198  0.185 -0.042  0.131
 0.018  0.221  0.282  0.393  0.198  1.000  0.141  0.036  0.293
-0.034  0.137  0.041  0.184  0.185  0.141  1.000  0.034  0.174
 0.544  0.264  0.240 -0.114 -0.042  0.036  0.034  1.000  0.238
 0.222  0.467  0.065  0.075  0.131  0.293  0.174  0.238  1.000
```

SHA256 CSV nguyên trạng: `698c203a14aa31941d2251175330c9199f3ccdb31597abbba2a3e35416257a72`.

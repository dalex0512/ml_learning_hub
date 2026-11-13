# Đợt 4 — Polynomial Regression

Ngày kiểm chứng: 13/11/2026. Nhánh: `feat/supervised-polynomial-regression`.

## Ánh xạ slide đã xem bằng ảnh

| Slide | Nội dung thật | Xử lý |
|---|---|---|
| 67 | Tiêu đề Polynomial Regression; scatter có đường cong chữ U bên trái; hai hình “Simple linear model” / “Polynomial model” bên phải. Công thức b0+b1x và b0+b1x1+b2x1², trong đó số 1 là chỉ số feature, 2 là số mũ. Không có bảng tọa độ, code hoặc bảng ưu/nhược. | Bài 03 `polynomial-regression`, frontmatter/viewer đúng slide 67 |
| 68 | Logistic Regression; S-curve, mức 0/0.5/1, threshold, điểm y=0.3/y=0.8 và hình sigmoid. | Chủ đề kế tiếp, chưa viết bài |
| 69 | Logistic Regression; scatter hai class với đường phân tách, hình sigmoid và GOOD/BAD. | Cùng chủ đề kế tiếp, chưa viết bài |

Polynomial kết thúc ở 67 vì 68 đổi tiêu đề/thuật toán rõ ràng. Không suy đoán
dải slide Logistic sau 69. Đã phóng to vùng công thức 67 để đọc chỉ số/số mũ;
giữ b của slide và giải thích tương ứng β ở bài Linear trước. Không có điểm
mờ/mơ hồ cần chủ repo xác nhận trong phạm vi này. Không đoán tọa độ scatter.

## Bài mới và phần ngoài slide

`content/02-supervised-learning/03-polynomial-regression.md` nối trực tiếp bài
Linear: từ residual hình cong → tạo feature → công thức bậc d → giải tay → code
→ chọn bậc và các bẫy. Các ký hiệu được giải thích tại chỗ: x², b2, d, A, chuyển
vị/nghịch đảo, n feature khác N mẫu, tổ hợp, nội suy/ngoại suy và Pipeline.

Phần **bổ sung ngoài slide** đã ghi nhãn rõ, gồm:

- Hook nhu cầu sưởi/làm mát; bộ số năm điểm tự soạn, không phải tọa độ slide.
- Bậc 1/2/3/d, tuyến tính theo hệ số; tác động theo x thay đổi theo vị trí,
  không được giữ x² cố định khi thay x.
- Ma trận thiết kế, đủ các tổng AᵀA/Aᵀy, giải ba phương trình bằng khử từng bước,
  prediction/residual/MSE/RMSE và đối chiếu NumPy/sklearn.
- Nhiều input, tích chéo và công thức số cột; ví dụ 10 input bậc 3 có **285**
  cột không hằng, không phải 286.
- Bảng train/validation, CV/test, underfit/overfit, nội suy N điểm x phân biệt,
  Runge khác ngoại suy, center/scale/cộng tuyến, outlier, Ridge/Lasso chỉ ở mức
  khái niệm. Không viết thuật toán khác.
- Bốn Python block chạy được và ảnh matplotlib sinh từ đúng code, có link ảnh
  gốc. Không dùng `:::code` vì parser không có container đó; dùng heading Code
  và fenced Python đúng hạ tầng hiện có, có nút copy.

Đã đọc lại theo góc nhìn người mới: giải thích vì sao chọn x đối xứng, không bỏ
bước tính tổng/khử phương trình; không coi train error 0 là bằng chứng model tốt.
Quiz mới **A/B/C = 5/5/3**, đầy đủ EN/WANT; đáp án theo ý chính → lý do → ví dụ.

## Bảng số chính đã chạy

Demo tự sinh 80 mẫu, seed 42: x đều trong [−1,1], y = 1+2x² + nhiễu Gaussian
std 0.2. Tách test 16; development 64; bảng holdout cố ý train nhỏ 16 / val 48.
Mỗi hàng dùng cùng split, Pipeline PolynomialFeatures → StandardScaler → OLS.

| d | MSE train | MSE validation | Mean MSE CV 5-fold trên development |
|---|---|---|---|
| 1 | 0.290760 | 0.326536 | 0.297014 |
| 2 | 0.011856 | **0.049132** | **0.038220** |
| 3 | 0.006578 | 0.057918 | 0.038337 |
| 5 | 0.006412 | 0.056852 | 0.039231 |
| 9 | **0.003912** | 17.742702 | 0.086073 |

Chọn d = 2 bằng CV; refit 64 mẫu development; **test MSE = 0.032951**.
Không chọn/tune bằng test. Bảng holdout và CV khác lượng dữ liệu fit, không
coi là hai điểm số của cùng một model. Bậc 2/3 có CV gần nhau; không tuyên bố
mọi dataset nên chọn 2. Val không tăng đều từng bước; đã giải thích trong bài.

Những phép tính khác đã kiểm:

- Ví dụ x = [−2,−1,0,1,2], y = [1,0,1,4,9]: đường thẳng 3+2x, residual
  [2,−1,−2,−1,2], SSE 14, MSE 2.8, RMSE 1.673320053.
- AᵀA = [[5,0,10],[0,10,0],[10,0,34]], Aᵀy = [15,20,44]; giải b = [1,2,1].
  x=1.5 → 6.25; SSE/MSE/RMSE bậc hai đúng toán là 0, code MSE ≈ 2.96e−32.
- Các tổng bậc 0–4, từng tích xy/x²y, mức tăng từ x=1 tới 2 là 5, độ dốc tại
  1/2 là 4/6, số feature 5 và 285 đều có assertion Python.
- corr(x,x²) với x=1,…,10 là 0.974558629; center trước khi tạo z² cho corr=0.
  Chỉ scale hai cột có sẵn vẫn giữ corr cũ; corr=0 không có nghĩa độc lập.
- Train nhỏ có max x ≈ 0.6654, val còn có điểm phía phải xa hơn. Bài nêu rõ
  độ phủ miền cũng góp phần vào lỗi bậc cao, không quy hết cho noise.
- Ngoại suy model demo tại x=2: hàm sinh không nhiễu = 9, bậc 2 ≈ 9.1387,
  bậc 9 ≈ 83,311.7590. Là model fit 16 mẫu trước CV/refit; không lẫn với model cuối.

## Liên kết và hạ tầng

- Roadmap thêm bài order 3, group “Mô hình hồi quy”. Overview đổi dòng Polynomial
  từ “Sắp có” thành chip, sửa note/recap/next cũ; các họ khác vẫn chưa có link chết.
- `:::next` Linear liên kết Polynomial, thêm lý do đường thẳng không đủ cho
  dữ liệu cong; K-fold thêm một liên kết tự nhiên tới ví dụ chọn degree bằng CV.
  Không viết lại các bài cũ, không đổi quiz/code của chúng.
- Module index, dependency map chéo module và bank lấy dữ liệu từ roadmap/parser
  nên tự có bài mới; **không cần sửa hạ tầng TypeScript/React** ở đợt này.
- Brief hiện 26 bài (23 module 01, 3 module 02), liệt kê bài mới/asset/quy tắc.
  Không thấy số 25/2 bài hard-code trong UI/README phải sửa; số 25 ở brief được
  ghi rõ là trạng thái kết thúc đợt 3. Báo cáo đợt trước giữ nguyên làm lịch sử.

## Kiểm chứng và bàn giao

- `npx tsc --noEmit`, `npm run build`: pass, **37/37 trang**, route mới được sinh,
  không warning build mới. `git diff --check`: pass.
- Script dùng parser thật kiểm **26 bài, 332 câu** (A 135, B 113, C 84), **197 câu
  B/C**, 39 quan hệ needs; frontmatter/ID/order/title/link, slide, container/fence,
  EN/WANT hợp lệ, không chu trình hoặc key trùng. Module 02 có 37 câu tổng.
- So main: roadmap module 01 và code cũ giữ nguyên; module 01 chỉ bài 08 thêm
  link/EN. Những bài cũ còn lại không đổi nội dung. Module 02 chỉ cập nhật liên
  kết/note liên quan, không thay code hoặc quiz cũ.
- Chạy cả bốn Python block không warning, NumPy 2.5.4 / sklearn 1.9.1. Assertion
  so bảng ở độ chính xác sáu chữ số, mọi số tay/quiz/split/correlation đều khớp.
- Chrome headless 1300px và 390px: H1/description, TOC/scrollspy, viewer/chip
  slide 67/Esc, quiz ba tầng, mở từng/tất cả đáp án, EN/WANT, copy đúng Python,
  không cuộn ngang toàn trang ở từng section; bảng/code rộng cuộn trong khung.
  Duyệt screenshot bài, phép tính tay, công thức, ảnh plot và map.
- Kiểm module 02 có 3 bài, map có node Polynomial và tiên quyết module 01,
  Prev/Next Linear ↔ Polynomial, backlinks overview/Linear/K-fold, module 01
  vẫn 23 bài. Bank lọc bài mới được **8 câu B/C**, **13 câu khi bật mọi tầng**,
  tag `polynomial-regression` hoạt động; không lỗi JS.
- Script và screenshot nằm ngoài repo ở `%TEMP%/ml-hub-round4`, không commit.
  Asset `public/plots/polynomial-degree-comparison.png` được commit cùng bài,
  sinh bằng matplotlib, không phải ảnh AI. Không thêm dependency frontend.

Không còn việc chưa làm trong phạm vi Polynomial. Logistic 68–69 và các chủ đề
sau đó chưa viết đúng yêu cầu. Commit nhỏ trên nhánh riêng; **không push, không
merge**. Giữ nguyên ba file prompt chưa track của chủ repo.

Nguồn đối chiếu ngoài slide: [PolynomialFeatures](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.PolynomialFeatures.html),
[Pipeline](https://scikit-learn.org/stable/modules/generated/sklearn.pipeline.Pipeline.html),
[underfit/overfit](https://scikit-learn.org/stable/auto_examples/model_selection/plot_underfitting_overfitting.html),
[NumPy polyfit](https://numpy.org/doc/stable/reference/generated/numpy.polyfit.html),
[Chebfun — Runge](https://www.chebfun.org/docs/guide/guide04.html).

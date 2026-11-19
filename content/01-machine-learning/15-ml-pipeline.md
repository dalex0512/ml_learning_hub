---
title: Machine Learning Pipeline — 7 bước của một dự án ML
order: 15
description: "Bảy bước của slide 39, mỗi bước học ở bài nào và ở đâu trong Project, vì sao pipeline là chu trình lặp, và dùng Pipeline của scikit-learn để các bước học từ dữ liệu không rò rỉ."
slides: 39
needs: [model-training-pipeline, train-test-split, classification-metrics, regression-metrics]
tags: [pipeline, workflow, deployment, leakage]
---

## Từ các mảnh kiến thức đến một dự án trọn vẹn

:::intro Mục tiêu bài này
- Nhớ **bảy bước** của slide 39 và câu hỏi mà mỗi bước trả lời.
- Biết mỗi bước được học ở bài nào của khóa và ở bước nào của Project.
- Hiểu pipeline là **chu trình lặp**, và dùng `Pipeline` của scikit-learn để các bước học từ dữ liệu không rò rỉ.
:::

Mỗi bài trước dạy một mảnh. Bài này ghép chúng thành bản đồ để bạn biết mình đang đứng ở đâu. Slide 39 vẽ **Machine Learning pipeline** gồm bảy bước:

:::slides 39 | Slide 39: Machine Learning pipeline, bảy bước từ Data collection đến Model deployment
:::

| Bước | Tên (slide 39) | Ý nghĩa | Câu hỏi | Học ở |
|---|---|---|---|---|
| 1 | Data collection | Thu thập dữ liệu | Có dữ liệu nào, nhãn đến từ đâu? | [[bài:labeled-data]] |
| 2 | Statistics | Hiểu dữ liệu thông qua thống kê | Dữ liệu trông thế nào, có gì lạ? | [[bài:descriptive-statistics]] |
| 3 | Data preprocessing | Tiền xử lý dữ liệu | Làm sạch, biến đổi ra sao? | [[bài:missing-values-outliers]], [[bài:feature-scaling]], [[bài:categorical-encoding]], [[bài:correlation-multicollinearity]], [[bài:imbalanced-data]] |
| 4 | Data visualization | Trực quan hóa dữ liệu | Hình vẽ nói gì? | [[bài:data-visualization]] |
| 5 | Model building | Xây dựng và huấn luyện mô hình | Chọn model nào, học ra sao? | Module 02 |
| 6 | Model evaluation | Đánh giá mô hình | Tốt đến đâu, sai kiểu nào? | [[bài:train-test-split]], [[bài:confusion-matrix]], [[bài:classification-metrics]], [[bài:regression-metrics]] |
| 7 | Model deployment | Triển khai mô hình | Đưa vào dùng thật thế nào? | ngoài phạm vi khóa này |

Hãy bấm từng bước để xem câu hỏi, đầu ra và lỗi hay gặp của nó.

:::widget flow-map
pipeline7
:::

:::predict
Bạn vừa nhận một file CSV mới. Việc đầu tiên nên làm là huấn luyện thử một model cho nhanh, hay nhìn dữ liệu trước?
@answer
**Nhìn dữ liệu trước** (Step 2). Trong Project Bước 1, nhìn dữ liệu cho thấy mức sàn 65.1% và năm cột có số 0 vô lý; nếu huấn luyện ngay, ta không biết điểm 75% là tốt hay tệ, và không biết dữ liệu đang có lỗi. Nhìn dữ liệu rẻ, huấn luyện trên dữ liệu bẩn đắt.
:::

## Pipeline không phải đường thẳng

Bảy bước nghe như một dây chuyền, nhưng thực tế là **vòng lặp**:

- **Đánh giá (Step 6) thấy điểm kém:** quay về tiền xử lý (Step 3) hoặc thu thập thêm dữ liệu (Step 1).
- **Trực quan hóa (Step 4) lộ ra lỗi:** quay lại thống kê (Step 2) hoặc làm sạch (Step 3).
- **Model chạy thật (Step 7) gặp dữ liệu khác lúc học** (dữ liệu "trôi"): quay về Step 1.

Project Diabetes là một lượt đi qua pipeline và có một vòng lặp thật: Bước 1 (Step 2) phát hiện số 0 vô lý; Bước 5 (Step 6) đọc kết quả; Bước 7 quay lại xử lý số 0 (Step 3) và **đo lại** xem có cải thiện không (câu trả lời: không đáng kể). Mỗi vòng lặp có đo lường, không phải làm theo linh cảm.

| Bước Project | Step của pipeline |
|---|---|
| 1. Nhìn dữ liệu | Step 2 (statistics) |
| 2. Tách đề, cất bộ test | Step 3 (chuẩn bị) và đánh giá |
| 3. Chuẩn hoá | Step 3 (preprocessing) |
| 4. Huấn luyện, dự đoán | Step 5 (model building) |
| 5, 6. Đọc kết quả, so sánh bằng CV | Step 6 (evaluation) |
| 7. Số 0 thiếu | Step 3 (lặp lại) |
| 8. Chốt mô hình | Step 5 và 6 |

## Rò rỉ trong pipeline, và `Pipeline` của scikit-learn

Rủi ro lớn nhất khi ghép các bước là **rò rỉ dữ liệu** ([[từ:data-leakage]]): mọi bước **học từ dữ liệu** (điền thiếu, scale, mã hóa, chọn feature) chỉ được `fit` trên train. Bảng sau nói bước nào "học" và học cái gì:

| Bước tiền xử lý | Học gì từ dữ liệu | Rò rỉ nếu fit trên cả test |
|---|---|---|
| Điền thiếu (`SimpleImputer`) | median, mean | median tính cả test |
| Scale (`StandardScaler`) | mean, std | mean, std tính cả test |
| Mã hóa (`OneHotEncoder`) | danh sách nhóm | nhóm của test lọt vào |
| Resample (SMOTE) | các mẫu lân cận | mẫu test sinh ra "con cháu" trong train |

Cách để **không thể làm sai** là gói tất cả vào một `Pipeline`:

```python
pipe = Pipeline([("imputer", SimpleImputer(strategy="median")),
                 ("scaler", StandardScaler()),
                 ("model", LogisticRegression())])
pipe.fit(x_train, y_train)      # tự fit từng bước, chỉ trên train
pipe.predict(x_test)            # tự transform test bằng số đo của train
```

Thứ tự trong Pipeline cũng quan trọng: **điền thiếu trước, rồi scale**, vì scaler không xử lý được ô `NaN`. Và `cross_validate(pipe, ...)` tự `fit` lại cả chuỗi trong **từng fold** ([[bài:k-fold-cross-validation]]).

:::ck
Bạn phát hiện điểm test thấp. Có nên cứ đổi sang model phức tạp hơn ngay không? Hay nên làm gì trước?
@answer
**Chưa nên.** Kiểm tra theo thứ tự **rẻ đến đắt**: dữ liệu có lỗi hay rò rỉ không (Step 2, 3), đánh giá có đúng metric không (Step 6), rồi mới thử model khác (Step 5). Đổi model phức tạp trên dữ liệu bẩn thường chỉ làm model học vẹt cái bẩn.
:::

:::ck
Một đồng nghiệp scale toàn bộ dữ liệu trong Step 3, rồi chia train/test ở Step 6. Pipeline sai ở đâu, và sửa thế nào?
@answer
Scale **trước khi chia** đã cho scaler nhìn thấy test (rò rỉ). Sửa: chia trước, `fit` scaler trên train, hoặc đặt scaler trong `Pipeline` để thứ tự luôn đúng. Điểm cao thu được trước đây là lạc quan.
:::

## Đi qua cả bảy bước trên Diabetes bằng một file

Mỗi bước một con số cụ thể (chạy lại bằng đoạn code bên dưới; các bước 3 đến 6 sẽ được giải thích kỹ ở những bài sau):

- **Step 1, thu thập:** `diabetes.csv`, **768** bệnh nhân × **9** cột (8 feature và `Outcome`).
- **Step 2, thống kê:** 500 người không bệnh và 268 người bệnh (65.1% và 34.9%); số 0 vô lý: Glucose 5 dòng, BloodPressure 35, SkinThickness 227, Insulin 374, BMI 11 ([[bài:descriptive-statistics]]).
- **Chia dữ liệu:** 80/20, phân tầng theo `Outcome`: train **614** (400 và 214), test **154** (100 và 54) ([[bài:stratified-k-fold]]).
- **Step 3, tiền xử lý:** đổi số 0 vô lý thành thiếu, điền bằng median **của train**, rồi `StandardScaler`, đều fit trên 614 dòng train.
- **Step 5 và 6:** Logistic Regression, chấm trên 154 dòng test: TN = 82, FP = 18, FN = 27, TP = 27. Accuracy = 109/154 = **0.7078**, precision = 27/45 = **0.60**, recall = 27/54 = **0.50**, F1 = **0.5455**, ROC AUC = **0.813**.
- **Đối chiếu:** model "lười" luôn đoán 0 đạt 100/154 = **0.6494**. Model thật chỉ hơn khoảng 6 điểm và **bỏ sót một nửa** số người bệnh: đúng là bẫy accuracy ([[bài:classification-metrics]]) và lý do khóa học có bước cân bằng dữ liệu ([[bài:imbalanced-data]]).
- **Step 7, triển khai:** lưu model, nạp lại, dự đoán bệnh nhân mới (Glucose 150, BMI 33.5, 45 tuổi) cho xác suất mắc bệnh **0.582**, vượt 0.5 nên kết luận "có nguy cơ".

```python
import numpy as np
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (confusion_matrix, accuracy_score, precision_score,
                             recall_score, f1_score, roc_auc_score)

# Step 1 - thu thập
data = pd.read_csv("diabetes.csv")
# Step 2 - thống kê
print(data.shape)                                   # (768, 9)
print(data.groupby("Outcome").size().to_dict())     # {0: 500, 1: 268}
zero_cols = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
print((data[zero_cols] == 0).sum().to_dict())
# {'Glucose': 5, 'BloodPressure': 35, 'SkinThickness': 227, 'Insulin': 374, 'BMI': 11}

# Chia train/test TRƯỚC khi tiền xử lý
X = data.drop(columns="Outcome")
y = data["Outcome"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)
print(len(X_train), len(X_test))                    # 614 154

# Step 3 - số 0 vô lý thành NaN (sẽ điền bằng median của train)
X_train = X_train.copy(); X_test = X_test.copy()
X_train[zero_cols] = X_train[zero_cols].replace(0, np.nan)
X_test[zero_cols] = X_test[zero_cols].replace(0, np.nan)

# Step 5 - Pipeline gom bước 3 và 5: .fit() trên train nên median, mean, std chỉ tính từ train
model = Pipeline([
    ("impute", SimpleImputer(strategy="median")),
    ("scale", StandardScaler()),
    ("clf", LogisticRegression(max_iter=1000)),
])
model.fit(X_train, y_train)

# Step 6 - đánh giá
y_pred = model.predict(X_test)
y_prob = model.predict_proba(X_test)[:, 1]
print(confusion_matrix(y_test, y_pred))             # [[82 18] [27 27]]
print(f"Accuracy  = {accuracy_score(y_test, y_pred):.4f}")    # 0.7078
print(f"Precision = {precision_score(y_test, y_pred):.4f}")   # 0.6000
print(f"Recall    = {recall_score(y_test, y_pred):.4f}")      # 0.5000
print(f"F1        = {f1_score(y_test, y_pred):.4f}")          # 0.5455
print(f"ROC AUC   = {roc_auc_score(y_test, y_prob):.4f}")     # 0.8130
print(f"Baseline (luôn đoán 0) = {(y_test == 0).mean():.4f}") # 0.6494

# Step 7 - lưu, nạp lại, dự đoán bệnh nhân mới
joblib.dump(model, "diabetes_model.joblib")
loaded = joblib.load("diabetes_model.joblib")
new_patient = pd.DataFrame([{
    "Pregnancies": 2, "Glucose": 150, "BloodPressure": 70, "SkinThickness": 30,
    "Insulin": 120, "BMI": 33.5, "DiabetesPedigreeFunction": 0.5, "Age": 45}])
print(f"P(diabetes) = {loaded.predict_proba(new_patient)[0, 1]:.3f}")  # 0.582
```

`Pipeline` đúng nghĩa là "đường ống": dữ liệu đi qua impute, scale, model theo thứ tự, và lợi ích chính là **không thể quên** fit trên train rồi mới transform test. ROC AUC 0.813 nghĩa là model **xếp hạng** người bệnh cao hơn người khỏe khá tốt ([[bài:roc-auc]]); recall thấp một phần do ngưỡng 0.5 và dữ liệu mất cân bằng. Kết quả có thể lệch chút ít giữa các phiên bản scikit-learn.

**Bản đồ Step 2 và 3:** thống kê, [[bài:descriptive-statistics]]; thiếu và ngoại lai, [[bài:missing-values-outliers]]; thang đo số, [[bài:feature-scaling]]; categorical, [[bài:categorical-encoding]]; quan hệ giữa feature, [[bài:correlation-multicollinearity]]; class mất cân bằng, [[bài:imbalanced-data]]; trực quan hóa (Step 4), [[bài:data-visualization]]; công cụ xử lý chuỗi, [[bài:regular-expressions]].

## Những hiểu sai thường gặp

- **"Pipeline là một đường thẳng, làm xong bước nào là xong."** Thực tế lặp qua lại nhiều lần.
- **"Huấn luyện là phần quan trọng nhất."** Thường tiền xử lý và hiểu dữ liệu quyết định phần lớn chất lượng.
- **"Mỗi bước tự do."** Có thứ tự và có ràng buộc (chia trước khi `fit`; điền thiếu trước khi scale).
- **"Đã có điểm cao là xong."** Còn Step 7: dữ liệu thật có thể khác dữ liệu học; model cần được theo dõi.

:::card ML Pipeline
- **Bảy bước (slide 39):** data collection, statistics, preprocessing, visualization, model building, evaluation, deployment.
- **Nhìn dữ liệu trước khi huấn luyện** (Project: mức sàn 65.1%, số 0 vô lý).
- **Là chu trình lặp**; mỗi vòng có đo lường (Project Bước 7 quay lại xử lý số 0 rồi đo lại).
- **Mọi bước học từ dữ liệu (imputer, scaler, encoder, SMOTE) chỉ `fit` trên train**; gói bằng `Pipeline`: điền thiếu trước scale.
:::

## Câu hỏi tự kiểm tra

:::quiz
@tier A | Hiểu bài
Q: Kể tên 7 bước của ML pipeline theo đúng thứ tự trong [[slide:39]].
A: Data collection → Statistics → Data preprocessing → Data
visualization → Model building → Model evaluation → Model deployment.
EN: Name the 7 pipeline steps in [[slide:39]]'s order.
**A:** Data collection → Statistics → Data preprocessing → Data
> visualization → Model building → Model evaluation → Model deployment.

Q: Mỗi tình huống sau thuộc bước nào? (a) Phát hiện cột Insulin
có 374 giá trị bằng 0. (b) Thay các số 0 đó bằng median. (c) Tính F1 trên
tập test. (d) Gắn model vào phần mềm của phòng khám.
A: (a) Step 2 — Statistics; (b) Step 3 — Data preprocessing;
(c) Step 6 — Model evaluation; (d) Step 7 — Model deployment.
EN: Which step: (a) finding 374 zeros in Insulin; (b) replacing
them with the median; (c) computing F1 on the test set; (d) plugging the
model into clinic software?
**A:** (a) Statistics; (b) Data preprocessing; (c) Model evaluation;
> (d) Model deployment.

Q: Vì sao phải chia train/test **trước** khi tính median để điền
giá trị thiếu hoặc tính mean/std để chuẩn hóa?
A: Vì median, mean, std là những thứ "học" từ dữ liệu. Nếu tính
trên toàn bộ dataset thì thông tin của tập test đã lọt vào quá trình
huấn luyện (data leakage), làm điểm trên test đẹp hơn so với khi gặp dữ
liệu thật. Phải fit trên train, rồi chỉ transform test.
EN: Why split before computing the median or mean/std?
**A:** Those statistics are learned from data; computing them on the
> full dataset leaks test information into training (data leakage),
> inflating test scores. Fit on train, transform test.

Q: Một model trên test có TN = 82, FP = 18, FN = 27, TP = 27. Tính
Accuracy và Recall. So với model luôn đoán 0 thì sao?
A: Accuracy = 109 / 154 ≈ 0.708; Recall = 27 / 54 = 0.5. Model
luôn đoán 0 có Accuracy = 100 / 154 ≈ 0.649 nhưng Recall = 0. Model thật
chỉ hơn ~6 điểm Accuracy và vẫn bỏ sót một nửa người bệnh.
EN: TN = 82, FP = 18, FN = 27, TP = 27. Accuracy and Recall? Compare
with always predicting 0.
**A:** Accuracy ≈ 0.708, Recall = 0.5. Always-0 scores ≈ 0.649
> accuracy with Recall 0. The model is only ~6 points better and misses
> half the patients.

Q: Đã học xong các metric ở [[bài:confusion-matrix]] đến [[bài:regression-metrics]], vì sao vẫn còn cả module
05 "Model Evaluation" phía sau?
A: [[bài:confusion-matrix]] đến [[bài:regression-metrics]] dạy cách **đo** model. Module 05 dạy cách **chẩn
đoán và cải thiện**: vì sao model kém (bias/variance, underfitting/
overfitting) và cách sửa (regularization, chọn model, giảm chiều dữ
liệu, PCA).
EN: Why is there a whole "Model Evaluation" module after lessons
11–14?
**A:** Lessons 11–14 teach how to **measure**; module 05 teaches how to
> **diagnose and improve** (bias/variance, under/overfitting,
> regularization, model selection, dimensionality reduction, PCA).

Q: Triển khai xong model là dự án kết thúc, đúng hay sai?
A: Sai. Dữ liệu thực tế thay đổi theo thời gian (data drift),
nên phải theo dõi hiệu năng và huấn luyện lại khi cần; pipeline là một
vòng lặp, không phải đường thẳng.
EN: True or false: once deployed, the project is finished.
**A:** False — data drifts over time, so performance must be monitored
> and the model retrained; the pipeline is a loop.
@tier B | Phỏng vấn lý thuyết
Q: Pipeline nghiệp vụ khác sklearn Pipeline không?
A: Pipeline nghiệp vụ bao gồm cả thu thập, đánh giá và vận hành. sklearn Pipeline là công cụ ghép các phép transform và estimator để fit/predict nhất quán. Nó hỗ trợ quy trình nhưng không tự làm sạch split sai.
EN: The project lifecycle is broader than sklearn Pipeline, which chains transformations and an estimator.
Q: Vì sao quy trình không chỉ chạy một chiều?
A: Thống kê hoặc đánh giá có thể cho thấy thiếu dữ liệu, nhãn sai hay feature chưa phù hợp. Quay lại bước trước để sửa, nhưng giữ test độc lập khỏi vòng lựa chọn.
EN: The workflow is iterative; findings can send work back to data collection or preprocessing.
Q: Lưu model có đủ để triển khai không?
A: Cần lưu cả bước tiền xử lý đã học, thứ tự/kiểu feature và cách giải mã đầu ra, rồi kiểm tra input mới *(bổ sung)*. Chỉ lưu estimator dễ tạo khác biệt train–serving.
EN: Deployment needs the fitted preprocessing, feature schema, and output interpretation as well as the estimator.
Q: Theo dõi gì sau khi triển khai?
A: Theo dõi lỗi pipeline, phân bố input và metric khi có nhãn; so theo thời gian và nhóm. Input thay đổi là tín hiệu điều tra, không tự chứng minh chất lượng giảm hoặc cần retrain ngay *(bổ sung)*.
EN: Monitor operational failures, input distributions, and labeled performance; drift is a diagnostic signal, not proof of degradation.
@tier C | Tình huống doanh nghiệp
Q: Dự án đổi nhiều thuật toán mà chưa cải thiện. Bắt đầu lại đâu?
A: Kiểm tra mục tiêu, định nghĩa target, cách split và chất lượng dữ liệu trước; xác lập baseline rồi phân tích mẫu sai. Chỉ tăng thuật toán khi đã có bằng chứng hạn chế ở model. Đổi model nhanh có thể che lỗi dữ liệu và tăng chi phí *(bổ sung)*.
WANT: Nhìn toàn quy trình thay vì chỉ model building.
Q: Offline tốt, API trả kết quả khác. Debug sao?
A: Lấy một input cố định chạy cả offline và API, so schema, missing handling, scaling, encoding và phiên bản artifact từng bước. Triển khai pipeline đã fit cùng estimator, thêm kiểm tra tương đương. Đánh đổi độ linh hoạt với tính nhất quán *(bổ sung)*.
WANT: Có cách truy vết train–serving skew tới từng bước.
Q: Dữ liệu mới đổi phân bố, có retrain tự động ngay?
A: Kiểm tra lỗi thu thập/schema trước, xem metric trên nhãn mới nếu có, so các nhóm và xác định tác động. Retrain thử và đánh giá trước khi thay model; đổi phân bố không luôn là giảm chất lượng. Tự động nhanh hơn nhưng cần tiêu chí phát hành rõ *(bổ sung)*.
WANT: Phân biệt drift, lỗi vận hành và bằng chứng cần thay model.
:::

## Nối sang bài sau

:::next
Bản đồ đã rõ; bước tiếp theo là khám dữ liệu trước khi sửa. [[bài:descriptive-statistics]] đọc bảng Diabetes bằng dtype, describe và phân bố class.
:::

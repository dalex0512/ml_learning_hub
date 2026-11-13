---
title: "Thực hành 1 — Diabetes: đánh giá, so sánh mô hình và cải thiện"
order: 2
description: "Đọc confusion matrix thật, kiểm giả thuyết mô hình, điền số 0 thiếu và chọn Pipeline bằng cross-validation."
needs: [diabetes-first-model, confusion-matrix, classification-metrics, k-fold-cross-validation, missing-values-outliers]
tags: [diabetes, practice, pipeline, confusion-matrix, cross-validation, data-leakage, imputation, model-selection]
---

## Bước 6 — Đọc model sai theo cách nào

:::intro
Đi tiếp từ [[bài:diabetes-first-model]], mỗi lần chỉ thêm một bước. Các bảng thử model/ngưỡng là thí nghiệm học cách đọc kết quả, không dùng chúng làm chứng cứ chọn model bằng test. Bài không có slide gốc.
:::

**Bản đồ:** 6 Đọc lỗi → 7 Thử model → 8 Xử lý missing → 9 Pipeline và CV.

**Mục tiêu:** giải thích được từng ô confusion matrix và từng dòng report.

**Lý thuyết cần biết:** như chấm bài phải xem sai câu nào, accuracy không cho biết model bỏ sót ai. Ở đây class dương là **Outcome=1**. Sklearn xếp **hàng nhãn thật, cột dự đoán**, thứ tự0 rồi1. Nối [[bài:confusion-matrix]], [[bài:classification-metrics]].

Mở **Console mới**, chạy phần chuẩn bị gấp dưới đây rồi các bước6–9 theo thứ tự. Đây là các dòng quen thuộc của bài1, thêm import để dùng tiếp; ở bài2 giữ `x_train/x_test` là bảng thô, `z_train/z_test` là mảng đã scale. Bộ code cuối bài ghép sẵn phần này nên cũng chạy độc lập.

<details>
<summary>Mở phần chuẩn bị bài 2 — chạy một lần từ gốc repo</summary>

```python
import pandas as pd
import numpy as np
from sklearn.base import clone
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
```

```python
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,
                             confusion_matrix, classification_report)
```

```python
data = pd.read_csv("dataset/diabetes.csv")
x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]
x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(x_train)
z_train, z_test = scaler.transform(x_train), scaler.transform(x_test)
model = LogisticRegression().fit(z_train, y_train)
y_predict = model.predict(z_test)
```

```python
def evaluate(model, x, y):
    pred = model.predict(x)
    return {"accuracy": accuracy_score(y, pred),
            "precision": precision_score(y, pred, zero_division=0),
            "recall": recall_score(y, pred, zero_division=0),
            "f1": f1_score(y, pred, zero_division=0)}
```

</details>

```python
from sklearn.metrics import classification_report, confusion_matrix  # bổ sung import bị thiếu
print(confusion_matrix(y_test, y_predict, labels=[0, 1]))  # thứ tự nhãn tường minh
print(classification_report(y_test, y_predict, digits=6, zero_division=0))  # report đầy đủ
print("Baseline:", accuracy_score(y_test, np.zeros(len(y_test), dtype=int)))  # đoán toàn0
```

**Bạn phải thấy:** matrix **[[79,20],[18,37]]**, baseline accuracy **99/154=0.642857**, recall class1 bằng0. Code gốc thiếu hai import trên nên gọi lần đầu sẽ có `NameError: name 'classification_report' is not defined`; sau sửa import report mới chạy tới matrix. Biến `X_test` khác `x_test` cũng là bài học đọc lỗi tên.

![Confusion matrix baseline Logistic với tên bốn loại kết quả](/plots/diabetes-confusion.png)

[Mở hình gốc](/plots/diabetes-confusion.png). Đọc FN=18 người mang nhãn1 bị đoán0 trước khi chỉ nhìn116 dự đoán đúng.

:::worked Tính tay bằng ma trận thật
TN=79, FP=20, FN=18, TP=37; tổng154. Accuracy=(79+37)/154=**0.753247**. Precision class1=37/(37+20)=**0.649123**; recall=37/(37+18)=**0.672727**; F1=2×37/(2×37+20+18)=**0.660714**. Precision hỏi trong người bị báo1 có bao nhiêu đúng; recall hỏi trong55 người nhãn1 bắt được bao nhiêu. Đây là metric theo nhãn dataset, không là xác nhận chẩn đoán thực tế.
:::

Report thực tế (`digits=6`):

```text
              precision    recall  f1-score   support
           0   0.814433  0.797980  0.806122        99
           1   0.649123  0.672727  0.660714        55
    accuracy                       0.753247       154
   macro avg   0.731778  0.735354  0.733418       154
weighted avg   0.755394  0.753247  0.754191       154
```

**support** là số mẫu thật mỗi class, không phải số dự đoán. Dòng0 cũng tính precision/recall/F1 nhưng xem0 là class đang xét: precision0=79/(79+18). **macro avg** trung bình đều hai class, ví dụ F1=(.806122…+.660714…)/2=.733418. **weighted avg** dùng trọng số support99/55, F1=(99×F1_0+55×F1_1)/154=.754191; không phải lấy precision/recall trung bình rồi mới tính F1. Xem [[bài:imbalanced-data]] để hiểu vì sao baseline đông class có thể khá cao.

**Tự làm:** ★ gọi tên bốn ô. ★★ tự tính precision/recall rồi so thư viện. ★★★ đổi ngưỡng0.3, mô tả đổi FN/FP và có đáng đổi không.

<details>
<summary>Đáp án bước 6 — ngưỡng không tự là chính sách tốt</summary>

```python
from sklearn.metrics import precision_score, recall_score
print("Precision/recall tay:", 37/57, 37/55)
probabilities = model.predict_proba(z_test)[:, 1]  # cùng chuẩn train của bài2
for threshold in [0.3, 0.5, 0.7]:
    pred = (probabilities >= threshold).astype(int)
    print(threshold, precision_score(y_test, pred), recall_score(y_test, pred))
```

Luôn dùng **z_test** cho baseline đã scale, vì x_test ở bài2 là bảng thô.

| Ngưỡng | Precision class1 | Recall class1 |
|---|---|---|
| .3 | .545455 | .763636 |
| .5 | .649123 | .672727 |
| .7 | .818182 | .490909 |

Ở.3 bắt42/55 thay vì37/55, nhưng FP tăng20→35 (FN18→13). Sàng lọc có thể ưu tiên recall vì bỏ sót đắt, nhưng còn chi phí kiểm tra lại, năng lực xử lý và đối tượng sử dụng; không có luật “y tế luôn chọn.3”. Chọn ngưỡng trên validation, chưa dùng test làm nơi tìm ngưỡng đẹp. [[bài:roc-auc]] mở rộng cách nhìn nhiều ngưỡng.

</details>

![Precision và recall class1 theo ngưỡng dự đoán](/plots/diabetes-thresholds.png)

[Mở hình gốc](/plots/diabetes-thresholds.png). Các điểm.3/.5/.7 được đánh dấu. Recall không tăng khi nâng ngưỡng trên cùng score; precision có thể dao động, không bắt buộc tăng đều.

> **EN:** Read the confusion matrix using true labels as rows and predicted labels as columns. Report support counts actual class members; macro averages weight classes equally, while weighted averages use support. Threshold trade-offs require validation and context-specific costs, not a universal clinical rule.

## Bước 7 — Tương quan là gợi ý, không chọn hộ model

**Mục tiêu:** thử cả mô hình tuyến tính và phi tuyến với cùng split.

**Lý thuyết cần biết:** nhìn mặt nước phẳng không chứng minh bên dưới không có dòng chảy. **Pearson** chỉ đo liên hệ tuyến tính từng cặp, thấp không chứng minh bắt buộc dùng phi tuyến hay feature không ảnh hưởng target. [[bài:correlation-multicollinearity]] giải thích kỹ. Tính trên CSV thô, xếp giảm dần với Outcome: **Glucose .466581, BMI .292695, Age .238356, Pregnancies .221898, DPF .173844, Insulin .130548, SkinThickness .074752, BloodPressure .065068**. DPF viết tắt DiabetesPedigreeFunction.

Spearman (tương quan thứ hạng) cho Glucose **.475776**, BMI **.309707**, Age **.309040**. Các số được nhắc trong prompt/ảnh ghi chú **.487/.317/.314** không khớp cả hai cách ở CSV này. Chưa có ảnh gốc kèm lượt gửi này để đối chiếu toàn bảng; không kết luận ảnh dùng Spearman. Khác bản dữ liệu/làm sạch/cách tính là điều cần xác nhận. Các số trên chỉ là khảo sát, chưa dùng để chọn/bỏ feature.

Tiếp tục Console đã chuẩn bị ở bước6; hàm `evaluate` trong phần chuẩn bị nhận model **đã fit**, x dùng để chấm, y thật, trả dict metric. Nó không fit lại trên tập đang chấm. Năm thuật toán đã có bài: [[bài:logistic-regression]], [[bài:k-nearest-neighbours]], [[bài:svm]], [[bài:decision-tree]], [[bài:random-forest]].

```python
models = {"Logistic": LogisticRegression(max_iter=1000),  # tăng lượt tối ưu
          "KNN": KNeighborsClassifier(), "SVM": SVC(random_state=200),  # model xác định/seed
          "Tree": DecisionTreeClassifier(random_state=200),  # seed model riêng
          "Forest": RandomForestClassifier(random_state=200, n_jobs=1)}  # cố định rừng
for name, candidate in models.items():  # cùng bảng train/test đã scale
    fitted = clone(candidate).fit(z_train, y_train)  # bản sao, không ghi đè baseline
    print(name, evaluate(fitted, z_test, y_test))  # cùng metric
```

**Bạn phải thấy** (sklearn1.9.1; split42, cây/rừng200; chưa xử lý0):

| Model | Accuracy | Recall | F1 |
|---|---|---|---|
| Logistic | .753247 | .672727 | .660714 |
| KNN | .694805 | .509091 | .543689 |
| SVM | .733766 | .563636 | .601942 |
| Tree | .753247 | .709091 | .672414 |
| Forest | .740260 | .654545 | .642857 |

Logistic hơn Forest về ba metric này trên split này, còn Tree có F1 cao hơn Logistic. Không suy “phi tuyến luôn tốt hơn” hay “Logistic luôn thắng”. Đây là **bảng thử để học, chưa chọn người thắng bằng test**. Lặp nhiều lần nhìn test để đổi model gây thiên lệch lựa chọn; bước9 dùng CV trên development. Fit scaler trên train đúng vẫn chưa làm việc chọn model theo test thành đúng.

**Tự làm:** ★ chạy vòng5 model. ★★ so raw/scale trên cùng split. ★★★ đổi seed split7/42/123 và xem thứ hạng, giữ seed model200.

<details>
<summary>Đáp án bước 7 — kiểm quy tắc bằng thực nghiệm</summary>

```python
for name, candidate in models.items():
    raw = clone(candidate).fit(x_train, y_train).predict(x_test)
    scaled = clone(candidate).fit(z_train, y_train).predict(z_test)
    print(name, "changed:", (raw != scaled).sum())
for seed in [7, 42, 123]:
    a, b, c, d = train_test_split(x, y, test_size=0.2, random_state=seed)
    s = StandardScaler().fit(a)
    print(seed, {name: evaluate(clone(m).fit(s.transform(a), c), s.transform(b), d)["f1"]
                 for name, m in models.items()})
```

Raw vs scale đổi **1/35/17/0/0** nhãn test theo thứ tự Logistic/KNN/SVM/Tree/Forest. Scale có thể làm score tăng hoặc giảm với cấu hình mặc định; quan trọng là đổi hình học và penalty, không bảo đảm tăng điểm. Tree/Forest ở đây cho cùng nhãn vì split so ngưỡng từng cột, khác KNN/SVM; sai số số học có thể tạo khác biệt ở dữ liệu khác. [[bài:feature-scaling]] giải thích giới hạn.

Seed7: F1 tốt nhất trong nhóm là SVM **.686869**; seed42 là Tree **.672414**; seed123 là Forest **.707965**. Một split chưa đủ để tin thứ hạng. Không chọn seed cho đẹp rồi báo đó là test độc lập.

</details>

> **EN:** Pairwise correlation suggests hypotheses, not a required model family. The reported image values match neither raw Pearson nor Spearman on this CSV. Compare candidates on development folds; test-set rankings and sensitivity to scaling or split seeds are demonstrations, not selection evidence.

## Bước 8 — Số 0 thiếu: học median trên train

**Mục tiêu:** thay sentinel hợp lý rồi điền missing mà không nhìn test.

**Lý thuyết cần biết:** ô “chưa đo” không phải phép đo bằng0. Chỉ đổi0 trong năm cột đã xác định; giữ Pregnancies/Outcome. [[bài:missing-values-outliers]]: **imputer** học giá trị điền; cũng phải fit train, transform test. Median ít bị cực trị kéo hơn mean. Trên train sau bỏ0, Insulin còn324 phép đo: mean **154.330247**, median **120**, max **846**; đó là lý do thử median, không bảo đảm điểm tăng.

```python
zero_missing = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]  # sentinel
x_clean = x.copy()  # không sửa bảng gốc
x_clean[zero_missing] = x_clean[zero_missing].replace(0, np.nan)  # chỉ cột được chọn
clean_train, clean_test = x_clean.loc[x_train.index], x_clean.loc[x_test.index]  # cùng split
imputer = SimpleImputer(strategy="median").fit(clean_train)  # học median train
filled_train, filled_test = imputer.transform(clean_train), imputer.transform(clean_test)  # dùng lại
clean_scaler = StandardScaler().fit(filled_train)  # học thang sau khi điền train
clean_model = LogisticRegression(max_iter=1000).fit(  # fit model mới
    clean_scaler.transform(filled_train), y_train)  # input train hoàn chỉnh
print("After imputation:", evaluate(clean_model, clean_scaler.transform(filled_test), y_test))  # chấm
```

**Bạn phải thấy:** median năm cột theo thứ tự trên **[118,72,28.5,120,32]**. Accuracy **.753247**, recall **.618182**, F1 **.641509**, so baseline **.753247/.672727/.660714**: accuracy bằng nhưng recall/F1 **giảm**. Không viết “điền median chắc chắn cải thiện”. Quyết định cách xử lý dựa vào hiểu dữ liệu và validation, không làm sạch test để đổi kết quả đẹp.

![Số 0 trong tám feature, chỉ năm cột được coi là missing](/plots/diabetes-zeros.png)

[Mở hình gốc](/plots/diabetes-zeros.png). Insulin thiếu nhiều nhất; Pregnancies=0 được đánh dấu hợp lệ. Có thể tìm hiểu `add_indicator=True` để báo cho model ô nào từng thiếu; chưa thêm vào baseline này.

**Tự làm:** ★ in NaN trước/sau thay0, giữ Pregnancies. ★★ so mean/median Insulin train và xem `statistics_`. ★★★ viết cách sai fit imputer toàn bộ x_clean rồi giải thích rò rỉ, không dùng cách ấy để chọn model.

<details>
<summary>Đáp án bước 8 — thống kê không được học trên test</summary>

```python
print(data.isna().sum())
print(x_clean.isna().sum())
print(clean_train["Insulin"].mean(), clean_train["Insulin"].median())
print(dict(zip(x.columns, imputer.statistics_)))
wrong_imputer = SimpleImputer(strategy="median").fit(x_clean)  # SAI: có cả test
print(wrong_imputer.statistics_)
```

NaN thô đều0; sau đổi0, số NaN năm cột là5/35/227/374/11, Pregnancies vẫn0 NaN. Median train được học trên các ô quan sát của train. Cách sai để test góp vào thống kê điền; median có thể trùng cách đúng ở một số cột, vẫn không đúng quy trình. Giữ nguyên số dòng và nhãn, không bỏ mọi hàng thiếu.

</details>

> **EN:** Replace only justified sentinel zeros, then fit imputation on training observations. Median imputation is a defensible baseline, not a promise of higher predictive performance; in this split recall and F1 decrease. Missing indicators are an optional later experiment.

## Bước 9 — Pipeline và CV: chọn trước, chấm sau

**Mục tiêu:** cho mọi fold tự học lại imputer, scaler và model.

**Lý thuyết cần biết:** như bó ba việc thành một đơn hàng, **Pipeline** gói imputer→scaler→model. Khi CV gọi fit từng fold, chỉ phần train của fold học thống kê. `replace(0,NaN)` là quy tắc cố định không học thống kê, nên làm trước CV được; median/scale phải bên trong. Nối [[bài:k-fold-cross-validation]], [[bài:stratified-k-fold]], [[bài:ml-pipeline]].

```python
def make_workflow(candidate):  # một pipeline mới cho mỗi ứng viên
    return Pipeline([("imputer", SimpleImputer(strategy="median")),  # median trong fold
                     ("scaler", StandardScaler()), ("model", clone(candidate))])  # scale rồi model
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)  # cùng fold cho các model
cv_rows = {}  # lưu kết quả development
for name in ["Logistic", "KNN", "SVM", "Forest"]:  # chỉ 4 baseline
    scores = cross_validate(make_workflow(models[name]), clean_train, y_train,  # chỉ614 train
        cv=cv, scoring=["accuracy", "recall", "f1"], n_jobs=1)  # nhiều metric cùng fold
    cv_rows[name] = {metric: (scores["test_"+metric].mean(),  # test_ ở đây là validation fold
                             scores["test_"+metric].std(ddof=0))  # std mô tả5 điểm
                     for metric in ["accuracy", "recall", "f1"]}  # một dict/model
print("Development CV:", cv_rows)  # không mở test để chọn
```

**Bạn phải thấy:** mean±std trên614 development (chưa dùng154 held-out trong CV):

| Model | CV F1 | CV Recall |
|---|---|---|
| Logistic | .602202 ± .071747 | .540089 ± .111092 |
| KNN | .622593 ± .041217 | .605648 ± .078152 |
| SVM | .593329 ± .059601 | .526135 ± .065986 |
| Forest | **.641642 ± .044954** | .601550 ± .057183 |

![Mean và std CV F1, recall của bốn pipeline](/plots/diabetes-cv.png)

[Mở hình gốc](/plots/diabetes-cv.png). Std cho biết dao động giữa các fold trong lần chia này, không là confidence interval và không chứng minh hai model khác nhau có ý nghĩa. KNN có F1 std nhỏ hơn Forest, nhưng mean thấp hơn; “ổn định” không thay metric mục tiêu.

Demo **chốt F1 làm tiêu chí trước CV**, chọn Forest mean cao nhất trong4 ứng viên, fit lại toàn614 development rồi gọi test: accuracy **.759740**, precision **.650000**, recall **.709091**, F1 **.678261**. Nếu mục tiêu khác là recall ở cùng ngưỡng mặc định, mean recall KNN **.605648** nhỉnh hơn Forest **.601550**; chênh nhỏ và std khá lớn, không đủ khẳng định thắng thật. Bài sàng lọc thật cần xác định chi phí FN/FP, ràng buộc precision và chọn ngưỡng bằng validation trước khi khóa quy trình.

:::pitfall Test trong bài này đã được xem để học
Bước6–8 và bài tập seed đã xem đi xem lại154 hàng held-out. Bước9 minh họa đúng **cơ chế chọn bằng CV**, nhưng không khiến tập test ấy mới trở lại. Không công bố điểm demo như ước lượng cuối hoàn toàn độc lập; dự án thật cần test chưa đụng từ đầu, hoặc thêm dữ liệu độc lập mới. Cũng không CV trên cả768 rồi chấm lại154 dòng từng vào CV.
:::

**Tự làm:** ★ fit pipeline Logistic, so prediction với làm tay. ★★ dùng `cross_val_score` F1 cho Logistic/Forest. ★★★ viết `evaluate` trả dict, chạy4 pipeline và giải thích nếu chọn theo recall thay cho F1.

<details>
<summary>Đáp án bước 9 — gom code mà không fit trên bộ chấm</summary>

```python
from sklearn.model_selection import cross_val_score
for name in ["Logistic", "Forest"]:
    scores = cross_val_score(make_workflow(models[name]), clean_train, y_train,
                             cv=cv, scoring="f1")
    print(name, scores.mean(), scores.std(ddof=0))
manual_pipe = make_workflow(models["Logistic"]).fit(clean_train, y_train)
assert np.array_equal(manual_pipe.predict(clean_test),
                      clean_model.predict(clean_scaler.transform(filled_test)))
```

```python
def evaluate(model, x, y):
    pred = model.predict(x)
    return {"accuracy": accuracy_score(y, pred),
            "precision": precision_score(y, pred, zero_division=0),
            "recall": recall_score(y, pred, zero_division=0),
            "f1": f1_score(y, pred, zero_division=0)}
```

Hàm evaluate chỉ chấm model đã fit; dùng trong vòng5 model hoặc với `final_model`. Chọn theo recall phải đọc **CV**, không đọc dict test để quyết định: trong4 ứng viên KNN có mean recall cao nhất nhưng không bảo đảm đáp ứng sàng lọc. `cross_val_score` một metric cho cùng số F1 như `cross_validate` nhiều metric vì cùng pipeline/fold. Pipeline Logistic khớp toàn bộ154 prediction làm tay vì cùng split, median, scale và model.

</details>

> **EN:** Cross-validation must refit learned preprocessing within each training fold. Choose a prespecified metric on development data, refit the selected workflow, then evaluate on untouched test data. This tutorial has already inspected its held-out examples; the final demonstration must not be described as a fresh independent evaluation. See [scikit-learn's leakage guidance](https://scikit-learn.org/stable/common_pitfalls.html).

### Bộ code hoàn chỉnh để gõ lại

Chạy trong Console mới từ gốc repo. Bản sạch tự dựng lại baseline, rồi thực hiện6–9; bài tập thử sai không nằm trong luồng chính. Giữ x_train/x_test thô, z_train/z_test đã scale để không lẫn thang.

<details>
<summary>Mở bộ code hoàn chỉnh — bài 2</summary>

```python
import pandas as pd
import numpy as np
from sklearn.base import clone
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_validate
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score, f1_score,
                             confusion_matrix, classification_report)

data = pd.read_csv("dataset/diabetes.csv")
x = data.drop(labels="Outcome", axis=1)
y = data["Outcome"]
x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(x_train)
z_train, z_test = scaler.transform(x_train), scaler.transform(x_test)
model = LogisticRegression().fit(z_train, y_train)
y_predict = model.predict(z_test)

def evaluate(model, x, y):
    pred = model.predict(x)
    return {"accuracy": accuracy_score(y, pred),
            "precision": precision_score(y, pred, zero_division=0),
            "recall": recall_score(y, pred, zero_division=0),
            "f1": f1_score(y, pred, zero_division=0)}

print(confusion_matrix(y_test, y_predict, labels=[0, 1]))
print(classification_report(y_test, y_predict, digits=6, zero_division=0))
print("Baseline:", accuracy_score(y_test, np.zeros(len(y_test), dtype=int)))
probabilities = model.predict_proba(z_test)[:, 1]
for threshold in [0.3, 0.5, 0.7]:
    pred = (probabilities >= threshold).astype(int)
    print(threshold, precision_score(y_test, pred, zero_division=0),
          recall_score(y_test, pred, zero_division=0))

models = {"Logistic": LogisticRegression(max_iter=1000),
          "KNN": KNeighborsClassifier(), "SVM": SVC(random_state=200),
          "Tree": DecisionTreeClassifier(random_state=200),
          "Forest": RandomForestClassifier(random_state=200, n_jobs=1)}
for name, candidate in models.items():
    fitted = clone(candidate).fit(z_train, y_train)
    print(name, evaluate(fitted, z_test, y_test))

zero_missing = ["Glucose", "BloodPressure", "SkinThickness", "Insulin", "BMI"]
x_clean = x.copy()
x_clean[zero_missing] = x_clean[zero_missing].replace(0, np.nan)
clean_train, clean_test = x_clean.loc[x_train.index], x_clean.loc[x_test.index]
imputer = SimpleImputer(strategy="median").fit(clean_train)
filled_train, filled_test = imputer.transform(clean_train), imputer.transform(clean_test)
clean_scaler = StandardScaler().fit(filled_train)
clean_model = LogisticRegression(max_iter=1000).fit(
    clean_scaler.transform(filled_train), y_train)
print("After imputation:", evaluate(clean_model, clean_scaler.transform(filled_test), y_test))

def make_workflow(candidate):
    return Pipeline([("imputer", SimpleImputer(strategy="median")),
                     ("scaler", StandardScaler()), ("model", clone(candidate))])
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_rows = {}
for name in ["Logistic", "KNN", "SVM", "Forest"]:
    scores = cross_validate(make_workflow(models[name]), clean_train, y_train,
        cv=cv, scoring=["accuracy", "recall", "f1"], n_jobs=1)
    cv_rows[name] = {metric: (scores["test_"+metric].mean(),
                             scores["test_"+metric].std(ddof=0))
                     for metric in ["accuracy", "recall", "f1"]}
print("Development CV:", cv_rows)

best_name = max(cv_rows, key=lambda name: cv_rows[name]["f1"][0])
final_model = make_workflow(models[best_name]).fit(clean_train, y_train)
print("Selected by CV F1:", best_name)
print("Held-out demonstration:", evaluate(final_model, clean_test, y_test))
manual_pipe = make_workflow(models["Logistic"]).fit(clean_train, y_train)
assert np.array_equal(manual_pipe.predict(clean_test),
                      clean_model.predict(clean_scaler.transform(filled_test)))
```

</details>

:::recap
- Đọc matrix theo hàng thật/cột đoán, class dương1.
- Precision, recall, F1 và baseline trả lời những câu hỏi khác nhau.
- Correlation chỉ gợi ý; thử tuyến tính và phi tuyến bằng validation.
- Median/scale chỉ fit train; imputation không luôn tăng score.
- Pipeline giữ fit trong fold; chọn metric/model bằng CV, test để cuối.
:::

### Checklist tự kiểm

- [ ] Tôi gọi tên được79/20/18/37 và tính precision/recall.
- [ ] Tôi giải thích được support, macro và weighted avg.
- [ ] Tôi biết vì sao không chọn phi tuyến chỉ từ correlation thấp.
- [ ] Tôi giữ Pregnancies0, chỉ đổi sentinel đúng cột.
- [ ] Tôi viết lại được pipeline và evaluate không nhìn.
- [ ] Tôi chỉ chọn trên CV và nhận ra test của tutorial đã bị xem.

### Câu hỏi ôn và phỏng vấn

:::quiz
@tier A | Hiểu bài
Q: Matrix[[79,20],[18,37]] có precision/recall class1 bao nhiêu?
A: **37/57=.649123 và37/55=.672727.** FP20 nằm trong57 lần báo1, FN18 nằm trong55 nhãn thật1. Đổi hàng/cột sẽ dẫn tới nhầm hai mẫu số.
Q: Đoán toàn0 đúng bao nhiêu? Có tìm được ca1 nào không?
A: **99/154=.642857, recall1=0.** Accuracy khá cao vì test có99 nhãn0. Model chưa phát hiện ca1 nào nên metric đó không đủ cho sàng lọc.
Q: Điền median có cải thiện mọi metric trong demo không?
A: **Không.** Accuracy giữ.753247 nhưng recall giảm.672727→.618182 và F1 giảm.660714→.641509. Xử lý missing có lý do dữ liệu nhưng cần validation để đánh giá lợi ích model.
Q: Bảng CV chọn model nào theo F1, theo recall?
A: **F1 chọn Forest; recall cao nhất là KNN trong4 ứng viên.** MeanF1=.641642 của Forest, mean recall=.605648 của KNN. Chênh nhỏ/std khá lớn nên không tuyên bố thắng phổ quát hay đổi metric sau khi nhìn test.
@tier B | Phỏng vấn lý thuyết
Q: **B1.** How do you choose between a linear and a non-linear model?
A: **Dùng hiểu biết dữ liệu để lập giả thuyết rồi so bằng CV cùng mục tiêu.** Pearson thấp không loại quan hệ phi tuyến/tương tác và không chứng minh phải dùng chúng. Ví dụ baseline Logistic hơn Forest ở test demo nhưng CV pipeline sau xử lý chọn Forest theo F1.
EN: Use domain knowledge and exploratory analysis to propose candidates, then compare properly preprocessed workflows on development folds with a prespecified metric. Low pairwise correlation does not determine the model family.
Q: **B2.** Why is accuracy misleading on imbalanced data?
A: **Nó có thể cao chỉ vì đoán class đông.** Test có99/154 nhãn0 nên đoán toàn0 đạt.642857 dù recall1=0. Cần baseline, matrix và metric theo chi phí FP/FN, không loại bỏ accuracy hoàn toàn.
EN: A majority-class predictor can have substantial accuracy while missing every minority-class case. Read accuracy alongside a baseline, per-class metrics and error costs.
Q: **B3.** What is data leakage and how do you avoid it?
A: **Thông tin ngoài train lọt vào quá trình học/chọn.** Chia trước, fit median/scale trong fold, không chọn model hay ngưỡng trên test. Ví dụ fit imputer cả768 khiến154 dòng test góp thống kê; điểm không đổi vẫn là leakage.
EN: Split before fitting learned preprocessing, refit it within validation folds, and keep test data out of model and threshold selection. Unchanged scores do not legitimize leakage.
Q: **B4.** What does a Pipeline give you?
A: **Gói preprocessing và estimator thành quy trình fit/predict nhất quán.** CV fit lại toàn chuỗi trong train mỗi fold, giảm nguy cơ quên fit imputer/scaler đúng chỗ. Ví dụ pipeline Logistic cho cùng prediction làm tay khi mọi cấu hình giống nhau; nó không tự chữa feature rò rỉ tương lai.
EN: A Pipeline composes transformations and an estimator into one workflow so cross-validation refits the complete sequence within each training fold. It does not automatically fix invalid features or split design.
Q: **B5.** Why use cross-validation instead of a single split?
A: **Để xem chất lượng thay đổi trên nhiều phần development thay vì tin một đề thi.** Dùng cùng fold cho các ứng viên, đọc mean và độ dao động, chấp nhận chi phí fit nhiều lần. Ví dụ seed7/42/123 đổi người có F1 test cao nhất; std fold vẫn không là kiểm định chắc chắn.
EN: Cross-validation compares candidates across multiple development partitions and exposes variability at additional fitting cost. Fold standard deviation is descriptive, not proof of statistical superiority or a replacement for final testing.
@tier C | Tình huống doanh nghiệp
Q: **C1.** Thiết kế sàng lọc cần ít bỏ sót. Có chọn ngưỡng.3 vì recall tăng không?
A: **Chỉ coi đó là ứng viên để validation theo chi phí.** Xác định khả năng kiểm tra lại và FP chấp nhận được, chọn ngưỡng trên development, rồi khóa trước test. Ví dụ.3 bắt thêm5 ca1 nhưng tăng15 FP so.5; không tự là chính sách tốt cho mọi cơ sở.
WANT: Liên hệ recall với FN/FP và tài nguyên, không biến số demo thành khuyến nghị y tế.
Q: **C2.** CSV không có NaN nhưng nhiều Insulin0. Bạn xử lý sao?
A: **Kiểm ý nghĩa sentinel rồi thay đúng cột, giữ số0 hợp lệ.** Đổi0 thành NaN trong năm phép đo đã xác định, học median trên train/fold và đo lại. Ví dụ Insulin374 số0 đáng ngờ nhưng Pregnancies111 số0 hợp lệ; không thay0 toàn bảng hay hứa score tăng.
WANT: Dùng ngữ nghĩa dữ liệu, chống leakage và báo trung thực hiệu quả imputation.
Q: **C3.** Train tốt, test tệ; nhóm đã thử nhiều model trên test. Báo kết quả nào?
A: **Ghi rõ giới hạn và khôi phục quy trình chọn trên development.** Kiểm leakage, drift, split/nhóm và độ phức tạp, so baseline bằng CV; cần test độc lập mới nếu có thể. Ví dụ xem154 ca nhiều lần rồi làm CV không biến154 ca đó trở lại test chưa xem; không báo điểm đẹp nhất như kết quả khách quan cuối.
WANT: Chẩn đoán quy trình trước thuật toán, phân biệt overfit với thiên lệch lựa chọn và giới hạn đánh giá.
:::

:::next
Hướng luyện tiếp theo trong Projects: thử pipeline trên một bảng mới, tự xác định label, split và metric trước khi chạy; hoặc học lựa chọn ngưỡng từ dự đoán out-of-fold. Chưa có bài tiếp nên chưa tạo link. Có thể quay [[bài:diabetes-first-model]] và gõ lại toàn bộ hai bài từ trí nhớ.
:::

from sklearn.metrics import confusion_matrix
y_true = [1, 1, 0, 1, 0, 1, 1]   # dog = 1, cat = 0 (hàng label của slide 27)
y_pred = [1, 0, 1, 1, 0, 0, 1]   # hàng prediction
cm = confusion_matrix(y_true, y_pred); print(cm.tolist(), cm.ravel().tolist())
print("dương = cat:", confusion_matrix([1-v for v in y_true], [1-v for v in y_pred]).ravel().tolist())
print("diabetes cm (Project):", [[79,20],[18,37]])

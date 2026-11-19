tp, fp, fn, tn = 3, 1, 2, 1      # dog/cat của slide 33-36
p = tp/(tp+fp); r = tp/(tp+fn); f1 = 2*p*r/(p+r)
print("acc", (tp+tn)/7, "prec", p, "rec", r, "f1", f1, "arith", (p+r)/2)
p2, r2 = 1.0, 0.1; print("extreme", (p2+r2)/2, 2*p2*r2/(p2+r2))
# Diabetes (Project): [[79,20],[18,37]]
tn, fp, fn, tp = 79, 20, 18, 37
print("diab acc", (tp+tn)/154, "prec", tp/(tp+fp), "rec", tp/(tp+fn), "f1", 2*tp/(2*tp+fp+fn), "baseline", 99/154)
for t, (fp_, fn_, tp_) in {0.3: (35, 13, 42), 0.7: (6, 28, 27)}.items():
    print(t, "prec", round(tp_/(tp_+fp_), 3), "rec", round(tp_/(tp_+fn_), 3))

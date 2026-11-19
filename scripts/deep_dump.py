import sys,re,glob
f=glob.glob(f"content/{sys.argv[1]}*/{sys.argv[2]}-*.md")[0]
s=open(f,encoding="utf-8").read()
i=s.find("## [sâu]")
print(f); print("CORE HEADINGS:",[h for h in re.findall(r"^## .*",s[:i],re.M)])
for sec in re.split(r"(?m)^(?=## \[sâu\])",s[i:]):
    if sec.strip(): print("\n=====",len(sec.split()),"words\n"+sec)

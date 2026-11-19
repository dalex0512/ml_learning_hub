import sys,glob
for a in sys.argv[1:]:
    mod,n=a.split(":")
    f=glob.glob(f"content/{mod}*/{n}-*.md")[0]
    s=open(f,encoding="utf-8").read(); i=s.find("## [sâu]")
    if i>0: open(f,"w",encoding="utf-8").write(s[:i].rstrip()+"\n"); print("dropped lane:",f)

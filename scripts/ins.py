import glob
def ins(mod,n,block,before="## Những hiểu sai thường gặp"):
    p=glob.glob(f"content/{mod}*/{n}-*.md")[0]
    s=open(p,encoding="utf-8").read(); assert before in s,(p,before)
    assert block.split("\n")[0] not in s
    s=s.replace(before,block+"\n"+before,1); open(p,"w",encoding="utf-8").write(s); print("inserted",p)

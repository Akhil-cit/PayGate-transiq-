import docx
import sys
import xml.etree.ElementTree as ET

sys.stdout.reconfigure(encoding='utf-8')

ref_path = r'C:\Users\dell\Downloads\ref.docx'
doc = docx.Document(ref_path)

print("=== CHECKING ALL STYLES IN REF.DOCX ===")
for s in doc.styles:
    if s.type == docx.enum.style.WD_STYLE_TYPE.PARAGRAPH:
        f = s.font
        print(f"Style: '{s.name}' -> font={f.name}, size={f.size.pt if f.size else None}, bold={f.bold}, color={f.color.rgb if f.color else None}")

print("\n=== CHECKING DEFAULT / NORMAL IN REF.DOCX ===")
style_norm = doc.styles['Normal']
print(f"Normal: font={style_norm.font.name}, size={style_norm.font.size.pt if style_norm.font.size else None}")

print("\n=== CHECKING LIST BULLET STYLE IN REF.DOCX ===")
try:
    s_lb = doc.styles['List Bullet']
    print(f"List Bullet: font={s_lb.font.name}, size={s_lb.font.size.pt if s_lb.font.size else None}")
except Exception as e:
    print(f"List Bullet: {e}")

print("\n=== CHECKING PARAGRAPHS 14 to 35 (SYNOPSIS & OBJECTIVE) ===")
for i in range(14, 36):
    p = doc.paragraphs[i]
    t = p.text.strip()
    runs_str = " | ".join([f"'{r.text}' ({r.font.name}, {r.font.size.pt if r.font.size else 'None'}pt, b={r.font.bold}, c={r.font.color.rgb if r.font.color else 'None'})" for r in p.runs])
    print(f"P[{i:2d}] style='{p.style.name}' sb={p.paragraph_format.space_before.pt if p.paragraph_format.space_before else None} sa={p.paragraph_format.space_after.pt if p.paragraph_format.space_after else None}")
    print(f"     text='{t[:50]}'")
    print(f"     runs: {runs_str[:120]}")

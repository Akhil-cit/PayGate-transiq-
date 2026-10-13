import docx
import sys
sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document(r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx')
for i in range(14, 30):
    p = doc.paragraphs[i]
    t = p.text.strip()
    xml = p._element.xml
    pb = ('w:br w:type="page"' in xml) or ('w:pageBreakBefore' in xml)
    t_safe = t.encode('ascii', 'replace').decode('ascii')
    print(f"P[{i:2d}] pb={str(pb):5s} | len={len(t):3d} | {t_safe[:60]}")

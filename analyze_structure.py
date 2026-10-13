import docx
import sys

sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document(r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx')

print(f"Total sections: {len(doc.sections)}")
for s_idx, sec in enumerate(doc.sections):
    print(f"Section {s_idx}: top={sec.top_margin.inches if sec.top_margin else None} in, bottom={sec.bottom_margin.inches if sec.bottom_margin else None} in, left={sec.left_margin.inches if sec.left_margin else None} in, right={sec.right_margin.inches if sec.right_margin else None} in")

print("\n--- ALL PARAGRAPHS ---")
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    xml = p._element.xml
    pb = ('w:br w:type="page"' in xml) or ('w:pageBreakBefore' in xml)
    align = str(p.alignment)
    sb = p.paragraph_format.space_before.pt if p.paragraph_format.space_before else None
    sa = p.paragraph_format.space_after.pt if p.paragraph_format.space_after else None
    ls = p.paragraph_format.line_spacing
    runs_summary = [(r.text[:15], r.font.name, r.font.size.pt if r.font.size else None, r.font.bold) for r in p.runs[:3]]
    t_safe = t.encode('ascii', 'replace').decode('ascii')[:45]
    print(f"{i:3d} | pb={str(pb):5s} | al={align:15s} | sb={str(sb):4s} | sa={str(sa):4s} | ls={str(ls):4s} | {t_safe:45s} | runs={runs_summary}")

import docx
import sys
sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document(r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx')
body = doc._body._element
tbl_count = 0
for i, el in enumerate(body):
    tag = el.tag.split('}')[-1]
    if tag == 'tbl':
        tbl = docx.table.Table(el, doc)
        prev_p = docx.text.paragraph.Paragraph(body[i-1], doc) if i > 0 and body[i-1].tag.endswith('p') else None
        prev_t = prev_p.text.strip()[:50] if prev_p else 'N/A'
        print(f"Table {tbl_count} (body el {i}): rows={len(tbl.rows)}, cols={len(tbl.columns)}, after P='{prev_t}'")
        tbl_count += 1

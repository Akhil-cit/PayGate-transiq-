import docx
import sys

sys.stdout.reconfigure(encoding='utf-8')

ref_path = r'C:\Users\dell\Downloads\ref.docx'
doc = docx.Document(ref_path)

print("=== SECTIONS & MARGINS ===")
for i, sec in enumerate(doc.sections):
    print(f"Section {i}:")
    print(f"  Page Width: {sec.page_width.inches:.3f} in")
    print(f"  Page Height: {sec.page_height.inches:.3f} in")
    print(f"  Top Margin: {sec.top_margin.inches:.3f} in ({sec.top_margin.pt:.1f} pt)")
    print(f"  Bottom Margin: {sec.bottom_margin.inches:.3f} in ({sec.bottom_margin.pt:.1f} pt)")
    print(f"  Left Margin: {sec.left_margin.inches:.3f} in ({sec.left_margin.pt:.1f} pt)")
    print(f"  Right Margin: {sec.right_margin.inches:.3f} in ({sec.right_margin.pt:.1f} pt)")
    print(f"  Header Distance: {sec.header_distance.inches:.3f} in")
    print(f"  Footer Distance: {sec.footer_distance.inches:.3f} in")
    
    sectPr = sec._sectPr
    for child in sectPr:
        tag = child.tag.split('}')[-1]
        if tag in ['pgBorders', 'pgMar', 'pgSz', 'type', 'headerReference', 'footerReference']:
            import xml.etree.ElementTree as ET
            print(f"    <{tag}>: {ET.tostring(child, encoding='unicode')[:200]}")

print("\n=== NORMAL STYLE ===")
style_norm = doc.styles['Normal']
print(f"font: name={style_norm.font.name}, size={style_norm.font.size.pt if style_norm.font.size else None} pt, color={style_norm.font.color.rgb if style_norm.font.color else None}")
print(f"pf: align={style_norm.paragraph_format.alignment}, ls={style_norm.paragraph_format.line_spacing}, sb={style_norm.paragraph_format.space_before}, sa={style_norm.paragraph_format.space_after}")

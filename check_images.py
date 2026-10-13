import docx
import sys
sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document(r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx')
for i, p in enumerate(doc.paragraphs):
    xml = p._element.xml
    if '<w:drawing' in xml:
        for extent in p._element.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}extent'):
            cx = int(extent.attrib.get('cx', 0))
            cy = int(extent.attrib.get('cy', 0))
            print(f"P[{i:3d}] Image: cx={cx} ({cx/914400:.2f} in, {cx/12700:.1f} pt), cy={cy} ({cy/914400:.2f} in, {cy/12700:.1f} pt)")

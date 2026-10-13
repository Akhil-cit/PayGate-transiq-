import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml
from docx.oxml.ns import nsdecls, qn
import xml.etree.ElementTree as ET
import shutil
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

# Ensure Word is closed
os.system('powershell -Command "Stop-Process -Name WINWORD -Force -ErrorAction SilentlyContinue"')

doc_path = r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx'
doc = docx.Document(doc_path)

# 1. APPLY EXACT MARGINS FROM ref.docx
# Top: 0.65 in, Bottom: 0.65 in, Left: 0.75 in, Right: 0.75 in
# Page size: 8.5 in x 11.0 in (Letter)
for sec in doc.sections:
    sec.page_width = Inches(8.5)
    sec.page_height = Inches(11.0)
    sec.top_margin = Inches(0.65)
    sec.bottom_margin = Inches(0.65)
    sec.left_margin = Inches(0.75)
    sec.right_margin = Inches(0.75)
    sec.header_distance = Inches(0.5)
    sec.footer_distance = Inches(0.5)

# Color constants matching ref.docx
NAVY = RGBColor(15, 39, 71)       # #0F2747
SLATE = RGBColor(28, 70, 112)     # #1C4670
TEAL = RGBColor(13, 148, 136)     # #0D9488
DARK = RGBColor(30, 41, 59)       # #1E293B
MUTED = RGBColor(100, 116, 139)   # #64748B
WHITE = RGBColor(255, 255, 255)   # #FFFFFF

NAVY_HEX = "0F2747"
WHITE_HEX = "FFFFFF"
TINT_HEX = "F8FAFC"
BORDER_HEX = "CBD5E1"

def set_cell_margins(cell, top=20, bottom=20, left=40, right=40):
    tcPr = cell._tc.get_or_add_tcPr()
    for existing in tcPr.findall(qn('w:tcMar')):
        tcPr.remove(existing)
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    for existing in tcPr.findall(qn('w:shd')):
        tcPr.remove(existing)
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def apply_ref_table_borders(tbl):
    tblPr = tbl._tbl.tblPr
    for existing in tblPr.findall(qn('w:tblBorders')):
        tblPr.remove(existing)
    tblBorders = parse_xml(f'<w:tblBorders {nsdecls("w")}><w:top w:val="single" w:sz="4" w:space="0" w:color="{BORDER_HEX}"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="{BORDER_HEX}"/><w:insideH w:val="single" w:sz="4" w:space="0" w:color="{BORDER_HEX}"/></w:tblBorders>')
    tblPr.append(tblBorders)

def add_page_break_before(p):
    pPr = p._p.get_or_add_pPr()
    if pPr.find(qn('w:pageBreakBefore')) is None:
        pPr.append(parse_xml(f'<w:pageBreakBefore {nsdecls("w")}/>'))

print("1. Formatting Cover Page according to ref.docx style...")
# P0: Logo
p0 = doc.paragraphs[0]
p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
p0.paragraph_format.space_before = Pt(2)
p0.paragraph_format.space_after = Pt(2)
p0.paragraph_format.line_spacing = 1.0
for extent in p0._element.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}extent'):
    extent.attrib['cx'] = '841248'  # 0.92 in
    extent.attrib['cy'] = '852552'  # 0.932 in

# P1: College Name (14.5 pt bold NAVY in ref.docx)
p1 = doc.paragraphs[1]
p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
p1.paragraph_format.space_before = Pt(0)
p1.paragraph_format.space_after = Pt(1)
p1.paragraph_format.line_spacing = 1.0
for r in p1.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(13)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P2: Subtext (9.0 pt SLATE in ref.docx)
p2 = doc.paragraphs[2]
p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
p2.paragraph_format.space_before = Pt(0)
p2.paragraph_format.space_after = Pt(2)
p2.paragraph_format.line_spacing = 1.05
for r in p2.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8.5)
    r.font.bold = False
    r.font.color.rgb = SLATE

# P3: Divider (9.5 pt NAVY in ref.docx)
p3 = doc.paragraphs[3]
p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
p3.paragraph_format.space_before = Pt(0)
p3.paragraph_format.space_after = Pt(2)
p3.paragraph_format.line_spacing = 1.0
for r in p3.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8.5)
    r.font.color.rgb = NAVY

# P4: Record Title (11.0 pt bold TEAL in ref.docx)
p4 = doc.paragraphs[4]
p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
p4.paragraph_format.space_before = Pt(0)
p4.paragraph_format.space_after = Pt(1)
p4.paragraph_format.line_spacing = 1.0
for r in p4.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = TEAL

# P5: Project Title (20.0 pt bold NAVY in ref.docx)
p5 = doc.paragraphs[5]
p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
p5.paragraph_format.space_before = Pt(0)
p5.paragraph_format.space_after = Pt(1)
p5.paragraph_format.line_spacing = 1.0
for r in p5.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(16)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P6: Subtitle (12.0 pt bold SLATE in ref.docx)
p6 = doc.paragraphs[6]
p6.alignment = WD_ALIGN_PARAGRAPH.CENTER
p6.paragraph_format.space_before = Pt(0)
p6.paragraph_format.space_after = Pt(1)
p6.paragraph_format.line_spacing = 1.0
for r in p6.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = SLATE

# P7: System Subtitle (Italic MUTED in ref.docx)
p7 = doc.paragraphs[7]
p7.alignment = WD_ALIGN_PARAGRAPH.CENTER
p7.paragraph_format.space_before = Pt(0)
p7.paragraph_format.space_after = Pt(2)
p7.paragraph_format.line_spacing = 1.0
for r in p7.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)
    r.font.italic = True
    r.font.color.rgb = MUTED

# P8: Module Title (12.0 pt bold NAVY in ref.docx)
p8 = doc.paragraphs[8]
p8.alignment = WD_ALIGN_PARAGRAPH.CENTER
p8.paragraph_format.space_before = Pt(2)
p8.paragraph_format.space_after = Pt(3)
p8.paragraph_format.line_spacing = 1.0
for r in p8.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(10.5)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P9: "PROJECT DETAILS" (10.5 pt bold NAVY in ref.docx)
p9 = doc.paragraphs[9]
p9.alignment = WD_ALIGN_PARAGRAPH.LEFT
p9.paragraph_format.space_before = Pt(2)
p9.paragraph_format.space_after = Pt(1)
p9.paragraph_format.line_spacing = 1.0
p9.paragraph_format.keep_with_next = True
for r in p9.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(9)
    r.font.bold = True
    r.font.color.rgb = NAVY

# Table 0: Project Details
tbl0 = doc.tables[0]
tbl0.alignment = WD_TABLE_ALIGNMENT.CENTER
apply_ref_table_borders(tbl0)
for r_idx, row in enumerate(tbl0.rows):
    trPr = row._tr.get_or_add_trPr()
    if trPr.find(qn('w:cantSplit')) is None:
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    fill_color = NAVY_HEX if r_idx == 0 else (WHITE_HEX if r_idx % 2 == 1 else TINT_HEX)
    for c_idx, cell in enumerate(row.cells):
        set_cell_shading(cell, fill_color)
        set_cell_margins(cell, top=15, bottom=15, left=40, right=40)
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = 'Times New Roman'
                if r_idx == 0:
                    r.font.size = Pt(8.5)
                    r.font.bold = True
                    r.font.color.rgb = WHITE
                else:
                    r.font.size = Pt(8)
                    if c_idx == 0:
                        r.font.bold = True
                        r.font.color.rgb = NAVY
                    else:
                        r.font.bold = False
                        r.font.color.rgb = DARK

# P10: "TEAM DETAILS (6 MEMBERS)" (10.5 pt bold NAVY in ref.docx)
p10 = doc.paragraphs[10]
p10.alignment = WD_ALIGN_PARAGRAPH.LEFT
p10.paragraph_format.space_before = Pt(3)
p10.paragraph_format.space_after = Pt(1)
p10.paragraph_format.line_spacing = 1.0
p10.paragraph_format.keep_with_next = True
for r in p10.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(9)
    r.font.bold = True
    r.font.color.rgb = NAVY

# Table 1: Team Details
tbl1 = doc.tables[1]
tbl1.alignment = WD_TABLE_ALIGNMENT.CENTER
apply_ref_table_borders(tbl1)
for r_idx, row in enumerate(tbl1.rows):
    trPr = row._tr.get_or_add_trPr()
    if trPr.find(qn('w:cantSplit')) is None:
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    fill_color = NAVY_HEX if r_idx == 0 else (WHITE_HEX if r_idx % 2 == 1 else TINT_HEX)
    for c_idx, cell in enumerate(row.cells):
        set_cell_shading(cell, fill_color)
        set_cell_margins(cell, top=15, bottom=15, left=35, right=35)
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER if c_idx == 0 else WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = 'Times New Roman'
                if r_idx == 0:
                    r.font.size = Pt(8)
                    r.font.bold = True
                    r.font.color.rgb = WHITE
                else:
                    r.font.size = Pt(7.5)
                    if c_idx == 0:
                        r.font.bold = True
                        r.font.color.rgb = NAVY
                    else:
                        r.font.bold = False
                        r.font.color.rgb = DARK

# P11: Guide Supervisor
p11 = doc.paragraphs[11]
p11.alignment = WD_ALIGN_PARAGRAPH.LEFT
p11.paragraph_format.space_before = Pt(3)
p11.paragraph_format.space_after = Pt(1)
p11.paragraph_format.line_spacing = 1.0
p11.paragraph_format.keep_with_next = True
for r in p11.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P12: Signatures
p12 = doc.paragraphs[12]
p12.alignment = WD_ALIGN_PARAGRAPH.LEFT
p12.paragraph_format.space_before = Pt(1)
p12.paragraph_format.space_after = Pt(0)
p12.paragraph_format.line_spacing = 1.0
for r in p12.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P13: Page Break after Page 1
p13 = doc.paragraphs[13]
p13.text = ""
p13.paragraph_format.space_before = Pt(0)
p13.paragraph_format.space_after = Pt(0)
p13_run = p13.add_run()
p13_run.add_break(docx.enum.text.WD_BREAK.PAGE)

print("2. Formatting all tables (Tables 2-6) with exact ref.docx styling (borders, alternating fills, 8.5pt font)...")
for t_idx in range(2, len(doc.tables)):
    tbl = doc.tables[t_idx]
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    apply_ref_table_borders(tbl)
    for r_idx, row in enumerate(tbl.rows):
        trPr = row._tr.get_or_add_trPr()
        if trPr.find(qn('w:cantSplit')) is None:
            trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        fill_color = NAVY_HEX if r_idx == 0 else (WHITE_HEX if r_idx % 2 == 1 else TINT_HEX)
        for c_idx, cell in enumerate(row.cells):
            set_cell_shading(cell, fill_color)
            set_cell_margins(cell, top=20, bottom=20, left=40, right=40)
            for p in cell.paragraphs:
                p.paragraph_format.space_before = Pt(0)
                p.paragraph_format.space_after = Pt(0)
                p.paragraph_format.line_spacing = 1.05
                for r in p.runs:
                    r.font.name = 'Times New Roman'
                    if r_idx == 0:
                        r.font.size = Pt(9.0)
                        r.font.bold = True
                        r.font.color.rgb = WHITE
                    else:
                        r.font.size = Pt(8.5)
                        if not r.font.bold:
                            r.font.color.rgb = DARK

print("3. Formatting headings and text to exact ref.docx specifications...")
# Major section headings in ref.docx: 15.0 pt, Bold, #0F2747, space_before=12 pt, space_after=4 pt
# Subheadings in ref.docx: 12.0 pt, Bold, #1C4670, space_before=8 pt, space_after=2 pt
# List / numbered items in ref.docx: 9.5 pt, Bold #0F2747 prefix, 9.5 pt normal description, space_before=1 pt, space_after=1.5 pt
# Body text in ref.docx: 10.0 pt, line spacing 1.12

major_headings = [
    "Synopsis",
    "Objective",
    "Scope",
    "Project Description",
    "DB Design",
    "Data Flow Diagram (DFD)",
    "ER Diagram",
    "Use Case Diagram",
    "Class Diagram",
    "Sequence Diagram",
    "Screenshots (Forms)",
    "Test Report",
    "Conclusion and Further Enhancements"
]

subheadings_slate = [
    "Operational Challenge & Problem Statement",
    "Key Functional & Architectural Innovations",
    "Implementation Stack & Documented Outcome",
    "Functional Scope",
    "Technical Scope",
    "Out-of-Scope (Future Expansion)",
    "Client Tier – Admin Monitoring UI Console",
    "Application Server Tier – transiq-api",
    "Data Persistence Tier – MongoDB",
    "5.1 errorlogs Collection (Incident Telemetry Repository)",
    "5.2 transactions Collection (Audited Financial Ledger)",
    "5.3 Documented Error Codes & Severity Classification Matrix",
    "Process Narrative & Data Store Interactions",
    "Entity Cardinalities & Referential Integrity",
    "Use Case Specifications",
    "Class Responsibilities & Methods",
    "Chronological Operational Flow",
    "Form 12.1",
    "Form 12.2",
    "Form 12.3",
    "Form 12.4",
    "Form 12.5",
    "Form 12.6",
    "Test Execution Summary",
    "Detailed Test Cases Execution Table",
    "Conclusion",
    "Further Enhancements"
]

for i in range(14, len(doc.paragraphs)):
    p = doc.paragraphs[i]
    t = p.text.strip()
    
    # Check if major heading
    is_major = any(t == h or t.startswith(h) for h in major_headings)
    if is_major:
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        if t != "Synopsis":
            add_page_break_before(p)
        for r in p.runs:
            r.font.name = 'Times New Roman'
            r.font.size = Pt(15.0)
            r.font.bold = True
            r.font.color.rgb = NAVY
        continue

    # Check if subheading
    is_sub = any(t == sh or t.startswith(sh) for sh in subheadings_slate)
    if is_sub:
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        
        # In DB Design and Screenshots, page breaks before 5.2, 5.3, Form 12.3, Form 12.5
        if t.startswith("5.2") or t.startswith("5.3") or t.startswith("Form 12.3") or t.startswith("Form 12.5"):
            add_page_break_before(p)
            
        for r in p.runs:
            r.font.name = 'Times New Roman'
            r.font.size = Pt(12.0)
            r.font.bold = True
            r.font.color.rgb = SLATE
        continue

    # Figure captions in ref.docx
    if t.startswith("Figure "):
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = False
        for r in p.runs:
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.0)
            r.font.bold = True
            r.font.color.rgb = SLATE
        continue

    # Numbered / bullet items (e.g. "1. ...", "UC-...", "TC-...")
    is_numbered = False
    for r in p.runs:
        if r.font.bold and any(t.startswith(prefix) for prefix in ["1.", "2.", "3.", "4.", "5.", "6.", "7.", "8.", "UC-", "TC-", "•", "-"]):
            is_numbered = True
            break
            
    if is_numbered:
        p.paragraph_format.space_before = Pt(1.0)
        p.paragraph_format.space_after = Pt(1.5)
        p.paragraph_format.line_spacing = 1.10
        for r in p.runs:
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)
            if r.font.bold:
                r.font.color.rgb = NAVY
            else:
                r.font.color.rgb = DARK
    else:
        # Regular body paragraphs
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(3.0)
        p.paragraph_format.line_spacing = 1.12
        for r in p.runs:
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10.0)
            if not r.font.bold:
                r.font.color.rgb = DARK

print("4. Optimizing image displays...")
# Screenshots: width 5.2 in, height 2.5 in
for i, p in enumerate(doc.paragraphs):
    if '<w:drawing' in p._element.xml:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        if 135 <= i <= 160:
            for extent in p._element.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}extent'):
                extent.attrib['cx'] = '4754880'  # 5.2 in
                extent.attrib['cy'] = '2286000'  # 2.5 in
        elif i in [80, 90, 100, 113, 124]:
            for extent in p._element.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}extent'):
                extent.attrib['cx'] = '5303520'  # 5.8 in
                extent.attrib['cy'] = '3474720'  # 3.8 in

# Save docx
temp_path = r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted_temp.docx'
doc.save(temp_path)

target_desktop = r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx'
target_docs = r'C:\Users\dell\Documents\PayGate_Module_6_Professionally_Formatted.docx'

shutil.copyfile(temp_path, target_desktop)
shutil.copyfile(temp_path, target_docs)
os.remove(temp_path)

print("Saved updated files successfully!")

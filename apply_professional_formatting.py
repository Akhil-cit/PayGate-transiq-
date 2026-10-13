import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn
import shutil
import sys
import os

sys.stdout.reconfigure(encoding='utf-8')

src_path = r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx'
doc = docx.Document(src_path)

# Set page margins to 0.5 in
for sec in doc.sections:
    sec.top_margin = Inches(0.5)
    sec.bottom_margin = Inches(0.5)
    sec.left_margin = Inches(0.5)
    sec.right_margin = Inches(0.5)

# Color Palette
NAVY = RGBColor(15, 39, 71)       # #0F2747
SLATE = RGBColor(28, 70, 112)     # #1C4670
TEAL = RGBColor(13, 148, 136)     # #0D9488
DARK = RGBColor(30, 41, 59)       # #1E293B
MUTED = RGBColor(100, 116, 139)   # #64748B
WHITE = RGBColor(255, 255, 255)   # #FFFFFF

NAVY_HEX = "0F2747"
LIGHT_BG_HEX = "F8FAFC"
BORDER_HEX = "CBD5E1"

def set_cell_margins(cell, top=20, bottom=20, left=40, right=40):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def set_cell_shading(cell, color_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    # remove existing shd if any
    for existing in tcPr.findall(qn('w:shd')):
        tcPr.remove(existing)
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    tcPr.append(shd)

def add_page_break_before(p):
    pPr = p._p.get_or_add_pPr()
    if pPr.find(qn('w:pageBreakBefore')) is None:
        pPr.append(parse_xml(f'<w:pageBreakBefore {nsdecls("w")}/>'))

def remove_manual_page_breaks_in_p(p):
    # Remove any w:br w:type="page" from runs in this paragraph
    for r in p.runs:
        for br in r._element.findall(qn('w:br')):
            if br.attrib.get(qn('w:type')) == 'page':
                r._element.remove(br)

print("Formatting cover page...")
# P0: CIT Logo
p0 = doc.paragraphs[0]
p0.alignment = WD_ALIGN_PARAGRAPH.CENTER
p0.paragraph_format.space_before = Pt(0)
p0.paragraph_format.space_after = Pt(2)
p0.paragraph_format.line_spacing = 1.0

# Ensure logo image extent is clean (~0.92 in width, ~0.94 in height)
for extent in p0._element.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}extent'):
    extent.attrib['cx'] = '841248'  # 0.92 in
    extent.attrib['cy'] = '852552'  # 0.932 in

# P1: College Name
p1 = doc.paragraphs[1]
p1.alignment = WD_ALIGN_PARAGRAPH.CENTER
p1.paragraph_format.space_before = Pt(0)
p1.paragraph_format.space_after = Pt(1)
p1.paragraph_format.line_spacing = 1.0
for r in p1.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(12)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P2: Subtext
p2 = doc.paragraphs[2]
p2.alignment = WD_ALIGN_PARAGRAPH.CENTER
p2.paragraph_format.space_before = Pt(0)
p2.paragraph_format.space_after = Pt(2)
p2.paragraph_format.line_spacing = 1.05
for r in p2.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)
    r.font.bold = False
    r.font.color.rgb = SLATE

# P3: Divider
p3 = doc.paragraphs[3]
p3.alignment = WD_ALIGN_PARAGRAPH.CENTER
p3.paragraph_format.space_before = Pt(0)
p3.paragraph_format.space_after = Pt(2)
p3.paragraph_format.line_spacing = 1.0
for r in p3.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(7.5)
    r.font.bold = False
    r.font.color.rgb = NAVY

# P4: Record Title
p4 = doc.paragraphs[4]
p4.alignment = WD_ALIGN_PARAGRAPH.CENTER
p4.paragraph_format.space_before = Pt(0)
p4.paragraph_format.space_after = Pt(1)
p4.paragraph_format.line_spacing = 1.0
for r in p4.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = TEAL

# P5: Project Title
p5 = doc.paragraphs[5]
p5.alignment = WD_ALIGN_PARAGRAPH.CENTER
p5.paragraph_format.space_before = Pt(0)
p5.paragraph_format.space_after = Pt(1)
p5.paragraph_format.line_spacing = 1.0
for r in p5.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(15)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P6: Subtitle
p6 = doc.paragraphs[6]
p6.alignment = WD_ALIGN_PARAGRAPH.CENTER
p6.paragraph_format.space_before = Pt(0)
p6.paragraph_format.space_after = Pt(1)
p6.paragraph_format.line_spacing = 1.0
for r in p6.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(9.5)
    r.font.bold = True
    r.font.color.rgb = SLATE

# P7: System Subtitle
p7 = doc.paragraphs[7]
p7.alignment = WD_ALIGN_PARAGRAPH.CENTER
p7.paragraph_format.space_before = Pt(0)
p7.paragraph_format.space_after = Pt(2)
p7.paragraph_format.line_spacing = 1.0
for r in p7.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8)
    r.font.italic = True
    r.font.bold = False
    r.font.color.rgb = MUTED

# P8: Module Title
p8 = doc.paragraphs[8]
p8.alignment = WD_ALIGN_PARAGRAPH.CENTER
p8.paragraph_format.space_before = Pt(2)
p8.paragraph_format.space_after = Pt(3)
p8.paragraph_format.line_spacing = 1.0
for r in p8.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(10)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P9: "PROJECT DETAILS"
p9 = doc.paragraphs[9]
p9.alignment = WD_ALIGN_PARAGRAPH.LEFT
p9.paragraph_format.space_before = Pt(2)
p9.paragraph_format.space_after = Pt(1)
p9.paragraph_format.line_spacing = 1.0
p9.paragraph_format.keep_with_next = True
for r in p9.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = NAVY

# Table 0: Project Details
tbl0 = doc.tables[0]
tbl0.alignment = WD_TABLE_ALIGNMENT.CENTER
for r_idx, row in enumerate(tbl0.rows):
    trPr = row._tr.get_or_add_trPr()
    if trPr.find(qn('w:cantSplit')) is None:
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    for c_idx, cell in enumerate(row.cells):
        set_cell_margins(cell, top=20, bottom=20, left=50, right=50)
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
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

# P10: (Note: in paragraph list P[10] is TEAM DETAILS)
p10 = doc.paragraphs[10]
p10.alignment = WD_ALIGN_PARAGRAPH.LEFT
p10.paragraph_format.space_before = Pt(3)
p10.paragraph_format.space_after = Pt(1)
p10.paragraph_format.line_spacing = 1.0
p10.paragraph_format.keep_with_next = True
for r in p10.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(8.5)
    r.font.bold = True
    r.font.color.rgb = NAVY

# Table 1: Team Details
tbl1 = doc.tables[1]
tbl1.alignment = WD_TABLE_ALIGNMENT.CENTER
for r_idx, row in enumerate(tbl1.rows):
    trPr = row._tr.get_or_add_trPr()
    if trPr.find(qn('w:cantSplit')) is None:
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
    for c_idx, cell in enumerate(row.cells):
        set_cell_margins(cell, top=20, bottom=20, left=40, right=40)
        for p in cell.paragraphs:
            p.paragraph_format.space_before = Pt(0)
            p.paragraph_format.space_after = Pt(0)
            p.paragraph_format.line_spacing = 1.0
            if c_idx == 0:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            for r in p.runs:
                r.font.name = 'Times New Roman'
                if r_idx == 0:
                    r.font.size = Pt(7.5)
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
    r.font.size = Pt(8)
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
    r.font.size = Pt(8)
    r.font.bold = True
    r.font.color.rgb = NAVY

# P13: Page Break paragraph before Synopsis
p13 = doc.paragraphs[13]
p13.paragraph_format.space_before = Pt(0)
p13.paragraph_format.space_after = Pt(0)
p13.paragraph_format.line_spacing = 1.0
# Ensure p13 has a page break run and nothing else
p13.text = ""
p13_run = p13.add_run()
p13_run.add_break(docx.enum.text.WD_BREAK.PAGE)

print("Cover page tight styling complete!")

# Fix Table Headers across ALL tables (0 through 6) to White font & Navy Fill
print("Styling all tables to ensure header font is crisp WHITE...")
for tbl_idx, tbl in enumerate(doc.tables):
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    # Check header row (row 0)
    for c_idx, cell in enumerate(tbl.rows[0].cells):
        set_cell_shading(cell, NAVY_HEX)
        for p in cell.paragraphs:
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.bold = True
                r.font.color.rgb = WHITE
    
    # Check all cells in entire table for dark background
    for row in tbl.rows:
        trPr = row._tr.get_or_add_trPr()
        if trPr.find(qn('w:cantSplit')) is None:
            trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        for cell in row.cells:
            # check fill
            shd = cell._tc.get_or_add_tcPr().find(qn('w:shd'))
            if shd is not None:
                fill_val = shd.attrib.get(qn('w:fill'), '').upper()
                if fill_val in ['0F2747', '000000', '1C4670', '0F172A']:
                    for p in cell.paragraphs:
                        for r in p.runs:
                            r.font.name = 'Times New Roman'
                            r.font.bold = True
                            r.font.color.rgb = WHITE
                elif fill_val in ['FFFFFF', 'F8FAFC', 'F1F5F9', 'NONE', 'AUTO', '']:
                    for p in cell.paragraphs:
                        for r in p.runs:
                            r.font.name = 'Times New Roman'
                            if not r.font.bold:
                                r.font.color.rgb = DARK

print("All table headers successfully updated to crisp white font!")

# Now format Synopsis (strictly 1 page, starts on Page 2)
# P[14] is Synopsis heading
p14 = doc.paragraphs[14]
p14.alignment = WD_ALIGN_PARAGRAPH.LEFT
p14.paragraph_format.space_before = Pt(0)
p14.paragraph_format.space_after = Pt(3)
p14.paragraph_format.keep_with_next = True
for r in p14.runs:
    r.font.name = 'Times New Roman'
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = NAVY

for p_i in range(15, 27):
    p = doc.paragraphs[p_i]
    t = p.text.strip()
    is_sub = t in [
        "Operational Challenge & Problem Statement",
        "Key Functional & Architectural Innovations",
        "Implementation Stack & Documented Outcome"
    ]
    if is_sub:
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.05
        p.paragraph_format.keep_with_next = True
        for r in p.runs:
            r.font.name = 'Times New Roman'
            r.font.size = Pt(10)
            r.font.bold = True
            r.font.color.rgb = NAVY
    else:
        p.paragraph_format.space_before = Pt(0)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.line_spacing = 1.12
        for r in p.runs:
            r.font.name = 'Times New Roman'
            r.font.size = Pt(9.5)
            if not r.font.bold:
                r.font.color.rgb = DARK

# P[27] is page break at end of Synopsis
p27 = doc.paragraphs[27]
p27.text = ""
p27.paragraph_format.space_before = Pt(0)
p27.paragraph_format.space_after = Pt(0)
p27_run = p27.add_run()
p27_run.add_break(docx.enum.text.WD_BREAK.PAGE)

# Define Major Sections and their Starting Paragraphs
# We want clean page breaks before each major section and lower subheadings
section_breaks_before_text = [
    ("Objective", 14),
    ("Scope", 14),
    ("Project Description", 14),
    ("DB Design", 14),
    ("5.2 transactions Collection (Audited Financial Ledger)", 11.5),
    ("5.3 Documented Error Codes & Severity Classification Matrix", 11.5),
    ("Data Flow Diagram (DFD)", 14),
    ("ER Diagram", 14),
    ("Use Case Diagram", 14),
    ("Class Diagram", 14),
    ("Sequence Diagram", 14),
    ("Screenshots (Forms)", 14),
    ("Form 12.3", 11),
    ("Form 12.5", 11),
    ("Test Report", 14),
    ("Conclusion and Further Enhancements", 14)
]

print("Applying page breaks and keep_with_next on sections and subheadings...")
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    
    # Check if this paragraph matches any break target
    matched = False
    for title_target, font_sz in section_breaks_before_text:
        if t == title_target or t.startswith(title_target):
            matched = True
            add_page_break_before(p)
            p.paragraph_format.keep_with_next = True
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(3)
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.size = Pt(font_sz)
                r.font.bold = True
                r.font.color.rgb = NAVY
            print(f"Page break before: P[{i:3d}] '{t[:40]}'")
            break
            
    if not matched:
        # Check general headings or figure captions
        if t.startswith("Figure "):
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(4)
            p.paragraph_format.keep_with_next = False
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.size = Pt(8.5)
                r.font.bold = True
                r.font.color.rgb = SLATE
        elif t.startswith("Form "):
            p.paragraph_format.space_before = Pt(4)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.size = Pt(10.5)
                r.font.bold = True
                r.font.color.rgb = NAVY
        elif t in ["Functional Scope", "Technical Scope", "Out-of-Scope (Future Expansion)",
                   "Client Tier – Admin Monitoring UI Console", "Application Server Tier – transiq-api",
                   "Data Persistence Tier – MongoDB", "5.1 errorlogs Collection (Incident Telemetry Repository)",
                   "Test Execution Summary", "Detailed Test Cases Execution Table", "Conclusion", "Further Enhancements"]:
            p.paragraph_format.space_before = Pt(5)
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.keep_with_next = True
            for r in p.runs:
                r.font.name = 'Times New Roman'
                r.font.size = Pt(11)
                r.font.bold = True
                r.font.color.rgb = NAVY

# Resize screenshot images slightly so that 2 forms fit cleanly on one page
# 5.2 in width, 2.5 in height
print("Optimizing screenshot image dimensions...")
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    if 135 <= i <= 160 and '<w:drawing' in p._element.xml:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        for extent in p._element.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}extent'):
            # 5.2 in width = 4754880 dxa, 2.5 in height = 2286000 dxa
            extent.attrib['cx'] = '4754880'
            extent.attrib['cy'] = '2286000'

# Diagram images (P[80], P[90], P[100], P[113], P[124])
for i in [80, 90, 100, 113, 124]:
    p = doc.paragraphs[i]
    if '<w:drawing' in p._element.xml:
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        for extent in p._element.findall('.//{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}extent'):
            extent.attrib['cx'] = '5303520'  # 5.8 in
            extent.attrib['cy'] = '3474720'  # 3.8 in

# Save document
temp_desktop_path = r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted_temp.docx'
doc.save(temp_desktop_path)
print("Saved temporary docx successfully.")

# Replace target file
target_desktop = r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx'
target_docs = r'C:\Users\dell\Documents\PayGate_Module_6_Professionally_Formatted.docx'

shutil.copyfile(temp_desktop_path, target_desktop)
shutil.copyfile(temp_desktop_path, target_docs)
os.remove(temp_desktop_path)

print(f"Successfully updated and saved:\n- {target_desktop}\n- {target_docs}")

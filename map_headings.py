import docx
import sys
sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document(r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx')

sections_to_track = [
    "Objective", "Scope", "Project Description", "DB Design", 
    "Data Flow Diagram (DFD)", "ER Diagram", "Use Case Diagram", 
    "Class Diagram", "Sequence Diagram", "Screenshots (Forms)", 
    "Test Report", "Conclusion and Further Enhancements"
]

print("=== PARAGRAPH MAP & HEADINGS ===")
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    xml = p._element.xml
    pb = ('w:br w:type="page"' in xml) or ('w:pageBreakBefore' in xml)
    has_image = '<w:drawing' in xml
    
    is_major = any(t == s for s in sections_to_track)
    is_sub = any(t.startswith(s) for s in ["Form ", "Figure ", "Table ", "5.", "6.", "7.", "8.", "9.", "10.", "11.", "12.", "Functional Scope", "Technical Scope", "Out-of-Scope", "Client Tier", "Application Server Tier", "Data Persistence Tier", "Test Execution Summary", "Detailed Test Cases", "Conclusion", "Further Enhancements"])
    
    if is_major or is_sub or pb or has_image:
        t_clean = t.encode('ascii', 'replace').decode('ascii')[:60]
        print(f"P[{i:3d}] pb={str(pb):5s} img={str(has_image):5s} | major={str(is_major):5s} sub={str(is_sub):5s} | '{t_clean}'")

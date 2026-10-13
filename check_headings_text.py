import docx
import sys
sys.stdout.reconfigure(encoding='utf-8')

doc = docx.Document(r'C:\Users\dell\Desktop\PayGate_Module_6_Professionally_Formatted.docx')

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

print("=== CHECKING MAJOR HEADINGS IN PARAGRAPHS ===")
for i, p in enumerate(doc.paragraphs):
    t = p.text.strip()
    for mh in major_headings:
        if t == mh or t.startswith(mh):
            print(f"P[{i:3d}] MATCHED: '{t}'")

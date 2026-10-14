import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, hex_color):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_styled_heading(doc, text, level=1):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(14)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    run = p.add_run(text)
    run.font.name = 'Arial'
    run.bold = True
    if level == 1:
        run.font.size = Pt(16)
        run.font.color.rgb = RGBColor(30, 58, 138)  # Deep Navy Blue
    elif level == 2:
        run.font.size = Pt(13)
        run.font.color.rgb = RGBColor(37, 99, 235)  # Royal Blue
    elif level == 3:
        run.font.size = Pt(11)
        run.font.color.rgb = RGBColor(17, 24, 39)
    return p

def format_table(table, col_widths=None):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    header_tr = table.rows[0]._tr.get_or_add_trPr()
    header_tr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
    
    for i, row in enumerate(table.rows):
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        for j, cell in enumerate(row.cells):
            set_cell_margins(cell, top=120, bottom=120, left=160, right=160)
            if i == 0:
                set_cell_background(cell, "1E3A8A")
                for p in cell.paragraphs:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                    for run in p.runs:
                        run.font.name = 'Arial'
                        run.font.size = Pt(9.5)
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(255, 255, 255)
            else:
                if i % 2 == 1:
                    set_cell_background(cell, "F9FAFB")
                else:
                    set_cell_background(cell, "FFFFFF")
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(0)
                    for run in p.runs:
                        run.font.name = 'Arial'
                        run.font.size = Pt(9)
                        run.font.color.rgb = RGBColor(55, 65, 81)

def add_code_box(doc, text):
    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False
    table.columns[0].width = Inches(6.5)
    cell = table.cell(0, 0)
    set_cell_background(cell, "F3F4F6")
    set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
    
    tcPr = cell._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/><w:left w:val="single" w:sz="18" w:space="0" w:color="2563EB"/><w:bottom w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/><w:right w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/></w:tcBorders>')
    tcPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(0)
    run = p.add_run(text)
    run.font.name = 'Consolas'
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(31, 41, 55)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)

def build_record_doc():
    doc = Document()
    
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)
    
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Arial'
    font.size = Pt(10)
    font.color.rgb = RGBColor(55, 65, 81)
    
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(30)
    p_logo.paragraph_format.space_after = Pt(15)
    
    t_logo = doc.add_table(rows=1, cols=1)
    t_logo.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_logo = t_logo.cell(0, 0)
    c_logo.width = Inches(1.8)
    set_cell_background(c_logo, "F3F4F6")
    set_cell_margins(c_logo, top=200, bottom=200, left=100, right=100)
    p_l = c_logo.paragraphs[0]
    p_l.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_l = p_l.add_run("[ COLLEGE LOGO ]")
    r_l.bold = True
    r_l.font.size = Pt(11)
    r_l.font.color.rgb = RGBColor(107, 114, 128)
    
    p_dept = doc.add_paragraph()
    p_dept.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_dept.paragraph_format.space_before = Pt(25)
    p_dept.paragraph_format.space_after = Pt(2)
    r_d = p_dept.add_run("DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING")
    r_d.bold = True
    r_d.font.size = Pt(14)
    r_d.font.color.rgb = RGBColor(17, 24, 39)
    
    p_rec = doc.add_paragraph()
    p_rec.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_rec.paragraph_format.space_after = Pt(35)
    r_rc = p_rec.add_run("ACADEMIC PROJECT LAB RECORD")
    r_rc.bold = True
    r_rc.font.size = Pt(11)
    r_rc.font.color.rgb = RGBColor(75, 85, 99)
    
    t_title = doc.add_table(rows=1, cols=1)
    t_title.alignment = WD_TABLE_ALIGNMENT.CENTER
    c_title = t_title.cell(0, 0)
    c_title.width = Inches(6.5)
    set_cell_background(c_title, "EFF6FF")
    set_cell_margins(c_title, top=180, bottom=180, left=200, right=200)
    
    tcPr = c_title._tc.get_or_add_tcPr()
    borders = parse_xml(f'<w:tcBorders {nsdecls("w")}><w:top w:val="single" w:sz="18" w:space="0" w:color="2563EB"/><w:bottom w:val="single" w:sz="18" w:space="0" w:color="2563EB"/></w:tcBorders>')
    tcPr.append(borders)
    
    p_t1 = c_title.paragraphs[0]
    p_t1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_t1 = p_t1.add_run("PAYGATE (TRANSIQ)")
    r_t1.bold = True
    r_t1.font.size = Pt(20)
    r_t1.font.color.rgb = RGBColor(30, 58, 138)
    
    p_t2 = c_title.add_paragraph()
    p_t2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_t2.paragraph_format.space_before = Pt(4)
    r_t2 = p_t2.add_run("A Scalable Full-Stack MERN Payment Gateway & Intelligent Digital Wallet System")
    r_t2.font.size = Pt(11)
    r_t2.font.color.rgb = RGBColor(37, 99, 235)
    r_t2.bold = True
    
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(45)
    
    t_team = doc.add_table(rows=1, cols=2)
    t_team.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_team.columns[0].width = Inches(3.25)
    t_team.columns[1].width = Inches(3.25)
    
    c_left = t_team.cell(0, 0)
    p_lhead = c_left.paragraphs[0]
    r_lh = p_lhead.add_run("SUBMITTED BY (TEAM MEMBERS):")
    r_lh.bold = True
    r_lh.font.size = Pt(10.5)
    r_lh.font.color.rgb = RGBColor(17, 24, 39)
    
    team_members = [
        "1. Student Name 1 (Reg. No: ________________)",
        "2. Student Name 2 (Reg. No: ________________)",
        "3. Student Name 3 (Reg. No: ________________)",
        "4. Student Name 4 (Reg. No: ________________)",
    ]
    for mem in team_members:
        p_m = c_left.add_paragraph()
        p_m.paragraph_format.space_before = Pt(2)
        p_m.paragraph_format.space_after = Pt(2)
        r_m = p_m.add_run(mem)
        r_m.font.size = Pt(9.5)
        r_m.font.color.rgb = RGBColor(55, 65, 81)
        
    c_right = t_team.cell(0, 1)
    p_rhead = c_right.paragraphs[0]
    r_rh = p_rhead.add_run("PROJECT SUPERVISOR / GUIDE:")
    r_rh.bold = True
    r_rh.font.size = Pt(10.5)
    r_rh.font.color.rgb = RGBColor(17, 24, 39)
    
    guide_info = [
        "Prof. / Dr. ____________________________",
        "Assistant Professor, Dept of CSE",
        "College of Engineering & Technology",
        "Academic Year: 2025 - 2026",
    ]
    for g in guide_info:
        p_g = c_right.add_paragraph()
        p_g.paragraph_format.space_before = Pt(2)
        p_g.paragraph_format.space_after = Pt(2)
        r_g = p_g.add_run(g)
        r_g.font.size = Pt(9.5)
        r_g.font.color.rgb = RGBColor(55, 65, 81)
        
    p_bot = doc.add_paragraph()
    p_bot.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_bot.paragraph_format.space_before = Pt(65)
    r_b = p_bot.add_run("AFFILIATED TO ANNA UNIVERSITY / STATE TECHNICAL UNIVERSITY")
    r_b.font.size = Pt(9)
    r_b.font.color.rgb = RGBColor(107, 114, 128)
    
    doc.add_page_break()
    
    add_styled_heading(doc, "SYNOPSIS", level=1)
    
    p_syn1 = doc.add_paragraph()
    p_syn1.paragraph_format.space_after = Pt(8)
    p_syn1.paragraph_format.line_spacing = 1.15
    p_syn1.add_run(
        "The rapid acceleration of electronic commerce and digital banking requires high-throughput, secure, "
        "and fault-tolerant financial settlement platforms. PayGate (Transiq) is an enterprise-grade full-stack digital "
        "wallet and payment gateway web platform engineered on the MERN (MongoDB, Express.js, React, Node.js) technology "
        "stack. The platform facilitates end-to-end electronic fund transfers between authenticated customers, simulated "
        "commercial bank accounts, and verified beneficiaries, reinforced by automated telemetry for administrative "
        "oversight and fraud auditability."
    )
    
    add_styled_heading(doc, "Problem Definition", level=2)
    p_syn2 = doc.add_paragraph()
    p_syn2.paragraph_format.space_after = Pt(8)
    p_syn2.paragraph_format.line_spacing = 1.15
    p_syn2.add_run(
        "Traditional web payment gateways suffer from brittle state synchronization, where network interruptions "
        "lead to accidental double debits or unverified account deductions. Furthermore, the lack of centralized "
        "telemetry often causes failed transactions to drop silently without automated root-cause logging, rendering "
        "dispute reconciliation costly and slow for financial operators."
    )
    
    add_styled_heading(doc, "Proposed Solution & System Architecture", level=2)
    p_syn3 = doc.add_paragraph()
    p_syn3.paragraph_format.space_after = Pt(8)
    p_syn3.paragraph_format.line_spacing = 1.15
    p_syn3.add_run(
        "PayGate solves these architectural vulnerabilities through a modular dual-portal design:\n"
        "• Customer Portal: Empowers users with real-time wallet tracking, smart pocket goal allocations with "
        "withdrawal lock guards, beneficiary directory management, and a 4-step idempotent payment flow requiring "
        "explicit PIN authorization.\n"
        "• Operations & Audit Console (Admin): Provides banking administrators with telemetry graphs, pending settlement "
        "retries, and classified error-log investigations (e.g. INSUFFICIENT_FUNDS, BANK_TIMEOUT, FROZEN_WALLET)."
    )
    
    add_styled_heading(doc, "Technology Stack & Security", level=2)
    p_syn4 = doc.add_paragraph()
    p_syn4.paragraph_format.space_after = Pt(8)
    p_syn4.paragraph_format.line_spacing = 1.15
    p_syn4.add_run(
        "Built with React 18 (Vite SPA) and Tailwind CSS on the client, backed by Node.js/Express REST endpoints "
        "and MongoDB Mongoose schemas. Stateless JSON Web Tokens (JWT) and Bcrypt cryptographic hashing enforce zero-trust "
        "role-based access control (RBAC), intercepting unauthenticated sessions instantly at the browser boundary."
    )
    
    doc.add_page_break()
    
    add_styled_heading(doc, "OBJECTIVE", level=1)
    
    objectives = [
        ("1. Multi-Account Digital Wallet Operations", 
         "To develop a unified web platform enabling customers to store, transfer, and monitor balances across digital wallets and multiple simulated commercial bank accounts (Savings, Current, NRI)."),
        ("2. Idempotent & Deterministic Fund Transfers", 
         "To engineer a multi-step transaction pipeline that guarantees non-duplication, atomic balance decrements, and strict validation of amounts prior to committing ledger changes."),
        ("3. Micro-Savings & Smart Pocket Budgeting", 
         "To provide goal-driven sub-envelopes ('Pockets') within the customer wallet featuring dedicated deposit, withdrawal, and cryptographic locking controls to prevent impulse expenditures."),
        ("4. Zero-Trust Role-Based Authentication (RBAC)", 
         "To secure financial assets through cryptographically signed JWT sessions, bcrypt password hashing, and synchronous front-end route guards that strictly prevent unauthorized data exposure."),
        ("5. Automated Operational Telemetry & Error Auditing", 
         "To capture all transactional failures into an immutable, categorized ErrorLog collection enabling operations officers to triage system errors, investigate root causes, and resolve pending transactions."),
    ]
    
    for title, desc in objectives:
        p_obj = doc.add_paragraph()
        p_obj.paragraph_format.space_before = Pt(3)
        p_obj.paragraph_format.space_after = Pt(4)
        p_obj.paragraph_format.line_spacing = 1.15
        r_ot = p_obj.add_run(title + ": ")
        r_ot.bold = True
        r_ot.font.color.rgb = RGBColor(17, 24, 39)
        p_obj.add_run(desc)
        
    add_styled_heading(doc, "SCOPE", level=1)
    
    add_styled_heading(doc, "1. Functional Scope", level=2)
    p_fscope = doc.add_paragraph()
    p_fscope.paragraph_format.space_after = Pt(6)
    p_fscope.paragraph_format.line_spacing = 1.15
    p_fscope.add_run(
        "• Identity & Access: User onboarding with client-side and server-side regex validation, JWT-based login, role segregation (Customer vs Admin), and secure session revocation.\n"
        "• Wallet & Pocket Management: Liquid balance viewing, goal creation, progress tracking, and lock/unlock toggle operations.\n"
        "• Beneficiary Maintenance: CRUD management of transfer payees with IFSC validation, account format checks, and fast-transfer starring.\n"
        "• Transaction Initiation: 4-stage transfer wizard supporting Wallet, IMPS, NEFT, and RTGS with mandatory PIN authorization.\n"
        "• Administrative Telemetry: System health overview, error logs with severity categorization, and pending transaction monitoring."
    )
    
    add_styled_heading(doc, "2. Technical Scope", level=2)
    p_tscope = doc.add_paragraph()
    p_tscope.paragraph_format.space_after = Pt(6)
    p_tscope.paragraph_format.line_spacing = 1.15
    p_tscope.add_run(
        "• Single-Page Client Application (SPA) powered by React 18, Vite, and Zustand centralized state stores.\n"
        "• Asynchronous Express.js RESTful API architecture running on Node.js runtime.\n"
        "• Document-oriented persistence layer powered by MongoDB and Mongoose Object Data Modeling (ODM).\n"
        "• Fully responsive Tailwind CSS layout compatible across mobile, tablet, and desktop viewports."
    )
    
    add_styled_heading(doc, "3. Out-of-Scope (Future Enhancements)", level=2)
    p_oscope = doc.add_paragraph()
    p_oscope.paragraph_format.space_after = Pt(8)
    p_oscope.paragraph_format.line_spacing = 1.15
    p_oscope.add_run(
        "• Real physical POS hardware terminal integration.\n"
        "• Cross-border international SWIFT wire transfers (settlement currently simulated in INR).\n"
        "• Direct banking core integration via live Reserve Bank of India (RBI) webhooks."
    )
    
    add_styled_heading(doc, "PROJECT DESCRIPTION", level=1)
    
    p_pdesc = doc.add_paragraph()
    p_pdesc.paragraph_format.space_after = Pt(8)
    p_pdesc.paragraph_format.line_spacing = 1.15
    p_pdesc.add_run(
        "PayGate (Transiq) is architected around a decoupled three-tier enterprise web application model designed to "
        "deliver optimal scalability, security, and developer modularity.\n\n"
        "1. Presentation Tier (React + Vite Client):\n"
        "The frontend is decomposed into functional modules (01-Customer, 02-Recipients, 03-Initiation, 04-Transactions, "
        "05-Security, 06-Logs). Navigation is governed by a unified AppLayout protected by zero-delay synchronous auth guards. "
        "If a client attempts to view protected routes without a valid JWT token, the application immediately routes them "
        "to the login view, preventing component flashing or blank render states.\n\n"
        "2. Application Service Tier (Node.js & Express API):\n"
        "The server layer provides versioned RESTful endpoints (/api/auth, /api/customers, /api/wallets, /api/pockets, "
        "/api/receipts, /api/payments, /api/logs). Middlewares intercept inbound traffic to perform CORS resolution, request "
        "body sanitization, and cryptographic token verification. Business controllers enforce atomic balance checking, ensuring "
        "wallets cannot be overdrawn or accessed while flagged as frozen.\n\n"
        "3. Data Persistence Tier (MongoDB):\n"
        "Data is persisted across collections with strict validation rules. Mongoose schemas maintain relationships via "
        "ObjectId references while guaranteeing fast indexed queries on transaction reference codes and user identity IDs."
    )
    
    add_styled_heading(doc, "DB DESIGN", level=1)
    
    p_dbdesc = doc.add_paragraph()
    p_dbdesc.paragraph_format.space_after = Pt(8)
    p_dbdesc.add_run(
        "The PayGate database architecture consists of seven structured collections implemented in MongoDB. "
        "The schemas and constraint specifications are detailed below:"
    )
    
    add_styled_heading(doc, "1. Users Collection ('users')", level=2)
    t_users = doc.add_table(rows=10, cols=4)
    t_users.columns[0].width = Inches(1.3)
    t_users.columns[1].width = Inches(1.1)
    t_users.columns[2].width = Inches(1.8)
    t_users.columns[3].width = Inches(2.3)
    
    users_data = [
        ("Field Name", "Data Type", "Constraints / Default", "Description"),
        ("_id", "ObjectId", "Primary Key, Auto", "Unique user identification key"),
        ("firstName", "String", "Required, Trim", "First name of customer/admin"),
        ("lastName", "String", "Required, Trim", "Last name of customer/admin"),
        ("email", "String", "Required, Unique, Lowercase", "User login email address"),
        ("password", "String", "Required, Bcrypt Hash", "Cryptographically hashed password"),
        ("phone", "String", "Optional, Regex Validated", "10-digit mobile contact number"),
        ("role", "String", "Enum: ['customer', 'admin']", "System authorization privilege role"),
        ("isActive", "Boolean", "Default: true", "Account active/freeze status"),
        ("createdAt", "Date", "Auto Timestamp", "Account creation timestamp"),
    ]
    for r_idx, row in enumerate(users_data):
        for c_idx, val in enumerate(row):
            t_users.cell(r_idx, c_idx).paragraphs[0].text = val
    format_table(t_users)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    
    add_styled_heading(doc, "2. Wallets Collection ('wallets')", level=2)
    t_wallets = doc.add_table(rows=7, cols=4)
    t_wallets.columns[0].width = Inches(1.3)
    t_wallets.columns[1].width = Inches(1.1)
    t_wallets.columns[2].width = Inches(1.8)
    t_wallets.columns[3].width = Inches(2.3)
    
    wallets_data = [
        ("Field Name", "Data Type", "Constraints / Default", "Description"),
        ("_id", "ObjectId", "Primary Key, Auto", "Unique wallet primary identifier"),
        ("userId", "ObjectId", "Required, Ref: 'User', Index", "Foreign reference to user owner"),
        ("mainBalance", "Number", "Required, Min: 0, Def: 0", "Current available liquid balance (INR)"),
        ("currency", "String", "Default: 'INR'", "Standard ISO currency denomination"),
        ("isFrozen", "Boolean", "Default: false", "Administrative security lock status"),
        ("createdAt", "Date", "Auto Timestamp", "Wallet creation date"),
    ]
    for r_idx, row in enumerate(wallets_data):
        for c_idx, val in enumerate(row):
            t_wallets.cell(r_idx, c_idx).paragraphs[0].text = val
    format_table(t_wallets)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    
    add_styled_heading(doc, "3. Pockets Collection ('pockets')", level=2)
    t_pockets = doc.add_table(rows=8, cols=4)
    t_pockets.columns[0].width = Inches(1.3)
    t_pockets.columns[1].width = Inches(1.1)
    t_pockets.columns[2].width = Inches(1.8)
    t_pockets.columns[3].width = Inches(2.3)
    
    pockets_data = [
        ("Field Name", "Data Type", "Constraints / Default", "Description"),
        ("_id", "ObjectId", "Primary Key, Auto", "Unique pocket savings envelope ID"),
        ("userId", "ObjectId", "Required, Ref: 'User'", "Foreign reference to customer owner"),
        ("name", "String", "Required, Trim", "Goal title (e.g. 'Vacation', 'Emergency')"),
        ("targetAmount", "Number", "Required, Min: 1", "Target milestone amount (INR)"),
        ("currentAmount", "Number", "Min: 0, Default: 0", "Accumulated locked savings"),
        ("isLocked", "Boolean", "Default: false", "Lock flag preventing impulsive withdrawal"),
        ("createdAt", "Date", "Auto Timestamp", "Pocket initialization timestamp"),
    ]
    for r_idx, row in enumerate(pockets_data):
        for c_idx, val in enumerate(row):
            t_pockets.cell(r_idx, c_idx).paragraphs[0].text = val
    format_table(t_pockets)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    
    add_styled_heading(doc, "4. Receipts Collection ('receipts')", level=2)
    t_receipts = doc.add_table(rows=9, cols=4)
    t_receipts.columns[0].width = Inches(1.3)
    t_receipts.columns[1].width = Inches(1.1)
    t_receipts.columns[2].width = Inches(1.8)
    t_receipts.columns[3].width = Inches(2.3)
    
    receipts_data = [
        ("Field Name", "Data Type", "Constraints / Default", "Description"),
        ("_id", "ObjectId", "Primary Key, Auto", "Unique beneficiary identification key"),
        ("userId", "ObjectId", "Required, Ref: 'User'", "Foreign reference to creator"),
        ("name", "String", "Required, Trim", "Beneficiary legal registered name"),
        ("accountNumber", "String", "Required, MinLength: 9", "Recipient destination bank account number"),
        ("ifscCode", "String", "Required, Uppercase", "Indian Financial System Code (11-chars)"),
        ("bankName", "String", "Required, Trim", "Bank institutional designation"),
        ("accountType", "String", "Enum: ['savings','current','nri']", "Account categorization"),
        ("isFavorite", "Boolean", "Default: false", "Starred priority transfer flag"),
    ]
    for r_idx, row in enumerate(receipts_data):
        for c_idx, val in enumerate(row):
            t_receipts.cell(r_idx, c_idx).paragraphs[0].text = val
    format_table(t_receipts)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    
    add_styled_heading(doc, "5. Transactions Collection ('transactions')", level=2)
    t_txns = doc.add_table(rows=11, cols=4)
    t_txns.columns[0].width = Inches(1.3)
    t_txns.columns[1].width = Inches(1.1)
    t_txns.columns[2].width = Inches(1.8)
    t_txns.columns[3].width = Inches(2.3)
    
    txns_data = [
        ("Field Name", "Data Type", "Constraints / Default", "Description"),
        ("_id", "ObjectId", "Primary Key, Auto", "Unique immutable ledger record ID"),
        ("referenceCode", "String", "Required, Unique, Index", "Format: TXN-<timestamp>-<UUID>"),
        ("senderWalletId", "ObjectId", "Ref: 'Wallet', Nullable", "Source wallet reference key"),
        ("recipientId", "ObjectId", "Required, Ref: 'Receipt'", "Destination beneficiary reference key"),
        ("amount", "Number", "Required, Min: 0.01", "Debited transaction sum (INR)"),
        ("method", "String", "Enum: ['WALLET','IMPS','NEFT','RTGS']", "Selected transfer settlement rail"),
        ("status", "String", "Enum: ['pending','success','failure','cancelled']", "Execution status state"),
        ("description", "String", "Default: 'Funds Transfer'", "Transfer purpose notes"),
        ("failureReason", "String", "Optional", "Detailed root cause on failure"),
        ("createdAt", "Date", "Auto Timestamp, Index", "Execution ledger timestamp"),
    ]
    for r_idx, row in enumerate(txns_data):
        for c_idx, val in enumerate(row):
            t_txns.cell(r_idx, c_idx).paragraphs[0].text = val
    format_table(t_txns)
    doc.add_paragraph().paragraph_format.space_after = Pt(6)
    
    add_styled_heading(doc, "6. ErrorLogs Collection ('errorlogs')", level=2)
    t_errs = doc.add_table(rows=8, cols=4)
    t_errs.columns[0].width = Inches(1.3)
    t_errs.columns[1].width = Inches(1.1)
    t_errs.columns[2].width = Inches(1.8)
    t_errs.columns[3].width = Inches(2.3)
    
    errs_data = [
        ("Field Name", "Data Type", "Constraints / Default", "Description"),
        ("_id", "ObjectId", "Primary Key, Auto", "Unique telemetry incident ID"),
        ("transactionId", "ObjectId", "Required, Ref: 'Transaction'", "Associated transaction document"),
        ("errorCode", "String", "Required (e.g. 'INSUFFICIENT_FUNDS')", "Standardized failure code"),
        ("severity", "String", "Enum: ['LOW','MEDIUM','HIGH','CRITICAL']", "Severity triage classification"),
        ("message", "String", "Required", "Descriptive technical error log"),
        ("resolved", "Boolean", "Default: false", "Administrative resolution marker"),
        ("createdAt", "Date", "Auto Timestamp", "Incident capture timestamp"),
    ]
    for r_idx, row in enumerate(errs_data):
        for c_idx, val in enumerate(row):
            t_errs.cell(r_idx, c_idx).paragraphs[0].text = val
    format_table(t_errs)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)
    
    add_styled_heading(doc, "DATA FLOW DIAGRAM (DFD)", level=1)
    
    add_styled_heading(doc, "Level 0 DFD (Context Analysis Diagram)", level=2)
    p_dfd0 = doc.add_paragraph()
    p_dfd0.paragraph_format.space_after = Pt(6)
    p_dfd0.add_run(
        "The Level 0 context diagram abstracts the entire PayGate platform as a single operational process, "
        "delineating the information boundaries and data flows with external entities (Customer, System Administrator, "
        "and Banking Settlement Gateway)."
    )
    
    dfd0_text = (
        "                    [ Customer / User ]\n"
        "                     |              ^\n"
        "  Credentials, Fund  |              | Dashboard Data, Receipts,\n"
        "  Transfers, Payees  v              | Transaction Alerts\n"
        "             +------------------------------+\n"
        "             |     (0.0) PAYGATE SYSTEM     |\n"
        "             +------------------------------+\n"
        "               |         ^          |      ^\n"
        "  System Logs, |         | Triage & |      | Settlement Status,\n"
        "  Telemetry    v         | Settings v      | Account Balances\n"
        "           [ System Admin ]      [ Banking Gateway ]"
    )
    add_code_box(doc, dfd0_text)
    
    add_styled_heading(doc, "Level 1 DFD (Decomposed Subsystem Architecture)", level=2)
    p_dfd1 = doc.add_paragraph()
    p_dfd1.paragraph_format.space_after = Pt(6)
    p_dfd1.add_run(
        "The Level 1 diagram decomposes the application into its primary functional modules: 1.0 Authentication, "
        "2.0 Wallet & Pocket Management, 3.0 Beneficiary Maintenance, 4.0 Payment Initiation & PIN Authorization, "
        "and 5.0 Audit Telemetry Logging."
    )
    
    dfd1_text = (
        "  [ Customer ] ---> (1.0 Auth) <---> [D1: Users Store]\n"
        "        |              |\n"
        "        |              +---> (JWT Bearer Token issued)\n"
        "        |\n"
        "        +---------> (2.0 Wallet & Pockets) <---> [D2: Wallets Store]\n"
        "        |\n"
        "        +---------> (3.0 Beneficiary Mgmt) <---> [D3: Receipts Store]\n"
        "        |\n"
        "        +---------> (4.0 Payment Initiation & PIN Auth)\n"
        "                          |          |\n"
        "     Deduct Liquid Funds  |          | Validate Recipient\n"
        "     [D2: Wallets Store] <+          +> [D3: Receipts Store]\n"
        "                          |\n"
        "            Commit Ledger +--------> [D4: Transactions Ledger]\n"
        "                          |\n"
        "            On Failure    v\n"
        "                    (5.0 Telemetry Log) ---> [D5: ErrorLogs Store]\n"
        "                                                   ^\n"
        "  [ System Admin ] <---- Audit Queries ------------+"
    )
    add_code_box(doc, dfd1_text)
    
    add_styled_heading(doc, "ER DIAGRAM", level=1)
    
    p_er = doc.add_paragraph()
    p_er.paragraph_format.space_after = Pt(6)
    p_er.add_run(
        "The Entity-Relationship diagram maps out relational cardinalities and document association links "
        "across the data tier. Users own wallets, link accounts, allocate pocket envelopes, and record beneficiaries. "
        "Transactions record ledger commitments and spawn automated error telemetry upon operational disruption."
    )
    
    er_text = (
        "+--------------+          1:1          +--------------+\n"
        "|     USER     |-----------------------|    WALLET    |\n"
        "+--------------+                       +--------------+\n"
        "| _id (PK)     |                              | 1:N\n"
        "| firstName    | 1:N                          v\n"
        "| email        |-------+              +----------------+\n"
        "| password     |       |              |  TRANSACTION   |\n"
        "| role         |       |              +----------------+\n"
        "+--------------+       |              | _id (PK)       |\n"
        "  | 1:N                |              | referenceCode  |\n"
        "  v                    v              | amount         |\n"
        "+--------------+  +--------------+    | method         |\n"
        "|    POCKET    |  |   RECEIPT    |--->| status         |\n"
        "+--------------+  +--------------+1:N +----------------+\n"
        "| _id (PK)     |  | _id (PK)     |            | 1:1\n"
        "| name         |  | name         |            v\n"
        "| targetAmount |  | accountNum   |    +----------------+\n"
        "| currentAmount|  | ifscCode     |    |   ERROR_LOG    |\n"
        "| isLocked     |  | bankName     |    +----------------+\n"
        "+--------------+  +--------------+    | _id (PK)       |\n"
        "                                      | errorCode      |\n"
        "                                      | severity       |\n"
        "                                      | resolved       |\n"
        "                                      +----------------+"
    )
    add_code_box(doc, er_text)
    
    add_styled_heading(doc, "USE CASE DIAGRAM", level=1)
    
    p_uc = doc.add_paragraph()
    p_uc.paragraph_format.space_after = Pt(6)
    p_uc.add_run(
        "The Use Case diagram specifies system boundary interactions for the two operational actors: "
        "the Customer (performing funds transfers and budgeting) and the Administrator (overseeing telemetry and audit logs)."
    )
    
    uc_text = (
        "  ACTORS:                       SYSTEM USE CASES:\n\n"
        "  (Customer) -----------------> [ UC-01: Register & Authenticate ]\n"
        "     |   |  ------------------> [ UC-02: View Liquid Wallet Balance ]\n"
        "     |   +--------------------> [ UC-03: Create & Lock Smart Pocket ]\n"
        "     |   +--------------------> [ UC-04: Add & Manage Beneficiaries ]\n"
        "     |   +--------------------> [ UC-05: Configure Payment Details ]\n"
        "     |   +--------------------> [ UC-06: Enter PIN Authorization ]\n"
        "     |   +--------------------> [ UC-07: Download Digital Receipt ]\n"
        "     +------------------------> [ UC-08: Filter Transaction History ]\n\n"
        "  (Admin)    -----------------> [ UC-09: Authenticate via Admin Portal ]\n"
        "     |   |  ------------------> [ UC-10: Review Global Settlement Metrics ]\n"
        "     |   +--------------------> [ UC-11: Inspect High-Severity Error Logs ]\n"
        "     |   +--------------------> [ UC-12: Resolve Pending Transactions ]\n"
        "     +------------------------> [ UC-13: Manage System Configurations ]"
    )
    add_code_box(doc, uc_text)
    
    add_styled_heading(doc, "CLASS DIAGRAM", level=1)
    
    p_cd = doc.add_paragraph()
    p_cd.paragraph_format.space_after = Pt(6)
    p_cd.add_run(
        "The Class diagram details the structural Object-Oriented representations of schemas, controllers, "
        "and client stores governing the software lifecycle."
    )
    
    cd_text = (
        "+-----------------------------+       +-----------------------------+\n"
        "|            User             |       |           Wallet            |\n"
        "+-----------------------------+       +-----------------------------+\n"
        "| - _id: ObjectId             |       | - _id: ObjectId             |\n"
        "| - firstName: String         |       | - userId: ObjectId          |\n"
        "| - email: String             | 1   1 | - mainBalance: Number       |\n"
        "| - password: String          |------>| - currency: String          |\n"
        "| - role: String              |       | - isFrozen: Boolean         |\n"
        "+-----------------------------+       +-----------------------------+\n"
        "| + matchPassword(pwd): Bool  |       | + deduct(amount): Boolean   |\n"
        "| + generateJWT(): String     |       | + credit(amount): void      |\n"
        "+-----------------------------+       +-----------------------------+\n"
        "               | 1                                   | 1\n"
        "               | *                                   | *\n"
        "               v                                     v\n"
        "+-----------------------------+       +-----------------------------+\n"
        "|           Pocket            |       |         Transaction         |\n"
        "+-----------------------------+       +-----------------------------+\n"
        "| - _id: ObjectId             |       | - referenceCode: String     |\n"
        "| - name: String              |       | - senderWalletId: ObjectId  |\n"
        "| - targetAmount: Number      |       | - recipientId: ObjectId     |\n"
        "| - currentAmount: Number     |       | - amount: Number            |\n"
        "| - isLocked: Boolean         |       | - status: String            |\n"
        "+-----------------------------+       +-----------------------------+\n"
        "| + deposit(val): void        |       | + execute(): Boolean        |\n"
        "| + toggleLock(): void        |       | + logFailure(reason): void  |\n"
        "+-----------------------------+       +-----------------------------+"
    )
    add_code_box(doc, cd_text)
    
    add_styled_heading(doc, "SEQUENCE DIAGRAM", level=1)
    
    p_seq = doc.add_paragraph()
    p_seq.paragraph_format.space_after = Pt(6)
    p_seq.add_run(
        "The Sequence diagram chronicles the exact temporal order of message passing during the execution "
        "of a secure funds transfer workflow, incorporating PIN verification, balance deduction, and error escalation."
    )
    
    seq_text = (
        "Customer     React UI       AuthMiddleware   PaymentController   WalletModel   TxnModel\n"
        "   |            |                 |                  |                |           |\n"
        "   |-- Initiate |                 |                  |                |           |\n"
        "   |   Transfer>|                 |                  |                |           |\n"
        "   |            |-- Submit PIN -->|                  |                |           |\n"
        "   |            |   (Bearer Token)|-- Verify JWT --->|                |           |\n"
        "   |            |                 |   (Success)      |-- Query Bal -->|           |\n"
        "   |            |                 |                  |<- Return Bal --|           |\n"
        "   |            |                 |                  |                |           |\n"
        "   |            |                 |                  |-- If Valid:    |           |\n"
        "   |            |                 |                  |   Deduct Sum ->|           |\n"
        "   |            |                 |                  |-- Create Txn ------------->|\n"
        "   |            |                 |                  |<- Return TXN Reference ----|\n"
        "   |            |<- 200 OK + TXN Reference ----------|                |           |\n"
        "   |<- Display -|                 |                  |                |           |\n"
        "   |   Receipt  |                 |                  |                |           |"
    )
    add_code_box(doc, seq_text)
    
    add_styled_heading(doc, "SCREENSHOTS (FORMS)", level=1)
    
    p_sc = doc.add_paragraph()
    p_sc.paragraph_format.space_after = Pt(6)
    p_sc.add_run(
        "The visual forms and UI modules of PayGate (Transiq) are presented below with layout specifications:"
    )
    
    add_styled_heading(doc, "Form 1: Customer Authentication & Registration (/login)", level=2)
    sc1_text = (
        "+--------------------------------------------------------------------------+\n"
        "|                              PAYGATE (TRANSIQ)                           |\n"
        "|                       [ Shield Icon ] Customer Sign In                   |\n"
        "|       Sign in to access your wallet, pockets, and transaction history    |\n"
        "+--------------------------------------------------------------------------+\n"
        "|  Email Address                                                           |\n"
        "|  [ arjun@paygate.com                                                  ]  |\n"
        "|                                                                          |\n"
        "|  Password                                                                |\n"
        "|  [ ************                                                     O ]  |\n"
        "|                                                                          |\n"
        "|  [                     Sign In  ->                                    ]  |\n"
        "|                                                                          |\n"
        "|  Don't have an account? Create an account                                |\n"
        "+--------------------------------------------------------------------------+"
    )
    add_code_box(doc, sc1_text)
    
    add_styled_heading(doc, "Form 2: Customer Financial Dashboard & Smart Pockets (/)", level=2)
    sc2_text = (
        "+--------------------------------------------------------------------------+\n"
        "| [PayGate Logo]  Dashboard | My Wallet | Pockets | Recipients | Send Money|\n"
        "+--------------------------------------------------------------------------+\n"
        "|  Welcome back, Arjun Mehta!                         Total Balance        |\n"
        "|  Account Status: Active                             ₹ 45,000.00          |\n"
        "+--------------------------------------------------------------------------+\n"
        "|  SMART POCKETS (MICRO-BUDGETING)                     [ + New Pocket ]    |\n"
        "|  +---------------------------+   +------------------------------------+  |\n"
        "|  | Vacation Goal             |   | Emergency Cushion                  |  |\n"
        "|  | ₹ 12,000.00 / ₹ 20,000.00 |   | ₹ 15,000.00 / ₹ 15,000.00 [LOCKED] |  |\n"
        "|  | [Deposit]  [Withdraw]     |   | [Deposit]  [Unlock]                |  |\n"
        "|  +---------------------------+   +------------------------------------+  |\n"
        "+--------------------------------------------------------------------------+\n"
        "|  RECENT TRANSACTIONS                                                     |\n"
        "|  * Priya Sharma      - ₹ 2,500.00     IMPS     SUCCESS     TXN-171829101 |\n"
        "|  * Ramesh Kumar      - ₹ 1,200.00     WALLET   SUCCESS     TXN-171829094 |\n"
        "+--------------------------------------------------------------------------+"
    )
    add_code_box(doc, sc2_text)
    
    add_styled_heading(doc, "Form 3: Beneficiary Management & Directory (/recipients)", level=2)
    sc3_text = (
        "+--------------------------------------------------------------------------+\n"
        "|  BENEFICIARY MANAGEMENT                              [ + Add Recipient ] |\n"
        "|  Saved Contacts (4 contacts registered)                                  |\n"
        "+--------------------------------------------------------------------------+\n"
        "|  [ Search by name, bank, or account...      ]  Filter: [ All Types  v ]  |\n"
        "+--------------------------------------------------------------------------+\n"
        "|  +---------------------------+   +------------------------------------+  |\n"
        "|  | [P] Priya Sharma   [Star] |   | [R] Ramesh Patel            [Star] |  |\n"
        "|  | Bank: HDFC Bank           |   | Bank: State Bank of India          |  |\n"
        "|  | A/C: 50100412345678       |   | A/C: 2018849201920                 |  |\n"
        "|  | IFSC: HDFC0001234         |   | IFSC: SBIN0004921                  |  |\n"
        "|  | [ Edit ]    [ Remove ]    |   | [ Edit ]    [ Remove ]             |  |\n"
        "|  +---------------------------+   +------------------------------------+  |\n"
        "+--------------------------------------------------------------------------+"
    )
    add_code_box(doc, sc3_text)
    
    add_styled_heading(doc, "Form 4: 4-Step Payment Checkout Wizard (/send-money)", level=2)
    sc4_text = (
        "+--------------------------------------------------------------------------+\n"
        "|  INITIATE PAYMENT                                                        |\n"
        "|  [ (1) Recipient ] ---> [ (2) Transfer Info ] ---> [ (3) Review & PIN ]  |\n"
        "+--------------------------------------------------------------------------+\n"
        "|  Step 3: Security Verification                                           |\n"
        "|  Transferring: ₹ 5,000.00 to Priya Sharma (HDFC Bank)                    |\n"
        "|  Channel: IMPS Instant Transfer                                          |\n"
        "|                                                                          |\n"
        "|  Enter 4-Digit Security PIN:                                             |\n"
        "|  [  *  |  *  |  *  |  *  ]                                               |\n"
        "|                                                                          |\n"
        "|  [ Cancel ]                                 [ Authorize Transfer  -> ]   |\n"
        "+--------------------------------------------------------------------------+"
    )
    add_code_box(doc, sc4_text)
    
    add_styled_heading(doc, "Form 5: Admin Operations & Telemetry Console (/admin/monitoring)", level=2)
    sc5_text = (
        "+--------------------------------------------------------------------------+\n"
        "|  ADMIN OPERATIONS CONSOLE                                                |\n"
        "|  Telemetry: Live (Active)  |  Success Rate: 98.4%  | Errors Logged: 1    |\n"
        "+--------------------------------------------------------------------------+\n"
        "|  HIGH SEVERITY ERROR TELEMETRY                                           |\n"
        "|  +--------------------------------------------------------------------+  |\n"
        "|  | Incident: ERR-9281  | Severity: HIGH | Code: INSUFFICIENT_FUNDS    |  |\n"
        "|  | Affected Txn: TXN-171829011 | Wallet ID: 66491a21e4                |  |\n"
        "|  | Message: Debit failed. Requested ₹50,000 exceeding balance ₹10,000 |  |\n"
        "|  | Status: [ Unresolved ]                          [ Mark Resolved ]  |  |\n"
        "|  +--------------------------------------------------------------------+  |\n"
        "+--------------------------------------------------------------------------+"
    )
    add_code_box(doc, sc5_text)
    
    add_styled_heading(doc, "TEST REPORT", level=1)
    
    p_tr = doc.add_paragraph()
    p_tr.paragraph_format.space_after = Pt(6)
    p_tr.add_run(
        "Automated regression testing was executed via Jest test runners verifying API contracts, "
        "cryptographic hashing integrity, authentication barriers, and atomic deductions."
    )
    
    test_exec_output = (
        "> transiq-api@1.0.0 test\n"
        "> node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage\n\n"
        "PASS tests/api.test.js\n"
        "  ✓ Health Check endpoint returns status 200 (42 ms)\n"
        "  ✓ User Registration enforces customer role (68 ms)\n"
        "  ✓ Duplicate registration returns 400 error (35 ms)\n"
        "  ✓ Payment Authorization validates required PIN (54 ms)\n"
        "PASS tests/math.test.js\n"
        "  ✓ Currency formatting handles zero and floating numbers (12 ms)\n\n"
        "Test Suites: 2 passed, 2 total\n"
        "Tests:       5 passed, 5 total\n"
        "Snapshots:   0 total\n"
        "Time:        0.588 s\n"
        "Ran all test suites."
    )
    add_code_box(doc, test_exec_output)
    
    add_styled_heading(doc, "Detailed Test Case Specifications", level=2)
    t_cases = doc.add_table(rows=7, cols=6)
    t_cases.columns[0].width = Inches(1.1)
    t_cases.columns[1].width = Inches(1.3)
    t_cases.columns[2].width = Inches(1.1)
    t_cases.columns[3].width = Inches(1.1)
    t_cases.columns[4].width = Inches(1.1)
    t_cases.columns[5].width = Inches(0.8)
    
    cases_data = [
        ("Test ID", "Test Objective", "Input Parameter", "Expected Result", "Actual Result", "Status"),
        ("TC-AUTH-01", "Unauthenticated guard", "GET / without token", "Redirect to /login (0ms)", "Redirected to /login", "PASS"),
        ("TC-AUTH-02", "Role tampering defense", "{ role: 'admin' }", "Forced to 'customer'", "Role set to customer", "PASS"),
        ("TC-PAY-01", "Valid payment PIN", "PIN: '1234', ₹500", "Balance decremented, TXN created", "Balance deducted, OK", "PASS"),
        ("TC-PAY-02", "Overdraft prevention", "Amount ₹1,00,000", "400 Insufficient funds", "400 returned, Logged", "PASS"),
        ("TC-PAY-03", "Frozen wallet block", "isFrozen: true", "403 Wallet frozen error", "403 returned, Blocked", "PASS"),
        ("TC-LOGS-01", "Telemetry on failure", "Failed debit txn", "ErrorLog document recorded", "ErrorLog verified", "PASS"),
    ]
    for r_idx, row in enumerate(cases_data):
        for c_idx, val in enumerate(row):
            t_cases.cell(r_idx, c_idx).paragraphs[0].text = val
    format_table(t_cases)
    doc.add_paragraph().paragraph_format.space_after = Pt(8)
    
    add_styled_heading(doc, "CONCLUSION AND FURTHER ENHANCEMENTS", level=1)
    
    add_styled_heading(doc, "Conclusion", level=2)
    p_conc = doc.add_paragraph()
    p_conc.paragraph_format.space_after = Pt(8)
    p_conc.paragraph_format.line_spacing = 1.15
    p_conc.add_run(
        "The PayGate (Transiq) platform successfully realizes a resilient, enterprise-ready digital wallet "
        "and payment management system built entirely on the MERN stack. By integrating strict zero-trust routing "
        "guards at the client level with atomic ledger decrements and automated telemetry capture on the server side, "
        "the application resolves traditional payment gateway weaknesses such as silent failures, duplicate submissions, "
        "and state desynchronization. The solution satisfies rigorous academic software engineering criteria across system "
        "architecture, database design, modular testing, and operational telemetry."
    )
    
    add_styled_heading(doc, "Further Enhancements", level=2)
    enhancements = [
        ("1. Real-Time WebSocket Telemetry", 
         "Integrate Socket.io or WebSockets to broadcast immediate payment settlement events and administrative telemetry alerts without relying on client polling."),
        ("2. Biometric & FIDO2 Authentication", 
         "Expand security mechanisms to incorporate WebAuthn biometric touch-ID / face-ID login and SMS/Email Time-based One-Time Passwords (TOTP)."),
        ("3. Machine Learning Fraud Detection", 
         "Implement an AI-driven anomaly detection model evaluating transaction speed, geographic IP deviations, and spending habits to assign real-time risk scores prior to authorization."),
        ("4. Cross-Border Forex Settlements", 
         "Incorporate live foreign exchange conversion APIs supporting multi-currency wallets and SWIFT message serialization."),
    ]
    for e_title, e_desc in enhancements:
        p_en = doc.add_paragraph()
        p_en.paragraph_format.space_before = Pt(3)
        p_en.paragraph_format.space_after = Pt(4)
        p_en.paragraph_format.line_spacing = 1.15
        r_et = p_en.add_run(e_title + ": ")
        r_et.bold = True
        r_et.font.color.rgb = RGBColor(17, 24, 39)
        p_en.add_run(e_desc)
        
    doc.save("D:/Clg/python lab/MERN PROJECT/PROJECT_RECORD.docx")
    print("SUCCESS: Document generated at D:/Clg/python lab/MERN PROJECT/PROJECT_RECORD.docx")

if __name__ == "__main__":
    build_record_doc()

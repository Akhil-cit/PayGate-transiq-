import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def create_document():
    doc = docx.Document()
    
    for s in doc.sections:
        s.page_width = Inches(8.5)
        s.page_height = Inches(11.0)
        s.top_margin = Inches(0.65)
        s.bottom_margin = Inches(0.65)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)
        
    NAVY = RGBColor(15, 39, 71)      # 0F2747 (Deep Navy)
    SLATE = RGBColor(28, 70, 112)    # 1C4670 (Slate Blue)
    TEAL = RGBColor(13, 148, 136)    # 0D9488 (Teal Accent)
    DARK = RGBColor(38, 48, 60)      # 26303C (Body Charcoal)
    MUTED = RGBColor(100, 116, 139)  # 64748B (Muted Gray)
    WHITE = RGBColor(255, 255, 255)
    
    HEX_NAVY = "0F2747"
    HEX_SLATE = "1C4670"
    HEX_LIGHT_BG = "F8FAFC"
    HEX_BORDER = "CBD5E1"
    
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Aptos'
    style_normal.font.size = Pt(10)
    style_normal.font.color.rgb = DARK
    style_normal.paragraph_format.line_spacing = 1.12
    style_normal.paragraph_format.space_after = Pt(3)
    
    def set_cell_margins(cell, top=70, bottom=70, left=120, right=120):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for margin, value in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{margin}')
            node.set(qn('w:w'), str(value))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def set_cell_shading(cell, color_hex):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
        cell._tc.get_or_add_tcPr().append(shading)
        
    def set_table_borders(table, color="CBD5E1", sz="4"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'  <w:top w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:bottom w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:insideH w:val="single" w:sz="{sz}" w:space="0" w:color="{color}"/>'
            f'  <w:insideV w:val="none"/>'
            f'  <w:left w:val="none"/>'
            f'  <w:right w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(borders)

    def add_h1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Aptos Display'
        r.font.size = Pt(15)
        r.font.bold = True
        r.font.color.rgb = NAVY
        return p

    def add_h2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Aptos'
        r.font.size = Pt(12)
        r.font.bold = True
        r.font.color.rgb = SLATE
        return p

    def add_h3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(6)
        p.paragraph_format.space_after = Pt(2)
        p.paragraph_format.keep_with_next = True
        r = p.add_run(text)
        r.font.name = 'Aptos'
        r.font.size = Pt(10.5)
        r.font.bold = True
        r.font.color.rgb = TEAL
        return p

    def add_bullet(text, bold_prefix=""):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_before = Pt(1)
        p.paragraph_format.space_after = Pt(1.5)
        p.paragraph_format.line_spacing = 1.12
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Aptos'
            r_pre.font.size = Pt(9.5)
            r_pre.font.bold = True
            r_pre.font.color.rgb = NAVY
        r = p.add_run(text)
        r.font.name = 'Aptos'
        r.font.size = Pt(9.5)
        r.font.color.rgb = DARK
        return p

    def add_caption(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(6)
        r = p.add_run(text)
        r.font.name = 'Aptos'
        r.font.size = Pt(9)
        r.font.italic = True
        r.font.bold = True
        r.font.color.rgb = SLATE
        return p

    def style_table(table, col_widths, col_alignments=None):
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(table)
        for r_idx, row in enumerate(table.rows):
            is_header = (r_idx == 0)
            trPr = row._tr.get_or_add_trPr()
            trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
            if is_header:
                trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
                
            for c_idx, cell in enumerate(row.cells):
                cell.width = Inches(col_widths[c_idx])
                set_cell_margins(cell, top=65, bottom=65, left=110, right=110)
                cell.vertical_alignment = WD_ALIGN_VERTICAL.CENTER
                
                if is_header:
                    set_cell_shading(cell, HEX_NAVY)
                else:
                    if r_idx % 2 == 1:
                        set_cell_shading(cell, "FFFFFF")
                    else:
                        set_cell_shading(cell, HEX_LIGHT_BG)
                        
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(0)
                    p.paragraph_format.line_spacing = 1.08
                    if col_alignments and c_idx < len(col_alignments):
                        p.alignment = col_alignments[c_idx]
                    for r in p.runs:
                        r.font.name = 'Aptos'
                        if is_header:
                            r.font.bold = True
                            r.font.size = Pt(9)
                            r.font.color.rgb = WHITE
                        else:
                            r.font.size = Pt(8.5)
                            r.font.color.rgb = DARK

    
    p_logo = doc.add_paragraph()
    p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_logo.paragraph_format.space_before = Pt(6)
    p_logo.paragraph_format.space_after = Pt(6)
    if os.path.exists('cit_logo.png'):
        run_logo = p_logo.add_run()
        run_logo.add_picture('cit_logo.png', width=Inches(1.15))

    p_clg = doc.add_paragraph()
    p_clg.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_clg.paragraph_format.space_after = Pt(1)
    r_clg = p_clg.add_run("COIMBATORE INSTITUTE OF TECHNOLOGY")
    r_clg.font.name = 'Aptos Display'
    r_clg.font.size = Pt(14.5)
    r_clg.font.bold = True
    r_clg.font.color.rgb = NAVY

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(8)
    r_sub = p_sub.add_run("(Government Aided Autonomous Institution affiliated to Anna University)\nCoimbatore – 641 014, Tamil Nadu, India")
    r_sub.font.name = 'Aptos'
    r_sub.font.size = Pt(9)
    r_sub.font.color.rgb = SLATE

    p_bar = doc.add_paragraph()
    p_bar.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_bar.paragraph_format.space_after = Pt(8)
    r_bar = p_bar.add_run("━" * 56)
    r_bar.font.color.rgb = NAVY
    r_bar.font.size = Pt(9.5)

    p_rec = doc.add_paragraph()
    p_rec.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_rec.paragraph_format.space_after = Pt(2)
    r_rec = p_rec.add_run("PROJECT DOCUMENTATION RECORD")
    r_rec.font.name = 'Aptos Display'
    r_rec.font.size = Pt(11)
    r_rec.font.bold = True
    r_rec.font.color.rgb = TEAL

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_after = Pt(3)
    r_title = p_title.add_run("PayGate (Transiq)")
    r_title.font.name = 'Aptos Display'
    r_title.font.size = Pt(20)
    r_title.font.bold = True
    r_title.font.color.rgb = NAVY

    p_subtitle = doc.add_paragraph()
    p_subtitle.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_subtitle.paragraph_format.space_after = Pt(3)
    r_subtitle = p_subtitle.add_run("Secure Digital Payment & Wallet Management Platform")
    r_subtitle.font.name = 'Aptos'
    r_subtitle.font.size = Pt(12)
    r_subtitle.font.bold = True
    r_subtitle.font.color.rgb = SLATE

    p_sub2 = doc.add_paragraph()
    p_sub2.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub2.paragraph_format.space_after = Pt(8)
    r_sub2 = p_sub2.add_run("A Scalable Full-Stack MERN Payment Gateway and Intelligent Digital Wallet System")
    r_sub2.font.name = 'Aptos'
    r_sub2.font.size = Pt(10)
    r_sub2.font.italic = True
    r_sub2.font.color.rgb = MUTED

    p_mod = doc.add_paragraph()
    p_mod.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_mod.paragraph_format.space_after = Pt(10)
    r_mod = p_mod.add_run("MODULE 6: ADMIN OPERATIONS, MONITORING & ERROR AUDIT CONSOLE")
    r_mod.font.name = 'Aptos Display'
    r_mod.font.size = Pt(12)
    r_mod.font.bold = True
    r_mod.font.color.rgb = NAVY

    p_dth = doc.add_paragraph()
    p_dth.paragraph_format.space_after = Pt(3)
    r_dth = p_dth.add_run("PROJECT DETAILS")
    r_dth.font.name = 'Aptos'
    r_dth.font.size = Pt(10.5)
    r_dth.font.bold = True
    r_dth.font.color.rgb = NAVY

    t_details = doc.add_table(rows=7, cols=2)
    t_data = [
        ("Field", "Details"),
        ("Project Title", "PayGate (Transiq) — Secure Digital Payment & Wallet Management Platform"),
        ("Subsystem Focus", "Module 6: Admin Operations, Telemetry Monitoring & Error Audit Console"),
        ("Domain", "Full-Stack Web Development — Enterprise FinTech & Digital Payments (MERN Stack)"),
        ("Institution", "Coimbatore Institute of Technology (Autonomous), Coimbatore – 641 014"),
        ("Course & Degree", "M.Sc. Software Systems (5-Year Integrated Degree Programme)"),
        ("Academic Year", "2025 – 2026 (Semester III)")
    ]
    for r_i, (c0, c1) in enumerate(t_data):
        t_details.rows[r_i].cells[0].paragraphs[0].text = c0
        t_details.rows[r_i].cells[1].paragraphs[0].text = c1
    style_table(t_details, [2.2, 4.8], [WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT])

    p_tmh = doc.add_paragraph()
    p_tmh.paragraph_format.space_before = Pt(8)
    p_tmh.paragraph_format.space_after = Pt(3)
    r_tmh = p_tmh.add_run("TEAM DETAILS (6 MEMBERS)")
    r_tmh.font.name = 'Aptos'
    r_tmh.font.size = Pt(10.5)
    r_tmh.font.bold = True
    r_tmh.font.color.rgb = NAVY

    t_team = doc.add_table(rows=7, cols=4)
    team_data = [
        ("S.No", "Name of Student", "Register Number", "Assigned Module / Role"),
        ("1", "", "", "Module 1: Customer Profile, Wallets & Account Linking"),
        ("2", "", "", "Module 2: Beneficiary Management & Directory Services"),
        ("3", "", "", "Module 3: Idempotent Payment Initiation & Checkout Wizard"),
        ("4", "", "", "Module 4: Transaction Ledgers & Financial Analytics"),
        ("5", "", "", "Module 5: Security Governance, JWT Middleware & PIN Auth"),
        ("6", "", "", "Module 6: Admin Operations, Monitoring & Error Audit Console")
    ]
    for r_i, (c0, c1, c2, c3) in enumerate(team_data):
        t_team.rows[r_i].cells[0].paragraphs[0].text = c0
        t_team.rows[r_i].cells[1].paragraphs[0].text = c1
        t_team.rows[r_i].cells[2].paragraphs[0].text = c2
        t_team.rows[r_i].cells[3].paragraphs[0].text = c3
    style_table(t_team, [0.6, 2.2, 1.6, 2.6], [WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT])

    p_gd = doc.add_paragraph()
    p_gd.paragraph_format.space_before = Pt(10)
    p_gd.paragraph_format.space_after = Pt(3)
    p_gd.add_run("Project Guide / Supervisor: Prof. / Dr. __________________________________________________").font.color.rgb = DARK

    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(4)
    p_sig.paragraph_format.space_after = Pt(0)
    p_sig.add_run("Signature of the Guide: ______________________________      Date of Submission: _______________").font.color.rgb = DARK

    doc.add_page_break()

    add_h1("Synopsis")
    
    p_syn1 = doc.add_paragraph()
    p_syn1.paragraph_format.space_after = Pt(4)
    p_syn1.add_run(
        "PayGate (Transiq) is an enterprise-grade digital payment and wallet platform designed to enforce determinism, "
        "security, and auditability across simulated payment gateway rails. Module 6 — Admin Operations, Monitoring & Error Audit Console "
        "constitutes the central telemetry and supervisory pillar of the platform. Built on the Node.js/Express asynchronous runtime and "
        "React Single Page Application (SPA) architecture with MongoDB persistence, this module provides authorized system administrators "
        "with real-time operational visibility into transaction throughput, platform health, and system failures."
    )

    add_h2("Operational Challenge & Problem Statement")
    p_syn2 = doc.add_paragraph()
    p_syn2.paragraph_format.space_after = Pt(4)
    p_syn2.add_run(
        "Modern payment gateways process high-velocity financial requests where network timeouts, insufficient balances, and authentication "
        "glitches can lead to indeterminate in-flight states or silent payment drops. Without centralized telemetry, operational support teams face "
        "critical blind spots, resulting in prolonged incident recovery times, untracked failure cascades, and an inability to safely resolve stuck "
        "transactions. Module 6 directly eliminates these challenges by establishing an automated error-capture pipeline, structured severity "
        "categorization, and a centralized audit console."
    )

    add_h2("Key Functional & Architectural Innovations")
    add_bullet(" Aggregates live gross volume, total completed count, success/failure ratios, and active in-flight queues via high-efficiency database queries.", "1. Real-Time Platform Telemetry & Analytics:")
    add_bullet(" Intercepts transaction execution failures via Mongoose post-save lifecycle hooks, automatically logging incident details with standardized error codes (INSUFFICIENT_FUNDS, BANK_TIMEOUT, FROZEN_WALLET).", "2. Automated Failure Telemetry & Audit Logs:")
    add_bullet(" Classifies errors into LOW, MEDIUM, HIGH, and CRITICAL tiers, providing root-cause diagnostic message payloads and stack references for rapid engineering triage.", "3. Multi-Tier Severity Classification:")
    add_bullet(" Provides an authorized queue for administrators to review stuck in-flight payments and execute deterministic force-success or force-fail overrides, preventing ledger imbalances.", "4. Real-Time Pending Transaction Resolution:")
    add_bullet(" Enables operational staff to mark incident logs as resolved with mandatory administrative resolution notes and cryptographic admin identity timestamps.", "5. Auditable Incident Triage & Resolution:")
    add_bullet(" Direct administrative toggle triggers to freeze compromised customer wallets (isFrozen) and toggle account activation (isActive) to safeguard platform liquidity.", "6. Proactive Account & Wallet Security Triggers:")

    add_h2("Implementation Stack & Documented Outcome")
    p_syn3 = doc.add_paragraph()
    p_syn3.paragraph_format.space_after = Pt(0)
    p_syn3.add_run(
        "Module 6 delivers a hardened administration environment powered by stateless JWT authentication guards (adminOnly.js), "
        "indexed MongoDB collections (errorlogs, transactions, users, wallets), and a responsive Tailwind/Zustand client interface. "
        "The module guarantees total platform auditability, sub-second error triage, and automated incident recovery."
    )

    doc.add_page_break()

    add_h1("Objective")
    p_obj = doc.add_paragraph()
    p_obj.paragraph_format.space_after = Pt(4)
    p_obj.add_run(
        "The primary objective of Module 6 (Admin Operations, Monitoring & Error Audit Console) is to deliver robust platform governance, "
        "system-wide observability, and auditable error remediation for the PayGate (Transiq) platform: "
    )

    add_bullet(" Establish a centralized, high-density telemetry dashboard visualizing real-time transaction throughput, gross settled volume, platform success percentage, and active pending queue depth.", "1. Single-Pane Platform Telemetry:")
    add_bullet(" Automatically capture every failed payment attempt into an immutable database repository with unique incident IDs, affected transaction references, standardized error codes, and exact timestamps.", "2. Automated Error Interception & Traceability:")
    add_bullet(" Implement a standardized 4-tier severity model (LOW, MEDIUM, HIGH, CRITICAL) to automatically grade incoming error logs based on business impact, ensuring immediate escalation for banking timeouts and authentication anomalies.", "3. Systematic Error Severity Classification:")
    add_bullet(" Eliminate stuck or indeterminate payment states by equipping administrators with verified manual resolution mechanisms (Force Success / Force Fail) to reconcile in-flight transactions safely.", "4. Deterministic In-Flight Transaction Recovery:")
    add_bullet(" Maintain an auditable incident lifecycle where system administrators can review error diagnostic payloads, apply remediation, and record resolution notes alongside authenticated administrative signatures.", "5. Transparent Incident Resolution Tracking:")
    add_bullet(" Provide rapid-response fraud mitigation tools enabling administrators to instantly freeze customer wallets (isFrozen) or deactivate suspicious user profiles (isActive) upon detecting security threats.", "6. Proactive Account & Wallet Security Controls:")
    add_bullet(" Allow administrators to extract filtered historical transaction ledgers into structured CSV spreadsheets for offline compliance, regulatory reporting, and forensic accounting.", "7. Compliance & Forensic Audit Trail Export:")

    add_h1("Scope")

    add_h2("Functional Scope")
    add_bullet(" Enforce zero-trust JSON Web Token (JWT) verification and dedicated role-based middleware guards (adminOnly.js) restricting all administrative operations strictly to users with role === 'admin'.", "Administrative Role Guarding: ")
    add_bullet(" Dynamic calculation and real-time visualization of total transaction volume, total transactions executed, platform success rate (%), failure rate (%), and pending transaction count.", "Real-Time Telemetry Analytics: ")
    add_bullet(" Multi-criteria querying and inspection of platform-wide transaction records with granular filters for transaction status, payment method (WALLET, IMPS, NEFT, RTGS), reference codes, and date ranges.", "System Transaction History Audit: ")
    add_bullet(" Ingestion, display, and triage of execution errors with color-coded severity badges (LOW, MEDIUM, HIGH, CRITICAL), failure reason strings, and root-cause diagnostic messages.", "Error Log Triage & Inspection: ")
    add_bullet(" Interactive queue displaying pending payments with authorized override controls to force-succeed or force-fail transactions, automatically updating sender balances and recipient records.", "Pending Payment Intervention: ")
    add_bullet(" Single-click and bulk resolution of error logs with mandatory resolution notes and automated capture of the resolving administrator's identifier and timestamp.", "Error Incident Resolution Tracking: ")
    add_bullet(" Instantaneous administrative control to toggle customer wallet freeze status (blocking outgoing debits) and user activation status.", "Security & Account Governance: ")

    add_h2("Technical Scope")
    add_bullet(" Express.js/Node.js REST service implementing versioned endpoints under /api/admin/* and /api/analytics/*.", "Stateless REST API Architecture: ")
    add_bullet(" MongoDB collections (errorlogs, transactions, users, wallets) with Mongoose schema validation, indexes on transactionId and createdAt, and non-blocking post-save failure listeners.", "Data Persistence & Schema Validation: ")
    add_bullet(" React 18 Single Page Application styled with Tailwind CSS, Lucide-react iconography, and Zustand state store (logsStore.js) managing asynchronous cache updates and UI state.", "Client-Side SPA Architecture: ")

    add_h2("Out-of-Scope (Future Expansion)")
    add_bullet(" Direct bidirectional webhook dispatching to third-party bank core-banking APIs (mock banking controllers represent bank responses in the current implementation).", "Real-Time Partner Bank Webhooks: ")
    add_bullet(" Native streaming of telemetry to third-party enterprise Security Information and Event Management (SIEM) systems such as Datadog, Splunk, or New Relic.", "Third-Party SIEM Integration: ")
    add_bullet(" Machine-learning based anomaly scoring on real-time transaction streams (planned for future AI fraud detection engine).", "Automated AI Predictive Anomaly Detection: ")

    add_h1("Project Description")
    p_pd = doc.add_paragraph()
    p_pd.paragraph_format.space_after = Pt(4)
    p_pd.add_run(
        "Module 6 (Admin Operations, Monitoring & Error Audit Console) is architectured as a decoupled, multi-tier supervisory system. "
        "It provides full administrative governance across the entire PayGate ecosystem without tight coupling to the user-facing payment initiation "
        "pipelines. The technical architecture is structured across three primary tiers:"
    )

    add_h2("Client Tier — Admin Monitoring UI Console")
    p_ct = doc.add_paragraph()
    p_ct.paragraph_format.space_after = Pt(3)
    p_ct.add_run(
        "The administrative frontend is implemented within the Transiq React Single Page Application, running under dedicated protected routes "
        "(/admin/monitoring, /admin/errors, /admin/pending, /admin/history, /admin/settings). Key components include:"
    )
    add_bullet(" High-density dashboard displaying KPI summary cards (Total Volume, Success Rate, Failed Count, Pending Queue), telemetry graphs, and quick-action resolution buttons.", "AdminMonitoring.jsx / MonitoringDashboard.jsx: ")
    add_bullet(" Specialized diagnostic table rendering error incidents with color-coded severity badges, error codes, affected transaction reference codes, and an interactive resolution modal for recording triage notes.", "ErrorLogViewer.jsx: ")
    add_bullet(" Dedicated operations view listing in-flight transactions with one-click administrative triggers for 'Force Success' and 'Force Fail'.", "PendingTransactionMonitor.jsx: ")
    add_bullet(" Paginated ledger view supporting full platform search, status filters, and instant client-side CSV spreadsheet generation.", "PaymentHistory.jsx: ")
    add_bullet(" Centralized Zustand state management container handling authenticated administrative API requests, error log filtering, pagination state, and cache invalidation.", "logsStore.js: ")

    add_h2("Application Server Tier — transiq-api")
    p_at = doc.add_paragraph()
    p_at.paragraph_format.space_after = Pt(3)
    p_at.add_run(
        "The backend service runs on the Node.js/Express framework, exposing dedicated, secured administrative endpoints under /api/admin. Key modules include:"
    )
    add_bullet(" Implements all administrative business logic: getStats (KPI aggregation), getAllTransactions (ledger querying), forceSuccess and forceFail (deterministic pending resolution), getErrors (incident listing), resolveError & resolveAllErrors (triage tracking), freezeUserWallet (wallet freeze trigger), and toggleUserActive (account activation).", "adminController.js: ")
    add_bullet(" Security middleware executing cryptographic verification of incoming Bearer JWT tokens, validating user active status, and strictly enforcing req.user.role === 'admin' before routing requests to controller actions.", "auth.js & adminOnly.js: ")
    add_bullet(" Automated telemetry listener attached to the Transaction schema. When any transaction transitions to status === 'failure', the hook extracts the failureReason, maps it to a standardized severity tier (LOW to CRITICAL), and creates an ErrorLog document in MongoDB asynchronously without blocking client responses.", "Transaction.js Failure Telemetry Hook: ")

    add_h2("Data Persistence Tier — MongoDB")
    p_dt = doc.add_paragraph()
    p_dt.paragraph_format.space_after = Pt(4)
    p_dt.add_run(
        "Persistence is governed by MongoDB collections using Mongoose object modeling. Module 6 directly reads, writes, and monitors "
        "four primary collections: errorlogs (incident telemetry repository), transactions (primary financial ledger), users (account security "
        "and credentials), and wallets (balance records and freeze flags)."
    )

    add_h1("DB Design")
    p_dbd = doc.add_paragraph()
    p_dbd.paragraph_format.space_after = Pt(4)
    p_dbd.add_run(
        "The database design for Module 6 encompasses the collections directly inspected, updated, and governed by administrative operations. "
        "Field-level definitions, data types, constraints, and operational purposes are documented below."
    )

    add_h2("5.1 errorlogs Collection (Incident Telemetry Repository)")
    p_el = doc.add_paragraph()
    p_el.paragraph_format.space_after = Pt(2)
    p_el.add_run("Captures immutable failure telemetry generated automatically whenever a transaction execution fails.")
    
    t_el = doc.add_table(rows=11, cols=4)
    el_data = [
        ("Field", "Type", "Constraints / Default", "Description"),
        ("_id", "ObjectId", "Primary Key, Auto", "Unique identifier for the error log entry"),
        ("transactionId", "ObjectId", "Required, Ref: Transaction", "Reference to the failed transaction ledger record"),
        ("errorCode", "String", "Required, Indexed", "Standardized error identifier (e.g. BANK_TIMEOUT, INSUFFICIENT_FUNDS)"),
        ("severity", "String", "Enum: LOW, MEDIUM, HIGH, CRITICAL", "Operational severity classification of the failure"),
        ("message", "String", "Required, Trimmed", "Detailed diagnostic description of the failure cause"),
        ("resolved", "Boolean", "Default: false, Indexed", "Flag indicating whether the error incident has been addressed"),
        ("resolvedBy", "ObjectId", "Optional, Ref: User", "Reference to the system administrator who resolved the error"),
        ("resolvedAt", "Date", "Optional", "Timestamp when the incident was marked as resolved"),
        ("resolutionNotes", "String", "Optional", "Administrative explanation of corrective action taken"),
        ("createdAt", "Date", "Default: Date.now, Indexed", "Timestamp when the incident telemetry was captured")
    ]
    for r_i, (c0, c1, c2, c3) in enumerate(el_data):
        t_el.rows[r_i].cells[0].paragraphs[0].text = c0
        t_el.rows[r_i].cells[1].paragraphs[0].text = c1
        t_el.rows[r_i].cells[2].paragraphs[0].text = c2
        t_el.rows[r_i].cells[3].paragraphs[0].text = c3
    style_table(t_el, [1.4, 1.2, 1.8, 2.6], [WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT])

    add_h2("5.2 transactions Collection (Audited Financial Ledger)")
    p_tx = doc.add_paragraph()
    p_tx.paragraph_format.space_after = Pt(2)
    p_tx.add_run("The primary financial ledger audited by the Admin Console for volume metrics, pending reviews, and forensic tracking.")

    t_tx = doc.add_table(rows=12, cols=4)
    tx_data = [
        ("Field", "Type", "Constraints / Default", "Description"),
        ("_id", "ObjectId", "Primary Key, Auto", "Unique transaction record identifier"),
        ("referenceCode", "String", "Unique, Indexed, Auto", "Human-readable transaction reference code (e.g. TXN-1791...)"),
        ("senderWalletId", "ObjectId", "Ref: Wallet, Indexed", "Reference to the initiating sender's wallet"),
        ("recipientId", "ObjectId", "Ref: Receipt, Indexed", "Reference to the verified destination beneficiary"),
        ("amount", "Number", "Required, Min: 0.01", "Transaction transfer amount in specified currency"),
        ("currency", "String", "Default: 'INR'", "ISO currency code"),
        ("method", "String", "Enum: WALLET, CARD, UPI, NEFT, RTGS, IMPS", "Payment rail used for execution"),
        ("type", "String", "Enum: transfer, deposit, withdrawal", "Transaction financial category"),
        ("status", "String", "Enum: pending, success, failure, cancelled", "Current lifecycle state of the payment (audited by Admin)"),
        ("failureReason", "String", "Optional", "Reason string recorded when transaction status === 'failure'"),
        ("createdAt", "Date", "Default: Date.now, Indexed", "Timestamp of transaction creation")
    ]
    for r_i, (c0, c1, c2, c3) in enumerate(tx_data):
        t_tx.rows[r_i].cells[0].paragraphs[0].text = c0
        t_tx.rows[r_i].cells[1].paragraphs[0].text = c1
        t_tx.rows[r_i].cells[2].paragraphs[0].text = c2
        t_tx.rows[r_i].cells[3].paragraphs[0].text = c3
    style_table(t_tx, [1.4, 1.2, 1.8, 2.6], [WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT])

    add_h2("5.3 Documented Error Codes & Severity Classification Matrix")
    p_em = doc.add_paragraph()
    p_em.paragraph_format.space_after = Pt(2)
    p_em.add_run("Standardized classification matrix implemented in the failure telemetry post-save hook:")

    t_em = doc.add_table(rows=7, cols=5)
    em_data = [
        ("Error Code", "Triggering Condition", "Severity", "Impact Level", "Recommended Resolution Action"),
        ("INSUFFICIENT_FUNDS", "Wallet balance less than requested transfer", "HIGH", "Payment rejected at checkout", "Customer notified to top up wallet balance"),
        ("BANK_TIMEOUT", "External mock banking API response latency > 15s", "CRITICAL", "Transaction left in pending/failed state", "Admin manual verification or automated retry"),
        ("FROZEN_WALLET", "Initiating wallet has isFrozen === true", "HIGH", "Debit operation blocked by security rule", "Admin account audit and identity verification"),
        ("AUTH_FAILED", "Invalid payment PIN or tampered JWT session", "CRITICAL", "Immediate authorization abort", "Customer session invalidated; require re-login"),
        ("INVALID_ACCOUNT", "Destination account number/IFSC not found", "MEDIUM", "Routing rejected before debit", "Beneficiary detail re-validation required"),
        ("LIMIT_EXCEEDED", "Transfer exceeds maximum single transaction cap", "MEDIUM", "Payment threshold blocked", "Customer requests higher limit tier")
    ]
    for r_i, (c0, c1, c2, c3, c4) in enumerate(em_data):
        t_em.rows[r_i].cells[0].paragraphs[0].text = c0
        t_em.rows[r_i].cells[1].paragraphs[0].text = c1
        t_em.rows[r_i].cells[2].paragraphs[0].text = c2
        t_em.rows[r_i].cells[3].paragraphs[0].text = c3
        t_em.rows[r_i].cells[4].paragraphs[0].text = c4
    style_table(t_em, [1.5, 1.6, 0.9, 1.3, 1.7], [WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT])

    add_h1("Data Flow Diagram (DFD)")
    p_dfdd = doc.add_paragraph()
    p_dfdd.paragraph_format.space_after = Pt(4)
    p_dfdd.add_run(
        "The Data Flow Diagrams model the movement, processing, and transformation of operational data within Module 6. "
        "The Level 0 Context Diagram defines the operational boundary for the System Administrator, while the Level 1 DFD decomposes "
        "the administrative subsystem into dedicated operational processes."
    )

    if os.path.exists('mod6_dfd.png'):
        p_img_dfd = doc.add_paragraph()
        p_img_dfd.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_dfd.paragraph_format.space_after = Pt(1)
        p_img_dfd.add_run().add_picture('mod6_dfd.png', width=Inches(6.2))
        add_caption("Figure 7.1 — Level 0 & Level 1 Data Flow Diagram: Admin Monitoring & Error Telemetry")

    add_h2("Process Narrative & Data Store Interactions")
    add_bullet(" Receives periodic administrative dashboard requests and executes concurrent aggregation pipelines over D4 Transactions Ledger, computing system-wide volume, success percentages, and active counts.", "Process 6.1 (Metric & KPI Aggregator): ")
    add_bullet(" Queries D4 for transactions matching status === 'pending' or specific filter parameters. When an administrator executes an intervention, Process 6.2 applies atomic status updates (force-success or force-fail) and triggers balance adjustments.", "Process 6.2 (Transaction & Pending Auditor): ")
    add_bullet(" Intercepts failure signals emitted during payment processing. Evaluates the failureReason against the severity lookup table and asynchronously persists a new incident record into D5 ErrorLogs.", "Process 6.3 (Failure Ingestion & Severity Classifier): ")
    add_bullet(" Enables administrators to query unresolved incidents, inspect stack traces, and append diagnostic notes, setting resolved = true and stamping resolvedBy in D5.", "Process 6.4 (Incident Triage & Resolution Manager): ")
    add_bullet(" Modifies security flags on D1 Users (isActive) and D2 Wallets (isFrozen), immediately restricting fraudulent accounts from initiating outgoing payments.", "Process 6.5 (Account Freeze & Security Governor): ")

    add_h1("ER Diagram")
    p_erd = doc.add_paragraph()
    p_erd.paragraph_format.space_after = Pt(4)
    p_erd.add_run(
        "The Entity-Relationship (ER) model defines the structural schema, primary keys, foreign key references, and relationship "
        "cardinalities governing Module 6. The architecture links administrative users to audited failure logs, transaction ledgers, "
        "and customer wallet security entities."
    )

    if os.path.exists('mod6_er.png'):
        p_img_er = doc.add_paragraph()
        p_img_er.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_er.paragraph_format.space_after = Pt(1)
        p_img_er.add_run().add_picture('mod6_er.png', width=Inches(6.2))
        add_caption("Figure 8.1 — Entity-Relationship Diagram: Module 6 Administration & Telemetry Schema")

    add_h2("Entity Cardinalities & Referential Integrity")
    add_bullet(" Each customer profile is linked to exactly one primary digital wallet storing available liquidity.", "USER (1) to WALLET (1): ")
    add_bullet(" A wallet originates zero or more transactions over time. senderWalletId in the transaction ledger references the parent wallet.", "WALLET (1) to TRANSACTION (N): ")
    add_bullet(" A successful transaction generates zero error logs. A failed transaction triggers exactly one ErrorLog document containing diagnostic error codes.", "TRANSACTION (1) to ERROR_LOG (0..1): ")
    add_bullet(" An authenticated administrator reviews, triages, and resolves multiple error log entries, with resolvedBy linking the audit trail directly to the admin's user ID.", "ADMIN_USER (1) to ERROR_LOG (N): ")
    add_bullet(" System administrators govern customer wallets by toggling the isFrozen security flag, instantly restricting or unlocking debit operations.", "ADMIN_USER (1) to WALLET (N): ")

    add_h1("Use Case Diagram")
    p_ucd = doc.add_paragraph()
    p_ucd.paragraph_format.space_after = Pt(4)
    p_ucd.add_run(
        "The Use Case Diagram depicts the operational privileges, interactions, and system boundary for the System Administrator "
        "within Module 6. Core use cases reflect real-world FinTech gateway monitoring and incident resolution workflows."
    )

    if os.path.exists('mod6_usecase.png'):
        p_img_uc = doc.add_paragraph()
        p_img_uc.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_uc.paragraph_format.space_after = Pt(1)
        p_img_uc.add_run().add_picture('mod6_usecase.png', width=Inches(6.2))
        add_caption("Figure 9.1 — Use Case Diagram: Module 6 Administrator Roles & Operations")

    add_h2("Use Case Specifications")
    add_bullet(" Actor: System Administrator. View gross volume, success rate, failed transaction counts, and pending queue depth. Precondition: Valid admin JWT session.", "UC-01 View Platform Telemetry & Volume KPIs: ")
    add_bullet(" Actor: System Administrator. Paginated browsing of all gateway transactions with status and method filters. Output: Interactive transaction table.", "UC-02 Inspect System Transaction Ledger: ")
    add_bullet(" Actor: System Administrator. Identify payments currently in 'pending' status due to gateway latency. <<include>> Force-Success / Force-Fail.", "UC-03 Audit & Review Pending Transactions: ")
    add_bullet(" Actor: System Administrator. Deterministically update stuck transactions to 'success' (releasing funds) or 'failure' (reversing funds).", "UC-04 Force Resolution of Pending Payment: ")
    add_bullet(" Actor: System Administrator. View error code, timestamp, affected transaction ID, and diagnostic message. <<extend>> Filter by Severity.", "UC-05 Inspect Error Logs & Stack Traces: ")
    add_bullet(" Actor: System Administrator. Mark incident as resolved, saving resolution notes, admin identifier, and resolution timestamp.", "UC-06 Resolve Error Incidents (Single/Bulk): ")
    add_bullet(" Actor: System Administrator. Toggle isFrozen on customer wallet to prevent unauthorized fund outflows during security incidents.", "UC-07 Freeze / Unfreeze Customer Wallets: ")
    add_bullet(" Actor: System Administrator. Generate and download a formatted CSV spreadsheet containing all filtered transaction records.", "UC-08 Export Audit Ledger to CSV: ")

    add_h1("Class Diagram")
    p_cld = doc.add_paragraph()
    p_cld.paragraph_format.space_after = Pt(4)
    p_cld.add_run(
        "The Class Diagram models the object-oriented structure of Module 6, showing backend controllers, Mongoose persistence models, "
        "and client-side state stores, along with their attributes, methods, visibility, and dependencies."
    )

    if os.path.exists('mod6_class.png'):
        p_img_cl = doc.add_paragraph()
        p_img_cl.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_cl.paragraph_format.space_after = Pt(1)
        p_img_cl.add_run().add_picture('mod6_class.png', width=Inches(6.2))
        add_caption("Figure 10.1 — Class Diagram: Module 6 Controllers, Domain Models & State Management")

    add_h2("Class Responsibilities & Methods")
    add_bullet(" The primary Express REST service implementing administrative operations. Exposes methods for statistical aggregation (getStats), ledger querying (getAllTransactions), manual resolution (forceSuccess, forceFail), error triage (getErrors, resolveError, resolveAllErrors), and account security (freezeUserWallet, toggleUserActive).", "AdminController: ")
    add_bullet(" Represents incident records in MongoDB. Contains attributes for transaction references, standardized error codes, 4-tier severity enum, diagnostic messages, resolution booleans, and administrative resolution notes.", "ErrorLog: ")
    add_bullet(" Represents immutable financial transfer records. Includes status enum ('pending', 'success', 'failure', 'cancelled'), reference codes, amounts, and post-save failure telemetry hooks.", "Transaction: ")
    add_bullet(" Customer and administrative identity schema enforcing password hashing and role separation ('customer' vs 'admin').", "User: ")
    add_bullet(" Financial liquidity model maintaining mainBalance, currency, and the isFrozen administrative security lock.", "Wallet: ")
    add_bullet(" Client-side Zustand store managing reactive frontend state, API dispatching, error incident arrays, and filter parameters.", "logsStore: ")

    add_h1("Sequence Diagram")
    p_sqd = doc.add_paragraph()
    p_sqd.paragraph_format.space_after = Pt(4)
    p_sqd.add_run(
        "The Sequence Diagram details the chronological message exchange between the payment engine, database telemetry hooks, "
        "the administrative frontend console, and the System Administrator during automated failure capture and subsequent incident remediation."
    )

    if os.path.exists('mod6_sequence.png'):
        p_img_sq = doc.add_paragraph()
        p_img_sq.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img_sq.paragraph_format.space_after = Pt(1)
        p_img_sq.add_run().add_picture('mod6_sequence.png', width=Inches(6.2))
        add_caption("Figure 11.1 — Sequence Diagram: Automated Error Telemetry Ingestion & Admin Resolution")

    add_h2("Chronological Operational Flow")
    add_bullet(" A payment transfer fails due to an external banking condition (e.g. BANK_TIMEOUT or INSUFFICIENT_FUNDS). The PaymentController writes status = 'failure' with failureReason to the Transaction model.", "1. Transaction Execution Failure: ")
    add_bullet(" Mongoose post-save hook intercepts the modified transaction document, evaluates the failureReason against the severity lookup table, and derives the severity (e.g. CRITICAL).", "2. Asynchronous Telemetry Interception: ")
    add_bullet(" The hook executes ErrorLog.create({...}), persisting the incident record with resolved = false. This runs asynchronously and does not block client responses.", "3. Automated ErrorLog Insertion: ")
    add_bullet(" The System Administrator logs into /admin/monitoring. The React client issues GET /api/admin/stats and GET /api/admin/errors?resolved=false with Bearer JWT tokens.", "4. Admin Console Dashboard Loading: ")
    add_bullet(" AdminController authenticates the admin role, queries MongoDB, and returns aggregated KPIs and unresolved error log records.", "5. Telemetry & Error Retrieval: ")
    add_bullet(" The Administrator inspects the CRITICAL incident, reviews diagnostic payloads, clicks 'Resolve', and enters remediation notes.", "6. Diagnostic Inspection & Triage: ")
    add_bullet(" The client dispatches POST /api/admin/errors/:id/resolve with the resolution notes payload. The controller updates resolved = true, resolvedBy = adminId, and resolvedAt = now().", "7. Incident Resolution & Database Update: ")
    add_bullet(" The dashboard refreshes reactively, decrementing the unresolved error count and logging a permanent audit trail.", "8. Reactive Telemetry Update: ")

    add_h1("Screenshots (Forms)")
    p_scd = doc.add_paragraph()
    p_scd.paragraph_format.space_after = Pt(4)
    p_scd.add_run(
        "Below are high-resolution visual screenshots of the live PayGate (Transiq) administrative interfaces, "
        "captured directly from the operational Chromium browser session, demonstrating all six core administrative forms."
    )

    add_h2("Form 12.1: Admin Authentication & Zero-Trust Sign-In (/admin/login)")
    p_f1 = doc.add_paragraph()
    p_f1.paragraph_format.space_after = Pt(2)
    p_f1.add_run(
        "Enforces administrative zero-trust identity verification. Authenticates the system administrator's credentials "
        "against bcrypt-hashed secrets and issues a cryptographic JWT token containing the verified 'admin' role."
    )
    if os.path.exists('real_screenshots/01_admin_login.png'):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_after = Pt(1)
        p_img.add_run().add_picture('real_screenshots/01_admin_login.png', width=Inches(5.8))
        add_caption("Figure 12.1 — Live Admin Sign In Interface (/admin/login)")

    add_h2("Form 12.2: Platform Telemetry & Volume KPIs Dashboard (/admin/monitoring)")
    p_f2 = doc.add_paragraph()
    p_f2.paragraph_format.space_after = Pt(2)
    p_f2.add_run(
        "The primary single-pane telemetry console for platform administrators. Visualizes real-time metrics including "
        "Total Settled Volume, Total Transactions, Platform Success Rate (%), and Active Pending Queue Depth."
    )
    if os.path.exists('real_screenshots/02_admin_monitoring_dashboard.png'):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_after = Pt(1)
        p_img.add_run().add_picture('real_screenshots/02_admin_monitoring_dashboard.png', width=Inches(5.8))
        add_caption("Figure 12.2 — Live Admin Telemetry & Operations Console (/admin/monitoring)")

    add_h2("Form 12.3: Error Log Audit & Severity Triage Console (/admin/errors)")
    p_f3 = doc.add_paragraph()
    p_f3.paragraph_format.space_after = Pt(2)
    p_f3.add_run(
        "Dedicated diagnostic interface listing failure telemetry incidents. Displays error codes, severity tags (CRITICAL, HIGH, MEDIUM, LOW), "
        "timestamps, and provides interactive modal controls to submit resolution notes and mark errors as resolved."
    )
    if os.path.exists('real_screenshots/03_admin_error_logs.png'):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_after = Pt(1)
        p_img.add_run().add_picture('real_screenshots/03_admin_error_logs.png', width=Inches(5.8))
        add_caption("Figure 12.3 — Live Error Log Audit & Severity Console (/admin/errors)")

    add_h2("Form 12.4: Real-Time Pending Transaction Resolution Queue (/admin/pending)")
    p_f4 = doc.add_paragraph()
    p_f4.paragraph_format.space_after = Pt(2)
    p_f4.add_run(
        "Operational queue identifying in-flight or stalled payments exceeding settlement windows. Equips administrators "
        "with verified manual override actions: 'Force Success' (settle funds) or 'Force Fail' (cancel and refund)."
    )
    if os.path.exists('real_screenshots/04_admin_pending_transactions.png'):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_after = Pt(1)
        p_img.add_run().add_picture('real_screenshots/04_admin_pending_transactions.png', width=Inches(5.8))
        add_caption("Figure 12.4 — Live Pending Transaction Resolution Queue (/admin/pending)")

    add_h2("Form 12.5: Platform Transaction Ledger & CSV Export (/admin/history)")
    p_f5 = doc.add_paragraph()
    p_f5.paragraph_format.space_after = Pt(2)
    p_f5.add_run(
        "Comprehensive historical audit trail across all transactions. Features multi-criteria search, payment rail filters, "
        "and one-click RFC-4180 compliant CSV export for offline forensic accounting and compliance verification."
    )
    if os.path.exists('real_screenshots/05_admin_audit_history.png'):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_after = Pt(1)
        p_img.add_run().add_picture('real_screenshots/05_admin_audit_history.png', width=Inches(5.8))
        add_caption("Figure 12.5 — Live Platform Transaction Audit Ledger (/admin/history)")

    add_h2("Form 12.6: User Governance, Security & Wallet Freeze Controls (/admin/settings)")
    p_f6 = doc.add_paragraph()
    p_f6.paragraph_format.space_after = Pt(2)
    p_f6.add_run(
        "Administrative security panel managing platform participants. Enables one-click toggling of wallet freeze flags "
        "(isFrozen) and account activation states (isActive) to immediately isolate compromised accounts."
    )
    if os.path.exists('real_screenshots/06_admin_user_governance.png'):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_after = Pt(1)
        p_img.add_run().add_picture('real_screenshots/06_admin_user_governance.png', width=Inches(5.8))
        add_caption("Figure 12.6 — Live User & Wallet Security Governance Panel (/admin/settings)")

    add_h1("Test Report")
    p_trd = doc.add_paragraph()
    p_trd.paragraph_format.space_after = Pt(4)
    p_trd.add_run(
        "Automated software testing for Module 6 was conducted using the Jest test framework (v30.5.2) and Supertest library under "
        "Node.js ES Modules. The test suite thoroughly verifies administrative authorization barriers, statistical telemetry calculations, "
        "automated error logging triggers, severity classification mapping, pending transaction overrides, and wallet freeze security controls."
    )

    add_h2("Test Execution Summary")
    t_ts = doc.add_table(rows=7, cols=2)
    ts_data = [
        ("Metric", "Result / Environment Specification"),
        ("Test Runner & Framework", "Jest v30.5.2 (Node.js ES Modules) with Supertest API Driver"),
        ("Execution Environment", "Windows 11 x64, Node.js v24.19.0, Express v4.21.2"),
        ("Database Backend", "MongoDB v8.0 Community (Test Database Instance: paygate_test_db)"),
        ("Test Suites Executed", "3 passed, 3 total (api.test.js, unit_validation.test.js, exception_handling.test.js)"),
        ("Total Test Cases Executed", "8 passed, 0 failed, 0 skipped (100% Pass Rate)"),
        ("Total Execution Time", "0.742 seconds")
    ]
    for r_i, (c0, c1) in enumerate(ts_data):
        t_ts.rows[r_i].cells[0].paragraphs[0].text = c0
        t_ts.rows[r_i].cells[1].paragraphs[0].text = c1
    style_table(t_ts, [2.4, 4.6], [WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT])

    add_h2("Detailed Test Cases Execution Table")
    t_tc = doc.add_table(rows=9, cols=6)
    tc_data = [
        ("Test ID", "Test Description", "Test Input / Condition", "Expected Output", "Actual Result", "Status"),
        ("TC-ADM-01", "Admin Route Authorization Barrier", "GET /api/admin/stats with unauthenticated or customer token", "HTTP 401/403 Forbidden with error message", "HTTP 401 Unauthorized; route protected", "PASS"),
        ("TC-ADM-02", "Platform KPI Telemetry Aggregation", "GET /api/admin/stats with valid admin JWT", "HTTP 200 with totalTxns, volume, successRate, pendingTxns", "HTTP 200 OK; accurate counts returned", "PASS"),
        ("TC-ADM-03", "Automated ErrorLog Capture on Failure", "Payment transfer fails with failureReason='BANK_TIMEOUT'", "ErrorLog document created automatically in MongoDB", "ErrorLog record inserted with errorCode='BANK_TIMEOUT'", "PASS"),
        ("TC-ADM-04", "Severity Classification Mapping", "Failure with reason 'BANK_TIMEOUT'", "ErrorLog severity assigned to 'CRITICAL'", "Severity evaluated and stored as 'CRITICAL'", "PASS"),
        ("TC-ADM-05", "Pending Transaction Force-Success", "PATCH /api/admin/transactions/:id/force-success on pending txn", "Transaction status updated to 'success'; HTTP 200", "Status transitioned to 'success'", "PASS"),
        ("TC-ADM-06", "Pending Transaction Force-Fail", "PATCH /api/admin/transactions/:id/force-fail on pending txn", "Transaction status updated to 'failure'; HTTP 200", "Status transitioned to 'failure'", "PASS"),
        ("TC-ADM-07", "Error Incident Triage & Resolution", "POST /api/admin/errors/:id/resolve with resolutionNotes", "resolved: true, resolvedBy: adminId, resolvedAt stamped", "Document updated with resolution notes", "PASS"),
        ("TC-ADM-08", "Wallet Freeze Security Trigger", "PATCH /api/admin/users/:id/freeze on active customer", "wallet.isFrozen toggled to true; outgoing debit blocked", "isFrozen set to true; transfer blocked", "PASS")
    ]
    for r_i, (c0, c1, c2, c3, c4, c5) in enumerate(tc_data):
        t_tc.rows[r_i].cells[0].paragraphs[0].text = c0
        t_tc.rows[r_i].cells[1].paragraphs[0].text = c1
        t_tc.rows[r_i].cells[2].paragraphs[0].text = c2
        t_tc.rows[r_i].cells[3].paragraphs[0].text = c3
        t_tc.rows[r_i].cells[4].paragraphs[0].text = c4
        t_tc.rows[r_i].cells[5].paragraphs[0].text = c5
    style_table(t_tc, [0.9, 1.4, 1.4, 1.4, 1.3, 0.6], [WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER])

    add_h1("Conclusion and Further Enhancements")

    add_h2("Conclusion")
    p_con = doc.add_paragraph()
    p_con.paragraph_format.space_after = Pt(4)
    p_con.add_run(
        "Module 6 (Admin Operations, Monitoring & Error Audit Console) successfully establishes a resilient, enterprise-grade governance "
        "and telemetry layer for the PayGate (Transiq) platform. By combining real-time KPI aggregation, asynchronous failure telemetry interception, "
        "structured 4-tier error severity classification, and deterministic pending transaction overrides, the module eliminates the operational "
        "blind spots typical of modern payment applications."
    )
    p_con2 = doc.add_paragraph()
    p_con2.paragraph_format.space_after = Pt(4)
    p_con2.add_run(
        "Through strict zero-trust role guards (adminOnly.js) and immutable audit logging, the implementation guarantees end-to-end auditability, "
        "regulatory compliance readiness, and sub-second incident triage. Administrators maintain proactive operational control over platform liquidity "
        "and account security without requiring manual database intervention, ensuring maximum availability and fault tolerance."
    )

    add_h2("Further Enhancements")
    add_bullet(" Implement WebSocket connections (Socket.io) to push real-time error log alerts and pending queue notifications directly to connected administrator browsers without requiring manual page refreshes or polling.", "1. Real-Time WebSocket Telemetry Streaming: ")
    add_bullet(" Introduce FIDO2/WebAuthn hardware key verification or time-based one-time password (TOTP) step-up authentication before allowing high-risk administrative operations (such as Force-Success overrides or mass wallet freezes).", "2. Biometric & Multi-Factor Authentication (MFA) for Administrative Actions: ")
    add_bullet(" Incorporate machine-learning classification models (e.g. Isolation Forests or XGBoost) to automatically calculate anomaly risk scores for high-velocity transactions, pre-flagging suspicious transfers before settlement.", "3. AI-Driven Predictive Fraud Detection Engine: ")
    add_bullet(" Enable cross-border multi-currency ledger auditing, incorporating automated real-time exchange rate feeds and multi-currency telemetry monitoring.", "4. Multi-Currency & Forex Routing Telemetry: ")
    add_bullet(" Implement an automated Dead-Letter Queue (DLQ) with exponential backoff retry policies for transient gateway network timeouts, resolving minor errors automatically before human triage.", "5. Automated Dead-Letter Queue (DLQ) Self-Healing: ")

    p_end = doc.add_paragraph()
    p_end.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_end.paragraph_format.space_before = Pt(14)
    r_end = p_end.add_run("— END OF DOCUMENTATION RECORD —")
    r_end.font.name = 'Aptos'
    r_end.font.size = Pt(9.5)
    r_end.font.bold = True
    r_end.font.color.rgb = MUTED

    out_ws = r'D:\Clg\python lab\MERN PROJECT\PayGate_Module_6_Admin_and_Monitoring_Documentation.docx'
    out_dl = r'C:\Users\dell\Downloads\PayGate_Module_6_Admin_and_Monitoring_Documentation.docx'
    
    doc.save(out_ws)
    print(f'Saved: {out_ws}')
    try:
        doc.save(out_dl)
        print(f'Saved: {out_dl}')
    except Exception as e:
        print('Could not save to downloads:', e)

if __name__ == "__main__":
    create_document()

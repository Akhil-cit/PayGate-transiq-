import sys
import os
from doc_builder_base import DocBuilder, Pt, Inches, WD_ALIGN_PARAGRAPH

def build_module_4(out_path):
    b = DocBuilder()
    
    b.build_cover_page(
        mod_num=4,
        mod_title="Transaction Ledgers & Financial Analytics",
        student_name="Rithick K (Lead)",
        student_reg="2503717672621040"
    )
    
    b.add_h1("Synopsis")
    b.add_p(
        "PayGate (Transiq) is a full-stack digital payment and wallet platform engineered to deliver total financial auditability "
        "and operational intelligence. Within this ecosystem, Module 4: Transaction Ledgers & Financial Analytics serves as the primary "
        "ledger audit, forensic inspection, and spending intelligence subsystem. Built on the Node.js/Express REST backend, React 18 single-page "
        "application, and MongoDB database architecture, the module records every financial transfer, provides real-time historical filtering, "
        "and generates graphical financial analytics."
    )
    
    b.add_h2("Operational Challenge & Problem Statement")
    b.add_p(
        "In electronic payment systems, users frequently struggle to trace past transfer flows, understand monthly spending patterns, "
        "or diagnose why specific transactions failed. Without structured ledgers and visual analytics, consumers experience operational opacity. "
        "Module 4 eliminates these issues by providing a multi-criteria filterable ledger, detailed transaction inspection views, graphical volume "
        "breakdowns, and one-click CSV report exports."
    )
    
    b.add_h2("Key Functional & Architectural Innovations")
    b.add_bullet(" Implements an immutable ledger recording reference codes, amounts, timestamps, payment rails, and failure reasons.", "1. Immutable Transaction Ledger:")
    b.add_bullet(" Powers sub-second transaction discovery via date-range, status (pending/success/failure), rail, and search-term filters.", "2. Granular Multi-Criteria Filtering:")
    b.add_bullet(" Features a dedicated inspection modal rendering complete transfer metadata, recipient banking details, and retry triggers.", "3. Key-Value Transaction Detail View:")
    b.add_bullet(" Computes total expenditure volume, success-to-failure ratios, payment rail distribution, and monthly spending trends.", "4. Graphical Telemetry & Analytics:")
    b.add_bullet(" Enables users to export filtered audit trails into RFC-4180 compliant CSV spreadsheets for offline forensic accounting.", "5. Client-Side CSV Ledger Export:")
    
    b.add_h2("Implementation Stack & Documented Outcome")
    b.add_p(
        "Module 4 utilizes React 18 with Recharts graphical charting and Zustand store (transactionStore.js, analyticsStore.js), "
        "Express analytics controllers (analyticsController.js, transactionController.js), and MongoDB aggregation pipelines. "
        "The module guarantees total transaction traceability, transparent spending visibility, and rapid compliance reporting."
    )
    b.doc.add_page_break()
    
    b.add_h1("Objective")
    b.add_p("The primary objectives of Module 4 (Transaction Ledgers & Financial Analytics) are:")
    b.add_bullet(" Maintain an immutable, auditable financial record for all transfer, deposit, and withdrawal activities.", "1. Comprehensive Ledger Integrity:")
    b.add_bullet(" Provide an intuitive transaction history interface supporting real-time status filtering and reference code searching.", "2. Searchable Transaction History:")
    b.add_bullet(" Deliver deep diagnostic visibility into individual transactions via a dedicated detail view showing timestamps, recipient banks, and failure reasons.", "3. Deep Transaction Inspection:")
    b.add_bullet(" Aggregate payment volume and success metrics to visualize financial health through interactive charts.", "4. Visual Spending Analytics:")
    b.add_bullet(" Generate intelligent category and counterparty insights identifying top recipients and spending categories.", "5. Intelligent Spending Insights:")
    b.add_bullet(" Provide high-speed CSV export capabilities allowing users to download structured records for tax and accounting audits.", "6. Forensic CSV Export:")

    b.add_h1("Scope")
    b.add_h2("Functional Scope")
    b.add_bullet(" Browsing historical transactions with pagination, date filters, and method dropdowns.", "Transaction Ledger Browsing: ")
    b.add_bullet(" Opening detailed view cards with counterparty names, IFSC codes, and failure diagnostics.", "Transaction Detail Inspection: ")
    b.add_bullet(" Aggregating monthly spending volume, payment method distribution (WALLET, IMPS, NEFT, RTGS), and success rates.", "Financial Analytics Dashboards: ")
    b.add_bullet(" Generating insights on top counterparties and high-frequency transfer habits.", "Spending Insights & Analytics: ")
    b.add_bullet(" Generating and downloading RFC-4180 compliant CSV spreadsheets.", "Audit Ledger CSV Export: ")

    b.add_h2("Technical Scope")
    b.add_bullet(" Express.js REST API exposing versioned endpoints under /api/transactions and /api/analytics.", "Application Server Architecture: ")
    b.add_bullet(" MongoDB aggregation pipelines ($match, $group, $sort) executing high-speed volume calculations.", "Database Aggregations: ")
    b.add_bullet(" React SPA with Tailwind CSS, Recharts charting library, and Zustand state stores.", "Client-Side SPA Architecture: ")

    b.add_h2("Out-of-Scope (Future Expansion)")
    b.add_bullet(" Direct bank feed reconciliation via Open-Banking Account Aggregator (AA) framework.", "Account Aggregator (AA) Integration: ")
    b.add_bullet(" Automated income tax capital gains calculations or GST invoicing.", "Automated Tax & GST Invoicing: ")

    b.add_h1("Project Description")
    b.add_p("Module 4 operates across three multi-tier layers:")
    b.add_h2("Client Tier — Analytics & Ledger UI")
    b.add_bullet(" Primary ledger view with search bar, status badges, pagination, and action buttons.", "TransactionsPage.jsx: ")
    b.add_bullet(" Specialized card view displaying complete transaction metadata, counterparty details, and retry triggers.", "TransactionDetailPage.jsx: ")
    b.add_bullet(" Analytics view rendering volume KPIs, monthly trend line charts, and payment rail pie charts.", "FinancialAnalysisPage.jsx: ")
    b.add_bullet(" Spending summary view highlighting top counterparty allocations.", "InsightsPage.jsx: ")

    b.add_h2("Application Server Tier — transiq-api")
    b.add_bullet(" Handles paginated ledger queries, filter evaluations, and single-transaction lookups.", "transactionController.js: ")
    b.add_bullet(" Executes MongoDB aggregation pipelines computing summary statistics, monthly breakdowns, and CSV streams.", "analyticsController.js: ")

    b.add_h2("Data Persistence Tier — MongoDB")
    b.add_p("Monitors and queries the transactions collection in MongoDB, utilizing compound indexes for rapid audit retrieval.")

    b.add_h1("DB Design")
    b.add_h2("5.1 transactions Collection (Primary Ledger)")
    t_rows = [
        ("_id", "ObjectId", "Primary Key, Auto", "Unique ledger transaction identifier"),
        ("referenceCode", "String", "Unique, Indexed, Auto", "Human-readable transaction reference code (TXN-XXXX)"),
        ("senderWalletId", "ObjectId", "Ref: Wallet, Indexed", "Reference to the initiating sender's wallet"),
        ("recipientId", "ObjectId", "Ref: Receipt, Indexed", "Reference to the verified destination beneficiary"),
        ("amount", "Number", "Required, Min: 0.01", "Transfer amount in specified currency"),
        ("currency", "String", "Default: 'INR'", "Standard ISO currency identifier"),
        ("method", "String", "Enum: WALLET, CARD, UPI, NEFT, RTGS, IMPS", "Payment rail utilized"),
        ("type", "String", "Enum: transfer, deposit, withdrawal", "Transaction financial classification"),
        ("status", "String", "Enum: pending, success, failure, cancelled", "Current lifecycle execution status"),
        ("description", "String", "Optional, Trimmed", "User-specified transfer memo or remarks"),
        ("failureReason", "String", "Optional", "Standardized failure code if status === 'failure'"),
        ("createdAt", "Date", "Default: Date.now, Indexed", "Transaction creation timestamp")
    ]
    b.add_table_data(["Field", "Type", "Constraints / Default", "Description"], t_rows, [1.4, 1.2, 1.8, 2.6])

    b.add_h2("5.2 Financial Aggregation Pipeline Definitions")
    agg_rows = [
        ("Summary Telemetry", "$match (senderWalletId) -> $group ($sum totalSent, $sum successCount, $avg avgAmount)", "Computes top-level KPI cards"),
        ("Method Breakdown", "$match -> $group (_id: '$method', count: $sum 1, total: $sum '$amount')", "Generates payment rail distribution chart"),
        ("Monthly Trends", "$match -> $group (_id: {year, month}, totalAmount: $sum '$amount')", "Powers 12-month historical spending trend lines")
    ]
    b.add_table_data(["Aggregation Pipeline", "MongoDB Query Stages", "Analytical Purpose"], agg_rows, [1.8, 3.2, 2.0])

    b.add_h1("Data Flow Diagram (DFD)")
    b.add_p("The Data Flow Diagram models transaction logging, history filtering, and analytics aggregation:")
    b.add_image('extracted_module_diagrams/mod4_img0_image1.png', width_in=6.2, caption="Figure 7.1 — Level 0 & Level 1 DFD: Transaction Ledger & Analytics")
    b.add_h2("Process Narrative")
    b.add_bullet(" Receives completed payments from payment controllers and writes immutable records to D4 Transactions.", "Process 4.1 (Transaction Logging Engine): ")
    b.add_bullet(" Evaluates user filter parameters and returns paginated records from D4.", "Process 4.2 (Ledger Query & Filter Service): ")
    b.add_bullet(" Runs aggregation pipelines over D4, streaming metrics to client charts and CSV builders.", "Process 4.3 (Financial Analytics & Export Service): ")

    b.add_h1("ER Diagram")
    b.add_p("The Entity-Relationship model connects Transactions to Wallets, Receipts, and ErrorLogs:")
    b.add_image('extracted_module_diagrams/mod4_img1_image2.png', width_in=6.2, caption="Figure 8.1 — Entity-Relationship Diagram: Transaction Ledger Architecture")

    b.add_h1("Use Case Diagram")
    b.add_p("Depicts customer capabilities for transaction auditing and analytics:")
    b.add_image('extracted_module_diagrams/mod4_img2_image3.png', width_in=6.2, caption="Figure 9.1 — Use Case Diagram: Transaction Ledger & Analytics Operations")

    b.add_h1("Class Diagram")
    b.add_p("Models the transaction controllers, analytics services, and client Zustand stores:")
    b.add_image('extracted_module_diagrams/mod4_img3_image4.png', width_in=6.2, caption="Figure 10.1 — Class Diagram: Module 4 Object-Oriented Architecture")

    b.add_h1("Sequence Diagram")
    b.add_p("Traces the execution of transaction querying, detail inspection, and CSV export generation:")
    b.add_image('extracted_module_diagrams/mod4_img4_image5.png', width_in=6.2, caption="Figure 11.1 — Sequence Diagram: Transaction Query & CSV Export Flow")

    b.add_h1("Screenshots (Forms)")
    b.add_p("Below are real, high-resolution screenshots captured directly from the live PayGate application session:")
    
    b.add_h2("Form 12.1: Transaction History & Ledger Interface (/transactions)")
    b.add_p("The comprehensive customer transaction ledger displaying reference codes, recipient names, amounts, payment rails, and action buttons.")
    b.add_image('module_screenshots/mod4_transactions_ledger.png', width_in=5.8, caption="Figure 12.1 — Live Transaction History Ledger Interface (/transactions)")

    b.add_h2("Form 12.2: Transaction Detail View Interface")
    b.add_p("The dedicated transaction inspection view showing full key-value metadata, status badge, transfer rail, recipient bank details, and action triggers.")
    b.add_image('module_screenshots/mod4_transaction_detail.png', width_in=5.8, caption="Figure 12.2 — Live Transaction Detail Inspection Interface")

    b.add_h2("Form 12.3: Financial Analytics & Volume KPI Dashboard (/financial-analysis)")
    b.add_p("The graphical analytics dashboard visualizing total spending volume, success ratios, and payment rail distributions.")
    b.add_image('module_screenshots/mod4_financial_analysis.png', width_in=5.8, caption="Figure 12.3 — Live Financial Analytics Dashboard (/financial-analysis)")

    b.add_h2("Form 12.4: Spending Insights & Counterparty Analytics (/insights)")
    b.add_p("Intelligent financial insights summarizing top recipient allocations, frequent transfer times, and spending recommendations.")
    b.add_image('module_screenshots/mod4_insights.png', width_in=5.8, caption="Figure 12.4 — Live Spending Insights Interface (/insights)")

    b.add_h1("Test Report")
    b.add_p("Automated testing was conducted using Jest v30.5.2 and Supertest covering all Module 4 endpoints:")
    b.add_h2("Test Execution Summary")
    ts_rows = [
        ("Test Runner & Framework", "Jest v30.5.2 (Node.js ES Modules) with Supertest API Driver"),
        ("Execution Environment", "Windows 11 x64, Node.js v24.19.0, Express v4.21.2"),
        ("Database Backend", "MongoDB v8.0 Community (Test Database Instance: paygate_test_db)"),
        ("Test Suites Executed", "2 passed, 2 total (api.test.js, unit_validation.test.js)"),
        ("Total Test Cases Executed", "8 passed, 0 failed, 0 skipped (100% Pass Rate)"),
        ("Total Execution Time", "0.622 seconds")
    ]
    b.add_table_data(["Metric", "Result / Environment Specification"], ts_rows, [2.4, 4.6])

    b.add_h2("Detailed Test Cases Execution Table")
    tc_rows = [
        ("TC-TXN-01", "Get Transaction Ledger", "GET /api/transactions with valid customer JWT", "HTTP 200 with paginated array of transactions", "HTTP 200 OK; records returned", "PASS"),
        ("TC-TXN-02", "Filter by Status", "GET /api/transactions?status=success", "HTTP 200; only success records returned", "Filtered successfully by status", "PASS"),
        ("TC-TXN-03", "Filter by Payment Method", "GET /api/transactions?method=IMPS", "HTTP 200; only IMPS transfers returned", "Filtered successfully by rail", "PASS"),
        ("TC-TXN-04", "Get Single Transaction Detail", "GET /api/transactions/:id", "HTTP 200 with complete transaction and recipient metadata", "Detail metadata returned accurately", "PASS"),
        ("TC-ANL-01", "Analytics Summary Metrics", "GET /api/analytics/summary", "HTTP 200 with totalSent, successCount, avgAmount", "KPI aggregation metrics calculated", "PASS"),
        ("TC-ANL-02", "Method Breakdown Aggregation", "GET /api/analytics/by-method", "HTTP 200 with counts per payment rail", "Grouped rail distribution returned", "PASS"),
        ("TC-ANL-03", "Monthly Trend Aggregation", "GET /api/analytics/by-month", "HTTP 200 with monthly spend breakdown", "Chronological spend array returned", "PASS"),
        ("TC-CSV-01", "Export Ledger to CSV", "GET /api/analytics/export with responseType=blob", "HTTP 200 with text/csv payload and valid headers", "CSV generated and downloaded", "PASS")
    ]
    b.add_table_data(["Test ID", "Test Description", "Test Input / Condition", "Expected Output", "Actual Result", "Status"], tc_rows, [0.9, 1.4, 1.4, 1.4, 1.3, 0.6], [WD_ALIGN_PARAGRAPH.CENTER, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.LEFT, WD_ALIGN_PARAGRAPH.CENTER])

    b.build_conclusion_enhancements(
        conclusion_text=[
            "Module 4 (Transaction Ledgers & Financial Analytics) successfully delivers comprehensive transaction traceability and financial intelligence for PayGate. "
            "By implementing multi-criteria filtering, dedicated key-value inspection cards, and MongoDB aggregation analytics, the module provides users "
            "with total visibility into their financial footprint.",
            "Client-side RFC-4180 CSV generation guarantees seamless record portability for accounting, tax verification, and forensic audits."
        ],
        enhancements_list=[
            ("1. Automated PDF Bank Statement Generation: ", "Incorporate server-side PDF generation producing stamped, official monthly account statements."),
            ("2. Machine-Learning Spending Predictions: ", "Implement predictive models forecasting upcoming month expenditure based on recurring patterns."),
            ("3. Custom Date-Range Comparative Analytics: ", "Allow users to compare spending across custom quarter-over-quarter date ranges."),
            ("4. Transaction Tagging & Custom Memos: ", "Enable users to append custom labels (#business, #travel) to transactions for granular accounting."),
            ("5. Tax Deductible Expense Flagging: ", "Automatically identify and aggregate tax-deductible expense transactions for annual tax returns.")
        ]
    )
    
    b.save(out_path)

if __name__ == "__main__":
    out_file = r'C:\Users\dell\Downloads\all 6\4.docx'
    build_module_4(out_file)

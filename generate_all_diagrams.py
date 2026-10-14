import matplotlib.pyplot as plt
import matplotlib.patches as patches

FONT_FAMILY = 'DejaVu Sans'
plt.rcParams['font.sans-serif'] = [FONT_FAMILY, 'Arial', 'Helvetica']
plt.rcParams['font.family'] = 'sans-serif'

COLOR_NAVY = '#0F2747'
COLOR_SLATE = '#1C4670'
COLOR_TEAL = '#0D9488'
COLOR_RED = '#DC2626'
COLOR_BLUE = '#0284C7'
COLOR_AMBER = '#B45309'
COLOR_BORDER = '#CBD5E1'
COLOR_MUTED = '#64748B'
COLOR_DARK = '#1E293B'

def create_dfd():
    fig, ax = plt.subplots(figsize=(12, 8.5), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(6.0, 8.18, 'Module 6 — Data Flow Diagram (DFD Level 0 & Level 1)',
            fontsize=15, fontweight='bold', ha='center', color=COLOR_NAVY)
    ax.text(6.0, 7.88, 'Admin Operations, Monitoring & Error Audit Telemetry Flow',
            fontsize=10.5, fontstyle='italic', ha='center', color=COLOR_SLATE)
    ax.plot([0.5, 11.5], [7.68, 7.68], color=COLOR_NAVY, lw=1.5)

    ax.text(0.6, 7.42, 'Level 0 — Context Diagram (Admin Monitoring Boundary)',
            fontsize=11, fontweight='bold', color=COLOR_NAVY)

    rect_admin = patches.FancyBboxPatch((0.6, 5.5), 2.4, 1.4,
                                        boxstyle='round,pad=0.05,rounding_size=0.15',
                                        facecolor=COLOR_NAVY, edgecolor=COLOR_NAVY, lw=1.5)
    ax.add_patch(rect_admin)
    ax.text(1.8, 6.2, 'System Administrator\n(Authenticated Role)',
            ha='center', va='center', color='white', fontweight='bold', fontsize=9.2)

    proc_0 = patches.Circle((6.0, 6.2), 0.92,
                            facecolor='#F0F9FF', edgecolor=COLOR_BLUE, lw=2.2)
    ax.add_patch(proc_0)
    ax.plot([5.25, 6.75], [6.6, 6.6], color=COLOR_BLUE, lw=1.2)
    ax.text(6.0, 6.82, '0.0', ha='center', va='center',
            color=COLOR_BLUE, fontweight='bold', fontsize=10)
    ax.text(6.0, 6.1, 'PayGate Admin &\nTelemetry Console',
            ha='center', va='center', color=COLOR_NAVY, fontweight='bold', fontsize=8.8)

    rect_bank = patches.FancyBboxPatch((9.0, 5.5), 2.4, 1.4,
                                       boxstyle='round,pad=0.05,rounding_size=0.15',
                                       facecolor=COLOR_NAVY, edgecolor=COLOR_NAVY, lw=1.5)
    ax.add_patch(rect_bank)
    ax.text(10.2, 6.2, 'Transaction Engine\n& Mock Bank API',
            ha='center', va='center', color='white', fontweight='bold', fontsize=9.2)

    ax.annotate('', xy=(5.08, 6.55), xytext=(3.0, 6.55),
                arrowprops=dict(arrowstyle='->', color=COLOR_NAVY, lw=1.6))
    ax.text(4.04, 6.75, 'Audit Queries &\nFreeze Commands',
            ha='center', va='bottom', fontsize=7.8, fontweight='bold', color=COLOR_NAVY,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(3.0, 5.85), xytext=(5.08, 5.85),
                arrowprops=dict(arrowstyle='->', color=COLOR_BLUE, lw=1.6))
    ax.text(4.04, 5.65, 'Telemetry, KPIs\n& Error Feeds',
            ha='center', va='top', fontsize=7.8, fontweight='bold', color=COLOR_BLUE,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(6.92, 6.55), xytext=(9.0, 6.55),
                arrowprops=dict(arrowstyle='->', color=COLOR_RED, lw=1.6))
    ax.text(7.96, 6.75, 'Failure Signals\n& Stacks',
            ha='center', va='bottom', fontsize=7.8, fontweight='bold', color=COLOR_RED,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(9.0, 5.85), xytext=(6.92, 5.85),
                arrowprops=dict(arrowstyle='->', color=COLOR_TEAL, lw=1.6))
    ax.text(7.96, 5.65, 'Retry & Force\nResolution',
            ha='center', va='top', fontsize=7.8, fontweight='bold', color=COLOR_TEAL,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.plot([0.5, 11.5], [4.9, 4.9], color='#94A3B8', lw=1.2, ls='--')

    ax.text(0.6, 4.65, 'Level 1 — Subsystem Decomposition: Admin Operations & Telemetry Processes',
            fontsize=11, fontweight='bold', color=COLOR_NAVY)

    def draw_process(cx, cy, p_num, p_name, color, fill_color='#FFFFFF'):
        bubble = patches.Circle((cx, cy), 0.72,
                                facecolor=fill_color, edgecolor=color, lw=2.0)
        ax.add_patch(bubble)
        ax.plot([cx - 0.55, cx + 0.55], [cy + 0.28, cy + 0.28], color=color, lw=1.0)
        ax.text(cx, cy + 0.45, p_num, ha='center', va='center',
                fontsize=8.5, fontweight='bold', color=color)
        ax.text(cx, cy - 0.08, p_name, ha='center', va='center',
                fontsize=7.2, fontweight='bold', color=COLOR_NAVY)

    def draw_datastore(x, y, w, h, ds_id, ds_name):
        rect = patches.Rectangle((x, y), w, h, facecolor='#F8FAFC', edgecolor=COLOR_NAVY, lw=1.6)
        ax.add_patch(rect)
        ax.plot([x + 0.65, x + 0.65], [y, y + h], color=COLOR_NAVY, lw=1.4)
        ax.text(x + 0.32, y + h/2, ds_id, ha='center', va='center',
                fontweight='bold', fontsize=8.5, color=COLOR_NAVY)
        ax.text(x + 0.65 + (w - 0.65)/2, y + h/2, ds_name, ha='center', va='center',
                fontweight='bold', fontsize=8, color=COLOR_NAVY)

    draw_process(1.6, 3.3, '6.1', 'Metric & KPI\nAggregator', COLOR_BLUE, '#EFF6FF')
    draw_datastore(3.8, 2.9, 2.2, 0.8, 'D4', 'Transactions\nLedger')
    draw_process(7.8, 3.3, '6.2', 'Transaction &\nPending Auditor', COLOR_TEAL, '#F0FDFA')
    draw_process(10.5, 3.3, '6.3', 'Failure Ingestion &\nSeverity Classifier', COLOR_RED, '#FEF2F2')

    draw_datastore(0.6, 0.9, 2.1, 0.8, 'D1/D2', 'Users &\nWallets')
    draw_process(4.6, 1.3, '6.5', 'Account Freeze &\nSecurity Governor', COLOR_AMBER, '#FFFBEB')
    draw_process(7.4, 1.3, '6.4', 'Incident Triage &\nResolution Manager', COLOR_BLUE, '#EFF6FF')
    draw_datastore(9.5, 0.9, 2.0, 0.8, 'D5', 'ErrorLogs\nRepository')

    ax.annotate('', xy=(2.32, 3.3), xytext=(3.8, 3.3),
                arrowprops=dict(arrowstyle='->', color=COLOR_BLUE, lw=1.5))
    ax.text(3.06, 3.52, 'Aggregate counts', ha='center', va='bottom',
            fontsize=7.5, color=COLOR_BLUE, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(6.0, 3.45), xytext=(7.08, 3.45),
                arrowprops=dict(arrowstyle='->', color=COLOR_TEAL, lw=1.5))
    ax.annotate('', xy=(7.08, 3.15), xytext=(6.0, 3.15),
                arrowprops=dict(arrowstyle='->', color=COLOR_TEAL, lw=1.5))
    ax.text(6.54, 3.65, 'Audit &\nForce Settle', ha='center', va='bottom',
            fontsize=7.4, color=COLOR_TEAL, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(10.5, 1.7), xytext=(10.5, 2.58),
                arrowprops=dict(arrowstyle='->', color=COLOR_RED, lw=1.6))
    ax.text(10.65, 2.14, 'Log Incident\n& Severity', ha='left', va='center',
            fontsize=7.5, color=COLOR_RED, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(8.12, 1.45), xytext=(9.5, 1.45),
                arrowprops=dict(arrowstyle='->', color=COLOR_BLUE, lw=1.5))
    ax.annotate('', xy=(9.5, 1.15), xytext=(8.12, 1.15),
                arrowprops=dict(arrowstyle='->', color=COLOR_BLUE, lw=1.5))
    ax.text(8.81, 1.68, 'Triage &\nResolve Notes', ha='center', va='bottom',
            fontsize=7.4, color=COLOR_BLUE, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(2.7, 1.3), xytext=(3.88, 1.3),
                arrowprops=dict(arrowstyle='->', color=COLOR_AMBER, lw=1.6))
    ax.text(3.29, 1.52, 'Update isFrozen\n& isActive', ha='center', va='bottom',
            fontsize=7.4, color=COLOR_AMBER, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    rect_frame = patches.Rectangle((0.2, 0.3), 11.6, 8.0,
                                   facecolor='none', edgecolor=COLOR_BORDER, lw=1.2)
    ax.add_patch(rect_frame)

    plt.tight_layout()
    plt.savefig('mod6_dfd.png', dpi=300, bbox_inches='tight')
    plt.close()
    print('Generated mod6_dfd.png successfully.')

def create_er():
    fig, ax = plt.subplots(figsize=(12, 8.5), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(6.0, 8.18, 'Module 6 — Entity-Relationship Diagram (ERD)',
            fontsize=15, fontweight='bold', ha='center', color=COLOR_NAVY)
    ax.text(6.0, 7.88, 'Admin Operations, Transaction Audit & Error Telemetry Schema',
            fontsize=10.5, fontstyle='italic', ha='center', color=COLOR_SLATE)
    ax.plot([0.5, 11.5], [7.68, 7.68], color=COLOR_NAVY, lw=1.5)

    entities = [
        ('USER (Customer)', 0.6, 4.4, 2.6, 2.9, '#1E293B', [
            'PK _id : ObjectId',
            'firstName : String',
            'lastName : String',
            'email : String',
            'role : "customer"',
            'isActive : Boolean'
        ]),
        ('WALLET', 4.1, 4.4, 2.6, 2.9, '#0369A1', [
            'PK _id : ObjectId',
            'FK userId : ObjectId',
            'mainBalance : Number',
            'currency : "INR"',
            'isFrozen : Boolean',
            'updatedAt : Date'
        ]),
        ('TRANSACTION', 7.9, 4.4, 3.5, 3.0, '#0D9488', [
            'PK _id : ObjectId',
            'referenceCode : String',
            'FK senderWalletId : ObjectId',
            'amount : Number',
            'status : Enum [pending,success,fail]',
            'method : Enum [WALLET,IMPS,RTGS]',
            'failureReason : String',
            'createdAt : Date'
        ]),

        ('ADMIN_USER', 4.1, 0.7, 2.6, 2.9, '#0F2747', [
            'PK _id : ObjectId',
            'email : String (Unique)',
            'passwordHash : String',
            'role : "admin"',
            'isActive : Boolean',
            'createdAt : Date'
        ]),
        ('ERROR_LOG', 7.9, 0.6, 3.5, 3.1, '#B91C1C', [
            'PK _id : ObjectId',
            'FK transactionId : ObjectId',
            'errorCode : String',
            'severity : SeverityEnum [LOW..CRIT]',
            'message : String',
            'resolved : Boolean = false',
            'FK resolvedBy : ObjectId',
            'resolutionNotes : String'
        ])
    ]

    for name, x, y, w, h, color, attrs in entities:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle='square,pad=0',
                                      facecolor='#FFFFFF', edgecolor=color, lw=1.8)
        ax.add_patch(rect)
        header = patches.Rectangle((x, y + h - 0.45), w, 0.45, facecolor=color, edgecolor=color)
        ax.add_patch(header)
        ax.text(x + w/2, y + h - 0.23, name,
                ha='center', va='center', color='white', fontweight='bold', fontsize=9.2)

        line_y = y + h - 0.72
        for a in attrs:
            prefix = a.split()[0] if 'PK' in a or 'FK' in a else ''
            weight = 'bold' if prefix else 'normal'
            txt_color = '#B91C1C' if 'PK' in a else ('#0369A1' if 'FK' in a else '#334155')
            ax.text(x + 0.12, line_y, a, fontsize=7.8, fontweight=weight, color=txt_color, va='center')
            line_y -= 0.31

    ax.annotate('', xy=(4.1, 5.85), xytext=(3.2, 5.85),
                arrowprops=dict(arrowstyle='-', color=COLOR_NAVY, lw=1.6))
    ax.text(3.35, 6.05, '1', fontsize=9, fontweight='bold', color=COLOR_NAVY)
    ax.text(3.95, 6.05, '1', fontsize=9, fontweight='bold', color=COLOR_NAVY)
    ax.text(3.65, 5.6, 'owns', fontsize=8, fontstyle='italic', ha='center', color=COLOR_MUTED)

    ax.annotate('', xy=(7.9, 5.85), xytext=(6.7, 5.85),
                arrowprops=dict(arrowstyle='-', color=COLOR_NAVY, lw=1.6))
    ax.text(6.85, 6.05, '1', fontsize=9, fontweight='bold', color=COLOR_NAVY)
    ax.text(7.75, 6.05, 'N', fontsize=9, fontweight='bold', color=COLOR_NAVY)
    ax.text(7.3, 5.6, 'originates', fontsize=8, fontstyle='italic', ha='center', color=COLOR_MUTED)

    ax.annotate('', xy=(9.65, 3.7), xytext=(9.65, 4.4),
                arrowprops=dict(arrowstyle='->', color=COLOR_RED, lw=1.6))
    ax.text(9.8, 4.05, '1 : 0..1 triggers on failure',
            fontsize=8, fontweight='bold', color=COLOR_RED, va='center')

    ax.annotate('', xy=(5.4, 4.4), xytext=(5.4, 3.6),
                arrowprops=dict(arrowstyle='->', color=COLOR_AMBER, lw=1.6, ls=':'))
    ax.text(5.4, 4.0, 'toggles freeze\n/ security',
            fontsize=7.8, fontweight='bold', color=COLOR_AMBER, ha='center',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(7.9, 2.15), xytext=(6.7, 2.15),
                arrowprops=dict(arrowstyle='->', color=COLOR_NAVY, lw=1.6, ls='--'))
    ax.text(7.3, 2.4, '1 : N audits\n& resolves',
            fontsize=8.0, fontweight='bold', ha='center', color=COLOR_NAVY,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    leg_box = patches.FancyBboxPatch((0.6, 0.7), 2.6, 2.9,
                                    boxstyle='round,pad=0.05,rounding_size=0.1',
                                    facecolor='#F8FAFC', edgecolor=COLOR_BORDER, lw=1.2)
    ax.add_patch(leg_box)
    ax.text(0.8, 3.35, 'Cardinality & Notes:', fontweight='bold', fontsize=9, color=COLOR_NAVY)
    ax.text(0.8, 2.95, '• 1 : 1 User to Wallet ownership', fontsize=8, color=COLOR_DARK)
    ax.text(0.8, 2.6, '• 1 : N Wallet to Transactions', fontsize=8, color=COLOR_DARK)
    ax.text(0.8, 2.25, '• 1 : 0..1 Failure to ErrorLog', fontsize=8, color=COLOR_RED, fontweight='bold')
    ax.text(0.8, 1.9, '• 1 : N Admin resolution governance', fontsize=8, color=COLOR_NAVY)
    ax.text(0.8, 1.55, '• 1 : N Admin wallet freeze lock', fontsize=8, color=COLOR_AMBER)
    ax.text(0.8, 1.15, 'Severity Levels:\nLOW, MEDIUM, HIGH, CRITICAL',
            fontsize=7.8, color=COLOR_RED, fontweight='bold')

    rect_frame = patches.Rectangle((0.2, 0.3), 11.6, 8.0,
                                   facecolor='none', edgecolor=COLOR_BORDER, lw=1.2)
    ax.add_patch(rect_frame)

    plt.tight_layout()
    plt.savefig('mod6_er.png', dpi=300, bbox_inches='tight')
    plt.close()
    print('Generated mod6_er.png successfully.')

def create_usecase():
    fig, ax = plt.subplots(figsize=(12, 8.5), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(6.0, 8.18, 'Module 6 — Use Case Diagram',
            fontsize=15, fontweight='bold', ha='center', color=COLOR_NAVY)
    ax.text(6.0, 7.88, 'Administrator Privileges, Telemetry Monitoring & Error Resolution',
            fontsize=10.5, fontstyle='italic', ha='center', color=COLOR_SLATE)
    ax.plot([0.5, 11.5], [7.68, 7.68], color=COLOR_NAVY, lw=1.5)

    system_box = patches.FancyBboxPatch((3.3, 0.5), 8.3, 7.0,
                                        boxstyle='square,pad=0',
                                        facecolor='#F8FAFC', edgecolor=COLOR_NAVY, lw=1.8)
    ax.add_patch(system_box)
    ax.text(7.45, 7.22, 'Module 6 Subsystem Boundary: Admin & Monitoring Console',
            ha='center', fontsize=10.5, fontweight='bold', color=COLOR_NAVY)

    actor_x = 1.65
    actor_y = 4.2
    head = patches.Circle((actor_x, actor_y + 1.2), 0.28, facecolor=COLOR_NAVY, edgecolor=COLOR_NAVY)
    ax.add_patch(head)
    ax.plot([actor_x, actor_x], [actor_y + 0.92, actor_y + 0.0], color=COLOR_NAVY, lw=3)
    ax.plot([actor_x - 0.55, actor_x + 0.55], [actor_y + 0.55, actor_y + 0.55], color=COLOR_NAVY, lw=3)
    ax.plot([actor_x, actor_x - 0.45], [actor_y, actor_y - 0.95], color=COLOR_NAVY, lw=3)
    ax.plot([actor_x, actor_x + 0.45], [actor_y, actor_y - 0.95], color=COLOR_NAVY, lw=3)
    ax.text(actor_x, actor_y - 1.35, 'System Administrator\n(Authenticated Role)',
            ha='center', va='center', fontweight='bold', fontsize=9.2, color=COLOR_NAVY)

    core_use_cases = [
        ('View Platform Telemetry\n& Volume KPIs', 5.4, 6.55),
        ('Inspect System\nTransaction Ledger', 5.4, 5.65),
        ('Audit & Review\nPending Transactions', 5.4, 4.75),
        ('Inspect Error Logs\n& Stack Traces', 5.4, 3.85),
        ('Resolve Error Incidents\n(Single / Bulk)', 5.4, 2.95),
        ('Freeze / Unfreeze\nCustomer Wallets', 5.4, 2.05),
        ('Export Audit Ledger\nto CSV', 5.4, 1.15)
    ]

    ext_use_cases = [
        ('Force-Success / Force-Fail\nPending Txn', 9.8, 4.75),
        ('Filter Incidents by Severity\n(LOW – CRITICAL)', 9.8, 3.85)
    ]

    for title, ux, uy in core_use_cases:
        ellipse = patches.Ellipse((ux, uy), 3.4, 0.72, facecolor='#FFFFFF', edgecolor=COLOR_BLUE, lw=1.6)
        ax.add_patch(ellipse)
        ax.text(ux, uy, title, ha='center', va='center', fontsize=8.0, fontweight='bold', color=COLOR_NAVY)
        ax.plot([actor_x + 0.55, ux - 1.7], [actor_y + 0.35, uy], color='#64748B', lw=1.3, ls='-')

    for title, ux, uy in ext_use_cases:
        ellipse = patches.Ellipse((ux, uy), 3.2, 0.72, facecolor='#FFFFFF', edgecolor=COLOR_TEAL, lw=1.6)
        ax.add_patch(ellipse)
        ax.text(ux, uy, title, ha='center', va='center', fontsize=8.0, fontweight='bold', color=COLOR_NAVY)

    ax.annotate('', xy=(8.2, 4.75), xytext=(7.1, 4.75),
                arrowprops=dict(arrowstyle='->', color=COLOR_RED, lw=1.4, ls='--'))
    ax.text(7.65, 4.96, '<<include>>', fontsize=8.2, color=COLOR_RED, ha='center', fontweight='bold',
            bbox=dict(facecolor='#F8FAFC', edgecolor='none', pad=1))

    ax.annotate('', xy=(8.2, 3.85), xytext=(7.1, 3.85),
                arrowprops=dict(arrowstyle='->', color=COLOR_TEAL, lw=1.4, ls='--'))
    ax.text(7.65, 4.06, '<<extend>>', fontsize=8.2, color=COLOR_TEAL, ha='center', fontweight='bold',
            bbox=dict(facecolor='#F8FAFC', edgecolor='none', pad=1))

    rect_frame = patches.Rectangle((0.2, 0.3), 11.6, 8.0,
                                   facecolor='none', edgecolor=COLOR_BORDER, lw=1.2)
    ax.add_patch(rect_frame)

    plt.tight_layout()
    plt.savefig('mod6_usecase.png', dpi=300, bbox_inches='tight')
    plt.close()
    print('Generated mod6_usecase.png successfully.')

def create_class():
    fig, ax = plt.subplots(figsize=(12.5, 8.5), dpi=300)
    ax.set_xlim(0, 12.5)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(6.25, 8.18, 'Module 6 — Class Diagram',
            fontsize=15, fontweight='bold', ha='center', color=COLOR_NAVY)
    ax.text(6.25, 7.88, 'Controllers, Persistence Domain Models & Telemetry Store',
            fontsize=10.5, fontstyle='italic', ha='center', color=COLOR_SLATE)
    ax.plot([0.5, 12.0], [7.68, 7.68], color=COLOR_NAVY, lw=1.5)

    classes = [
        ('AdminController (Express Service)', 0.5, 4.2, 3.5, 3.4, COLOR_NAVY, [
            '<<service>>',
            '+ getStats(req, res) : Promise<JSON>',
            '+ getAllTransactions(req, res) : Promise<JSON>',
            '+ getTransactionById(req, res) : Promise<JSON>',
            '+ forceSuccess(req, res) : Promise<JSON>',
            '+ forceFail(req, res) : Promise<JSON>',
            '+ getErrors(req, res) : Promise<JSON>',
            '+ resolveError(req, res) : Promise<JSON>',
            '+ resolveAllErrors(req, res) : Promise<JSON>',
            '+ freezeUserWallet(req, res) : Promise<JSON>',
            '+ toggleUserActive(req, res) : Promise<JSON>'
        ]),
        ('ErrorLog (Mongoose Schema)', 4.5, 4.2, 3.5, 3.4, COLOR_RED, [
            '- _id : ObjectId',
            '- transactionId : ObjectId [Ref: Transaction]',
            '- errorCode : String',
            '- severity : SeverityEnum [LOW..CRITICAL]',
            '- message : String',
            '- resolved : Boolean = false',
            '- resolvedBy : ObjectId [Ref: User]',
            '- resolvedAt : Date',
            '- resolutionNotes : String',
            '----------------------------------------',
            '+ save() : Promise<ErrorLog>'
        ]),
        ('Transaction (Ledger Model)', 8.5, 4.2, 3.5, 3.4, COLOR_TEAL, [
            '- _id : ObjectId',
            '- referenceCode : String',
            '- senderWalletId : ObjectId [Ref: Wallet]',
            '- amount : Number',
            '- status : Enum [pending,success,failure]',
            '- method : Enum [WALLET,IMPS,NEFT,RTGS]',
            '- failureReason : String',
            '----------------------------------------',
            '+ post("save") : failureTelemetryHook()'
        ]),

        ('User (Account Model)', 0.5, 0.8, 3.5, 2.5, '#1E293B', [
            '- _id : ObjectId',
            '- email : String',
            '- role : String = "admin" | "customer"',
            '- isActive : Boolean = true',
            '----------------------------------------',
            '+ comparePassword(pwd) : Boolean'
        ]),
        ('Wallet (Balance Model)', 4.5, 0.8, 3.5, 2.5, '#0369A1', [
            '- _id : ObjectId',
            '- userId : ObjectId [Ref: User]',
            '- mainBalance : Number',
            '- isFrozen : Boolean = false',
            '----------------------------------------',
            '+ save({validateModifiedOnly})'
        ]),
        ('logsStore (Zustand State)', 8.5, 0.8, 3.5, 2.5, '#475569', [
            '- stats : StatsObject',
            '- errorLogs : Array<ErrorLog>',
            '----------------------------------------',
            '+ fetchStats() : void',
            '+ resolveError(id) : void',
            '+ freezeWallet(userId) : void'
        ])
    ]

    for name, x, y, w, h, color, members in classes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle='square,pad=0',
                                      facecolor='#FFFFFF', edgecolor=color, lw=1.8)
        ax.add_patch(rect)
        header = patches.Rectangle((x, y + h - 0.45), w, 0.45, facecolor=color, edgecolor=color)
        ax.add_patch(header)
        ax.text(x + w/2, y + h - 0.23, name,
                ha='center', va='center', color='white', fontweight='bold', fontsize=8.6)

        line_y = y + h - 0.68
        for m in members:
            if m.startswith('---'):
                ax.plot([x + 0.1, x + w - 0.1], [line_y, line_y], color=COLOR_BORDER, lw=1.0)
                line_y -= 0.16
                continue
            txt_color = COLOR_RED if '<<' in m else (COLOR_NAVY if '+' in m else '#334155')
            weight = 'bold' if '<<' in m else 'normal'
            ax.text(x + 0.12, line_y, m, fontsize=7.2, color=txt_color, fontweight=weight, va='center')
            line_y -= 0.23

    ax.annotate('', xy=(4.5, 5.9), xytext=(4.0, 5.9),
                arrowprops=dict(arrowstyle='->', color=COLOR_NAVY, lw=1.5))
    ax.text(4.25, 6.08, '1..*', fontsize=8, fontweight='bold', color=COLOR_NAVY, ha='center')

    ax.annotate('', xy=(8.5, 5.9), xytext=(8.0, 5.9),
                arrowprops=dict(arrowstyle='->', color=COLOR_RED, lw=1.5))
    ax.text(8.25, 6.08, '1', fontsize=8, fontweight='bold', color=COLOR_RED, ha='center')

    ax.annotate('', xy=(2.25, 3.3), xytext=(2.25, 4.2),
                arrowprops=dict(arrowstyle='->', color=COLOR_NAVY, lw=1.5))
    ax.text(2.35, 3.75, 'manages', fontsize=7.5, color=COLOR_NAVY, fontweight='bold')

    ax.annotate('', xy=(4.5, 3.3), xytext=(3.5, 4.2),
                arrowprops=dict(arrowstyle='->', color='#0369A1', lw=1.5))
    ax.text(4.2, 3.82, 'governs / freeze', fontsize=7.5, color='#0369A1', fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(4.5, 2.05), xytext=(4.0, 2.05),
                arrowprops=dict(arrowstyle='->', color=COLOR_NAVY, lw=1.5))
    ax.text(4.25, 2.22, '1 : 1', fontsize=7.5, color=COLOR_NAVY, fontweight='bold', ha='center')

    ax.annotate('', xy=(10.25, 4.2), xytext=(10.25, 3.3),
                arrowprops=dict(arrowstyle='->', color='#475569', lw=1.5, ls='--'))
    ax.text(10.35, 3.75, 'subscribes / updates', fontsize=7.5, color='#475569', fontweight='bold')

    rect_frame = patches.Rectangle((0.2, 0.3), 12.1, 8.0,
                                   facecolor='none', edgecolor=COLOR_BORDER, lw=1.2)
    ax.add_patch(rect_frame)

    plt.tight_layout()
    plt.savefig('mod6_class.png', dpi=300, bbox_inches='tight')
    plt.close()
    print('Generated mod6_class.png successfully.')

def create_sequence():
    fig, ax = plt.subplots(figsize=(12, 8.5), dpi=300)
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(6.0, 8.18, 'Module 6 — Sequence Diagram',
            fontsize=15, fontweight='bold', ha='center', color=COLOR_NAVY)
    ax.text(6.0, 7.88, 'Transaction Failure Telemetry Capture & Admin Incident Resolution Workflow',
            fontsize=10.5, fontstyle='italic', ha='center', color=COLOR_SLATE)
    ax.plot([0.5, 11.5], [7.68, 7.68], color=COLOR_NAVY, lw=1.5)

    lifelines = [
        ('Payment Gateway\nEngine', 1.3),
        ('Transaction\nSchema Hook', 3.5),
        ('ErrorLog\nDatabase', 5.8),
        ('Admin Monitoring\nUI Console', 8.2),
        ('System\nAdministrator', 10.5)
    ]

    for label, lx in lifelines:
        box = patches.FancyBboxPatch((lx - 0.9, 6.75), 1.8, 0.72,
                                     boxstyle='round,pad=0.05,rounding_size=0.1',
                                     facecolor=COLOR_NAVY, edgecolor=COLOR_NAVY)
        ax.add_patch(box)
        ax.text(lx, 7.11, label, ha='center', va='center', color='white', fontweight='bold', fontsize=8.0)
        ax.plot([lx, lx], [6.75, 0.6], color='#94A3B8', lw=1.2, ls='--')

    def draw_activation(lx, y_top, y_bot):
        bar = patches.Rectangle((lx - 0.08, y_bot), 0.16, y_top - y_bot,
                                facecolor='#F1F5F9', edgecolor=COLOR_NAVY, lw=1.2)
        ax.add_patch(bar)

    draw_activation(3.5, 6.35, 4.8)    # Schema hook during failure ingestion
    draw_activation(5.8, 5.2, 4.8)     # DB write
    draw_activation(8.2, 4.4, 2.5)     # UI during viewing & triage
    draw_activation(5.8, 4.0, 3.2)     # DB query
    draw_activation(10.5, 4.5, 4.3)    # Admin open console
    draw_activation(10.5, 2.2, 1.9)    # Admin click resolve
    draw_activation(8.2, 2.1, 0.8)     # UI during resolve
    draw_activation(5.8, 1.6, 1.0)     # DB update

    ax.annotate('', xy=(3.42, 6.2), xytext=(1.38, 6.2),
                arrowprops=dict(arrowstyle='->', color=COLOR_RED, lw=1.6))
    ax.text(2.36, 6.38, '1. Txn status="failure"\n(e.g. BANK_TIMEOUT)',
            ha='center', va='bottom', fontsize=7.6, color=COLOR_RED, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.plot([3.58, 4.25, 4.25, 3.58], [5.75, 5.75, 5.35, 5.35], color=COLOR_RED, lw=1.4)
    ax.annotate('', xy=(3.58, 5.35), xytext=(3.7, 5.35),
                arrowprops=dict(arrowstyle='->', color=COLOR_RED, lw=1.4))
    ax.text(4.35, 5.55, '2. Map failureReason\nto Severity (CRITICAL)',
            ha='left', va='center', fontsize=7.4, color=COLOR_RED, fontweight='bold')

    ax.annotate('', xy=(5.72, 4.95), xytext=(3.58, 4.95),
                arrowprops=dict(arrowstyle='->', color=COLOR_RED, lw=1.6))
    ax.text(4.65, 5.14, '3. ErrorLog.create({ ... })',
            ha='center', va='bottom', fontsize=7.6, color=COLOR_RED, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(8.28, 4.35), xytext=(10.42, 4.35),
                arrowprops=dict(arrowstyle='->', color=COLOR_NAVY, lw=1.6))
    ax.text(9.35, 4.54, '4. Open /admin/monitoring',
            ha='center', va='bottom', fontsize=7.6, color=COLOR_NAVY, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(5.88, 3.8), xytext=(8.12, 3.8),
                arrowprops=dict(arrowstyle='->', color=COLOR_BLUE, lw=1.6))
    ax.text(7.0, 3.99, '5. GET /api/admin/errors?resolved=false',
            ha='center', va='bottom', fontsize=7.4, color=COLOR_BLUE,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(8.12, 3.25), xytext=(5.88, 3.25),
                arrowprops=dict(arrowstyle='->', color=COLOR_BLUE, lw=1.6, ls='--'))
    ax.text(7.0, 3.44, '6. Return 200 OK [Unresolved ErrorLogs]',
            ha='center', va='bottom', fontsize=7.4, color=COLOR_BLUE,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(10.42, 2.7), xytext=(8.28, 2.7),
                arrowprops=dict(arrowstyle='->', color=COLOR_NAVY, lw=1.6))
    ax.text(9.35, 2.89, '7. Render Telemetry & Error Table',
            ha='center', va='bottom', fontsize=7.6, color=COLOR_NAVY,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(8.28, 2.05), xytext=(10.42, 2.05),
                arrowprops=dict(arrowstyle='->', color=COLOR_TEAL, lw=1.6))
    ax.text(9.35, 2.24, '8. Click "Resolve" + Enter Notes',
            ha='center', va='bottom', fontsize=7.6, color=COLOR_TEAL, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(5.88, 1.5), xytext=(8.12, 1.5),
                arrowprops=dict(arrowstyle='->', color=COLOR_TEAL, lw=1.6))
    ax.text(7.0, 1.69, '9. POST /api/admin/errors/:id/resolve',
            ha='center', va='bottom', fontsize=7.4, color=COLOR_TEAL, fontweight='bold',
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    ax.annotate('', xy=(8.12, 0.95), xytext=(5.88, 0.95),
                arrowprops=dict(arrowstyle='->', color=COLOR_TEAL, lw=1.6, ls='--'))
    ax.text(7.0, 1.14, '10. Incident Marked Resolved (Audit Complete)',
            ha='center', va='bottom', fontsize=7.4, color=COLOR_TEAL,
            bbox=dict(facecolor='white', edgecolor='none', pad=2))

    rect_frame = patches.Rectangle((0.2, 0.3), 11.6, 8.0,
                                   facecolor='none', edgecolor=COLOR_BORDER, lw=1.2)
    ax.add_patch(rect_frame)

    plt.tight_layout()
    plt.savefig('mod6_sequence.png', dpi=300, bbox_inches='tight')
    plt.close()
    print('Generated mod6_sequence.png successfully.')

if __name__ == '__main__':
    create_dfd()
    create_er()
    create_usecase()
    create_class()
    create_sequence()
    print('All 5 diagrams successfully generated!')

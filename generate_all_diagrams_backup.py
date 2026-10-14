import matplotlib.pyplot as plt
import matplotlib.patches as patches

def create_er():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    
    ax.text(5.5, 8.1, 'Module 6 — Entity-Relationship Diagram (ERD)', fontsize=15, fontweight='bold', ha='center', color='#0F2747')
    ax.text(5.5, 7.8, 'Admin Operations, Transaction Audit & Error Telemetry Schema', fontsize=11, fontstyle='italic', ha='center', color='#1C4670')
    ax.plot([0.5, 10.5], [7.6, 7.6], color='#0F2747', lw=1.5)
    
    entities = [
        ('ADMIN_USER', 0.8, 4.6, 2.6, 2.5, '#0F2747', [
            'PK _id : ObjectId',
            'email : String (Unique)',
            'passwordHash : String',
            'role : "admin"',
            'isActive : Boolean',
            'createdAt : Date'
        ]),
        ('USER (Customer)', 0.8, 1.2, 2.6, 2.6, '#1E293B', [
            'PK _id : ObjectId',
            'firstName : String',
            'lastName : String',
            'email : String',
            'role : "customer"',
            'isActive : Boolean'
        ]),
        ('WALLET', 4.2, 1.2, 2.6, 2.6, '#0369A1', [
            'PK _id : ObjectId',
            'FK userId : ObjectId',
            'mainBalance : Number',
            'currency : "INR"',
            'isFrozen : Boolean',
            'updatedAt : Date'
        ]),
        ('TRANSACTION', 4.2, 4.6, 2.6, 2.7, '#0D9488', [
            'PK _id : ObjectId',
            'referenceCode : String',
            'FK senderWalletId : ObjectId',
            'amount : Number',
            'status : Enum',
            'method : Enum',
            'failureReason : String',
            'createdAt : Date'
        ]),
        ('ERROR_LOG', 7.6, 4.6, 2.8, 2.7, '#B91C1C', [
            'PK _id : ObjectId',
            'FK transactionId : ObjectId',
            'errorCode : String',
            'severity : SeverityEnum',
            'message : String',
            'resolved : Boolean',
            'FK resolvedBy : ObjectId',
            'resolutionNotes : String'
        ])
    ]
    
    for name, x, y, w, h, color, attrs in entities:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle='square,pad=0', facecolor='#FFFFFF', edgecolor=color, lw=1.8)
        ax.add_patch(rect)
        header = patches.Rectangle((x, y+h-0.45), w, 0.45, facecolor=color, edgecolor=color)
        ax.add_patch(header)
        ax.text(x + w/2, y+h-0.23, name, ha='center', va='center', color='white', fontweight='bold', fontsize=9.5)
        line_y = y + h - 0.75
        for a in attrs:
            prefix = a.split()[0] if 'PK' in a or 'FK' in a else ''
            weight = 'bold' if prefix else 'normal'
            txt_color = '#B91C1C' if 'PK' in a else ('#0369A1' if 'FK' in a else '#334155')
            ax.text(x + 0.12, line_y, a, fontsize=7.8, fontweight=weight, color=txt_color, va='center')
            line_y -= 0.32

    ax.annotate('', xy=(4.2, 2.5), xytext=(3.4, 2.5), arrowprops=dict(arrowstyle='-', color='#0F2747', lw=1.5))
    ax.text(3.5, 2.65, '1', fontsize=9, fontweight='bold', color='#0F2747')
    ax.text(4.0, 2.65, '1', fontsize=9, fontweight='bold', color='#0F2747')
    ax.text(3.8, 2.2, 'owns', fontsize=8, fontstyle='italic', ha='center', color='#64748B')
    
    ax.annotate('', xy=(5.5, 4.6), xytext=(5.5, 3.8), arrowprops=dict(arrowstyle='-', color='#0F2747', lw=1.5))
    ax.text(5.65, 3.9, '1', fontsize=9, fontweight='bold', color='#0F2747')
    ax.text(5.65, 4.4, 'N', fontsize=9, fontweight='bold', color='#0F2747')
    ax.text(5.1, 4.15, 'originates', fontsize=8, fontstyle='italic', ha='center', color='#64748B')
    
    ax.annotate('', xy=(7.6, 5.95), xytext=(6.8, 5.95), arrowprops=dict(arrowstyle='-', color='#B91C1C', lw=1.5))
    ax.text(6.9, 6.1, '1', fontsize=9, fontweight='bold', color='#B91C1C')
    ax.text(7.4, 6.1, '0..1', fontsize=9, fontweight='bold', color='#B91C1C')
    ax.text(7.2, 5.65, 'triggers failure', fontsize=8, fontstyle='italic', ha='center', color='#B91C1C')
    
    ax.annotate('', xy=(7.6, 6.9), xytext=(3.4, 6.9), arrowprops=dict(arrowstyle='->', color='#0F2747', lw=1.5, ls='--'))
    ax.text(5.5, 7.05, '1 : N audits & resolves', fontsize=8.5, fontweight='bold', ha='center', color='#0F2747')
    
    ax.annotate('', xy=(4.2, 3.4), xytext=(2.1, 4.6), arrowprops=dict(arrowstyle='->', color='#B45309', lw=1.5, ls=':'))
    ax.text(3.3, 4.1, 'toggles freeze / security', fontsize=8, fontweight='bold', color='#B45309', rotation=-30)

    leg_box = patches.Rectangle((7.6, 1.2), 2.8, 2.5, facecolor='#F8FAFC', edgecolor='#CBD5E1', lw=1)
    ax.add_patch(leg_box)
    ax.text(7.8, 3.4, 'Cardinality & Notes:', fontweight='bold', fontsize=9, color='#0F2747')
    ax.text(7.8, 3.0, '• 1 : 1 User to Wallet ownership', fontsize=8, color='#334155')
    ax.text(7.8, 2.65, '• 1 : N Wallet to Transactions', fontsize=8, color='#334155')
    ax.text(7.8, 2.3, '• 1 : 0..1 Failure to ErrorLog trigger', fontsize=8, color='#B91C1C')
    ax.text(7.8, 1.95, '• 1 : N Admin resolution governance', fontsize=8, color='#0F2747')
    ax.text(7.8, 1.6, '• Severity: LOW, MEDIUM, HIGH, CRITICAL', fontsize=7.5, color='#B91C1C', fontweight='bold')

    plt.savefig('mod6_er.png', bbox_inches='tight')
    plt.close()
    print('Generated mod6_er.png')

def create_usecase():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    
    ax.text(5.5, 8.1, 'Module 6 — Use Case Diagram', fontsize=15, fontweight='bold', ha='center', color='#0F2747')
    ax.text(5.5, 7.8, 'Administrator Privileges, Telemetry Monitoring & Error Resolution', fontsize=11, fontstyle='italic', ha='center', color='#1C4670')
    ax.plot([0.5, 10.5], [7.6, 7.6], color='#0F2747', lw=1.5)
    
    system_box = patches.FancyBboxPatch((3.2, 0.6), 7.2, 6.7, boxstyle='square,pad=0', facecolor='#F8FAFC', edgecolor='#0F2747', lw=1.8)
    ax.add_patch(system_box)
    ax.text(6.8, 7.05, 'Module 6 Subsystem Boundary: Admin & Monitoring Console', ha='center', fontsize=10.5, fontweight='bold', color='#0F2747')
    
    ax.plot([1.5], [5.8], 'o', ms=18, mfc='#0F2747', mec='#0F2747') # Head
    ax.plot([1.5, 1.5], [5.6, 4.6], color='#0F2747', lw=3)          # Body
    ax.plot([1.1, 1.9], [5.2, 5.2], color='#0F2747', lw=3)          # Arms
    ax.plot([1.5, 1.1], [4.6, 3.8], color='#0F2747', lw=3)          # Leg L
    ax.plot([1.5, 1.9], [4.6, 3.8], color='#0F2747', lw=3)          # Leg R
    ax.text(1.5, 3.4, 'System Administrator\n(Authenticated Role)', ha='center', fontweight='bold', fontsize=9.5, color='#0F2747')

    use_cases = [
        ('View Platform Telemetry & Volume KPIs', 5.0, 6.4),
        ('Inspect System Transaction Ledger', 5.0, 5.5),
        ('Audit & Review Pending Transactions', 5.0, 4.6),
        ('Force-Success / Force-Fail Pending Txn', 8.5, 4.6),
        ('Inspect Error Logs & Stack Traces', 5.0, 3.7),
        ('Filter Incidents by Severity (LOW-CRITICAL)', 8.5, 3.7),
        ('Resolve Error Incidents (Single/Bulk)', 5.0, 2.8),
        ('Freeze / Unfreeze Customer Wallets', 5.0, 1.9),
        ('Export Audit Ledger to CSV', 5.0, 1.0)
    ]
    
    for title, ux, uy in use_cases:
        ellipse = patches.Ellipse((ux, uy), 2.9, 0.62, facecolor='#FFFFFF', edgecolor='#0284C7', lw=1.5)
        ax.add_patch(ellipse)
        ax.text(ux, uy, title, ha='center', va='center', fontsize=7.8, fontweight='bold', color='#0F2747')
        
        if ux == 5.0:
            ax.plot([1.9, 3.55], [5.0, uy], color='#64748B', lw=1.2, ls='-')

    ax.annotate('', xy=(7.05, 4.6), xytext=(6.45, 4.6), arrowprops=dict(arrowstyle='->', color='#B91C1C', lw=1.2, ls='--'))
    ax.text(6.75, 4.8, '<<include>>', fontsize=7.5, color='#B91C1C', ha='center', fontweight='bold')
    
    ax.annotate('', xy=(7.05, 3.7), xytext=(6.45, 3.7), arrowprops=dict(arrowstyle='->', color='#0D9488', lw=1.2, ls='--'))
    ax.text(6.75, 3.9, '<<extend>>', fontsize=7.5, color='#0D9488', ha='center', fontweight='bold')

    plt.savefig('mod6_usecase.png', bbox_inches='tight')
    plt.close()
    print('Generated mod6_usecase.png')

def create_class():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    
    ax.text(5.5, 8.1, 'Module 6 — Class Diagram', fontsize=15, fontweight='bold', ha='center', color='#0F2747')
    ax.text(5.5, 7.8, 'Controllers, Persistence Domain Models & Telemetry Store', fontsize=11, fontstyle='italic', ha='center', color='#1C4670')
    ax.plot([0.5, 10.5], [7.6, 7.6], color='#0F2747', lw=1.5)

    classes = [
        ('AdminController (Express Service)', 0.6, 4.4, 3.3, 3.0, '#0F2747', [
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
        ('ErrorLog (Mongoose Schema)', 4.2, 4.4, 3.2, 3.0, '#B91C1C', [
            '- _id : ObjectId',
            '- transactionId : ObjectId [Ref: Transaction]',
            '- errorCode : String',
            '- severity : SeverityEnum [LOW..CRITICAL]',
            '- message : String',
            '- resolved : Boolean = false',
            '- resolvedBy : ObjectId [Ref: User]',
            '- resolvedAt : Date',
            '- resolutionNotes : String',
            '+ save() : Promise<ErrorLog>'
        ]),
        ('Transaction (Ledger Model)', 7.6, 4.4, 3.0, 3.0, '#0D9488', [
            '- _id : ObjectId',
            '- referenceCode : String',
            '- senderWalletId : ObjectId [Ref: Wallet]',
            '- amount : Number',
            '- status : Enum [pending,success,failure]',
            '- method : Enum [WALLET,IMPS,NEFT,RTGS]',
            '- failureReason : String',
            '+ post("save") : failureTelemetryHook()'
        ]),
        ('User (Account Model)', 0.6, 0.8, 3.0, 2.6, '#1E293B', [
            '- _id : ObjectId',
            '- email : String',
            '- role : String = "admin"|"customer"',
            '- isActive : Boolean = true',
            '+ comparePassword(pwd) : Boolean'
        ]),
        ('Wallet (Balance Model)', 4.2, 0.8, 3.0, 2.6, '#0369A1', [
            '- _id : ObjectId',
            '- userId : ObjectId [Ref: User]',
            '- mainBalance : Number',
            '- isFrozen : Boolean = false',
            '+ save({validateModifiedOnly})'
        ]),
        ('logsStore (Zustand State)', 7.6, 0.8, 3.0, 2.6, '#475569', [
            '- stats : StatsObject',
            '- errorLogs : Array<ErrorLog>',
            '+ fetchStats() : void',
            '+ resolveError(id) : void',
            '+ freezeWallet(userId) : void'
        ])
    ]

    for name, x, y, w, h, color, members in classes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle='square,pad=0', facecolor='#FFFFFF', edgecolor=color, lw=1.8)
        ax.add_patch(rect)
        header = patches.Rectangle((x, y+h-0.45), w, 0.45, facecolor=color, edgecolor=color)
        ax.add_patch(header)
        ax.text(x + w/2, y+h-0.23, name, ha='center', va='center', color='white', fontweight='bold', fontsize=8.5)
        line_y = y + h - 0.7
        for m in members:
            txt_color = '#B91C1C' if '<<' in m else ('#0F2747' if '+' in m else '#334155')
            weight = 'bold' if '<<' in m else 'normal'
            ax.text(x + 0.1, line_y, m, fontsize=7.2, color=txt_color, fontweight=weight, va='center')
            line_y -= 0.24

    ax.annotate('', xy=(4.2, 5.9), xytext=(3.9, 5.9), arrowprops=dict(arrowstyle='->', color='#0F2747', lw=1.5))
    ax.text(4.05, 6.05, '1..*', fontsize=8, fontweight='bold', color='#0F2747')
    
    ax.annotate('', xy=(7.6, 5.9), xytext=(7.4, 5.9), arrowprops=dict(arrowstyle='->', color='#B91C1C', lw=1.5))
    ax.text(7.5, 6.05, '1', fontsize=8, fontweight='bold', color='#B91C1C')
    
    ax.annotate('', xy=(2.0, 3.4), xytext=(2.0, 4.4), arrowprops=dict(arrowstyle='->', color='#0F2747', lw=1.5))
    ax.annotate('', xy=(4.5, 3.4), xytext=(3.5, 4.4), arrowprops=dict(arrowstyle='->', color='#0369A1', lw=1.5))

    plt.savefig('mod6_class.png', bbox_inches='tight')
    plt.close()
    print('Generated mod6_class.png')

def create_sequence():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    
    ax.text(5.5, 8.1, 'Module 6 — Sequence Diagram', fontsize=15, fontweight='bold', ha='center', color='#0F2747')
    ax.text(5.5, 7.8, 'Transaction Failure Telemetry Capture & Admin Incident Resolution Workflow', fontsize=11, fontstyle='italic', ha='center', color='#1C4670')
    ax.plot([0.5, 10.5], [7.6, 7.6], color='#0F2747', lw=1.5)

    lifelines = [
        ('Payment Gateway\nEngine', 1.2),
        ('Transaction\nSchema Hook', 3.2),
        ('ErrorLog\nDatabase', 5.2),
        ('Admin Monitoring\nUI Console', 7.4),
        ('System\nAdministrator', 9.5)
    ]

    for label, lx in lifelines:
        box = patches.FancyBboxPatch((lx-0.85, 6.7), 1.7, 0.7, boxstyle='square,pad=0', facecolor='#0F2747', edgecolor='#0F2747')
        ax.add_patch(box)
        ax.text(lx, 7.05, label, ha='center', va='center', color='white', fontweight='bold', fontsize=7.8)
        ax.plot([lx, lx], [6.7, 0.8], color='#94A3B8', lw=1.2, ls='--')

    ax.annotate('', xy=(3.2, 6.2), xytext=(1.2, 6.2), arrowprops=dict(arrowstyle='->', color='#DC2626', lw=1.5))
    ax.text(2.2, 6.35, '1. Txn status="failure"\n(e.g. BANK_TIMEOUT)', ha='center', fontsize=7.5, color='#B91C1C', fontweight='bold')

    ax.annotate('', xy=(3.2, 5.5), xytext=(3.2, 5.9), arrowprops=dict(arrowstyle='->', color='#B91C1C', lw=1.2, connectionstyle='arc3,rad=0.4'))
    ax.text(3.7, 5.7, '2. Map failureReason\nto Severity (CRITICAL)', fontsize=7.2, color='#B91C1C')

    ax.annotate('', xy=(5.2, 5.1), xytext=(3.2, 5.1), arrowprops=dict(arrowstyle='->', color='#B91C1C', lw=1.5))
    ax.text(4.2, 5.25, '3. ErrorLog.create({...})', ha='center', fontsize=7.5, color='#B91C1C', fontweight='bold')

    ax.annotate('', xy=(7.4, 4.4), xytext=(9.5, 4.4), arrowprops=dict(arrowstyle='->', color='#0F2747', lw=1.5))
    ax.text(8.45, 4.55, '4. Open /admin/monitoring', ha='center', fontsize=7.5, color='#0F2747', fontweight='bold')

    ax.annotate('', xy=(5.2, 3.8), xytext=(7.4, 3.8), arrowprops=dict(arrowstyle='->', color='#0369A1', lw=1.5))
    ax.text(6.3, 3.95, '5. GET /api/admin/errors?resolved=false', ha='center', fontsize=7.2, color='#0369A1')

    ax.annotate('', xy=(7.4, 3.2), xytext=(5.2, 3.2), arrowprops=dict(arrowstyle='->', color='#0369A1', lw=1.5, ls='--'))
    ax.text(6.3, 3.35, '6. Return 200 OK [Unresolved ErrorLogs]', ha='center', fontsize=7.2, color='#0369A1')

    ax.annotate('', xy=(9.5, 2.6), xytext=(7.4, 2.6), arrowprops=dict(arrowstyle='->', color='#0F2747', lw=1.5))
    ax.text(8.45, 2.75, '7. Render Telemetry & Error Table', ha='center', fontsize=7.5, color='#0F2747')

    ax.annotate('', xy=(7.4, 2.0), xytext=(9.5, 2.0), arrowprops=dict(arrowstyle='->', color='#0D9488', lw=1.5))
    ax.text(8.45, 2.15, '8. Click "Resolve" + Enter Notes', ha='center', fontsize=7.5, color='#0D9488', fontweight='bold')

    ax.annotate('', xy=(5.2, 1.4), xytext=(7.4, 1.4), arrowprops=dict(arrowstyle='->', color='#0D9488', lw=1.5))
    ax.text(6.3, 1.55, '9. POST /api/admin/errors/:id/resolve', ha='center', fontsize=7.2, color='#0D9488', fontweight='bold')

    ax.annotate('', xy=(7.4, 0.9), xytext=(5.2, 0.9), arrowprops=dict(arrowstyle='->', color='#0D9488', lw=1.5, ls='--'))
    ax.text(6.3, 1.05, '10. Incident Marked Resolved (Audit Complete)', ha='center', fontsize=7.2, color='#0D9488')

    plt.savefig('mod6_sequence.png', bbox_inches='tight')
    plt.close()
    print('Generated mod6_sequence.png')

create_er()
create_usecase()
create_class()
create_sequence()

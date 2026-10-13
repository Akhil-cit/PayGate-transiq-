import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs("verified_diagrams", exist_ok=True)

# Common styling constants
NAVY = "#0F2747"
SLATE = "#1C4670"
TEAL = "#0D9488"
BORDER = "#CBD5E1"
BG_LIGHT = "#F8FAFC"
RED = "#B91C1C"
BLUE = "#0284C7"
GREEN = "#16A34A"

# =============================================================================
# MODULE 1: CLASS DIAGRAM & SEQUENCE DIAGRAM
# =============================================================================

def create_mod1_class():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    
    ax.text(5.5, 8.1, 'Module 1 — Class Diagram: Customer Dashboard & Smart Pockets', fontsize=14, fontweight='bold', ha='center', color=NAVY)
    ax.text(5.5, 7.8, 'Express Controllers, Mongoose Persistence Schemas & Zustand Store', fontsize=10.5, fontstyle='italic', ha='center', color=SLATE)
    ax.plot([0.5, 10.5], [7.6, 7.6], color=NAVY, lw=1.5)

    classes = [
        ('PocketController (Express Service)', 0.6, 4.4, 3.2, 3.0, NAVY, [
            '<<service>>',
            '+ list(req, res) : Promise<JSON>',
            '+ create(req, res) : Promise<JSON>',
            '+ update(req, res) : Promise<JSON>',
            '+ deposit(req, res) : Promise<JSON>',
            '+ withdraw(req, res) : Promise<JSON>',
            '+ toggleLock(req, res) : Promise<JSON>',
            '+ remove(req, res) : Promise<JSON>'
        ]),
        ('Pocket (Mongoose Schema)', 4.2, 4.4, 3.1, 3.0, TEAL, [
            '- _id : ObjectId',
            '- walletId : ObjectId [Ref: Wallet]',
            '- userId : ObjectId [Ref: User]',
            '- name : String',
            '- targetAmount : Number',
            '- currentAmount : Number = 0',
            '- isLocked : Boolean = false',
            '- createdAt : Date',
            '+ save() : Promise<Pocket>'
        ]),
        ('Wallet (Mongoose Schema)', 7.6, 4.4, 2.9, 3.0, BLUE, [
            '- _id : ObjectId',
            '- userId : ObjectId [Ref: User]',
            '- mainBalance : Number = 50000',
            '- currency : String = "INR"',
            '- isFrozen : Boolean = false',
            '- createdAt : Date',
            '- updatedAt : Date',
            '+ save({validateModifiedOnly})'
        ]),
        ('CustomerController', 0.6, 0.8, 3.2, 2.6, SLATE, [
            '<<service>>',
            '+ getMe(req, res) : Promise<JSON>',
            '+ updateMe(req, res) : Promise<JSON>',
            '+ dashboard(req, res) : Promise<JSON>'
        ]),
        ('User (Mongoose Schema)', 4.2, 0.8, 3.1, 2.6, '#334155', [
            '- _id : ObjectId',
            '- firstName : String',
            '- lastName : String',
            '- email : String',
            '- phone : String',
            '- role : String = "customer"',
            '- isActive : Boolean = true'
        ]),
        ('usePocketStore (Zustand Store)', 7.6, 0.8, 2.9, 2.6, '#475569', [
            '- pockets : Array<Pocket>',
            '- loading : Boolean',
            '+ fetchPockets() : void',
            '+ createPocket(data) : void',
            '+ deposit(id, amount) : void',
            '+ withdraw(id, amount) : void',
            '+ toggleLock(id) : void'
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
            txt_color = RED if '<<' in m else (NAVY if '+' in m else '#334155')
            weight = 'bold' if '<<' in m else 'normal'
            ax.text(x + 0.1, line_y, m, fontsize=7.2, color=txt_color, fontweight=weight, va='center')
            line_y -= 0.24

    # Connectors
    ax.annotate('', xy=(4.2, 5.9), xytext=(3.8, 5.9), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.5))
    ax.text(4.0, 6.05, '1..*', fontsize=8, fontweight='bold', color=NAVY)

    ax.annotate('', xy=(7.6, 5.9), xytext=(7.3, 5.9), arrowprops=dict(arrowstyle='->', color=TEAL, lw=1.5))
    ax.text(7.45, 6.05, '1', fontsize=8, fontweight='bold', color=TEAL)

    ax.annotate('', xy=(5.7, 3.4), xytext=(5.7, 4.4), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.5))
    ax.text(5.85, 3.9, '1', fontsize=8, fontweight='bold', color=NAVY)

    plt.savefig('verified_diagrams/mod1_class.png', bbox_inches='tight')
    plt.close()
    print("Generated verified_diagrams/mod1_class.png")


def create_mod1_sequence():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(5.5, 8.1, 'Module 1 — Sequence Diagram: Smart Pocket Fund Reallocation Flow', fontsize=14, fontweight='bold', ha='center', color=NAVY)
    ax.text(5.5, 7.8, 'Customer Deposit, Lock Enforcement & Guarded Withdrawal Execution', fontsize=10.5, fontstyle='italic', ha='center', color=SLATE)
    ax.plot([0.5, 10.5], [7.6, 7.6], color=NAVY, lw=1.5)

    lifelines = [
        ('Customer User\n(Client)', 1.2),
        ('usePocketStore\n(Zustand)', 3.2),
        ('pocketController\n(Express API)', 5.4),
        ('Wallet Model\n(MongoDB)', 7.6),
        ('Pocket Model\n(MongoDB)', 9.6)
    ]

    for label, lx in lifelines:
        box = patches.FancyBboxPatch((lx-0.85, 6.7), 1.7, 0.7, boxstyle='square,pad=0', facecolor=NAVY, edgecolor=NAVY)
        ax.add_patch(box)
        ax.text(lx, 7.05, label, ha='center', va='center', color='white', fontweight='bold', fontsize=7.8)
        ax.plot([lx, lx], [6.7, 0.8], color='#94A3B8', lw=1.2, ls='--')

    # Steps
    # Step 1: User deposits funds
    ax.annotate('', xy=(3.2, 6.2), xytext=(1.2, 6.2), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.5))
    ax.text(2.2, 6.35, '1. Click "Deposit" (₹5,000)', ha='center', fontsize=7.5, color=NAVY, fontweight='bold')

    # Step 2: Store dispatches POST
    ax.annotate('', xy=(5.4, 5.7), xytext=(3.2, 5.7), arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.5))
    ax.text(4.3, 5.85, '2. POST /api/pockets/:id/deposit\n{ amount: 5000 } [Bearer JWT]', ha='center', fontsize=7.2, color=BLUE)

    # Step 3: Controller verifies balance
    ax.annotate('', xy=(7.6, 5.2), xytext=(5.4, 5.2), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.5))
    ax.text(6.5, 5.35, '3. Wallet.findOne({ userId })\nCheck mainBalance >= 5000', ha='center', fontsize=7.2, color=NAVY)

    # Step 4: Atomic deduction
    ax.annotate('', xy=(7.6, 4.6), xytext=(7.6, 4.9), arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.2, connectionstyle='arc3,rad=0.4'))
    ax.text(8.1, 4.75, '4. mainBalance -= 5000\nwallet.save()', fontsize=7.2, color=GREEN, fontweight='bold')

    # Step 5: Increment pocket
    ax.annotate('', xy=(9.6, 4.2), xytext=(5.4, 4.2), arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.5))
    ax.text(7.5, 4.35, '5. pocket.currentAmount += 5000; save()', ha='center', fontsize=7.2, color=GREEN, fontweight='bold')

    # Step 6: Success response
    ax.annotate('', xy=(3.2, 3.6), xytext=(5.4, 3.6), arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.5, ls='--'))
    ax.text(4.3, 3.75, '6. HTTP 200 OK { success: true }', ha='center', fontsize=7.2, color=BLUE)

    # Step 7: UI Update
    ax.annotate('', xy=(1.2, 3.1), xytext=(3.2, 3.1), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.5))
    ax.text(2.2, 3.25, '7. Update Progress Bar & Balances', ha='center', fontsize=7.5, color=NAVY)

    # Step 8: User attempts withdrawal from locked pocket
    ax.annotate('', xy=(5.4, 2.5), xytext=(1.2, 2.5), arrowprops=dict(arrowstyle='->', color=RED, lw=1.5))
    ax.text(3.3, 2.65, '8. Request Withdraw from Locked Pocket (isLocked=true)', ha='center', fontsize=7.2, color=RED, fontweight='bold')

    # Step 9: Controller checks isLocked
    ax.annotate('', xy=(9.6, 2.0), xytext=(5.4, 2.0), arrowprops=dict(arrowstyle='->', color=RED, lw=1.2))
    ax.text(7.5, 2.15, '9. Check pocket.isLocked === true', ha='center', fontsize=7.2, color=RED)

    # Step 10: 403 Forbidden rejection
    ax.annotate('', xy=(1.2, 1.4), xytext=(5.4, 1.4), arrowprops=dict(arrowstyle='->', color=RED, lw=1.5, ls='--'))
    ax.text(3.3, 1.55, '10. HTTP 403 Forbidden: "Pocket is locked. Withdrawals blocked."', ha='center', fontsize=7.2, color=RED, fontweight='bold')

    plt.savefig('verified_diagrams/mod1_sequence.png', bbox_inches='tight')
    plt.close()
    print("Generated verified_diagrams/mod1_sequence.png")


# =============================================================================
# MODULE 3: DFD, ER DIAGRAM & USE CASE DIAGRAM
# =============================================================================

def create_mod3_dfd():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')
    
    ax.text(5.5, 8.1, 'Module 3 — Data Flow Diagram (DFD Level 0 & Level 1)', fontsize=14, fontweight='bold', ha='center', color=NAVY)
    ax.text(5.5, 7.8, 'Idempotent Payment Initiation, Multi-Rail Checkout & My Wallet OTP Flow', fontsize=10.5, fontstyle='italic', ha='center', color=SLATE)
    ax.plot([0.5, 10.5], [7.6, 7.6], color=NAVY, lw=1.5)
    
    # Level 0 Context Diagram
    ax.text(0.8, 7.3, 'Level 0 — Context Diagram (Payment Checkout & Bank Linking Boundary)', fontsize=11, fontweight='bold', color=NAVY)
    
    # Entity: Customer
    b_cust = patches.FancyBboxPatch((0.8, 5.8), 2.2, 1.1, boxstyle='square,pad=0', facecolor=NAVY, edgecolor=NAVY)
    ax.add_patch(b_cust)
    ax.text(1.9, 6.45, 'Customer User\n(Remitter)', ha='center', va='center', color='white', fontweight='bold', fontsize=9.5)
    
    # Process 3.0
    c_p3 = patches.Circle((5.5, 6.35), 0.9, facecolor='#F0F9FF', edgecolor=BLUE, lw=2)
    ax.add_patch(c_p3)
    ax.text(5.5, 6.45, '3.0\nPayGate Payment Engine\n& My Wallet Subsystem', ha='center', va='center', color=NAVY, fontweight='bold', fontsize=9)
    
    # Entity: Banking Partner
    b_bank = patches.FancyBboxPatch((8.0, 5.8), 2.2, 1.1, boxstyle='square,pad=0', facecolor='#1E293B', edgecolor='#1E293B')
    ax.add_patch(b_bank)
    ax.text(9.1, 6.45, 'External Banking API\n(Simulated Rails)', ha='center', va='center', color='white', fontweight='bold', fontsize=9.5)
    
    # Arrows L0
    ax.annotate('', xy=(4.6, 6.6), xytext=(3.0, 6.6), arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.5))
    ax.text(3.8, 6.75, 'Beneficiary, Rail, PIN & OTP', ha='center', fontsize=7.5, color=NAVY)
    
    ax.annotate('', xy=(3.0, 6.1), xytext=(4.6, 6.1), arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.5))
    ax.text(3.8, 5.85, 'TXN ID, Receipt, Balances', ha='center', fontsize=7.5, color=NAVY)
    
    ax.annotate('', xy=(8.0, 6.6), xytext=(6.4, 6.6), arrowprops=dict(arrowstyle='->', color=TEAL, lw=1.5))
    ax.text(7.2, 6.75, 'Settlement Transfer Request', ha='center', fontsize=7.5, color=TEAL)
    
    ax.annotate('', xy=(6.4, 6.1), xytext=(8.0, 6.1), arrowprops=dict(arrowstyle='->', color=TEAL, lw=1.5))
    ax.text(7.2, 5.85, 'Settlement Acknowledgement', ha='center', fontsize=7.5, color=TEAL)

    # Divider
    ax.plot([0.5, 10.5], [5.3, 5.3], color='#CBD5E1', lw=1, ls='--')

    # Level 1 DFD
    ax.text(0.8, 5.0, 'Level 1 — Subsystem Decomposition: Payment Initiation & Bank Linking Processes', fontsize=11, fontweight='bold', color=NAVY)

    procs = [
        ('3.1\nBeneficiary & Rail\nConfigurator', 2.0, 3.8),
        ('3.2\nPre-Flight Balance &\nTXN Stamping', 5.5, 3.8),
        ('3.3\nPIN Authorization &\nSettlement Engine', 9.0, 3.8),
        ('3.4\nBank Account Linking &\nOTP Verification', 3.5, 1.8),
        ('3.5\nIdempotent Retry &\nReceipt Generator', 7.5, 1.8)
    ]
    
    for label, x, y in procs:
        c = patches.Circle((x, y), 0.75, facecolor='#F8FAFC', edgecolor=SLATE, lw=1.8)
        ax.add_patch(c)
        ax.text(x, y, label, ha='center', va='center', fontsize=7.5, fontweight='bold', color=NAVY)
        
    stores = [
        ('D3 Receipts (Beneficiaries)', 2.0, 2.6),
        ('D4 Transactions Ledger', 5.5, 2.8),
        ('D2 Wallets & D6 BankAccounts', 7.5, 0.7)
    ]
    
    for sname, sx, sy in stores:
        ax.plot([sx-1.3, sx+1.3], [sy+0.25, sy+0.25], color=NAVY, lw=1.5)
        ax.plot([sx-1.3, sx+1.3], [sy-0.25, sy-0.25], color=NAVY, lw=1.5)
        ax.plot([sx-1.3, sx-1.3], [sy-0.25, sy+0.25], color=NAVY, lw=1.5)
        ax.fill_between([sx-1.3, sx+1.3], [sy-0.25, sy-0.25], [sy+0.25, sy+0.25], color='#F1F5F9')
        ax.text(sx, sy, sname, ha='center', va='center', fontsize=7.8, fontweight='bold', color=NAVY)

    # Connecting arrows
    ax.annotate('', xy=(2.0, 3.05), xytext=(2.0, 3.05), arrowprops=dict(arrowstyle='<->', color=BLUE, lw=1.2))
    ax.annotate('', xy=(5.5, 3.05), xytext=(5.5, 3.05), arrowprops=dict(arrowstyle='<->', color=GREEN, lw=1.2))
    ax.annotate('', xy=(7.5, 1.05), xytext=(7.5, 1.05), arrowprops=dict(arrowstyle='<->', color=TEAL, lw=1.2))

    plt.savefig('verified_diagrams/mod3_dfd.png', bbox_inches='tight')
    plt.close()
    print("Generated verified_diagrams/mod3_dfd.png")


def create_mod3_er():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(5.5, 8.1, 'Module 3 — Entity-Relationship Diagram (ERD)', fontsize=14, fontweight='bold', ha='center', color=NAVY)
    ax.text(5.5, 7.8, 'Payment Initiation, Transaction Ledger & Connected Bank Accounts Schema', fontsize=10.5, fontstyle='italic', ha='center', color=SLATE)
    ax.plot([0.5, 10.5], [7.6, 7.6], color=NAVY, lw=1.5)

    entities = [
        ('USER (Customer)', 0.8, 4.6, 2.6, 2.5, '#1E293B', [
            'PK _id : ObjectId',
            'firstName : String',
            'lastName : String',
            'email : String (Unique)',
            'phone : String (10 Digits)',
            'role : "customer"',
            'isActive : Boolean'
        ]),
        ('WALLET', 0.8, 1.2, 2.6, 2.6, BLUE, [
            'PK _id : ObjectId',
            'FK userId : ObjectId',
            'mainBalance : Number',
            'currency : "INR"',
            'isFrozen : Boolean',
            'updatedAt : Date'
        ]),
        ('BANK_ACCOUNT', 4.2, 1.2, 2.8, 2.6, TEAL, [
            'PK _id : ObjectId',
            'FK userId : ObjectId',
            'name : String',
            'accountNumber : String',
            'maskedNumber : String',
            'balance : Number = 25000',
            'status : Enum [ACTIVE, INACTIVE]'
        ]),
        ('RECEIPT (Beneficiary)', 4.2, 4.6, 2.8, 2.7, SLATE, [
            'PK _id : ObjectId',
            'FK userId : ObjectId',
            'name : String',
            'bankName : String',
            'accountNumber : String',
            'ifscCode : String',
            'referenceCode : String'
        ]),
        ('TRANSACTION', 7.6, 3.2, 2.8, 3.8, GREEN, [
            'PK _id : ObjectId',
            'referenceCode : String (TXN-XXXX)',
            'FK senderWalletId : ObjectId',
            'FK recipientId : ObjectId',
            'amount : Number',
            'method : Enum [WALLET,IMPS,NEFT,RTGS]',
            'type : String = "transfer"',
            'status : Enum [pending,success,failure]',
            'description : String',
            'failureReason : String',
            'createdAt : Date'
        ])
    ]

    for name, x, y, w, h, color, attrs in entities:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle='square,pad=0', facecolor='#FFFFFF', edgecolor=color, lw=1.8)
        ax.add_patch(rect)
        header = patches.Rectangle((x, y+h-0.45), w, 0.45, facecolor=color, edgecolor=color)
        ax.add_patch(header)
        ax.text(x + w/2, y+h-0.23, name, ha='center', va='center', color='white', fontweight='bold', fontsize=9)
        line_y = y + h - 0.72
        for a in attrs:
            prefix = a.split()[0] if 'PK' in a or 'FK' in a else ''
            weight = 'bold' if prefix else 'normal'
            txt_color = RED if 'PK' in a else (BLUE if 'FK' in a else '#334155')
            ax.text(x + 0.12, line_y, a, fontsize=7.6, fontweight=weight, color=txt_color, va='center')
            line_y -= 0.30

    # Relationships
    # USER -> WALLET (1:1)
    ax.annotate('', xy=(2.1, 3.8), xytext=(2.1, 4.6), arrowprops=dict(arrowstyle='-', color=NAVY, lw=1.5))
    ax.text(2.25, 4.2, '1 : 1 owns', fontsize=8, color=NAVY, fontweight='bold')

    # USER -> BANK_ACCOUNT (1:N)
    ax.annotate('', xy=(4.2, 2.5), xytext=(3.4, 4.8), arrowprops=dict(arrowstyle='-', color=NAVY, lw=1.5))
    ax.text(3.7, 3.7, '1 : N links', fontsize=8, color=NAVY, fontweight='bold')

    # USER -> RECEIPT (1:N)
    ax.annotate('', xy=(4.2, 5.8), xytext=(3.4, 5.8), arrowprops=dict(arrowstyle='-', color=NAVY, lw=1.5))
    ax.text(3.8, 6.0, '1 : N saves', fontsize=8, color=NAVY, fontweight='bold')

    # WALLET -> TRANSACTION (1:N)
    ax.annotate('', xy=(7.6, 4.5), xytext=(3.4, 2.2), arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.5))
    ax.text(5.5, 3.2, '1 : N funds', fontsize=8, color=BLUE, fontweight='bold')

    # RECEIPT -> TRANSACTION (1:N)
    ax.annotate('', xy=(7.6, 5.5), xytext=(7.0, 5.5), arrowprops=dict(arrowstyle='->', color=SLATE, lw=1.5))
    ax.text(7.1, 5.7, '1 : N receives', fontsize=8, color=SLATE, fontweight='bold')

    plt.savefig('verified_diagrams/mod3_er.png', bbox_inches='tight')
    plt.close()
    print("Generated verified_diagrams/mod3_er.png")


def create_mod3_usecase():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(5.5, 8.1, 'Module 3 — Use Case Diagram: Payment Initiation & My Wallet', fontsize=14, fontweight='bold', ha='center', color=NAVY)
    ax.text(5.5, 7.8, 'Customer Payment Initiation, Rail Selection & Bank Account Linking', fontsize=10.5, fontstyle='italic', ha='center', color=SLATE)
    ax.plot([0.5, 10.5], [7.6, 7.6], color=NAVY, lw=1.5)

    # Boundary box
    system_box = patches.FancyBboxPatch((3.2, 0.6), 7.2, 6.7, boxstyle='square,pad=0', facecolor=BG_LIGHT, edgecolor=NAVY, lw=1.8)
    ax.add_patch(system_box)
    ax.text(6.8, 7.05, 'Module 3 Subsystem Boundary: Payment Initiation & Bank Linking', ha='center', fontsize=10, fontweight='bold', color=NAVY)

    # Actor: Customer
    ax.plot([1.5], [5.8], 'o', ms=18, mfc=NAVY, mec=NAVY)
    ax.plot([1.5, 1.5], [5.6, 4.6], color=NAVY, lw=3)
    ax.plot([1.1, 1.9], [5.2, 5.2], color=NAVY, lw=3)
    ax.plot([1.5, 1.1], [4.6, 3.8], color=NAVY, lw=3)
    ax.plot([1.5, 1.9], [4.6, 3.8], color=NAVY, lw=3)
    ax.text(1.5, 3.4, 'Customer User\n(Authenticated)', ha='center', fontweight='bold', fontsize=9.5, color=NAVY)

    use_cases = [
        ('Initiate Funds Transfer (/send-money)', 5.0, 6.4),
        ('Select Verified Beneficiary Counterparty', 5.0, 5.5),
        ('Configure Rail (WALLET/IMPS/NEFT/RTGS)', 5.0, 4.6),
        ('Authorize Transfer with 4-Digit PIN', 8.5, 4.6),
        ('View & Print Digital Payment Receipt', 5.0, 3.7),
        ('Idempotent Retry of In-Flight Transfer', 8.5, 3.7),
        ('Link External Bank Account via +91 Phone', 5.0, 2.8),
        ('Verify 6-Digit OTP for Bank Connection', 8.5, 2.8),
        ('View Connected Multi-Bank Balances', 5.0, 1.9)
    ]

    for title, ux, uy in use_cases:
        ellipse = patches.Ellipse((ux, uy), 2.9, 0.62, facecolor='#FFFFFF', edgecolor=BLUE, lw=1.5)
        ax.add_patch(ellipse)
        ax.text(ux, uy, title, ha='center', va='center', fontsize=7.6, fontweight='bold', color=NAVY)
        
        if ux == 5.0:
            ax.plot([1.9, 3.55], [5.0, uy], color='#64748B', lw=1.2, ls='-')

    # <<include>> connectors
    ax.annotate('', xy=(7.05, 4.6), xytext=(6.45, 4.6), arrowprops=dict(arrowstyle='->', color=RED, lw=1.2, ls='--'))
    ax.text(6.75, 4.8, '<<include>>', fontsize=7.5, color=RED, ha='center', fontweight='bold')

    ax.annotate('', xy=(7.05, 3.7), xytext=(6.45, 3.7), arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.2, ls='--'))
    ax.text(6.75, 3.9, '<<extend>>', fontsize=7.5, color=GREEN, ha='center', fontweight='bold')

    ax.annotate('', xy=(7.05, 2.8), xytext=(6.45, 2.8), arrowprops=dict(arrowstyle='->', color=RED, lw=1.2, ls='--'))
    ax.text(6.75, 3.0, '<<include>>', fontsize=7.5, color=RED, ha='center', fontweight='bold')

    plt.savefig('verified_diagrams/mod3_usecase.png', bbox_inches='tight')
    plt.close()
    print("Generated verified_diagrams/mod3_usecase.png")


def create_mod3_class():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(5.5, 8.1, 'Module 3 — Class Diagram: Payment Initiation & Connected Bank Accounts', fontsize=14, fontweight='bold', ha='center', color=NAVY)
    ax.text(5.5, 7.8, 'Express Services, Mongoose Domain Schemas & React Zustand Stores', fontsize=10.5, fontstyle='italic', ha='center', color=SLATE)
    ax.plot([0.5, 10.5], [7.6, 7.6], color=NAVY, lw=1.5)

    classes = [
        ('PaymentController (Express Service)', 0.6, 4.4, 3.2, 3.0, NAVY, [
            '<<service>>',
            '+ initiatePayment(req, res) : Promise<JSON>',
            '+ validateDetails(req, res) : Promise<JSON>',
            '+ authorizePin(req, res) : Promise<JSON>',
            '+ retryPayment(req, res) : Promise<JSON>',
            '+ getTransactionHistory(req, res) : Promise<JSON>'
        ]),
        ('Transaction (Mongoose Schema)', 4.2, 4.4, 3.1, 3.0, GREEN, [
            '- _id : ObjectId',
            '- referenceCode : String (TXN-XXXX)',
            '- senderWalletId : ObjectId [Ref: Wallet]',
            '- recipientId : ObjectId [Ref: Receipt]',
            '- amount : Number',
            '- method : Enum [WALLET,IMPS,NEFT,RTGS]',
            '- status : Enum [pending,success,failure]',
            '- description : String',
            '- createdAt : Date',
            '+ save() : Promise<Transaction>'
        ]),
        ('BankAccount (Mongoose Schema)', 7.6, 4.4, 2.9, 3.0, TEAL, [
            '- _id : ObjectId',
            '- userId : ObjectId [Ref: User]',
            '- name : String',
            '- accountNumber : String',
            '- maskedNumber : String',
            '- balance : Number = 25000',
            '- status : Enum [ACTIVE, INACTIVE]',
            '- createdAt : Date',
            '+ save() : Promise<BankAccount>'
        ]),
        ('BankController (Express Service)', 0.6, 0.8, 3.2, 2.6, SLATE, [
            '<<service>>',
            '+ listAccounts(req, res) : Promise<JSON>',
            '+ initiateLinking(req, res) : Promise<JSON>',
            '+ verifyOtp(req, res) : Promise<JSON>',
            '+ removeAccount(req, res) : Promise<JSON>'
        ]),
        ('usePaymentStore (Zustand Store)', 4.2, 0.8, 3.1, 2.6, BLUE, [
            '- step : Number (1..4)',
            '- recipient : Object',
            '- amount : Number',
            '- paymentRail : String',
            '+ setStep(n) : void',
            '+ setAmount(amt) : void',
            '+ authorize(pin) : Promise<Boolean>'
        ]),
        ('useBankStore (Zustand Store)', 7.6, 0.8, 2.9, 2.6, '#475569', [
            '- connectedAccounts : Array<BankAccount>',
            '- isOtpModalOpen : Boolean',
            '- linkingPhone : String',
            '+ fetchAccounts() : Promise<void>',
            '+ sendOtp(phone) : Promise<void>',
            '+ verifyOtp(code) : Promise<Boolean>'
        ])
    ]

    for name, x, y, w, h, color, members in classes:
        rect = patches.FancyBboxPatch((x, y), w, h, boxstyle='square,pad=0', facecolor='#FFFFFF', edgecolor=color, lw=1.8)
        ax.add_patch(rect)
        header = patches.Rectangle((x, y+h-0.45), w, 0.45, facecolor=color, edgecolor=color)
        ax.add_patch(header)
        ax.text(x + w/2, y+h-0.23, name, ha='center', va='center', color='white', fontweight='bold', fontsize=8.2)
        line_y = y + h - 0.7
        for m in members:
            txt_color = RED if '<<' in m else (NAVY if '+' in m else '#334155')
            weight = 'bold' if '<<' in m else 'normal'
            ax.text(x + 0.1, line_y, m, fontsize=7.2, color=txt_color, fontweight=weight, va='center')
            line_y -= 0.24

    # Connectors
    ax.annotate('', xy=(4.2, 5.9), xytext=(3.8, 5.9), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.5))
    ax.text(4.0, 6.05, '1..*', fontsize=8, fontweight='bold', color=NAVY)

    ax.annotate('', xy=(7.6, 5.9), xytext=(7.3, 5.9), arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.5))
    ax.text(7.45, 6.05, '1..*', fontsize=8, fontweight='bold', color=GREEN)

    ax.annotate('', xy=(2.2, 3.4), xytext=(2.2, 4.4), arrowprops=dict(arrowstyle='->', color=SLATE, lw=1.5))
    ax.text(2.35, 3.9, 'uses', fontsize=8, fontweight='bold', color=SLATE)

    plt.savefig('verified_diagrams/mod3_class.png', bbox_inches='tight')
    plt.close()
    print("Generated verified_diagrams/mod3_class.png")


def create_mod3_sequence():
    fig, ax = plt.subplots(figsize=(11, 8.5), dpi=300)
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    ax.text(5.5, 8.1, 'Module 3 — Sequence Diagram: Idempotent Payment Authorization Flow', fontsize=14, fontweight='bold', ha='center', color=NAVY)
    ax.text(5.5, 7.8, '4-Step Checkout Initiation, Cryptographic PIN Check & Atomic Settlement', fontsize=10.5, fontstyle='italic', ha='center', color=SLATE)
    ax.plot([0.5, 10.5], [7.6, 7.6], color=NAVY, lw=1.5)

    lifelines = [
        ('Customer (Remitter)\nBrowser Client', 1.1),
        ('PaymentFlow\nReact Container', 3.0),
        ('auth.js\nJWT Guard', 4.9),
        ('paymentController\nExpress Engine', 6.8),
        ('Wallet / Bank\nMongoDB Schema', 8.7),
        ('Transaction\nLedger Doc', 10.2)
    ]

    for label, lx in lifelines:
        box = patches.FancyBboxPatch((lx-0.8, 6.7), 1.6, 0.7, boxstyle='square,pad=0', facecolor=NAVY, edgecolor=NAVY)
        ax.add_patch(box)
        ax.text(lx, 7.05, label, ha='center', va='center', color='white', fontweight='bold', fontsize=7.2)
        ax.plot([lx, lx], [6.7, 0.8], color='#94A3B8', lw=1.2, ls='--')

    # Steps
    # Step 1: User enters amount & PIN
    ax.annotate('', xy=(3.0, 6.2), xytext=(1.1, 6.2), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.5))
    ax.text(2.05, 6.35, '1. Select Beneficiary & Enter PIN', ha='center', fontsize=7.2, color=NAVY, fontweight='bold')

    # Step 2: React posts authorize-pin
    ax.annotate('', xy=(4.9, 5.7), xytext=(3.0, 5.7), arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.5))
    ax.text(3.95, 5.85, '2. POST /api/payment/authorize-pin\n{ pin: "1234", amount: 5000, recipientId }', ha='center', fontsize=6.8, color=BLUE)

    # Step 3: Auth middleware verifies token
    ax.annotate('', xy=(6.8, 5.1), xytext=(4.9, 5.1), arrowprops=dict(arrowstyle='->', color=TEAL, lw=1.5))
    ax.text(5.85, 5.25, '3. Verify Bearer JWT &\nuser.isActive === true', ha='center', fontsize=7.0, color=TEAL)

    # Step 4: Verify PIN & Check freeze
    ax.annotate('', xy=(6.8, 4.5), xytext=(6.8, 4.8), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.2, connectionstyle='arc3,rad=0.4'))
    ax.text(7.4, 4.65, '4. Validate PIN (1234) &\nCheck !wallet.isFrozen', fontsize=7.0, color=NAVY, fontweight='bold')

    # Step 5: Check balance & debit
    ax.annotate('', xy=(8.7, 4.1), xytext=(6.8, 4.1), arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.5))
    ax.text(7.75, 4.25, '5. Check mainBalance >= 5000;\nmainBalance -= 5000; save()', ha='center', fontsize=7.0, color=GREEN, fontweight='bold')

    # Step 6: Create transaction record
    ax.annotate('', xy=(10.2, 3.5), xytext=(6.8, 3.5), arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.5))
    ax.text(8.5, 3.65, '6. Transaction.create({ status: "success", TXN-XXXX })', ha='center', fontsize=7.0, color=GREEN, fontweight='bold')

    # Step 7: Ledger response
    ax.annotate('', xy=(6.8, 2.9), xytext=(10.2, 2.9), arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.2, ls='--'))
    ax.text(8.5, 3.05, '7. Ledger Document Saved', ha='center', fontsize=7.0, color=GREEN)

    # Step 8: Success JSON
    ax.annotate('', xy=(3.0, 2.3), xytext=(6.8, 2.3), arrowprops=dict(arrowstyle='->', color=BLUE, lw=1.5, ls='--'))
    ax.text(4.9, 2.45, '8. HTTP 200 OK { status: "success", referenceCode }', ha='center', fontsize=7.0, color=BLUE)

    # Step 9: Render Receipt Modal
    ax.annotate('', xy=(1.1, 1.7), xytext=(3.0, 1.7), arrowprops=dict(arrowstyle='->', color=NAVY, lw=1.5))
    ax.text(2.05, 1.85, '9. Display Step 4 Receipt Modal with Print Action', ha='center', fontsize=7.0, color=NAVY, fontweight='bold')

    # Alternate condition: Insufficient funds
    ax.annotate('', xy=(1.1, 1.1), xytext=(6.8, 1.1), arrowprops=dict(arrowstyle='->', color=RED, lw=1.2, ls=':'))
    ax.text(3.95, 1.25, '[Alt: Insufficient Funds] HTTP 400 Bad Request { reason: "Insufficient balance" }', ha='center', fontsize=6.8, color=RED, fontweight='bold')

    plt.savefig('verified_diagrams/mod3_sequence.png', bbox_inches='tight')
    plt.close()
    print("Generated verified_diagrams/mod3_sequence.png")


if __name__ == '__main__':
    create_mod1_class()
    create_mod1_sequence()
    create_mod3_dfd()
    create_mod3_er()
    create_mod3_usecase()
    create_mod3_class()
    create_mod3_sequence()
    print("All targeted verified diagrams created successfully!")


import subprocess
import time
import os
import urllib.request
from playwright.sync_api import sync_playwright

def wait_for_url(url, timeout=30):
    start = time.time()
    while time.time() - start < timeout:
        try:
            req = urllib.request.urlopen(url)
            if req.status in [200, 304, 404]:
                return True
        except Exception:
            time.sleep(1)
    return False

def main():
    print("Starting backend and frontend...")
    env = os.environ.copy()
    
    backend_proc = subprocess.Popen(
        ["node", "server.js"],
        cwd=r"D:\Clg\python lab\MERN PROJECT\transiq-api",
        shell=True,
        env=env
    )
    
    frontend_proc = subprocess.Popen(
        ["npm.cmd", "run", "dev"],
        cwd=r"D:\Clg\python lab\MERN PROJECT\Transiq",
        shell=True,
        env=env
    )
    
    try:
        print("Waiting for backend on http://localhost:5000...")
        wait_for_url("http://localhost:5000", timeout=25)
        print("Waiting for frontend on http://localhost:5173...")
        wait_for_url("http://localhost:5173", timeout=25)
        time.sleep(2)
        
        os.makedirs("module_screenshots", exist_ok=True)
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1.5)
            page = context.new_page()
            
            # -------------------------------------------------------------
            # MODULE 1: Customer Auth, Dashboard & Smart Pockets
            # -------------------------------------------------------------
            print("Capturing Module 1: Customer Login...")
            page.goto("http://localhost:5173/login", wait_until="networkidle")
            page.wait_for_timeout(1000)
            page.screenshot(path="module_screenshots/mod1_customer_login.png")
            
            # Log in as Customer
            print("Logging in as Customer Arjun Mehta...")
            page.fill('input[type="email"]', 'arjun@paygate.com')
            page.fill('input[type="password"]', 'Password@123')
            page.click('button[type="submit"]')
            page.wait_for_timeout(2500)
            
            print("Capturing Module 1: Customer Dashboard...")
            page.goto("http://localhost:5173/", wait_until="networkidle")
            page.wait_for_timeout(1500)
            page.screenshot(path="module_screenshots/mod1_customer_dashboard.png")
            
            # -------------------------------------------------------------
            # MODULE 2: Recipient / Beneficiary Management
            # -------------------------------------------------------------
            print("Capturing Module 2: Recipient Directory...")
            page.goto("http://localhost:5173/recipients", wait_until="networkidle")
            page.wait_for_timeout(1500)
            page.screenshot(path="module_screenshots/mod2_recipient_list.png")
            
            # Click 'Add Beneficiary' or 'Add Recipient' if button exists
            try:
                add_btn = page.locator('button:has-text("Add"), button:has-text("New Recipient")').first
                if add_btn.is_visible():
                    add_btn.click()
                    page.wait_for_timeout(1000)
                    page.screenshot(path="module_screenshots/mod2_add_recipient_modal.png")
                    # Close modal if escape or close
                    page.keyboard.press("Escape")
                    page.wait_for_timeout(500)
            except Exception as e:
                print("Could not open Add Recipient modal:", e)
                
            # -------------------------------------------------------------
            # MODULE 3: Payment Initiation & My Wallet
            # -------------------------------------------------------------
            print("Capturing Module 3: Payment Initiation Wizard...")
            page.goto("http://localhost:5173/send-money", wait_until="networkidle")
            page.wait_for_timeout(1500)
            page.screenshot(path="module_screenshots/mod3_payment_step1.png")
            
            # Step through wizard if possible
            try:
                recip_card = page.locator('.recipient-card, .participant-card, [role="button"]').first
                if recip_card.is_visible():
                    recip_card.click()
                    page.wait_for_timeout(1000)
                    page.screenshot(path="module_screenshots/mod3_payment_step2.png")
            except Exception as e:
                print("Could not advance payment step:", e)
                
            # My Wallet page (wallet / accounts)
            print("Capturing Module 3: My Wallet & Bank Linking...")
            page.goto("http://localhost:5173/my-wallet", wait_until="networkidle")
            page.wait_for_timeout(1500)
            page.screenshot(path="module_screenshots/mod3_my_wallet.png")
            
            # Try to open Add Bank Account modal on My Wallet
            try:
                add_bank_btn = page.locator('button:has-text("Add Bank"), button:has-text("Link Account"), button:has-text("Connect")').first
                if add_bank_btn.is_visible():
                    add_bank_btn.click()
                    page.wait_for_timeout(1000)
                    page.screenshot(path="module_screenshots/mod3_add_bank_modal.png")
                    page.keyboard.press("Escape")
            except Exception as e:
                print("Could not open bank modal:", e)

            # -------------------------------------------------------------
            # MODULE 4: Transactions, Financial Analytics & Insights
            # -------------------------------------------------------------
            print("Capturing Module 4: Transactions Ledger...")
            page.goto("http://localhost:5173/transactions", wait_until="networkidle")
            page.wait_for_timeout(1500)
            page.screenshot(path="module_screenshots/mod4_transactions_ledger.png")
            
            # View detail (Eye icon)
            try:
                eye_btn = page.locator('button.view, button:has(.lucide-eye)').first
                if eye_btn.is_visible():
                    eye_btn.click()
                    page.wait_for_timeout(1000)
                    page.screenshot(path="module_screenshots/mod4_transaction_detail.png")
            except Exception as e:
                print("Could not click eye button:", e)
                
            print("Capturing Module 4: Financial Analytics...")
            page.goto("http://localhost:5173/financial-analysis", wait_until="networkidle")
            page.wait_for_timeout(1500)
            page.screenshot(path="module_screenshots/mod4_financial_analysis.png")
            
            print("Capturing Module 4: Insights...")
            page.goto("http://localhost:5173/insights", wait_until="networkidle")
            page.wait_for_timeout(1500)
            page.screenshot(path="module_screenshots/mod4_insights.png")

            # -------------------------------------------------------------
            # MODULE 5: Security Governance & Controls
            # -------------------------------------------------------------
            print("Capturing Module 5: Security Center...")
            page.goto("http://localhost:5173/security", wait_until="networkidle")
            page.wait_for_timeout(1500)
            page.screenshot(path="module_screenshots/mod5_security_center.png")
            
            browser.close()
            print("Successfully captured screenshots for all customer modules!")
            
    finally:
        print("Cleaning up processes...")
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(backend_proc.pid)], capture_output=True)
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(frontend_proc.pid)], capture_output=True)
        subprocess.run(["taskkill", "/F", "/IM", "node.exe"], capture_output=True)
        print("Processes cleaned up.")

if __name__ == "__main__":
    main()

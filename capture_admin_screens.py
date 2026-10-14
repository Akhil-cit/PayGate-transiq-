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
        print("Waiting for backend on http://localhost:5000/api/health or http://localhost:5000...")
        if not wait_for_url("http://localhost:5000", timeout=25):
            print("Backend timed out, continuing...")
        else:
            print("Backend is ready!")
            
        print("Waiting for frontend on http://localhost:5173...")
        if not wait_for_url("http://localhost:5173", timeout=25):
            print("Frontend timed out!")
        else:
            print("Frontend is ready!")
            
        time.sleep(2)
        
        os.makedirs("real_screenshots", exist_ok=True)
        
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(viewport={"width": 1440, "height": 900}, device_scale_factor=1.5)
            page = context.new_page()
            
            print("Capturing Admin Login...")
            page.goto("http://localhost:5173/admin/login", wait_until="networkidle")
            page.wait_for_timeout(1000)
            page.screenshot(path="real_screenshots/01_admin_login.png")
            
            print("Logging in as Admin...")
            page.fill('input[type="email"]', 'admin@paygate.internal')
            page.fill('input[type="password"]', 'Password@123')
            page.click('button[type="submit"]')
            
            page.wait_for_timeout(2500)
            print("Current URL:", page.url)
            
            print("Capturing Admin Monitoring Dashboard...")
            if not "admin" in page.url:
                page.goto("http://localhost:5173/admin/monitoring", wait_until="networkidle")
            page.wait_for_timeout(2000)
            page.screenshot(path="real_screenshots/02_admin_monitoring_dashboard.png")
            
            print("Capturing Error Logs...")
            page.goto("http://localhost:5173/admin/errors", wait_until="networkidle")
            page.wait_for_timeout(2000)
            page.screenshot(path="real_screenshots/03_admin_error_logs.png")
            
            print("Capturing Pending Transactions...")
            page.goto("http://localhost:5173/admin/pending", wait_until="networkidle")
            page.wait_for_timeout(2000)
            page.screenshot(path="real_screenshots/04_admin_pending_transactions.png")
            
            print("Capturing Transaction Audit History...")
            page.goto("http://localhost:5173/admin/history", wait_until="networkidle")
            page.wait_for_timeout(2000)
            page.screenshot(path="real_screenshots/05_admin_audit_history.png")
            
            print("Capturing User & Wallet Governance...")
            page.goto("http://localhost:5173/admin/settings", wait_until="networkidle")
            page.wait_for_timeout(2000)
            page.screenshot(path="real_screenshots/06_admin_user_governance.png")
            
            browser.close()
            print("All screenshots captured successfully!")
            
    finally:
        print("Cleaning up processes...")
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(backend_proc.pid)], capture_output=True)
        subprocess.run(["taskkill", "/F", "/T", "/PID", str(frontend_proc.pid)], capture_output=True)
        subprocess.run(["taskkill", "/F", "/IM", "node.exe"], capture_output=True)
        print("Processes cleaned up.")

if __name__ == "__main__":
    main()

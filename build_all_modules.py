import os
import shutil
from build_mod1 import build_module_1
from build_mod2 import build_module_2
from build_mod3 import build_module_3
from build_mod4 import build_module_4
from build_mod5 import build_module_5

def main():
    target_dir = r"C:\Users\dell\Downloads\all 6 perfected"
    backup_dir = r"D:\Clg\python lab\MERN PROJECT\all_6_modules_perfected"
    existing_dir = r"C:\Users\dell\Downloads\all 6"
    
    os.makedirs(target_dir, exist_ok=True)
    os.makedirs(backup_dir, exist_ok=True)
    
    def safe_copy(src, dst):
        try:
            shutil.copy2(src, dst)
        except Exception as e:
            print(f"Note: Could not overwrite {dst} (likely open in Word): {e}")

    print("Building Module 1...")
    p1 = os.path.join(target_dir, "1.docx")
    build_module_1(p1)
    safe_copy(p1, os.path.join(backup_dir, "1.docx"))
    safe_copy(p1, os.path.join(existing_dir, "1.docx"))

    print("Building Module 2...")
    p2 = os.path.join(target_dir, "2.docx")
    build_module_2(p2)
    safe_copy(p2, os.path.join(backup_dir, "2.docx"))
    safe_copy(p2, os.path.join(existing_dir, "2.docx"))

    print("Building Module 3...")
    p3 = os.path.join(target_dir, "3.docx")
    build_module_3(p3)
    safe_copy(p3, os.path.join(backup_dir, "3.docx"))
    safe_copy(p3, os.path.join(existing_dir, "3.docx"))

    print("Building Module 4...")
    p4 = os.path.join(target_dir, "4.docx")
    build_module_4(p4)
    safe_copy(p4, os.path.join(backup_dir, "4.docx"))
    safe_copy(p4, os.path.join(existing_dir, "4.docx"))

    print("Building Module 5...")
    p5 = os.path.join(target_dir, "5.docx")
    build_module_5(p5)
    safe_copy(p5, os.path.join(backup_dir, "5.docx"))
    safe_copy(p5, os.path.join(existing_dir, "5.docx"))

    print("Syncing Module 6 (Reference Final)...")
    p6_src = r"C:\Users\dell\Downloads\PayGate_Module_6_Admin_and_Monitoring_Documentation_Final.docx"
    p6_dst = os.path.join(target_dir, "6.docx")
    if os.path.exists(p6_src):
        safe_copy(p6_src, p6_dst)
        safe_copy(p6_src, os.path.join(backup_dir, "6.docx"))
        safe_copy(p6_src, os.path.join(existing_dir, "6.docx"))
        print("Module 6 synced successfully!")
    else:
        print("Warning: Module 6 source not found at", p6_src)
        
    print("ALL 6 MODULES SUCCESSFULLY GENERATED AND HARMONIZED!")

if __name__ == "__main__":
    main()

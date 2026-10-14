import os
from pathlib import Path

ROOT_DIR = r"D:\Clg\python lab\MERN PROJECT"
OUT_FILE = os.path.join(ROOT_DIR, "PAYGATE_COMPLETE_FULL_SOURCE_CODE.md")

BACKEND_DIR = os.path.join(ROOT_DIR, "transiq-api")
FRONTEND_DIR = os.path.join(ROOT_DIR, "Transiq")

IGNORE_DIRS = {'node_modules', '.git', 'coverage', 'dist', '.vscode', '.idea'}
IGNORE_EXTS = {'.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg', '.zip', '.woff', '.woff2', '.ttf', '.eot'}

def get_language(filename):
    ext = os.path.splitext(filename)[1].lower()
    mapping = {
        '.js': 'javascript',
        '.jsx': 'jsx',
        '.ts': 'typescript',
        '.tsx': 'tsx',
        '.json': 'json',
        '.css': 'css',
        '.html': 'html',
        '.md': 'markdown',
        '.cjs': 'javascript',
        '.mjs': 'javascript',
        '.env': 'bash',
        '.yml': 'yaml',
        '.yaml': 'yaml',
    }
    if filename.startswith('.env'):
        return 'bash'
    return mapping.get(ext, 'text')

def read_file_safe(path):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read()
    except Exception as e:
        return f"// Error reading file {path}: {e}"

def generate_full_dump():
    print("Collecting files...")
    all_files = []

    for dirpath, dirnames, filenames in os.walk(BACKEND_DIR):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for f in filenames:
            ext = os.path.splitext(f)[1].lower()
            if ext in IGNORE_EXTS or f == 'package-lock.json':
                continue
            abs_p = os.path.join(dirpath, f)
            rel_p = os.path.relpath(abs_p, ROOT_DIR).replace('\\', '/')
            all_files.append(('BACKEND', rel_p, abs_p))

    for dirpath, dirnames, filenames in os.walk(FRONTEND_DIR):
        dirnames[:] = [d for d in dirnames if d not in IGNORE_DIRS]
        for f in filenames:
            ext = os.path.splitext(f)[1].lower()
            if ext in IGNORE_EXTS or f == 'package-lock.json':
                continue
            abs_p = os.path.join(dirpath, f)
            rel_p = os.path.relpath(abs_p, ROOT_DIR).replace('\\', '/')
            all_files.append(('FRONTEND', rel_p, abs_p))

    all_files.sort(key=lambda x: (x[0], x[1]))
    print(f"Total source code files to bundle: {len(all_files)}")

    with open(OUT_FILE, "w", encoding="utf-8") as out:
        out.write("""# PAYGATE (TRANSIQ) — COMPLETE COMPREHENSIVE MEGA SOURCE CODE BUNDLE

> **ONE-SHOT SYSTEM RECONSTRUCTION FILE**
> This file contains the complete, unabridged source code of **EVERY SINGLE FILE** in the PayGate (Transiq) project across both frontend and backend.
> Every controller, model, route, middleware, utility, React component, page, stylesheet, and configuration file is embedded in full verbatim syntax.
> 
> Simply pasting this file into any AI coding assistant gives it 100% of the project's source code, structure, and operational logic.

---

```
MERN PROJECT/
├── transiq-api/                      [Express REST API Backend]
│   ├── config/                       [Database connection]
│   ├── controllers/                  [Business logic controllers]
│   ├── middleware/                   [Auth, Admin, and Validation guards]
│   ├── models/                       [Mongoose schemas: User, Wallet, Pocket, etc.]
│   ├── routes/                       [Express route definitions]
│   ├── tests/                        [Jest integration & stress tests]
│   ├── package.json
│   ├── seed.js                       [Database seeder script]
│   └── server.js                     [Express application root]
│
└── Transiq/                          [React 18 + Vite Frontend]
    ├── src/
    │   ├── api/                      [Axios instance & microservices]
    │   ├── components/               [Global layouts, sidebars, navigation]
    │   ├── modules/
    │   │   ├── 01-customer/          [Dashboard, Pockets, Customer store]
    │   │   ├── 02-recipients/        [Beneficiaries, Contact store]
    │   │   ├── 03-initiation/        [4-Step checkout wizard, My Wallet]
    │   │   ├── 04-transactions/      [Ledgers, Analytics, Insights]
    │   │   ├── 05-security/          [Sessions, Kill-switch, Security store]
    │   │   └── 06-logs/              [Admin monitoring, telemetry, error logs]
    │   ├── pages/                    [Customer & Admin login pages]
    │   ├── utils/                    [Regex validators]
    │   ├── App.jsx                   [Route guards & layout routing]
    │   └── main.jsx                  [React DOM root]
    ├── package.json
    ├── vite.config.js
    └── index.html
```

---

""")
        for idx, (section, rel_p, _) in enumerate(all_files, start=1):
            anchor = rel_p.lower().replace('/', '').replace('.', '').replace('-', '').replace('_', '').replace(' ', '')
            out.write(f"{idx}. [{rel_p}](#file-{anchor})\n")

        out.write("\n---\n\n")

        for idx, (section, rel_p, abs_p) in enumerate(all_files, start=1):
            lang = get_language(os.path.basename(abs_p))
            anchor = rel_p.lower().replace('/', '').replace('.', '').replace('-', '').replace('_', '').replace(' ', '')
            content = read_file_safe(abs_p).strip()
            line_count = len(content.splitlines())

            out.write(f"\n<a id=\"file-{anchor}\"></a>\n")
            out.write(f"## {idx}. `{rel_p}`\n")
            out.write(f"> **Section**: {section} | **Lines**: {line_count} | **Path**: `{rel_p}`\n\n")
            out.write(f"```{lang}\n")
            out.write(content)
            out.write("\n```\n\n---\n")

    print(f"SUCCESS: Generated complete mega source file at {OUT_FILE}")

if __name__ == "__main__":
    generate_full_dump()

Cloud Attack Path Analyzer (Pygenic Arc)

Challenge / Problem
Identify how cloud misconfigurations and excessive privileges can combine into a path to a critical asset.

Description
# AEGIS-Graph — Cloud Attack Path Analyzer

**Find the chain. Break it once. Prove it.**

AEGIS-Graph is a defensive cloud security tool that identifies how cloud misconfigurations and excessive permissions can combine to create attack paths to sensitive data. It converts exported or synthetic cloud configurations into an interactive graph, discovers attack paths, assesses risk, and recommends the smallest effective fix to break those paths.

### Key Features
- **Attack Path Analysis:** Identifies paths from exposed entry points to critical assets, including alternate paths.
- **Risk & Blast Radius:** Prioritizes threats based on risk and potential impact.
- **Remediation Optimization:** Uses graph algorithms to identify a minimal fix that breaks dangerous paths.
- **Before-and-After Verification:** Re-runs the analysis to verify that attack paths have been eliminated.
- **Sentinel AI Assistant:** Explains findings in plain English while keeping the graph engine as the source of truth.
- **Human Approval:** Uses RFID-based approval before applying a fix in the simulated model.
- **Audit Trail:** Records actions and approvals with a SHA-256 hash chain.
- **Offline Operation:** Supports local analysis without connecting to a live cloud account.

### Technology Stack
- **Backend:** Python, FastAPI, NetworkX
- **Frontend:** React, TypeScript, Tailwind CSS, Cytoscape.js
- **Database:** SQLite (local mode), with optional Firestore support
- **AI:** Google Gemini API, with a template-based offline mode
- **Hardware:** Arduino UNO Q, ESP32-S3, TFT display and RFID reader

### Demo Scenario
AEGIS-Graph includes a synthetic educational cloud environment called **EduCloud**. In the demo, three attack paths converge on an over-privileged role leading toward a parent-portal database containing children's records. The system recommends restricting the unnecessary `iam:PassRole` permission and demonstrates the simulated results: **3 attack paths → 0**, risk score **88 → 12**, and an **82% reduction in weighted blast radius**.

### Security Scope
AEGIS-Graph analyzes only synthetic or exported configuration data. It does not scan or attack live cloud environments. AI explanations are read-only, and fixes require authorized human approval.

**Built for defensive cloud security, safer remediation, and accountable security decisions.**

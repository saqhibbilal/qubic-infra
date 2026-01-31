# 🛡️ Aegis Registry

> **Track 1: Nostromo Launchpad (Payments & RWAs)**
> *A decentralized protocol for verifyng, registering, and tokenizing Real World Assets (Real Estate, Vehicles, Art) on the Qubic Network.*

---

## 🌐 Live Demo
**Web App:** [http://3.89.217.59](http://3.89.217.59)
**Qubic RPC Node:** [http://3.89.217.59:8000/v1/status](http://3.89.217.59:8000/v1/status)

---

## 💡 Overview
Aegis Registry bridges the gap between physical assets and the Qubic blockchain. We provide the infrastructure for verified authorities to mint digital twins of real-world assets with cryptographic proof of ownership.

**Key Differentials:**
*   **Infrastructure:** We deployed our own **Qubic Core Node (C++)** on AWS to interact directly with the network.
*   **Cryptography:** We integrated the **Official Qubic Library** to generate real Seeds/IDs and sign transactions (No mocks).
*   **RWA Protocol:** Specialized data structures to handle off-chain metadata (Deeds, VINs) linked to on-chain identities.

---

## 🏗️ Architecture

### 1. The Core (Infrastructure)
*   **AWS EC2 (t3.large):** Production environment hosting the entire stack.
*   **Qubic Computor (Node):** Dockerized C++ official node synced with the Testnet Spectrum (1GB+ State).
*   **RPC Interface:** Exposes port `8000` for direct transaction broadcasting.

### 2. The Protocol (Backend)
*   **Node.js & Express:** Orchestrates asset verification and signing.
*   **Cryptographic Engine:**
    *   Generates 55-char Seeds securely.
    *   Derives 60-char Public IDs compatible with Qubic protocol.
    *   Signs transactions using Schnorr/Ed25519 (Qubic standard).

### 3. The Interface (Frontend)
*   **React + Vite:** High-performance dashboard for Asset Management.
*   **Asset Dashboard:** Real-time visualization of registered RWAs and their blockchain status.

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Blockchain** | Qubic Core (C++), Docker, Spectrum |
| **Backend** | Node.js, Express, `@qubic-lib/ts-library` |
| **Frontend** | React, TailwindCSS, Lucide Icons |
| **Database** | SQLite (Metadata Cache), MongoDB (Node State) |
| **DevOps** | AWS, PM2, Docker Compose |

---

## 🚀 Local Installation

```bash
# 1. Backend Setup
cd backend
npm install
node seed_data.js  # Load demo assets
npm run dev

# 2. Frontend Setup
cd frontend
npm install
npm run dev
```

---

*Built for Qubic Hackathon 2025*

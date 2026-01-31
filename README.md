# Qubic Cosmos

**Qubic Cosmos** is a web app for registering and verifying real-world assets (RWAs)—such as real estate, vehicles, and art—and tying them to the **Qubic** blockchain. Users submit an asset with description, jurisdiction, value, and documents; the app creates a unique Qubic-backed identity for it and stores metadata. Authorized validators can approve assets step by step (e.g. notary then registry); once verified, an asset appears in the user’s portfolio and in the marketplace. The goal is to give each physical asset a digital twin with cryptographic proof of ownership on Qubic.

**Qubic** is used because it offers a lean, efficient protocol for identity and transactions. The backend uses the official Qubic library to generate real 55-character seeds and derive 60-character public IDs that match the network. Asset data is signed so that ownership and verification are cryptographically bound to those identities. In production, a Qubic node can broadcast transactions and keep the registry aligned with the chain. So Qubic is used both for **who owns what** (identities and signatures) and for **persistent, auditable records** of registered and verified assets.

The stack is a **React + Vite** frontend (TailwindCSS, Voces font) and a **Node.js + Express** backend. The backend handles registration, file uploads, validation rules, and SQLite for asset metadata; it calls the Qubic library for identity creation and signing. The frontend provides a dashboard (portfolio and TVL), a registration flow with document and photo upload, a validator workstation for admins, and a marketplace of verified assets. Live status and “Qubic Network Active” are shown in the UI to reflect connection to the chain.

Screenshots below show the main flows: the user portfolio and TVL, the registration-success screen with asset ID and QR code, the validator queue and workstation, and the asset-detail modal where validators approve steps and complete validation (which would mint the asset on Qubic Chain).

![My Asset Portfolio](Screenshot%202026-01-31%20231034.jpg)  
![Registration Successful](Screenshot%202026-01-31%20231404.jpg)  
![Validator Workstation](Screenshot%202026-01-31%20231820.jpg)  
![Asset verification modal](Screenshot%202026-01-31%20231923.jpg)

---

## Local setup

```bash
cd backend && npm install && node seed_data.js && npm run dev
cd frontend && npm install && npm run dev
```

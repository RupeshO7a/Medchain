<div align="center">

```
███╗   ███╗███████╗██████╗  ██████╗██╗  ██╗ █████╗ ██╗███╗   ██╗
████╗ ████║██╔════╝██╔══██╗██╔════╝██║  ██║██╔══██╗██║████╗  ██║
██╔████╔██║█████╗  ██║  ██║██║     ███████║███████║██║██╔██╗ ██║
██║╚██╔╝██║██╔══╝  ██║  ██║██║     ██╔══██║██╔══██║██║██║╚██╗██║
██║ ╚═╝ ██║███████╗██████╔╝╚██████╗██║  ██║██║  ██║██║██║ ╚████║
╚═╝     ╚═╝╚══════╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝
```

**A Blockchain-Based Secure Patient Record Exchange System for Multi-Hospital Networks**

![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia_Testnet-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
![React](https://img.shields.io/badge/React.js-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/Status-Patent_Filed-blue?style=for-the-badge)

> *Decentralized. Immutable. Patient-Controlled.*

</div>

---

## ⚡ What is MedChain?

MedChain is a **production-deployed, blockchain-powered healthcare data exchange platform** that enables authorized hospitals to securely share and retrieve patient medical records — across institutional boundaries — without ever storing raw sensitive data on-chain.

Built to solve the **healthcare data silo problem** at scale, MedChain combines the immutability of Ethereum smart contracts with the performance of encrypted off-chain storage, wrapped in a clinician-friendly web interface that requires zero blockchain expertise to operate.

> **Patent Filed** — Kalasalingam Academy of Research and Education  
> *"A Blockchain-Based Secure Patient Record Exchange System for Multi-Hospital Networks"*

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        MEDCHAIN SYSTEM                              │
│                                                                     │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐  │
│  │  React.js    │    │  Node.js /   │    │  Ethereum Sepolia    │  │
│  │  Frontend    │◄──►│  Express.js  │◄──►│  Smart Contract      │  │
│  │  (Vercel)    │    │  (Railway)   │    │  (Solidity)          │  │
│  └──────────────┘    └──────┬───────┘    └──────────────────────┘  │
│                             │                        ▲              │
│                     ┌───────▼───────┐                │              │
│                     │   MongoDB     │     Merkle Root │              │
│                     │  (Encrypted   │     Hash Only   │              │
│                     │  Off-Chain)   │─────────────────┘              │
│                     └───────────────┘                               │
│                             │                                       │
│                     ┌───────▼───────┐                               │
│                     │  Python Flask │                               │
│                     │  AI Risk      │                               │
│                     │  Engine       │                               │
│                     └───────────────┘                               │
└─────────────────────────────────────────────────────────────────────┘
```

### Four-Layer Design

| Layer | Technology | Role |
|---|---|---|
| **Presentation** | React.js → Vercel | Hospital portal, admin panel, patient search |
| **Application** | Node.js + Express.js → Railway | Auth, business logic, blockchain bridge |
| **Storage** | MongoDB (encrypted) | Off-chain medical records |
| **Blockchain** | Ethereum Sepolia + Solidity | Immutable hash verification & access control |

---

## 🔐 Core Security Innovations

### 1. Adaptive Multi-Layer Identity Anonymization
Patient Aadhaar numbers are **never stored anywhere** in raw form. Instead:
```
Aadhaar + hospital_salt + enrollment_timestamp + rotating_pepper
        │
        ▼
    SHA-256
        │
        ▼
    BLAKE2b
        │
        ▼
  512-bit composite identity token
```
Rainbow table attacks → computationally infeasible.

---

### 2. Patient-Controlled Consent Engine
Patients generate cryptographic consent tokens encoding:
- Authorized hospital Ethereum wallet address
- Permission scope (read-only / read-write)
- Time-bound expiry timestamp
- Emergency override flag

Tokens are **enforced at the smart contract consensus layer** — revocable instantly by the patient, no admin intervention required.

---

### 3. AI-Based Pre-Authorization Risk Scoring
Every access request passes through an **Isolation Forest anomaly detection model** before any data is returned:
- Behavioral profiles maintained per hospital wallet
- Tracks: query frequency, patient identity distribution, temporal patterns, cross-institutional correlation
- Anomalous requests → blocked + escalated to admin
- Validated against injected bulk queries, off-hours access, and patient enumeration attacks

---

### 4. Merkle-Tree Blockchain Optimization
```
Record Hash 1 ─┐
Record Hash 2 ─┤──► Merkle Tree ──► Single Root Hash ──► On-Chain
Record Hash 3 ─┤                    (1 transaction)
Record Hash N ─┘
```
**~70–90% gas cost reduction** vs per-record writing. Full Merkle-proof auditability preserved.

---

## 🔄 Operational Workflow

```
Hospital Registers
       │
       ▼
Gov Admin Authorizes (on-chain)
       │
       ▼
Clinician Logs In → JWT Issued
       │
       ▼
Patient Data Entered
       │
       ├─► Multi-layer Aadhaar hashing (SHA-256 → BLAKE2b)
       ├─► AI Risk Score computed
       ├─► Smart contract authorization check
       ├─► Patient consent token validated (on-chain)
       ├─► Record encrypted → stored in MongoDB
       ├─► Record hash → added to Merkle batch
       └─► Merkle root → written to Ethereum (transaction hash logged)

Cross-Hospital Retrieval:
       ├─► AI risk gate
       ├─► Consent token validation (on-chain)
       ├─► Smart contract returns all record hashes
       ├─► MongoDB fetch + Merkle proof verification
       └─► Hash recomputation against on-chain value → integrity confirmed
```

---

## 🛠️ Tech Stack

```yaml
Frontend:
  - React.js
  - Deployed on: Vercel (HTTPS + CDN)

Backend:
  - Node.js + Express.js
  - Authentication: JWT + bcrypt (cost factor 10)
  - Blockchain bridge: ethers.js
  - Security headers: Helmet.js
  - Deployed on: Railway

Database:
  - MongoDB (encrypted off-chain storage)

Blockchain:
  - Network: Ethereum Sepolia Testnet (mainnet-compatible)
  - Language: Solidity
  - Dev Framework: Hardhat

AI Engine:
  - Model: Isolation Forest (scikit-learn)
  - Served via: Flask microservice (REST API)
  - Language: Python

Cryptography:
  - Identity hashing: SHA-256 + BLAKE2b (two-stage pipeline)
  - Password hashing: bcrypt
  - Transport: HTTPS (enforced)
```

---

## 📋 Smart Contract Interface

```solidity
// Core functions exposed by the MedChain Solidity contract

authorizeHospital(address)          // Admin-only: grant blockchain access
revokeHospital(address)             // Admin-only: instantly exclude institution
addRecord(bytes32 patientHash, string recordHash)   // Write record hash on-chain
getRecords(bytes32 patientHash)     // Retrieve all hashes for a patient
grantConsent(bytes32 patientToken, address hospital, uint256 expiry, bool emergency)
revokeConsent(bytes32 patientToken, address hospital)
```

All write operations require dual authorization: **JWT (application layer) + smart contract wallet registry (consensus layer)**.

---

## 🧪 Testing Phases

| Phase | Scope | Outcome |
|---|---|---|
| Smart Contract Unit Tests | Hardhat local node, multi-account simulation | All auth edge cases passed |
| Backend API Tests | JWT validation, input sanitization, MongoDB ↔ Ethereum | All endpoints verified |
| Frontend Integration | E2E: register → approve → add → retrieve → verify | Fully validated |
| Cross-Institutional Sharing | Hospital A creates, Hospital B retrieves | Integrity confirmed via hash comparison |
| AI Anomaly Detection | Injected bulk queries, off-hours access, patient enumeration | All flagged; zero false positives on normal workflows |
| Patient Consent Engine | Expiry, revocation, emergency override | All smart contract enforcements confirmed |

---

## ✅ Compliance

| Standard | Status |
|---|---|
| India's **Digital Personal Data Protection Act 2023** | ✅ Aligned |
| **Ayushman Bharat Digital Mission (ABDM)** | ✅ Aligned |
| Data minimization | ✅ No raw PII stored anywhere |
| Consent & accountability | ✅ Patient-controlled, cryptographically enforced |

---

## 🚀 Deployment

| Component | Platform | Status |
|---|---|---|
| Smart Contract | Ethereum Sepolia Testnet | ✅ Live |
| Backend | Railway | ✅ Live (auto-restart, HTTPS) |
| Frontend | Vercel | ✅ Live (global CDN) |

---

## 🎯 Key Differentiators vs Prior Art

| Feature | This System | MIT Patent | IBM Patent | IoT Patent | Cloud Patent |
|---|---|---|---|---|---|
| Multi-layer salted identity hashing | ✅ SHA-256 + BLAKE2b | ❌ | ❌ | ❌ | ❌ |
| Patient-controlled consent tokens | ✅ On-chain enforced | ❌ | ❌ | ❌ | Partial |
| AI anomaly detection gate | ✅ Isolation Forest | ❌ | ❌ | ❌ | ❌ |
| Merkle-tree gas optimization | ✅ ~70–90% reduction | ❌ | N/A | ❌ | N/A |
| Dual-layer auth (JWT + smart contract) | ✅ | Partial | Partial | ❌ | ❌ |
| DPDP Act 2023 + ABDM compliance | ✅ | ❌ | ❌ | ❌ | ❌ |
| Fully deployed production system | ✅ | Prototype | Enterprise | Simulation | Cloud |

---

## 📬 Contact

**Bethapudi Rupesh**  
Project Manager & System Designer    
📧 [rupeshbethapudi@gmail.com](mailto:rupeshbethapudi@gmail.com)  
📱 +91 94937 60536

---

<div align="center">

*Built at Kalasalingam Academy of Research and Education*  
*Patent Filed — All Rights Reserved*

</div>

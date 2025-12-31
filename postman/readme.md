# 🧪 Postman Collection – Backend API

Această colecție Postman este utilizată pentru testarea manuală end-to-end a Backend API-ului
(User Management, RBAC, Contracts, Subscriptions și Billing).

Colecția este destinată:
- testării funcționale
- demo-urilor
- validării fluxurilor de business
- interviurilor tehnice

Nu este necesar niciun UI pentru a rula aceste teste.

---

## 📦 Conținut

- `backend-api.postman_collection.json`
- `backend-prod.example.environment.json`

---

## ⚙️ Setup rapid

### 1️⃣ Import colecție
- Postman → Import
- Selectează `backend-api.postman_collection.json`

### 2️⃣ Import environment
- Postman → Environments → Import
- Selectează `backend-prod.example.environment.json`

### 3️⃣ Configurează Environment
În Environment setează **Current Value** pentru:

```text
BASE_URL = https://backend-auth-rbac.onrender.com
EMAIL    = manager@test.com
PASSWORD = your-password

⚠️ TOKEN este setat automat la login.
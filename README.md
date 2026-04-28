# 🏦 NovBank — Banking Management System

A full-stack banking management system built with the MERN stack. Features secure JWT authentication, account management, balance tracking, fund transfers, and transaction history.

---

## 🚀 Live Demo

- **Frontend:** https://banking-management-system-one.vercel.app/
- **Backend:**  https://banking-management-system-mfgh.onrender.com

---

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js (Vite) | UI Framework |
| Tailwind CSS v3 | Styling |
| React Router DOM | Client-side Routing |
| Axios | HTTP Requests |
| React Hot Toast | Notifications |
| Lucide React | Icons |
| UUID | Idempotency Keys |
| Context API | State Management |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | Web Framework |
| MongoDB | Database |
| Mongoose | ODM |
| bcryptjs | Password Hashing |
| JSON Web Token (JWT) | Authentication |
| Cookie Parser | Cookie Handling |
| CORS | Cross-Origin Requests |
| Morgan | Request Logger |
| Dotenv | Environment Variables |

### DevOps & Deployment
| Service | Purpose |
|---------|---------|
| MongoDB Atlas | Cloud Database |
| Render | Backend Hosting |
| Vercel | Frontend Hosting |
| GitHub | Version Control |

---

## 📁 Project Structure

```
banking-management-system/
├── backened/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── account.controller.js
│   │   │   └── transaction.controller.js
│   │   ├── models/
│   │   │   ├── user.model.js
│   │   │   ├── account.model.js
│   │   │   ├── ledger.model.js
│   │   │   ├── transaction.model.js
│   │   │   └── blackList.model.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── account.routes.js
│   │   │   └── transaction.routes.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
│
└── frontened/
    ├── src/
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── AdminLogin.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Account.jsx
    │   │   ├── Transfer.jsx
    │   │   ├── Transactions.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   └── main.jsx
    ├── .gitignore
    └── package.json
```

---

## ⚙️ Environment Variables

Backend mein `.env` file banao:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bankDB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
```

| Variable | Description |
|----------|-------------|
| `PORT` | Backend server port (default: 3000) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT token signing |

---

## 🏃 Local Development

### Prerequisites
- Node.js v18+
- MongoDB (with Replica Set enabled)
- npm

### Backend Setup

```bash
# Backend folder mein jao
cd backened

# Dependencies install karo
npm install

# .env file banao
cp .env.example .env
# .env mein apni values dalo

# MongoDB Replica Set start karo
mkdir -p ~/mongo-data
mongod --dbpath ~/mongo-data --replSet rs0

# Doosre terminal mein initiate karo (sirf pehli baar)
mongosh
rs.initiate()

# Backend start karo
npm run dev
```

Backend chalega: `http://localhost:3000`

### Frontend Setup

```bash
# Frontend folder mein jao
cd frontened

# Dependencies install karo
npm install

# Development server start karo
npm run dev
```

Frontend chalega: `http://localhost:5173`

---

## 📡 API Endpoints

### Auth Routes `/api/auth`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | New user register | ❌ |
| POST | `/login` | User/Admin login | ❌ |
| POST | `/logout` | Logout | ✅ |

### Account Routes `/api/accounts`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | New account banao | ✅ User |
| GET | `/` | Apne accounts dekho | ✅ User |
| GET | `/balance/:accountId` | Account balance | ✅ User |
| GET | `/all` | Saare accounts | ✅ Admin |
| DELETE | `/:accountId` | Account delete | ✅ User |

### Transaction Routes `/api/transactions`
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/` | Transfer karo | ✅ User |
| GET | `/:accountId` | Account transactions | ✅ User |
| GET | `/all` | Saari transactions | ✅ Admin |
| POST | `/system/initial-funds` | Funds inject karo | ✅ Admin |

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login/logout with token blacklisting
- 👤 **User & Admin Roles** — Alag alag dashboards
- 🏦 **Account Management** — Multiple accounts per user
- 💰 **Real-time Balance** — Ledger-based double-entry accounting
- 💸 **Fund Transfers** — Idempotent transactions with MongoDB sessions
- 📊 **Transaction History** — Complete audit trail
- 💉 **Fund Injection** — Admin can deposit funds to any account
- 🔒 **Protected Routes** — Frontend route guards

---

## 👨‍💻 Author

**Moiz** — [@Moiz-kazmi90](https://github.com/Moiz-kazmi90)

---

## 📄 License

MIT License

# 💹 ForexPro — Foreign Trading System
### CSE College Mini Project | Full-Stack Node.js + MongoDB

A professional-grade foreign currency trading web application with premium fintech UI, real-time rate management, user authentication, trading engine, portfolio tracking, and a full admin panel.

---

## 🚀 Tech Stack
- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose ODM
- **Templating:** EJS (Embedded JavaScript)
- **Styling:** Custom CSS (Dark Navy + Teal Fintech Design)
- **Charts:** Chart.js
- **Icons:** Font Awesome 6
- **Auth:** express-session + bcryptjs
- **Flash Messages:** connect-flash

---

## 📁 Folder Structure
```
foreign-trading-system/
├── app.js                  # Main server entry point
├── seed.js                 # Database seeder
├── package.json
├── .env
├── models/
│   ├── User.js
│   ├── Transaction.js
│   ├── CurrencyRate.js
│   └── Portfolio.js
├── routes/
│   ├── auth.js
│   ├── user.js
│   ├── admin.js
│   ├── trade.js
│   └── rates.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── tradeController.js
│   ├── adminController.js
│   └── ratesController.js
├── middleware/
│   └── auth.js
├── views/
│   ├── home.ejs
│   ├── 404.ejs
│   ├── partials/
│   │   ├── head.ejs
│   │   ├── flash.ejs
│   │   ├── sidebar.ejs
│   │   └── adminSidebar.ejs
│   ├── auth/
│   │   ├── login.ejs
│   │   └── register.ejs
│   ├── user/
│   │   ├── dashboard.ejs
│   │   ├── trade.ejs
│   │   ├── portfolio.ejs
│   │   ├── transactions.ejs
│   │   └── rates.ejs
│   └── admin/
│       ├── dashboard.ejs
│       ├── users.ejs
│       ├── transactions.ejs
│       └── rates.ejs
└── public/
    ├── css/style.css
    └── js/main.js
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js v18+ installed
- MongoDB running locally (or use MongoDB Atlas)
- npm or yarn

### 2. Clone & Install
```bash
git clone <your-repo>
cd foreign-trading-system
npm install
```

### 3. Configure Environment
Edit `.env` file:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/foreign_trading_db
SESSION_SECRET=your_secret_key_here
```

### 4. Seed the Database
```bash
npm run seed
```

### 5. Start the App
```bash
# Production
npm start

# Development (with auto-restart)
npm run dev
```

### 6. Open Browser
```
http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role  | Email                    | Password  |
|-------|--------------------------|-----------|
| User  | arjun@example.com        | user123   |
| User  | priya@example.com        | user123   |
| Admin | admin@forexpro.com       | admin123  |

---

## 📄 Pages

| Route                    | Description                    |
|--------------------------|--------------------------------|
| `/`                      | Landing page                   |
| `/auth/register`         | User registration              |
| `/auth/login`            | User login                     |
| `/dashboard`             | User dashboard                 |
| `/trade`                 | Execute buy/sell trades        |
| `/dashboard/portfolio`   | Currency portfolio             |
| `/dashboard/transactions`| Trade history with filters     |
| `/rates`                 | Live exchange rates + converter|
| `/admin/dashboard`       | Admin overview                 |
| `/admin/users`           | Manage users                   |
| `/admin/transactions`    | All platform transactions      |
| `/admin/rates`           | Update exchange rates          |

---

## ✨ Key Features
- 🔐 Session-based authentication with bcrypt password hashing
- 💱 Buy & Sell currency with auto rate calculation
- 📊 Interactive Chart.js market trend charts
- 💼 Portfolio with P&L tracking
- 📋 Paginated transaction history with filters
- 🖨️ Print trade receipts
- 🧮 Live currency converter calculator
- ⚙️ Admin panel: user management, rate editing
- 🎨 Premium dark fintech UI (responsive)
- 📱 Mobile-friendly sidebar

---

## 🎓 For College Presentation
This project demonstrates:
- **Full-Stack Architecture** (MVC pattern)
- **RESTful Routing** with Express
- **Database Design** (4 MongoDB collections)
- **Authentication & Authorization** (middleware)
- **UI/UX Design** (professional fintech aesthetics)
- **CRUD Operations** across all models
- **Session Management** & security best practices

---

*Built with ❤️ as a CSE Mini Project — ForexPro Foreign Trading System*

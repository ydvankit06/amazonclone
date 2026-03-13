## Amazon Clone - Full Stack

This is a full-stack Amazon-style e-commerce demo built with:

- **Frontend**: React + Vite, Tailwind CSS, React Router, Axios
- **Backend**: Node.js + Express
- **Database**: PostgreSQL

### Project structure

- `frontend/` - React SPA with product listing, details, cart, and checkout
- `backend/` - Express API for products, carts, and orders

### Getting started

1. **Install dependencies**

```bash
npm install             # installs root + frontend + backend (workspaces)
```

2. **Configure PostgreSQL**

- Create a database, e.g. `amazon_clone`
- Copy `.env.example` to `.env` and fill in your PostgreSQL connection details

3. **Run backend**

```bash
cd backend
npm run dev
```

The API will be available at `http://localhost:5000/api`. On first start it will create tables and seed some example products.

4. **Run frontend**

```bash
cd frontend
npm run dev
```

The SPA will be served by Vite (default `http://localhost:5173`) and proxied to the backend under `/api`.


# E-Commerce Store (React + Vite)

A small e-commerce frontend scaffolded for study and challenge purposes. Built with React, Vite and Material UI, it demonstrates product listing, filters, cart/wishlist, and a simple dashboard UI.

## Features

- Product listing with filters
- Product details view
- Cart and wishlist management
- Dashboard views: product form and product table
- Authentication scaffolding via React context
- Responsive UI using Material UI components

## Tech Stack

- React 19
- Vite
- Material UI (`@mui/material`, `@mui/icons-material`)
- React Router (`react-router-dom`)
- Axios for API requests
- Tailwind

## Quick Start

Prerequisites: Node.js 18+ and npm (or yarn).

1. Install dependencies

```bash
npm install
# or: yarn
```

2. Start dev server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build locally

```bash
npm run preview
```

5. Live Demo: use this link
https://solvit-e-commerce.netlify.app

## Scripts

- `dev` — run Vite dev server
- `build` — build the app for production
- `preview` — locally preview the production build
- `lint` — run ESLint

These scripts come from `package.json`.

## Project Structure

- `src/` — application source
  - `api/` — Axios instance and API helpers (`src/api/axios.js`)
  - `assets/` — static images and assets
  - `components/` — reusable UI components
    - `layout/` — `Navbar`, `Footer`, `ProtectedRoute`
    - `Products/` — `ProductCard`, `ProductFilters`, etc.
    - `Cart/`, `Dashboard/` — cart UI and admin UI
  - `hooks/contexts/` — React contexts (`AuthContext`, `CartContexts`, `ProductContext`, `WishlistContext`)
  - `pages/` — route pages: `Home`, `Products`, `ProductDetails`, `Cart`, `Wishlist`, `Dashboard`, `Login`
  - `main.jsx` — app bootstrap and router

## Environment & API

The app expects a backend or public API for product data. Configure the base URL and endpoints in `src/api/axios.js`.

## Notes

- Material UI is used for components and layout; styling uses the MUI `sx` prop and Tailwind classes.
- Authentication is a context-based scaffold — replace with your auth flow if required.
- The project includes ESLint configuration; run `npm run lint` before committing.

## Contributing

- Fork the repo and create a branch per feature/fix
- Run the dev server and add tests where appropriate
- Open a pull request with a clear description

## License

This repository is provided for study and demonstration purposes. No license is declared.

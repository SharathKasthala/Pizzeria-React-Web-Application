# Pizzeria

A pizza ordering web app built with React, Vite and Bootstrap. Browse the menu, customize a pizza with extra toppings, check out, and track your past orders.

**Live demo:** https://your-project.vercel.app

## Features

- **Menu** with search, a veg / non-veg filter and sorting by price
- **Build your own pizza**: pick a base, add extra toppings, and see a live preview and running total
- **Cart** with quantity controls; plain and customized versions of a pizza are kept as separate items
- **Checkout** in three steps: review the cart, enter delivery details, confirm the order
- **Payment options**: cash on delivery or UPI on delivery
- **Login and registration** with form validation
- **My orders** page with order history, one-tap reorder and star ratings
- **Feedback** on each order (rating and comment)
- **Light and dark mode**, saved between visits
- **Responsive layout** for mobile, tablet and desktop
- **404 page** for unknown links

## Tech stack

| Area | Used |
| --- | --- |
| UI | React 19 |
| Build tool | Vite |
| Routing | React Router |
| Styling | Bootstrap 5.3 with a custom theme, Bootstrap Icons |
| Notifications | React Toastify |
| State | React Context and `useReducer` (no Redux) |
| Storage | Browser localStorage |
| Linting | ESLint |

## Getting started

You need [Node.js](https://nodejs.org/) 20 or later.

```bash
# 1. Clone the repository
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open the address shown in the terminal (usually http://localhost:5173).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Checks the code with ESLint |

## Project structure

```
src/
├── assets/
│   ├── data/          # pizzas.json, ingredients.json
│   └── images/        # logo and section images
├── components/        # Header, Footer, PizzaCard, CartLine, QuantityStepper, ...
│   └── HomeComponents/  # Hero, HowItWorks, Story, Ingredients, Chef, Delivery
├── context/           # Auth and cart state (Context + cartReducer)
├── hooks/             # useTheme (light / dark mode)
├── layouts/           # Layout shared by every page
├── pages/             # Home, Menu, Build, Cart, Auth, OrderSuccess, MyOrders, NotFound
├── utils/             # localStorage, price formatting and order helpers
├── App.jsx            # Routes
├── main.jsx           # App entry point
└── index.css          # Custom Bootstrap theme
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/order` | Menu |
| `/build` | Build your own pizza |
| `/cart` | Cart and checkout |
| `/auth` | Log in / register |
| `/orders` | My orders (login required) |
| `/success/:orderId` | Order confirmation and feedback (login required) |

## Deployment

The project includes a `vercel.json` so page refreshes work on any route. To deploy, import the repository in [Vercel](https://vercel.com/) and keep the default Vite settings (build command `npm run build`, output folder `dist`).

## Notes

- **Demo only:** there is no backend. Users, carts and orders are saved in the browser's localStorage, and passwords are not encrypted. Don't use real passwords.
- **Images:** the pizza and topping photos are linked from external stock-photo previews. If a photo fails to load, a drawn pizza is shown instead. Replace them with your own licensed images before using the app publicly.

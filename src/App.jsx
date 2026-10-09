import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PageLoader from "./components/PageLoader";

// Pages load on demand, so the first page opens faster
const Home = lazy(() => import("./pages/Home"));
const OrderPizza = lazy(() => import("./pages/OrderPizza"));
const BuildPizza = lazy(() => import("./pages/BuildPizza"));
const Cart = lazy(() => import("./pages/Cart"));
const Auth = lazy(() => import("./pages/Auth"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Layout (header, footer, cart drawer) is shared by every page */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="order" element={<OrderPizza />} />
          <Route path="build" element={<BuildPizza />} />
          <Route path="cart" element={<Cart />} />
          <Route path="auth" element={<Auth />} />

          {/* Logged-in users only */}
          <Route element={<ProtectedRoute />}>
            <Route path="orders" element={<MyOrders />} />
            <Route path="success/:orderId" element={<OrderSuccess />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;

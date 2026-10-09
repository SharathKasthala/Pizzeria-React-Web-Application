import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CartDrawer from "../components/CartDrawer";
import FloatingCartButton from "../components/FloatingCartButton";
import ScrollToTop from "../components/ScrollToTop";
import PageLoader from "../components/PageLoader";

function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <a href="#main" className="skip-link">Skip to content</a>
      <ScrollToTop />
      <Header />

      <main id="main" className="flex-grow-1">
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer />
      <CartDrawer />
      <FloatingCartButton />
    </div>
  );
}

export default Layout;

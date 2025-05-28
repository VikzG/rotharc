import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { LandingPage } from "./screens/LandingPage";
import { CataloguePage } from "./screens/CataloguePage";
import { ProductPage } from "./screens/ProductPage";
import { LoginPage } from "./screens/LoginPage";
import { RegisterPage } from "./screens/RegisterPage";
import { ContactPage } from "./screens/ContactPage";
import { NotFoundPage } from "./screens/NotFoundPage";
import { BookingPage } from "./screens/BookingPage";
import { ProfilePage } from "./screens/ProfilePage";
import { ReservationsPage } from "./screens/ReservationsPage";
import { AdminDashboard } from "./screens/AdminDashboard";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/catalogue",
    element: <CataloguePage />,
  },
  {
    path: "/produit/:id",
    element: <ProductPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/reservation",
    element: <BookingPage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  {
    path: "/mes-reservations",
    element: <ReservationsPage />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

const App = () => {
  return (
    <StrictMode>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" />
      </AuthProvider>
    </StrictMode>
  );
};

createRoot(document.getElementById("app") as HTMLElement).render(<App />);
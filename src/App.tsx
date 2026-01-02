import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminLayout } from "@/components/layout/AdminLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Coupons from "./pages/Coupons";
import Orders from "./pages/Orders";
import PaymentSettings from "./pages/PaymentSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename="/ingreso">
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Login />} />
          
          {/* Protected admin routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AdminLayout title="Dashboard" />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
          </Route>
          
          <Route
            path="/productos"
            element={
              <ProtectedRoute>
                <AdminLayout title="Productos" />
              </ProtectedRoute>
            }
          >
            <Route index element={<Products />} />
          </Route>
          
          <Route
            path="/categorias"
            element={
              <ProtectedRoute>
                <AdminLayout title="Categorías" />
              </ProtectedRoute>
            }
          >
            <Route index element={<Categories />} />
          </Route>
          
          <Route
            path="/cupones"
            element={
              <ProtectedRoute>
                <AdminLayout title="Cupones" />
              </ProtectedRoute>
            }
          >
            <Route index element={<Coupons />} />
          </Route>
          
          <Route
            path="/ventas"
            element={
              <ProtectedRoute>
                <AdminLayout title="Ventas" />
              </ProtectedRoute>
            }
          >
            <Route index element={<Orders />} />
          </Route>
          
          <Route
            path="/pagos"
            element={
              <ProtectedRoute>
                <AdminLayout title="Configuración de Pagos" />
              </ProtectedRoute>
            }
          >
            <Route index element={<PaymentSettings />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

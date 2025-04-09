import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import MainLayout from "../components/layout/MainLayout";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers.jsx";
import Product from "../pages/Product.jsx";
import ProductForm from "../components/product/ProductForm";
import Invoices from "../pages/Invoices";
import Reviews from "../pages/Reviews";
import NotFound from "../pages/NotFound";
import Categories from "../pages/Categories";
import CategoriesForm from "../components/product/CategoryForm.jsx";
import OrderDetail from "../components/order/OrderDetail.jsx";
import ProductEdit from "../components/product/ProductEdit.jsx";

import AdminLogin from "../components/layout/AdminLogin.jsx";

function AppRoutes() {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("adminToken")
  );

  // Cập nhật lại khi route thay đổi
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("adminToken"));
  }, [location]);

  return (
    <Routes>
      <Route
        path="/admin/login"
        element={isLoggedIn ? <Navigate to="/admin" replace /> : <AdminLogin />}
      />

      <Route
        path="/admin"
        element={
          isLoggedIn ? <MainLayout /> : <Navigate to="/admin/login" replace />
        }>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="customers" element={<Customers />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products" element={<Product />} />
        <Route path="products/edit/:id" element={<ProductEdit />} />
        <Route path="categories" element={<Categories />} />
        <Route path="categories/new" element={<CategoriesForm />} />
        <Route path="categories/:id" element={<CategoriesForm />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

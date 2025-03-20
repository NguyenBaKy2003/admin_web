import { Routes, Route } from "react-router-dom";
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="orders/:id" element={<OrderDetail />} />

        <Route path="customers" element={<Customers />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="reviews" element={<Reviews />} />

        {/* Danh sách sản phẩm */}
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products" element={<Product />} />
        <Route
          path="/products/edit/:id"
          element={<ProductEdit></ProductEdit>}></Route>
        <Route path="categories" element={<Categories />} />
        <Route path="categories/new" element={<CategoriesForm />} />
        <Route path="categories/:id" element={<CategoriesForm />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

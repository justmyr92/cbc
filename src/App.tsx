import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import HomePage from "./pages/customer/HomePage";
import DashboardPage from "./pages/admin/DashboardPage";
import LoginPage from "./pages/admin/LoginPage";
import ManagerPage from "./pages/admin/ManagerPage";
import ProductsPage from "./pages/admin/ProductsPage";
import StorePage from "./pages/admin/StorePage";
import OrderPage from "./pages/admin/OrderPage";
import PromoPage from "./pages/admin/PromoPage";
import MenuPage from "./pages/customer/MenuPage";
import PromotionPage from "./pages/customer/PromotionPage";
import Storesapge from "./pages/customer/Storesapge";
import SamplePage from "./pages/customer/SamplePage";
import CategoriesPage from "./pages/admin/CategoryPage";
import OwnerPage from "./pages/admin/OwnerPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Redirect from / to /home */}
                <Route path="/" element={<Navigate to="/home" />} />
                {/* Other routes */}
                <Route element={<HomePage />} path="/home" />
                <Route element={<MenuPage />} path="/menu" />
                <Route element={<DashboardPage />} path="/dashboard" />
                <Route element={<ManagerPage />} path="/managers" />
                <Route element={<ProductsPage />} path="/products" />
                <Route element={<StorePage />} path="/stores" />
                <Route element={<OrderPage />} path="/orders" />
                <Route element={<LoginPage />} path="/admin/login" />
                <Route element={<PromoPage />} path="/promos" />
                <Route element={<PromotionPage />} path="/promotions" />
                <Route element={<Storesapge />} path="/store-locations" />
                <Route element={<SamplePage />} path="/sample-page" />
                <Route element={<CategoriesPage />} path="/categories" />
                <Route element={<OwnerPage />} path="/owners" />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

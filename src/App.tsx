import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import styles from "./app.module.css";
import MenuLink from "./components/MenuLink";
import SizesPage from "./pages/SizesPage";
import ColorsPage from "./pages/ColorsPage";
import MaterialsPage from "./pages/MaterialsPage";
import SleevesPage from "./pages/SleevesPage";
import PrintsPage from "./pages/PrintsPage";
import AccountPage from "./pages/AccountPage";
import { Toaster } from "react-hot-toast";
import SellersPage from "./pages/SellersPage";
import StocksPage from "./pages/StocksPage";
import AddProductPage from "./pages/AddProductPage";
import NewClientsPage from "./pages/NewClientsPage";

function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          position: "bottom-right",
          style: {
            background: "#363636",
            color: "#fff",
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <div className={styles.app}>
        <div className={styles.appNav}>
          <nav>
            <MenuLink label="Добавить счет" to="/account" />
            <MenuLink label="Все товары" to="/products" />
            <MenuLink label="Размеры" to="/sizes" />
            <MenuLink label="Цвета" to="/colors" />
            <MenuLink label="Материалы" to="/materials" />
            <MenuLink label="Длина рукава" to="/sleeves" />
            <MenuLink label="Принты" to="/prints" />
            <MenuLink label="Поставщики" to="/sellers" />
            <MenuLink label="Склады" to="/stocks" />
            <MenuLink label="Добавить товар" to="/add-product" />
            <MenuLink label="Новые клиенты" to="/new-clients" />
          </nav>
        </div>

        <div className={styles.appContent}>
          <Switch>
            <Route path="/products">
              <ProductsPage />
            </Route>
            <Route path="/sizes">
              <SizesPage />
            </Route>
            <Route path="/colors">
              <ColorsPage />
            </Route>
            <Route path="/materials">
              <MaterialsPage />
            </Route>
            <Route path="/sleeves">
              <SleevesPage />
            </Route>
            <Route path="/prints">
              <PrintsPage />
            </Route>
            <Route path="/account">
              <AccountPage />
            </Route>
            <Route path="/sellers">
              <SellersPage />
            </Route>
            <Route path="/stocks">
              <StocksPage />
            </Route>
            <Route path="/add-product">
              <AddProductPage />
            </Route>
            <Route path="/new-clients">
              <NewClientsPage />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;

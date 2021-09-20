import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import styles from "./app.module.css";
import MenuLink from "./components/MenuLink";
import SizesPage from "./pages/SizesPage";
import ColorsPage from "./pages/ColorsPage";

function App() {
  return (
    <Router>
      <div className={styles.app}>
        <div className={styles.appNav}>
          <nav>
            <MenuLink label="Все товары" to="/products" />
            <MenuLink label="Размеры" to="/sizes" />
            <MenuLink label="Цвета" to="/colors" />
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
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;

import {Action, configureStore, ThunkAction} from "@reduxjs/toolkit";
import logger from "redux-logger";
import productsReducer from "../features/products/productsSlice";
import sizesReducer from "../features/sizes/sizesSlice";
import colorsReducer from "../features/colors/colorsSlice";
import materialsReducer from "../features/materials/materialsSlice";
import sleevesReducer from "../features/sleeves/sleevesSlice";
import printsReducer from "../features/prints/printsSlice";
import sellersReducer from "../features/sellers/sellersSlice";
import stocksReducer from "../features/stocks/stocksSlice";
import parsedProductsReducer from "../features/parsedProducts/parsedProductsSlice";
import widgetReducer from "../features/widget/widgetSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    sizes: sizesReducer,
    colors: colorsReducer,
    materials: materialsReducer,
    sleeves: sleevesReducer,
    prints: printsReducer,
    sellers: sellersReducer,
    stocks: stocksReducer,
    parsedProducts: parsedProductsReducer,
    widget: widgetReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

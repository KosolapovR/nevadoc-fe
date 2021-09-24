import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface Widget {
  stock: string;
  seller: string;
  fileName: string;
}

export interface WidgetState {
  data: Widget;
}

const initialState: WidgetState = {
  data: {
    stock: "",
    seller: "",
    fileName: "",
  },
};

export const widgetSlice = createSlice({
  name: "widget",
  initialState,
  reducers: {
    setWidgetSeller: (state, action) => {
      state.data.seller = action.payload;
    },
    setWidgetStock: (state, action) => {
      state.data.stock = action.payload;
    },
    setWidgetFileName: (state, action) => {
      state.data.fileName = action.payload;
    },
  },
});

export const { setWidgetSeller, setWidgetStock, setWidgetFileName } =
  widgetSlice.actions;
export const selectWidgetSeller = (state: RootState) =>
  state.widget.data.seller;
export const selectWidgetStock = (state: RootState) => state.widget.data.stock;
export const selectWidgetFileName = (state: RootState) =>
  state.widget.data.fileName;

export default widgetSlice.reducer;

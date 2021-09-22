import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios, { AxiosRequestConfig } from "axios";
import { URLS } from "../../api";

export interface ParsedProducts {
  id: string;
  seller: string;
  name: string;
  pattern: string;
  color?: string;
  size?: string;
  sleeve?: string;
  material?: string;
  prints?: string;
}

export interface ParsedProductsState {
  data: ParsedProducts[];
  status: "idle" | "loading" | "failed";
}

const initialState: ParsedProductsState = {
  data: [],
  status: "idle",
};

export const requestParsedProductsAsync = createAsyncThunk(
  "parsedProducts/fetchParsedProducts",
  async (config: AxiosRequestConfig) => {
    const response = await axios.get(URLS.getParsedProducts(), config);
    // The value we return becomes the `fulfilled` action payload
    return response?.data?.data;
  }
);

export const parsedProductsSlice = createSlice({
  name: "parsedProducts",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {},
  // The `extraReducers` field lets the slice handle actions defined elsewhere,
  // including actions generated by createAsyncThunk or in other slices.
  extraReducers: (builder) => {
    builder
      .addCase(requestParsedProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestParsedProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      });
  },
});

export const {} = parsedProductsSlice.actions;
export const selectParsedProducts = (state: RootState) =>
  state.parsedProducts.data;
export default parsedProductsSlice.reducer;

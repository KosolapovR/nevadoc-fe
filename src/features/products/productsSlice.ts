import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";
import { CreateReq, UpdateReq } from "../../types";

export interface Product {
  id?: string;
  seller: string;
  name: string;
  pattern: string;
  color?: string;
  size?: string;
  sleeve?: string;
  material?: string;
  prints?: string;
}

export interface UniqueProducts {
  name: string;
}

export interface ProductsState {
  data: Product[];
  unique: UniqueProducts[];
  status: "idle" | "loading" | "failed";
}

const initialState: ProductsState = {
  data: [],
  unique: [],
  status: "idle",
};

export const requestProductsAsync = createAsyncThunk(
  "products/fetchProducts",
  async () => {
    const response = await axios.get(URLS.getProducts());
    // The value we return becomes the `fulfilled` action payload
    return response?.data?.data;
  }
);

export const requestUniqueProductsAsync = createAsyncThunk(
  "products/fetchUniqueProducts",
  async () => {
    const response = await axios.get(URLS.getProducts(), {
      params: { unique: true },
    });
    // The value we return becomes the `fulfilled` action payload
    return response?.data?.data;
  }
);

export const postProductsAsync = createAsyncThunk(
  "products/postProducts",
  async (request: CreateReq) => {
    const response = await axios.post(URLS.getProducts(), request);
    // The value we return becomes the `fulfilled` action payload
    return response?.data?.data;
  }
);

export const updateProductsAsync = createAsyncThunk(
  "products/updateProducts",
  async (request: UpdateReq) => {
    const response = await axios.put(URLS.getProducts(request.id), request);
    return response?.data?.data;
  }
);

export const deleteProductsAsync = createAsyncThunk(
  "products/deleteProducts",
  async (id: string) => {
    const response = await axios.delete(URLS.getProducts(id));
    // The value we return becomes the `fulfilled` action payload
    return response?.data?.data;
  }
);

export const productsSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    set: (state, action: PayloadAction<Product[]>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(requestUniqueProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestUniqueProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.unique = action.payload;
      })
      .addCase(postProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);
      })
      .addCase(updateProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        state.data[index] = action.payload;
      })
      .addCase(deleteProductsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteProductsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Product) => item.id === action.meta.arg
        );
        if (index > -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

export const { set } = productsSlice.actions;
export const selectProducts = (state: RootState) => state.products.data;
export const selectUniqueProducts = (state: RootState) => state.products.unique;
export default productsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";
import { CreateReq, UpdateReq } from "../../types";

export interface Stock {
  id: string;
  engName: string;
  ruName: string;
}

export interface StocksState {
  data: Stock[];
  status: "idle" | "loading" | "failed";
}

const initialState: StocksState = {
  data: [],
  status: "idle",
};

export const requestStocksAsync = createAsyncThunk(
  "stocks/fetchStocks",
  async () => {
    const response = await axios.get(URLS.getStocks());
    return response?.data?.data;
  }
);

export const postStockAsync = createAsyncThunk(
  "stocks/postStock",
  async (request: CreateReq) => {
    const response = await axios.post(URLS.getStocks(), request);
    return response?.data?.data;
  }
);

export const updateStockAsync = createAsyncThunk(
  "stocks/updateStock",
  async (request: UpdateReq) => {
    const response = await axios.put(URLS.getStocks(request.id), request);
    return response?.data?.data;
  }
);

export const deleteStockAsync = createAsyncThunk(
  "stocks/deleteStock",
  async (id: string) => {
    const response = await axios.delete(URLS.getStocks(id));
    return response?.data?.data;
  }
);

export const stocksSlice = createSlice({
  name: "stock",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestStocksAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestStocksAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(postStockAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postStockAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);
      })
      .addCase(updateStockAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateStockAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Stock) => item.id === action.payload.id
        );

        state.data[index] = action.payload;
      })
      .addCase(deleteStockAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteStockAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Stock) => item.id === action.meta.arg
        );
        if (index > -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

export const {} = stocksSlice.actions;
export const selectStocks = (state: RootState) => state.stocks.data;
export default stocksSlice.reducer;

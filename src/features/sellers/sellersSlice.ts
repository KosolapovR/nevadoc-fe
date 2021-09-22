import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";
import { CreateReq, UpdateReq } from "../../types";

export interface Seller {
  id: string;
  engName: string;
  ruName: string;
}

export interface SellersState {
  data: Seller[];
  status: "idle" | "loading" | "failed";
}

const initialState: SellersState = {
  data: [],
  status: "idle",
};

export const requestSellersAsync = createAsyncThunk(
  "sellers/fetchSellers",
  async () => {
    const response = await axios.get(URLS.getSellers());
    return response?.data?.data;
  }
);

export const postSellerAsync = createAsyncThunk(
  "sellers/postSeller",
  async (request: CreateReq) => {
    const response = await axios.post(URLS.getSellers(), request);
    return response?.data?.data;
  }
);

export const updateSellerAsync = createAsyncThunk(
  "sellers/updateSeller",
  async (request: UpdateReq) => {
    const response = await axios.put(URLS.getSellers(request.id), request);
    return response?.data?.data;
  }
);

export const deleteSellerAsync = createAsyncThunk(
  "sellers/deleteSeller",
  async (id: string) => {
    const response = await axios.delete(URLS.getSellers(id));
    return response?.data?.data;
  }
);

export const sellersSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestSellersAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestSellersAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(postSellerAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postSellerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);
      })
      .addCase(updateSellerAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSellerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Seller) => item.id === action.payload.id
        );

        state.data[index] = action.payload;
      })
      .addCase(deleteSellerAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteSellerAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Seller) => item.id === action.meta.arg
        );
        if (index > -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

export const {} = sellersSlice.actions;
export const selectSellers = (state: RootState) => state.sellers.data;
export default sellersSlice.reducer;

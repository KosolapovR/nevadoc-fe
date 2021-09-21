import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";
import { CreateReq, UpdateReq } from "../../types";

export interface Size {
  id: string;
  value: string;
}

export interface SizesState {
  data: Size[];
  status: "idle" | "loading" | "failed";
}

const initialState: SizesState = {
  data: [],
  status: "idle",
};

export const requestSizesAsync = createAsyncThunk(
  "sizes/fetchSizes",
  async () => {
    const response = await axios.get(URLS.getSizes());
    return response?.data?.data;
  }
);

export const postSizeAsync = createAsyncThunk(
  "sizes/postSize",
  async (request: CreateReq) => {
    const response = await axios.post(URLS.getSizes(), request);
    return response?.data?.data;
  }
);

export const updateSizeAsync = createAsyncThunk(
  "sizes/updateSize",
  async (request: UpdateReq) => {
    const response = await axios.put(URLS.getSizes(request.id), request);
    return response?.data?.data;
  }
);

export const deleteSizeAsync = createAsyncThunk(
  "sizes/deleteSize",
  async (id: string) => {
    const response = await axios.delete(URLS.getSizes(id));
    return response?.data?.data;
  }
);

export const sizesSlice = createSlice({
  name: "size",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestSizesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestSizesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(postSizeAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postSizeAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);
      })
      .addCase(updateSizeAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSizeAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Size) => item.id === action.payload.id
        );

        state.data[index] = action.payload;
      })
      .addCase(deleteSizeAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteSizeAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Size) => item.id === action.meta.arg
        );
        if (index > -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

export const {} = sizesSlice.actions;
export const selectSizes = (state: RootState) => state.sizes.data;
export default sizesSlice.reducer;

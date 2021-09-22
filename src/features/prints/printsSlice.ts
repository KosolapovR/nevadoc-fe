import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";
import { CreateReq, UpdateReq } from "../../types";

export interface Print {
  id: string;
  value: string;
}

export interface PrintsState {
  data: Print[];
  status: "idle" | "loading" | "failed";
}

const initialState: PrintsState = {
  data: [],
  status: "idle",
};

export const requestPrintsAsync = createAsyncThunk(
  "prints/fetchPrints",
  async () => {
    const response = await axios.get(URLS.getPrints());
    return response?.data?.data;
  }
);

export const postPrintAsync = createAsyncThunk(
  "prints/postPrint",
  async (request: CreateReq) => {
    const response = await axios.post(URLS.getPrints(), request);
    return response?.data?.data;
  }
);

export const updatePrintAsync = createAsyncThunk(
  "prints/updatePrint",
  async (request: UpdateReq) => {
    const response = await axios.put(URLS.getPrints(request.id), request);
    return response?.data?.data;
  }
);

export const deletePrintAsync = createAsyncThunk(
  "prints/deletePrint",
  async (id: string) => {
    const response = await axios.delete(URLS.getPrints(id));
    return response?.data?.data;
  }
);

export const printsSlice = createSlice({
  name: "print",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestPrintsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestPrintsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(postPrintAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postPrintAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);
      })
      .addCase(updatePrintAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePrintAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Print) => item.id === action.payload.id
        );

        state.data[index] = action.payload;
      })
      .addCase(deletePrintAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deletePrintAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Print) => item.id === action.meta.arg
        );
        if (index > -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

export const {} = printsSlice.actions;
export const selectPrints = (state: RootState) => state.prints.data;
export default printsSlice.reducer;

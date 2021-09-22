import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";
import { CreateReq, UpdateReq } from "../../types";

export interface Color {
  id: string;
  value: string;
}

export interface ColorsState {
  data: Color[];
  status: "idle" | "loading" | "failed";
}

const initialState: ColorsState = {
  data: [],
  status: "idle",
};

export const requestColorsAsync = createAsyncThunk(
  "colors/fetchColors",
  async () => {
    const response = await axios.get(URLS.getColors());
    return response?.data?.data;
  }
);

export const postColorAsync = createAsyncThunk(
  "colors/postColor",
  async (request: CreateReq) => {
    const response = await axios.post(URLS.getColors(), request);
    return response?.data?.data;
  }
);

export const updateColorAsync = createAsyncThunk(
  "colors/updateColor",
  async (request: UpdateReq) => {
    const response = await axios.put(URLS.getColors(request.id), request);
    return response?.data?.data;
  }
);

export const deleteColorAsync = createAsyncThunk(
  "colors/deleteColor",
  async (id: string) => {
    const response = await axios.delete(URLS.getColors(id));
    return response?.data?.data;
  }
);

export const colorsSlice = createSlice({
  name: "color",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestColorsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestColorsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(postColorAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postColorAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);
      })
      .addCase(updateColorAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateColorAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Color) => item.id === action.payload.id
        );

        state.data[index] = action.payload;
      })
      .addCase(deleteColorAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteColorAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Color) => item.id === action.meta.arg
        );
        if (index > -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

export const {} = colorsSlice.actions;
export const selectColors = (state: RootState) => state.colors.data;
export default colorsSlice.reducer;

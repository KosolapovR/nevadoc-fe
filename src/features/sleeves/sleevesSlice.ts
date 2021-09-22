import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";
import { CreateReq, UpdateReq } from "../../types";

export interface Sleeve {
  id: string;
  value: string;
}

export interface SleevesState {
  data: Sleeve[];
  status: "idle" | "loading" | "failed";
}

const initialState: SleevesState = {
  data: [],
  status: "idle",
};

export const requestSleevesAsync = createAsyncThunk(
  "sleeves/fetchSleeves",
  async () => {
    const response = await axios.get(URLS.getSleeves());
    return response?.data?.data;
  }
);

export const postSleeveAsync = createAsyncThunk(
  "sleeves/postSleeve",
  async (request: CreateReq) => {
    const response = await axios.post(URLS.getSleeves(), request);
    return response?.data?.data;
  }
);

export const updateSleeveAsync = createAsyncThunk(
  "sleeves/updateSleeve",
  async (request: UpdateReq) => {
    const response = await axios.put(URLS.getSleeves(request.id), request);
    return response?.data?.data;
  }
);

export const deleteSleeveAsync = createAsyncThunk(
  "sleeves/deleteSleeve",
  async (id: string) => {
    const response = await axios.delete(URLS.getSleeves(id));
    return response?.data?.data;
  }
);

export const sleevesSlice = createSlice({
  name: "sleeve",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestSleevesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestSleevesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(postSleeveAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postSleeveAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);
      })
      .addCase(updateSleeveAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSleeveAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Sleeve) => item.id === action.payload.id
        );

        state.data[index] = action.payload;
      })
      .addCase(deleteSleeveAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteSleeveAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Sleeve) => item.id === action.meta.arg
        );
        if (index > -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

export const {} = sleevesSlice.actions;
export const selectSleeves = (state: RootState) => state.sleeves.data;
export default sleevesSlice.reducer;

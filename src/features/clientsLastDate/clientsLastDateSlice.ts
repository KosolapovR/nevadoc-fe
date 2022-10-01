import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";

export interface ClientsLastDateState {
  data: string;
  status: "idle" | "loading" | "failed";
}

const initialState: ClientsLastDateState = {
  data: "",
  status: "idle",
};

export const getLastClientDateAsync = createAsyncThunk(
  "clientsLastDate/fetchDate",
  async () => {
    const response = await axios.get(URLS.getClientLastDate());
    return new Date(response?.data?.data.date.date).toDateString();
  }
);

export const clientsLastDateSlice = createSlice({
  name: "clientsLastDate",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLastClientDateAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLastClientDateAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      });
  },
});

export const selectClientsLastDate = (state: RootState) =>
  state.clientsLastDate.data;
export default clientsLastDateSlice.reducer;

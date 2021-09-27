import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";

export interface NewClient {
  id: string;
  date: string;
  number: string;
  phone: string;
  initials: string;
  correction: string;
  type: string;
  comment?: string;
}

export interface NewClientsState {
  data: NewClient[];
  status: "idle" | "loading" | "failed";
}

const initialState: NewClientsState = {
  data: [],
  status: "idle",
};

export const uploadNewClientsAsync = createAsyncThunk(
  "newClients/uploadNewClients",
  async (formData: object) => {
    const response = await axios.post(URLS.getClientsUpload(), formData);
    return response?.data?.data;
  }
);

export const newClientsSlice = createSlice({
  name: "newClients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadNewClientsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(uploadNewClientsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      });
  },
});

// export const {} = newClientsSlice.actions;
export const selectNewClients = (state: RootState) => state.newClients.data;
export default newClientsSlice.reducer;

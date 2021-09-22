import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { URLS } from "../../api";
import { CreateReq, UpdateReq } from "../../types";

export interface Material {
  id: string;
  value: string;
}

export interface MaterialsState {
  data: Material[];
  status: "idle" | "loading" | "failed";
}

const initialState: MaterialsState = {
  data: [],
  status: "idle",
};

export const requestMaterialsAsync = createAsyncThunk(
  "materials/fetchMaterials",
  async () => {
    const response = await axios.get(URLS.getMaterials());
    return response?.data?.data;
  }
);

export const postMaterialAsync = createAsyncThunk(
  "materials/postMaterial",
  async (request: CreateReq) => {
    const response = await axios.post(URLS.getMaterials(), request);
    return response?.data?.data;
  }
);

export const updateMaterialAsync = createAsyncThunk(
  "materials/updateMaterial",
  async (request: UpdateReq) => {
    const response = await axios.put(URLS.getMaterials(request.id), request);
    return response?.data?.data;
  }
);

export const deleteMaterialAsync = createAsyncThunk(
  "materials/deleteMaterial",
  async (id: string) => {
    const response = await axios.delete(URLS.getMaterials(id));
    return response?.data?.data;
  }
);

export const materialsSlice = createSlice({
  name: "material",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(requestMaterialsAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestMaterialsAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data = action.payload;
      })
      .addCase(postMaterialAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(postMaterialAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.data.push(action.payload);
      })
      .addCase(updateMaterialAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMaterialAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Material) => item.id === action.payload.id
        );

        state.data[index] = action.payload;
      })
      .addCase(deleteMaterialAsync.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(deleteMaterialAsync.fulfilled, (state, action) => {
        state.status = "idle";
        const index = state.data.findIndex(
          (item: Material) => item.id === action.meta.arg
        );
        if (index > -1) {
          state.data.splice(index, 1);
        }
      });
  },
});

export const {} = materialsSlice.actions;
export const selectMaterials = (state: RootState) => state.materials.data;
export default materialsSlice.reducer;

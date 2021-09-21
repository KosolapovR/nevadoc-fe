import React, { useCallback, useEffect } from "react";
import { SimpleTable } from "../../components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteMaterialAsync,
  postMaterialAsync,
  requestMaterialsAsync,
  selectMaterials,
  updateMaterialAsync,
} from "../../features/materials/materialsSlice";
import { CreateReq, UpdateReq } from "../../types";

function MaterialsPage() {
  const materials = useAppSelector(selectMaterials);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestMaterialsAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postMaterialAsync(data));
    },
    [dispatch]
  );

  const handleEditItem = useCallback(
    (data: UpdateReq | object) => {
      dispatch(updateMaterialAsync(data as UpdateReq));
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      dispatch(deleteMaterialAsync(id));
    },
    [dispatch, deleteMaterialAsync]
  );

  return (
    <div>
      <SimpleTable
        rows={materials}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        addFormTitle="Добавление материала"
        editFormTitle="Редактирование материала"
      />
    </div>
  );
}

export default MaterialsPage;

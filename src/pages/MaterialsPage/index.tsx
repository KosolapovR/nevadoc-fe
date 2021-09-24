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
import { toast } from "react-hot-toast";

function MaterialsPage() {
  const materials = useAppSelector(selectMaterials);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestMaterialsAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postMaterialAsync(data))
        .unwrap()
        .then(() => toast.success("Тип ткани успешно добавлен"))
        .catch(() =>
          toast.error("Ошибка добавления ткани, убедитесь что этой ткани нет")
        );
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
      dispatch(deleteMaterialAsync(id))
        .unwrap()
        .then(() => toast.success("Тип ткани успешно удален"))
        .catch(() => toast.error("Ошибка удаления типа ткани"));
    },
    [dispatch]
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
        tableHeader="Ткани"
      />
    </div>
  );
}

export default MaterialsPage;

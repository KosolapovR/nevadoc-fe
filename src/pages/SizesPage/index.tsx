import React, { useCallback, useEffect } from "react";
import { SimpleTable } from "../../components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteSizeAsync,
  postSizeAsync,
  requestSizesAsync,
  selectSizes,
  updateSizeAsync,
} from "../../features/sizes/sizesSlice";
import { CreateReq, UpdateReq } from "../../types";

function SizesPage() {
  const sizes = useAppSelector(selectSizes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestSizesAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postSizeAsync(data));
    },
    [dispatch]
  );

  const handleEditItem = useCallback(
    (data: UpdateReq | object) => {
      dispatch(updateSizeAsync(data as UpdateReq));
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      dispatch(deleteSizeAsync(id));
    },
    [dispatch, deleteSizeAsync]
  );

  return (
    <div>
      <SimpleTable
        rows={sizes}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        addFormTitle="Добавление размеров"
        editFormTitle="Редактирование размеров"
      />
    </div>
  );
}

export default SizesPage;

import React, { useCallback, useEffect } from "react";
import { SimpleTable } from "../../components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteColorAsync,
  postColorAsync,
  requestColorsAsync,
  selectColors,
  updateColorAsync,
} from "../../features/colors/colorsSlice";
import { CreateReq, UpdateReq } from "../../types";

function ColorsPage() {
  const colors = useAppSelector(selectColors);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestColorsAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postColorAsync(data));
    },
    [dispatch]
  );

  const handleEditItem = useCallback(
    (data: UpdateReq | object) => {
      dispatch(updateColorAsync(data as UpdateReq));
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      dispatch(deleteColorAsync(id));
    },
    [dispatch]
  );

  return (
    <div>
      <SimpleTable
        rows={colors}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        addFormTitle="Добавление цвета"
        editFormTitle="Редактирование цвета"
      />
    </div>
  );
}

export default ColorsPage;

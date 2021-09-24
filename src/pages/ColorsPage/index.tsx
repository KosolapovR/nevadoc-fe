import React, {useCallback, useEffect} from "react";
import {SimpleTable} from "../../components";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
  deleteColorAsync,
  postColorAsync,
  requestColorsAsync,
  selectColors,
  updateColorAsync,
} from "../../features/colors/colorsSlice";
import {CreateReq, UpdateReq} from "../../types";
import {toast} from "react-hot-toast";

function ColorsPage() {
  const colors = useAppSelector(selectColors);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestColorsAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postColorAsync(data))
        .unwrap()
        .then(() => toast.success("Цвет успешно добавлен"))
        .catch(() =>
          toast.error("Ошибка добавления цвета, убедитесь что этого цвета нет")
        );
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
      dispatch(deleteColorAsync(id))
        .unwrap()
        .then(() => toast.success("Цвет успешно удален"))
        .catch(() => toast.error("Ошибка удаления цвета"));
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
        tableHeader="Цвета"
      />
    </div>
  );
}

export default ColorsPage;

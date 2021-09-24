import React, {useCallback, useEffect} from "react";
import {SimpleTable} from "../../components";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    deleteSizeAsync,
    postSizeAsync,
    requestSizesAsync,
    selectSizes,
    updateSizeAsync,
} from "../../features/sizes/sizesSlice";
import {CreateReq, UpdateReq} from "../../types";
import {toast} from "react-hot-toast";

function SizesPage() {
  const sizes = useAppSelector(selectSizes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestSizesAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postSizeAsync(data))
        .unwrap()
        .then(() => toast.success("Размер успешно добавлен"))
        .catch(() =>
          toast.error(
            "Ошибка добавления размера, убедитесь что этого размера нет"
          )
        );
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
      dispatch(deleteSizeAsync(id))
        .unwrap()
        .then(() => toast.success("Размер успешно удален"))
        .catch(() => toast.error("Ошибка удаления размера"));
    },
    [dispatch]
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
        tableHeader="Размеры"
      />
    </div>
  );
}

export default SizesPage;

import React, {useCallback, useEffect} from "react";
import {SimpleTable} from "../../components";
import {useAppDispatch, useAppSelector} from "../../app/hooks";
import {
    deleteSleeveAsync,
    postSleeveAsync,
    requestSleevesAsync,
    selectSleeves,
    updateSleeveAsync,
} from "../../features/sleeves/sleevesSlice";
import {CreateReq, UpdateReq} from "../../types";
import {toast} from "react-hot-toast";

function SleevesPage() {
  const sleeves = useAppSelector(selectSleeves);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestSleevesAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postSleeveAsync(data))
        .unwrap()
        .then(() => toast.success("Тип рукава успешно добавлен"))
        .catch(() =>
          toast.error(
            "Ошибка добавления типа рукава, убедитесь что этого типа нет"
          )
        );
    },
    [dispatch]
  );

  const handleEditItem = useCallback(
    (data: UpdateReq | object) => {
      dispatch(updateSleeveAsync(data as UpdateReq))
        .unwrap()
        .then(() => toast.success("Тип рукава успешно удален"))
        .catch(() => toast.error("Ошибка удаления тива рукава"));
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      dispatch(deleteSleeveAsync(id));
    },
    [dispatch]
  );

  return (
    <div>
      <SimpleTable
        rows={sleeves}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        addFormTitle="Добавление длины рукава"
        editFormTitle="Редактирование длины рукава"
        tableHeader="Рукава"
      />
    </div>
  );
}

export default SleevesPage;

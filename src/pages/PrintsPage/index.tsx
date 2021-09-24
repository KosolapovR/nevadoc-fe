import React, { useCallback, useEffect } from "react";
import { SimpleTable } from "../../components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deletePrintAsync,
  postPrintAsync,
  requestPrintsAsync,
  selectPrints,
  updatePrintAsync,
} from "../../features/prints/printsSlice";
import { CreateReq, UpdateReq } from "../../types";
import { toast } from "react-hot-toast";

function PrintsPage() {
  const prints = useAppSelector(selectPrints);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestPrintsAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postPrintAsync(data))
        .unwrap()
        .then(() => toast.success("Принт успешно добавлен"))
        .catch(() =>
          toast.error(
            "Ошибка добавления принта, убедитесь что этого принта нет"
          )
        );
    },
    [dispatch]
  );

  const handleEditItem = useCallback(
    (data: UpdateReq | object) => {
      dispatch(updatePrintAsync(data as UpdateReq));
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      dispatch(deletePrintAsync(id))
        .unwrap()
        .then(() => toast.success("Принт успешно удален"))
        .catch(() => toast.error("Ошибка удаления принта"));
    },
    [dispatch]
  );

  return (
    <div>
      <SimpleTable
        rows={prints}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        addFormTitle="Добавление принта"
        editFormTitle="Редактирование принта"
        tableHeader="Принты"
      />
    </div>
  );
}

export default PrintsPage;

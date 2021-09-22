import React, { useCallback, useEffect } from "react";
import { SimpleTable } from "../../components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deletePrintAsync,
  postPrintAsync,
  requestPrintsAsync,
  updatePrintAsync,
  selectPrints,
} from "../../features/prints/printsSlice";
import { CreateReq, UpdateReq } from "../../types";

function PrintsPage() {
  const prints = useAppSelector(selectPrints);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestPrintsAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postPrintAsync(data));
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
      dispatch(deletePrintAsync(id));
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
      />
    </div>
  );
}

export default PrintsPage;

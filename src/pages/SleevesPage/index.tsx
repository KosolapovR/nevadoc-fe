import React, { useCallback, useEffect } from "react";
import { SimpleTable } from "../../components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteSleeveAsync,
  postSleeveAsync,
  requestSleevesAsync,
  selectSleeves,
  updateSleeveAsync,
} from "../../features/sleeves/sleevesSlice";
import { CreateReq, UpdateReq } from "../../types";

function SleevesPage() {
  const sleeves = useAppSelector(selectSleeves);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestSleevesAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postSleeveAsync(data));
    },
    [dispatch]
  );

  const handleEditItem = useCallback(
    (data: UpdateReq | object) => {
      dispatch(updateSleeveAsync(data as UpdateReq));
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
      />
    </div>
  );
}

export default SleevesPage;

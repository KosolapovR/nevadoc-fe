import React, { useCallback, useEffect } from "react";
import { SimpleTable } from "../../components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteStockAsync,
  postStockAsync,
  requestStocksAsync,
  selectStocks,
  updateStockAsync,
} from "../../features/stocks/stocksSlice";
import { CreateReq, UpdateReq } from "../../types";

function StocksPage() {
  const stocks = useAppSelector(selectStocks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestStocksAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postStockAsync(data));
    },
    [dispatch]
  );

  const handleEditItem = useCallback(
    (data: UpdateReq | object) => {
      dispatch(updateStockAsync(data as UpdateReq));
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      dispatch(deleteStockAsync(id));
    },
    [dispatch]
  );

  return (
    <div>
      <SimpleTable
        rows={stocks}
        columns={["engName", "ruName"]}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        addFormTitle="Добавление склада"
        editFormTitle="Редактирование склада"
      />
    </div>
  );
}

export default StocksPage;

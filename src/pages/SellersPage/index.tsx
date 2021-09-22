import React, { useCallback, useEffect } from "react";
import { SimpleTable } from "../../components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  deleteSellerAsync,
  postSellerAsync,
  requestSellersAsync,
  selectSellers,
  updateSellerAsync,
} from "../../features/sellers/sellersSlice";
import { CreateReq, UpdateReq } from "../../types";

function SellersPage() {
  const sellers = useAppSelector(selectSellers);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(requestSellersAsync());
  }, [dispatch]);

  const handleAddItem = useCallback(
    (data: CreateReq) => {
      dispatch(postSellerAsync(data));
    },
    [dispatch]
  );

  const handleEditItem = useCallback(
    (data: UpdateReq | object) => {
      dispatch(updateSellerAsync(data as UpdateReq));
    },
    [dispatch]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      dispatch(deleteSellerAsync(id));
    },
    [dispatch]
  );

  return (
    <div>
      <SimpleTable
        rows={sellers}
        columns={["engName", "ruName"]}
        onAddItem={handleAddItem}
        onEditItem={handleEditItem}
        onDeleteItem={handleDeleteItem}
        addFormTitle="Добавление поставщика"
        editFormTitle="Редактирование поставщика"
      />
    </div>
  );
}

export default SellersPage;

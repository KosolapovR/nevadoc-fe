import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@mui/styles";
import BackIcon from "@mui/icons-material/ArrowBackIosNew";
import * as yup from "yup";
import { useFormik } from "formik";
import { useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  requestColorsAsync,
  selectColors,
} from "../../features/colors/colorsSlice";
import { CreateReq, UpdateReq } from "../../types";
import {
  requestSellersAsync,
  selectSellers,
} from "../../features/sellers/sellersSlice";
import {
  requestSizesAsync,
  selectSizes,
} from "../../features/sizes/sizesSlice";
import {
  requestSleevesAsync,
  selectSleeves,
} from "../../features/sleeves/sleevesSlice";
import {
  requestMaterialsAsync,
  selectMaterials,
} from "../../features/materials/materialsSlice";
import {
  requestPrintsAsync,
  selectPrints,
} from "../../features/prints/printsSlice";
import {
  deleteProductsAsync,
  postProductsAsync,
  requestUniqueProductsAsync,
  selectUniqueProducts,
  updateProductsAsync,
} from "../../features/products/productsSlice";
import { toast } from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import { selectWidgetSeller } from "../../features/widget/widgetSlice";

const useStyles = makeStyles({
  container: {
    padding: "16px",
    maxWidth: "440px",
  },
  fromTitle: { fontWeight: 600 },
  textField: {},
  textFieldError: {
    marginBottom: "23px",
  },
  button: {
    marginTop: "16px",
    height: "40px",
    width: "70%",
  },

  deleteButton: {
    height: "40px",
  },
});

const validationSchema = yup.object({
  seller: yup.string().required("Поле обязательно для заполнения"),
  pattern: yup.string().required("Поле обязательно для заполнения"),
  name: yup.string().required("Поле обязательно для заполнения"),
});

type PropTypes = {
  initialValues?: {
    [key: string]: string;
  };
};

const AddProductPage = ({
  initialValues = {
    seller: "",
    pattern: "",
    name: "",
  },
}: PropTypes) => {
  const history: any = useHistory();
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const sellers = useAppSelector(selectSellers);
  const sizes = useAppSelector(selectSizes);
  const colors = useAppSelector(selectColors);
  const sleeves = useAppSelector(selectSleeves);
  const materials = useAppSelector(selectMaterials);
  const prints = useAppSelector(selectPrints);
  const uniqueProducts = useAppSelector(selectUniqueProducts);
  const widgetSeller = useAppSelector(selectWidgetSeller);

  const [currProductID, setCurrProductID] = useState("");

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values: UpdateReq | CreateReq) => {
      const clearedValues = Object.fromEntries(
        Object.entries(values).filter(([_, v]) => v !== "")
      );

      if (currProductID) {
        dispatch(updateProductsAsync({ ...clearedValues, id: currProductID }))
          .unwrap()
          .then(() => toast.success("Информация по товару сохранена"))
          .catch(() => toast.error("Не удалось сохранить товар"));
      } else {
        dispatch(postProductsAsync(clearedValues))
          .unwrap()
          .then((product) => {
            toast.success("Товар успешно добавлен");
            if (product) {
              const {
                seller,
                pattern,
                name,
                size,
                color,
                material,
                sleeve,
                print,
              } = product;

              formik.setValues({
                seller,
                pattern,
                name,
                size,
                color,
                material,
                sleeve,
                print,
              });
            }
          })
          .catch(() => toast.error("Не удалось добавить товар"));
      }
    },
  });

  useEffect(() => {
    if (!formik.values.seller) {
      formik.setFieldValue("seller", widgetSeller);
    }
  }, [formik]);

  useEffect(() => {
    dispatch(requestSellersAsync());
    dispatch(requestSizesAsync());
    dispatch(requestColorsAsync());
    dispatch(requestMaterialsAsync());
    dispatch(requestSleevesAsync());
    dispatch(requestPrintsAsync());
    dispatch(requestUniqueProductsAsync());
  }, [dispatch]);

  useEffect(() => {
    const product = history?.location?.state?.product;

    if (product) {
      const {
        id,
        seller,
        pattern,
        name,
        size,
        color,
        material,
        sleeve,
        print,
      } = product;

      setCurrProductID(id);

      formik.setValues({
        seller,
        pattern,
        name,
        size,
        color,
        material,
        sleeve,
        print,
      });
    }
  }, [history]);

  const handleSelectChange = useCallback(
    (event: SelectChangeEvent) => {
      const { name, value } = event.target;
      formik.setFieldValue(name, value, true);
    },
    [formik]
  );

  const handleGoToParsedProductPage = useCallback(() => {
    history.goBack();
  }, [history]);

  const handleDeleteProduct = useCallback(() => {
    if (currProductID) {
      dispatch(deleteProductsAsync(currProductID))
        .unwrap()
        .then(() => {
          toast.success("Товар удален");
          formik.resetForm();
          setCurrProductID("");
        })
        .catch(() => toast.error("Не удалось удалить товар"));
    }
  }, [dispatch, setCurrProductID, currProductID]);

  const handleSelectAutocomplete = useCallback(
    (event: any) => {
      const { innerText } = event.target;
      formik.setFieldValue("name", innerText);
    },
    [uniqueProducts]
  );

  return (
    <Paper className={classes.container} variant={"outlined"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignContent={"center"}
      >
        <IconButton onClick={handleGoToParsedProductPage}>
          <BackIcon color={"primary"} />
        </IconButton>
        <Typography className={classes.fromTitle}>
          {currProductID ? "Редактирование товара" : "Добавление товара"}
        </Typography>
      </Stack>

      <form onSubmit={formik.handleSubmit}>
        <FormControl sx={{ minWidth: 140, marginBottom: 1 }} fullWidth>
          <InputLabel id="seller-label">Поставщик</InputLabel>
          <Select
            labelId="seller-label"
            id="seller"
            name={"seller"}
            value={formik.values.seller}
            label="Поставщик"
            onChange={handleSelectChange}
            error={formik.touched.seller && Boolean(formik.errors.seller)}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {sellers.map((s) => (
              <MenuItem key={s.id} value={s.engName}>
                {s.ruName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tooltip title={formik.values.pattern}>
          <TextField
            sx={{ marginBottom: 1 }}
            fullWidth
            className={
              formik.touched.pattern && Boolean(formik.errors.pattern)
                ? classes.textField
                : classes.textFieldError
            }
            id="pattern"
            name="pattern"
            label="Паттерн"
            value={formik.values.pattern}
            onChange={formik.handleChange}
            error={formik.touched.pattern && Boolean(formik.errors.pattern)}
            helperText={formik.touched.pattern && formik.errors.pattern}
          />
        </Tooltip>

        <Autocomplete
          value={formik.values.name}
          onChange={handleSelectAutocomplete}
          freeSolo
          options={uniqueProducts.map((option) => option.name)}
          disableClearable
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                type: "search",
              }}
              sx={{ marginBottom: 1 }}
              fullWidth
              className={
                formik.touched.name && Boolean(formik.errors.name)
                  ? classes.textField
                  : classes.textFieldError
              }
              id="name"
              name="name"
              onChange={formik.handleChange}
              label="Наименование как в программе"
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          )}
        />

        <FormControl sx={{ minWidth: 140, marginBottom: 1 }} fullWidth>
          <InputLabel id="size-label">Размер</InputLabel>
          <Select
            labelId="size-label"
            id="size"
            value={formik.values.size ?? ""}
            name={"size"}
            label={"Размер"}
            onChange={handleSelectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {sizes.map((s) => (
              <MenuItem key={s.id} value={s.value}>
                {s.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140, marginBottom: 1 }} fullWidth>
          <InputLabel id="color-label">Цвет</InputLabel>
          <Select
            id="color"
            labelId="color-label"
            value={formik.values.color ?? ""}
            name={"color"}
            label={"Цвет"}
            onChange={handleSelectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {colors.map((s) => (
              <MenuItem key={s.id} value={s.value}>
                {s.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140, marginBottom: 1 }} fullWidth>
          <InputLabel id="material-label">Материал</InputLabel>
          <Select
            id="material"
            labelId="material-label"
            value={formik.values.material ?? ""}
            name={"material"}
            label={"Материал"}
            onChange={handleSelectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {materials.map((s) => (
              <MenuItem key={s.id} value={s.value}>
                {s.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140, marginBottom: 1 }} fullWidth>
          <InputLabel id="sleeve-label">Рукав</InputLabel>
          <Select
            id="sleeve"
            labelId="sleeve-label"
            value={formik.values.sleeve ?? ""}
            name={"sleeve"}
            label={"Рукав"}
            onChange={handleSelectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {sleeves.map((s) => (
              <MenuItem key={s.id} value={s.value}>
                {s.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 140, marginBottom: 1 }} fullWidth>
          <InputLabel id="print-label">Принт</InputLabel>
          <Select
            id="print"
            labelId="print-label"
            name={"print"}
            value={formik.values.print ?? ""}
            label={"Принт"}
            onChange={handleSelectChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            {prints.map((s) => (
              <MenuItem key={s.id} value={s.value}>
                {s.value}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {currProductID ? (
          <Stack direction="row" justifyContent="space-between">
            <Button
              className={classes.button}
              color="primary"
              variant="contained"
              type="submit"
            >
              Сохранить
            </Button>
            <Button
              disabled={!currProductID}
              className={classes.deleteButton}
              variant="contained"
              color="error"
              endIcon={<DeleteIcon />}
              onClick={handleDeleteProduct}
            >
              Удалить
            </Button>
          </Stack>
        ) : (
          <Button fullWidth color="primary" variant="contained" type="submit">
            Добавить
          </Button>
        )}
      </form>
    </Paper>
  );
};

export default AddProductPage;

import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { Paper, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { CreateReq, UpdateReq } from "../../types";

const useStyles = makeStyles({
  container: {
    padding: "16px",
  },
  textField: {
    width: "80%",
    marginRight: "16px",
  },
  textFieldError: {
    width: "80%",
    marginRight: "16px",
    marginBottom: "23px",
  },
  button: {
    height: "40px",
  },
});

const validationSchemaSimple = yup.object({
  value: yup.string().required("Поле обязательно для заполнения"),
});

const validationSchemaExt = yup.object({
  engName: yup.string().required("Поле обязательно для заполнения"),
  ruName: yup.string().required("Поле обязательно для заполнения"),
});

type PropTypes = {
  formTitle?: string;
  onSubmit: (data: UpdateReq | CreateReq) => void;
  initialValues?: {
    [key: string]: string;
  };
  simple?: boolean;
};

const SimpleItemForm = ({
  formTitle,
  simple = true,
  onSubmit,
  initialValues = simple ? { value: "" } : { engName: "", ruName: "" },
}: PropTypes) => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: simple ? validationSchemaSimple : validationSchemaExt,
    onSubmit: (values: UpdateReq | CreateReq) => {
      console.log("values", values);

      onSubmit(values);
    },
  });

  return (
    <Paper className={classes.container} variant={"outlined"}>
      {formTitle && <Typography marginBottom={2}>{formTitle}</Typography>}
      <form onSubmit={formik.handleSubmit}>
        {simple ? (
          <TextField
            className={
              formik.touched.value && Boolean(formik.errors.value)
                ? classes.textField
                : classes.textFieldError
            }
            size={"small"}
            id="value"
            name="value"
            label="Введите значение"
            value={formik.values.value}
            onChange={formik.handleChange}
            error={formik.touched.value && Boolean(formik.errors.value)}
            helperText={formik.touched.value && formik.errors.value}
          />
        ) : (
          <>
            <TextField
              className={
                formik.touched.engName && Boolean(formik.errors.engName)
                  ? classes.textField
                  : classes.textFieldError
              }
              disabled={initialValues.engName != ""}
              size={"small"}
              id="engName"
              name="engName"
              label="Введите engName"
              value={formik.values.engName}
              onChange={formik.handleChange}
              error={formik.touched.engName && Boolean(formik.errors.engName)}
              helperText={formik.touched.engName && formik.errors.engName}
            />
            <TextField
              className={
                formik.touched.ruName && Boolean(formik.errors.ruName)
                  ? classes.textField
                  : classes.textFieldError
              }
              size={"small"}
              id="ruName"
              name="ruName"
              label="Введите ruName"
              value={formik.values.ruName}
              onChange={formik.handleChange}
              error={formik.touched.ruName && Boolean(formik.errors.ruName)}
              helperText={formik.touched.ruName && formik.errors.ruName}
            />
          </>
        )}

        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          type="submit"
          size={"small"}
        >
          Сохранить
        </Button>
      </form>
    </Paper>
  );
};
export default SimpleItemForm;

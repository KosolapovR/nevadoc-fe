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
  form: {
    display: "flex",
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

const validationSchema = yup.object({
  value: yup.string().required("Поле обязательно для заполнения"),
});

type PropTypes = {
  formTitle?: string;
  onSubmit: (data: UpdateReq | CreateReq) => void;
  initialValues?: {
    [key: string]: string;
  };
};

const SimpleItemForm = ({
  formTitle,
  onSubmit,
  initialValues = { value: "" },
}: PropTypes) => {
  const classes = useStyles();

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values: UpdateReq | CreateReq) => {
      onSubmit(values);
    },
  });

  console.log("initialValues", initialValues);

  return (
    <Paper className={classes.container} variant={"outlined"}>
      {formTitle && <Typography marginBottom={2}>{formTitle}</Typography>}
      <form className={classes.form} onSubmit={formik.handleSubmit}>
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

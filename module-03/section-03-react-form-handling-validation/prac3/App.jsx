import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  newPassword: Yup.string().min(6, "Minimum 6 characters").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords do not match")
    .required("Required"),
});

export default function App() {
  const formik = useFormik({
    initialValues: { newPassword: "", confirmPassword: "" },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="newPassword"
        type="password"
        value={formik.values.newPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="New Password"
      />
      {formik.touched.newPassword && formik.errors.newPassword && (
        <div>{formik.errors.newPassword}</div>
      )}
      <input
        name="confirmPassword"
        type="password"
        value={formik.values.confirmPassword}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Confirm Password"
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword && (
        <div>{formik.errors.confirmPassword}</div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}

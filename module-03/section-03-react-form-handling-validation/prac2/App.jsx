import { useFormik } from "formik";
import * as Yup from "yup";

export default function App() {
  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        placeholder="Email"
      />
      {formik.touched.email && formik.errors.email && (
        <div className="error">{formik.errors.email}</div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}

import { useFormik } from "formik";

export default function App() {
  const formik = useFormik({
    initialValues: { amount: "" },
    onSubmit: async (values, { setSubmitting }) => {
      await new Promise((r) => setTimeout(r, 3000));
      console.log(values);
      setSubmitting(false);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <input
        name="amount"
        value={formik.values.amount}
        onChange={formik.handleChange}
        placeholder="Amount"
      />
      <button type="submit" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Đang xử lý..." : "Thanh toán"}
      </button>
    </form>
  );
}

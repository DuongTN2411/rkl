import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  fullName: Yup.string().required("Vui lòng nhập họ tên"),
  cccd: Yup.string()
    .matches(/^\d{12}$/, "CCCD phải là chuỗi đúng 12 chữ số")
    .required("Vui lòng nhập CCCD"),
  monthlyIncome: Yup.number()
    .typeError("Thu nhập phải là số")
    .min(5000000, "Thu nhập phải lớn hơn 5.000.000")
    .required("Vui lòng nhập thu nhập"),
});

export default function App() {
  const formik = useFormik({
    initialValues: {
      fullName: "",
      cccd: "",
      monthlyIncome: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <input
          name="fullName"
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Họ tên"
        />
        {formik.touched.fullName && formik.errors.fullName && (
          <div>{formik.errors.fullName}</div>
        )}
      </div>
      <div>
        <input
          name="cccd"
          value={formik.values.cccd}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Căn cước công dân"
        />
        {formik.touched.cccd && formik.errors.cccd && (
          <div>{formik.errors.cccd}</div>
        )}
      </div>
      <div>
        <input
          name="monthlyIncome"
          value={formik.values.monthlyIncome}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          placeholder="Thu nhập hàng tháng"
        />
        {formik.touched.monthlyIncome && formik.errors.monthlyIncome && (
          <div>{formik.errors.monthlyIncome}</div>
        )}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

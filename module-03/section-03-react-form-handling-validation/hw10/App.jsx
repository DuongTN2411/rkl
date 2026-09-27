import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object({
  courseCode: Yup.string()
    .matches(/^[A-Z]+$/, "Mã môn học phải là chữ in hoa")
    .required("Vui lòng nhập mã môn học"),
  studentCount: Yup.number()
    .typeError("Sĩ số phải là số")
    .min(1, "Sĩ số không hợp lệ")
    .required("Vui lòng nhập sĩ số"),
  scores: Yup.array().of(
    Yup.number()
      .typeError("Điểm phải là số")
      .min(0, "Điểm tối thiểu là 0.0")
      .max(10, "Điểm tối đa là 10.0")
      .required("Vui lòng nhập điểm")
  ),
});

export default function App() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: { courseCode: "", studentCount: 0, scores: [] },
  });

  const studentCount = useWatch({ control, name: "studentCount" });
  const count = parseInt(studentCount) || 0;

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register("courseCode")}
          placeholder="Mã môn học (chữ in hoa)"
        />
        {errors.courseCode && <div>{errors.courseCode.message}</div>}
      </div>
      <div>
        <input
          {...register("studentCount")}
          type="number"
          placeholder="Sĩ số"
        />
        {errors.studentCount && <div>{errors.studentCount.message}</div>}
      </div>
      {count > 0 &&
        Array.from({ length: count }).map((_, i) => (
          <div key={i}>
            <input
              {...register(`scores.${i}`)}
              type="number"
              step="0.1"
              placeholder={`Điểm sinh viên ${i + 1}`}
              disabled={count <= 0}
            />
            {errors.scores?.[i] && <div>{errors.scores[i].message}</div>}
          </div>
        ))}
      <button type="submit">Submit</button>
    </form>
  );
}

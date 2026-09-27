import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

const validationSchema = Yup.object({
  jobStatus: Yup.string().required("Vui lòng chọn trạng thái"),
  currentCompany: Yup.string().when("jobStatus", {
    is: "employed",
    then: (schema) => schema.required("Vui lòng nhập công ty hiện tại"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const jobStatus = watch("jobStatus");

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <select {...register("jobStatus")}>
          <option value="">-- Chọn trạng thái --</option>
          <option value="employed">Đã có việc</option>
          <option value="seeking">Đang tìm việc</option>
        </select>
        {errors.jobStatus && <div>{errors.jobStatus.message}</div>}
      </div>
      {jobStatus === "employed" && (
        <div>
          <input
            {...register("currentCompany")}
            placeholder="Công ty hiện tại"
          />
          {errors.currentCompany && <div>{errors.currentCompany.message}</div>}
        </div>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}

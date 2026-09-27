import { useForm } from "react-hook-form";

export default function App() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register("title", { required: "Vui lòng nhập tiêu đề" })}
          placeholder="Tiêu đề bài viết"
        />
        {errors.title && <div>{errors.title.message}</div>}
      </div>
      <div>
        <textarea
          {...register("content", {
            required: "Vui lòng nhập nội dung",
            minLength: {
              value: 50,
              message: "Nội dung quá ngắn (tối thiểu 50 ký tự)",
            },
          })}
          placeholder="Nội dung bài viết"
        />
        {errors.content && <div>{errors.content.message}</div>}
      </div>
      <button type="submit">Submit</button>
    </form>
  );
}

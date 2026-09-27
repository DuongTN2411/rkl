import { useState } from "react";
import { useFormik } from "formik";
import { useForm } from "react-hook-form";

function FormikForm() {
  console.log("Rendered FormikForm");
  const formik = useFormik({
    initialValues: { f1: "", f2: "", f3: "", f4: "", f5: "" },
    onSubmit: (values) => console.log(values),
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <h3>Formik Form</h3>
      {["f1", "f2", "f3", "f4", "f5"].map((name) => (
        <input
          key={name}
          name={name}
          value={formik.values[name]}
          onChange={formik.handleChange}
          placeholder={name}
        />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

function RHFForm() {
  console.log("Rendered RHFForm");
  const { register, handleSubmit } = useForm();

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3>React Hook Form</h3>
      {["f1", "f2", "f3", "f4", "f5"].map((name) => (
        <input key={name} {...register(name)} placeholder={name} />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}

export default function App() {
  return (
    <div>
      <FormikForm />
      <hr />
      <RHFForm />
    </div>
  );
}

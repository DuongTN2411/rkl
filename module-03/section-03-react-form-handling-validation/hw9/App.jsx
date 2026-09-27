import { useState } from "react";
import { useForm } from "react-hook-form";

export default function App() {
  const [items, setItems] = useState([{ id: Date.now() }]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  function addItem() {
    setItems([...items, { id: Date.now() }]);
  }

  function removeItem(id) {
    setItems(items.filter((item) => item.id !== id));
  }

  function onSubmit(data) {
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {items.map((item, index) => (
        <div key={item.id}>
          <input
            {...register(`items.${index}.name`, { required: true })}
            placeholder="Tên món đồ"
          />
          <input
            {...register(`items.${index}.price`, { required: true })}
            placeholder="Giá tiền"
            type="number"
          />
          <button type="button" onClick={() => removeItem(item.id)}>
            Xóa
          </button>
        </div>
      ))}
      <button type="button" onClick={addItem}>
        Thêm món đồ
      </button>
      <br />
      <button type="submit" disabled={items.length === 0}>
        Submit
      </button>
      {errors.items && <div>Vui lòng điền đầy đủ thông tin</div>}
    </form>
  );
}

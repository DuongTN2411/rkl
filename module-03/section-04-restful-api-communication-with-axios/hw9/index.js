import axios from "axios";

let controller = null;

async function searchProducts(keyword) {
  if (controller) {
    controller.abort();
  }
  controller = new AbortController();

  try {
    const res = await axios.get("http://localhost:3004/products", {
      params: { search: keyword },
      signal: controller.signal,
    });
    console.log(res.data);
  } catch (err) {
    if (axios.isCancel(err)) {
      console.log("Request đã bị hủy");
    } else {
      console.log(err.message);
    }
  }
}

searchProducts("Lap");
searchProducts("Laptop");

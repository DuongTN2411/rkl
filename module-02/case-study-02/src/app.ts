import "./styles.css";
import * as storage from "./storage";
import { initUi } from "./ui";

// Lần đầu mở app: tạo danh mục & giao dịch mẫu
storage.seedIfEmpty();

// Vẽ giao diện
initUi();
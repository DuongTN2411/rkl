# HRM Web App — Defense Case Study 3 (bản Vite, đơn giản)

Chỉ dùng kiến thức Module 1-2-3, không dùng thừa.

## 1. Chạy project (Vite)

```bash
cd defense-03-hrm
npm install   # chỉ cần chạy 1 lần đầu
npm run dev   # mở http://localhost:5173
```

Test + build:

```bash
npm test      # = node validation.test.js -> 10 passed, 0 failed
npm run build # build ra folder dist/
```

Tài khoản demo: `admin@hrm.vn` / `123456`

File `.jsx` chạy thế nào: bạn không chạy lẻ `src/App.jsx` bằng node.
Vite đọc `index.html` -> `src/main.jsx` -> `src/App.jsx`, tự dịch JSX rồi mở trên `http://localhost:5173`.

## 2. File có gì

- `index.html` — entry của Vite (thay cho bản CDN cũ)
- `src/main.jsx` — `ReactDOM.createRoot` render App
- `src/App.jsx` — toàn bộ app: component, props, useState, useEffect, controlled form, fetch GET/POST/PUT/DELETE (Module 3 Sec 01-04)
- `src/validation.js` — `validateLogin`, `validateEmployee`, `add/update/deleteEmployee` bằng if/else + regex + map/filter (Module 2), dùng `export/import` ES6
- `src/styles.css` — Flexbox + media query + table cuộn ngang (Module 1 Sec 04-05)
- `validation.test.js` — test bằng node thuần (thay cho Jest/Enzyme Sec 05)

## 3. Đối chiếu SRS

| SRS | Làm ở đâu |
|-----|-----------|
| F01 Login + validation + gọi API + Global State | `LoginForm` + `validateLogin`, state `user` ở App |
| F02 Read (Loading/Success/Error) | `loadEmployees()` + state `status` |
| F02 Create/Update + validation | `EmployeeForm` + `validateEmployee`, POST/PUT JSONPlaceholder |
| F02 Delete + confirm | `handleDelete()` + `window.confirm` + DELETE |
| F03 Header + Logout | `Header` nhận `props.user`, `handleLogout()` xóa state + localStorage |
| Testing | `npm test` (10 case) |
| Toast + Error handling | state `toast` + try/catch quanh fetch |
| Responsive | `.table-wrap { overflow-x: auto }` + media query 640px |

## 4. Vì sao KHÔNG dùng thừa

- Không Redux/Zustand: Global State = `useState user/token` ở App cha + props (Lifting State Up).
- Không Formik/Yup/router/axios/TanStack: controlled form + if/else, conditional rendering, fetch.
- API login dùng `GET /users?email=` minh họa integration (ReqRes giờ đòi API key nên bỏ).
- Test node thuần thay Jest/Enzyme.

## 5. Demo 2 phút

1. Nhập sai email -> lỗi validation. 2. Login demo -> Header hiện tên + toast.
3. Bảng load. 4. Thêm (sđt sai báo lỗi) -> Sửa -> Xóa (confirm).
5. Đăng xuất. 6. Thu nhỏ trình duyệt check responsive. 7. Chạy `npm test`.

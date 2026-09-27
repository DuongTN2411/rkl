import { get, post, put, remove } from "./apiClient.js";

get("/contacts").then((data) => console.log(data));
post("/contacts", { name: "Eve", phone: "0945678901" }).then((data) => console.log(data));
put("/contacts/1", { name: "Alice Updated", phone: "0901234567" }).then((data) => console.log(data));
remove("/contacts/2").then((data) => console.log(data));

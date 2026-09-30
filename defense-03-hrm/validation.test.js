/* test don gian thoi, em chay bang lenh npm test */
import {
  validateLogin,
  validateEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from "./src/validation.js"

let pass = 0
let fail = 0

function check(ten, dung) {
  if (dung) {
    pass++
    console.log("ok - " + ten)
  } else {
    fail++
    console.log("LOI - " + ten)
  }
}

// test login
let r1 = validateLogin({ email: "admin@hrm.vn", password: "123456" })
check("login dung thi ko bao loi", Object.keys(r1).length === 0)

let r2 = validateLogin({ email: "", password: "123456" })
check("thieu email thi bao loi", r2.email != undefined)

let r3 = validateLogin({ email: "abc", password: "123456" })
check("email sai thi bao loi", r3.email != undefined)

let r4 = validateLogin({ email: "a@b.vn", password: "" })
check("thieu mat khau thi bao loi", r4.password != undefined)

// test nhan vien
let r5 = validateEmployee({ name: "Nguyen A", email: "a@hrm.vn", phone: "0901234567" })
check("nhan vien dung thi ok", Object.keys(r5).length === 0)

let r6 = validateEmployee({ name: "A", email: "a@hrm.vn", phone: "0901234567" })
check("ten ngan thi bao loi", r6.name != undefined)

let r7 = validateEmployee({ name: "Nguyen A", email: "a@hrm.vn", phone: "12" })
check("sdt sai thi bao loi", r7.phone != undefined)

// test them sua xoa
let ds = [{ id: 1, name: "A" }, { id: 2, name: "B" }]

let dsThem = addEmployee(ds, { id: 3, name: "C" })
check("them 1 nguoi", dsThem.length == 3)

let dsSua = updateEmployee(ds, 1, { name: "A2" })
check("sua dung nguoi", dsSua[0].name == "A2")

let dsXoa = deleteEmployee(ds, 1)
check("xoa dung nguoi", dsXoa.length == 1)

console.log("\nXong: " + pass + " dung, " + fail + " sai")
if (fail > 0) process.exit(1)

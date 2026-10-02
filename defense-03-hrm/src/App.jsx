import { useState, useEffect } from "react"
import { validateLogin, validateEmployee, addEmployee, updateEmployee, deleteEmployee } from "./validation.js"
import "./styles.css"

let accDemo = { email: "admin@hrm.vn", password: "123456", name: "Admin HR" }

let dataMau = [
  { id: 1, name: "Nguyen Van An", email: "an@hrm.vn", phone: "0901234567" },
  { id: 2, name: "Tran Thi Bich", email: "bich@hrm.vn", phone: "0912345678" },
  { id: 3, name: "Le Van Cuong", email: "cuong@hrm.vn", phone: "0923456789" }
]

function Header(props) {
  return (
    <header className="header">
      <h1>HRM Web App</h1>
      {props.user ? (
        <div className="user-box">
          <span>Xin chao, {props.user.name}</span>
          <button className="btn-secondary btn-small" onClick={props.onLogout}>Dang xuat</button>
        </div>
      ) : (
        <span>Chua dang nhap</span>
      )}
    </header>
  )
}

function LoginForm(props) {
  const [email, setEmail] = useState("")
  const [matkhau, setMatkhau] = useState("")
  const [loi, setLoi] = useState({})
  const [dangLoad, setDangLoad] = useState(false)

  async function gui(e) {
    e.preventDefault()
    let l = validateLogin({ email: email, password: matkhau })
    setLoi(l)
    if (Object.keys(l).length > 0) return

    setDangLoad(true)
    try {
      let res = await fetch("https://jsonplaceholder.typicode.com/users?email=" + email)
      await res.json()

      if (email == accDemo.email && matkhau == accDemo.password) {
        props.onLogin({ name: accDemo.name, email: email }, "token-" + Date.now())
      } else {
        props.onNotify("Sai roi, dung thu admin@hrm.vn / 123456")
      }
    } catch (err) {
      if (email == accDemo.email && matkhau == accDemo.password) {
        props.onLogin({ name: accDemo.name, email: email }, "token-offline")
      } else {
        props.onNotify("Loi mang roi, thu lai sau")
      }
    }
    setDangLoad(false)
  }

  return (
    <div className="card">
      <h2>Dang nhap</h2>
      <form onSubmit={gui}>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@hrm.vn" />
        {loi.email && <div className="error">{loi.email}</div>}

        <label>Mat khau</label>
        <input type="password" value={matkhau} onChange={(e) => setMatkhau(e.target.value)} placeholder="123456" />
        {loi.password && <div className="error">{loi.password}</div>}

        <button className="btn-primary" type="submit" disabled={dangLoad}>
          {dangLoad ? "Dang dang nhap..." : "Dang nhap"}
        </button>
      </form>
      <div className="hint">Demo: admin@hrm.vn / 123456</div>
    </div>
  )
}

function EmployeeForm(props) {
  const [ten, setTen] = useState(props.initial ? props.initial.name : "")
  const [mail, setMail] = useState(props.initial ? props.initial.email : "")
  const [sdt, setSdt] = useState(props.initial ? props.initial.phone : "")
  const [loi, setLoi] = useState({})

  function gui(e) {
    e.preventDefault()
    let l = validateEmployee({ name: ten, email: mail, phone: sdt })
    setLoi(l)
    if (Object.keys(l).length > 0) return
    props.onSubmit({ name: ten.trim(), email: mail.trim(), phone: sdt.trim() })
  }

  return (
    <div className="card">
      <h2>{props.initial ? "Sua nhan vien" : "Them nhan vien"}</h2>
      <form onSubmit={gui}>
        <label>Ho ten</label>
        <input value={ten} onChange={(e) => setTen(e.target.value)} placeholder="Nguyen Van A" />
        {loi.name && <div className="error">{loi.name}</div>}

        <div className="form-row">
          <div>
            <label>Email</label>
            <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder="a@hrm.vn" />
            {loi.email && <div className="error">{loi.email}</div>}
          </div>
          <div>
            <label>So dien thoai</label>
            <input value={sdt} onChange={(e) => setSdt(e.target.value)} placeholder="0901234567" />
            {loi.phone && <div className="error">{loi.phone}</div>}
          </div>
        </div>

        <div className="actions" style={{ marginTop: "14px" }}>
          <button className="btn-primary" style={{ marginTop: 0 }} type="submit">Luu</button>
          <button className="btn-secondary" type="button" onClick={props.onCancel}>Huy</button>
        </div>
      </form>
    </div>
  )
}

function App() {
  const [user, setUser] = useState(null)
  const [ds, setDs] = useState([])
  const [trangthai, setTrangthai] = useState("idle")
  const [hienForm, setHienForm] = useState(false)
  const [dangSua, setDangSua] = useState(null)
  const [toast, setToast] = useState("")

  function bao(msg) {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  useEffect(() => {
    let luu = localStorage.getItem("hrm-user")
    if (luu) {
      try {
        setUser(JSON.parse(luu))
      } catch (e) {}
    }
  }, [])

  function khiLogin(info, token) {
    setUser(info)
    localStorage.setItem("hrm-user", JSON.stringify(info))
    localStorage.setItem("hrm-token", token)
    bao("Dang nhap ok!")
  }

  function khiLogout() {
    setUser(null)
    localStorage.removeItem("hrm-user")
    localStorage.removeItem("hrm-token")
    setDs([])
    setTrangthai("idle")
    bao("Da dang xuat")
  }

  async function taiDs() {
    setTrangthai("loading")
    try {
      let res = await fetch("https://jsonplaceholder.typicode.com/users")
      let data = await res.json()
      let gon = data.slice(0, 8).map(function(u) {
        return { id: u.id, name: u.name, email: u.email, phone: u.phone }
      })
      setDs(gon)
      setTrangthai("idle")
    } catch (err) {
      setDs(dataMau)
      setTrangthai("error")
    }
  }

  useEffect(() => {
    if (user) taiDs()
  }, [user])

  async function khiLuu(data) {
    let idMoi = 1
    for (let nv of ds) {
      if (nv.id >= idMoi) idMoi = nv.id + 1
    }

    try {
      if (dangSua) {
        await fetch("https://jsonplaceholder.typicode.com/users/" + dangSua.id, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        setDs(updateEmployee(ds, dangSua.id, data))
        bao("Sua xong!")
      } else {
        let res = await fetch("https://jsonplaceholder.typicode.com/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        })
        await res.json()
        let moi = { id: idMoi, ...data }
        setDs(addEmployee(ds, moi))
        bao("Them xong!")
      }
    } catch (err) {
      if (dangSua) {
        setDs(updateEmployee(ds, dangSua.id, data))
      } else {
        setDs(addEmployee(ds, { id: idMoi, ...data }))
      }
      bao("Da luu (offline)")
    }
    setHienForm(false)
    setDangSua(null)
  }

  async function khiXoa(id) {
    let ok = window.confirm("Xoa nguoi nay that ko?")
    if (!ok) return
    try {
      await fetch("https://jsonplaceholder.typicode.com/users/" + id, { method: "DELETE" })
    } catch (err) {}
    setDs(deleteEmployee(ds, id))
    bao("Da xoa")
  }

  return (
    <div>
      <Header user={user} onLogout={khiLogout} />
      <main className="container">
        {!user ? (
          <LoginForm onLogin={khiLogin} onNotify={bao} />
        ) : (
          <div>
            {trangthai == "loading" && <div className="status">Dang tai...</div>}
            {trangthai == "error" && <div className="status error">Ko goi dc api, dung data mau.</div>}

            {!hienForm ? (
              <div className="card">
                <div className="actions" style={{ justifyContent: "space-between", marginBottom: "12px" }}>
                  <h2>Danh sach ({ds.length})</h2>
                  <button className="btn-primary" style={{ marginTop: 0 }} onClick={() => { setDangSua(null); setHienForm(true) }}>
                    + Them
                  </button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>ID</th><th>Ho ten</th><th>Email</th><th>SDT</th><th></th></tr>
                    </thead>
                    <tbody>
                      {ds.map(function(nv) {
                        return (
                          <tr key={nv.id}>
                            <td>{nv.id}</td>
                            <td>{nv.name}</td>
                            <td>{nv.email}</td>
                            <td>{nv.phone}</td>
                            <td>
                              <div className="actions">
                                <button className="btn-secondary btn-small" onClick={() => { setDangSua(nv); setHienForm(true) }}>Sua</button>
                                <button className="btn-danger btn-small" onClick={() => khiXoa(nv.id)}>Xoa</button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <EmployeeForm
                initial={dangSua}
                onSubmit={khiLuu}
                onCancel={() => { setHienForm(false); setDangSua(null) }}
              />
            )}
          </div>
        )}
      </main>
      {toast != "" && <div className="toast">{toast}</div>}
    </div>
  )
}

export default App

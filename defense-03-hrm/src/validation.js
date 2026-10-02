export function isValidEmail(email) {
  if (!email) return false
  let re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validateLogin(data) {
  let errors = {}

  if (!data.email) {
    errors.email = "Vui long nhap email"
  } else if (!isValidEmail(data.email)) {
    errors.email = "Email sai dinh dang roi"
  }

  if (!data.password) {
    errors.password = "Vui long nhap mat khau"
  } else if (data.password.length < 6) {
    errors.password = "Mat khau phai tu 6 ky tu tro len"
  }

  return errors
}

export function validateEmployee(data) {
  let errors = {}

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Ten phai tu 2 ky tu"
  }

  if (!data.email) {
    errors.email = "Chua nhap email"
  } else if (isValidEmail(data.email) == false) {
    errors.email = "Email sai dinh dang"
  }

  if (!data.phone) {
    errors.phone = "Chua nhap sdt"
  } else {
    let so = data.phone.replace(/\D/g, "")
    if (so.length < 9 || so.length > 11) {
      errors.phone = "SDT phai 9-11 so"
    }
  }

  return errors
}

export function addEmployee(list, item) {
  let moi = list.concat([item])
  return moi
}

export function updateEmployee(list, id, data) {
  return list.map(function(emp) {
    if (emp.id == id) {
      return { ...emp, ...data }
    }
    return emp
  })
}

export function deleteEmployee(list, id) {
  let conLai = list.filter(function(emp) {
    return emp.id != id
  })
  return conLai
}

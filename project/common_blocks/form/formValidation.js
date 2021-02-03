function testField(regExp, field) {
  const expression = regExp
  const checkResult = expression.test(field.value)

  if (!checkResult) {
    field.style.outline = "1px solid red"
    field.insertAdjacentHTML('beforebegin', '<p class="form__warning">Проверьте правильность заполнения формы</p>')
  }
  else {
    field.style.outline = "transparent"
    if (field.previousSibling.className == "form__warning") {
      field.previousSibling.remove()
    }
  }
}

const nameField = document.querySelector(".name-field")
nameField.addEventListener("focusout", function (e) {
  testField(/^[A-Za-zА-я]+$/gim, this)
})

const surnameField = document.querySelector(".surname-field")
surnameField.addEventListener("focusout", function (e) {
  testField(/^[A-Za-zА-я]+$/gim, this)
})

const phoneField = document.querySelector(".phone-field")
phoneField.addEventListener("focusout", function (e) {
  testField(/\+7\(\d{3}\)\d{3}\-\d{4}/gim, this)
})

const emailField = document.querySelector(".email-field")
emailField.addEventListener("focusout", function (e) {
  testField(/^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/gim, this)
})
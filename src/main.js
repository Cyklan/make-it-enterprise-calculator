import './style.css'

const form = document.querySelector('#calculator')
const first = document.querySelector('#first-number')
const second = document.querySelector('#second-number')
const result = document.querySelector('#result')

const sanitizeInput = (event) => {
  const input = event.currentTarget
  const value = input.value.replace(/[^\d.,]/g, '')
  const decimalSeparator = value.match(/[.,]/)?.[0]

  input.value = decimalSeparator
    ? value.replace(/[.,]/g, (separator, index) =>
        separator === decimalSeparator && index === value.indexOf(decimalSeparator)
          ? separator
          : '',
      )
    : value

  input.setCustomValidity(
    input.value && !/^\d+(?:[.,]\d+)?$/.test(input.value)
      ? 'Enter a valid decimal number.'
      : '',
  )
}

first.addEventListener('input', sanitizeInput)
second.addEventListener('input', sanitizeInput)

form.addEventListener('submit', (event) => {
  event.preventDefault()

  if (!form.checkValidity()) {
    form.reportValidity()
    return
  }

  result.textContent = [first, second]
    .map((input) => Number(input.value.replace(',', '.')))
    .reduce((sum, value) => sum + value, 0)
})

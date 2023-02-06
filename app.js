const $keys = document.querySelector(".calculator-keys");
const $display = document.querySelector(".display");

const calculator = {
  displayValue: "0",
  numbers: [],
  newNumber: true,
  operator: "",
  error: false,
  opLast: false,
};

$keys.addEventListener("click", (e) => {
  const key = e.target;
  if (!key.matches("button")) {
    return;
  }
  const value = key.value;
  if (parseInt(value) >= 0) {
    return addNumberToDisplay(value);
  }
  switch (value) {
    case ".":
      addDecimalToDisplay(value);
      break;
    case "=":
      totalSum();
      break;
    case "all-clear":
      clearAll();
      break;
    case "delete":
      removeNumberFromDisplay();
      break;
    default:
      addOperator(value);
  }
});

document.addEventListener("keydown", (e) => {
  const code = e.code;
  const operators = ["+", "-", "/", "*"];
  if (operators.includes(e.key)) {
    addOperator(e.key);
    return;
  }
  if (code.includes("Digit")) {
    addNumberToDisplay(e.key);
  }
  if (code === "Equal" || code === "Enter") {
    totalSum();
  }
  if (code === "Backspace") {
    removeNumberFromDisplay();
  }
});

const removeNumberFromDisplay = () => {
  if (calculator.error) {
    clearAll();
    return;
  }
  if (calculator.newNumber) {
    return;
  }
  const end = calculator.displayValue.length - 1;
  const start = end - 1;
  if (end === 0) {
    calculator.displayValue = "0";
    calculator.newNumber = true;
    updateDisplay();
  }
  if (end > 0) {
    const newDisplayValue = calculator.displayValue.slice(0, end);
    calculator.displayValue = newDisplayValue;
    updateDisplay();
  }
};

const addNumberToDisplay = (value) => {
  calculator.error = false;
  calculator.opLast = false;
  if (calculator.newNumber) {
    calculator.displayValue = value;
    calculator.newNumber = false;
  } else {
    calculator.displayValue += value;
  }
  updateDisplay();
};

const addDecimalToDisplay = (value) => {
  if (calculator.displayValue.includes(".")) {
    return;
  }
  if (calculator.newNumber) {
    value = `0${value}`;
  }
  addNumberToDisplay(value);
};

const clearAll = () => {
  calculator.displayValue = "0";
  calculator.numbers = [];
  calculator.newNumber = true;
  calculator.error = false;
  calculator.opLast = false;
  updateDisplay();
};

const performSum = () => {
  const { numbers, operator } = calculator;
  const a = parseFloat(numbers[0]);
  const b = parseFloat(numbers[1]);
  const sum = operate(operator, a, b);
  const error = sum === "error";
  calculator.error = error;
  calculator.displayValue = sum;
  if (error) {
    calculator.newNumber = true;
    calculator.numbers = [];
  } else {
    calculator.numbers = [sum];
  }
  updateDisplay();
};

const updateDisplay = () => {
  $display.value = calculator.displayValue;
};
updateDisplay();

const addOperator = (operator) => {
  if (calculator.error) {
    return;
  }
  if (calculator.opLast) {
    calculator.operator = operator;
    return;
  }
  calculator.numbers.push(calculator.displayValue);
  if (calculator.numbers.length === 2 && calculator.operator.length === 1) {
    performSum();
  }
  calculator.operator = operator;
  calculator.newNumber = true;
  calculator.opLast = true;
};

const totalSum = () => {
  if (calculator.numbers.length !== 0) {
    calculator.numbers.push(calculator.displayValue);
    performSum();
    calculator.newNumber = true;
    calculator.numbers.pop();
  }
};

const add = (a, b) => {
  return a + b;
};

const subtract = (a, b) => {
  return a - b;
};

const multiply = (a, b) => {
  return a * b;
};

const divide = (a, b) => {
  if (b === 0) {
    return "error";
  } else {
    return a / b;
  }
};

const operate = (operator, a, b) => {
  let answer;
  switch (operator) {
    case "+":
      answer = add(a, b);
      break;
    case "-":
      answer = subtract(a, b);
      break;
    case "*":
      answer = multiply(a, b);
      break;
    default:
      answer = divide(a, b);
      break;
  }
  return `${answer}`;
};

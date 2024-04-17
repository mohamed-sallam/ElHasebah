document
  .querySelectorAll(".keypad-key[data-value]")
  .forEach((btn) =>
    btn.addEventListener("click", () =>
      addDigit(btn.getAttribute("data-value"), btn.innerText)
    )
  );
document
  .querySelectorAll(".op-key[data-op]")
  .forEach((btn) =>
    btn.addEventListener("click", () =>
      addOperator(btn.getAttribute("data-op"), btn.innerText)
    )
  );

document.querySelector("#clear").addEventListener("click", clear);
document.querySelector("#backspace").addEventListener("click", backspace);
document.querySelector("#equals").addEventListener("click", equals);
document.querySelector("#dash").addEventListener("click", dash);

document.addEventListener("keydown", (event) => {
  if (event.key === "/") event.preventDefault();

  const btn = getKeyButton(event.key);
  if (!btn) return;

  btn.click();
  btn.classList.add("active");
});
document.addEventListener("keyup", (event) =>
  getKeyButton(event.key)?.classList.remove("active")
);

const getKeyButton = (key) =>
  document.querySelector(
    ["+", "*", "/", "^"].includes(key)
      ? `.op-key[data-op="${key}"]`
      : ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."].includes(key)
      ? `.num-key[data-value="${key}"]`
      : ["=", "Enter", " "].includes(key)
      ? "#equals"
      : ["Delete", "Escape"].includes(key)
      ? "#clear"
      : key === "Backspace"
      ? "#backspace"
      : key === "-"
      ? "#dash"
      : null
  );

let currentOperand = 0;
let operands = ["", ""];
let operator = "";
let isResult = false;

const perviousOperandScreen = document.querySelector("#pervious-operand");
const currentOperandScreen = document.querySelector("#current-operand");

function addDigit(value, digit) {
  if (isCurrentOperandOverflow()) return;

  if (isResult) {
    operands = ["", ""];
    currentOperandScreen.innerText = "";
    perviousOperandScreen.innerText = "";
    isResult = false;
  }
  currentOperandScreen.innerText += digit;
  perviousOperandScreen.innerText += digit;
  operands[currentOperand] += value;
}

function addOperator(op, symbol) {
  if (operands[0] === "") return;

  if (currentOperand === 0)
    perviousOperandScreen.innerText = currentOperandScreen.innerText;
  else equals();

  if (operands[0] === "") return;

  isResult = false;
  perviousOperandScreen.innerText += symbol;
  operator = op;
  currentOperand = 1;
  currentOperandScreen.innerText = "";
}

function equals() {
  const result =
    operator === "+"
      ? +operands[0] + +operands[1]
      : operator === "-"
      ? +operands[0] - +operands[1]
      : operator === "*"
      ? +operands[0] * +operands[1]
      : operator === "/"
      ? +operands[0] / +operands[1]
      : operator === "^"
      ? Math.pow(+operands[0], +operands[1])
      : +operands[0];

  operands = ["", ""];
  operator = "";
  currentOperand = 0;
  isResult = true;
  if (!Number.isFinite(result)) {
    currentOperandScreen.innerText = "خطأ حسابي";
    perviousOperandScreen.innerText = "";
    return;
  }
  let arResult = result.toLocaleString("ar-EG").replaceAll("٬", "");
  currentOperandScreen.innerText = arResult;
  perviousOperandScreen.innerText = arResult;
  operands[0] = result.toString();

  if (isPerviousOperandOverflow() || isCurrentOperandOverflow()) {
    clear();
    currentOperandScreen.innerText = "الرقم طويل";
    isResult = true;
    return;
  }
}

function clear() {
  operands = ["", ""];
  operator = "";
  currentOperand = 0;
  isResult = false;
  currentOperandScreen.innerText = "";
  perviousOperandScreen.innerText = "";
}

function dash() {
  if (operands[0] === "" || (operator !== "" && operands[1] === ""))
    addDigit("-", "-"); // negative
  else addOperator("-", "-"); // subtraction
}

function backspace() {
  currentOperandScreen.innerText = currentOperandScreen.innerText.slice(0, -1);
  perviousOperandScreen.innerText = perviousOperandScreen.innerText.slice(
    0,
    -1
  );

  if (operands[currentOperand].length > 0)
    operands[currentOperand] = operands[currentOperand].slice(0, -1);
  else if (currentOperand === 1 && operands[1] === "") {
    operator = "";
    currentOperand = 0;
    currentOperandScreen.innerText = perviousOperandScreen.innerText;
  }
}

// Source: https://stackoverflow.com/a/62272697/6646715
const isCurrentOperandOverflow = () =>
  currentOperandScreen.getBoundingClientRect().width >
  currentOperandScreen.parentElement.getBoundingClientRect().width;

const isPerviousOperandOverflow = () =>
  perviousOperandScreen.getBoundingClientRect().width >
  perviousOperandScreen.parentElement.getBoundingClientRect().width;

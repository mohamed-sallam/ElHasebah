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

document.querySelector("#minus").addEventListener("click", minus);

document.addEventListener("keydown", (event) => {
  if (event.key === "/") event.preventDefault();

  getKeyButton(event.key)?.classList.add("active");
});

document.addEventListener("keyup", (event) => {
  const btn = getKeyButton(event.key);

  if (!btn) return;

  btn.click();
  btn.classList.remove("active");
});

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
      ? "#minus"
      : null
  );

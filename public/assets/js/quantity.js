/*====================
 Plus Minus Quantity Item js
=======================*/
const farebox = document.querySelectorAll(".fare-box");

for (var i = 0; i < farebox.length; ++i) {
  const addButton = farebox[i].querySelector(".add");
  const subButton = farebox[i].querySelector(".sub");
  addButton?.addEventListener("click", function () {
    const inputEl = this.parentNode.querySelector("input[type='number']");
    if (inputEl.value < 1000) {
      inputEl.value = Number(inputEl.value) + 10;
    }
  });
  subButton?.addEventListener("click", function () {
    const inputEl = this.parentNode.querySelector("input[type='number']");
    if (inputEl.value > 1) {
      inputEl.value = Number(inputEl.value) - 10;
    }
  });
}

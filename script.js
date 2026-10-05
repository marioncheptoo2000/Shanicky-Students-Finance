// Change this to your own currency if you like
const currency = "KES";

// Get the parts of the page we need to control
const incomeInput = document.getElementById("income");
const savingsInput = document.getElementById("savings");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const noteInput = document.getElementById("note");
const addButton = document.getElementById("add-btn");
const expenseList = document.getElementById("expense-list");
const dailyLimit = document.getElementById("daily-limit");
const summaryText = document.getElementById("summary-text");

// Load saved data, or start with empty data
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
incomeInput.value = localStorage.getItem("income") || "";
savingsInput.value = localStorage.getItem("savings") || 10;

// Turn a number into text like "KES 1,500"
function money(number) {
  return currency + " " + Math.round(number).toLocaleString();
}

// Save everything in the browser
function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
  localStorage.setItem("income", incomeInput.value);
  localStorage.setItem("savings", savingsInput.value);
}

// Work out the numbers and update the page
function update() {
  const income = Number(incomeInput.value) || 0;
  const savingsPercent = Number(savingsInput.value) || 0;

  // Days left in this month, including today
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - today.getDate() + 1;

  // Add up all expenses
  let totalSpent = 0;
  for (const expense of expenses) {
    totalSpent = totalSpent + expense.amount;
  }

  const savingsAmount = income * savingsPercent / 100;
  const moneyLeft = income - savingsAmount - totalSpent;
  const perDay = moneyLeft / daysLeft;

  // Show the result in the blue box
  if (income === 0) {
    dailyLimit.textContent = money(0);
    summaryText.textContent = "Enter your income to start.";
  } else if (moneyLeft < 0) {
    dailyLimit.textContent = money(0);
    summaryText.textContent = "You are over budget by " + money(-moneyLeft) + ". Cut back on spending.";
  } else {
    dailyLimit.textContent = money(perDay);
    summaryText.textContent = money(moneyLeft) + " left for " + daysLeft + " days, after saving " + money(savingsAmount) + ".";
  }

  // Show the list of expenses
  if (expenses.length === 0) {
    expenseList.innerHTML = "<li>No expenses yet.</li>";
  } else {
    expenseList.innerHTML = "";
    expenses.forEach(function (expense, index) {
      const li = document.createElement("li");
      const name = expense.note || expense.category;
      li.textContent = name + " (" + expense.category + "): " + money(expense.amount) + " ";

      // A small delete button for each expense
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.style.width = "auto";
      deleteButton.style.padding = "4px 10px";
      deleteButton.style.marginTop = "0";
      deleteButton.onclick = function () {
        expenses.splice(index, 1);
        saveData();
        update();
      };

      li.appendChild(deleteButton);
      expenseList.appendChild(li);
    });
  }
}

// When the "Add expense" button is clicked
addButton.onclick = function () {
  const amount = Number(amountInput.value);

  if (amount <= 0) {
    alert("Please enter an amount greater than 0.");
    return;
  }

  expenses.push({
    amount: amount,
    category: categoryInput.value,
    note: noteInput.value.trim()
  });

  amountInput.value = "";
  noteInput.value = "";
  saveData();
  update();
};

// Update whenever income or savings changes
incomeInput.oninput = function () {
  saveData();
  update();
};
savingsInput.oninput = function () {
  saveData();
  update();
};

// Show everything when the page first loads
update();
// Core Calculator Feature

const expressionEl = document.getElementById('expression');
const resultEl = document.getElementById('result');
const buttons = document.querySelectorAll('.btn');

let currentInput = '0';
let expression = '';
let lastResult = null;

function updateDisplay() {
  expressionEl.textContent = expression;
  resultEl.textContent = currentInput;
}

function appendNumber(num) {
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else if (num === '.' && currentInput.includes('.')) {
    return; // prevent multiple decimals
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function chooseOperator(operator) {
  const symbols = {
    add: '+',
    subtract: '-',
    multiply: '×',
    divide: '÷'
  };

  expression += currentInput + ' ' + symbols[operator] + ' ';
  currentInput = '0';
  updateDisplay();
}

function clearAll() {
  currentInput = '0';
  expression = '';
  lastResult = null;
  updateDisplay();
}

function deleteLast() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  updateDisplay();
}

function applyPercent() {
  currentInput = (parseFloat(currentInput) / 100).toString();
  updateDisplay();
}

function calculate() {
  const fullExpression = expression + currentInput;

  // Convert display symbols back to real operators for evaluation
  const safeExpression = fullExpression
    .replace(/×/g, '*')
    .replace(/÷/g, '/');

  try {
    // Guard against invalid characters before evaluating
    if (!/^[0-9+\-*/.\s]+$/.test(safeExpression)) {
      throw new Error('Invalid expression');
    }

    const evaluated = Function('"use strict"; return (' + safeExpression + ')')();

    if (evaluated === Infinity || evaluated === -Infinity || Number.isNaN(evaluated)) {
      resultEl.textContent = 'Error';
      currentInput = '0';
      expression = '';
      return;
    }

    lastResult = evaluated;
    expression = fullExpression + ' =';
    currentInput = evaluated.toString();
    updateDisplay();
  } catch (e) {
    resultEl.textContent = 'Error';
    currentInput = '0';
    expression = '';
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const number = button.getAttribute('data-number');
    const action = button.getAttribute('data-action');

    if (number !== null) {
      appendNumber(number);
      return;
    }

    switch (action) {
      case 'clear':
        clearAll();
        break;
      case 'delete':
        deleteLast();
        break;
      case 'percent':
        applyPercent();
        break;
      case 'add':
      case 'subtract':
      case 'multiply':
      case 'divide':
        chooseOperator(action);
        break;
      case 'calculate':
        calculate();
        break;
    }
  });
});

// Optional: keyboard support
window.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendNumber('.');
  if (e.key === '+') chooseOperator('add');
  if (e.key === '-') chooseOperator('subtract');
  if (e.key === '*') chooseOperator('multiply');
  if (e.key === '/') chooseOperator('divide');
  if (e.key === 'Enter' || e.key === '=') calculate();
  if (e.key === 'Backspace') deleteLast();
  if (e.key === 'Escape') clearAll();
});

updateDisplay();

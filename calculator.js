let display = document.getElementById('display');
let preview = document.getElementById('preview');
let historyList = document.getElementById('historyList');
let mainContainer = document.getElementById('mainContainer');
let mainBox = document.getElementById('mainBox');
let calculator = document.getElementById('calculator');
let toggleBtn = document.getElementById('toggleBtn');
let sizeButtons = document.querySelectorAll('.size-btn');
let toolbar = document.getElementById('toolbar');
let toolbarToggle = document.getElementById('toolbarToggle');
let togglehistory = document.getElementById('togglehistory');
let history = document.getElementById('history');
let mtrigonometri = document.getElementById('trigonometri');
let exitToolbar = document.getElementById('exitToolbar');
// let exittool = document.getElementById('exittoolbar');

// Load preferences from localStorage
let isDarkMode = localStorage.getItem('darkMode') === 'true';
let currentScale = parseFloat(localStorage.getItem('calculatorScale')) || 1;

// Apply initial settings
if (isDarkMode) {
    document.body.classList.add('dark');
    toggleBtn.textContent = 'Light Mode';
} else {
    toggleBtn.textContent = 'Dark Mode';
}
mainBox.style.transform = `scale(${currentScale})`;

// Toggle dark/light mode
toggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark');
    toggleBtn.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('darkMode', isDarkMode);
});

// Highlight tombol aktif berdasarkan scale
sizeButtons.forEach(btn => {
    if (parseFloat(btn.dataset.scale) === currentScale) {
        btn.classList.add('active');
    }
});

// Adjust size with buttons
sizeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        currentScale = parseFloat(e.target.dataset.scale);
        mainBox.style.transform = `scale(${currentScale})`;
        // Remove active dari semua, add ke yang diklik
        sizeButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        localStorage.setItem('calculatorScale', currentScale);
    }); 
});

// Toggle toolbar
toolbarToggle.addEventListener('click', () => {
    toolbar.classList.toggle('open');

     // Putar ikon
    const icon = toolbarToggle.querySelector('i');
    icon.classList.remove('spin'); 
    void icon.offsetWidth;         
    icon.classList.add('spin');

});
exitToolbar.addEventListener('click', () => {
    toolbar.classList.remove('open');
});


// toggle menu trigonometri
menutrigonometri.addEventListener('click', () => {
    trigonometri.classList.toggle('opentrigonometri');
    calculator.classList.toggle('opentrigonometri');
});

// toggle history
togglehistory.addEventListener('click', () => {
    history.classList.toggle('openhistory');
    calculator.classList.toggle('openhistory');
    innercalculator.classList.toggle('openhistory');
})

// Function to refresh history
function refreshHistory() {
    historyList.innerHTML = '';
}


// display number
function clearDisplay() {
    display.textContent = '0';
    preview.textContent = '';
}

// keyboard function
document.addEventListener('keydown', (e) => {
    const key = e.key;

    // Angka
    if (!isNaN(key)) {
        append(key);
        return;
    }

    // Operator dasar
    if (['+', '-', '*', '/', '%'].includes(key)) {
        append(key);
        return;
    }

    // Titik desimal
    if (key === '.') {
        append('.');
        return;
    }

    // Enter = Hitung
    if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
        return;
    }

    // Backspace
    if (key === 'Backspace') {
        backspace();
        return;
    }

    // Escape = Clear
    if (key === 'Escape') {
        clearDisplay();
        return;
    }

    // Kurung
    if (key === '(' || key === ')') {
        append(key);
        return;
    }
});


// limit number in display
const MAX_DISPLAY_LENGTH = 20;

// function to math symbol
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function formatResult(num, maxDecimals = 8) {
    if (!Number.isFinite(num)) return 'tak terdefinisi';

    return num
        .toFixed(maxDecimals)      
        .replace(/\.?0+$/, '');
}
function toJSExpression(expr) {
    return expr
        .replace(/π/g, 'Math.PI')
        .replace(/√\((.*?)\)/g, 'Math.sqrt($1)')
        .replace(/sin\((.*?)\)/g, 'Math.sin(degToRad($1))')
        .replace(/cos\((.*?)\)/g, 'Math.cos(degToRad($1))')
        .replace(/tan\((.*?)\)/g, 'Math.tan(degToRad($1))')
        .replace(/%/g, '/100')
        .replace(/\^/g, '**')
        .replace(/x/g, '*')
        .replace(/÷/g, '/');
}

function isBalanced(expr) {
    let count = 0;
    for (let c of expr) {
        if (c === '(') count++;
        if (c === ')') count--;
        if (count < 0) return false;
    }
    return count === 0;
}
function toDisplaySymbol(value) {
    return value
        .replace(/\*/g, 'x')
        .replace(/\//g, ':');
}

function toLogicSymbol(value) {
    return value
        .replace(/x/g, '*')
        .replace(/:/g, '/');
}

// Function to backspace
function backspace() {
    if (display.textContent.length > 1) {
        display.textContent = display.textContent.slice(0, -1);
    } else {
        display.textContent = '0';
    }
    updatePreview();
}

// Function to update preview
function updatePreview() {
    try {
        if (!isBalanced(display.textContent)) {
            preview.textContent = '';
            return;
        }
        let jsExpr = toJSExpression(
            toLogicSymbol(display.textContent)
        );

        let result = eval(jsExpr);
        preview.textContent = '= ' + formatResult(result);
    } catch {
        preview.textContent = '';
    }
}

function isOperator(char) {
    return ['+', '-', 'x', ':', '%'].includes(char);
}

// append to update preview
function append(value) {
    value = toDisplaySymbol(value);

    const current = display.textContent;
    const lastChar = current.slice(-1);
    const isOp = isOperator(value);

    if (current === '0' && isOp && value !== '-') return;

    if (isOp && isOperator(lastChar)) return;

    if (value === '.') {
        const parts = current.split(/[\+\-x:%]/);
        if (parts[parts.length - 1].includes('.')) return;
    }

    // Replace 0 awal
    if (current === '0' && !isOp && value !== '.') {
        display.textContent = value;
    } else {
        display.textContent += value;
    }

    updatePreview();
}


// Existing calculate function
function calculate() {
    try {
        let logicExpr 
        
        = toLogicSymbol(display.textContent);
            let jsExpr = toJSExpression(logicExpr);
        let result = eval(jsExpr);

        let formatted = formatResult(result);

        let calculation = display.textContent + ' = ' + formatted;

        display.textContent = formatted;
        preview.textContent = '';

        let li = document.createElement('li');
        li.textContent = calculation;
        historyList.appendChild(li);
    } catch {
        display.textContent = 'error';
        preview.textContent = '';
    }
}
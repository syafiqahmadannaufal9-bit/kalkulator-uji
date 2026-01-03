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
let exittool = document.getElementById('exittoolbar');

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

// exit toolbar
let exitToolbar = document.getElementById('exitToolbar');

exitToolbar.addEventListener('click', () => {
    toolbar.classList.remove('open');
});

togglehistory.addEventListener('click', () => {
    history.classList.toggle('openhistory');
    calculator.classList.toggle('openhistory');
    innercalculator.classList.toggle('openhistory');
})
menutrigonometri.addEventListener('click', () => {
    trigonometri.classList.toggle('opentrigonometri');
    calculator.classList.toggle('opentrigonometri');
});


// Function to refresh history
function refreshHistory() {
    historyList.innerHTML = '';
}


// Modified clearDisplay: Tidak clear history
function clearDisplay() {
    display.textContent = '0';
    preview.textContent = '';
}

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
const MAX_DISPLAY_LENGTH = 10;

// function to math simbol
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function formatResult(num, maxDecimals = 8) {
    if (!Number.isFinite(num)) return 'Error';

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
        .replace(/\*/g, 'X')
        .replace(/\//g, ':');
}

function toLogicSymbol(value) {
    return value
        .replace(/X/g, '*')
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

// Modified append to update preview
function append(value) {
    const isFunction = /sin\(|cos\(|tan\(|√\(/.test(value);
    if (!isFunction && display.textContent.length >= MAX_DISPLAY_LENGTH) return;

    value = toDisplaySymbol(value);

    if (display.textContent === '0') {
        display.textContent = value;
    } else {
        display.textContent += value;
    }

    updatePreview();
}

// Existing calculate function
function calculate() {
    try {
        let logicExpr = toLogicSymbol(display.textContent);
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
        display.textContent = 'Error';
        preview.textContent = '';
    }
}
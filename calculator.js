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
// Highlight tombol aktif berdasarkan scale
sizeButtons.forEach(btn => {
    if (parseFloat(btn.dataset.scale) === currentScale) {
        btn.classList.add('active');
    }
});

// Toggle toolbar
toolbarToggle.addEventListener('click', () => {
    toolbar.classList.toggle('open');
});

// Toggle dark/light mode
toggleBtn.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark');
    toggleBtn.textContent = isDarkMode ? 'Light Mode' : 'Dark Mode';
    localStorage.setItem('darkMode', isDarkMode);
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

// Function to refresh history
function refreshHistory() {
    historyList.innerHTML = '';
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
        let expression = display.textContent.replace('x', '*').replace('÷', '/');
        if (expression && expression !== '0') {
            let result = eval(expression);
            preview.textContent = '= ' + result;
        } else {
            preview.textContent = '';
        }
    } catch {
        preview.textContent = '';
    }
}

// Modified append to update preview
function append(value) {
    if (display.textContent === '0') {
        display.textContent = value;
    } else {
        display.textContent += value;
    }
    updatePreview();
}

// Modified clearDisplay: Tidak clear history
function clearDisplay() {
    display.textContent = '0';
    preview.textContent = '';
}

// Existing calculate function
function calculate() {
    try {
        let result = eval(display.textContent.replace('x', '*').replace('÷', '/'));
        let calculation = display.textContent + ' = ' + result;
        display.textContent = result;
        preview.textContent = '';
        let li = document.createElement('li');
        li.textContent = calculation;
        historyList.appendChild(li);
    } catch {
        display.textContent = 'Error';
        preview.textContent = '';
    }
}
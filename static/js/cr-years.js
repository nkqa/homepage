// script.js
document.addEventListener('DOMContentLoaded', () => {
    const yearElement = document.getElementById('current-year');
    const currentYear = new Date().getFullYear();
    yearElement.textContent = currentYear;
});
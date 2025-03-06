// script.js
document.addEventListener('DOMContentLoaded', () => {
    const startDate = new Date('2009-03-21T00:00:00Z'); // UTC 时间
    const updateTime = () => {
        const now = new Date();
        
        let years = now.getUTCFullYear() - startDate.getUTCFullYear();
        let months = now.getUTCMonth() - startDate.getUTCMonth();
        let days = now.getUTCDate() - startDate.getUTCDate();
        let hours = now.getUTCHours() - startDate.getUTCHours();
        let minutes = now.getUTCMinutes() - startDate.getUTCMinutes();
        let seconds = now.getUTCSeconds() - startDate.getUTCSeconds();

        if (seconds < 0) {
            seconds += 60;
            minutes--;
        }
        if (minutes < 0) {
            minutes += 60;
            hours--;
        }
        if (hours < 0) {
            hours += 24;
            days--;
        }
        if (days < 0) {
            // Get number of days in the previous month
            const monthBefore = new Date(now.getFullYear(), now.getMonth(), 0);
            days += monthBefore.getDate();
            months--;
        }
        if (months < 0) {
            months += 12;
            years--;
        }

        document.getElementById('years').textContent = years;
        document.getElementById('months').textContent = months;
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
    };

    setInterval(updateTime, 1000);
    updateTime(); // Initial call to display time
});
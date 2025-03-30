document.addEventListener('DOMContentLoaded', function() {
    // Sample prayer times (in 24-hour format)
    const prayerTimes = {
        fajr: "05:30",
        dhuhr: "12:30",
        asr: "15:45",
        maghrib: "18:15",
        isha: "20:00"
    };

    // DOM elements
    const clockElement = document.getElementById('clock');
    const dateElement = document.getElementById('date');
    const nextPrayerElement = document.getElementById('next-prayer');

    // Update clock every second
    function updateClock() {
        const now = new Date();
        
        // Update digital clock
        const time = now.toLocaleTimeString('en-US', { hour12: false });
        clockElement.textContent = time;
        
        // Update date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = now.toLocaleDateString('en-US', options);
        
        // Update prayer times and status
        updatePrayerTimes(now);
        
        setTimeout(updateClock, 1000);
    }

    function updatePrayerTimes(now) {
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;
        
        let nextPrayerName = '';
        let nextPrayerTime = '';
        let allPrayersPassed = true;
        
        // Reset all prayers
        document.querySelectorAll('.prayer').forEach(prayer => {
            prayer.classList.remove('active', 'passed');
            const statusElement = prayer.querySelector('.prayer-status');
            statusElement.innerHTML = '';
        });
        
        // Check each prayer time
        for (const [prayerName, prayerTime] of Object.entries(prayerTimes)) {
            const [prayerHour, prayerMinute] = prayerTime.split(':').map(Number);
            const prayerTimeInMinutes = prayerHour * 60 + prayerMinute;
            
            const prayerElement = document.getElementById(prayerName);
            const statusElement = document.getElementById(`${prayerName}-status`);
            
            // Format time for display (12-hour with AM/PM)
            const displayTime = new Date(0, 0, 0, prayerHour, prayerMinute).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
            
            prayerElement.querySelector('.prayer-time').textContent = displayTime;
            
            // Check if prayer time has passed
            if (currentTimeInMinutes > prayerTimeInMinutes) {
                prayerElement.classList.add('passed');
                statusElement.innerHTML = '<i class="fas fa-check-circle"></i>';
            } else {
                allPrayersPassed = false;
                
                // Check if it's time for this prayer (within 10 minutes)
                if (currentTimeInMinutes >= prayerTimeInMinutes - 10 && currentTimeInMinutes <= prayerTimeInMinutes + 10) {
                    prayerElement.classList.add('active');
                    statusElement.innerHTML = '<i class="fas fa-bell"></i>';
                    nextPrayerName = prayerName;
                    nextPrayerTime = displayTime;
                } else if (nextPrayerName === '') {
                    nextPrayerName = prayerName;
                    nextPrayerTime = displayTime;
                }
            }
        }
        
        // Handle case when all prayers have passed (next is tomorrow's Fajr)
        if (allPrayersPassed) {
            nextPrayerName = 'fajr';
            nextPrayerTime = document.getElementById('fajr').querySelector('.prayer-time').textContent;
        }
        
        // Update next prayer display
        const formattedPrayerName = nextPrayerName.charAt(0).toUpperCase() + nextPrayerName.slice(1);
        nextPrayerElement.textContent = `Next Prayer: ${formattedPrayerName} at ${nextPrayerTime}`;
    }

    // Initialize
    updateClock();
});
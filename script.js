function createConfetti() {
    const isLogo = Math.random() > 0.7; // 30% chance for logo
    const confetti = document.createElement('div');

    if (isLogo) {
        confetti.classList.add('logo-confetti');
        confetti.style.backgroundImage = "url('logo.png')";
        const size = Math.random() * 20 + 30; // 30px to 50px
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
    } else {
        confetti.classList.add('heart-confetti');
        confetti.innerHTML = '❤';
        const size = Math.random() * 1 + 0.5; // 0.5rem to 1.5rem
        confetti.style.fontSize = size + 'rem';
        const colors = ['#ff69b4', '#ff1493', '#db7093', '#ffc0cb'];
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
    }

    // Randomize position
    confetti.style.left = Math.random() * 100 + 'vw';

    // Randomize animation duration (slow falling)
    const duration = Math.random() * 10 + 10; // 10 to 20 seconds
    confetti.style.animationDuration = duration + 's';

    document.getElementById('confetti-container').appendChild(confetti);

    // Remove after animation
    setTimeout(() => {
        confetti.remove();
    }, duration * 1000);
}

// Create a new piece of confetti every 100ms
setInterval(createConfetti, 100);

const messages = [
    ["Roses are Red &", "Violets are Blue,", "Have you booked", "Your table for", "Two?"],
    ["Valentine's Day", "Set Menu", "STARTER: SHARED PLATE", "Camembert, Poppers", "& Cauli-bites"],
    ["Valentine's Day", "Set Menu: MAIN", "Sirloin, Chicken,", "Salmon or", "Filo Parcel"],
    ["Valentine's Day", "Set Menu: DESSERT", "SHARED PLATE:", "Cheesecake, Apple", "Shortcake & Sorbet"],
    ["Hey You! Yes, You!", "You and Boo", "Should Come Too,", "Book Now,", "For Your Table", "of Two!"],
    `<p>Ring us: 352 0210</p>
     <p>(three five two ooh two one ohh)</p>
     <p>It's Only...</p>
     <p>$90 FOR TWO</p>
     <div style="margin-top: 1vh; display: flex; flex-direction: column; align-items: center;">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https%3A%2F%2Fbookings.nowbookit.com%2F%3Faccountid%3Dd7034cd3-cfde-4556-a98c-ea943ec35ef4%26venueid%3D13703%26theme%3Ddark%26colors%3Dhex%2Cff2d6f%26date%3D2026-02-14%26serviceids%3Devent" alt="Scan to Book" style="border: 2px solid white; border-radius: 10px; width: 30vh; height: 30vh;">
        <p style="font-size: 4vh; margin-top: 1vh; font-family: 'Outfit', sans-serif;">scan code to book your table</p>
     </div>`
];

let currentMessageIndex = 0;
const messageContainer = document.querySelector('.message');

const heartContainer = document.querySelector('.heart-container');
const progressBar = document.querySelector('.progress-bar');
let cycleTimeout;

const durations = [
    60000, // Msg 1: 1 minute
    60000, // Msg 2: 1 minute
    60000, // Msg 3: 1 minute
    60000, // Msg 4: 1 minute
    60000, // Msg 5: 1 minute
    60000  // Msg 6: 1 minute
];

function adjustFontSize(element, targetSize, callback) {
    // STANDARD MASSIVE SIZE: 15vh (25% increase from previous 12vh)
    const baseSize = 15; 
    const unit = 'vh';
    element.style.fontSize = baseSize + unit;

    // Use 96% safe zone for a "fill screen" look
    const maxH = window.innerHeight * 0.96; 
    const maxW = window.innerWidth * 0.96;

    requestAnimationFrame(() => {
        let size = baseSize;
        let attempts = 0;
        
        // Only shrink if it exceeds the safe zone, ensuring consistency where possible
        while (attempts < 60 && (element.scrollHeight > maxH || element.scrollWidth > maxW)) {
            size -= 0.1; // Very fine-grained for maximum possible size
            element.style.fontSize = size + unit;
            attempts++;
            if (size < 4) break; 
        }
        
        if (callback) callback();
    });
}

function updateMessage() {
    if (!messageContainer || !heartContainer || !progressBar) return;

    if (cycleTimeout) clearTimeout(cycleTimeout);

    // 1. FADE OUT
    messageContainer.classList.add('fade-out');

    // 2. WAIT FOR FADE
    setTimeout(() => {
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        const nextMessage = messages[currentMessageIndex];
        const duration = durations[currentMessageIndex];
        
        // 3. RESET PROGRESS (no transition)
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        void progressBar.offsetWidth; 
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = '100%';

        // 4. SWAP CONTENT (while invisible)
        if (Array.isArray(nextMessage)) {
            messageContainer.innerHTML = nextMessage
                .map(line => `<p>${line}</p>`)
                .join('');
        } else {
            messageContainer.innerHTML = nextMessage;
        }

        if (currentMessageIndex === 0) {
            heartContainer.style.opacity = '1';
            heartContainer.style.visibility = 'visible';
            messageContainer.style.color = '#000000';
            messageContainer.classList.remove('full-screen');
        } else {
            heartContainer.style.opacity = '0';
            heartContainer.style.visibility = 'hidden';
            messageContainer.style.color = '#ffffff';
            messageContainer.classList.add('full-screen');
        }

        // 5. MAXIMIZE SIZE & FADE IN
        // Standardize everything to 15vh for consistency
        adjustFontSize(messageContainer, '15vh', () => {
            requestAnimationFrame(() => {
                messageContainer.classList.remove('fade-out');
            });
        });

        cycleTimeout = setTimeout(updateMessage, duration);
    }, 1000); 
}

// Initial progress bar trigger
const initialDuration = durations[0];
progressBar.style.transition = `width ${initialDuration}ms linear`;
progressBar.style.width = '100%';
cycleTimeout = setTimeout(updateMessage, initialDuration);

// --- Confetti Logic ---
function createConfetti() {
    const isLogo = Math.random() > 0.7; // 30% chance for logo
    const confetti = document.createElement('div');

    if (isLogo) {
        confetti.classList.add('logo-confetti');
        // Note: Ensure logo.png is in the same folder or adjust path
        confetti.style.backgroundImage = "url('logo.png')";
        const size = Math.random() * 20 + 30; 
        confetti.style.width = size + 'px';
        confetti.style.height = size + 'px';
    } else {
        confetti.classList.add('heart-confetti');
        confetti.innerHTML = '❤';
        const size = Math.random() * 1 + 0.5; 
        confetti.style.fontSize = size + 'rem';
        const colors = ['#ff69b4', '#ff1493', '#db7093', '#ffc0cb'];
        confetti.style.color = colors[Math.floor(Math.random() * colors.length)];
    }

    confetti.style.left = Math.random() * 100 + 'vw';
    const duration = Math.random() * 10 + 10; 
    confetti.style.animationDuration = duration + 's';

    const container = document.getElementById('confetti-container');
    if (container) {
        container.appendChild(confetti);
        setTimeout(() => {
            confetti.remove();
        }, duration * 1000);
    }
}

setInterval(createConfetti, 100);

// --- Message Configuration ---
const messagesConfig = [
    {
        text: `
        <p>Roses are Red &</p>
        <p>Violets are Blue,</p>
        <p>Have you booked</p>
        <p>Your table for</p>
        <p>Two?</p>
        `,
        textColor: '#ffffff',
        fontSize: '8vh',
        color: '#ff3366',
        enlarged: false,
        compact: false,
        duration: 60000
    },
    {
        text: `
        <p class="red-title">Valentine's Day</p>
        <p class="red-title">3 Course Set Menu</p>
        <p>1 Shared Starter Plate</p>
        <p>Choice of 2 Mains</p>
        <p>1 Shared Dessert Plate</p>
        <p class="red-title">$90 for Two</p>
        `,
        textColor: '#ffffff',
        fontSize: '8vh',
        color: 'rgba(255, 105, 180, 0.5)',
        enlarged: false,
        compact: false,
        duration: 60000
    },
    {
        text: `
        <p class="red-title">Valentine's Day Set Menu:</p>
        <p class="red-title">STARTER: SHARED PLATE:</p>
        <p>Crumbed Camembert w. Plum Sauce,</p>
        <p>Chicken Poppers w. Sriracha Aioli</p>
        <p>& Cauli-bites w. Hot Honey.</p>
        `,
        textColor: '#ffffff',
        fontSize: '8vh',
        color: 'rgba(255, 0, 0, 0.5)',
        enlarged: true,
        compact: true,
        duration: 60000
    },
    {
        text: `
        <p class="red-title">Valentine's Day Set Menu:</p>
        <p class="red-title">MAINS: CHOICE OF 2:</p>
        <p>1 Sirloin Steak Medium Rare.</p>
        <p>2 Ooh La La Chicken.</p>
        <p>3 Salmon Fillet.</p>
        <p>4 Pumpkin, Spinach, Feta Filo.</p>
        `,
        textColor: '#ffffff',
        fontSize: '8vh',
        color: 'rgba(170, 0, 255, 0.5)',
        enlarged: true,
        compact: true,
        duration: 60000
    },
    {
        text: `
        <p class="red-title">Valentine's Day Set Menu:</p>
        <p class="red-title">DESSERT: SHARED PLATE:</p>
        <p>Chocolate Cheesecake, Apple Shortcake,</p>
        <p>Berries, Cream & Berry Sorbet</p>
        `,
        textColor: '#ffffff',
        fontSize: '8vh',
        color: 'rgba(0, 102, 255, 0.5)',
        enlarged: true,
        compact: true,
        duration: 60000
    },
    {
        text: `
        <p>Hey You! Yes, You!</p>
        <p>You and Boo</p>
        <p>Should Come Too,</p>
        <p>Book Now,</p>
        <p>For Your Table</p>
        <p>of Two!</p>
        `,
        textColor: '#ffffff',
        fontSize: '8vh',
        color: 'rgba(255, 20, 147, 0.5)',
        enlarged: true,
        compact: true,
        duration: 60000
    },
    {
        text: `
        <p>Book Online: coasterstavern.co.nz</p>
        <p>or Call us: 352 0210</p>
        <p>or Scan the Code Below:</p>
        <div id="qr-placeholder" style="margin-top: 1vh; display: flex; flex-direction: column; align-items: center;">
           <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https%3A%2F%2Fbookings.nowbookit.com%2F%3Faccountid%3Dd7034cd3-cfde-4556-a98c-ea943ec35ef4%26venueid%3D13703%26theme%3Ddark%26colors%3Dhex%2Cff2d6f%26date%3D2026-02-14%26serviceids%3Devent" alt="Scan to Book" style="border: 2px solid white; border-radius: 10px; width: 18vh; height: 18vh;">
        </div>
        <p>It's Only... $90 for TWO</p>
        `,
        textColor: '#ffffff',
        fontSize: '8vh',
        color: '#ff3366',
        enlarged: false,
        compact: true,
        duration: 60000
    }
];

let currentMessageIndex = 0;
const messageContainer = document.querySelector('.message');
const progressBar = document.querySelector('.progress-bar');
const heartContainer = document.querySelector('.heart-container');
const root = document.documentElement;
let cycleTimeout;

function wrapWords(htmlString) {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    if (!tempDiv.innerText.trim() && !tempDiv.querySelector('img')) return '';

    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const textNodes = [];
    while (node = walk.nextNode()) textNodes.push(node);

    for (const textNode of textNodes) {
        let textContent = textNode.nodeValue;
        const words = textContent.split(/(\s+)/); 
        const fragment = document.createDocumentFragment();
        words.forEach(word => {
            if (word.trim().length === 0) {
                 fragment.appendChild(document.createTextNode(word));
            } else {
                const span = document.createElement('span');
                span.textContent = word;
                span.className = 'word';
                fragment.appendChild(span);
            }
        });
        textNode.parentNode.replaceChild(fragment, textNode);
    }
    return tempDiv.innerHTML;
}

function adjustFontSize(element, baseSize, callback) {
    const unit = 'vh';
    let size = parseFloat(baseSize) || 8;
    element.style.fontSize = size + unit;

    // Maximize screen usage
    const maxH = window.innerHeight * 0.80;
    const maxW = window.innerWidth * 0.80;

    requestAnimationFrame(() => {
        const minSize = 2; 
        let iterations = 0;
        
        while (size > minSize && iterations < 300) {
            if (element.scrollHeight <= maxH && element.scrollWidth <= maxW) break;
            size -= 0.1;
            element.style.fontSize = size + unit;
            iterations++;
        }
        if (callback) callback();
    });
}

function displayMessage(index) {
    if (!messageContainer) return;
    if (cycleTimeout) clearTimeout(cycleTimeout);
    
    messageContainer.classList.add('fade-out');

    setTimeout(() => {
        const config = messagesConfig[index];
        const duration = config.duration || 60000;

        // Progress Bar
        const totalDuration = messagesConfig.reduce((sum, msg) => sum + (msg.duration || 60000), 0);
        const accumulatedTime = messagesConfig.slice(0, index).reduce((sum, msg) => sum + (msg.duration || 60000), 0);
        const startPercent = (accumulatedTime / totalDuration) * 100;
        const endPercent = ((accumulatedTime + duration) / totalDuration) * 100;

        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = `${startPercent}%`;
            void progressBar.offsetWidth; 
            progressBar.style.transition = `width ${duration}ms linear`;
            progressBar.style.width = `${endPercent}%`;
        }

        // Update Content
        root.style.setProperty('--heart-color', config.color);
        heartContainer.classList.toggle('enlarged', config.enlarged);
        heartContainer.classList.toggle('hidden-heart', index !== 0);
        messageContainer.classList.toggle('compact', config.compact);
        messageContainer.classList.toggle('white-text', config.textColor === '#ffffff');
        messageContainer.style.color = config.textColor || '';
        messageContainer.innerHTML = wrapWords(config.text);
        
        const words = messageContainer.querySelectorAll('.word');
        
        adjustFontSize(messageContainer, config.fontSize || '8vh', () => {
            messageContainer.classList.remove('fade-out');
            words.forEach((word, i) => setTimeout(() => word.classList.add('visible'), i * 500));
        });

        cycleTimeout = setTimeout(() => displayMessage((index + 1) % messagesConfig.length), duration);
    }, 1000);
}

window.addEventListener('load', () => displayMessage(currentMessageIndex));
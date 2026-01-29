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

// --- Message Cycling & Animation Logic ---

const messagesConfig = [
    {
        // Msg 1: Default Poem (Index 0)
        text: `
        <p>Roses are Red &</p>
        <p>Violets are Blue,</p>
        <p>Have you booked</p>
        <p>Your table for</p>
        <p>Two?</p>
        `,
        textColor: '#ffffff',
        fontSize: '15vh',
        color: '#ff3366',
        enlarged: false,
        compact: false,
        hideFooter: true,
        duration: 60000
    },
    {
        // Msg 2: Starter (Index 1)
        text: `
        <p class="red-title">Valentine's Day Set Menu</p>
        <p>STARTER: SHARED PLATE:</p>
        <p>Crumbed Camembert w. Plum Sauce,</p>
        <p>Chicken Poppers w. Sriracha Aioli</p>
        <p>& Cauli-bites w. Hot Honey.</p>
        `,
        textColor: '#ffffff',
        fontSize: '15vh',
        color: 'rgba(255, 0, 0, 0.5)',
        enlarged: true,
        compact: true,
        hideFooter: true,
        duration: 60000
    },
    {
        // Msg 3: Main (Index 2)
        text: `
        <p class="red-title">Valentine's Day Set Menu</p>
        <p>MAINS: CHOICE OF 2:</p>
        <p>1 Sirloin Med Rare w. Veg & Jus.</p>
        <p>2 Ooh La La Chicken w. Mash & Greens.</p>
        <p>3 Salmon w. Veg, Salad & Sauce.</p>
        <p>4 Pumpkin, Spinach, Feta Filo Parcel.</p>
        `,
        textColor: '#ffffff',
        fontSize: '13vh',
        color: 'rgba(170, 0, 255, 0.5)',
        enlarged: true,
        compact: true,
        hideFooter: true,
        duration: 60000
    },
    {
        // Msg 4: Dessert (Index 3)
        text: `
        <p class="red-title">Valentine's Day Set Menu</p>
        <p>DESSERT: SHARED PLATE:</p>
        <p>Chocolate Cheesecake, Apple Shortcake,</p>
        <p>Berries, Cream & Berry Sorbet</p>
        `,
        textColor: '#ffffff',
        fontSize: '15vh',
        color: 'rgba(0, 102, 255, 0.5)',
        enlarged: true,
        compact: true,
        hideFooter: true,
        duration: 60000
    },
    {
        // Msg 5: Hey You! (Index 4)
        text: `
        <p>Hey You! Yes, You!</p>
        <p>You and Boo</p>
        <p>Should Come Too,</p>
        <p>Book Now,</p>
        <p>For Your Table</p>
        <p>of Two!</p>
        `,
        textColor: '#ffffff',
        fontSize: '15vh',
        color: 'rgba(255, 20, 147, 0.5)',
        enlarged: true,
        compact: true,
        hideFooter: true,
        duration: 60000
    },
    {
        // Msg 6: Contact & Price (Index 5)
        text: `
        <p>Book Your Table for Two:</p>
        <p>Call (03) 352 0210</p>
        <p>coasterstavern.co.nz</p>
        <p>$90 FOR TWO</p>
        <div id="qr-placeholder" style="margin-top: 1vh; display: flex; flex-direction: column; align-items: center;">
           <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https%3A%2F%2Fbookings.nowbookit.com%2F%3Faccountid%3Dd7034cd3-cfde-4556-a98c-ea943ec35ef4%26venueid%3D13703%26theme%3Ddark%26colors%3Dhex%2Cff2d6f%26date%3D2026-02-14%26serviceids%3Devent" alt="Scan to Book" style="border: 2px solid white; border-radius: 10px; width: 25vh; height: 25vh;">
        </div>
        `,
        textColor: '#ffffff',
        fontSize: '15vh',
        color: '#ff3366',
        enlarged: false,
        compact: true,
        hideFooter: true,
        duration: 60000
    }
];

let currentMessageIndex = 0;
const messageContainer = document.querySelector('.message');
const progressBar = document.querySelector('.progress-bar');
const heartContainer = document.querySelector('.heart-container');
const heartShape = document.querySelector('.heart');
const root = document.documentElement;
const bottomMessage = document.querySelector('.bottom-message');

let cycleTimeout;

function wrapWords(htmlString) {
    if (!htmlString) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    
    // If empty text, return empty
    if (!tempDiv.innerText.trim() && !tempDiv.querySelector('img')) return '';

    const walk = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const textNodes = [];
    while (node = walk.nextNode()) {
        textNodes.push(node);
    }

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
    // Determine unit and start size
    const unit = 'vh';
    let size = parseFloat(baseSize) || 15;
    element.style.fontSize = size + unit;

    // Safety margins: 96% of screen (Standard massive size)
    const maxH = window.innerHeight * 0.96;
    const maxW = window.innerWidth * 0.96;

    requestAnimationFrame(() => {
        const minSize = 3; 

        // Loop until content fits within safety margins
        while (size > minSize) {
            // Check if both height and width fit
            if (element.scrollHeight <= maxH && element.scrollWidth <= maxW) break;
            
            size -= 0.1; 
            element.style.fontSize = size + unit;
        }
        if (callback) callback();
    });
}

function displayMessage(index) {
    if (cycleTimeout) clearTimeout(cycleTimeout);
    
    // 1. FADE OUT
    messageContainer.classList.add('fade-out');

    // 2. WAIT FOR FADE (1s)
    setTimeout(() => {
        const config = messagesConfig[index];
        const duration = config.duration || 60000;

        // 3. UPDATE PROGRESS
        const totalDuration = messagesConfig.reduce((sum, msg) => sum + (msg.duration || 60000), 0);
        const accumulatedTime = messagesConfig.slice(0, index).reduce((sum, msg) => sum + (msg.duration || 60000), 0);
        
        const startPercent = (accumulatedTime / totalDuration) * 100;
        const endPercent = ((accumulatedTime + duration) / totalDuration) * 100;

        progressBar.style.transition = 'none';
        progressBar.style.width = `${startPercent}%`;
        void progressBar.offsetWidth; 
        progressBar.style.transition = `width ${duration}ms linear`;
        progressBar.style.width = `${endPercent}%`;

        // 4. SWAP CONTENT (while invisible)
        root.style.setProperty('--heart-color', config.color);
        
        if (config.enlarged) {
            heartContainer.classList.add('enlarged');
        } else {
            heartContainer.classList.remove('enlarged');
        }

        if (config.compact) {
            messageContainer.classList.add('compact');
        } else {
            messageContainer.classList.remove('compact');
        }

        if (bottomMessage) {
            if (config.hideFooter) {
                bottomMessage.classList.add('hidden');
            } else {
                const isFirstOrLast = (index === 0 || index === messagesConfig.length - 1);
                if (!isFirstOrLast) {
                    bottomMessage.classList.add('hidden');
                } else {
                    bottomMessage.classList.remove('hidden');
                }
            }
        }

        messageContainer.style.color = config.textColor || '';
        if (config.textColor === '#ffffff') {
            messageContainer.classList.add('white-text');
        } else {
            messageContainer.classList.remove('white-text');
        }

        messageContainer.innerHTML = wrapWords(config.text);
        
        const words = messageContainer.querySelectorAll('.word');
        words.forEach(word => word.style.opacity = '0');

        if (index === 0) {
            heartContainer.classList.remove('hidden-heart');
        } else {
            heartContainer.classList.add('hidden-heart');
        }

        // 5. ADJUST SIZE & REVEAL
        adjustFontSize(messageContainer, config.fontSize || '12vh', () => {
            requestAnimationFrame(() => {
                messageContainer.classList.remove('fade-out');
                words.forEach((word, i) => {
                    setTimeout(() => {
                        word.classList.add('visible');
                        word.style.opacity = '1';
                    }, i * 200); 
                });
            });
        });

        cycleTimeout = setTimeout(nextMessage, duration);
    }, 1000);
}

function nextMessage() {
    currentMessageIndex = (currentMessageIndex + 1) % messagesConfig.length;
    displayMessage(currentMessageIndex);
}

function prevMessage() {
    currentMessageIndex = (currentMessageIndex - 1 + messagesConfig.length) % messagesConfig.length;
    displayMessage(currentMessageIndex);
}

// Initial Call
displayMessage(currentMessageIndex);


// Three.js background animation
let scene, camera, renderer, particles;

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 1);
    
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0xb30000,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });
    
    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    camera.position.z = 15;
    
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    particles.rotation.x += 0.0001;
    particles.rotation.y += 0.0002;
    
    const positions = particles.geometry.attributes.position.array;
    
    for (let i = 0; i < positions.length; i += 3) {
        // Create subtle movement
        positions[i] += Math.sin(Date.now() * 0.001 + i) * 0.0005;
        positions[i+1] += Math.cos(Date.now() * 0.001 + i) * 0.0005;
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
    
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize);

// Sound effects setup with preloaded audio
const sounds = {
    ambient: new Howl({
        src: ['sounds/ambient.mp3'],
        loop: true,
        volume: 0.3,
        preload: true
    }),
    call: new Howl({
        src: ['sounds/call.mp3'],
        volume: 0.7,
        preload: true
    }),
    static: new Howl({
        src: ['sounds/static.mp3'],
        loop: true,
        volume: 0.2,
        preload: true
    }),
    glitch: new Howl({
        src: ['sounds/glitch.mp3'],
        volume: 0.5,
        preload: true
    }),
    judgment: new Howl({
        src: ['sounds/judgment.mp3'],
        volume: 0.8,
        preload: true
    })
};

// Fallback for any sound loading issues
Object.keys(sounds).forEach(key => {
    sounds[key].on('loaderror', function() {
        console.warn(`Sound ${key} failed to load. Using silent fallback.`);
        sounds[key] = {
            play: () => {},
            stop: () => {},
            fade: () => {}
        };
    });
});

// Fake video generation - creates a video with disturbing static and glitches
function generateHorrorVideo() {
    const video = document.getElementById('horror-video');
    
    // If we have a specific video file
    if (video.getAttribute('data-src')) {
        video.src = video.getAttribute('data-src');
    } else {
        // Create a canvas for generating glitchy video
        const canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        const ctx = canvas.getContext('2d');
        
        // Generate static frames
        const generateFrame = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Base dark static
            for (let i = 0; i < 2000; i++) {
                ctx.fillStyle = `rgba(${Math.random() * 50}, 0, 0, ${Math.random() * 0.3})`;
                ctx.fillRect(
                    Math.random() * canvas.width, 
                    Math.random() * canvas.height, 
                    Math.random() * 3, 
                    Math.random() * 3
                );
            }
            
            // Occasionally draw a faint face-like shadow
            if (Math.random() > 0.9) {
                ctx.fillStyle = 'rgba(30, 0, 0, 0.2)';
                ctx.beginPath();
                ctx.ellipse(
                    canvas.width/2, 
                    canvas.height/2, 
                    canvas.width/4, 
                    canvas.height/3, 
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            }
            
            // Add horizontal glitch lines
            if (Math.random() > 0.7) {
                const lineCount = Math.floor(Math.random() * 5) + 1;
                for (let i = 0; i < lineCount; i++) {
                    const y = Math.floor(Math.random() * canvas.height);
                    const height = Math.floor(Math.random() * 10) + 1;
                    ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.3})`;
                    ctx.fillRect(0, y, canvas.width, height);
                }
            }
            
            // Occasional text flashes
            if (Math.random() > 0.95) {
                ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
                ctx.font = '60px monospace';
                ctx.fillText('WATCHING', 
                    canvas.width/2 - 120 + Math.random() * 10, 
                    canvas.height/2 + Math.random() * 10);
            }
            
            requestAnimationFrame(generateFrame);
        };
        
        generateFrame();
        
        // Convert canvas to video stream
        try {
            const stream = canvas.captureStream(25); // 25fps
            video.srcObject = stream;
        } catch (e) {
            console.error('Canvas stream not supported, using fallback');
            // Fallback for browsers not supporting captureStream
            video.poster = 'images/static.jpg';
        }
    }
    
    // Setup the video to be glitchy
    setTimeout(() => {
        video.style.display = 'block';
        document.getElementById('connecting-text').style.display = 'none';
        sounds.static.play();
        
        // Make the video glitch occasionally
        setInterval(() => {
            if (Math.random() > 0.7) {
                video.classList.add('glitch');
                setTimeout(() => {
                    video.classList.remove('glitch');
                }, 200);
            }
        }, 3000);
        
        // Add scary face reveal occasionally
        setInterval(() => {
            if (Math.random() > 0.9) {
                revealFace();
            }
        }, 15000);
    }, 5000);
}

// Function to briefly reveal a scary face
function revealFace() {
    const faceOverlay = document.getElementById('face-reveal');
    if (!faceOverlay) return;
    
    // Play glitch sound
    sounds.glitch.play();
    
    // Show the face
    faceOverlay.style.opacity = '1';
    
    // Shake the screen
    document.getElementById('facetime-window').classList.add('screen-shake');
    
    // Hide after a brief moment
    setTimeout(() => {
        faceOverlay.style.opacity = '0';
        document.getElementById('facetime-window').classList.remove('screen-shake');
    }, 200);
}

// Random horror messages from the entity
const horrorResponses = [
    "I sense your hatred... tell me more about this person.",
    "Their sins are great. The punishment will be severe.",
    "The ancient texts speak of such crimes. They will suffer.",
    "I can see through your eyes. This person deserves justice.",
    "Garud Puran has specific torments for such sins.",
    "My realm awaits those who commit such acts.",
    "I require more details to determine their fate.",
    "The depths of Naraka are prepared for such souls.",
    "Their suffering will match their crimes. Continue.",
    "I have witnessed their deeds through you. Speak more.",
    "Your rage feeds me. Tell me everything.",
    "The sacred texts demand retribution for this.",
    "The judgment has already begun in my realm.",
    "Their soul will be cleansed through pain.",
    "I see darkness in their actions. It must be purified.",
    "The ancient laws cannot be broken without consequence.",
    "Every sin leaves a mark on the soul. I see many marks.",
    "The punishment in Naraka is precise and measured.",
    "Continue speaking. Each word brings them closer to judgment.",
    "Your voice reaches across realms. I am listening."
];

// Punishments based on Garud Puran for different crimes
const punishments = {
    theft: "As decreed in Adhyaya 5 of Garud Puran, they shall be bound in hot iron chains and repeatedly dropped into boiling oil in Raurava Naraka. Their flesh will burn and regenerate for 1000 years for each item stolen.",
    violence: "The sacred text condemns them to Asipatravana, where they will walk on a pathway of sharp swords while demons with iron rods force them forward. Their wounds shall never heal for a time equal to each act of violence multiplied by 108 years.",
    lies: "For their deceit, Garud Puran sentences them to Maharaurava Naraka, where their tongue will be pulled out repeatedly by iron tongs and demons will pour molten metal down their throat, burning them from inside for each falsehood spoken.",
    betrayal: "The betrayer is condemned to Kumbhipaka where they shall be cooked in huge vessels of boiling oil and blood. For each act of betrayal, they will experience 12,000 divine years of agony as per the ancient wisdom.",
    greed: "As written in the sacred text, the greedy one is sentenced to Andhatamisra, where they will be eternally hungry and thirsty. Demons will offer them food and water that turns to fire when consumed, burning them from within.",
    pride: "For excessive pride, Garud Puran decrees punishment in Taptakumbha, where they will be crushed repeatedly under massive weights and forced to carry mountains while wading through rivers of pus and blood for 10,000 divine years.",
    lust: "The lustful one shall be cast into Lalabhaksha Naraka, where their body will be embraced by red-hot iron statues and their organs consumed by worms and maggots, only to regenerate and suffer again for 8,400 divine years.",
    envy: "For their envy, they are sentenced to Vedhaka, where vulture-faced demons will peck at their eyes and internal organs while they are bound to blazing iron pillars for each instance of coveting another's possessions or happiness.",
    anger: "Those consumed by anger shall face Rudhirandha, where they will swim in lakes of blood and pus, consuming the same as their only nourishment, as their bodies are continuously attacked by poisonous creatures for 7,000 years.",
    disrespect: "For disrespecting others, especially elders and parents, Garud Puran sentences them to Vaitarani, a river of filth, blood and urine that they must cross while flesh-eating fish attack them from all sides.",
    slander: "For speaking ill of others, they shall be thrown into Krimibhojana where insects and worms will feast on their tongue and throat. Their flesh will be torn by iron hooks for each word of slander spoken.",
    abuse: "For their abuse, Garud Puran sentences them to Shalmali where they will climb trees with thorns as sharp as swords, only to be impaled repeatedly upon falling. This punishment will continue for as many years as people they have abused.",
    torture: "Those who torture others shall be sent to Tamisra, a realm of absolute darkness where they shall suffer extreme thirst and hunger while being beaten mercilessly by Yamdoots with iron rods for each moment of suffering they caused.",
    cruelty: "For acts of cruelty, they are condemned to Asitapatravana where their bodies will be sliced into pieces by razor-sharp leaves of metal trees, only to be reassembled for the torture to begin anew for 10,000 divine years."
};

// Generic punishment for other crimes
const genericPunishment = "According to the sacred texts of Garud Puran, their soul shall be cast into the appropriate level of Naraka (hell) where Yamdoots (servants of Yama, the god of death) will administer punishments fitting their crimes. They will experience bodily torment through extreme heat and cold, be forced to walk on burning sands, have their flesh torn by beasts, and witness horrifying visions until their karma is purified.";

// Loading screen simulation
function simulateLoading() {
    const progress = document.getElementById('progress');
    let width = 0;
    
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loading-screen').style.opacity = 0;
                setTimeout(() => {
                    document.getElementById('loading-screen').style.display = 'none';
                    document.getElementById('intro').style.display = 'flex';
                }, 1500);
            }, 1000);
        } else {
            width += Math.random() * 3;
            if (width > 100) width = 100;
            progress.style.width = width + '%';
        }
    }, 150);
}

// Chat functionality
function setupChat() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    
    let messageCount = 0;
    let crimesDescribed = [];
    let entityState = "curious"; // curious, interested, judging
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            chatMessages.innerHTML += `<div class="user-message">${message}</div>`;
            chatInput.value = '';
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Analyze message for crime details
            const accusedName = extractAccusedName(message);
            const crimes = determineMultipleCrimes(message);
            
            // Store for later judgment
            if (crimes.length > 0) {
                crimesDescribed = crimesDescribed.concat(crimes);
                if (entityState === "curious") entityState = "interested";
            }
            
            // Make the video glitch more intensely
            document.getElementById('horror-video').classList.add('glitch');
            document.getElementById('facetime-window').classList.add('screen-shake');
            sounds.glitch.play();
            
            setTimeout(() => {
                document.getElementById('horror-video').classList.remove('glitch');
                document.getElementById('facetime-window').classList.remove('screen-shake');
                
                // Entity responds
                setTimeout(() => {
                    messageCount++;
                    
                    // If multiple messages received, increase intensity
                    if (messageCount >= 3 && entityState === "interested") {
                        entityState = "judging";
                        
                        // Before responding, show face briefly
                        revealFace();
                        
                        setTimeout(() => {
                            let response = "I have heard enough. Your descriptions have allowed me to see the full nature of their transgressions.";
                            chatMessages.innerHTML += `<div class="incoming-message">${response}</div>`;
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            
                            // After a dramatic pause, deliver judgment
                            setTimeout(() => {
                                deliverJudgment(accusedName, crimesDescribed);
                            }, 3000);
                        }, 1000);
                    } else {
                        // Normal response based on state
                        let responseOptions = horrorResponses;
                        if (entityState === "interested") {
                            // More intense responses when the entity is interested
                            responseOptions = horrorResponses.filter(r => r.includes("punishment") || r.includes("suffer") || r.includes("Naraka") || r.includes("torment"));
                        }
                        
                        const response = responseOptions[Math.floor(Math.random() * responseOptions.length)];
                        chatMessages.innerHTML += `<div class="incoming-message">${response}</div>`;
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                }, 1500);
            }, 500);
        }
    }
    
    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Extract the name of the accused from the message
function extractAccusedName(message) {
    // Simple name extraction using common patterns
    const namePatterns = [
        /(?:named|called|is|about)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/i,
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+(?:has|had|did|committed)/i,
        /([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})\s+(?:is|was)/i,
        /my(?:\s+[a-z]+){0,2}\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2})/i
    ];
    
    for (const pattern of namePatterns) {
        const match = message.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    // If no specific name found, look for pronouns
    if (message.toLowerCase().includes("he ") || message.toLowerCase().includes("his ")) {
        return "The Man";
    } else if (message.toLowerCase().includes("she ") || message.toLowerCase().includes("her ")) {
        return "The Woman";
    } else if (message.toLowerCase().includes("they ") || message.toLowerCase().includes("their ")) {
        return "The Accused";
    }
    
    return "The Accused";
}

// Determine multiple types of crimes from the message
function determineMultipleCrimes(message) {
    const messageLower = message.toLowerCase();
    let detectedCrimes = [];
    
    // Check for specific crimes
    for (const crime in punishments) {
        if (messageLower.includes(crime)) {
            detectedCrimes.push(crime);
        }
    }
    
    // Check for related terms
    const crimeMap = [
        { keywords: ["stole", "took", "robbed", "theft"], crime: "theft" },
        { keywords: ["hit", "hurt", "beat", "attack", "harm"], crime: "violence" },
        { keywords: ["lied", "deceived", "false", "untrue"], crime: "lies" },
        { keywords: ["cheated", "betrayed", "backstab", "unfaithful"], crime: "betrayal" },
        { keywords: ["disrespect", "insult", "mock", "rude"], crime: "disrespect" },
        { keywords: ["angry", "rage", "temper", "wrath"], crime: "anger" },
        { keywords: ["jealous", "envy", "covet"], crime: "envy" },
        { keywords: ["proud", "arrogant", "ego", "boast"], crime: "pride" },
        { keywords: ["greedy", "selfish", "hoard", "miserly"], crime: "greed" },
        { keywords: ["lust", "harass", "molest", "inappropriate"], crime: "lust" },
        { keywords: ["gossip", "slander", "defame", "rumor"], crime: "slander" },
        { keywords: ["abuse", "mistreat", "bully"], crime: "abuse" },
        { keywords: ["torture", "torment", "anguish"], crime: "torture" },
        { keywords: ["cruel", "sadistic", "heartless"], crime: "cruelty" }
    ];
    
    crimeMap.forEach(item => {
        item.keywords.forEach(keyword => {
            if (messageLower.includes(keyword) && !detectedCrimes.includes(item.crime)) {
                detectedCrimes.push(item.crime);
            }
        });
    });
    
    return detectedCrimes.length > 0 ? detectedCrimes : ["unknown"];
}

// Deliver the final judgment
function deliverJudgment(accusedName, crimes) {
    // Determine the most severe crime
    let primaryCrime = crimes[0];
    if (crimes.includes("violence") || crimes.includes("torture") || crimes.includes("cruelty")) {
        primaryCrime = crimes.find(c => c === "violence" || c === "torture" || c === "cruelty");
    } else if (crimes.includes("theft") || crimes.includes("betrayal") || crimes.includes("lies")) {
        primaryCrime = crimes.find(c => c === "theft" || c === "betrayal" || c === "lies");
    }
    
    // Get the judgment text
    const judgment = punishments[primaryCrime] || genericPunishment;
    const crimesList = crimes.map(c => c === "unknown" ? "their misdeeds" : c).join(", ");
    
    // Build a more detailed judgment statement
    let fullJudgment = judgment;
    
    // If multiple crimes, add extra punishment
    if (crimes.length > 1) {
        fullJudgment += "\n\nAs they have committed multiple sins (" + crimesList + "), their torment shall be multiplied. After each punishment is complete, they shall be transferred to the next realm of suffering until their karma is purified.";
    }
    
    // Display the judgment screen
    document.getElementById('accused-name').innerText = `THE ACCUSED: ${accusedName}`;
    document.getElementById('crime-details').innerText = `CRIMES: ${crimesList}`;
    document.getElementById('punishment-details').innerText = fullJudgment;
    
    // Make the transition dramatic
    document.getElementById('facetime-window').classList.add('screen-shake');
    sounds.glitch.play();
    sounds.ambient.fade(0.3, 0.1, 2000);
    
    // Play judgment sound if available
    if (sounds.judgment) {
        sounds.judgment.play();
    }
    
    setTimeout(() => {
        document.getElementById('judgment-container').style.display = 'flex';
        document.getElementById('facetime-container').style.opacity = 0.3;
    }, 1000);
}

// Create a typed effect for text
function typeWriter(element, text, speed = 30) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Check and warn about sound requirements
    if (!window.Howl) {
        console.error('Howler.js is required for sound effects. Please include it in your HTML.');
        alert('Warning: Sound effects library not loaded. For the full experience, please make sure Howler.js is included.');
    }
    
    // Check for Three.js
    if (!window.THREE) {
        console.error('Three.js is required for background effects. Please include it in your HTML.');
        alert('Warning: Three.js not loaded. For the full experience, please make sure Three.js is included.');
    }
    
    // Check if we have all required elements
    const requiredIds = [
        'progress', 'loading-screen', 'intro', 'begin-btn', 'canvas-container',
        'facetime-container', 'horror-video', 'connecting-text', 'chat-messages',
        'chat-input', 'send-btn', 'end-call', 'judgment-container', 'accused-name',
        'crime-details', 'punishment-details', 'restart-btn'
    ];
    
    const missingElements = requiredIds.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
        console.warn('Missing HTML elements:', missingElements);
        alert('Warning: Some required HTML elements are missing. Please check the console for details.');
    }
    
    // Start loading screen
    simulateLoading();
    
    // Initialize Three.js background if available
    if (window.THREE) {
        try {
            initThreeJS();
        } catch (e) {
            console.error('Failed to initialize Three.js:', e);
        }
    }
    
    // Add a face reveal element if not present
    if (!document.getElementById('face-reveal')) {
        const faceReveal = document.createElement('div');
        faceReveal.id = 'face-reveal';
        faceReveal.className = 'face-reveal';
        document.getElementById('facetime-window')?.appendChild(faceReveal);
    }
    
    // Setup event listeners
    document.getElementById('begin-btn')?.addEventListener('click', () => {
        document.getElementById('intro').style.display = 'none';
        document.getElementById('canvas-container').style.opacity = 1;
        
        // Play ambient sound
        if (window.Howl) sounds.ambient.play();
        
        // After a delay, show facetime screen
        setTimeout(() => {
            if (window.Howl) sounds.call.play();
            document.getElementById('facetime-container').style.display = 'flex';
            
            // Generate horror video
            generateHorrorVideo();
            
            // Setup chat functionality
            setupChat();
        }, 3000);
    });
    
    // End call button
    document.getElementById('end-call')?.addEventListener('click', () => {
        document.getElementById('facetime-container').style.display = 'none';
        document.getElementById('intro').style.display = 'flex';
        if (window.Howl) sounds.static.stop();
    });
    
    // Restart button
    document.getElementById('restart-btn')?.addEventListener('click', () => {
        document.getElementById('judgment-container').style.display = 'none';
        document.getElementById('facetime-container').style.opacity = 1;
        document.getElementById('chat-messages').innerHTML = '<div class="system-message">* Connection established with unknown entity *</div>';
        document.getElementById('chat-input').value = '';
        if (window.Howl) sounds.ambient.fade(0.1, 0.3, 2000);
    });
    
    // Add some spooky random events
    setInterval(() => {
        if (document.getElementById('facetime-container').style.display === 'flex' && Math.random() > 0.95) {
            // Random glitch effects
            const glitchDuration = 100 + Math.random() * 300;
            document.body.classList.add('glitch-filter');
            if (window.Howl) sounds.glitch.play();
            
            setTimeout(() => {
                document.body.classList.remove('glitch-filter');
            }, glitchDuration);
        }
    }, 20000);
});

// Extra horror effect: random whispers
function setupRandomWhispers() {
    const whispers = [
        "behind you", "watching", "judgment", "sin", "punishment",
        "eternal", "suffering", "darkness", "pain", "naraka"
    ];
    
    // Create audio context for generating whispers
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    function createWhisper() {
        if (document.hidden || Math.random() > 0.1) return;
        
        const whisper = whispers[Math.floor(Math.random() * whispers.length)];
        
        // Create audio elements for whisper
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(120 + Math.random() * 50, audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 0.3);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        
        // Create visual whisper
        const whisperElem = document.createElement('div');
        whisperElem.className = 'whisper';
        whisperElem.textContent = whisper;
        whisperElem.style.left = Math.random() * 80 + 10 + 'vw';
        whisperElem.style.top = Math.random() * 80 + 10 + 'vh';
        document.body.appendChild(whisperElem);
        
        setTimeout(() => {
            document.body.removeChild(whisperElem);
        }, 2000);
    }
    
    // Set up interval for random whispers
    setInterval(createWhisper, 30000);
}

// Call the whispers setup if audio context is available
if (window.AudioContext || window.webkitAudioContext) {
    document.addEventListener('click', function setupAudio() {
        setupRandomWhispers();
        document.removeEventListener('click', setupAudio);
    }, { once: true });
}
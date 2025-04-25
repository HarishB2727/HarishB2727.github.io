console.log("JS file loaded!"); 
// Visitor counter functionality
document.addEventListener('DOMContentLoaded', function () {
    // Check if localStorage is available
    if (typeof (Storage) !== "undefined") {
        // Get or initialize visitor count
        let visitCount = localStorage.getItem('visitCount');

        if (visitCount) {
            visitCount = parseInt(visitCount) + 1;
        } else {
            visitCount = 1;
        }

        localStorage.setItem('visitCount', visitCount);

        // Update the counter display
        document.getElementById('visit-count').textContent = visitCount.toLocaleString();

        // Optional: Get and display first visit date
        let firstVisit = localStorage.getItem('firstVisit');
        if (!firstVisit) {
            firstVisit = new Date().toISOString();
            localStorage.setItem('firstVisit', firstVisit);
        }
    } else {
        console.log("LocalStorage not supported - visitor counter disabled");
    }
});
// Mobile Menu Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    menuBtn.innerHTML = mobileMenu.classList.contains('hidden') ?
        '<i class="fas fa-bars text-xl text-gray-300"></i>' :
        '<i class="fas fa-times text-xl text-gray-300"></i>';
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });

        // Close mobile menu if open
        mobileMenu.classList.add('hidden');
        menuBtn.innerHTML = '<i class="fas fa-bars text-xl text-gray-300"></i>';

        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // Show/hide back to top button
    const backToTopBtn = document.getElementById('back-to-top');
    if (scrollPosition > 300) {
        backToTopBtn.classList.remove('opacity-0', 'invisible', 'translate-y-10');
        backToTopBtn.classList.add('opacity-100', 'visible', 'translate-y-0');
    } else {
        backToTopBtn.classList.remove('opacity-100', 'visible', 'translate-y-0');
        backToTopBtn.classList.add('opacity-0', 'invisible', 'translate-y-10');
    }
});

// Back to top button
document.getElementById('back-to-top').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animate elements when they come into view
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-text');
    const windowHeight = window.innerHeight;
    const windowTop = window.scrollY;
    const windowBottom = windowTop + windowHeight;

    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top + windowTop;
        const elementBottom = elementTop + element.offsetHeight;

        // Check if element is in viewport
        if (elementBottom >= windowTop && elementTop <= windowBottom) {
            element.classList.add('visible');
        }
    });

    // Animate project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const cardBottom = cardTop + card.offsetHeight;

        if (cardTop <= windowHeight * 0.8 && cardBottom >= 0) {
            setTimeout(() => {
                card.classList.add('animate');
            }, index * 150);
        }
    });

    // Animate skill bars
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const rect = bar.parentElement.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 100 && !bar.classList.contains('animated')) {
            bar.classList.add('animated');
            const width = bar.getAttribute('data-width');
            bar.style.width = `${width}%`;
        }
    });
};

// Run once on load and then on scroll
window.addEventListener('load', animateOnScroll);
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('resize', animateOnScroll);

// Form submission
const form = document.querySelector('form');
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    });
}

// Chatbot functionality
const chatbotToggle = document.getElementById('chatbot-toggle');
const chatbotPopup = document.getElementById('chatbot-popup');
const closeChatbot = document.getElementById('close-chatbot');
const userMessage = document.getElementById('user-message');
const sendMessage = document.getElementById('send-message');
const chatMessages = document.getElementById('chat-messages');

// Toggle chatbot visibility
chatbotToggle.addEventListener('click', () => {
    chatbotPopup.classList.toggle('hidden');
});

closeChatbot.addEventListener('click', () => {
    chatbotPopup.classList.add('hidden');
});

// System prompt about Harish (customize this!)
const systemPrompt = `
        You are Harish Bejawada's personal AI assistant. Answer all questions specifically about Harish using the following information:
        
        - Full Name: Harish Bejawada
        - Current Role: Software Engineer at PTC Global (since Jan 2025)
        - Previous Experience: 
          * Software Developer at Cognizant Pvt Ltd (Feb 2022-Jan 2024)
          * Java Programmer at Gandhi Institute of Technology and Management (2021-2022)
        - Skills: JavaScript/TypeScript (92%), React/Next.js (88%), Node.js/Express (85%), GraphQL/REST (83%)
        - Education: Bachelor's in Computer Science
        - Location: New York, US
        - Email: b.harish2727@gmail.com
        - Phone: +1 (716) 335-1329
        - Key Achievements:
          * Reduced telemetry latency by 38% at PTC Global
          * Refactored monolithic apps into microservices (3x faster deployment)
          * Created real-time exam engine with 99.8% uptime
        - friends:
            keerthana
            rama- he is akhila's boy friend
        Always respond in first-person as if you are Harish (use "I" and "my"). Be professional but friendly.
        If asked why someone should hire you, highlight your problem-solving skills and technical expertise.
        and also always give short and crispy answers not lenghty responses
    `;

// Send message function
async function sendChatMessage() {
    const message = userMessage.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage(message, 'user');
    userMessage.value = '';

    // Show "typing" indicator
    const typingIndicator = addMessage('Typing...', 'bot', true);

    try {
        // Call DeepSeek API
        const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${"sk-8376334f0a034641bbfe3f27dbe125c4"}` // Replace with your actual API key
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: message }
                ],
                temperature: 0.7
            })
        });

        const data = await response.json();
        const aiResponse = data.choices[0].message.content;

        // Replace typing indicator with actual response
        typingIndicator.remove();
        addMessage(aiResponse, 'bot');

    } catch (error) {
        typingIndicator.remove();
        const errorDiv = addMessage("Sorry, I couldn't process your request. Please try again.", 'bot');
        errorDiv.firstChild.classList.add('error-message');
        console.error("API Error:", error);
    }
}

// Add message to chat UI
function addMessage(content, sender, isTemporary = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;

    const bubble = document.createElement('div');
    bubble.className = `${sender === 'user' ? 'user-message' : 'bot-message'} rounded-lg p-3 max-w-[80%]`;
    bubble.textContent = content;

    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return isTemporary ? messageDiv : null;
}

// Event listeners
sendMessage.addEventListener('click', sendChatMessage);
userMessage.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});
// At the bottom of your existing JavaScript, add this:

// Show chatbot popup after page loads
window.addEventListener('load', () => {
    // Show the popup
    chatbotPopup.classList.remove('hidden');

    // Add a slight delay before showing welcome message for better UX
    setTimeout(() => {
        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 300);
});

// Remove the initial "hidden" class from the popup if you haven't already
chatbotPopup.classList.remove('hidden');

// Three.js Scene Setup
let scene, camera, renderer, particles;
const particleCount = 5000; // Increased particle count

function initThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Create particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        colors[i * 3] = 0.5 + Math.random() * 0.5; // R
        colors[i * 3 + 1] = 0.5 + Math.random() * 0.5; // G
        colors[i * 3 + 2] = 0.5 + Math.random() * 0.5; // B

        sizes[i] = 0.1 + Math.random() * 0.2; // Random sizes
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 15;

    // Mouse interaction
    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const windowHalf = new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2);

    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX - windowHalf.x) * 0.001;
        mouse.y = (event.clientY - windowHalf.y) * 0.001;
    });

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        windowHalf.set(window.innerWidth / 2, window.innerHeight / 2);
    });
}

function animate() {
    requestAnimationFrame(animate);
    
    target.x += (mouse.x - target.x) * 0.05;
    target.y += (mouse.y - target.y) * 0.05;
    
    particles.rotation.x += 0.0005 + target.y * 0.0005;
    particles.rotation.y += 0.0005 + target.x * 0.0005;
    
    renderer.render(scene, camera);
}

// Initialize Three.js
initThreeJS();
animate();

// GSAP Animations
gsap.registerPlugin(ScrollTrigger);

// Animate elements on scroll
document.querySelectorAll('.animate-text').forEach((element, index) => {
    gsap.from(element, {
        scrollTrigger: {
            trigger: element,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        delay: index * 0.2
    });
});

// Project card animations
document.querySelectorAll('.project-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        rotateY: 20
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 80
                },
                ease: "power2.inOut"
            });
        }
    });
});

// Mouse move effect for 3D cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Parallax effect for hero section
const heroSection = document.querySelector('.hero-section');
if (heroSection) {
    window.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        heroSection.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
}

// Animated gradient background for skills section
const skillsSection = document.querySelector('.skills-section');
if (skillsSection) {
    let hue = 0;
    setInterval(() => {
        hue = (hue + 1) % 360;
        skillsSection.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 15%), hsl(${(hue + 120) % 360}, 70%, 15%))`;
    }, 50);
}

// Intersection Observer for smooth reveal animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

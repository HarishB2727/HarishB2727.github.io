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

// System prompt about Harish
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

// Show chatbot popup after page loads
window.addEventListener('load', () => {
    chatbotPopup.classList.remove('hidden');
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 300);
});

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

// Mouse move effect for 3D cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
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

document.querySelectorAll('.animate-on-scroll').forEach(element => {
    observer.observe(element);
});

// Job Posting Functionality
document.addEventListener('DOMContentLoaded', () => {
    const jobForm = document.getElementById('job-form');
    const jobListings = document.getElementById('job-listings');

    if (jobForm && jobListings) {
        // Load existing jobs from localStorage
        loadJobs();

        // Handle form submission
        jobForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const jobData = {
                title: document.getElementById('job-title')?.value || '',
                company: document.getElementById('company-name')?.value || '',
                description: document.getElementById('job-description')?.value || '',
                email: document.getElementById('contact-email')?.value || '',
                timestamp: new Date().getTime()
            };

            // Save job to localStorage
            saveJob(jobData);
            
            // Clear form
            jobForm.reset();

            // Refresh job listings
            loadJobs();
        });
    }

    // Function to save job to localStorage
    function saveJob(jobData) {
        let jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        jobs.push(jobData);
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }

    // Function to load and display jobs
    function loadJobs() {
        if (!jobListings) return;
        
        let jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const currentTime = new Date().getTime();
        
        // Filter out jobs older than 24 hours
        jobs = jobs.filter(job => {
            const jobAge = currentTime - job.timestamp;
            return jobAge < 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        });
        
        // Save filtered jobs back to localStorage
        localStorage.setItem('jobs', JSON.stringify(jobs));

        // Display jobs
        jobs.forEach(job => {
            const jobElement = createJobElement(job);
            jobListings.appendChild(jobElement);
        });
    }

    // Function to create job listing element
    function createJobElement(job) {
        const jobDiv = document.createElement('div');
        jobDiv.className = 'glass-effect p-6 rounded-lg hover:transform hover:scale-105 transition duration-300';
        
        const timeAgo = getTimeAgo(job.timestamp);
        
        jobDiv.innerHTML = `
            <h3 class="text-xl font-semibold text-primary-light mb-2">${job.title}</h3>
            <p class="text-gray-300 mb-2">${job.company}</p>
            <p class="text-gray-400 mb-4">${job.description}</p>
            <div class="flex justify-between items-center">
                <a href="mailto:${job.email}" class="text-primary hover:text-primary-light transition duration-300">
                    <i class="fas fa-envelope mr-2"></i>Contact
                </a>
                <span class="text-gray-400 text-sm">${timeAgo}</span>
            </div>
        `;
        
        return jobDiv;
    }

    // Function to format time ago
    function getTimeAgo(timestamp) {
        const seconds = Math.floor((new Date().getTime() - timestamp) / 1000);
        
        let interval = Math.floor(seconds / 3600);
        if (interval < 24) {
            return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
        }
        return '1 day ago';
    }

    // Set up periodic refresh of job listings (every 5 minutes)
    setInterval(loadJobs, 5 * 60 * 1000);
});

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

// Visitor count functionality
let visitorChart = null;

function updateVisitorCount() {
    if (window.goatcounter) {
        const stats = window.goatcounter.get_stats();
        if (stats) {
            // Update main counter
            const count = document.getElementById('visit-count');
            if (count) count.textContent = stats.total.toLocaleString();

            // Update detailed stats
            updateDetailedStats(stats);
            
            // Update chart
            updateVisitorChart(stats);
        }
    }
}

function updateDetailedStats(stats) {
    const today = document.getElementById('today-count');
    const week = document.getElementById('week-count');
    const month = document.getElementById('month-count');

    if (today) today.textContent = (stats.today || 0).toLocaleString();
    if (week) week.textContent = (stats.week || 0).toLocaleString();
    if (month) month.textContent = (stats.month || 0).toLocaleString();
}

function updateVisitorChart(stats) {
    const ctx = document.getElementById('visitor-chart');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (visitorChart) {
        visitorChart.destroy();
    }

    // Create new chart
    visitorChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: stats.daily?.map(d => new Date(d.date).toLocaleDateString()) || [],
            datasets: [{
                label: 'Daily Visitors',
                data: stats.daily?.map(d => d.count) || [],
                borderColor: '#818cf8',
                backgroundColor: 'rgba(129, 140, 248, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    display: false
                },
                y: {
                    display: false
                }
            },
            elements: {
                point: {
                    radius: 0
                }
            }
        }
    });
}

// Update visitor count every 5 minutes
console.log('Initializing visitor counter...');
// Initial update
setTimeout(updateVisitorCount, 2000); // Wait for GoatCounter to load
// Regular updates
setInterval(updateVisitorCount, 5 * 60 * 1000);

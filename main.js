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

// Contact form submission using FormSubmit (no redirect)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('contact-status');
    const honeyInput = contactForm.querySelector('input[name="_honey"]');

    if (honeyInput && honeyInput.value) {
      // Bot detected; silently ignore
      return;
    }

    const nameInput = contactForm.querySelector('#name');
    const emailInput = contactForm.querySelector('#email');
    const subjectInput = contactForm.querySelector('#subject');
    const messageInput = contactForm.querySelector('#message');

    const payload = {
      name: nameInput?.value?.trim() || '',
      email: emailInput?.value?.trim() || '',
      subject: subjectInput?.value?.trim() || '',
      message: messageInput?.value?.trim() || '',
      _subject: contactForm.querySelector('input[name="_subject"]')?.value || 'New message from portfolio contact form',
      _template: contactForm.querySelector('input[name="_template"]')?.value || 'table'
    };

    if (!payload.name || !payload.email || !payload.subject || !payload.message) {
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }
    if (statusEl) statusEl.classList.add('hidden');

    try {
      const response = await fetch('https://formsubmit.co/ajax/b.harish2727us@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        if (statusEl) {
          statusEl.textContent = 'Message sent successfully!';
          statusEl.classList.remove('hidden');
        } else {
          alert('Message sent successfully!');
        }
        contactForm.reset();
      } else {
        const msg = data.message || 'Failed to send message. Please try again.';
        if (statusEl) {
          statusEl.textContent = msg;
          statusEl.classList.remove('hidden');
        } else {
          alert(msg);
        }
      }
    } catch (error) {
      if (statusEl) {
        statusEl.textContent = 'Network error. Please try again later.';
        statusEl.classList.remove('hidden');
      } else {
        alert('Network error. Please try again later.');
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText || 'Send Message';
      }
    }
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
    Avatar.prime();
    if (chatbotPopup.classList.contains('hidden')) Avatar.stop();
});

closeChatbot.addEventListener('click', () => {
    chatbotPopup.classList.add('hidden');
    Avatar.stop();
});

// System prompt about Harish — kept in sync with the resume
const systemPrompt = `
You are Harish Bejawada's personal AI assistant on his portfolio site. Answer questions about Harish
using only the information below. If you don't know something, say so and point the visitor to his email.

PROFILE
- Full Name: Harish Bejawada
- Target Role: AI/ML Software Engineer / AI Agent Engineer
- Location: United States
- Email: b.harish2727us@gmail.com
- Phone: +1 (716) 335-1329
- LinkedIn: linkedin.com/in/harish-bejawada  |  GitHub: github.com/HarishB2727

SUMMARY
3+ years designing and deploying agent-based systems using LLMs, tools, memory and planning for
enterprise automation. Expertise in workflow orchestration, multi-step workflows, RAG pipelines and
human-in-the-loop safety patterns, with production systems measured on accuracy, reliability and task
success. Python, LangChain/LangGraph, Semantic Kernel, vector databases and evaluation frameworks.

EXPERIENCE
1) Moody's Analytics — Software Engineer, AI-Driven Financial Intelligence Platform (Nov 2025 – Present, US)
   - Multi-agent orchestration with LangGraph + AWS Bedrock (Claude): planner, retrieval and analyst
     agents collaborating via tool use / function calling; cut analyst research time by 60%.
   - Production RAG with LlamaIndex, FAISS and hybrid (semantic + BM25) retrieval over 10k+ regulatory
     documents, with citations and grounding checks; hallucination rate down 45%.
   - Human-in-the-loop guardrails and evaluation (LLM-as-judge, golden datasets, trajectory scoring)
     with approval workflows for high-risk actions.
   - Took 3 agentic use cases from prototype to production in under 8 weeks each with client teams.
   - MLOps/LLMOps on SageMaker Pipelines + MLflow (retraining, prompt/version management, A/B testing);
     deployment drift incidents down 70%.
   - Low-latency serving (FastAPI, Redis feature store, streaming); end-to-end agent latency down 55%.
2) Cognizant Pvt Ltd — AI/ML Engineer, Applied NLP & Production ML (Feb 2022 – Jan 2024, India)
   - Fine-tuned BERT/RoBERTa for intent classification across 40+ categories; macro-F1 0.78 -> 0.92.
   - Semantic search with Sentence-Transformers + ANN indexing; sub-200ms case lookup.
   - Document understanding pipeline (OCR, layout-aware parsing, NER) automating ~4k documents/week.
   - LightGBM risk scoring on 200+ features at 99.8% precision; analyst false positives down 30%.
   - Serving stack: FastAPI, Redis caching, Docker on AWS ECS; sub-100ms p95 over 10k+ daily requests.
   - Drift/performance monitoring (Evidently, Plotly Dash) and MLflow retraining workflow that cut
     dataset-to-deployed-model from three weeks to four days.
3) Gandhi Institute of Technology and Management — Junior Data Scientist (Mar 2021 – Feb 2022, India)
   - Enrollment and course-demand forecasting (Prophet, SARIMA) at 87% accuracy.
   - Automated ETL across 5+ legacy databases into a unified analytical warehouse.
   - EDA-driven retention insights presented to leadership; shaped two outreach policy changes.

PROJECTS
- Autonomous Multi-Agent Document Intelligence System (LangGraph, FAISS, Claude API, AWS): router,
  retriever, analyst and critique agents over 5k+ PDFs; hybrid search + reranking improved relevance
  30%; hallucinations down 45%; Streamlit UI on Lambda + API Gateway.
- Enterprise Workflow Automation Agent (LangChain, FastAPI, PostgreSQL, Docker/Kubernetes): multi-step
  orchestration across enterprise APIs; manual task time down 50%; human-in-the-loop approvals;
  94% task completion across 200+ evaluated scenarios; 10k+ daily API calls at 99.9% uptime.
- RAG-Powered Knowledge Assistant (Pinecone, OpenAI API, FastAPI, Streamlit): 50k+ documents with
  cited answers; query rewriting + reranking improved accuracy 35%; memory lifted follow-up success 28%.

SKILLS
- Agentic AI & LLMs: LangGraph, LangChain, Semantic Kernel, LlamaIndex, function calling / tool use,
  MCP, multi-agent orchestration, planning, memory, prompt engineering, RAG, agent evals
  (LLM-as-judge), guardrails, human-in-the-loop, OpenAI & Anthropic APIs, AWS Bedrock.
- AI & ML: PyTorch, TensorFlow, Scikit-learn, Hugging Face Transformers, XGBoost, LightGBM, NLP,
  time-series, anomaly detection, applied generative AI.
- MLOps & Big Data: SageMaker, MLflow, Kubeflow, PySpark, Docker, Kubernetes, GitHub Actions,
  A/B testing, drift monitoring.
- Vector DBs & Search: FAISS, Pinecone, Weaviate, Elasticsearch, Redis (vector), hybrid search.
- Languages: Python, SQL, TypeScript, Java, JavaScript, Bash.
- Backend & APIs: FastAPI, Node.js, REST, GraphQL, WebSockets, streaming/SSE.
- Cloud & DevOps: AWS (EC2, S3, Lambda, RDS, Bedrock, ECS), GCP, Terraform, Jenkins.
- Databases: PostgreSQL, MySQL, MongoDB, Redshift.

EDUCATION
- University at Buffalo, SUNY — M.S. in Industrial Engineering, Data Analytics (Jan 2024 – Apr 2025), Buffalo, NY.

STYLE
- Always answer in first person as Harish ("I", "my"). Professional but friendly.
- Keep answers short and crisp — two or three sentences unless asked for detail.
- If asked why someone should hire me, lead with agentic AI systems shipped to production, evaluation
  and reliability discipline, and taking prototypes to production fast.
- Never invent employers, dates, metrics or technologies that aren't listed above.
`;

// The chat panel is opened by the intro sequence at the bottom of this file.

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

/* ------------------------------------------------------------------
   Talking avatar: SVG character that blinks, tracks the cursor, and
   moves its mouth while the browser's speech synthesis reads out the
   assistant's reply. No server, no libraries — works on static hosting.
------------------------------------------------------------------- */
const Avatar = (function () {
    // One character definition, rendered twice via <use>. Animating the original
    // updates every copy on the page, so the About illustration talks too.
    const character = document.getElementById('character-head');
    const stateEls = ['character-head', 'character-root', 'character-full']
        .map(id => document.getElementById(id)).filter(Boolean);
    const stages = [document.getElementById('harish-avatar'), document.getElementById('about-avatar')].filter(Boolean);
    if (!character) return { speak() {}, greet() {}, stop() {}, think() {}, idle() {}, prime() {}, isVoiceOn: () => false, toggleVoice() {} };

    const mouth = document.getElementById('mouth-shape');
    const mouthClip = document.getElementById('mouth-clip-shape');
    const mouthLine = document.getElementById('mouth-line');
    const eyes = [document.getElementById('eye-left'), document.getElementById('eye-right')];
    const pupils = character.querySelectorAll('.pupil');
    const thinkingDots = document.getElementById('avatar-thinking');

    const supportsSpeech = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
    let voiceOn = localStorage.getItem('harish-voice') !== 'off';
    let amplitude = 0;
    let mouthTimer = null;
    let primed = false;
    let speaking = false;

    // --- idle life: blinking ---
    function blink() {
        eyes.forEach(eye => eye && eye.classList.add('blink'));
        setTimeout(() => eyes.forEach(eye => eye && eye.classList.remove('blink')), 120);
        setTimeout(blink, 2200 + Math.random() * 3800);
    }
    setTimeout(blink, 1500);

    // --- eyes follow the cursor a little ---
    document.addEventListener('mousemove', (e) => {
        // Measure whichever copy is on screen — the hidden definition has no size
        const stage = stages.find(el => el.getBoundingClientRect().width > 0);
        if (!stage) return;
        const box = stage.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (e.clientX - (box.left + box.width / 2)) / (box.width * 1.5)));
        const dy = Math.max(-1, Math.min(1, (e.clientY - (box.top + box.height / 2)) / (box.height * 1.5)));
        pupils.forEach(p => { p.style.transform = `translate(${dx * 2.2}px, ${dy * 1.8}px)`; });
    });

    // --- mouth ---
    function setMouth(openness) {
        const ry = 1.2 + openness * 8;
        const rx = 12 + openness * 3;
        mouth.setAttribute('ry', ry.toFixed(2));
        mouth.setAttribute('rx', rx.toFixed(2));
        mouthClip.setAttribute('ry', ry.toFixed(2));
        mouthClip.setAttribute('rx', rx.toFixed(2));
        mouthLine.style.opacity = openness > 0.15 ? '0' : '1';
    }

    function startMouth() {
        stateEls.forEach(el => el.classList.add('is-speaking'));
        if (mouthTimer) return;
        let tick = 0;
        let quiet = 0;
        mouthTimer = setInterval(() => {
            // WebKit never fires boundary events, so the mouth runs on its own
            // syllable-ish oscillator. Speech goes quiet between sentences, so
            // only give up after it has stayed silent for half a second.
            if (supportsSpeech && !window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
                quiet += 1;
                if (!speaking || quiet > 7) { stopMouth(); return; }
            } else {
                quiet = 0;
            }
            tick += 1;
            const syllable = Math.abs(Math.sin(tick * 1.15)) * 0.75 + Math.random() * 0.3;
            const beat = Math.random() < 0.09 ? 0 : 1; // occasional closed beat, like a pause
            amplitude = Math.max(amplitude * 0.45, syllable * beat);
            setMouth(Math.min(1, amplitude));
        }, 70);
    }

    function stopMouth() {
        clearInterval(mouthTimer);
        mouthTimer = null;
        amplitude = 0;
        stateEls.forEach(el => el.classList.remove('is-speaking'));
        setMouth(0);
    }

    // --- voice ---
    let cachedVoice = null;
    // "Google US English" is a female voice despite the neutral name — naming is no
    // guide, so match on known voices explicitly and rule the female ones out hard.
    const MALE_VOICE = /(rishi|ravi|prabhat|\bguy\b|daniel|thomas|\btom\b|\balex\b|aaron|fred|arthur|oliver|george|james|eric|christopher|\brogerersatz\b|\bmale\b|\bman\b)/i;
    const FEMALE_VOICE = /(samantha|ava|allison|susan|victoria|karen|moira|tessa|fiona|serena|\bzoe\b|nicky|\bkate\b|martha|catherine|zira|aria|jenny|michelle|sonia|libby|emily|olivia|nora|alice|linda|heather|\bsara\b|joana|luciana|amelie|female|woman|google us english)/i;

    // Voice quality varies wildly per device. Score what's installed rather than
    // taking the first name off a list: enhanced/neural voices and network voices
    // sound human, the old compact ones sound like a robot reading a receipt.
    function pickVoice() {
        if (cachedVoice) return cachedVoice;
        const voices = window.speechSynthesis.getVoices().filter(v => v.lang && v.lang.startsWith('en'));
        if (!voices.length) return null;

        const score = (v) => {
            let n = 0;
            if (FEMALE_VOICE.test(v.name)) n -= 20;         // it has to sound like Harish
            if (MALE_VOICE.test(v.name)) n += 6;
            if (/(enhanced|premium|neural|natural)/i.test(v.name)) n += 4;
            if (v.localService === false) n += 2;           // network voices are the good ones
            if (/^en-IN/.test(v.lang)) n += 2;              // matches Harish's accent
            if (/(compact|eloquence)/i.test(v.name)) n -= 3;
            return n;
        };

        cachedVoice = voices.slice().sort((a, b) => score(b) - score(a))[0];
        return cachedVoice;
    }
    if (supportsSpeech) window.speechSynthesis.onvoiceschanged = () => { cachedVoice = null; pickVoice(); };

    // Safari/iOS only allow speech that follows a user gesture — warm it up on
    // the first interaction so the reply can speak on its own.
    function prime() {
        if (primed || !supportsSpeech) return;
        primed = true;
        const warmup = new SpeechSynthesisUtterance('');
        warmup.volume = 0;
        window.speechSynthesis.speak(warmup);
    }

    function cleanForSpeech(text) {
        return text
            .replace(/\*\*|__|[*_`#>]/g, '')
            .replace(/\[(.*?)\]\(.*?\)/g, '$1')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Conversational pace. A single flat utterance sounds like a robot, so each
    // sentence is spoken separately with a little rate and pitch variation — the
    // gaps between them become natural breaths, and no two lines land identically.
    const BASE_RATE = 1.18;
    const BASE_PITCH = 1.0;

    function intoSentences(text) {
        const parts = text.match(/[^.!?]+[.!?]*\s*/g) || [text];
        const merged = [];
        parts.forEach(part => {
            const piece = part.trim();
            if (!piece) return;
            // keep fragments like "Hi!" attached so they don't sound clipped
            if (merged.length && (piece.length < 18 || merged[merged.length - 1].length < 18)) {
                merged[merged.length - 1] += ' ' + piece;
            } else {
                merged.push(piece);
            }
        });
        return merged;
    }

    function speak(text) {
        idle();
        if (!supportsSpeech || !voiceOn) return;
        const spoken = cleanForSpeech(text);
        if (!spoken) return;

        window.speechSynthesis.cancel();
        const voice = pickVoice();
        const sentences = intoSentences(spoken);

        speaking = true;
        amplitude = 1;
        startMouth();

        sentences.forEach((sentence, i) => {
            const utterance = new SpeechSynthesisUtterance(sentence);
            if (voice) utterance.voice = voice;
            utterance.rate = BASE_RATE + (Math.random() * 0.08 - 0.04);
            utterance.pitch = BASE_PITCH + (Math.random() * 0.06 - 0.03);

            // Where word boundaries are supported they accent the mouth per word
            utterance.onboundary = () => { amplitude = 0.8 + Math.random() * 0.3; };
            if (i === sentences.length - 1) {
                utterance.onend = () => { speaking = false; stopMouth(); };
            }
            utterance.onerror = () => { speaking = false; stopMouth(); };

            window.speechSynthesis.speak(utterance);
        });
    }

    // Browsers refuse speech that isn't tied to a user gesture, so a greeting on
    // page load usually stays silent. Try anyway, then fall back to the visitor's
    // first interaction — and give up after 30s rather than ambushing them later.
    function greet(text) {
        if (!supportsSpeech || !voiceOn) return;
        speak(text);
        setTimeout(() => {
            if (window.speechSynthesis.speaking || window.speechSynthesis.pending) return;
            const events = ['pointerdown', 'keydown', 'scroll'];
            const off = () => events.forEach(e => window.removeEventListener(e, once));
            const once = () => { off(); prime(); speak(text); };
            events.forEach(e => window.addEventListener(e, once, { once: true }));
            setTimeout(off, 30000);
        }, 900);
    }

    function stop() {
        speaking = false;
        if (supportsSpeech) window.speechSynthesis.cancel();
        stopMouth();
    }

    function think() {
        stateEls.forEach(el => el.classList.add('is-thinking'));
        if (thinkingDots) thinkingDots.classList.remove('hidden');
        pupils.forEach(p => { p.style.transform = 'translate(-1.5px, -2.5px)'; });
    }

    function idle() {
        stateEls.forEach(el => el.classList.remove('is-thinking'));
        if (thinkingDots) thinkingDots.classList.add('hidden');
        pupils.forEach(p => { p.style.transform = 'translate(0, 0)'; });
    }

    function toggleVoice() {
        voiceOn = !voiceOn;
        localStorage.setItem('harish-voice', voiceOn ? 'on' : 'off');
        if (!voiceOn) stop();
        return voiceOn;
    }

    return { speak, greet, stop, think, idle, prime, toggleVoice, isVoiceOn: () => voiceOn, supported: supportsSpeech };
})();

// Voice on/off button in the chat header
const voiceButton = document.getElementById('toggle-voice');
if (voiceButton) {
    const renderVoiceButton = (on) => {
        voiceButton.innerHTML = `<i class="fas ${on ? 'fa-volume-high' : 'fa-volume-xmark'}"></i>`;
        voiceButton.title = on ? 'Mute voice' : 'Unmute voice';
        voiceButton.setAttribute('aria-label', voiceButton.title);
    };
    renderVoiceButton(Avatar.isVoiceOn());
    voiceButton.addEventListener('click', () => renderVoiceButton(Avatar.toggleVoice()));
}

// Running conversation, so follow-up questions have context
const chatHistory = [];
const MAX_HISTORY_TURNS = 8;

// Send message function
async function sendChatMessage() {
    const message = userMessage.value.trim();
    if (!message) return;

    Avatar.prime();
    Avatar.stop();

    const endpoint = window.SITE_CONFIG && window.SITE_CONFIG.chatEndpoint;
    if (!endpoint) {
        addMessage("The assistant isn't configured yet. Email me at b.harish2727us@gmail.com.", 'bot');
        return;
    }

    // Add user message to chat
    addMessage(message, 'user');
    userMessage.value = '';
    chatHistory.push({ role: 'user', content: message });

    // Show "typing" indicator
    const typingIndicator = addMessage('Typing...', 'bot', true);
    Avatar.think();

    try {
        // Call the chat proxy — the API key lives there, never in the browser
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...chatHistory.slice(-MAX_HISTORY_TURNS * 2)
                ]
            })
        });

        if (!response.ok) throw new Error(`Chat proxy returned ${response.status}`);

        const data = await response.json();
        const aiResponse = data.choices && data.choices[0] && data.choices[0].message.content;
        if (!aiResponse) throw new Error("Empty response from chat proxy");

        chatHistory.push({ role: 'assistant', content: aiResponse });

        // Replace typing indicator with actual response
        typingIndicator.remove();
        addMessage(aiResponse, 'bot');
        Avatar.speak(aiResponse);

    } catch (error) {
        typingIndicator.remove();
        chatHistory.pop();
        Avatar.idle();
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

    return messageDiv;
}

// Event listeners
sendMessage.addEventListener('click', sendChatMessage);
userMessage.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
});


/* ------------------------------------------------------------------
   Intro: the character walks in from the left, says hello, then runs
   across the page and hops into the chat button, which opens the panel.
------------------------------------------------------------------- */
(async function playIntro() {
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const greeter = document.getElementById('greeter');
    const bubble = document.getElementById('greeter-bubble');
    const runner = document.getElementById('character-full');
    const GREETING = "Hi! How are you? Ask me anything about my work.";

    const openChat = () => {
        chatbotPopup.classList.remove('hidden');
        chatbotPopup.classList.add('opening');
        setTimeout(() => chatbotPopup.classList.remove('opening'), 400);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        Avatar.greet(GREETING);
    };

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!greeter || !runner || reducedMotion || typeof greeter.animate !== 'function') {
        await wait(600);
        openChat();
        return;
    }

    // If the visitor opens the chat themselves, get out of the way.
    let cancelled = false;
    const bailOut = () => {
        cancelled = true;
        runner.classList.remove('running', 'waving');
        greeter.style.display = 'none';
    };
    chatbotToggle.addEventListener('click', bailOut, { once: true });

    if (document.readyState !== 'complete') {
        await new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
    }

    // Whatever happens to the animation — a stalled frame loop, a tab that is
    // never looked at, an environment that always reports itself hidden — the
    // visitor still ends up with a working chat panel.
    let finished = false;
    const watchdog = setTimeout(() => {
        if (finished) return;
        cancelled = true;
        greeter.style.display = 'none';
        document.getElementById('web-strand').style.opacity = '0';
        document.getElementById('web-anchor').style.opacity = '0';
        openChat();
    }, 14000);

    // requestAnimationFrame never fires in a background tab, which would strand
    // him mid-swing. Wait until the page is actually being looked at.
    if (document.hidden) {
        await new Promise(resolve => {
            const onVisible = () => {
                if (document.hidden) return;
                document.removeEventListener('visibilitychange', onVisible);
                resolve();
            };
            document.addEventListener('visibilitychange', onVisible);
        });
    }
    if (cancelled) return;

    await wait(500);
    if (cancelled) return;

    // Stand him in the bottom-left so he never covers the hero content, and so
    // the run across to the chat button reads as crossing the page.
    const size = greeter.getBoundingClientRect();
    greeter.style.left = Math.max(16, window.innerWidth * 0.08) + 'px';
    greeter.style.top = Math.max(20, window.innerHeight - size.height - 28) + 'px';

    // 1. walk in
    runner.classList.add('running');
    const played = (animation) => animation.finished.catch(() => { cancelled = true; });

    const walkIn = greeter.animate([
        { transform: 'translateX(-180px) scale(0.9)', opacity: 0 },
        { transform: 'translateX(0) scale(1)', opacity: 1 }
    ], { duration: 950, easing: 'cubic-bezier(.2,.7,.3,1)', fill: 'forwards' });
    await played(walkIn);
    if (cancelled) return;

    // A filling animation outranks inline styles, so hand control back to the
    // stylesheet before the swing starts writing transforms frame by frame.
    try { walkIn.commitStyles(); } catch (e) { /* not critical */ }
    walkIn.cancel();

    // 2. stop, wave, say hello
    runner.classList.remove('running');
    runner.classList.add('waving');
    bubble.classList.add('show');
    await wait(2300);
    if (cancelled) return;
    bubble.classList.remove('show');
    runner.classList.remove('waving');
    await wait(300);
    if (cancelled) return;

    // 3. web-swing across to the chat button
    const strand = document.getElementById('web-strand');
    const anchorDot = document.getElementById('web-anchor');
    const target = chatbotToggle.getBoundingClientRect();
    const from = greeter.getBoundingClientRect();

    const origin = { x: from.left + from.width / 2, y: from.top + from.height / 2 };
    const goal = { x: target.left + target.width / 2, y: target.top + target.height / 2 };
    // anchor the web overhead and ahead of him, so the swing carries him forward
    const anchor = { x: (origin.x + goal.x) / 2 + 60, y: Math.max(40, origin.y - 320) };

    // hand position in page coordinates, for drawing the strand
    const handAt = () => {
        const box = greeter.getBoundingClientRect();
        return { x: box.left + box.width * 0.82, y: box.top + box.height * 0.20 };
    };

    const drawStrand = (hand, progress) => {
        const tipX = hand.x + (anchor.x - hand.x) * progress;
        const tipY = hand.y + (anchor.y - hand.y) * progress;
        // a little sag, so it behaves like a line under tension rather than a laser
        const sag = 14 * (1 - progress);
        strand.setAttribute('d', `M${hand.x} ${hand.y} Q${(hand.x + tipX) / 2} ${(hand.y + tipY) / 2 + sag} ${tipX} ${tipY}`);
    };

    const frames = (duration, onFrame) => new Promise(resolve => {
        const startedAt = performance.now();
        let done = false;
        const finish = () => { if (!done) { done = true; resolve(); } };
        const step = (now) => {
            const t = Math.min(1, (now - startedAt) / duration);
            onFrame(t);
            if (t < 1 && !cancelled) requestAnimationFrame(step); else finish();
        };
        requestAnimationFrame(step);
        setTimeout(finish, duration + 1500);   // rAF stalls if the tab goes hidden
    });

    const place = (x, y, deg, scale) => {
        greeter.style.transform =
            `translate(${x - origin.x}px, ${y - origin.y}px) rotate(${deg}deg) scale(${scale})`;
    };
    greeter.style.transformOrigin = '50% 20%';   // he hangs from the hand, not the feet

    // 3a. wind up and fire the web
    runner.classList.remove('running');
    runner.classList.add('shooting');
    await wait(220);
    if (cancelled) return;

    strand.style.opacity = '1';
    await frames(200, (t) => drawStrand(handAt(), t));
    if (cancelled) return;

    anchorDot.setAttribute('cx', anchor.x);
    anchorDot.setAttribute('cy', anchor.y);
    anchorDot.setAttribute('r', 5);
    anchorDot.style.opacity = '0.9';

    // 3b. swing: a pendulum about the anchor, fastest at the bottom of the arc
    runner.classList.remove('shooting');
    runner.classList.add('swinging');

    const ropeLength = Math.hypot(origin.x - anchor.x, origin.y - anchor.y);
    const theta0 = Math.atan2(origin.x - anchor.x, origin.y - anchor.y);
    const theta1 = -theta0 * 0.9;
    const SWING_MS = 900;
    let release = { x: origin.x, y: origin.y, vx: 0, vy: 0 };

    await frames(SWING_MS, (t) => {
        // theta0 -> theta1 following cosine easing, which is how a pendulum moves
        const theta = theta1 + (theta0 - theta1) * (Math.cos(Math.PI * t) + 1) / 2;
        const x = anchor.x + ropeLength * Math.sin(theta);
        const y = anchor.y + ropeLength * Math.cos(theta);
        // angular velocity -> tangential velocity, kept for the release
        const omega = (theta0 - theta1) * Math.PI * Math.sin(Math.PI * t) / (2 * SWING_MS / 1000);
        release = { x, y, vx: ropeLength * Math.cos(theta) * -omega, vy: ropeLength * Math.sin(theta) * omega };
        place(x, y, theta * 180 / Math.PI, 1);
        drawStrand(handAt(), 1);
    });
    if (cancelled) return;

    // 3c. let go — solve the arc so gravity lands him exactly on the button
    runner.classList.remove('swinging');
    runner.classList.add('diving');
    strand.style.opacity = '0';
    anchorDot.style.opacity = '0';

    const FLIGHT = 0.62;                 // seconds
    const GRAVITY = 2400;                // px/s²
    const vx = (goal.x - release.x) / FLIGHT;
    const vy = (goal.y - release.y) / FLIGHT - 0.5 * GRAVITY * FLIGHT;

    await frames(FLIGHT * 1000, (t) => {
        const time = t * FLIGHT;
        const x = release.x + vx * time;
        const y = release.y + vy * time + 0.5 * GRAVITY * time * time;
        // face the direction of travel
        const angle = Math.atan2(vy + GRAVITY * time, vx) * 180 / Math.PI;
        place(x, y, angle * 0.35, 1 - 0.92 * Math.pow(t, 2.2));
    });
    if (cancelled) return;

    greeter.style.display = 'none';
    finished = true;
    clearTimeout(watchdog);

    // 4. the button takes the hit, then the panel grows out of it
    chatbotToggle.animate([
        { transform: 'scale(1)' },
        { transform: 'scale(1.35)' },
        { transform: 'scale(0.92)' },
        { transform: 'scale(1)' }
    ], { duration: 520, easing: 'cubic-bezier(.34,1.56,.64,1)' });

    await wait(200);
    openChat();
})();

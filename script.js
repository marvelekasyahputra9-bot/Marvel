// ============ PARTICLE CANVAS ============
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let canvasW, canvasH;

function resizeCanvas() {
    canvasW = canvas.width = window.innerWidth;
    canvasH = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvasW;
        this.y = Math.random() * canvasH;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseOffset = Math.random() * Math.PI * 2;
    }
    update(time) {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < -20) this.x = canvasW + 20;
        if (this.x > canvasW + 20) this.x = -20;
        if (this.y < -20) this.y = canvasH + 20;
        if (this.y > canvasH + 20) this.y = -20;
        this.currentOpacity = this.opacity + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.25;
        this.currentOpacity = Math.max(0.05, Math.min(0.9, this.currentOpacity));
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 85, 247, ${this.currentOpacity})`;
        ctx.fill();
        // Glow
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 63, 207, ${this.currentOpacity * 0.25})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(Math.floor((canvasW * canvasH) / 12000), 150);
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}
initParticles();

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 130) {
                const opacity = (1 - dist / 130) * 0.2;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(168, 85, 247, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

let animationTime = 0;
function animateParticles(timestamp) {
    animationTime = timestamp;
    ctx.clearRect(0, 0, canvasW, canvasH);
    particles.forEach(p => {
        p.update(timestamp);
        p.draw();
    });
    connectParticles();
    requestAnimationFrame(animateParticles);
}
requestAnimationFrame(animateParticles);

// ============ POPUP MENU LOGIC ============
const hamburger = document.getElementById('hamburger');
const menuOverlay = document.getElementById('menuOverlay');
const navbar = document.getElementById('navbar');
let menuOpen = false;

function openMenu() {
    menuOpen = true;
    hamburger.classList.add('active');
    menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    menuOpen = false;
    hamburger.classList.remove('active');
    menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
    if (menuOpen) {
        closeMenu();
    } else {
        openMenu();
    }
});

// Close menu when clicking overlay background (but not on links)
menuOverlay.addEventListener('click', (e) => {
    if (e.target === menuOverlay) {
        closeMenu();
    }
});

// Close with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) {
        closeMenu();
    }
});

// ============ NAVBAR SCROLL EFFECT ============
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============ SMOOTH SCROLL HELPER ============
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ============ CONTACT FORM HANDLER ============
function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = '✅ Pesan Terkirim!';
    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = 'linear-gradient(135deg, var(--purple-2), var(--purple-1))';
        form.reset();
    }, 2500);
    return false;
}

// ============ ANIMATE STAT NUMBERS ON SCROLL ============
function animateStats() {
    const statCards = document.querySelectorAll('.stat-number');
    statCards.forEach(card => {
        const target = parseInt(card.getAttribute('data-target'));
        const rect = card.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH - 80 && rect.bottom > 0) {
            if (!card.dataset.animated) {
                card.dataset.animated = 'true';
                animateNumber(card, 0, target, 1800);
            }
        }
    });
}

function animateNumber(el, start, end, duration) {
    const startTime = performance.now();
    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * eased);
        el.textContent = current.toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = end.toLocaleString();
        }
    }
    requestAnimationFrame(update);
}

// ============ ANIMATE SKILL BARS ON SCROLL ============
function animateSkillBars() {
    const bars = document.querySelectorAll('.bar-fill');
    bars.forEach(bar => {
        const rect = bar.getBoundingClientRect();
        const windowH = window.innerHeight;
        if (rect.top < windowH - 50 && rect.bottom > 0) {
            if (!bar.dataset.animated) {
                bar.dataset.animated = 'true';
                const targetWidth = bar.getAttribute('data-width');
                setTimeout(() => {
                    bar.style.width = targetWidth + '%';
                }, 200);
            }
        }
    });
}

// ============ SCROLL LISTENER FOR ANIMATIONS ============
let scrollTicking = false;
window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            animateStats();
            animateSkillBars();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

// Initial check
setTimeout(() => {
    animateStats();
    animateSkillBars();
}, 400);

// ============ CLICK RIPPLE ON CARDS ============
document.querySelectorAll('.project-card, .stat-card').forEach(card => {
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(168, 85, 247, 0.4);
            width: 60px;
            height: 60px;
            left: ${e.clientX - this.getBoundingClientRect().left - 30}px;
            top: ${e.clientY - this.getBoundingClientRect().top - 30}px;
            pointer-events: none;
            animation: rippleAnim 0.7s ease-out forwards;
            z-index: 5;
        `;
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
    });
});

// Add ripple animation style dynamically
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleAnim {
        from { transform: scale(0); opacity: 1; }
        to { transform: scale(8); opacity: 0; }
    }
`;
document.head.appendChild(rippleStyle);

console.log('🚀 Portofolio modern siap! Semua fitur aktif.');
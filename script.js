// --- 1. DATA ---
const portfolioData = [
    { type: "BLOG", title: "Storm Systems", description: "Procedural weather generation.", image: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800&q=80" },
    { type: "PHOTOGRAPHY", title: "Monsoon", description: "Streets of Mumbai.", image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80" },
    { type: "BLOG", title: "Liquid UI", description: "Fluid animations in CSS.", image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80" },
    { type: "PHOTOGRAPHY", title: "Reflections", description: "Puddles and neon lights.", image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80" }
];

// --- 2. AUDIO & MENU LOGIC ---
const soundBtn = document.getElementById('sound-toggle');
const audio = document.getElementById('rain-audio');
let isMuted = true;

if(soundBtn && audio) {
    soundBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if(!isMuted) {
            audio.play();
            soundBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        } else {
            audio.pause();
            soundBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        }
    });
}

// Menu Toggle (Works everywhere)
const menuBtn = document.getElementById('menu-toggle-btn');
const menuOverlay = document.getElementById('menu-overlay');

if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.toggle('active');
        menuBtn.innerText = menuOverlay.classList.contains('active') ? "CLOSE" : "MENU";
    });
    
    // Auto-Close on link click
    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            menuBtn.innerText = "MENU";
        });
    });
}

// --- 3. THREE.JS RAIN SYSTEM ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('canvas-container');
if(container) container.appendChild(renderer.domElement);

camera.position.z = 20;
camera.position.y = 5;

// STAGE
const stageGeo = new THREE.CylinderGeometry(8, 8, 0.2, 64);
const stageMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.8 });
const stage = new THREE.Mesh(stageGeo, stageMat);
stage.position.y = -5;
scene.add(stage);

const spotLight = new THREE.SpotLight(0x4facfe, 10);
spotLight.position.set(0, 20, 0);
spotLight.penumbra = 0.5;
scene.add(spotLight);

// RAIN PARTICLES
const rainGeo = new THREE.BufferGeometry();
const rainCount = 4000;
const posArray = new Float32Array(rainCount * 3);
const velocityArray = new Float32Array(rainCount); // Fall speed

for(let i = 0; i < rainCount * 3; i+=3) {
    posArray[i] = (Math.random() - 0.5) * 60; // X spread
    posArray[i+1] = Math.random() * 40 - 10; // Y height
    posArray[i+2] = (Math.random() - 0.5) * 60; // Z depth
    
    velocityArray[i/3] = 0.5 + Math.random() * 0.5; // Random speed
}

rainGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const rainMat = new THREE.PointsMaterial({
    color: 0xaaaaaa,
    size: 0.1,
    transparent: true,
    opacity: 0.8
});
const rainSystem = new THREE.Points(rainGeo, rainMat);
scene.add(rainSystem);

// ANIMATION LOOP
let lastScrollY = window.scrollY;

function animate() {
    requestAnimationFrame(animate);

    // Rotate Stage
    stage.rotation.y += 0.002;

    // RAIN FALL LOGIC
    const positions = rainSystem.geometry.attributes.position.array;
    for(let i = 1; i < rainCount * 3; i+=3) {
        positions[i] -= velocityArray[Math.floor(i/3)]; // Move down Y axis
        
        // Reset to top if it falls below stage
        if (positions[i] < -10) {
            positions[i] = 30;
        }
    }
    rainSystem.geometry.attributes.position.needsUpdate = true;

    // CAMERA MOVEMENT
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (5 + mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}

// MOUSE & SCROLL HANDLING
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});

// "RAIN HITTING SCREEN" ON SCROLL UP
window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    const overlay = document.getElementById('rain-overlay');
    
    if (currentScroll < lastScrollY && overlay) {
        // Scrolling UP -> Show Drops
        overlay.style.opacity = '0.4';
    } else if (overlay) {
        // Scrolling DOWN -> Hide Drops
        overlay.style.opacity = '0';
    }
    
    lastScrollY = currentScroll;
});

animate();

// --- 4. LOGO SHRINK ANIMATION ---
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    const logo = document.querySelector(".logo-container");
    if(logo) {
        gsap.to(".logo-container", {
            top: "40px",
            left: "50px",
            xPercent: 0, yPercent: 0,
            scale: 0.3, 
            transformOrigin: "top left",
            scrollTrigger: {
                trigger: "body", start: "top top", end: "300px top", scrub: 1
            }
        });
    }
}

// --- 5. PAGE GENERATOR (Blogs/Photos) ---
const feedContainer = document.querySelector('.scroll-container');
const isHomePage = document.querySelector('.logo-container');

if (!isHomePage) {
    // Inject Header with Home Button (Not overlapping)
    const header = document.createElement('nav');
    header.className = 'nav-header';
    header.innerHTML = `
        <a href="index.html" class="back-btn-large">← HOME</a>
        <h2 style="font-family:'Syne'; font-size:1.5rem; margin:0; color:white;">ARCHIVE</h2>
    `;
    document.body.prepend(header);

    // Inject Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'feed-container';
    
    let pageType = window.location.pathname.includes("blogs") ? "BLOG" : "PHOTOGRAPHY";
    const items = portfolioData.filter(item => item.type === pageType);

    items.forEach(item => {
        const article = document.createElement('article');
        article.className = 'content-item';
        article.innerHTML = `
            <div class="content-text">
                <span style="color:#666;">0${Math.floor(Math.random()*9)}</span>
                <h2 class="item-title">${item.title}</h2>
                <p>${item.description}</p>
            </div>
            <div class="content-visual">
                <img src="${item.image}" alt="${item.title}" class="content-img">
            </div>
        `;
        contentDiv.appendChild(article);
    });
    
    if(feedContainer) feedContainer.appendChild(contentDiv);

    // Animate
    setTimeout(() => {
        if(typeof gsap !== 'undefined') {
            gsap.utils.toArray('.content-item').forEach(item => {
                gsap.to(item, {
                    opacity: 1, y: 0, duration: 1, 
                    scrollTrigger: { trigger: item, start: "top 80%" }
                });
            });
        }
    }, 100);
}

// Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

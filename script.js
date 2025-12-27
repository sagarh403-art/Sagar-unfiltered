// --- 1. CONFIGURATION & DATA ---
const portfolioData = [
    {
        type: "BLOG",
        title: "The Void Design",
        description: "Why empty space is the most important element.",
        image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80"
    },
    {
        type: "PHOTOGRAPHY",
        title: "Tokyo Drift",
        description: "Night photography in Shinjuku.",
        image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80"
    },
    {
        type: "BLOG",
        title: "WebGL Performance",
        description: "Optimizing three.js for mobile devices.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80"
    },
    {
        type: "PHOTOGRAPHY",
        title: "Neon Cyberpunk",
        description: "Portrait sessions in low light.",
        image: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80"
    }
];

// --- 2. THREE.JS SCENE (THE DARK STAGE) ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1a1a1a, 0.03); // Blend into darkness

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
const container = document.getElementById('canvas-container');
if(container) container.appendChild(renderer.domElement);

camera.position.z = 10;
camera.position.y = 1;

// THE STAGE
const stageGeo = new THREE.CylinderGeometry(6, 6, 0.2, 64);
const stageMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.1, metalness: 0.8 });
const stage = new THREE.Mesh(stageGeo, stageMat);
stage.position.y = -3;
scene.add(stage);

// SPOTLIGHTS
const spotLight = new THREE.SpotLight(0xffffff, 15);
spotLight.position.set(0, 10, 0);
spotLight.angle = 0.5;
spotLight.penumbra = 0.5;
scene.add(spotLight);

// SAND PARTICLES
const sandGeo = new THREE.BufferGeometry();
const sandCount = 1000;
const posArray = new Float32Array(sandCount * 3);
for(let i = 0; i < sandCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 30;
}
sandGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const sandMat = new THREE.PointsMaterial({ size: 0.1, color: 0x888888, transparent: true, opacity: 0.5 });
const sandSystem = new THREE.Points(sandGeo, sandMat);
scene.add(sandSystem);

// ANIMATION LOOP
let scrollY = 0;
let mouseX = 0;
let mouseY = 0;

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate stage
    stage.rotation.y += 0.002;
    
    // Sand floats up
    const time = Date.now() * 0.0005;
    sandSystem.position.y = (scrollY * 0.005) + Math.sin(time) * 0.2;
    
    // Camera Parallax
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (1 + mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
}
animate();

// --- 3. SCROLL & LOGO SHRINK (GSAP) ---
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Only animate logo on Home Page
    const logo = document.querySelector(".logo-container");
    if(logo) {
        gsap.to(".logo-container", {
            top: "40px",
            left: "50px",
            xPercent: 0, 
            yPercent: 0,
            scale: 0.2, 
            transformOrigin: "top left",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "300px top",
                scrub: 1
            }
        });
    }
}

// --- 4. MENU LOGIC (Fixed) ---
const menuBtn = document.getElementById('menu-toggle-btn');
const menuOverlay = document.getElementById('menu-overlay');
const menuLinks = document.querySelectorAll('.menu-item');

if (menuBtn && menuOverlay) {
    // Open/Close
    menuBtn.addEventListener('click', () => {
        const isActive = menuOverlay.classList.contains('active');
        if (isActive) {
            menuOverlay.classList.remove('active');
            menuBtn.innerText = "MENU";
        } else {
            menuOverlay.classList.add('active');
            menuBtn.innerText = "CLOSE";
        }
    });

    // Close on link click
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            menuBtn.innerText = "MENU";
        });
    });

    // Auto-Strikethrough
    const currentPath = window.location.pathname;
    menuLinks.forEach(link => {
        link.classList.remove('active-link');
        const linkText = link.innerText;
        
        if (currentPath.includes("blogs.html") && linkText === "BLOGS") link.classList.add('active-link');
        else if (currentPath.includes("photography.html") && linkText === "PHOTOS") link.classList.add('active-link');
        else if ((currentPath === "/" || currentPath.includes("index.html")) && linkText === "HOME") link.classList.add('active-link');
    });
}

// --- 5. PAGE GENERATOR (Blogs/Photos) ---
const feedContainer = document.querySelector('.scroll-container'); // Re-using main for blogs

// Check if we are on a blog/photo page (if .logo-container is missing, we assume content page)
const isHomePage = document.querySelector('.logo-container');

if (!isHomePage) {
    // 1. Inject Big Back Button
    const header = document.createElement('nav');
    header.className = 'nav-header';
    header.innerHTML = `
        <a href="index.html" class="back-btn-large">← HOME</a>
        <h2 style="font-size:1.5rem; margin:0;">ARCHIVE</h2>
    `;
    document.body.prepend(header);

    // 2. Inject Content
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

    // 3. Animate Items
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

// Listeners
window.addEventListener('scroll', () => scrollY = window.scrollY);
window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
});
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

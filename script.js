// --- PART 1: YOUR DATA (EDIT THIS TO ADD BLOGS/PHOTOS) ---
// Note: Put your images in an 'assets' folder locally!
// For now, I am using placeholder URLs so you can see it working immediately.

const portfolioData = [
    {
        type: "BLOG",
        title: "The Chrono Debt",
        description: "A sci-fi exploration of time currency and the human cost of eternal life.",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&q=80" // Replace with "assets/my-story.jpg"
    },
    {
        type: "PHOTOGRAPHY",
        title: "Neon Nights",
        description: "Captured at 3AM in the heart of Bengaluru. Sony A7III, 35mm.",
        image: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80" // Replace with "assets/photo1.jpg"
    },
    {
        type: "BLOG",
        title: "Minimalism in WebGL",
        description: "How to create high-performance 3D websites without sacrificing aesthetics.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80"
    },
    {
        type: "PHOTOGRAPHY",
        title: "Urban Decay",
        description: "The contrast between nature and concrete structures.",
        image: "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80"
    }
];

// --- PART 2: GENERATE CONTENT (ZIG-ZAG LAYOUT) ---
const feedContainer = document.getElementById('content-feed');

portfolioData.forEach(item => {
    // Create the HTML for each item
    const article = document.createElement('article');
    article.className = 'content-item';
    
    article.innerHTML = `
        <div class="content-text">
            <span class="category-tag">${item.type}</span>
            <h2 class="item-title">${item.title}</h2>
            <p class="item-desc">${item.description}</p>
        </div>
        <div class="content-visual">
            <img src="${item.image}" alt="${item.title}" class="content-img">
        </div>
    `;
    
    feedContainer.appendChild(article);
});

// --- PART 3: ANIMATE ON SCROLL (GSAP) ---
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray('.content-item').forEach(item => {
    gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
            trigger: item,
            start: "top 80%", // Animation starts when item is 80% down the screen
            toggleActions: "play none none reverse"
        }
    });
});

// --- PART 4: THE 3D "FACE" MODEL ---
// Since we don't have your .glb file, we use a "Wireframe Head" aesthetic
// which looks very Lando Norris / Iron Man HUD style.

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Create a complex shape to represent the "Head"
const geometry = new THREE.IcosahedronGeometry(2, 4); // High detail sphere
const material = new THREE.MeshNormalMaterial({ wireframe: true });
const headShape = new THREE.Mesh(geometry, material);

scene.add(headShape);
camera.position.z = 5;

// MOUSE INTERACTION (The "Wrapping" Effect)
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);

    // Rotate slowly
    headShape.rotation.y += 0.003;
    headShape.rotation.x += 0.001;

    // "Look" at the mouse (The Lando Effect)
    headShape.rotation.x += mouseY * 0.05;
    headShape.rotation.y += mouseX * 0.05;

    // Pulse Effect (Breathing)
    const time = Date.now() * 0.001;
    headShape.scale.setScalar(1 + Math.sin(time) * 0.05);

    renderer.render(scene, camera);
}

animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

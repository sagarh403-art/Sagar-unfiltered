// --- 1. YOUR DATA ---
// Update the 'image' paths to match your assets folder!
const portfolioData = [
    {
        type: "BLOG",
        title: "The Chrono Debt",
        description: "A sci-fi exploration of time currency and the human cost of eternal life.",
        image: "assets/blog1.jpg" // CHANGE THIS to your local file name
    },
    {
        type: "PHOTOGRAPHY",
        title: "Neon Nights",
        description: "Captured at 3AM in the heart of Bengaluru. Sony A7III, 35mm.",
        image: "assets/photo1.jpg" // CHANGE THIS
    },
    {
        type: "BLOG",
        title: "Minimalism in WebGL",
        description: "How to create high-performance 3D websites without sacrificing aesthetics.",
        image: "assets/blog2.jpg" // CHANGE THIS
    },
    {
        type: "PHOTOGRAPHY",
        title: "Urban Decay",
        description: "The contrast between nature and concrete structures.",
        image: "assets/photo2.jpg" // CHANGE THIS
    }
];

// --- 2. DETECT PAGE & RENDER ---
const path = window.location.pathname;
const feedContainer = document.getElementById('content-feed');

if (feedContainer) {
    // Filter data based on page name
    let pageType = "";
    if (path.includes("blogs.html")) pageType = "BLOG";
    if (path.includes("photography.html")) pageType = "PHOTOGRAPHY";

    // Generate HTML
    const itemsToShow = portfolioData.filter(item => item.type === pageType);
    
    itemsToShow.forEach(item => {
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

    // Animate the items (GSAP)
    if(typeof gsap !== 'undefined') {
        gsap.utils.toArray('.content-item').forEach(item => {
            gsap.to(item, {
                opacity: 1, y: 0, duration: 1, ease: "power3.out",
                scrollTrigger: { trigger: item, start: "top 80%" }
            });
        });
    }
}

// --- 3. THE 3D BACKGROUND (Shared across all pages) ---
// This renders the "Wireframe Head"
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
const canvasContainer = document.getElementById('canvas-container');
if(canvasContainer) canvasContainer.appendChild(renderer.domElement);

// The Geometry (Head Placeholder)
const geometry = new THREE.IcosahedronGeometry(2, 2);
const material = new THREE.MeshNormalMaterial({ wireframe: true });
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

camera.position.z = 5;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    shape.rotation.y += 0.002;
    shape.rotation.x += 0.001;
    renderer.render(scene, camera);
}
animate();

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

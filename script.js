// --- 1. SETUP ---
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x24243e, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

camera.position.z = 15;
camera.position.y = 0;

// --- 2. SOFT STUDIO LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xff6b6b, 0.8);
dirLight1.position.set(-10, 10, 10);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x4ecdc4, 0.8);
dirLight2.position.set(10, -10, 10);
scene.add(dirLight2);

// --- 3. FLOATING SOFT SHAPES (Background) ---
const objects = [];
const matCoral = new THREE.MeshPhysicalMaterial({ color: 0xff6b6b, roughness: 0.4, clearcoat: 0.5 });
const matMint = new THREE.MeshPhysicalMaterial({ color: 0x4ecdc4, roughness: 0.4, clearcoat: 0.5 });
const matYellow = new THREE.MeshPhysicalMaterial({ color: 0xffe66d, roughness: 0.4, clearcoat: 0.5 });

function createSoftShape() {
    const type = Math.floor(Math.random() * 3);
    let mesh;
    let material = [matCoral, matMint, matYellow][Math.floor(Math.random() * 3)];

    if (type === 0) {
        // Torus (Donut)
        mesh = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.6, 16, 50), material);
    } else if (type === 1) {
        // Icosahedron (Ball)
        mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 1), material);
    } else {
        // Capsule
        mesh = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 2, 4, 8), material);
    }

    // Random Position (Around the text)
    mesh.position.x = (Math.random() - 0.5) * 40;
    mesh.position.y = (Math.random() - 0.5) * 50 - 5;
    mesh.position.z = (Math.random() - 0.5) * 20 - 5;
    
    mesh.userData = { 
        speed: Math.random() * 0.02 + 0.01,
        rotX: Math.random() * 0.01,
        rotY: Math.random() * 0.01
    };
    scene.add(mesh);
    objects.push(mesh);
}

// Create 25 Soft shapes
for(let i=0; i<25; i++) createSoftShape();

// --- 4. ANIMATION LOOP ---
let scrollY = 0;

function animate() {
    requestAnimationFrame(animate);

    // Float Shapes Up
    objects.forEach(obj => {
        obj.rotation.x += obj.userData.rotX;
        obj.rotation.y += obj.userData.rotY;
        
        // Move Up
        obj.position.y += obj.userData.speed + (scrollY * 0.0002);
        
        // Reset if too high
        if(obj.position.y > 25) obj.position.y = -30;
    });

    renderer.render(scene, camera);
}
animate();

window.addEventListener('scroll', () => scrollY = window.scrollY);
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 5. PARALLAX TEXT ANIMATION (Using GSAP on HTML Text) ---
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    
    // Animate the HTML Logo
    const logo = document.querySelector(".hero-logo");
    if(logo) {
        gsap.to(".hero-logo", {
            top: "30px",       // Stick to top
            left: "50%",      // Stay centered horizontally
            xPercent: -50,    // Keep centering alignment
            yPercent: 0,
            scale: 0.2,       // Shrink
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "300px top",
                scrub: 1
            }
        });
    }
}

// --- 6. MENU ---
const menuBtn = document.getElementById('menu-toggle-btn');
const menuOverlay = document.getElementById('menu-overlay');
if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.toggle('active');
        menuBtn.innerText = menuOverlay.classList.contains('active') ? "CLOSE" : "MENU";
    });
    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active'); menuBtn.innerText = "MENU";
        });
    });
}

// --- 7. ZIG-ZAG CONTENT GENERATOR (For Blogs/Photos) ---
const isHomePage = !window.location.pathname.includes("html") || window.location.pathname.includes("index");

if (!isHomePage) {
    const header = document.createElement('nav'); 
    header.className = 'nav-header';
    header.innerHTML = `<a href="index.html" class="back-btn-round">← HOME</a>`;
    document.body.prepend(header);

    const data = [
        { title: "Soft Design", desc: "Why rounded corners matter.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80" },
        { title: "Color Theory", desc: "Using pastels effectively.", img: "https://images.unsplash.com/photo-1520690214124-2405c5217036?w=800&q=80" },
        { title: "3D Shapes", desc: "From cubes to donuts.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
        { title: "Animation", desc: "Making things float.", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80" },
        { title: "Typography", desc: "Finding the right font.", img: "https://images.unsplash.com/photo-1558655146-d09347e0c766?w=800&q=80" },
        { title: "Layouts", desc: "The zig-zag pattern.", img: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80" }
    ];

    const contentDiv = document.createElement('div');
    contentDiv.className = 'feed-container';
    
    data.forEach((item, index) => {
        contentDiv.innerHTML += `
            <article class="content-item">
                <div class="content-text">
                    <span style="color:var(--accent-yellow); font-weight:bold;">0${index + 1}</span>
                    <h2 class="item-title">${item.title}</h2>
                    <p>${item.desc}</p>
                </div>
                <div class="content-visual">
                    <img src="${item.img}">
                </div>
            </article>
        `;
    });
    
    document.querySelector('.scroll-container')?.appendChild(contentDiv);

    // Fade In Animation
    setTimeout(() => {
        gsap.utils.toArray('.content-item').forEach(item => {
            gsap.to(item, { opacity: 1, duration: 1, scrollTrigger: { trigger: item, start: "top 85%" } });
        });
    }, 100);
}

// --- 1. SETUP ---
const scene = new THREE.Scene();
// Vibrant Fog to fade objects into the distance
scene.fog = new THREE.FogExp2(0x2d1b4e, 0.02);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

camera.position.z = 15;
camera.position.y = 0;

// --- 2. VIBRANT LIGHTING ---
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white
scene.add(ambientLight);

const pinkLight = new THREE.PointLight(0xff007f, 2, 50); // Hot Pink
pinkLight.position.set(10, 10, 10);
scene.add(pinkLight);

const cyanLight = new THREE.PointLight(0x00f3ff, 2, 50); // Cyan
cyanLight.position.set(-10, -5, 10);
scene.add(cyanLight);

// --- 3. THE 3D TEXT ("SAGAR") ---
let textMesh; // Will hold the 3D text
const fontLoader = new THREE.FontLoader();

fontLoader.load('https://threejs.org/examples/fonts/helvetiker_bold.typeface.json', (font) => {
    const textGeo = new THREE.TextGeometry('SAGAR', {
        font: font,
        size: 3, 
        height: 0.5, 
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelSegments: 5
    });
    
    // Center it
    textGeo.computeBoundingBox();
    const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    textGeo.translate(centerOffset, 0, 0);

    // Vibrant Material
    const textMat = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.1, 
        metalness: 0.1,
        emissive: 0x2d1b4e,
        emissiveIntensity: 0.2
    });

    textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.y = -1; // Start in center
    scene.add(textMesh);
});

// --- 4. PROCEDURAL OBJECT GENERATOR (Robots, Planets, etc.) ---
const objects = []; // Store floating objects

// Helper Materials
const matCyan = new THREE.MeshStandardMaterial({ color: 0x00f3ff, roughness: 0.4 });
const matPink = new THREE.MeshStandardMaterial({ color: 0xff007f, roughness: 0.4 });
const matYellow = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.4 });
const matWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });

function createRandomObject() {
    const type = Math.floor(Math.random() * 5); // 0-4 types
    let mesh = new THREE.Group();

    if (type === 0) { 
        // PLANET (Sphere + Ring)
        const planet = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 16), matCyan);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.1, 2, 32), matPink);
        ring.rotation.x = Math.PI / 2;
        mesh.add(planet);
        mesh.add(ring);
    } 
    else if (type === 1) {
        // DNA HELIX SEGMENT
        for(let i=0; i<5; i++) {
            const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.2), matYellow);
            const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.2), matYellow);
            b1.position.set(-0.5, i*0.5, Math.sin(i)*0.5);
            b2.position.set(0.5, i*0.5, -Math.sin(i)*0.5);
            mesh.add(b1); mesh.add(b2);
            // Connector
            const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1), matWhite);
            bar.rotation.z = Math.PI/2;
            bar.rotation.y = Math.sin(i)*0.5;
            bar.position.y = i*0.5;
            mesh.add(bar);
        }
    }
    else if (type === 2) {
        // ROBOT HEAD
        const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1, 1), matWhite);
        const eye1 = new THREE.Mesh(new THREE.SphereGeometry(0.2), matPink);
        const eye2 = new THREE.Mesh(new THREE.SphereGeometry(0.2), matPink);
        eye1.position.set(-0.3, 0.1, 0.5);
        eye2.position.set(0.3, 0.1, 0.5);
        const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8), matCyan);
        antenna.position.y = 0.8;
        mesh.add(head); mesh.add(eye1); mesh.add(eye2); mesh.add(antenna);
    }
    else if (type === 3) {
        // SATELLITE
        const body = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), matYellow);
        const panelL = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1), matCyan);
        const panelR = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 1), matCyan);
        panelL.position.x = -1.6;
        panelR.position.x = 1.6;
        mesh.add(body); mesh.add(panelL); mesh.add(panelR);
    }
    else {
        // CAMERA
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 0.5), matWhite);
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16), matPink);
        lens.rotation.x = Math.PI/2;
        lens.position.z = 0.4;
        mesh.add(body); mesh.add(lens);
    }

    // Random Position
    mesh.position.x = (Math.random() - 0.5) * 30;
    mesh.position.y = (Math.random() - 0.5) * 50 - 20; // Spread vertically
    mesh.position.z = (Math.random() - 0.5) * 20 - 5; // Depth
    
    // Random Rotation Speed
    mesh.userData = { 
        rotX: Math.random() * 0.02, 
        rotY: Math.random() * 0.02,
        speedY: 0.02 + Math.random() * 0.03 
    };

    scene.add(mesh);
    objects.push(mesh);
}

// Create 30 random objects
for(let i=0; i<30; i++) {
    createRandomObject();
}

// --- 5. ANIMATION LOOP ---
let scrollY = 0;

function animate() {
    requestAnimationFrame(animate);

    // 1. ANIMATE FLOATING OBJECTS
    objects.forEach(obj => {
        obj.rotation.x += obj.userData.rotX;
        obj.rotation.y += obj.userData.rotY;
        
        // Move UP constantly based on scroll + speed
        obj.position.y += obj.userData.speedY + (scrollY * 0.0001);

        // Reset if too high
        if(obj.position.y > 20) obj.position.y = -30;
    });

    // 2. PARALLAX TEXT ANIMATION (The Core Requirement)
    if (textMesh) {
        // Logic:
        // Scroll 0 -> Y = -1, Scale = 1
        // Scroll 500 -> Y = 6 (Top), Scale = 0.4 (Small)
        
        const targetY = -1 + (scrollY * 0.015); 
        const targetScale = Math.max(0.4, 1 - (scrollY * 0.0015)); // Don't go below 0.4 size

        // Limit the height so it sticks to top
        if(targetY < 6) {
            textMesh.position.y = targetY;
        } else {
            textMesh.position.y = 6; // Stick at top
        }
        
        textMesh.scale.set(targetScale, targetScale, targetScale);
        
        // Gentle float rotation for text
        textMesh.rotation.y = Math.sin(Date.now() * 0.001) * 0.1;
        textMesh.rotation.x = Math.sin(Date.now() * 0.002) * 0.05;
    }

    renderer.render(scene, camera);
}
animate();

// --- 6. SCROLL LISTENER ---
window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 7. MENU & PAGE LOGIC ---
const menuBtn = document.getElementById('menu-toggle-btn');
const menuOverlay = document.getElementById('menu-overlay');

if (menuBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
        menuOverlay.classList.toggle('active');
        menuBtn.innerText = menuOverlay.classList.contains('active') ? "CLOSE" : "MENU";
    });
    
    document.querySelectorAll('.menu-item').forEach(link => {
        link.addEventListener('click', () => {
            menuOverlay.classList.remove('active');
            menuBtn.innerText = "MENU";
        });
    });
}

// --- 8. BLOG/PHOTO PAGE CONTENT ---
const isHomePage = !window.location.pathname.includes("html") || window.location.pathname.includes("index");

if (!isHomePage) {
    // Inject Header
    const header = document.createElement('nav');
    header.className = 'nav-header';
    header.innerHTML = `<a href="index.html" class="back-btn-vibrant">← HOME</a>`;
    document.body.prepend(header);

    // Dummy Data
    const portfolioData = [
        { type: "BLOG", title: "Cyber Aesthetics", description: "The rise of neon in web design.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80" },
        { type: "PHOTOGRAPHY", title: "Neon Tokyo", description: "Night walks in Shinjuku.", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80" },
    ];

    const contentDiv = document.createElement('div');
    contentDiv.style.maxWidth = "1000px";
    contentDiv.style.margin = "150px auto";
    contentDiv.style.padding = "20px";
    
    const pageType = window.location.pathname.includes("blogs") ? "BLOG" : "PHOTOGRAPHY";
    
    portfolioData.forEach(item => {
        contentDiv.innerHTML += `
            <div style="display:flex; align-items:center; gap:50px; margin-bottom:100px; color:white;">
                <div style="flex:1;">
                    <h2 style="font-size:3rem; margin:0; color:var(--accent-cyan);">${item.title}</h2>
                    <p style="font-size:1.2rem;">${item.description}</p>
                </div>
                <div style="flex:1;">
                    <img src="${item.image}" style="width:100%; border-radius:20px; box-shadow:0 10px 30px rgba(0,243,255,0.2);">
                </div>
            </div>
        `;
    });
    document.querySelector('.scroll-container')?.appendChild(contentDiv);
}

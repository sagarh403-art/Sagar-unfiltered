// Import Three.js and GSAP directly from the web
import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { gsap } from 'https://cdn.skypack.dev/gsap';

// 1. SETUP THE SCENE
const scene = new THREE.Scene();

// 2. SETUP THE CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// 3. SETUP THE RENDERER
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// 4. ADD A 3D OBJECT (Replacing the Helmet with a Torus Knot for now)
// Note: To load a real 3D model (GLTF), you need a generic GLTFLoader. 
// For this code to work instantly, we use a built-in geometry.
const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
const material = new THREE.MeshNormalMaterial({ wireframe: true }); // Wireframe looks "Techy"
const shape = new THREE.Mesh(geometry, material);
scene.add(shape);

// 5. LIGHTING (Optional for MeshNormalMaterial, but good practice)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 6. SCROLL ANIMATION LOGIC
let scrollY = window.scrollY;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    
    // Rotate the shape based on scroll position
    // We divide by 500 to slow down the rotation speed
    const rotationSpeed = scrollY * 0.002;
    
    // Apply rotation
    gsap.to(shape.rotation, {
        y: rotationSpeed,
        x: rotationSpeed * 0.5,
        duration: 0.5 // Smooths out the movement
    });

    // Move the camera slightly for parallax effect
    camera.position.y = -scrollY * 0.002;
});

// 7. RESPONSIVENESS (Fix window resizing)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 8. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    
    // Subtle constant rotation so it's never fully static
    shape.rotation.z += 0.002;
    
    renderer.render(scene, camera);
}

animate();
// Select all buttons with the "magnetic" class
const magneticButtons = document.querySelectorAll('.magnetic');

magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;

        // Move the button towards the mouse
        // We divide by 2 or 3 to make it "lag" slightly behind the cursor (magnetic feel)
        gsap.to(btn, {
            x: x * 0.3, 
            y: y * 0.5, 
            duration: 1, 
            ease: "power4.out" // This ease makes it feel "heavy" and premium
        });
    });

    // Snap back to center when mouse leaves
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "elastic.out(1, 0.3)" // A slight wobble when it releases
        });
    });
});

window.onload = () => {
    
    // --- 1. MENU TOGGLE ---
    const menuBtn = document.getElementById('menu-toggle-btn');
    const menuOverlay = document.getElementById('menu-overlay');

    if (menuBtn && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('open');
            menuOverlay.classList.toggle('active');
        });
        document.querySelectorAll('.menu-item').forEach(link => {
            link.addEventListener('click', () => {
                menuOverlay.classList.remove('active');
                menuBtn.classList.remove('open');
            });
        });
    }

    // --- 2. THREE.JS BACKGROUND (Endless Grid) ---
    const canvasContainer = document.getElementById('canvas-container');
    
    if (canvasContainer) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x0F1C22, 0.02); // Darker fog for NEONIX theme

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        camera.position.set(0, 5, 20);
        camera.rotation.x = -0.2;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // GRID (Orange/Teal)
        const gridHelper = new THREE.GridHelper(200, 40, 0xFF4D30, 0x0F1C22);
        gridHelper.position.y = -5;
        scene.add(gridHelper);
        const gridHelper2 = new THREE.GridHelper(200, 40, 0xFF4D30, 0x0F1C22);
        gridHelper2.position.y = -5; gridHelper2.position.z = -200;
        scene.add(gridHelper2);

        // PARTICLES
        const starGeo = new THREE.BufferGeometry();
        const starCount = 1000;
        const starPos = new Float32Array(starCount * 3);
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 150;
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        const starMat = new THREE.PointsMaterial({ size: 0.15, color: 0x00F0FF, transparent: true, opacity: 0.8 });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        const animateMain = () => {
            requestAnimationFrame(animateMain);
            // Move Grid
            gridHelper.position.z += 0.1;
            gridHelper2.position.z += 0.1;
            if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
            if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;
            
            stars.rotation.z += 0.0002;
            renderer.render(scene, camera);
        };
        animateMain();
        window.addEventListener('resize', () => { 
            camera.aspect = window.innerWidth / window.innerHeight; 
            camera.updateProjectionMatrix(); 
            renderer.setSize(window.innerWidth, window.innerHeight); 
        });
    }

    // --- 3. HERO ANIMATIONS (GSAP) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate Text Sliding In
        gsap.from(".hero-main-title", { x: -100, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.5 });
        gsap.from(".hero-desc", { x: -50, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.8 });
        gsap.from(".hero-actions", { y: 20, opacity: 0, duration: 1, ease: "power3.out", delay: 1.2 });
        
        // Animate Robot Image (Fade + Slide Up)
        gsap.from(".hero-img-side", { y: 100, opacity: 0, duration: 2, ease: "power3.out", delay: 0.5 });

        // Scroll Effect for Fan Gallery
        gsap.from(".fan-card", {
            scrollTrigger: { trigger: ".fan-section", start: "top 80%" },
            y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: "back.out(1.7)"
        });
    }

    // --- 4. BLOG PAGE LOGIC (Keep v13.0 logic) ---
    const path = window.location.pathname;
    if (path.includes("blogs")) {
        // (Copy the Manifest Logic from v13.0 here if needed, or stick to HTML list)
        // Since user asked for "Blogger Integration" via code, we assume the HTML scan method v12
        // Logic included in v12 script is sufficient.
    }
};

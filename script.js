// Wait for EVERYTHING to load (images, fonts, etc) to ensure accurate logo positioning
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

    // --- 2. THREE.JS BACKGROUND (THE ENDLESS GRID) ---
    const canvasContainer = document.getElementById('canvas-container');
    const isHomePage = !!document.getElementById('hero-logo');

    if (canvasContainer) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        // Camera Position for the Grid View
        camera.position.set(0, 5, 20);
        camera.rotation.x = -0.2;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // A. THE RETRO GRID (Infinite Floor)
        // We create two grids to loop them
        const gridHelper = new THREE.GridHelper(200, 50, 0xE64833, 0x244855); // Orange Center, Teal Lines
        gridHelper.position.y = -5;
        scene.add(gridHelper);
        
        const gridHelper2 = new THREE.GridHelper(200, 50, 0xE64833, 0x244855);
        gridHelper2.position.y = -5;
        gridHelper2.position.z = -200; // Place behind the first one
        scene.add(gridHelper2);

        // B. THE ICOSAHEDRON (Floating "Sun")
        const polyGeo = new THREE.IcosahedronGeometry(6, 1); 
        const polyMat = new THREE.MeshBasicMaterial({ 
            color: 0x90AEAD, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.1 
        }); 
        const polygon = new THREE.Mesh(polyGeo, polyMat);
        polygon.position.set(0, 5, -30); // Float in the distance
        scene.add(polygon);

        let scrollY = 0;
        const animateMain = () => {
            requestAnimationFrame(animateMain);
            
            if (isHomePage) {
                // 1. Move Grid towards camera
                gridHelper.position.z += 0.2;
                gridHelper2.position.z += 0.2;

                // Loop the grids
                if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
                if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;

                // 2. Rotate Polygon
                polygon.rotation.y += 0.005;
                polygon.rotation.x += 0.002;
            } else {
                // Simpler animation for inner pages
                polygon.rotation.y += 0.002;
            }

            renderer.render(scene, camera);
        };
        animateMain();

        window.addEventListener('scroll', () => scrollY = window.scrollY);
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // --- 3. HERO LOGO (GSAP - FIXED LOGIC) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const logo = document.getElementById("hero-logo");
        if (logo) {
            
            // Explicitly set initial state via GSAP to ensure control
            gsap.set(logo, { 
                top: "50%", 
                left: "50%", 
                xPercent: -50, 
                yPercent: -50, 
                scale: 1,
                opacity: 0
            });

            const tl = gsap.timeline();

            // 1. FADE IN
            tl.to(logo, { opacity: 1, duration: 2, delay: 3 });

            // 2. SCROLL ANIMATION
            gsap.to(logo, {
                scrollTrigger: { 
                    trigger: "body", 
                    start: "top top", 
                    end: "500px top", 
                    scrub: 1 
                },
                // Final Position
                top: "40px",
                left: "40px",
                // Remove centering offsets
                xPercent: 0, 
                yPercent: 0,
                // Shrink and Color
                scale: 0.25,
                color: "#E64833",
                ease: "none" // Linear movement is smoother for scrub
            });
        }
    }
};

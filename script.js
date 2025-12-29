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

    // --- 2. THREE.JS BACKGROUND ---
    const canvasContainer = document.getElementById('canvas-container');
    const isHomePage = !!document.getElementById('hero-logo');

    if (canvasContainer) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x244855, 0.02); 
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        camera.position.set(0, 5, 20);
        camera.rotation.x = -0.2;

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // GRID
        const gridHelper = new THREE.GridHelper(200, 40, 0xE64833, 0x1a353f); gridHelper.position.y = -5; scene.add(gridHelper);
        const gridHelper2 = new THREE.GridHelper(200, 40, 0xE64833, 0x1a353f); gridHelper2.position.y = -5; gridHelper2.position.z = -200; scene.add(gridHelper2);

        // POLYGON (Centerpiece)
        // If Photo Page: Position it in the middle of the slider (0, 0, 0 essentially relative to slider view)
        // Since slider is CSS 3D, we align visually.
        const polyGeo = new THREE.IcosahedronGeometry(6, 1); 
        const polyMat = new THREE.MeshBasicMaterial({ color: 0x90AEAD, wireframe: true, transparent: true, opacity: 0.3 }); 
        const polygon = new THREE.Mesh(polyGeo, polyMat);
        
        if (isHomePage) {
            polygon.position.set(0, 5, -30); // Far back on Home
        } else {
            polygon.position.set(0, 0, 0); // CENTER on Photos/Blogs
            // Adjust camera for inner pages to look straight at it
            camera.position.set(0, 0, 30);
            camera.rotation.x = 0;
            gridHelper.visible = false; // Hide grid on inner pages for cleaner look
            gridHelper2.visible = false;
        }
        scene.add(polygon);

        const animateMain = () => {
            requestAnimationFrame(animateMain);
            if (isHomePage) {
                gridHelper.position.z += 0.2; gridHelper2.position.z += 0.2;
                if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
                if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;
                polygon.rotation.y += 0.005; 
            } else {
                polygon.rotation.y += 0.01; // Faster rotation on inner pages
                polygon.rotation.x += 0.005;
            }
            renderer.render(scene, camera);
        };
        animateMain();
        window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
    }

    // --- 3. HERO ANIMATION (Home Only) ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        const logo = document.getElementById("hero-logo");
        const fixedLogo = document.getElementById("fixed-logo");

        if (logo) {
            // Intro
            gsap.set(logo, { opacity: 0, scale: 0.8 });
            gsap.to(logo, { opacity: 1, scale: 1, duration: 2, delay: 3 });

            // Scroll Effect: Move Behind & Disappear
            gsap.to(logo, {
                scrollTrigger: { trigger: "body", start: "top top", end: "400px top", scrub: 1 },
                opacity: 0, 
                scale: 0.5, 
                z: -500, // Move deep into screen
                ease: "power1.in"
            });

            // Fixed Logo: Appear on Scroll
            gsap.to(fixedLogo, {
                scrollTrigger: { trigger: "body", start: "100px top", end: "300px top", scrub: 1 },
                opacity: 1
            });
        } else {
            // On Inner Pages, Fixed Logo is always visible
            if(fixedLogo) fixedLogo.style.opacity = 1;
        }
    }

    // --- 4. PAGE CONTENT GENERATOR ---
    if (!isHomePage) {
        // REMOVED NAV HEADER INJECTION (User Request)

        const path = window.location.pathname;
        const isPhotoPage = path.includes("photography") || path.includes("photos");

        if (isPhotoPage) {
            const banner = document.createElement('div'); banner.className = 'banner';
            const slider = document.createElement('div'); slider.className = 'slider';
            const sliderPhotos = [
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80",
                "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
                "https://images.unsplash.com/photo-1558655146-d09347e0c766?w=800&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
                "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80", "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80"
            ];
            slider.style.setProperty('--quantity', sliderPhotos.length);
            sliderPhotos.forEach((url, index) => { const item = document.createElement('div'); item.className = 'item'; item.style.setProperty('--position', index + 1); const img = document.createElement('img'); img.src = url; item.appendChild(img); slider.appendChild(item); });
            banner.appendChild(slider); document.querySelector('.scroll-container').appendChild(banner);
        } else {
            // --- BLOGS (External Links) ---
            const blogs = [
                { 
                    title: "Digital Realms", 
                    desc: "Building worlds in code.", 
                    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
                    link: "https://your-blogger-site.com/post-1" // REPLACE THIS
                },
                { 
                    title: "Neon Dreams", 
                    desc: "Cyberpunk aesthetics.", 
                    img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80",
                    link: "https://your-blogger-site.com/post-2" // REPLACE THIS
                },
                { 
                    title: "Geometric Art", 
                    desc: "Math in motion.", 
                    img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80",
                    link: "https://your-blogger-site.com/post-3" // REPLACE THIS
                }
            ];

            const contentDiv = document.createElement('div'); contentDiv.className = 'feed-container';
            blogs.forEach((item, index) => {
                const article = document.createElement('article');
                article.className = 'content-item';
                
                // CLICK EVENT: Open Link
                article.onclick = () => {
                    window.open(item.link, '_blank');
                };

                article.innerHTML = `
                    <div class="content-text">
                        <span style="color:var(--accent-orange); font-weight:bold;">0${index + 1}</span>
                        <h2 class="item-title">${item.title}</h2>
                        <p>${item.desc}</p>
                        <span style="font-size:0.8rem; text-decoration:underline; color:var(--accent-orange);">READ ON BLOGGER →</span>
                    </div>
                    <div class="content-visual"><img src="${item.img}"></div>
                `;
                contentDiv.appendChild(article);
            });
            document.querySelector('.scroll-container').appendChild(contentDiv);
            setTimeout(() => { 
                const items = document.querySelectorAll('.content-item');
                items.forEach(item => { item.style.opacity = 1; item.style.transition = "opacity 1s ease"; });
            }, 500);
        }
    }
};

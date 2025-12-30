window.onload = () => {

    // ==========================================
    // 1. NAVIGATION LOGIC (NEW v14.0)
    // ==========================================
    
    // Desktop Pill Shrink Effect
    const navPill = document.getElementById('desktop-nav');
    if (navPill) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navPill.classList.add('scrolled');
            } else {
                navPill.classList.remove('scrolled');
            }
        });
    }

    // Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (mobileToggle && mobileOverlay) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('open');
            mobileOverlay.classList.toggle('active');
        });

        // Close menu when a link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('open');
                mobileOverlay.classList.remove('active');
            });
        });
    }


    // ==========================================
    // 2. THREE.JS BACKGROUND (Grey/Orange Theme)
    // ==========================================
    const canvasContainer = document.getElementById('canvas-container');
    if (canvasContainer) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x121212, 0.02); // Dark Fog

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        camera.position.set(0, 5, 20);
        camera.rotation.x = -0.2;
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Grid (Vibrant Orange & Dark Grey)
        const gridHelper = new THREE.GridHelper(200, 40, 0xFF5722, 0x333333); 
        gridHelper.position.y = -5; scene.add(gridHelper);
        const gridHelper2 = new THREE.GridHelper(200, 40, 0xFF5722, 0x333333); 
        gridHelper2.position.y = -5; gridHelper2.position.z = -200; scene.add(gridHelper2);

        // Stars/Particles
        const starGeo = new THREE.BufferGeometry(); 
        const starCount = 1000; 
        const starPos = new Float32Array(starCount * 3); 
        for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 150; 
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3)); 
        const starMat = new THREE.PointsMaterial({ size: 0.15, color: 0xFFFFFF, transparent: true, opacity: 0.5 }); 
        const stars = new THREE.Points(starGeo, starMat); 
        scene.add(stars);

        const animateMain = () => {
            requestAnimationFrame(animateMain);
            // Move Grid
            gridHelper.position.z += 0.05; 
            gridHelper2.position.z += 0.05;
            if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
            if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;
            // Rotate Stars
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


    // ==========================================
    // 3. HERO ANIMATIONS (GSAP)
    // ==========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // Only run on Home Page
        if (document.querySelector('.hero-title')) {
            gsap.from(".hero-title", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 0.2 });
            gsap.from(".hero-desc", { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.5 });
            gsap.from(".hero-btns", { y: 30, opacity: 0, duration: 1, ease: "power3.out", delay: 0.8 });
            
            // Image Entrance
            gsap.from(".hero-right", { x: 50, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.5 });
            
            // Bottom Bar Entrance
            gsap.from(".hero-bottom-bar", { y: 50, opacity: 0, duration: 1, ease: "power3.out", delay: 1 });

            // Fan Deck Scroll Trigger
            gsap.from(".fan-card", { 
                scrollTrigger: { trigger: ".fan-section", start: "top 80%" }, 
                y: 100, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" 
            });
        }
    }


    // ==========================================
    // 4. CONTENT GENERATOR (Blogs & Photography)
    // ==========================================
    const scrollContainer = document.querySelector('.scroll-container');
    const path = window.location.pathname;
    const isPhotoPage = path.includes("photography") || path.includes("photos");
    const isBlogPage = path.includes("blogs");

    if (scrollContainer) {
        
        // --- PHOTOGRAPHY PAGE GENERATOR ---
        if (isPhotoPage) {
            // 1. 3D SLIDER
            const banner = document.createElement('div'); banner.className = 'banner';
            const slider = document.createElement('div'); slider.className = 'slider';
            
            // Your Photo Assets
            const sliderPhotos = [
                "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
                "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80",
                "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80",
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80",
                "https://images.unsplash.com/photo-1558655146-d09347e0c766?w=800&q=80",
                "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80",
                "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80",
                "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80"
            ];

            slider.style.setProperty('--quantity', sliderPhotos.length);
            sliderPhotos.forEach((url, index) => { 
                const item = document.createElement('div'); item.className = 'item'; 
                item.style.setProperty('--position', index + 1); 
                const img = document.createElement('img'); img.src = url; 
                item.appendChild(img); slider.appendChild(item); 
            });
            banner.appendChild(slider); 
            scrollContainer.appendChild(banner);

            // 2. PHOTO GRID
            const recentSection = document.createElement('div'); recentSection.className = 'feed-container';
            recentSection.innerHTML = '<h2 style="text-align:center; color:white; margin-bottom:50px; font-family:\'Orbitron\'">GALLERY</h2>';
            const gridDiv = document.createElement('div'); gridDiv.className = 'recent-grid';

            const recentPhotos = [
                { title: "Neon Rain", img: sliderPhotos[0] }, 
                { title: "Cyber Alley", img: sliderPhotos[1] }, 
                { title: "Void", img: sliderPhotos[2] }, 
                { title: "Market", img: sliderPhotos[3] }
            ];
            recentPhotos.forEach(photo => { 
                const card = document.createElement('div'); card.className = 'recent-card';
                card.innerHTML = `
                    <img src="${photo.img}" class="recent-img">
                    <div class="photo-info">
                        <h3 class="photo-title">${photo.title}</h3>
                    </div>
                `;
                gridDiv.appendChild(card);
            });
            recentSection.appendChild(gridDiv);
            scrollContainer.appendChild(recentSection);
        }

        // --- BLOGS PAGE GENERATOR ---
        if (isBlogPage) {
            const blogs = [
                { title: "Digital Realms", desc: "Building worlds in code.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", link: "https://yourblogger.com" },
                { title: "Neon Dreams", desc: "Cyberpunk aesthetics.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80", link: "https://yourblogger.com" },
                { title: "Geometric Art", desc: "Math in motion.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80", link: "https://yourblogger.com" }
            ];

            const contentDiv = document.createElement('div'); contentDiv.className = 'feed-container';
            blogs.forEach((item, index) => {
                const article = document.createElement('article');
                article.className = 'content-item';
                article.onclick = () => window.open(item.link, '_blank');
                
                article.innerHTML = `
                    <div class="content-text">
                        <span style="color:var(--accent-orange); font-weight:bold;">0${index + 1}</span>
                        <h2 class="item-title">${item.title}</h2>
                        <p>${item.desc}</p>
                    </div>
                    <div class="content-visual"><img src="${item.img}"></div>
                `;
                contentDiv.appendChild(article);
            });
            scrollContainer.appendChild(contentDiv);
        }
    }
};

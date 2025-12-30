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

    // --- 2. THREE.JS BACKGROUND (MINIMAL THEME) ---
    const canvasContainer = document.getElementById('canvas-container');
    const isHomePage = !!document.getElementById('hero-main-title');

    if (canvasContainer) {
        const scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x121212, 0.02); // Minimal Dark Fog
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        canvasContainer.appendChild(renderer.domElement);
        
        camera.position.set(0, 5, 20);
        camera.rotation.x = -0.2;
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter light for clean look
        scene.add(ambientLight);

        // Grid (Soft Grey & Gold)
        const gridHelper = new THREE.GridHelper(200, 40, 0xC9A66B, 0x2C2C2C); // Gold Center, Dark Grey Lines
        gridHelper.position.y = -5; scene.add(gridHelper);
        const gridHelper2 = new THREE.GridHelper(200, 40, 0xC9A66B, 0x2C2C2C); 
        gridHelper2.position.y = -5; gridHelper2.position.z = -200; scene.add(gridHelper2);
        
        // Stars (Subtle White)
        const starGeo = new THREE.BufferGeometry(); const starCount = 800; const starPos = new Float32Array(starCount * 3); for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 150; starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3)); 
        const starMat = new THREE.PointsMaterial({ size: 0.1, color: 0xFFFFFF, transparent: true, opacity: 0.6 }); 
        const stars = new THREE.Points(starGeo, starMat); scene.add(stars);

        const animateMain = () => {
            requestAnimationFrame(animateMain);
            gridHelper.position.z += 0.05; gridHelper2.position.z += 0.05; // Slower, calmer movement
            if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
            if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;
            stars.rotation.z += 0.0001;
            renderer.render(scene, camera);
        };
        animateMain();
        window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
    }

    // --- 3. HERO ANIMATIONS ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        if (isHomePage) {
            gsap.from(".hero-main-title", { y: 30, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.2 });
            gsap.from(".hero-desc", { y: 20, opacity: 0, duration: 1.5, ease: "power3.out", delay: 0.5 });
            gsap.from(".hero-actions", { y: 20, opacity: 0, duration: 1, ease: "power3.out", delay: 0.8 });
            gsap.from(".hero-img-side", { scale: 0.9, opacity: 0, duration: 2, ease: "power3.out", delay: 0.5 });
            gsap.from(".fan-card", { scrollTrigger: { trigger: ".fan-section", start: "top 80%" }, y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power2.out" });
        }
    }

    // --- 4. PAGE CONTENT GENERATOR ---
    const scrollContainer = document.querySelector('.scroll-container');
    const path = window.location.pathname;
    const isPhotoPage = path.includes("photography") || path.includes("photos");
    const isBlogPage = path.includes("blogs");

    if (!isHomePage && scrollContainer) {
        
        // --- PHOTOGRAPHY PAGE ---
        if (isPhotoPage) {
            const banner = document.createElement('div'); banner.className = 'banner';
            const slider = document.createElement('div'); slider.className = 'slider';
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

            const recentSection = document.createElement('div'); recentSection.className = 'feed-container';
            recentSection.innerHTML = '<h2 style="text-align:center; color:var(--text-cream); margin-bottom:50px;">GALLERY</h2>';
            const gridDiv = document.createElement('div'); gridDiv.className = 'recent-grid';
            const recentPhotos = [
                { title: "Neon Rain", img: sliderPhotos[0] }, 
                { title: "Cyber Alley", img: sliderPhotos[1] }, 
                { title: "Void", img: sliderPhotos[2] }, 
                { title: "Market", img: sliderPhotos[3] }
            ];
            recentPhotos.forEach(photo => { 
                const card = document.createElement('div'); card.className = 'recent-card';
                card.innerHTML = `<img src="${photo.img}" class="recent-img"><div class="photo-info"><h3 class="photo-title">${photo.title}</h3></div>`;
                gridDiv.appendChild(card);
            });
            recentSection.appendChild(gridDiv);
            scrollContainer.appendChild(recentSection);
        }

        // --- BLOGS PAGE ---
        if (isBlogPage) {
            const blogs = [
                { title: "Digital Realms", desc: "Building worlds in code.", img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", link: "https://yourblogger.com" },
                { title: "Design Theory", desc: "Aesthetics in modern UI.", img: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80", link: "https://yourblogger.com" },
                { title: "Geometric Art", desc: "Math in motion.", img: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80", link: "https://yourblogger.com" }
            ];

            const contentDiv = document.createElement('div'); contentDiv.className = 'feed-container';
            blogs.forEach((item, index) => {
                const article = document.createElement('article');
                article.className = 'content-item';
                article.onclick = () => window.open(item.link, '_blank');
                article.innerHTML = `
                    <div class="content-text">
                        <span style="color:var(--accent-primary); font-weight:bold;">0${index + 1}</span>
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

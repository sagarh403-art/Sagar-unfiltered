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
        camera.position.set(0, 5, 20); camera.rotation.x = -0.2;
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);

        const gridHelper = new THREE.GridHelper(200, 40, 0xE64833, 0x1a353f); gridHelper.position.y = -5; scene.add(gridHelper);
        const gridHelper2 = new THREE.GridHelper(200, 40, 0xE64833, 0x1a353f); gridHelper2.position.y = -5; gridHelper2.position.z = -200; scene.add(gridHelper2);
        const sunGeo = new THREE.IcosahedronGeometry(30, 2); const sunMat = new THREE.MeshBasicMaterial({ color: 0xE64833, wireframe: true, transparent: true, opacity: 0.15 }); const sun = new THREE.Mesh(sunGeo, sunMat); sun.position.set(0, 0, -80); scene.add(sun);
        const starGeo = new THREE.BufferGeometry(); const starCount = 1000; const starPos = new Float32Array(starCount * 3); for(let i=0; i<starCount*3; i++) starPos[i] = (Math.random() - 0.5) * 150; starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3)); const starMat = new THREE.PointsMaterial({ size: 0.2, color: 0x90AEAD, transparent: true, opacity: 0.8 }); const stars = new THREE.Points(starGeo, starMat); scene.add(stars);
        const polyGeo = new THREE.IcosahedronGeometry(6, 0); const polyMat = new THREE.MeshBasicMaterial({ color: 0x90AEAD, wireframe: true, transparent: true, opacity: 0.2 }); const polygon = new THREE.Mesh(polyGeo, polyMat); polygon.position.set(0, 5, -30); scene.add(polygon);

        const animateMain = () => {
            requestAnimationFrame(animateMain);
            if (isHomePage) {
                gridHelper.position.z += 0.2; gridHelper2.position.z += 0.2;
                if (gridHelper.position.z >= 200) gridHelper.position.z = -200;
                if (gridHelper2.position.z >= 200) gridHelper2.position.z = -200;
                sun.rotation.y += 0.001; polygon.rotation.y += 0.005; polygon.rotation.x += 0.002; stars.rotation.z += 0.0005;
            } else { polygon.rotation.y += 0.002; }
            renderer.render(scene, camera);
        };
        animateMain();
        window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });
    }

    // --- 3. HERO LOGO ---
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        const logo = document.getElementById("hero-logo");
        const subtitle = document.getElementById("hero-subtitle");
        if (logo) {
            gsap.set(logo, { top: "50%", left: "50%", xPercent: -50, yPercent: -50, scale: 1, opacity: 0 });
            if(subtitle) gsap.set(subtitle, { opacity: 0, y: 20 });
            const tl = gsap.timeline();
            tl.to(logo, { opacity: 1, duration: 2, delay: 3 }).to(subtitle, { opacity: 1, y: 0, duration: 1 }, "-=1");
            gsap.to(logo, { scrollTrigger: { trigger: "body", start: "top top", end: "500px top", scrub: 1 }, top: "40px", left: "40px", xPercent: 0, yPercent: 0, scale: 0.25, color: "#E64833", ease: "none" });
            if(subtitle) { gsap.to(subtitle, { scrollTrigger: { trigger: "body", start: "top top", end: "200px top", scrub: 1 }, opacity: 0, y: -50 }); }
        }
    }

    // --- 4. PAGE CONTENT GENERATOR (v12.0 - HTML READER) ---
    if (!isHomePage) {
        if (!document.querySelector('.nav-header')) {
            const header = document.createElement('nav'); header.className = 'nav-header';
            header.innerHTML = `<a href="index.html" class="back-btn-round">← HOME</a>`;
            document.body.prepend(header);
        }

        const path = window.location.pathname;
        const isPhotoPage = path.includes("photography") || path.includes("photos");

        if (isPhotoPage) {
            // ... (Photography code remains unchanged) ...
            const banner = document.createElement('div'); banner.className = 'banner';
            const slider = document.createElement('div'); slider.className = 'slider';
            const sliderPhotos = ["https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80", "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&q=80", "https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&q=80", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", "https://images.unsplash.com/photo-1558655146-d09347e0c766?w=800&q=80", "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=800&q=80", "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80", "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80"];
            slider.style.setProperty('--quantity', sliderPhotos.length);
            sliderPhotos.forEach((url, index) => { const item = document.createElement('div'); item.className = 'item'; item.style.setProperty('--position', index + 1); const img = document.createElement('img'); img.src = url; item.appendChild(img); slider.appendChild(item); });
            banner.appendChild(slider); document.querySelector('.scroll-container').appendChild(banner);
            const recentSection = document.createElement('div'); recentSection.className = 'recent-section';
            recentSection.innerHTML = '<h2 class="section-title">RECENT DROPS</h2><div class="recent-grid"></div>';
            const grid = recentSection.querySelector('.recent-grid');
            const recentPhotos = [{ title: "Neon Rain", location: "Tokyo", img: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80" }, { title: "Cyber Alley", location: "Seoul", img: "https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&q=80" }, { title: "Void", location: "Berlin", img: "https://images.unsplash.com/photo-1486744360400-1b8a11ea8416?w=800&q=80" }, { title: "Market", location: "Hong Kong", img: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=800&q=80" }];
            recentPhotos.forEach(photo => { const card = document.createElement('div'); card.className = 'recent-card'; card.onclick = function() { this.classList.toggle('active'); }; card.innerHTML = `<img src="${photo.img}" class="recent-img"><div class="photo-info"><h3 class="photo-title">${photo.title}</h3><div class="photo-loc"><i class="fa-solid fa-location-dot"></i> ${photo.location}</div></div>`; grid.appendChild(card); });
            document.querySelector('.scroll-container').appendChild(recentSection);

        } else {
            
            // --- BLOG LOGIC (READS HTML DATABASE) ---

            // 1. Setup Reader Overlay
            const readerOverlay = document.createElement('div');
            readerOverlay.className = 'blog-reader-overlay';
            readerOverlay.innerHTML = `
                <button class="close-reader">CLOSE X</button>
                <div class="reader-content">
                    <h1 class="reader-title"></h1>
                    <img class="reader-img" src="">
                    <div class="reader-body"></div>
                </div>
            `;
            document.body.appendChild(readerOverlay);

            const closeReaderBtn = readerOverlay.querySelector('.close-reader');
            closeReaderBtn.addEventListener('click', () => {
                readerOverlay.classList.remove('active');
                document.body.style.overflow = 'auto'; 
            });

            // 2. Scan HTML for Blogs
            const blogDatabase = document.getElementById('blog-database');
            const contentDiv = document.createElement('div'); contentDiv.className = 'feed-container';
            
            if (blogDatabase) {
                const blogEntries = blogDatabase.querySelectorAll('.blog-entry');
                
                blogEntries.forEach((entry, index) => {
                    const title = entry.getAttribute('data-title');
                    const desc = entry.getAttribute('data-desc');
                    const img = entry.getAttribute('data-img');
                    const fullContent = entry.innerHTML; // Gets the <p>, <h3> etc.

                    const article = document.createElement('article');
                    article.className = 'content-item';
                    
                    // Click Event
                    article.onclick = () => {
                        readerOverlay.querySelector('.reader-title').innerText = title;
                        readerOverlay.querySelector('.reader-img').src = img;
                        readerOverlay.querySelector('.reader-body').innerHTML = fullContent; // Use innerHTML to preserve tags
                        readerOverlay.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    };

                    article.innerHTML = `
                        <div class="content-text">
                            <span style="color:var(--accent-orange); font-weight:bold;">0${index + 1}</span>
                            <h2 class="item-title">${title}</h2>
                            <p>${desc}</p>
                            <span style="font-size:0.8rem; text-decoration:underline; color:var(--accent-orange);">READ FULL ENTRY →</span>
                        </div>
                        <div class="content-visual"><img src="${img}"></div>
                    `;
                    contentDiv.appendChild(article);
                });
            }

            document.querySelector('.scroll-container').appendChild(contentDiv);
            setTimeout(() => { 
                const items = document.querySelectorAll('.content-item');
                items.forEach(item => { item.style.opacity = 1; item.style.transition = "opacity 1s ease"; });
            }, 500);
        }
    }
};

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

const featured = document.querySelector(".featured");
const quote = document.querySelector(".content__text .highlight");
const sectionTitles = document.querySelectorAll(".container h1");
const introCard = document.querySelector(".intro-card");
const linkBoxes = document.querySelectorAll(".boxes .box");

// Skip the animations for people who turned on "reduce motion" in their system settings
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const initSmoothScrolling = () => {
  // Initialize Lenis for smooth scroll effects. Lerp value controls the smoothness.
  const lenis = new Lenis({ lerp: 0.15 });

  // Ensure GSAP animations are in sync with Lenis' scroll frame updates.
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000); // Convert GSAP's time to milliseconds for Lenis.
  });

  // Turn off GSAP's default lag smoothing to avoid conflicts with Lenis.
  gsap.ticker.lagSmoothing(0);
};

// Fade in the featured project and the quote as soon as the page loads.
// The header is left alone on purpose: it's already on screen at the end of the intro page,
// so keeping it still makes the switch from intro.html to home.html look seamless.
const playPageIntro = () => {
  gsap
    .timeline({ delay: 0.1 })
    .fromTo(
      featured,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: "power4" }
    )
    .fromTo(
      featured.querySelectorAll(".featured__text > *"),
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3", stagger: 0.08 },
      "-=0.9" // Start before the panel finishes
    );
};

// Fade elements up when they scroll into view
const revealOnScroll = (elements, options = {}) => {
  elements = [...elements];
  // Hide them first so they don't flash before animating
  gsap.set(elements, { y: 40, opacity: 0 });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gsap.to(entry.target, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3",
          delay: options.stagger ? elements.indexOf(entry.target) * options.stagger : 0
        });
        observer.unobserve(entry.target); // Only animate once
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
};

// Make the link boxes lift up a little on hover
const initBoxHover = () => {
  linkBoxes.forEach((box) => {
    box.addEventListener("mouseenter", () => {
      gsap.to(box, { y: -8, scale: 1.05, duration: 0.3, ease: "power2" });
    });
    box.addEventListener("mouseleave", () => {
      gsap.to(box, { y: 0, scale: 1, duration: 0.3, ease: "power2" });
    });
  });
};

// Initialization function
const init = () => {
  initSmoothScrolling();
  if (reduceMotion) return;

  playPageIntro();
  revealOnScroll([quote, ...sectionTitles, introCard]);
  revealOnScroll(linkBoxes, { stagger: 0.1 });
  initBoxHover();
};

init();

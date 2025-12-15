class GalleryManager {
  constructor() {
    this.currentIndex = 0;
    this.images = [
      "assets/images/product-main.png",
      "assets/images/product-main.png",
      "assets/images/product-main.png",
      "assets/images/product-main.png",
      "assets/images/product-main.png",
      "assets/images/product-main.png",
      "assets/images/product-main.png",
      "assets/images/product-main.png",
    ];

    this.mainImage = document.getElementById("mainImage");
    this.thumbnails = document.querySelectorAll(".thumbnail");
    this.dots = document.querySelectorAll(".dot");
    this.prevBtn = document.getElementById("prevBtn");
    this.nextBtn = document.getElementById("nextBtn");

    this.init();
  }

  init() {
    this.thumbnails.forEach((thumb) => {
      thumb.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goToImage(index);
      });
    });

    this.dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goToImage(index);
      });
    });

    this.prevBtn.addEventListener("click", () => this.previousImage());
    this.nextBtn.addEventListener("click", () => this.nextImage());

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.previousImage();
      if (e.key === "ArrowRight") this.nextImage();
    });
  }

  goToImage(index) {
    this.mainImage.style.opacity = "0";

    setTimeout(() => {
      this.currentIndex = index;
      this.mainImage.src = this.images[index];

      this.updateActiveStates();

      this.mainImage.style.opacity = "1";
    }, 150);
  }

  nextImage() {
    const nextIndex = (this.currentIndex + 1) % this.images.length;
    this.goToImage(nextIndex);
  }

  previousImage() {
    const prevIndex =
      (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.goToImage(prevIndex);
  }

  updateActiveStates() {
    this.thumbnails.forEach((thumb, index) => {
      thumb.classList.toggle("active", index === this.currentIndex);
    });

    this.dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === this.currentIndex);
    });
  }
}

class SubscriptionAccordion {
  constructor() {
    this.accordionItems = document.querySelectorAll(
      ".subscription-accordion-item"
    );
    this.selectedPurchase = "single";
    this.selectedFragrance1 = "original";
    this.selectedFragrance2 = "original";
    this.cartButton = document.getElementById("addToCartBtn");

    this.init();
  }

  init() {
    // Handle accordion clicks
    this.accordionItems.forEach((item) => {
      const header = item.querySelector(".subscription-accordion-header");
      header.addEventListener("click", () => this.toggle(item));
    });

    // Initialize fragrance selection
    this.initFragranceSelection();

    // Set initial state
    this.updateCartLink();
  }

  toggle(item) {
    const isActive = item.classList.contains("active");
    const header = item.querySelector(".subscription-accordion-header");

    // Close all other items
    this.accordionItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
        otherItem
          .querySelector(".subscription-accordion-header")
          .setAttribute("aria-expanded", "false");
      }
    });

    // Toggle current item
    if (isActive) {
      item.classList.remove("active");
      header.setAttribute("aria-expanded", "false");
    } else {
      item.classList.add("active");
      header.setAttribute("aria-expanded", "true");

      // Update selected purchase type
      const title = item.querySelector(".subscription-title").textContent;
      this.selectedPurchase = title.toLowerCase().includes("single")
        ? "single"
        : "double";
      this.updateCartLink();
    }
  }

  initFragranceSelection() {
    // Single subscription fragrance selection
    const singleFragranceOptions = document.querySelectorAll(
      ".subscription-accordion-item:nth-child(1) .fragrance-option"
    );
    singleFragranceOptions.forEach((option) => {
      option.addEventListener("click", () => {
        singleFragranceOptions.forEach((opt) =>
          opt.classList.remove("selected")
        );
        option.classList.add("selected");
        this.selectedFragrance1 = option
          .querySelector(".fragrance-name")
          .textContent.toLowerCase();
        this.updateCartLink();
      });
    });

    // Double subscription fragrance selection
    const doubleFragranceOptions1 = document.querySelectorAll(
      ".subscription-accordion-item:nth-child(2) .fragrance-selection:first-child .fragrance-option"
    );
    const doubleFragranceOptions2 = document.querySelectorAll(
      ".subscription-accordion-item:nth-child(2) .fragrance-selection:last-child .fragrance-option"
    );

    doubleFragranceOptions1.forEach((option) => {
      option.addEventListener("click", () => {
        doubleFragranceOptions1.forEach((opt) =>
          opt.classList.remove("selected")
        );
        option.classList.add("selected");
        this.selectedFragrance1 = option
          .querySelector(".fragrance-name")
          .textContent.toLowerCase();
        this.updateCartLink();
      });
    });

    doubleFragranceOptions2.forEach((option) => {
      option.addEventListener("click", () => {
        doubleFragranceOptions2.forEach((opt) =>
          opt.classList.remove("selected")
        );
        option.classList.add("selected");
        this.selectedFragrance2 = option
          .querySelector(".fragrance-name")
          .textContent.toLowerCase();
        this.updateCartLink();
      });
    });
  }

  updateCartLink() {
    let cartUrl;
    if (this.selectedPurchase === "single") {
      cartUrl = `#cart?product=${this.selectedFragrance1}-single`;
    } else if (this.selectedPurchase === "double") {
      cartUrl = `#cart?product=${this.selectedFragrance1}-${this.selectedFragrance2}-double`;
    } else {
      cartUrl = `#cart?product=original-onetime`;
    }

    if (this.cartButton) {
      this.cartButton.href = cartUrl;
      console.log("Cart link updated:", cartUrl);
    }
  }
}

class StatisticsCounter {
  constructor() {
    this.statCards = document.querySelectorAll(".stat-card__number");
    this.hasAnimated = false;

    this.init();
  }

  init() {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !this.hasAnimated) {
          this.animateCounters();
          this.hasAnimated = true;
        }
      });
    }, options);

    const statsSection = document.getElementById("statistics");
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  animateCounters() {
    this.statCards.forEach((card) => {
      const target = parseInt(card.dataset.target);
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;

        if (current >= target) {
          card.textContent = target;
          clearInterval(timer);
        } else {
          card.textContent = Math.floor(current);
        }
      }, stepDuration);
    });
  }
}

class MobileMenu {
  constructor() {
    this.hamburger = document.getElementById("hamburger");
    this.nav = document.getElementById("mainNav");
    this.body = document.body;

    this.init();
  }

  init() {
    this.hamburger.addEventListener("click", () => this.toggle());

    const navLinks = this.nav.querySelectorAll("a");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => this.close());
    });

    document.addEventListener("click", (e) => {
      if (!this.hamburger.contains(e.target) && !this.nav.contains(e.target)) {
        this.close();
      }
    });
  }

  toggle() {
    const isActive = this.hamburger.classList.toggle("active");
    this.nav.classList.toggle("active");
    this.hamburger.setAttribute("aria-expanded", isActive);

    if (isActive) {
      this.body.style.overflow = "hidden";
    } else {
      this.body.style.overflow = "";
    }
  }

  close() {
    this.hamburger.classList.remove("active");
    this.nav.classList.remove("active");
    this.hamburger.setAttribute("aria-expanded", "false");
    this.body.style.overflow = "";
  }
}

class LazyLoader {
  constructor() {
    this.images = document.querySelectorAll('img[loading="lazy"]');
    this.init();
  }

  init() {
    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      });

      this.images.forEach((img) => imageObserver.observe(img));
    }
  }
}

class SmoothScroll {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");

        if (href === "#" || href.includes("?")) return;

        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  }
}

class NewsletterForm {
  constructor() {
    this.form = document.querySelector(".newsletter-form");
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = this.form.querySelector('input[type="email"]').value;

        console.log("Newsletter signup:", email);

        alert("Thank you for subscribing to our newsletter!");
        this.form.reset();
      });
    }
  }
}

class AccordionManager {
  constructor() {
    this.accordionItems = document.querySelectorAll(".accordion-item");
    this.init();
  }

  init() {
    this.accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header");
      const icon = item.querySelector(".accordion-icon");

      // Set first item as active by default
      if (item.getAttribute("aria-expanded") === "true") {
        item.classList.add("active");
        icon.textContent = "-";
      }

      header.addEventListener("click", () => this.toggle(item));
    });
  }

  toggle(item) {
    const isActive = item.classList.contains("active");
    const icon = item.querySelector(".accordion-icon");
    const header = item.querySelector(".accordion-header");

    // Close all other items
    this.accordionItems.forEach((otherItem) => {
      if (otherItem !== item) {
        otherItem.classList.remove("active");
        otherItem.querySelector(".accordion-icon").textContent = "+";
        otherItem
          .querySelector(".accordion-header")
          .setAttribute("aria-expanded", "false");
      }
    });

    // Toggle current item
    if (isActive) {
      item.classList.remove("active");
      icon.textContent = "+";
      header.setAttribute("aria-expanded", "false");
    } else {
      item.classList.add("active");
      icon.textContent = "-";
      header.setAttribute("aria-expanded", "true");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const gallery = new GalleryManager();
  const subscriptionAccordion = new SubscriptionAccordion();
  const statistics = new StatisticsCounter();
  const mobileMenu = new MobileMenu();
  const lazyLoader = new LazyLoader();
  const smoothScroll = new SmoothScroll();
  const newsletter = new NewsletterForm();
  const accordion = new AccordionManager();

  console.log("GTG Perfumes - All systems initialized");
});

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", `${vh}px`);
}

setViewportHeight();
window.addEventListener("resize", debounce(setViewportHeight, 250));

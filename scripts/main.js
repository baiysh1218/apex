/**
 * APEX Academy - 3D Animation Course Landing Page
 * Main JavaScript file
 */

(function () {
  "use strict";

  // ==========================================================================
  // Configuration
  // ==========================================================================

  /**
   * Google Apps Script Web App URL
   * ИНСТРУКЦИЯ ПО НАСТРОЙКЕ:
   *
   * 1. Создайте новый Google Sheet
   * 2. Откройте Extensions > Apps Script
   * 3. Вставьте код из файла google-apps-script.js (см. ниже)
   * 4. Deploy > New deployment > Web app
   * 5. Execute as: Me, Who has access: Anyone
   * 6. Скопируйте URL и вставьте сюда
   */
  const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbxp8h9BykaBX0QjZUy9wVc2DocPGXXukxAqP0EFYRt1fxNN-MPnXhyzpfI2Bjw2aDhS/exec";

  // ==========================================================================
  // DOM Elements
  // ==========================================================================

  const header = document.querySelector(".header");
  const burger = document.querySelector(".burger");
  const navMenu = document.querySelector(".nav-menu");
  const contactForm = document.getElementById("contact-form");
  const toast = document.getElementById("toast");

  // ==========================================================================
  // Toast Notification
  // ==========================================================================

  function showToast() {
    if (toast) {
      toast.classList.add("show");
      // Auto-hide after 5 seconds
      setTimeout(() => {
        hideToast();
      }, 5000);
    }
  }

  // Make hideToast global for the onclick handler
  window.hideToast = function() {
    if (toast) {
      toast.classList.remove("show");
    }
  };

  // ==========================================================================
  // Header Scroll Effect
  // ==========================================================================

  function handleScroll() {
    if (window.scrollY > 100) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", handleScroll, { passive: true });

  // ==========================================================================
  // Mobile Menu
  // ==========================================================================

  function createMobileMenu() {
    // Create mobile menu element
    const mobileMenu = document.createElement("div");
    mobileMenu.className = "mobile-menu";
    mobileMenu.innerHTML = `
            <ul>
                <li><a href="#author">Автор</a></li>
                <li><a href="#features">Особенности курса</a></li>
                <li><a href="#content">Содержание</a></li>
                <li><a href="#certificate">Сертификат</a></li>
                <li><a href="#form" class="btn btn-primary">Заказать</a></li>
            </ul>
        `;
    document.body.appendChild(mobileMenu);

    // Toggle menu
    burger.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      burger.classList.toggle("active");
      document.body.style.overflow = mobileMenu.classList.contains("active")
        ? "hidden"
        : "";
    });

    // Close menu on link click
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
        burger.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  if (burger) {
    createMobileMenu();
  }

  // ==========================================================================
  // Smooth Scroll
  // ==========================================================================

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (target) {
        const headerHeight = header.offsetHeight;
        const targetPosition =
          target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ==========================================================================
  // Form Submission to Google Sheets
  // ==========================================================================

  function showFormMessage(form, message, isSuccess) {
    // Remove existing message
    const existingMessage = form.querySelector(".form-message");
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create new message
    const messageEl = document.createElement("div");
    messageEl.className = `form-message ${isSuccess ? "success" : "error"}`;
    messageEl.textContent = message;
    form.appendChild(messageEl);

    // Remove message after 5 seconds
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }

  async function submitForm(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Validate
    const name = formData.get("name").trim();
    const phone = formData.get("phone").trim();

    if (!name || !phone) {
      showFormMessage(form, "Пожалуйста, заполните все поля", false);
      return;
    }

    // Phone validation (basic)
    const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
      showFormMessage(form, "Введите корректный номер телефона", false);
      return;
    }

    // Show loading state
    submitBtn.classList.add("loading");
    submitBtn.disabled = true;

    try {
      // Check if Google Script URL is configured
      if (GOOGLE_SCRIPT_URL === "YOUR_GOOGLE_APPS_SCRIPT_URL_HERE") {
        // Demo mode - show success without actual submission
        console.log("Demo mode: Form data:", { name, phone });
        form.reset();
        showToast();
      } else {
        // Real submission to Google Sheets
        const response = await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            phone: phone,
            timestamp: new Date().toISOString(),
          }),
        });

        form.reset();
        showToast();
      }
    } catch (error) {
      console.error("Form submission error:", error);
      showFormMessage(
        form,
        "Произошла ошибка. Попробуйте позже или позвоните нам.",
        false,
      );
    } finally {
      submitBtn.classList.remove("loading");
      submitBtn.disabled = false;
    }
  }

  if (contactForm) {
    contactForm.addEventListener("submit", submitForm);
  }

  // ==========================================================================
  // Scroll Animations (Intersection Observer)
  // ==========================================================================

  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
      ".learn-card, .benefit-card, .author-facts li",
    );

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -50px 0px",
        },
      );

      animatedElements.forEach((el) => {
        el.classList.add("animate-on-scroll");
        observer.observe(el);
      });
    } else {
      // Fallback for older browsers
      animatedElements.forEach((el) => el.classList.add("visible"));
    }
  }

  initScrollAnimations();

  // ==========================================================================
  // Phone Input Mask (optional enhancement)
  // ==========================================================================

  const phoneInput = document.querySelector('input[name="phone"]');
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      // Allow only numbers, spaces, +, -, (, )
      let value = e.target.value.replace(/[^\d\s\+\-\(\)]/g, "");
      e.target.value = value;
    });
  }

  // ==========================================================================
  // Preload Critical Images
  // ==========================================================================

  function preloadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = resolve;
      img.onerror = reject;
      img.src = src;
    });
  }

  // Preload hero image if it exists
  const heroImage = document.querySelector(".hero-image img");
  if (heroImage && heroImage.src) {
    preloadImage(heroImage.src);
  }
})();

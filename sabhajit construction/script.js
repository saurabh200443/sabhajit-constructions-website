
"use strict";

// ===============================================
// SABHAJIT CONSTRUCTIONS - SITE CONFIGURATION
// ===============================================

// Replace with the actual business WhatsApp number.
// India example format: 919876543210
// Do not include +, spaces, brackets or hyphens.
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

document.addEventListener("DOMContentLoaded", () => {
  // 1. AUTOMATIC COPYRIGHT YEAR
  const yearElement = document.getElementById("currentYear");

  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 2. MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        navLinks.classList.contains("open") &&
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });
  }

  // 3. SERVICE LINKS
  // Clicking a service takes the visitor to the enquiry form
  // and preselects the requested service.
  const serviceLinks = document.querySelectorAll("[data-service]");
  const serviceSelect = document.getElementById("service");

  serviceLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (serviceSelect) {
        serviceSelect.value = link.dataset.service;
      }
    });
  });

  // 4. WHATSAPP ENQUIRY FORM
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  function isWhatsAppConfigured() {
    return /^\d{10,15}$/.test(WHATSAPP_NUMBER);
  }

  function openWhatsApp(message) {
    const url =
      "https://wa.me/" +
      WHATSAPP_NUMBER +
      "?text=" +
      encodeURIComponent(message);

    // Open a new tab when possible.
    const openedWindow = window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );

    // Fallback for browsers that block new tabs.
    if (!openedWindow) {
      window.location.href = url;
    }
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Check required fields and browser validation rules.
      if (!contactForm.reportValidity()) {
        return;
      }

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const service = document.getElementById("service").value;
      const location = document.getElementById("location").value.trim();
      const message = document.getElementById("message").value.trim();

      // Basic contact number validation.
      const phonePattern = /^\+?[0-9()\s-]{7,20}$/;

      if (!phonePattern.test(phone)) {
        formStatus.textContent =
          "Please enter a valid contact number.";
        document.getElementById("phone").focus();
        return;
      }

      // Do not send enquiries to an unconfigured number.
      if (!isWhatsAppConfigured()) {
        formStatus.textContent =
          "Setup needed: add your business WhatsApp number in script.js before using enquiries.";
        return;
      }

      const enquiryMessage = [
        "Hello Sabhajit Constructions,",
        "",
        "I would like to discuss a project.",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Service: " + service,
        "Project location: " + location,
        "Project details: " + (message || "Not provided"),
        "",
        "Please contact me to discuss the requirements."
      ].join("\n");

      formStatus.textContent =
        "WhatsApp is opening with your enquiry. Please review it and press Send.";

      openWhatsApp(enquiryMessage);
    });
  }

  // 5. FLOATING ENQUIRY BUTTON
  const whatsappFloat = document.getElementById("whatsappFloat");

  if (whatsappFloat) {
    whatsappFloat.addEventListener("click", (event) => {
      event.preventDefault();

      if (!isWhatsAppConfigured()) {
        const contactSection = document.getElementById("contact");

        if (contactSection) {
          contactSection.scrollIntoView({ behavior: "smooth" });
        }

        if (formStatus) {
          formStatus.textContent =
            "Setup needed: add your business WhatsApp number in script.js to enable direct enquiries.";
        }

        return;
      }

      const message =
        "Hello Sabhajit Constructions! I would like to enquire about your services.";

      openWhatsApp(message);
    });
  }
});

// Common UI Helper functions for Hynet site
// Manages menus, session widgets on public header, scroll reveals

document.addEventListener("DOMContentLoaded", () => {
  setupMobileMenu();
  setupHeaderSessionWidget();
  setupThemeToggle();
  setupScrollReveal();
  setupContactForms();
});

// Setup responsive mobile navigation
function setupMobileMenu() {
  const menuButton = document.querySelector("header nav button.md\\:hidden");
  if (!menuButton) return;

  // Let's find or create mobile menu container
  let mobileMenu = document.getElementById("mobile-menu-container");
  
  if (!mobileMenu) {
    // Create mobile menu dynamically to keep public HTMLs clean
    mobileMenu = document.createElement("div");
    mobileMenu.id = "mobile-menu-container";
    mobileMenu.className = "hidden fixed top-[72px] left-0 w-full bg-surface shadow-md z-40 border-b border-outline-variant/30 py-6 px-6 flex flex-col gap-6 md:hidden transition-all duration-300";
    
    // Get links from desktop navbar
    const links = document.querySelectorAll("header nav div.hidden.md\\:flex a");
    links.forEach(link => {
      // Ignore theme toggle buttons, primary actions, or logout buttons here
      if (link.id === "themeToggleBtn" || link.classList.contains("bg-primary") || link.textContent.toLowerCase().includes("salir")) return;
      
      const clonedLink = link.cloneNode(true);
      clonedLink.className = "font-label-caps text-label-caps text-on-surface-variant hover:text-primary py-2 border-b border-black/5";
      mobileMenu.appendChild(clonedLink);
    });

    document.body.appendChild(mobileMenu);
  }

  menuButton.addEventListener("click", () => {
    const isHidden = mobileMenu.classList.contains("hidden");
    const iconSpan = menuButton.querySelector(".material-symbols-outlined");
    
    if (isHidden) {
      mobileMenu.classList.remove("hidden");
      if (iconSpan) iconSpan.textContent = "close";
    } else {
      mobileMenu.classList.add("hidden");
      if (iconSpan) iconSpan.textContent = "menu";
    }
  });
}

// Adjust Header Portal Button based on Session state
function setupHeaderSessionWidget() {
  const user = window.HynetAuth ? window.HynetAuth.getCurrentUser() : null;
  
  // Find the Portal/Login button on the public page navbar
  // Usually it has a text like "Portal" or "Soporte" or "Contáctanos"
  // Let's scan all anchors/buttons in the desktop header nav
  const desktopNav = document.querySelector("header nav div.hidden.md\\:flex");
  if (!desktopNav) return;

  // Let's check if we are in a subfolder (portal/) or at root
  const isInPortalFolder = window.location.pathname.includes("/portal/");
  const portalUrlPath = isInPortalFolder ? "login.html" : "portal/login.html";
  const dashboardUrlPath = isInPortalFolder ? "dashboard.html" : "portal/dashboard.html";
  const homePath = isInPortalFolder ? "../index.html" : "index.html";

  // Check if we have a Portal link or we need to add/update it
  // Let's look for a button or link pointing to portal or named "Portal"
  let portalBtn = null;
  const linksAndBtns = desktopNav.querySelectorAll("a, button");
  linksAndBtns.forEach(el => {
    const txt = el.textContent.toLowerCase();
    if (txt.includes("portal") || txt.includes("login") || el.getAttribute("href")?.includes("login.html")) {
      portalBtn = el;
    }
  });

  // If we don't have a portal button, let's look at the last element or append a new one
  if (!portalBtn && linksAndBtns.length > 0) {
    // We can change the last item or append a dedicated Portal item
    const portalAnchor = document.createElement("a");
    portalAnchor.className = "bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:scale-105 active:scale-95 transition-all cursor-pointer";
    portalAnchor.textContent = "Portal Interno";
    portalAnchor.href = portalUrlPath;
    desktopNav.appendChild(portalAnchor);
    portalBtn = portalAnchor;
  }

  // Remove any previously appended desktop logout button to prevent multiple "SALIR" links
  const existingLogoutBtn = desktopNav.querySelector(".desktop-logout-link");
  if (existingLogoutBtn) existingLogoutBtn.remove();

  if (portalBtn) {
    if (user) {
      // User is logged in! Update Portal button to go straight to dashboard
      portalBtn.href = dashboardUrlPath;
      if (portalBtn.tagName === "BUTTON") {
        portalBtn.onclick = () => { window.location.href = dashboardUrlPath; };
      }
      
      // Update text to show active user initials or name
      portalBtn.innerHTML = `
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Panel Operaciones</span>
        </div>
      `;
      
      // Optionally add a mini logout button next to it
      const logoutAnchor = document.createElement("a");
      logoutAnchor.className = "desktop-logout-link text-xs font-label-caps text-outline hover:text-error transition-colors ml-2 cursor-pointer";
      logoutAnchor.textContent = "SALIR";
      logoutAnchor.addEventListener("click", (e) => {
        e.preventDefault();
        window.HynetAuth.logout();
      });
      desktopNav.appendChild(logoutAnchor);
    } else {
      // Not logged in
      portalBtn.href = portalUrlPath;
      if (portalBtn.tagName === "BUTTON") {
        portalBtn.onclick = () => { window.location.href = portalUrlPath; };
      }
      // Revert content to default text if we transitioned from logged in to logged out
      portalBtn.textContent = "Portal Interno";
    }
  }

  // Also update mobile menu session widget
  const mobileMenu = document.getElementById("mobile-menu-container");
  if (mobileMenu) {
    // Remove any existing session widget/portal button on mobile menu to avoid duplicates on re-render
    const existingMobilePortalBtn = mobileMenu.querySelector(".mobile-portal-btn");
    if (existingMobilePortalBtn) existingMobilePortalBtn.remove();
    const existingMobileLogoutBtn = mobileMenu.querySelector(".mobile-logout-btn");
    if (existingMobileLogoutBtn) existingMobileLogoutBtn.remove();

    if (user) {
      // User is logged in! Add dashboard link and logout link
      const mobilePortalBtn = document.createElement("a");
      mobilePortalBtn.className = "mobile-portal-btn w-full text-center py-4 rounded-full font-label-caps text-label-caps bg-primary text-on-primary flex items-center justify-center gap-2 cursor-pointer";
      mobilePortalBtn.href = dashboardUrlPath;
      mobilePortalBtn.innerHTML = `
        <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span>Panel Operaciones</span>
      `;
      mobileMenu.appendChild(mobilePortalBtn);

      const mobileLogoutBtn = document.createElement("a");
      mobileLogoutBtn.className = "mobile-logout-btn w-full text-center py-2 text-xs font-label-caps text-outline hover:text-error transition-colors cursor-pointer";
      mobileLogoutBtn.textContent = "SALIR DE LA SESIÓN";
      mobileLogoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.HynetAuth.logout();
      });
      mobileMenu.appendChild(mobileLogoutBtn);
    } else {
      // Not logged in! Add login link as a button
      const mobilePortalBtn = document.createElement("a");
      mobilePortalBtn.className = "mobile-portal-btn w-full text-center py-4 rounded-full font-label-caps text-label-caps bg-primary text-on-primary block cursor-pointer";
      mobilePortalBtn.href = portalUrlPath;
      mobilePortalBtn.textContent = "Portal Interno";
      mobileMenu.appendChild(mobilePortalBtn);
    }
  }
}

// Scroll Reveal Observer
function setupScrollReveal() {
  const observerOptions = {
    threshold: 0.08,
    rootMargin: "0px 0px -40px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("opacity-100", "translate-y-0");
        entry.target.classList.remove("opacity-0", "translate-y-10");
        observer.unobserve(entry.target); // Reveal once
      }
    });
  }, observerOptions);

  // Target all sections or special reveal items
  document.querySelectorAll("main > section, .scroll-reveal").forEach(el => {
    // Only apply if not already revealed
    if (!el.classList.contains("opacity-100")) {
      el.classList.add("transition-all", "duration-1000", "opacity-0", "translate-y-10");
      observer.observe(el);
    }
  });
}

// Setup Theme Toggle (Light/Dark Mode)
function setupThemeToggle() {
  const currentTheme = localStorage.getItem("hynet_theme") || "light";
  applyTheme(currentTheme);

  // 1. Desktop Nav Button
  const desktopNav = document.querySelector("header nav div.hidden.md\\:flex");
  if (desktopNav) {
    if (!document.getElementById("themeToggleBtn")) {
      const toggleBtn = createThemeToggleBtn("themeToggleBtn");
      const portalBtn = desktopNav.querySelector("a.bg-primary, a[href*='login.html'], button.bg-primary");
      if (portalBtn) {
        desktopNav.insertBefore(toggleBtn, portalBtn);
      } else {
        desktopNav.appendChild(toggleBtn);
      }
    }
  }

  // 2. Mobile Nav Button
  const mobileMenu = document.getElementById("mobile-menu-container");
  if (mobileMenu) {
    if (!document.getElementById("themeToggleBtnMobile")) {
      const toggleBtnMobile = document.createElement("button");
      toggleBtnMobile.id = "themeToggleBtnMobile";
      toggleBtnMobile.type = "button";
      toggleBtnMobile.className = "flex items-center justify-between py-2 border-b border-black/5 font-label-caps text-label-caps text-on-surface-variant w-full text-left outline-none";
      toggleBtnMobile.innerHTML = `
        <span>CAMBIAR TEMA</span>
        <span class="material-symbols-outlined">${currentTheme === "dark" ? "light_mode" : "dark_mode"}</span>
      `;
      toggleBtnMobile.addEventListener("click", (e) => {
        e.preventDefault();
        const nextTheme = localStorage.getItem("hynet_theme") === "dark" ? "light" : "dark";
        localStorage.setItem("hynet_theme", nextTheme);
        applyTheme(nextTheme);
        updateToggleBtnIcons(nextTheme);
      });
      mobileMenu.insertBefore(toggleBtnMobile, mobileMenu.firstChild);
    }
  }
}

function createThemeToggleBtn(id) {
  const btn = document.createElement("button");
  btn.id = id;
  btn.type = "button";
  btn.className = "p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors flex items-center justify-center cursor-pointer outline-none";
  btn.innerHTML = `<span class="material-symbols-outlined">${localStorage.getItem("hynet_theme") === "dark" ? "light_mode" : "dark_mode"}</span>`;
  
  btn.addEventListener("click", () => {
    const nextTheme = localStorage.getItem("hynet_theme") === "dark" ? "light" : "dark";
    localStorage.setItem("hynet_theme", nextTheme);
    applyTheme(nextTheme);
    updateToggleBtnIcons(nextTheme);
  });
  return btn;
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
  } else {
    document.documentElement.classList.add("light");
    document.documentElement.classList.remove("dark");
  }
  updateLogos(theme);
}

function updateLogos(theme) {
  const images = document.querySelectorAll("img");
  images.forEach(img => {
    const src = img.getAttribute("src");
    if (!src) return;
    
    if (theme === "dark") {
      if (src.includes("Logo-Hynet25-Color_100px.png")) {
        img.setAttribute("src", src.replace("Logo-Hynet25-Color_100px.png", "Logo-Hynet25-Color_blanco.png"));
      }
    } else {
      if (src.includes("Logo-Hynet25-Color_blanco.png")) {
        img.setAttribute("src", src.replace("Logo-Hynet25-Color_blanco.png", "Logo-Hynet25-Color_100px.png"));
      }
    }
  });
}

function updateToggleBtnIcons(theme) {
  const desktopIcon = document.querySelector("#themeToggleBtn .material-symbols-outlined");
  if (desktopIcon) {
    desktopIcon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
  }
  const mobileLabel = document.querySelector("#themeToggleBtnMobile span:last-child");
  if (mobileLabel) {
    mobileLabel.textContent = theme === "dark" ? "light_mode" : "dark_mode";
  }
}

// Setup Contact Form Submissions for Home and Contact pages
function setupContactForms() {
  const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz3Z8oF13p2rbbmysQJ5ihXtICyUuIUV1nG2pA6RBi95g9llTkRyk0FrU1gLSAHrleZ/exec";
  const SECRET_TOKEN = "HYNET_2026_SECURE_API";

  console.log("[Hynet Contact] Inicializando escucha de formularios de contacto...");

  const forms = [
    {
      id: "homeContactForm",
      nameId: "homeContactName",
      companyId: "homeContactCompany",
      countryId: "homeContactCountry",
      phoneId: "homeContactPhone",
      emailId: "homeContactEmail",
      messageId: "homeContactMessage"
    },
    {
      id: "contactMainForm",
      nameId: "contactName",
      companyId: "contactCompany",
      countryId: "contactCountry",
      phoneId: "contactPhone",
      emailId: "contactEmail",
      messageId: "contactMessage"
    }
  ];

  forms.forEach(formConfig => {
    const formEl = document.getElementById(formConfig.id);
    if (!formEl) {
      console.log(`[Hynet Contact] Formulario con ID "${formConfig.id}" no encontrado en esta página.`);
      return;
    }

    console.log(`[Hynet Contact] Formulario detectado y listo: "${formConfig.id}"`);

    formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log(`[Hynet Contact] Envío detectado en formulario: "${formConfig.id}"`);
      
      const btn = formEl.querySelector("button[type='submit']");
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined animate-spin">sync</span> Enviando...';
      btn.disabled = true;

      // Obtener valores de los inputs
      const nameVal = document.getElementById(formConfig.nameId).value;
      const companyVal = document.getElementById(formConfig.companyId).value;
      const countryVal = document.getElementById(formConfig.countryId).value;
      const phoneVal = document.getElementById(formConfig.phoneId).value;
      const emailVal = document.getElementById(formConfig.emailId).value;
      const messageVal = document.getElementById(formConfig.messageId).value;

      console.log(`[Hynet Contact] Datos extraídos del formulario:`, {
        name: nameVal,
        company: companyVal,
        country: countryVal,
        phone: phoneVal,
        email: emailVal,
        message: messageVal
      });

      const payload = {
        token: SECRET_TOKEN,
        name: nameVal,
        email: emailVal,
        message: messageVal,
        company: companyVal,
        country: countryVal,
        phone: phoneVal
      };

      console.log(`[Hynet Contact] Payload completo generado para enviar:`, payload);

      if (GOOGLE_APPS_SCRIPT_URL) {
        console.log(`[Hynet Contact] Iniciando petición POST HTTP (mode: no-cors) a URL: ${GOOGLE_APPS_SCRIPT_URL}`);
        
        fetch(GOOGLE_APPS_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        })
        .then((response) => {
          console.log(`[Hynet Contact] Petición enviada con éxito. Respuesta recibida (modo no-cors):`, response);
          showSuccessState();
        })
        .catch(err => {
          console.error(`[Hynet Contact] Error crítico al intentar enviar mediante fetch en ${formConfig.id}:`, err);
          alert("Hubo un error de conexión al enviar el mensaje. Sin embargo, su consulta ha sido simulada en el cliente.");
          showSuccessState();
        });
      } else {
        console.warn("[Hynet Contact] GOOGLE_APPS_SCRIPT_URL está vacía. Simulando envío en cliente...");
        setTimeout(() => {
          showSuccessState();
        }, 1500);
      }

      function showSuccessState() {
        console.log(`[Hynet Contact] Mostrando estado de éxito en el botón de submit.`);
        btn.innerHTML = '¡ENVIADO CORRECTAMENTE! <span class="material-symbols-outlined">done</span>';
        
        btn.classList.remove("bg-primary");
        btn.classList.add("bg-emerald-600");
        
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.classList.remove("bg-emerald-600");
          btn.classList.add("bg-primary");
          btn.disabled = false;
          formEl.reset();
          console.log(`[Hynet Contact] Formulario resetado y botón restablecido.`);
        }, 3000);
      }
    });
  });
}


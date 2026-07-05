// Common UI Helper functions for Hynet site
// Manages menus, session widgets on public header, scroll reveals

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupMobileMenu();
  setupHeaderSessionWidget();
  setupScrollReveal();
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
      const clonedLink = link.cloneNode(true);
      clonedLink.className = "font-label-caps text-label-caps text-on-surface-variant hover:text-primary py-2 border-b border-black/5";
      mobileMenu.appendChild(clonedLink);
    });

    // Check if there is a primary button (Portal/Soporte/Contacto)
    const actionBtn = document.querySelector("header nav div.hidden.md\\:flex button, header nav div.hidden.md\\:flex .bg-primary");
    if (actionBtn) {
      const clonedBtn = actionBtn.cloneNode(true);
      clonedBtn.className = "w-full text-center py-4 rounded-full font-label-caps text-label-caps " + 
        (actionBtn.classList.contains("bg-primary") ? "bg-primary text-on-primary" : "bg-inverse-surface text-inverse-on-surface");
      
      // If it is an anchor, preserve link
      if (actionBtn.tagName === "A") {
        clonedBtn.href = actionBtn.href;
      } else {
        // Mock click
        clonedBtn.addEventListener("click", () => {
          if (actionBtn.onclick) actionBtn.onclick();
          else {
            const hrefAttr = actionBtn.getAttribute("data-href");
            if (hrefAttr) window.location.href = hrefAttr;
          }
        });
      }
      mobileMenu.appendChild(clonedBtn);
    }

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
    const lastItem = linksAndBtns[linksAndBtns.length - 1];
    // If lastItem is just Contacto, let's append Portal
    const portalAnchor = document.createElement("a");
    portalAnchor.className = "bg-primary text-on-primary px-6 py-2 rounded-full font-label-caps text-label-caps hover:scale-105 active:scale-95 transition-all cursor-pointer";
    portalAnchor.textContent = "Portal Interno";
    portalAnchor.href = portalUrlPath;
    desktopNav.appendChild(portalAnchor);
    portalBtn = portalAnchor;
  }

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
      logoutAnchor.className = "text-xs font-label-caps text-outline hover:text-error transition-colors ml-2 cursor-pointer";
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
        <span>TEMA: MODULO</span>
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


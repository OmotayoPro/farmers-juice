import headerHtml from "../sections/header.html?raw";
import pdpHeroHtml from "../sections/pdp-hero.html?raw";
import nutritionFactsHtml from "../sections/nutrition-facts.html?raw";
import productGridHtml from "../sections/product-grid.html?raw";

function mountSections() {
  const headerMount = document.getElementById("header-mount");
  if (headerMount) headerMount.innerHTML = headerHtml;

  const heroMount = document.getElementById("pdp-hero-mount");
  if (heroMount) heroMount.innerHTML = pdpHeroHtml;

  const nutritionMount = document.getElementById("nutrition-facts-mount");
  if (nutritionMount) nutritionMount.innerHTML = nutritionFactsHtml;

  const gridMount = document.getElementById("product-grid-mount");
  if (gridMount) gridMount.innerHTML = productGridHtml;
}

function initGallery(root) {
  const gallery = root.querySelector("[data-gallery]");
  if (!gallery) return;

  const mainImage = gallery.querySelector("[data-gallery-main]");
  const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-thumb]"));
  const prevBtn = gallery.querySelector("[data-gallery-prev]");
  const nextBtn = gallery.querySelector("[data-gallery-next]");
  let activeIndex = 0;

  function setActive(index) {
    activeIndex = (index + thumbs.length) % thumbs.length;
    thumbs.forEach((thumb, i) => {
      const isActive = i === activeIndex;
      thumb.classList.toggle("is-active", isActive);
      thumb.setAttribute("aria-current", isActive ? "true" : "false");
    });
    const activeImg = thumbs[activeIndex].querySelector("img");
    if (activeImg && mainImage) {
      mainImage.src = activeImg.src;
    }
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }

  thumbs.forEach((thumb, i) => {
    thumb.addEventListener("click", () => setActive(i));
    thumb.addEventListener("mouseenter", () => setActive(i));
    thumb.addEventListener("focus", () => setActive(i));
  });

  if (prevBtn) prevBtn.addEventListener("click", () => setActive(activeIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => setActive(activeIndex + 1));

  setActive(0);
}

function initSelectBox(root) {
  const trigger = root.querySelector("[data-dropdown-trigger]");
  const panel = root.querySelector("[data-dropdown-panel]");
  if (!trigger || !panel) return;

  function close() {
    trigger.setAttribute("aria-expanded", "false");
    panel.hidden = true;
  }

  function open() {
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  }

  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  document.addEventListener("click", (event) => {
    if (trigger.contains(event.target) || panel.contains(event.target)) return;
    close();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
      close();
      trigger.focus();
    }
  });
}

function initOptionGroups(root) {
  root.querySelectorAll("[data-option-group]").forEach((group) => {
    const buttons = Array.from(group.querySelectorAll("[data-option-btn]"));
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.toggle("is-selected", b === btn));
      });
    });
  });
}

function initSubscriptionToggle(root) {
  const row = root.querySelector("[data-subscription-trigger]");
  if (!row) return;
  row.addEventListener("click", () => {
    const isOpen = row.getAttribute("aria-expanded") === "true";
    row.setAttribute("aria-expanded", isOpen ? "false" : "true");
  });
}

/* ---- Nutrition-facts modal: closed -> modal open -> zoom open.
   X / Back / Escape / backdrop each pop exactly one level. ---- */
const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function trapFocus(container, event) {
  if (event.key !== "Tab") return;
  const focusable = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null
  );
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function initNutritionModal() {
  const overlay = document.querySelector("[data-nutrition-overlay]");
  if (!overlay) return null;

  const backdrop = overlay.querySelector("[data-nutrition-backdrop]");
  const modal = overlay.querySelector("[data-nutrition-modal]");
  const zoom = overlay.querySelector("[data-nutrition-zoom]");
  const zoomImage = overlay.querySelector("[data-nutrition-zoom-image]");
  const modalCloseBtn = overlay.querySelector("[data-nutrition-close]");
  const zoomCloseBtn = overlay.querySelector("[data-nutrition-close-zoom]");
  const backBtn = overlay.querySelector("[data-nutrition-back]");
  const images = Array.from(overlay.querySelectorAll("[data-nutrition-image]"));
  const filterButtons = Array.from(overlay.querySelectorAll("[data-nutrition-filter]"));

  let triggerEl = null;
  let isZoomed = false;

  function isOpen() {
    return !overlay.hidden;
  }

  function openModal(trigger) {
    triggerEl = trigger || null;
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    modalCloseBtn.focus();
  }

  function openZoom(imageSrc, imageAlt) {
    isZoomed = true;
    zoomImage.src = imageSrc;
    zoomImage.alt = imageAlt;
    modal.classList.add("is-dimmed");
    zoom.hidden = false;
    zoomCloseBtn.focus();
  }

  function closeZoom() {
    isZoomed = false;
    zoom.hidden = true;
    modal.classList.remove("is-dimmed");
  }

  function closeModal() {
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
    if (triggerEl) triggerEl.focus();
    triggerEl = null;
  }

  function popOneLevel() {
    if (!isOpen()) return;
    if (isZoomed) {
      closeZoom();
      modalCloseBtn.focus();
    } else {
      closeModal();
    }
  }

  images.forEach((btn) => {
    btn.addEventListener("click", () => {
      const img = btn.querySelector("img");
      openZoom(img.src, img.alt);
    });
  });

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.toggle("is-selected", b === btn));
    });
  });

  modalCloseBtn.addEventListener("click", popOneLevel);
  zoomCloseBtn.addEventListener("click", popOneLevel);
  backBtn.addEventListener("click", popOneLevel);
  backdrop.addEventListener("click", popOneLevel);

  document.addEventListener("keydown", (event) => {
    if (!isOpen()) return;
    if (event.key === "Escape") {
      popOneLevel();
      return;
    }
    trapFocus(isZoomed ? zoom : modal, event);
  });

  return { open: openModal };
}

function initNutritionTrigger(root, nutritionModal) {
  const trigger = root.querySelector("[data-nutrition-trigger]");
  if (!trigger || !nutritionModal) return;
  trigger.addEventListener("click", () => nutritionModal.open(trigger));
}

/* ---- Product grid filtering ---- */
function initProductGrid() {
  const section = document.querySelector('[data-section="product-grid"]');
  if (!section) return;

  const filterButtons = Array.from(section.querySelectorAll("[data-grid-filter]"));
  const cards = Array.from(section.querySelectorAll(".juice-card"));
  const emptyState = section.querySelector("[data-juice-grid-empty]");

  function applyFilter(category) {
    let visibleCount = 0;
    cards.forEach((card) => {
      const categories = (card.dataset.categories || "").split(" ");
      const matches = categories.includes(category);
      card.classList.toggle("is-hidden", !matches);
      if (matches) visibleCount += 1;
    });
    if (emptyState) emptyState.hidden = visibleCount > 0;
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterButtons.forEach((b) => b.classList.toggle("is-selected", b === btn));
      applyFilter(btn.dataset.gridFilter);
    });
  });

  applyFilter("green-juices");
}

function initPdpHero(nutritionModal) {
  const root = document.querySelector('[data-section="pdp-hero"]');
  if (!root) return;
  initGallery(root);
  initSelectBox(root);
  initOptionGroups(root);
  initSubscriptionToggle(root);
  initNutritionTrigger(root, nutritionModal);
}

mountSections();
const nutritionModal = initNutritionModal();
initPdpHero(nutritionModal);
initProductGrid();

/**
 * Portal Leaflet & Edukasi Pasien - MRCCC Siloam Hospitals
 * Engine Flipbook 3D & Manajemen Repositori Dokumen
 */

// Konfigurasi Halaman Leaflet
const LEAFLET_PAGES = [
  {
    num: 1,
    title: "Sampul Utama: Cara Penggunaan Ozempic Semaglutide",
    chapter: "Sampul Depan",
    file: "assets/panels/page-1.png"
  },
  {
    num: 2,
    title: "Langkah 1: Kenali Bagian-bagian Pena Ozempic",
    chapter: "Langkah 1: Anatomi Pena",
    file: "assets/panels/page-2.png"
  },
  {
    num: 3,
    title: "Langkah 2: Persiapkan Pena & Pasang Jarum Baru",
    chapter: "Langkah 2: Persiapan & Jarum",
    file: "assets/panels/page-3.png"
  },
  {
    num: 4,
    title: "Langkah 3 & 4: Periksa Aliran & Pilih Dosis",
    chapter: "Langkah 3 & 4: Aliran & Dosis",
    file: "assets/panels/page-4.png"
  },
  {
    num: 5,
    title: "Langkah 5: Prosedur Injeksi Mandiri & Hitungan 6 Detik",
    chapter: "Langkah 5: Teknik Injeksi",
    file: "assets/panels/page-5.png"
  },
  {
    num: 6,
    title: "Selesai: Buang Jarum & Panduan Perawatan Pena",
    chapter: "Selesai & Perawatan Pena",
    file: "assets/panels/page-6.png"
  }
];

// State Aplikasi
const state = {
  activeCategory: "all",
  searchQuery: "",
  viewMode: "grid", // 'grid' | 'list'
  
  // State Viewer Flipbook
  isViewerOpen: false,
  isSpreadMode: window.innerWidth >= 820,
  currentPage: 1, // 1 s.d. 6
  currentSpread: 0, // 0: Cover (P1), 1: P2-P3, 2: P4-P5, 3: P6
  zoomLevel: 1.0,
  isAnimating: false,
  
  // Touch Gestures
  touchStartX: 0,
  touchStartY: 0
};

// =============================================================
// Inisialisasi & Event Listeners
// =============================================================
document.addEventListener("DOMContentLoaded", () => {
  initDriveControls();
  initViewerControls();
  initKeyboardNav();
  initTouchGestures();
  applyFilters();
  
  // Responsif resize untuk mode default buku
  window.addEventListener("resize", () => {
    if (window.innerWidth < 820 && state.isSpreadMode) {
      setSpreadMode(false);
    }
  });
});

// =============================================================
// 1. Logika Repositori Dokumen (Drive)
// =============================================================
function initDriveControls() {
  const searchInput = document.getElementById("search-input");
  const searchClearBtn = document.getElementById("search-clear-btn");
  const filterPills = document.querySelectorAll(".filter-pill");
  const btnGrid = document.getElementById("btn-view-grid");
  const btnList = document.getElementById("btn-view-list");

  // Input Pencarian
  searchInput.addEventListener("input", (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    searchClearBtn.hidden = state.searchQuery.length === 0;
    applyFilters();
  });

  searchClearBtn.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    searchClearBtn.hidden = true;
    searchInput.focus();
    applyFilters();
  });

  // Filter Kategori Pills
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => {
        p.classList.remove("active");
        p.setAttribute("aria-checked", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-checked", "true");
      state.activeCategory = pill.dataset.category;
      applyFilters();
    });
  });

  // Toggle Mode Kisi vs Daftar
  btnGrid.addEventListener("click", () => {
    setViewMode("grid");
  });

  btnList.addEventListener("click", () => {
    setViewMode("list");
  });

  // Tombol Breadcrumb Drive
  const breadcrumbBtn = document.querySelector(".breadcrumb-btn");
  if (breadcrumbBtn) {
    breadcrumbBtn.addEventListener("click", () => {
      resetSearchFilter();
      const driveSection = document.getElementById("katalog-drive");
      if (driveSection) {
        driveSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }
}

function setViewMode(mode) {
  state.viewMode = mode;
  const gridContainer = document.getElementById("documents-grid");
  const btnGrid = document.getElementById("btn-view-grid");
  const btnList = document.getElementById("btn-view-list");

  if (mode === "grid") {
    gridContainer.className = "documents-grid view-grid";
    btnGrid.classList.add("active");
    btnGrid.setAttribute("aria-pressed", "true");
    btnList.classList.remove("active");
    btnList.setAttribute("aria-pressed", "false");
  } else {
    gridContainer.className = "documents-grid view-list";
    btnList.classList.add("active");
    btnList.setAttribute("aria-pressed", "true");
    btnGrid.classList.remove("active");
    btnGrid.setAttribute("aria-pressed", "false");
  }
}

function applyFilters() {
  const cards = document.querySelectorAll(".doc-card");
  const emptyState = document.getElementById("search-empty-state");
  const docCounter = document.getElementById("doc-counter");
  let visibleCount = 0;

  cards.forEach((card) => {
    const cardCategory = card.dataset.category;
    const cardTitle = card.dataset.title;

    const matchesCategory = state.activeCategory === "all" || cardCategory === state.activeCategory;
    const matchesSearch = !state.searchQuery || cardTitle.includes(state.searchQuery);

    if (matchesCategory && matchesSearch) {
      card.style.display = "";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  if (emptyState) {
    emptyState.hidden = visibleCount > 0;
  }

  if (docCounter) {
    docCounter.textContent = `${visibleCount} Dokumen Tersedia`;
  }
}

function filterBySpecialty(category) {
  const allPills = document.querySelectorAll(".filter-pill");
  allPills.forEach((p) => {
    const isTarget = p.dataset.category === category;
    p.classList.toggle("active", isTarget);
    p.setAttribute("aria-checked", isTarget ? "true" : "false");
  });
  state.activeCategory = category;
  applyFilters();
  const driveSection = document.getElementById("katalog-drive");
  if (driveSection) {
    driveSection.scrollIntoView({ behavior: "smooth" });
  }
}

function resetSearchFilter() {
  const searchInput = document.getElementById("search-input");
  const searchClearBtn = document.getElementById("search-clear-btn");
  const allPill = document.querySelector('.filter-pill[data-category="all"]');

  if (searchInput) searchInput.value = "";
  state.searchQuery = "";
  if (searchClearBtn) searchClearBtn.hidden = true;
  
  if (allPill) {
    document.querySelectorAll(".filter-pill").forEach((p) => {
      p.classList.remove("active");
      p.setAttribute("aria-checked", "false");
    });
    allPill.classList.add("active");
    allPill.setAttribute("aria-checked", "true");
    state.activeCategory = "all";
  }

  applyFilters();
}

function alertInfoDoc(docName) {
  let toast = document.getElementById("info-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "info-toast";
    toast.className = "info-toast";
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<strong>${docName}</strong><p style="margin-top:4px;font-size:12.5px;">Dokumen fisik cetak tersedia di konter farmasi rawat jalan MRCCC Siloam Hospitals.</p>`;
  toast.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}

function downloadOriginal(filename) {
  // Buka gambar asli di tab baru agar aman diakses di protokol web maupun file:///
  window.open(filename, "_blank");
}

// =============================================================
// 2. Logika Flipbook Viewer 3D
// =============================================================
function initViewerControls() {
  // Tombol Escape menutup modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.isViewerOpen) {
      closeFlipbook();
    }
  });
}

function openFlipbook(docId) {
  if (docId !== "ozempic") return;

  const modal = document.getElementById("flipbook-modal");
  if (!modal) return;
  modal.removeAttribute("hidden");
  modal.classList.add("is-open");
  modal.style.display = "flex";
  state.isViewerOpen = true;
  state.currentPage = 1;
  state.currentSpread = 0;
  state.zoomLevel = 1.0;
  
  document.body.style.overflow = "hidden";
  applyZoom();
  renderFlipbook();
}

function closeFlipbook() {
  const modal = document.getElementById("flipbook-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("hidden", "");
  modal.style.display = "none";
  state.isViewerOpen = false;
  document.body.style.overflow = "";
}

function setSpreadMode(isSpread) {
  state.isSpreadMode = isSpread;
  const btnSpread = document.getElementById("btn-mode-spread");
  const btnSingle = document.getElementById("btn-mode-single");
  const bookContainer = document.getElementById("book-container");

  if (isSpread) {
    btnSpread.classList.add("active");
    btnSingle.classList.remove("active");
    bookContainer.classList.remove("mode-single");
    bookContainer.classList.add("mode-spread");
    
    // Konversi halaman aktif ke spread
    if (state.currentPage === 1) state.currentSpread = 0;
    else if (state.currentPage === 2 || state.currentPage === 3) state.currentSpread = 1;
    else if (state.currentPage === 4 || state.currentPage === 5) state.currentSpread = 2;
    else if (state.currentPage === 6) state.currentSpread = 3;
  } else {
    btnSingle.classList.add("active");
    btnSpread.classList.remove("active");
    bookContainer.classList.remove("mode-spread");
    bookContainer.classList.add("mode-single");
  }

  renderFlipbook();
}

function renderFlipbook() {
  const bookContainer = document.getElementById("book-container");
  const leaves = [
    document.getElementById("leaf-1"),
    document.getElementById("leaf-2"),
    document.getElementById("leaf-3")
  ];
  const prevBtn = document.getElementById("btn-prev-page");
  const nextBtn = document.getElementById("btn-next-page");
  const counterText = document.getElementById("current-page-num");
  const chapterText = document.getElementById("current-chapter-label");
  const thumbBtns = document.querySelectorAll(".thumb-btn");

  if (!bookContainer || !leaves[0]) return;

  if (state.isSpreadMode) {
    // Mode Buku Fisik Terbuka (Spread 2 Halaman)
    const spreadIndex = state.currentSpread;

    bookContainer.classList.remove("mode-single");
    bookContainer.classList.add("mode-spread");
    leaves.forEach((l) => {
      l.classList.remove("single-leaf-active");
      l.querySelectorAll(".leaf-face").forEach((f) => f.classList.remove("single-face-active"));
    });

    if (spreadIndex === 0) {
      // Sampul Depan (P1)
      bookContainer.classList.add("cover-view");
      bookContainer.classList.remove("back-cover-view");
      leaves[0].classList.remove("flipped");
      leaves[1].classList.remove("flipped");
      leaves[2].classList.remove("flipped");

      counterText.textContent = "1";
      chapterText.textContent = LEAFLET_PAGES[0].title;
      prevBtn.disabled = true;
      nextBtn.disabled = false;
    } else if (spreadIndex === 1) {
      // Lembar 1 dibalik ke kiri (P2 di kiri, P3 di kanan)
      bookContainer.classList.remove("cover-view");
      bookContainer.classList.remove("back-cover-view");
      leaves[0].classList.add("flipped");
      leaves[1].classList.remove("flipped");
      leaves[2].classList.remove("flipped");

      counterText.textContent = "2 - 3";
      chapterText.textContent = "Langkah 1 & 2: Anatomi & Persiapan Jarum";
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    } else if (spreadIndex === 2) {
      // Lembar 1 & 2 dibalik ke kiri (P4 di kiri, P5 di kanan)
      bookContainer.classList.remove("cover-view");
      bookContainer.classList.remove("back-cover-view");
      leaves[0].classList.add("flipped");
      leaves[1].classList.add("flipped");
      leaves[2].classList.remove("flipped");

      counterText.textContent = "4 - 5";
      chapterText.textContent = "Langkah 3 s.d. 5: Dosis & Prosedur Injeksi";
      prevBtn.disabled = false;
      nextBtn.disabled = false;
    } else if (spreadIndex === 3) {
      // Lembar 1, 2, 3 semua dibalik ke kiri (P6 di kiri - Sampul Belakang)
      bookContainer.classList.remove("cover-view");
      bookContainer.classList.add("back-cover-view");
      leaves[0].classList.add("flipped");
      leaves[1].classList.add("flipped");
      leaves[2].classList.add("flipped");

      counterText.textContent = "6";
      chapterText.textContent = LEAFLET_PAGES[5].title;
      prevBtn.disabled = false;
      nextBtn.disabled = true;
    }

    // Highlight Thumbnail
    thumbBtns.forEach((btn) => {
      const targetPage = parseInt(btn.dataset.target, 10);
      let isActive = false;
      if (spreadIndex === 0 && targetPage === 1) isActive = true;
      else if (spreadIndex === 1 && (targetPage === 2 || targetPage === 3)) isActive = true;
      else if (spreadIndex === 2 && (targetPage === 4 || targetPage === 5)) isActive = true;
      else if (spreadIndex === 3 && targetPage === 6) isActive = true;

      btn.classList.toggle("active", isActive);
    });

  } else {
    // Mode Halaman Tunggal (Single Page Focus)
    bookContainer.classList.remove("cover-view");
    bookContainer.classList.remove("back-cover-view");
    bookContainer.classList.remove("mode-spread");
    bookContainer.classList.add("mode-single");

    const pageNum = state.currentPage;
    const leafIndex = Math.floor((pageNum - 1) / 2); // 0, 1, atau 2
    const isFront = (pageNum % 2) === 1;

    leaves.forEach((l, idx) => {
      if (idx === leafIndex) {
        l.classList.add("single-leaf-active");
        const frontFace = l.querySelector(".face-front");
        const backFace = l.querySelector(".face-back");
        if (isFront && frontFace) {
          frontFace.classList.add("single-face-active");
          if (backFace) backFace.classList.remove("single-face-active");
        } else if (!isFront && backFace) {
          backFace.classList.add("single-face-active");
          if (frontFace) frontFace.classList.remove("single-face-active");
        }
      } else {
        l.classList.remove("single-leaf-active");
        l.querySelectorAll(".leaf-face").forEach((f) => f.classList.remove("single-face-active"));
      }
    });

    counterText.textContent = `${pageNum}`;
    chapterText.textContent = LEAFLET_PAGES[pageNum - 1].title;

    prevBtn.disabled = pageNum <= 1;
    nextBtn.disabled = pageNum >= 6;

    thumbBtns.forEach((btn) => {
      const targetPage = parseInt(btn.dataset.target, 10);
      btn.classList.toggle("active", targetPage === pageNum);
    });
  }
}

function flipNext() {
  if (state.isAnimating) return;

  if (state.isSpreadMode) {
    if (state.currentSpread < 3) {
      state.isAnimating = true;
      const targetLeafIndex = state.currentSpread;
      const leaves = [
        document.getElementById("leaf-1"),
        document.getElementById("leaf-2"),
        document.getElementById("leaf-3")
      ];
      const leafToFlip = leaves[targetLeafIndex];
      const bookContainer = document.getElementById("book-container");

      if (leafToFlip) {
        leafToFlip.classList.add("is-turning");
        leafToFlip.classList.add("flipped");

        // Geser posisi container secara serentak dan halus
        if (state.currentSpread === 0 && bookContainer) {
          bookContainer.classList.remove("cover-view");
        } else if (state.currentSpread === 2 && bookContainer) {
          bookContainer.classList.add("back-cover-view");
        }

        setTimeout(() => {
          leafToFlip.classList.remove("is-turning");
          state.currentSpread++;
          state.isAnimating = false;
          renderFlipbook();
        }, 650);
      } else {
        state.currentSpread++;
        renderFlipbook();
      }
    }
  } else {
    if (state.currentPage < 6) {
      state.currentPage++;
      renderFlipbook();
    }
  }
}

function flipPrev() {
  if (state.isAnimating) return;

  if (state.isSpreadMode) {
    if (state.currentSpread > 0) {
      state.isAnimating = true;
      const targetLeafIndex = state.currentSpread - 1;
      const leaves = [
        document.getElementById("leaf-1"),
        document.getElementById("leaf-2"),
        document.getElementById("leaf-3")
      ];
      const leafToFlip = leaves[targetLeafIndex];
      const bookContainer = document.getElementById("book-container");

      if (leafToFlip) {
        leafToFlip.classList.add("is-turning");
        leafToFlip.classList.remove("flipped");

        // Geser posisi container secara serentak dan halus
        if (state.currentSpread === 1 && bookContainer) {
          bookContainer.classList.add("cover-view");
        } else if (state.currentSpread === 3 && bookContainer) {
          bookContainer.classList.remove("back-cover-view");
        }

        setTimeout(() => {
          leafToFlip.classList.remove("is-turning");
          state.currentSpread--;
          state.isAnimating = false;
          renderFlipbook();
        }, 650);
      } else {
        state.currentSpread--;
        renderFlipbook();
      }
    }
  } else {
    if (state.currentPage > 1) {
      state.currentPage--;
      renderFlipbook();
    }
  }
}

function goToPage(pageNum) {
  if (state.isAnimating) return;

  pageNum = Math.max(1, Math.min(6, pageNum));
  state.currentPage = pageNum;

  if (state.isSpreadMode) {
    if (pageNum === 1) state.currentSpread = 0;
    else if (pageNum === 2 || pageNum === 3) state.currentSpread = 1;
    else if (pageNum === 4 || pageNum === 5) state.currentSpread = 2;
    else if (pageNum === 6) state.currentSpread = 3;
  }

  renderFlipbook();
}

function handleFaceClick(pageNum) {
  if (state.isSpreadMode) {
    if (pageNum === 1 || pageNum === 3 || pageNum === 5) {
      flipNext();
    } else {
      flipPrev();
    }
  } else {
    flipNext();
  }
}

function handlePageClick(pageNum) {
  handleFaceClick(pageNum);
}

// =============================================================
// 3. Kontrol Zoom & Panning
// =============================================================
function adjustZoom(delta) {
  state.zoomLevel = Math.max(0.7, Math.min(2.0, state.zoomLevel + delta));
  applyZoom();
}

function resetZoom() {
  state.zoomLevel = 1.0;
  applyZoom();
}

function applyZoom() {
  const viewport = document.getElementById("book-viewport");
  const zoomText = document.getElementById("zoom-level-text");
  
  if (viewport) {
    viewport.style.transform = `scale(${state.zoomLevel})`;
  }
  if (zoomText) {
    zoomText.textContent = `${Math.round(state.zoomLevel * 100)}%`;
  }
}

// =============================================================
// 4. Navigasi Keyboard (WCAG AA R-32)
// =============================================================
function initKeyboardNav() {
  window.addEventListener("keydown", (e) => {
    if (!state.isViewerOpen) return;

    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      flipNext();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      flipPrev();
    } else if (e.key === "+" || e.key === "=") {
      e.preventDefault();
      adjustZoom(0.15);
    } else if (e.key === "-") {
      e.preventDefault();
      adjustZoom(-0.15);
    } else if (e.key === "0") {
      e.preventDefault();
      resetZoom();
    }
  });
}

// =============================================================
// 5. Gestur Sentuh / Swipe Ponsel (Mobile Friendly)
// =============================================================
function initTouchGestures() {
  const stage = document.getElementById("viewer-stage");
  if (!stage) return;

  stage.addEventListener("touchstart", (e) => {
    state.touchStartX = e.changedTouches[0].screenX;
    state.touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].screenX;
    const endY = e.changedTouches[0].screenY;
    const deltaX = endX - state.touchStartX;
    const deltaY = endY - state.touchStartY;

    // Deteksi swipe horizontal jika lebih dominan dari vertikal
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swipe ke kiri -> Halaman Selanjutnya
        flipNext();
      } else {
        // Swipe ke kanan -> Halaman Sebelumnya
        flipPrev();
      }
    }
  }, { passive: true });
}

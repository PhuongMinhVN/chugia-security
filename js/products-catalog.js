/**
 * CHU GIA SECURITY - PRODUCTS CATALOG CONTROLLER
 * Đồng bộ 469 sản phẩm từ HTA Vietnam (Sapo Landing Order)
 * Quy tắc tính giá: Giá nhập x 130% (+30%) ra Giá bán lẻ niêm yết
 * Hotline: 0941204125
 */

(function () {
  'use strict';

  // Format currency helper
  function formatVND(amount) {
    if (!amount || amount <= 0) return 'Liên hệ';
    return amount.toLocaleString('vi-VN') + ' ₫';
  }

  // Application State
  const state = {
    products: [],
    categories: [],
    filteredProducts: [],
    selectedCategoryId: -1,
    selectedBrand: 'all',
    selectedPriceRange: 'all',
    searchQuery: '',
    sortBy: 'default',
    currentPage: 1,
    itemsPerPage: 24,
    currentModalProduct: null
  };

  // DOM Elements
  const el = {
    searchHeroInput: document.getElementById('catalogSearchHero'),
    searchHeroClear: document.getElementById('catalogSearchClear'),
    quickPills: document.getElementById('quickCategoryPills'),
    pillNavPrev: document.getElementById('pillNavPrev'),
    pillNavNext: document.getElementById('pillNavNext'),
    sidebarCats: document.getElementById('sidebarCategoryList'),
    brandFilters: document.getElementById('brandFilters'),
    priceRadios: document.querySelectorAll('input[name="priceFilter"]'),
    sortSelect: document.getElementById('catalogSortSelect'),
    resultCount: document.getElementById('resultCountNumber'),
    activeFilterTags: document.getElementById('activeFilterTags'),
    productsGrid: document.getElementById('productsGrid'),
    pagination: document.getElementById('catalogPagination'),
    mobileFilterBtn: document.getElementById('mobileFilterBtn'),
    catalogSidebar: document.getElementById('catalogSidebar'),
    sidebarBackdrop: document.getElementById('sidebarBackdrop'),
    // Quick View Modal
    quickViewModal: document.getElementById('quickViewModal'),
    modalCloseBtn: document.getElementById('modalCloseBtn'),
    modalMainImg: document.getElementById('modalMainImg'),
    modalThumbs: document.getElementById('modalThumbs'),
    modalBrandTag: document.getElementById('modalBrandTag'),
    modalTitle: document.getElementById('modalTitle'),
    modalSku: document.getElementById('modalSku'),
    modalCategory: document.getElementById('modalCategory'),
    modalWarranty: document.getElementById('modalWarranty'),
    modalRetailPrice: document.getElementById('modalRetailPrice'),
    modalOldPrice: document.getElementById('modalOldPrice'),
    modalDiscountTag: document.getElementById('modalDiscountTag'),
    modalSpecsList: document.getElementById('modalSpecsList'),
    modalZaloBtn: document.getElementById('modalZaloBtn'),
    modalCallBtn: document.getElementById('modalCallBtn'),
    modalShareBtn: document.getElementById('modalShareBtn'),
    // QR Share Modal
    qrModal: document.getElementById('qrShareModal'),
    qrModalClose: document.getElementById('qrModalClose'),
    qrShareCanvas: document.getElementById('qrShareCanvas'),
    qrDownloadBtn: document.getElementById('qrDownloadBtn'),
    qrCopyLinkBtn: document.getElementById('qrCopyLinkBtn'),
    qrShareTitle: document.getElementById('qrShareTitle')
  };

  // Initialize
  function init() {
    if (!window.HTA_PRODUCTS_DATA) {
      console.error('HTA_PRODUCTS_DATA not found.');
      return;
    }

    state.products = window.HTA_PRODUCTS_DATA.products || [];
    state.categories = window.HTA_PRODUCTS_DATA.categories || [];

    renderQuickPills();
    renderSidebarCategories();
    bindEvents();
    applyFilters();

    // Check URL hash for direct product preview e.g. #prod-1194333
    const hash = window.location.hash;
    if (hash && hash.startsWith('#prod-')) {
      const pid = parseInt(hash.replace('#prod-', ''), 10);
      const target = state.products.find(p => p.id === pid);
      if (target) {
        setTimeout(() => openQuickView(target), 400);
      }
    }

    // Initial pill position & nav button update
    setTimeout(() => {
      const activePill = el.quickPills?.querySelector('.quick-pill.active');
      if (activePill) scrollPillToCenter(activePill);
      updatePillNavButtons();
    }, 120);
  }

  // Smoothly center active category pill horizontally in the bar so text never clips
  function scrollPillToCenter(pillElement) {
    if (!pillElement || !el.quickPills) return;

    const container = el.quickPills;
    const containerRect = container.getBoundingClientRect();
    const pillRect = pillElement.getBoundingClientRect();

    // Calculate relative horizontal center of pill inside container
    const pillCenterRelativeToContainer = (pillRect.left - containerRect.left) + (pillRect.width / 2);
    // Offset needed to align pill center with container center
    const offsetToCenter = pillCenterRelativeToContainer - (containerRect.width / 2);

    const targetScrollLeft = container.scrollLeft + offsetToCenter;

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior: 'smooth'
    });
  }

  // Update navigation scroll arrow button states (disabled/enabled)
  function updatePillNavButtons() {
    if (!el.quickPills || !el.pillNavPrev || !el.pillNavNext) return;
    const { scrollLeft, scrollWidth, clientWidth } = el.quickPills;

    if (scrollWidth <= clientWidth + 2) {
      el.pillNavPrev.classList.add('disabled');
      el.pillNavNext.classList.add('disabled');
      return;
    }

    if (scrollLeft <= 5) {
      el.pillNavPrev.classList.add('disabled');
    } else {
      el.pillNavPrev.classList.remove('disabled');
    }

    if (scrollLeft + clientWidth >= scrollWidth - 6) {
      el.pillNavNext.classList.add('disabled');
    } else {
      el.pillNavNext.classList.remove('disabled');
    }
  }

  // Render Top Quick Pills
  function renderQuickPills() {
    if (!el.quickPills) return;

    // Featured top categories order
    const featuredOrder = [52930, 52929, 52931, 52932, 52936, 52945, 52940, 52941, 52948, 53652, 53301];
    const sortedCats = [...state.categories].sort((a, b) => {
      const idxA = featuredOrder.indexOf(a.id);
      const idxB = featuredOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return b.count - a.count;
    });

    let html = `
      <button class="quick-pill ${state.selectedCategoryId === -1 ? 'active' : ''}" data-cat-id="-1">
        <span>Tất cả sản phẩm</span>
        <span class="quick-pill-badge">${state.products.length}</span>
      </button>
    `;

    sortedCats.forEach(cat => {
      const activeCls = state.selectedCategoryId === cat.id ? 'active' : '';
      html += `
        <button class="quick-pill ${activeCls}" data-cat-id="${cat.id}">
          <span>${cat.name}</span>
          <span class="quick-pill-badge">${cat.count}</span>
        </button>
      `;
    });

    el.quickPills.innerHTML = html;
    updatePillNavButtons();
  }

  // Render Sidebar Categories with Counts
  function renderSidebarCategories() {
    if (!el.sidebarCats) return;

    let html = `
      <li class="cat-filter-item ${state.selectedCategoryId === -1 ? 'active' : ''}" data-cat-id="-1">
        <span>Tất cả sản phẩm</span>
        <span class="cat-count-badge">${state.products.length}</span>
      </li>
    `;

    state.categories.forEach(cat => {
      const activeCls = state.selectedCategoryId === cat.id ? 'active' : '';
      html += `
        <li class="cat-filter-item ${activeCls}" data-cat-id="${cat.id}">
          <span>${cat.name}</span>
          <span class="cat-count-badge">${cat.count}</span>
        </li>
      `;
    });

    el.sidebarCats.innerHTML = html;
  }

  // Bind DOM Event Listeners
  function bindEvents() {
    // Quick Category Pills
    if (el.quickPills) {
      // Drag to scroll on desktop
      let isMouseDown = false;
      let startX = 0;
      let scrollLeftStart = 0;
      let hasDragged = false;

      el.quickPills.addEventListener('mousedown', e => {
        isMouseDown = true;
        hasDragged = false;
        startX = e.pageX - el.quickPills.offsetLeft;
        scrollLeftStart = el.quickPills.scrollLeft;
      });

      window.addEventListener('mousemove', e => {
        if (!isMouseDown) return;
        const x = e.pageX - el.quickPills.offsetLeft;
        const walk = (x - startX);
        if (Math.abs(walk) > 5) {
          hasDragged = true;
        }
        el.quickPills.scrollLeft = scrollLeftStart - walk;
      });

      window.addEventListener('mouseup', () => {
        isMouseDown = false;
      });

      // Click pill to activate & auto-scroll to center
      el.quickPills.addEventListener('click', e => {
        if (hasDragged) {
          e.preventDefault();
          e.stopPropagation();
          hasDragged = false;
          return;
        }
        const btn = e.target.closest('.quick-pill');
        if (!btn) return;
        const catId = parseInt(btn.dataset.catId, 10);
        setCategory(catId);
        scrollPillToCenter(btn);
      });

      // Update arrow states on scroll & resize
      el.quickPills.addEventListener('scroll', updatePillNavButtons);
      window.addEventListener('resize', updatePillNavButtons);
    }

    // Pill Navigation Scroll Buttons
    if (el.pillNavPrev && el.quickPills) {
      el.pillNavPrev.addEventListener('click', () => {
        el.quickPills.scrollBy({ left: -280, behavior: 'smooth' });
      });
    }

    if (el.pillNavNext && el.quickPills) {
      el.pillNavNext.addEventListener('click', () => {
        el.quickPills.scrollBy({ left: 280, behavior: 'smooth' });
      });
    }

    // Sidebar Category Items
    if (el.sidebarCats) {
      el.sidebarCats.addEventListener('click', e => {
        const item = e.target.closest('.cat-filter-item');
        if (!item) return;
        const catId = parseInt(item.dataset.catId, 10);
        setCategory(catId);
        closeMobileSidebar();
      });
    }

    // Brand Filter Chips
    if (el.brandFilters) {
      el.brandFilters.addEventListener('click', e => {
        const chip = e.target.closest('.brand-chip');
        if (!chip) return;
        state.selectedBrand = chip.dataset.brand;
        document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.currentPage = 1;
        applyFilters();
        closeMobileSidebar();
      });
    }

    // Price Radios
    el.priceRadios.forEach(radio => {
      radio.addEventListener('change', e => {
        state.selectedPriceRange = e.target.value;
        state.currentPage = 1;
        applyFilters();
        closeMobileSidebar();
      });
    });

    // Hero Search Input with Debounce
    let searchDebounceTimer = null;
    if (el.searchHeroInput) {
      el.searchHeroInput.addEventListener('input', e => {
        const val = e.target.value.trim();
        state.searchQuery = val;
        
        if (el.searchHeroClear) {
          if (val.length > 0) el.searchHeroClear.classList.add('active');
          else el.searchHeroClear.classList.remove('active');
        }

        clearTimeout(searchDebounceTimer);
        searchDebounceTimer = setTimeout(() => {
          state.currentPage = 1;
          applyFilters();
        }, 220);
      });
    }

    // Clear Search Button
    if (el.searchHeroClear) {
      el.searchHeroClear.addEventListener('click', () => {
        if (el.searchHeroInput) el.searchHeroInput.value = '';
        state.searchQuery = '';
        el.searchHeroClear.classList.remove('active');
        state.currentPage = 1;
        applyFilters();
      });
    }

    // Sort Dropdown
    if (el.sortSelect) {
      el.sortSelect.addEventListener('change', e => {
        state.sortBy = e.target.value;
        applySorting();
        renderProducts();
        renderPagination();
      });
    }

    // Mobile Sidebar Drawer
    if (el.mobileFilterBtn && el.catalogSidebar) {
      el.mobileFilterBtn.addEventListener('click', () => {
        el.catalogSidebar.classList.add('mobile-open');
        if (el.sidebarBackdrop) el.sidebarBackdrop.classList.add('active');
      });
    }

    if (el.sidebarBackdrop) {
      el.sidebarBackdrop.addEventListener('click', closeMobileSidebar);
    }

    // Quick View Modal Close
    if (el.modalCloseBtn && el.quickViewModal) {
      el.modalCloseBtn.addEventListener('click', closeQuickView);
      el.quickViewModal.addEventListener('click', e => {
        if (e.target === el.quickViewModal) closeQuickView();
      });
    }

    // Share Modal Close
    if (el.qrModalClose && el.qrModal) {
      el.qrModalClose.addEventListener('click', closeQrModal);
      el.qrModal.addEventListener('click', e => {
        if (e.target === el.qrModal) closeQrModal();
      });
    }

    // Keyboard ESC to close modals
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        closeQuickView();
        closeQrModal();
        closeMobileSidebar();
      }
    });

    // Delegated Clicks on Product Cards
    if (el.productsGrid) {
      el.productsGrid.addEventListener('click', e => {
        const card = e.target.closest('.pro-card');
        if (!card) return;
        const pid = parseInt(card.dataset.id, 10);
        const prod = state.products.find(p => p.id === pid);
        if (!prod) return;

        // Share button
        if (e.target.closest('.btn-card-share')) {
          e.preventDefault();
          e.stopPropagation();
          openQrShare(prod);
          return;
        }

        // Zalo button
        if (e.target.closest('.btn-card-order')) {
          e.preventDefault();
          e.stopPropagation();
          orderZalo(prod);
          return;
        }

        // Preview or Title or Image Click
        openQuickView(prod);
      });
    }

    // Modal Actions
    if (el.modalZaloBtn) {
      el.modalZaloBtn.addEventListener('click', () => {
        if (state.currentModalProduct) orderZalo(state.currentModalProduct);
      });
    }

    if (el.modalShareBtn) {
      el.modalShareBtn.addEventListener('click', () => {
        if (state.currentModalProduct) {
          closeQuickView();
          openQrShare(state.currentModalProduct);
        }
      });
    }

    // Download QR Poster
    if (el.qrDownloadBtn && el.qrShareCanvas) {
      el.qrDownloadBtn.addEventListener('click', () => {
        try {
          const a = document.createElement('a');
          a.download = `ChuGia-${(state.currentModalProduct?.sku || 'san-pham')}.png`;
          a.href = el.qrShareCanvas.toDataURL('image/png');
          a.click();
        } catch (err) {
          alert('Không thể lưu ảnh từ canvas bảo mật: ' + err.message);
        }
      });
    }

    // Copy Product Link
    if (el.qrCopyLinkBtn) {
      el.qrCopyLinkBtn.addEventListener('click', () => {
        const shareUrl = getProductShareUrl(state.currentModalProduct);
        navigator.clipboard.writeText(shareUrl).then(() => {
          el.qrCopyLinkBtn.textContent = '✓ Đã sao chép liên kết!';
          setTimeout(() => {
            el.qrCopyLinkBtn.textContent = '📋 Sao chép liên kết';
          }, 2000);
        });
      });
    }
  }

  function closeMobileSidebar() {
    if (el.catalogSidebar) el.catalogSidebar.classList.remove('mobile-open');
    if (el.sidebarBackdrop) el.sidebarBackdrop.classList.remove('active');
  }

  // Set category filter
  function setCategory(catId) {
    state.selectedCategoryId = catId;
    state.currentPage = 1;

    // Update Quick Pills UI
    let activePill = null;
    if (el.quickPills) {
      el.quickPills.querySelectorAll('.quick-pill').forEach(btn => {
        const pid = parseInt(btn.dataset.catId, 10);
        const isActive = (pid === catId);
        btn.classList.toggle('active', isActive);
        if (isActive) activePill = btn;
      });
    }

    // Always scroll active pill to center so text is never clipped or overflowing
    if (activePill) {
      scrollPillToCenter(activePill);
    }

    // Update Sidebar UI
    if (el.sidebarCats) {
      el.sidebarCats.querySelectorAll('.cat-filter-item').forEach(item => {
        const pid = parseInt(item.dataset.catId, 10);
        item.classList.toggle('active', pid === catId);
      });
    }

    applyFilters();
  }

  // Apply Filter Logic
  function applyFilters() {
    let list = [...state.products];

    // 1. Category Filter
    if (state.selectedCategoryId !== -1) {
      list = list.filter(p => {
        return (
          p.primaryCategoryId === state.selectedCategoryId ||
          (p.categoryIds && p.categoryIds.includes(state.selectedCategoryId))
        );
      });
    }

    // 2. Brand Filter
    if (state.selectedBrand !== 'all') {
      const brandUpper = state.selectedBrand.toUpperCase();
      list = list.filter(p => (p.brand || '').toUpperCase() === brandUpper);
    }

    // 3. Price Range Filter
    if (state.selectedPriceRange !== 'all') {
      switch (state.selectedPriceRange) {
        case 'under-500k':
          list = list.filter(p => p.retailPrice > 0 && p.retailPrice < 500000);
          break;
        case '500k-1m':
          list = list.filter(p => p.retailPrice >= 500000 && p.retailPrice <= 1000000);
          break;
        case '1m-2m':
          list = list.filter(p => p.retailPrice > 1000000 && p.retailPrice <= 2000000);
          break;
        case '2m-5m':
          list = list.filter(p => p.retailPrice > 2000000 && p.retailPrice <= 5000000);
          break;
        case 'above-5m':
          list = list.filter(p => p.retailPrice > 5000000);
          break;
      }
    }

    // 4. Search Query
    if (state.searchQuery) {
      const q = state.searchQuery.toLowerCase().trim();
      list = list.filter(p => {
        return (
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.brand && p.brand.toLowerCase().includes(q)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
        );
      });
    }

    state.filteredProducts = list;
    applySorting();
    renderProducts();
    renderPagination();
    renderToolbarSummary();
  }

  // Apply Sorting
  function applySorting() {
    const list = state.filteredProducts;
    switch (state.sortBy) {
      case 'price-asc':
        list.sort((a, b) => {
          if (a.retailPrice === 0) return 1;
          if (b.retailPrice === 0) return -1;
          return a.retailPrice - b.retailPrice;
        });
        break;
      case 'price-desc':
        list.sort((a, b) => b.retailPrice - a.retailPrice);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      default:
        // Default popular order
        list.sort((a, b) => a.id - b.id);
        break;
    }
  }

  // Render Toolbar Summary & Active Badges
  function renderToolbarSummary() {
    if (el.resultCount) {
      el.resultCount.textContent = state.filteredProducts.length.toLocaleString('vi-VN');
    }

    if (el.activeFilterTags) {
      let tagsHtml = '';

      if (state.selectedCategoryId !== -1) {
        const cat = state.categories.find(c => c.id === state.selectedCategoryId);
        if (cat) {
          tagsHtml += `
            <span class="active-tag">
              ${cat.name} 
              <span class="active-tag-remove" onclick="window.catalogClearCat()">×</span>
            </span>
          `;
        }
      }

      if (state.selectedBrand !== 'all') {
        tagsHtml += `
          <span class="active-tag">
            Thương hiệu: ${state.selectedBrand} 
            <span class="active-tag-remove" onclick="window.catalogClearBrand()">×</span>
          </span>
        `;
      }

      if (state.selectedPriceRange !== 'all') {
        const priceLabels = {
          'under-500k': 'Dưới 500k',
          '500k-1m': '500k - 1tr',
          '1m-2m': '1tr - 2tr',
          '2m-5m': '2tr - 5tr',
          'above-5m': 'Trên 5tr'
        };
        tagsHtml += `
          <span class="active-tag">
            Giá: ${priceLabels[state.selectedPriceRange]} 
            <span class="active-tag-remove" onclick="window.catalogClearPrice()">×</span>
          </span>
        `;
      }

      if (state.searchQuery) {
        tagsHtml += `
          <span class="active-tag">
            "${state.searchQuery}" 
            <span class="active-tag-remove" onclick="window.catalogClearSearch()">×</span>
          </span>
        `;
      }

      el.activeFilterTags.innerHTML = tagsHtml;
    }
  }

  // Clear Filter Helpers for tags
  window.catalogClearCat = () => setCategory(-1);
  window.catalogClearBrand = () => {
    state.selectedBrand = 'all';
    document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.brand-chip[data-brand="all"]')?.classList.add('active');
    state.currentPage = 1;
    applyFilters();
  };
  window.catalogClearPrice = () => {
    state.selectedPriceRange = 'all';
    const radioAll = document.querySelector('input[name="priceFilter"][value="all"]');
    if (radioAll) radioAll.checked = true;
    state.currentPage = 1;
    applyFilters();
  };
  window.catalogClearSearch = () => {
    if (el.searchHeroInput) el.searchHeroInput.value = '';
    state.searchQuery = '';
    if (el.searchHeroClear) el.searchHeroClear.classList.remove('active');
    state.currentPage = 1;
    applyFilters();
  };

  // Render Products Grid
  function renderProducts() {
    if (!el.productsGrid) return;

    if (state.filteredProducts.length === 0) {
      el.productsGrid.innerHTML = `
        <div class="catalog-empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">Không tìm thấy sản phẩm phù hợp</h3>
          <p class="empty-state-desc">Vui lòng thử tìm với từ khóa khác hoặc xóa bớt các tiêu chí lọc đang chọn.</p>
          <button class="btn btn-primary" onclick="window.catalogResetAllFilters()">
            Xóa tất cả bộ lọc &amp; Xem lại toàn bộ
          </button>
        </div>
      `;
      return;
    }

    const startIdx = (state.currentPage - 1) * state.itemsPerPage;
    const endIdx = startIdx + state.itemsPerPage;
    const pagedItems = state.filteredProducts.slice(startIdx, endIdx);

    let html = '';
    pagedItems.forEach(p => {
      const brandClass = (p.brand || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const retailPriceStr = formatVND(p.retailPrice);
      const oldPriceStr = p.originalPrice > 0 ? formatVND(p.originalPrice) : '';
      const isContactOnly = p.retailPrice <= 0;

      // Features list
      let featuresHtml = '';
      if (p.features && p.features.length > 0) {
        featuresHtml = p.features
          .slice(0, 2)
          .map(
            f =>
              `<li><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${f}</span></li>`
          )
          .join('');
      }

      html += `
        <article class="pro-card" data-id="${p.id}">
          <!-- Badges -->
          <div class="pro-card-badges">
            <span class="pro-brand-badge ${brandClass}">${p.brand}</span>
            ${p.discountPercent > 0 ? `<span class="pro-discount-badge">-${p.discountPercent}%</span>` : ''}
          </div>

          <!-- Image -->
          <div class="pro-card-image-box">
            <img 
              class="pro-card-image" 
              src="${p.image}" 
              alt="${p.name}" 
              loading="lazy"
              referrerpolicy="no-referrer"
              onerror="this.onerror=null;this.src='images/hero_security.jpg';"
            />
            <!-- Chu Gia Security Watermark Stamp (Che logo cũ ở góc trái dưới) -->
            <div class="pro-card-watermark">
              <img src="images/chugia_watermark.svg" alt="Chu Gia Security" />
            </div>
            <div class="pro-card-hover-overlay">
              <button class="btn-quick-preview" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                <span>Xem Nhanh</span>
              </button>
            </div>
          </div>

          <!-- Body -->
          <div class="pro-card-body">
            <div class="pro-card-cat-name">${p.categoryName}</div>
            <h3 class="pro-card-title" title="${p.name}">${p.name}</h3>

            <div class="pro-meta-row">
              <span class="pro-sku-tag" title="Mã SKU: ${p.sku || 'Đang cập nhật'}">${p.sku ? 'SKU: ' + p.sku : 'Chính Hãng'}</span>
              <span>Bảo hành 24T</span>
            </div>

            <ul class="pro-features-list">
              ${featuresHtml}
            </ul>

            <!-- Price -->
            <div class="pro-price-box">
              <div>
                <div class="pro-retail-price ${isContactOnly ? 'contact-only' : ''}">
                  ${retailPriceStr}
                </div>
                ${oldPriceStr ? `<div class="pro-old-price">${oldPriceStr}</div>` : ''}
              </div>
            </div>

            <!-- Actions -->
            <div class="pro-card-actions">
              <button class="btn-card-order" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>Đặt Mua Zalo</span>
              </button>
              <button class="btn-card-share" type="button" title="Tạo mã QR & Chia sẻ">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
              </button>
            </div>
          </div>
        </article>
      `;
    });

    el.productsGrid.innerHTML = html;
  }

  // Reset All Filters Helper
  window.catalogResetAllFilters = () => {
    state.selectedCategoryId = -1;
    state.selectedBrand = 'all';
    state.selectedPriceRange = 'all';
    state.searchQuery = '';
    state.sortBy = 'default';
    state.currentPage = 1;

    if (el.searchHeroInput) el.searchHeroInput.value = '';
    if (el.searchHeroClear) el.searchHeroClear.classList.remove('active');
    if (el.sortSelect) el.sortSelect.value = 'default';

    document.querySelectorAll('.brand-chip').forEach(c => c.classList.remove('active'));
    document.querySelector('.brand-chip[data-brand="all"]')?.classList.add('active');

    const radioAll = document.querySelector('input[name="priceFilter"][value="all"]');
    if (radioAll) radioAll.checked = true;

    renderQuickPills();
    renderSidebarCategories();
    applyFilters();
  };

  // Render Pagination
  function renderPagination() {
    if (!el.pagination) return;

    const totalPages = Math.ceil(state.filteredProducts.length / state.itemsPerPage);
    if (totalPages <= 1) {
      el.pagination.innerHTML = '';
      return;
    }

    let html = '';

    // Previous Button
    html += `
      <button class="page-btn" ${state.currentPage === 1 ? 'disabled' : ''} onclick="window.catalogGoPage(${state.currentPage - 1})">
        ‹ Trước
      </button>
    `;

    // Smart Page Numbers
    const current = state.currentPage;
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
        range.push(i);
      }
    }

    let l;
    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    rangeWithDots.forEach(p => {
      if (p === '...') {
        html += `<span class="page-ellipsis">…</span>`;
      } else {
        const activeCls = p === current ? 'active' : '';
        html += `
          <button class="page-btn ${activeCls}" onclick="window.catalogGoPage(${p})">
            ${p}
          </button>
        `;
      }
    });

    // Next Button
    html += `
      <button class="page-btn" ${state.currentPage === totalPages ? 'disabled' : ''} onclick="window.catalogGoPage(${state.currentPage + 1})">
        Sau ›
      </button>
    `;

    el.pagination.innerHTML = html;
  }

  // Go to Page Helper
  window.catalogGoPage = page => {
    state.currentPage = page;
    renderProducts();
    renderPagination();

    const anchor = document.getElementById('catalogMain');
    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Open Quick View Modal
  function openQuickView(prod) {
    state.currentModalProduct = prod;

    if (el.modalMainImg) {
      el.modalMainImg.src = prod.image;
      el.modalMainImg.alt = prod.name;
    }

    // Gallery Thumbs
    if (el.modalThumbs) {
      const images = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
      let thumbsHtml = '';
      images.forEach((imgUrl, idx) => {
        thumbsHtml += `
          <img 
            class="modal-thumb ${idx === 0 ? 'active' : ''}" 
            src="${imgUrl}" 
            alt="Thumbnail" 
            onclick="window.catalogSelectThumb(this, '${imgUrl}')"
          />
        `;
      });
      el.modalThumbs.innerHTML = thumbsHtml;
    }

    if (el.modalBrandTag) el.modalBrandTag.textContent = prod.brand;
    if (el.modalTitle) el.modalTitle.textContent = prod.name;
    if (el.modalSku) el.modalSku.textContent = prod.sku || 'Đang cập nhật';
    if (el.modalCategory) el.modalCategory.textContent = prod.categoryName;
    if (el.modalWarranty) el.modalWarranty.textContent = prod.warranty || '24 Tháng 1 đổi 1';

    if (el.modalRetailPrice) {
      el.modalRetailPrice.textContent = formatVND(prod.retailPrice);
    }

    if (el.modalOldPrice) {
      el.modalOldPrice.textContent = prod.originalPrice > 0 ? formatVND(prod.originalPrice) : '';
    }

    if (el.modalDiscountTag) {
      if (prod.discountPercent > 0) {
        el.modalDiscountTag.textContent = `Tiết kiệm ${prod.discountPercent}%`;
        el.modalDiscountTag.style.display = 'inline-block';
      } else {
        el.modalDiscountTag.style.display = 'none';
      }
    }

    // Specs List
    if (el.modalSpecsList) {
      let specs = prod.features || [];
      if (specs.length === 0) {
        specs = [
          `Sản phẩm phân phối chính hãng bởi Chu Gia Security`,
          `Bảo hành chu đáo 24 tháng theo tiêu chuẩn nhà sản xuất`,
          `Tặng kèm gói hỗ trợ kỹ thuật cài đặt miễn phí trọn đời`
        ];
      }
      el.modalSpecsList.innerHTML = specs
        .map(
          s =>
            `<li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${s}</span></li>`
        )
        .join('');
    }

    if (el.quickViewModal) {
      el.quickViewModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Update URL hash without reload
    history.replaceState(null, null, `#prod-${prod.id}`);
  }

  window.catalogSelectThumb = (thumbEl, url) => {
    document.querySelectorAll('.modal-thumb').forEach(t => t.classList.remove('active'));
    thumbEl.classList.add('active');
    if (el.modalMainImg) el.modalMainImg.src = url;
  };

  function closeQuickView() {
    if (el.quickViewModal) {
      el.quickViewModal.classList.remove('active');
      document.body.style.overflow = '';
    }
    history.replaceState(null, null, window.location.pathname);
  }

  // Zalo Order Direct Link
  function orderZalo(prod) {
    const text = `Xin chào Chu Gia Security! Tôi quan tâm đến sản phẩm:\n- Tên: ${prod.name}\n- Mã: ${prod.sku || 'N/A'}\n- Giá bán lẻ: ${formatVND(prod.retailPrice)}\nNhờ Chu Gia tư vấn đặt hàng giúp tôi nhé!`;
    const encoded = encodeURIComponent(text);
    // Link to Zalo chat
    const zaloUrl = `https://zalo.me/0941204125?text=${encoded}`;
    window.open(zaloUrl, '_blank');
  }

  // Share URL helper
  function getProductShareUrl(prod) {
    if (!prod) return window.location.href;
    const url = new URL(window.location.href);
    url.hash = `prod-${prod.id}`;
    return url.toString();
  }

  // Open QR Share Modal & Generate Poster
  function openQrShare(prod) {
    state.currentModalProduct = prod;

    if (el.qrShareTitle) {
      el.qrShareTitle.textContent = prod.name;
    }

    if (el.qrModal) {
      el.qrModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    // Draw Canvas Poster
    drawSharePoster(prod);
  }

  function closeQrModal() {
    if (el.qrModal) {
      el.qrModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Draw Share Poster onto Canvas with QR badge and strikethrough retail price
  function drawSharePoster(prod) {
    const canvas = el.qrShareCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = 600;
    const height = 750;
    canvas.width = width;
    canvas.height = height;

    // Background Gradient (Dark Luxury Theme)
    const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
    bgGradient.addColorStop(0, '#0a1128');
    bgGradient.addColorStop(1, '#050814');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Header Glow
    const glow = ctx.createRadialGradient(width / 2, 0, 10, width / 2, 0, 300);
    glow.addColorStop(0, 'rgba(0, 132, 255, 0.25)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, 300);

    // Header Logo & Branding
    ctx.fillStyle = '#0084ff';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHU GIA SECURITY', 36, 46);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('ĐẠI LÝ ỦY QUYỀN CAMERA CHÍNH HÃNG • HOTLINE: 0941 204 125', 36, 68);

    // Divider
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 82);
    ctx.lineTo(width - 36, 82);
    ctx.stroke();

    // Product Card Area
    const cardX = 36;
    const cardY = 96;
    const cardW = width - 72;
    const cardH = 380;

    ctx.fillStyle = '#ffffff';
    roundRect(ctx, cardX, cardY, cardW, cardH, 16);
    ctx.fill();

    // Load Product Image onto Poster
    const prodImg = new Image();
    prodImg.crossOrigin = 'anonymous';

    // Temporary container to generate QR Code
    const qrDiv = document.createElement('div');
    const shareUrl = getProductShareUrl(prod);

    new QRCode(qrDiv, {
      text: shareUrl,
      width: 100,
      height: 100,
      colorDark: '#0f172a',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });

    prodImg.onload = function () {
      // Draw product image inside card
      try {
        const padding = 20;
        const imgMaxW = cardW - padding * 2;
        const imgMaxH = cardH - padding * 2;
        const hRatio = imgMaxW / prodImg.width;
        const vRatio = imgMaxH / prodImg.height;
        const ratio = Math.min(hRatio, vRatio);
        const centerShiftX = cardX + (cardW - prodImg.width * ratio) / 2;
        const centerShiftY = cardY + (cardH - prodImg.height * ratio) / 2;

        ctx.drawImage(
          prodImg,
          0,
          0,
          prodImg.width,
          prodImg.height,
          centerShiftX,
          centerShiftY,
          prodImg.width * ratio,
          prodImg.height * ratio
        );
      } catch (err) {
        console.warn('Image draw error:', err);
      }

      // Draw QR badge at bottom right of card
      drawQrCornerBadge(ctx, cardX + cardW - 105, cardY + cardH - 105, qrDiv);
      // Draw Chu Gia watermark at bottom left of card (covers old watermark)
      drawWatermarkCornerBadge(ctx, cardX + 12, cardY + cardH - 46);
      drawPosterDetails(ctx, prod, width, height);
    };

    prodImg.onerror = function () {
      // Fallback if image blocked
      drawQrCornerBadge(ctx, cardX + cardW - 105, cardY + cardH - 105, qrDiv);
      drawWatermarkCornerBadge(ctx, cardX + 12, cardY + cardH - 46);
      drawPosterDetails(ctx, prod, width, height);
    };

    prodImg.src = prod.image;
  }

  function drawWatermarkCornerBadge(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, 160, 34, 6);
    ctx.fill();
    ctx.stroke();

    // Text: CHU GIA SECURITY
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CHU GIA', x + 10, y + 21);

    ctx.fillStyle = '#0072ff';
    ctx.fillText('SECURITY', x + 64, y + 21);

    // Orange accent dot
    ctx.fillStyle = '#ff6600';
    ctx.beginPath();
    ctx.arc(x + 146, y + 17, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawQrCornerBadge(ctx, x, y, qrDiv) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = 'rgba(0, 132, 255, 0.4)';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, 94, 94, 10);
    ctx.fill();
    ctx.stroke();

    const qrCanvas = qrDiv.querySelector('canvas');
    if (qrCanvas) {
      ctx.drawImage(qrCanvas, x + 7, y + 7, 80, 80);
    }
    ctx.restore();
  }

  function drawPosterDetails(ctx, prod, width, height) {
    // Product Title (wrapped)
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif';
    wrapText(ctx, prod.name, 36, 514, width - 72, 26);

    // Category & SKU
    ctx.fillStyle = '#38bdf8';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${prod.brand} • ${prod.categoryName} • SKU: ${prod.sku || 'N/A'}`, 36, 574);

    // Price Section
    ctx.fillStyle = '#4ade80';
    ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
    const priceText = formatVND(prod.retailPrice);
    ctx.fillText(priceText, 36, 620);

    // Old Price with Strikethrough
    if (prod.originalPrice > 0) {
      const priceMetrics = ctx.measureText(priceText);
      const oldPriceX = 36 + priceMetrics.width + 16;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px "Plus Jakarta Sans", sans-serif';
      const oldText = formatVND(prod.originalPrice);
      ctx.fillText(oldText, oldPriceX, 618);

      const oldMetrics = ctx.measureText(oldText);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(oldPriceX - 2, 613);
      ctx.lineTo(oldPriceX + oldMetrics.width + 2, 613);
      ctx.stroke();
    }

    // Call to Action / Scan Hint Footer
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    roundRect(ctx, 36, 650, width - 72, 66, 12);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('📱 Quét mã QR trên ảnh để xem chi tiết & nhận ưu đãi tại Chu Gia Security', 52, 678);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Bảo hành chính hãng 24 tháng • Đổi mới 30 ngày • Lắp đặt tận nơi chuyên nghiệp', 52, 700);
  }

  // Canvas Helpers
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let curY = y;
    let linesDrawn = 0;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, curY);
        line = words[n] + ' ';
        curY += lineHeight;
        linesDrawn++;
        if (linesDrawn >= 2) {
          // Truncate line 2 with ellipsis
          let trunc = line;
          while (ctx.measureText(trunc + '...').width > maxWidth && trunc.length > 0) {
            trunc = trunc.slice(0, -1);
          }
          ctx.fillText(trunc + '...', x, curY);
          return;
        }
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, curY);
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

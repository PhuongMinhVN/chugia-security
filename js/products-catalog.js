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
    currentModalProduct: null,
    // Quote Cart
    cart: [] // [{id, name, sku, brand, retailPrice, image, qty}]
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
    modalTabsNav: document.getElementById('modalTabsNav'),
    modalSpecsList: document.getElementById('modalSpecsList'),
    modalDescription: document.getElementById('modalDescription'),
    modalTechTags: document.getElementById('modalTechTags'),
    modalFitTags: document.getElementById('modalFitTags'),
    modalMaterialTags: document.getElementById('modalMaterialTags'),
    modalTechTable: document.getElementById('modalTechTable'),
    modalZaloBtn: document.getElementById('modalZaloBtn'),
    modalCallBtn: document.getElementById('modalCallBtn'),
    modalShareBtn: document.getElementById('modalShareBtn'),
    // QR Share Modal
    qrModal: document.getElementById('qrShareModal'),
    qrModalClose: document.getElementById('qrModalClose'),
    qrShareCanvas: document.getElementById('qrShareCanvas'),
    qrDownloadBtn: document.getElementById('qrDownloadBtn'),
    qrCopyLinkBtn: document.getElementById('qrCopyLinkBtn'),
    qrShareTitle: document.getElementById('qrShareTitle'),
    // Quote Cart
    cartDrawer: document.getElementById('cartDrawer'),
    cartDrawerClose: document.getElementById('cartDrawerClose'),
    cartDrawerBackdrop: document.getElementById('cartDrawerBackdrop'),
    cartItemsList: document.getElementById('cartItemsList'),
    cartTotalPrice: document.getElementById('cartTotalPrice'),
    cartItemCount: document.getElementById('cartItemCount'),
    cartTotalCount: document.getElementById('cartTotalCount'),
    cartFloatBtn: document.getElementById('cartFloatBtn'),
    cartFloatBadge: document.getElementById('cartFloatBadge'),
    cartSendZaloBtn: document.getElementById('cartSendZaloBtn'),
    cartCopyBtn: document.getElementById('cartCopyBtn'),
    cartClearBtn: document.getElementById('cartClearBtn'),
    modalAddCartBtn: document.getElementById('modalAddCartBtn')
  };

  // ===================== QUOTE CART SYSTEM =====================

  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem('chugia_quote_cart');
      if (saved) state.cart = JSON.parse(saved);
    } catch (e) { state.cart = []; }
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem('chugia_quote_cart', JSON.stringify(state.cart));
    } catch (e) { }
  }

  function addToCart(prod) {
    const existing = state.cart.find(item => item.id === prod.id);
    if (existing) {
      existing.qty = Math.min(existing.qty + 1, 99);
    } else {
      state.cart.push({
        id: prod.id,
        name: prod.name,
        sku: prod.sku || '',
        brand: prod.brand || '',
        retailPrice: prod.retailPrice || 0,
        image: prod.image || '',
        qty: 1
      });
    }
    saveCartToStorage();
    updateCartUI();
    showCartAddedFeedback(prod.id);
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter(item => item.id !== id);
    saveCartToStorage();
    updateCartUI();
    renderCartDrawer();
  }

  function changeCartQty(id, delta) {
    const item = state.cart.find(i => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, Math.min(item.qty + delta, 99));
    saveCartToStorage();
    updateCartUI();
    renderCartDrawer();
  }

  function clearCart() {
    state.cart = [];
    saveCartToStorage();
    updateCartUI();
    renderCartDrawer();
  }

  function updateCartUI() {
    const totalQty = state.cart.reduce((s, i) => s + i.qty, 0);
    // Float button badge
    if (el.cartFloatBadge) {
      el.cartFloatBadge.textContent = totalQty;
      el.cartFloatBadge.style.display = totalQty > 0 ? 'flex' : 'none';
    }
    const mbnBadge = document.getElementById('mbnBadge');
    if (mbnBadge) {
      mbnBadge.textContent = totalQty;
      mbnBadge.style.display = totalQty > 0 ? 'inline-block' : 'none';
    }
    if (el.cartFloatBtn) {
      el.cartFloatBtn.classList.toggle('has-items', totalQty > 0);
    }
    // Drawer header count
    if (el.cartItemCount) el.cartItemCount.textContent = state.cart.length;
    if (el.cartTotalCount) el.cartTotalCount.textContent = totalQty;
  }

  function renderCartDrawer() {
    if (!el.cartItemsList) return;
    if (state.cart.length === 0) {
      el.cartItemsList.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <p>Chưa có sản phẩm nào trong giỏ báo giá</p>
          <p class="cart-empty-hint">Nhấn nút <strong>+ Báo Giá</strong> trên từng sản phẩm để thêm vào đây</p>
        </div>
      `;
      if (el.cartTotalPrice) el.cartTotalPrice.textContent = '0 ₫';
      return;
    }

    let html = '';
    let total = 0;
    state.cart.forEach(item => {
      const lineTotal = item.retailPrice * item.qty;
      total += lineTotal;
      const priceStr = item.retailPrice > 0 ? formatVND(item.retailPrice) : 'Liên hệ';
      const lineTotalStr = item.retailPrice > 0 ? formatVND(lineTotal) : '';
      html += `
        <div class="cart-item" data-id="${item.id}">
          <img class="cart-item-img" src="${item.image}" alt="${item.name}" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='images/hero_security.jpg';" />
          <div class="cart-item-info">
            <div class="cart-item-brand">${item.brand}</div>
            <div class="cart-item-name" title="${item.name}">${item.name}</div>
            ${item.sku ? `<div class="cart-item-sku">SKU: ${item.sku}</div>` : ''}
            <div class="cart-item-price">${priceStr}</div>
          </div>
          <div class="cart-item-controls">
            <div class="cart-qty-row">
              <button class="cart-qty-btn" onclick="window.cartChangeQty(${item.id}, -1)">−</button>
              <span class="cart-qty-num">${item.qty}</span>
              <button class="cart-qty-btn" onclick="window.cartChangeQty(${item.id}, 1)">+</button>
            </div>
            ${lineTotalStr ? `<div class="cart-line-total">${lineTotalStr}</div>` : ''}
            <button class="cart-remove-btn" onclick="window.cartRemove(${item.id})" title="Xóa khỏi giỏ">✕</button>
          </div>
        </div>
      `;
    });

    el.cartItemsList.innerHTML = html;
    if (el.cartTotalPrice) {
      el.cartTotalPrice.textContent = total > 0 ? formatVND(total) : 'Liên hệ báo giá';
    }
  }

  function openCartDrawer() {
    renderCartDrawer();
    if (el.cartDrawer) el.cartDrawer.classList.add('open');
    if (el.cartDrawerBackdrop) el.cartDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCartDrawer() {
    if (el.cartDrawer) el.cartDrawer.classList.remove('open');
    if (el.cartDrawerBackdrop) el.cartDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function sendCartZalo() {
    if (state.cart.length === 0) {
      alert('Giỏ báo giá đang trống! Hãy thêm sản phẩm trước.');
      return;
    }
    let msg = 'Xin chào Chu Gia Security! Tôi muốn yêu cầu báo giá các sản phẩm sau:\n\n';
    state.cart.forEach((item, i) => {
      msg += `${i + 1}. ${item.name}${item.sku ? ' (SKU: ' + item.sku + ')' : ''} — SL: ${item.qty}${item.retailPrice > 0 ? ' — Đơn giá: ' + formatVND(item.retailPrice) : ''}\n`;
    });
    const total = state.cart.reduce((s, i) => s + i.retailPrice * i.qty, 0);
    if (total > 0) msg += `\nTổng dự kiến: ${formatVND(total)}`;
    msg += '\n\nNhờ Chu Gia tư vấn và xác nhận đơn hàng giúp tôi. Cảm ơn!';
    window.open(`https://zalo.me/0941204125?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function copyCartList() {
    if (state.cart.length === 0) return;
    let text = 'DANH SÁCH BÁO GIÁ - CHU GIA SECURITY\n' + '='.repeat(40) + '\n';
    state.cart.forEach((item, i) => {
      text += `${i + 1}. ${item.name}\n   SKU: ${item.sku || 'N/A'} | SL: ${item.qty} | Đơn giá: ${item.retailPrice > 0 ? formatVND(item.retailPrice) : 'Liên hệ'}\n`;
    });
    const total = state.cart.reduce((s, i) => s + i.retailPrice * i.qty, 0);
    if (total > 0) text += `\nTổng cộng: ${formatVND(total)}`;
    text += '\nHotline: 0941 204 125 | Zalo: https://zalo.me/0941204125';
    navigator.clipboard.writeText(text).then(() => {
      if (el.cartCopyBtn) {
        el.cartCopyBtn.textContent = '✓ Đã sao chép!';
        setTimeout(() => { el.cartCopyBtn.textContent = '📋 Sao chép danh sách'; }, 2000);
      }
    });
  }

  function showCartAddedFeedback(productId) {
    // Flash the card's add-to-cart button
    const card = el.productsGrid?.querySelector(`.pro-card[data-id="${productId}"]`);
    if (card) {
      const btn = card.querySelector('.btn-card-cart');
      if (btn) {
        btn.classList.add('added');
        btn.textContent = '✓ Đã thêm';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.textContent = '+ Báo Giá';
        }, 1500);
      }
    }
    // Animate float cart button
    if (el.cartFloatBtn) {
      el.cartFloatBtn.classList.add('bounce');
      setTimeout(() => el.cartFloatBtn.classList.remove('bounce'), 600);
    }
  }

  // Global cart helpers
  window.cartRemove = id => removeFromCart(id);
  window.cartChangeQty = (id, delta) => changeCartQty(id, delta);
  window.cartClear = () => clearCart();

  // ===================== END QUOTE CART SYSTEM =====================

  // Initialize
  function init() {
    if (!window.HTA_PRODUCTS_DATA) {
      console.error('HTA_PRODUCTS_DATA not found.');
      return;
    }

    state.products = window.HTA_PRODUCTS_DATA.products || [];
    state.categories = window.HTA_PRODUCTS_DATA.categories || [];

    loadCartFromStorage();
    renderQuickPills();
    renderSidebarCategories();
    bindEvents();
    applyFilters();
    updateCartUI();

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

        // Add to Cart button
        if (e.target.closest('.btn-card-cart')) {
          e.preventDefault();
          e.stopPropagation();
          addToCart(prod);
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

    // Modal Tab Buttons Switcher
    if (el.modalTabsNav) {
      el.modalTabsNav.addEventListener('click', e => {
        const btn = e.target.closest('.modal-tab-btn');
        if (!btn) return;
        const targetTabId = btn.getAttribute('data-tab');
        if (!targetTabId) return;

        el.modalTabsNav.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.modal-tab-pane').forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPane = document.getElementById(targetTabId);
        if (targetPane) targetPane.classList.add('active');
      });
    }

    // Modal Add to Cart
    if (el.modalAddCartBtn) {
      el.modalAddCartBtn.addEventListener('click', () => {
        if (state.currentModalProduct) {
          addToCart(state.currentModalProduct);
          el.modalAddCartBtn.textContent = '✓ Đã thêm vào giỏ!';
          el.modalAddCartBtn.style.background = '#16a34a';
          setTimeout(() => {
            el.modalAddCartBtn.textContent = '🛒 Thêm vào Giỏ Báo Giá';
            el.modalAddCartBtn.style.background = '';
          }, 1800);
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

    // Cart Drawer Toggle
    if (el.cartFloatBtn) {
      el.cartFloatBtn.addEventListener('click', openCartDrawer);
    }
    if (el.cartDrawerClose) {
      el.cartDrawerClose.addEventListener('click', closeCartDrawer);
    }
    if (el.cartDrawerBackdrop) {
      el.cartDrawerBackdrop.addEventListener('click', closeCartDrawer);
    }
    if (el.cartSendZaloBtn) {
      el.cartSendZaloBtn.addEventListener('click', sendCartZalo);
    }
    if (el.cartCopyBtn) {
      el.cartCopyBtn.addEventListener('click', copyCartList);
    }
    if (el.cartClearBtn) {
      el.cartClearBtn.addEventListener('click', () => {
        if (confirm('Xóa tất cả sản phẩm khỏi giỏ báo giá?')) clearCart();
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
              <button class="btn-card-cart" type="button" data-id="${p.id}">
                + Báo Giá
              </button>
              <button class="btn-card-order" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>Zalo</span>
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

  // Helper: Ẩn/hiện một tab (cả nút tab và pane) theo việc có dữ liệu thật hay không.
  function setTabVisible(tabId, visible) {
    const btn = document.querySelector(`.modal-tab-btn[data-tab="${tabId}"]`);
    const pane = document.getElementById(tabId);
    const display = visible ? '' : 'none';
    if (btn) btn.style.display = display;
    if (pane) pane.style.display = display;
  }

  // Helper: Lấy metadata THẬT của sản phẩm.
  //
  // QUAN TRỌNG: Hàm này KHÔNG được phép bịa dữ liệu. Toàn bộ thông số kỹ thuật
  // và mô tả đều lấy trực tiếp từ dữ liệu đã cào thật (prod.specsTable,
  // prod.description, prod.features). Nếu sản phẩm không có dữ liệu thật thì
  // trả về rỗng để giao diện ẩn tab tương ứng, tuyệt đối không suy diễn.
  function generateProductRichMetadata(prod) {
    // Bảng thông số kỹ thuật thật (đã cào từ trang nguồn)
    const specsTable = Array.isArray(prod.specsTable) ? prod.specsTable.slice() : [];

    // Mô tả thật (đoạn giới thiệu sản phẩm)
    const description = (prod.description || '').trim();

    // Tính năng nổi bật thật
    const features = Array.isArray(prod.features) ? prod.features.slice() : [];

    // Thẻ tag: chỉ lấy từ dữ liệu thật, không hardcode.
    // - Thương hiệu (nếu có)
    // - Danh mục / nhóm sản phẩm (nếu có)
    const techTags = [];
    if (prod.brand) techTags.push(prod.brand);
    if (prod.categoryName) techTags.push(prod.categoryName);
    if (prod.parentGroup && prod.parentGroup !== prod.categoryName) {
      techTags.push(prod.parentGroup);
    }

    // Không còn tag "chất liệu" / "không gian phù hợp" bịa -> để rỗng.
    const fitTags = [];
    const materialTags = [];

    return { techTags, fitTags, materialTags, specsTable, description, features };
  }

  // ---------------------------------------------------------------------------
  // AI / SEO HELPERS
  // Toàn bộ nội dung sinh ra dưới đây CHỈ dùng dữ liệu thật của sản phẩm.
  // Mục tiêu: cấu trúc ngữ nghĩa rõ ràng để máy tìm kiếm & AI (Google SGE,
  // Bing Copilot, ChatGPT...) có thể trích xuất chính xác thông tin.
  // ---------------------------------------------------------------------------

  function escapeHtml(str) {
    const AMP = String.fromCharCode(38) + 'amp;';
    const LT = String.fromCharCode(38) + 'lt;';
    const GT = String.fromCharCode(38) + 'gt;';
    const QUOT = String.fromCharCode(38) + 'quot;';
    const APOS = String.fromCharCode(38) + '#39;';
    return String(str == null ? '' : str)
      .replace(/&/g, AMP)
      .replace(/</g, LT)
      .replace(/>/g, GT)
      .replace(/"/g, QUOT)
      .replace(/'/g, APOS);
  }

  // Tách mô tả thô thành các đoạn văn sạch (bỏ dòng trống, gộp câu rời).
  function splitDescriptionParagraphs(description) {
    if (!description) return [];
    return String(description)
      .split(/\n{2,}|\r\n\r\n/)
      .map(p => p.replace(/\s+/g, ' ').trim())
      .filter(p => p.length > 0);
  }

  // Render mô tả theo cấu trúc ngữ nghĩa: heading có từ khóa + đoạn văn.
  function renderSemanticDescription(prod, richMeta) {
    const paragraphs = splitDescriptionParagraphs(richMeta.description);
    if (paragraphs.length === 0) return '';

    const name = escapeHtml(prod.name || '');
    const brand = escapeHtml(prod.brand || '');
    const category = escapeHtml(prod.categoryName || '');

    let html = '';
    // Heading chính chứa tên sản phẩm (từ khóa chính cho tìm kiếm)
    html += `<h3 class="desc-heading">Giới thiệu ${name}</h3>`;

    paragraphs.forEach((p, idx) => {
      // Đoạn đầu tiên là mô tả tổng quan -> giữ nguyên
      html += `<p>${escapeHtml(p)}</p>`;
      // Sau đoạn đầu, chèn heading phụ có từ khóa để chia khối nội dung
      if (idx === 0 && paragraphs.length > 1) {
        html += `<h4 class="desc-subheading">Đặc điểm nổi bật của ${name}</h4>`;
      }
    });

    // Khối thông tin định danh dạng danh sách (AI dễ trích xuất)
    const facts = [];
    if (brand) facts.push(`Thương hiệu: ${brand}`);
    if (category) facts.push(`Danh mục: ${category}`);
    if (prod.sku) facts.push(`Mã sản phẩm (SKU): ${escapeHtml(prod.sku)}`);
    if (prod.warranty) facts.push(`Bảo hành: ${escapeHtml(prod.warranty)}`);
    if (facts.length > 0) {
      html += `<h4 class="desc-subheading">Thông tin sản phẩm ${name}</h4>`;
      html += '<ul class="desc-fact-list">';
      facts.forEach(f => {
        html += `<li>${f}</li>`;
      });
      html += '</ul>';
    }

    return html;
  }

  // Khối "Tóm tắt nhanh" — các dữ kiện cốt lõi, dạng bảng key-value.
  function renderKeyFacts(prod, richMeta) {
    const rows = [];
    if (prod.brand) rows.push(['Thương hiệu', prod.brand]);
    if (prod.categoryName) rows.push(['Danh mục', prod.categoryName]);
    if (prod.sku) rows.push(['Mã sản phẩm', prod.sku]);
    if (prod.warranty) rows.push(['Bảo hành', prod.warranty]);
    if (prod.unit) rows.push(['Đơn vị', prod.unit]);
    if (prod.inStock === false) rows.push(['Tình trạng', 'Tạm hết hàng']);
    else rows.push(['Tình trạng', 'Còn hàng']);

    // Lấy thêm vài thông số kỹ thuật đầu tiên (dữ liệu thật)
    const topSpecs = (richMeta.specsTable || []).slice(0, 4);
    topSpecs.forEach(s => {
      if (s && s.k && s.v) rows.push([s.k, s.v]);
    });

    if (rows.length === 0) return '';

    let html = '<h3 class="desc-heading">Tóm tắt nhanh</h3>';
    html += '<table class="desc-facts-table"><tbody>';
    rows.forEach(([k, v]) => {
      html += `<tr><th scope="row">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`;
    });
    html += '</tbody></table>';
    return html;
  }

  // FAQ tự sinh từ dữ liệu THẬT — giúp AI trả lời câu hỏi người dùng.
  function buildFaqItems(prod, richMeta) {
    const items = [];
    const name = prod.name || 'sản phẩm này';
    const brand = prod.brand || '';

    if (brand) {
      items.push({
        q: `${name} là sản phẩm của hãng nào?`,
        a: `${name} là sản phẩm chính hãng của thương hiệu ${brand}.`,
      });
    }

    if (prod.warranty) {
      items.push({
        q: `Chế độ bảo hành của ${name} như thế nào?`,
        a: `${name} được bảo hành ${prod.warranty}.`,
      });
    }

    if (richMeta.specsTable && richMeta.specsTable.length > 0) {
      const top = richMeta.specsTable.slice(0, 5);
      const specText = top.map(s => `${s.k}: ${s.v}`).join('; ');
      items.push({
        q: `Thông số kỹ thuật chính của ${name} là gì?`,
        a: `Các thông số kỹ thuật chính của ${name} gồm: ${specText}.`,
      });
    }

    if (richMeta.features && richMeta.features.length > 0) {
      items.push({
        q: `${name} có những tính năng nổi bật nào?`,
        a: richMeta.features.slice(0, 4).join(' '),
      });
    }

    if (prod.categoryName) {
      items.push({
        q: `${name} phù hợp lắp đặt cho nhu cầu nào?`,
        a: `${name} thuộc danh mục ${prod.categoryName}, phù hợp cho nhu cầu lắp đặt và sử dụng tương ứng.`,
      });
    }

    return items;
  }

  function renderFaq(prod, richMeta) {
    const items = buildFaqItems(prod, richMeta);
    if (items.length === 0) return '';
    let html = '<h3 class="desc-heading">Câu hỏi thường gặp</h3>';
    html += '<div class="desc-faq">';
    items.forEach(it => {
      html += '<div class="desc-faq-item">';
      html += `<h4 class="desc-faq-q">${escapeHtml(it.q)}</h4>`;
      html += `<p class="desc-faq-a">${escapeHtml(it.a)}</p>`;
      html += '</div>';
    });
    html += '</div>';
    return html;
  }

  // Structured data JSON-LD động: Product + Offer + FAQPage.
  // Giúp Google/AI hiểu và hiển thị rich result.
  function injectProductJsonLd(prod, richMeta) {
    const SITE = 'https://htavietnam.com';
    const url = `${SITE}/san-pham.html#prod-${prod.id}`;

    const product = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: prod.name,
      sku: prod.sku || undefined,
      description: (richMeta.description || '').slice(0, 500) || undefined,
      image: (prod.images && prod.images.length ? prod.images : [prod.image]).filter(Boolean),
      brand: prod.brand ? { '@type': 'Brand', name: prod.brand } : undefined,
      category: prod.categoryName || undefined,
      offers: {
        '@type': 'Offer',
        url: url,
        priceCurrency: 'VND',
        price: prod.retailPrice || undefined,
        availability:
          prod.inStock === false
            ? 'https://schema.org/OutOfStock'
            : 'https://schema.org/InStock',
      },
    };

    // Bổ sung thuộc tính kỹ thuật thật
    if (richMeta.specsTable && richMeta.specsTable.length > 0) {
      product.additionalProperty = richMeta.specsTable.slice(0, 20).map(s => ({
        '@type': 'PropertyValue',
        name: s.k,
        value: s.v,
      }));
    }

    const faqItems = buildFaqItems(prod, richMeta);
    const graph = [product];
    if (faqItems.length > 0) {
      graph.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(it => ({
          '@type': 'Question',
          name: it.q,
          acceptedAnswer: { '@type': 'Answer', text: it.a },
        })),
      });
    }

    let tag = document.getElementById('productJsonLd');
    if (!tag) {
      tag = document.createElement('script');
      tag.type = 'application/ld+json';
      tag.id = 'productJsonLd';
      document.head.appendChild(tag);
    }
    tag.textContent = JSON.stringify(graph.length === 1 ? graph[0] : graph);
  }

  // Cập nhật meta description + Open Graph động theo sản phẩm.
  function updateDynamicMeta(prod, richMeta) {
    const name = prod.name || '';
    const brand = prod.brand ? `${prod.brand} ` : '';
    const cat = prod.categoryName ? `${prod.categoryName} - ` : '';
    const desc =
      (richMeta.description || '').replace(/\s+/g, ' ').trim().slice(0, 155) ||
      `${brand}${name} chính hãng, bảo hành ${prod.warranty || 'đầy đủ'}.`;

    const setMeta = (attr, key, content) => {
      let m = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!m) {
        m = document.createElement('meta');
        m.setAttribute(attr, key);
        document.head.appendChild(m);
      }
      m.setAttribute('content', content);
    };

    document.title = `${cat}${name} | HTA Vietnam`;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', name);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:type', 'product');
    setMeta('property', 'og:url', `https://htavietnam.com/san-pham.html#prod-${prod.id}`);
    if (prod.image) setMeta('property', 'og:image', prod.image);
  }

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

    // Generate Rich Metadata (CHỈ dữ liệu thật: tags, mô tả, bảng thông số)
    const richMeta = generateProductRichMetadata(prod);

    // Tab 1: Tính năng nổi bật (dữ liệu thật). Nếu không có -> ẩn tab.
    const realFeatures = richMeta.features;
    if (el.modalSpecsList) {
      el.modalSpecsList.innerHTML = realFeatures
        .map(
          s =>
            `<li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${s}</span></li>`
        )
        .join('');
    }
    setTabVisible('tab-specs', realFeatures.length > 0);

    // Tab 2: Mô tả sản phẩm thật — trình bày theo cấu trúc thân thiện AI/SEO.
    // Gồm: Tóm tắt nhanh (bảng dữ kiện) + Giới thiệu (heading có từ khóa) + FAQ.
    const faqItems = buildFaqItems(prod, richMeta);
    const hasFacts = !!(prod.brand || prod.categoryName || prod.sku || prod.warranty);
    const hasDescContent = !!richMeta.description || hasFacts || faqItems.length > 0;

    if (el.modalDescription) {
      if (hasDescContent) {
        let descHtml = '';
        descHtml += renderKeyFacts(prod, richMeta);
        descHtml += renderSemanticDescription(prod, richMeta);
        descHtml += renderFaq(prod, richMeta);
        el.modalDescription.innerHTML = descHtml;
      } else {
        el.modalDescription.innerHTML = '';
      }
    }
    setTabVisible('tab-desc', hasDescContent);

    // Structured data + meta động cho máy tìm kiếm / AI
    injectProductJsonLd(prod, richMeta);
    updateDynamicMeta(prod, richMeta);

    // Tab 3: Thẻ tag (chỉ thương hiệu / danh mục thật). Nếu rỗng -> ẩn tab.
    const hasTags =
      richMeta.techTags.length > 0 ||
      richMeta.fitTags.length > 0 ||
      richMeta.materialTags.length > 0;
    if (el.modalTechTags) {
      el.modalTechTags.innerHTML = richMeta.techTags
        .map(t => `<span class="tag-chip chip-tech">#${t}</span>`)
        .join('');
    }
    if (el.modalFitTags) {
      el.modalFitTags.innerHTML = richMeta.fitTags
        .map(t => `<span class="tag-chip chip-fit">#${t}</span>`)
        .join('');
    }
    if (el.modalMaterialTags) {
      el.modalMaterialTags.innerHTML = richMeta.materialTags
        .map(t => `<span class="tag-chip chip-material">#${t}</span>`)
        .join('');
    }
    // Ẩn hẳn khối tag nếu không có dữ liệu thật (tránh nhãn rỗng gây hiểu nhầm)
    const fitBlock = document.getElementById('modalFitTagsBlock');
    if (fitBlock) fitBlock.style.display = richMeta.fitTags.length > 0 ? '' : 'none';
    const materialBlock = document.getElementById('modalMaterialTagsBlock');
    if (materialBlock) materialBlock.style.display = richMeta.materialTags.length > 0 ? '' : 'none';
    setTabVisible('tab-tags', hasTags);

    // Tab 4: Bảng thông số kỹ thuật thật. Nếu không có -> ẩn tab.
    if (el.modalTechTable) {
      el.modalTechTable.innerHTML = richMeta.specsTable.length
        ? `
        <table class="tech-table">
          <tbody>
            ${richMeta.specsTable
          .map(
            row => `
              <tr>
                <td class="tech-table-label">${row.k}</td>
                <td class="tech-table-val">${row.v}</td>
              </tr>
            `
          )
          .join('')}
          </tbody>
        </table>
      `
        : '';
    }
    setTabVisible('tab-tech', richMeta.specsTable.length > 0);

    // Chọn tab mặc định: ưu tiên tab đầu tiên có dữ liệu thật
    const tabOrder = ['tab-specs', 'tab-desc', 'tab-tags', 'tab-tech'];
    const firstVisible =
      tabOrder.find(t => {
        const btn = document.querySelector(`.modal-tab-btn[data-tab="${t}"]`);
        return btn && btn.style.display !== 'none';
      }) || 'tab-specs';

    document.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.modal-tab-pane').forEach(p => p.classList.remove('active'));
    const defaultTabBtn = document.querySelector(`.modal-tab-btn[data-tab="${firstVisible}"]`);
    const defaultTabPane = document.getElementById(firstVisible);
    if (defaultTabBtn) defaultTabBtn.classList.add('active');
    if (defaultTabPane) defaultTabPane.classList.add('active');

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

  // Share URL helper - luôn tạo link chuẩn domain chugia.shop để khi quét mã QR trên điện thoại mở đúng link
  function getProductShareUrl(prod) {
    if (!prod) return 'https://chugia.shop/san-pham.html';
    return `https://chugia.shop/san-pham.html#prod-${prod.id}`;
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
      // Draw Chu Gia watermark at top left and bottom left of card
      drawWatermarkCornerBadge(ctx, cardX + 12, cardY + 12);
      drawWatermarkCornerBadge(ctx, cardX + 12, cardY + cardH - 46);
      drawPosterDetails(ctx, prod, width, height);
    };

    prodImg.onerror = function () {
      // Fallback if image blocked
      drawQrCornerBadge(ctx, cardX + cardW - 105, cardY + cardH - 105, qrDiv);
      drawWatermarkCornerBadge(ctx, cardX + 12, cardY + 12);
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

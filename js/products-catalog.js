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
    text += '\nHotline: 0941 204 125 | Zalo: https://zalo.me/0941204125 | Facebook: https://www.facebook.com/phuongminhorg/';
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

  // ===================== SPECIALIZED MULTI-BRAND WI-FI COMBOS SYSTEM (OMADA / RUIJIE / HUAWEI) =====================

  window.ALL_WIFI_COMBOS = {
    omada: {
      brandId: 'omada',
      brandName: 'TP-Link Omada SDN',
      brandBadge: 'HỆ THỐNG MẠNG & WI-FI 6 DOANH NGHIỆP • TP-LINK OMADA SDN',
      sectionTitle: 'Combo Giải Pháp Wi-Fi 6 & Mạng Chuyên Dụng TP-Link Omada',
      sectionSub: 'Được kỹ sư Chu Gia Security thiết kế và tối ưu thông số chịu tải thực chiến: <strong>Nhà ở thông minh, Biệt thự Villa, Văn phòng doanh nghiệp</strong> và <strong>Nhà máy sản xuất</strong>. Chuyển vùng Seamless Roaming không ngắt cuộc gọi, cân bằng tải Multi-WAN gộp nhiều đường truyền Internet và quản trị Cloud 24/7.',
      exploreText: 'Xem 16 Thiết Bị Omada Trong Kho ↓',
      combos: {
        home: {
          id: 'home',
          badge: 'GIẢI PHÁP TIÊU BIỂU • NHÀ Ở & NHÀ PHỐ',
          icon: '🏠',
          tabLabel: 'Nhà Ở & Căn Hộ',
          tabSub: '30 – 50 Thiết bị • 100-250m²',
          title: 'Combo Mạng Wi-Fi 6 Omada Nhà Ở & Căn Hộ Cao Cấp',
          subtitle: 'Chấm dứt hoàn toàn tình trạng rớt mạng khi leo cầu thang, phủ sóng căng tràn 100% diện tích 100 – 250m².',
          stats: [
            { label: 'Chịu tải đề xuất', val: '30 – 50 Thiết bị' },
            { label: 'Diện tích phủ sóng', val: '100 – 250 m²' },
            { label: 'Chuẩn Wi-Fi', val: 'Wi-Fi 6 AX1800' },
            { label: 'Chuyển vùng', val: 'Fast Roaming 802.11k/v' }
          ],
          items: [
            { id: 99003, sku: 'ER605', name: 'Router Cân Bằng Tải Multi-WAN Gigabit Omada ER605', qty: 1, role: 'Định tuyến & Gộp băng thông Internet', price: 2600000, img: 'images/products/omada/er605.jpg' },
            { id: 99004, sku: 'SG2008P', name: 'Switch Thông Minh JetStream 8 Cổng (4 PoE+ 62W) SG2008P', qty: 1, role: 'Cấp nguồn PoE trực tiếp qua dây cáp mạng', price: 3570000, img: 'images/products/omada/sg2008p.jpg' },
            { id: 99006, sku: 'EAP610', name: 'Access Point Gắn Trần Wi-Fi 6 AX1800 Gigabit PoE EAP610', qty: 2, role: 'Phát sóng Wi-Fi 6 đa tầng xuyên phòng', price: 3350000, img: 'images/products/omada/eap610.jpg' }
          ],
          originalPrice: 9500000,
          retailTotal: 12870000,
          comboPrice: 11900000,
          savingsAmount: 970000,
          savingsText: 'Tiết kiệm 970.000 ₫ (Miễn phí cấu hình SDN Cloud)',
          description: 'Bộ combo mạng tiêu chuẩn cho nhà phố 2-4 tầng hoặc căn hộ chung cư 3 phòng ngủ. Kết hợp router cân bằng tải ER605 với 2 Access Point EAP610 cấp nguồn PoE gọn gàng, bảo đảm học tập trực tuyến, xem phim 4K và họp Zoom không độ trễ.'
        },
        villa: {
          id: 'villa',
          badge: 'ĐẲNG CẤP THƯỢNG LƯU • BIỆT THỰ & DINH THỰ',
          icon: '🏰',
          tabLabel: 'Biệt Thự & Villa Sân Vườn',
          tabSub: '80 – 150 Thiết bị • IP67 Ngoài Trời',
          title: 'Combo Wi-Fi 6 Toàn Diện Biệt Thự & Villa Sân Vườn',
          subtitle: 'Sóng phủ 100% từ phòng khách, phòng ngủ Master đến sân vườn hồ bơi ngoài trời IP67, thiết kế siêu mỏng sang trọng.',
          stats: [
            { label: 'Chịu tải đề xuất', val: '80 – 150 Thiết bị' },
            { label: 'Diện tích phủ sóng', val: '300 – 800 m²' },
            { label: 'Tốc độ tối đa', val: 'AX3000 (HE160)' },
            { label: 'Ngoài trời', val: 'IP67 Chống sét 6kV' }
          ],
          items: [
            { id: 99007, sku: 'ER7206', name: 'Router Doanh Nghiệp Multi-WAN Gigabit ER7206', qty: 1, role: 'Cân bằng tải đa mạng, chịu tải 200 user', price: 5620000, img: 'images/products/omada/er7206.jpg' },
            { id: 99005, sku: 'OC200', name: 'Bộ Điều Khiển Phần Cứng Đám Mây OC200', qty: 1, role: 'Quản trị tập trung 24/7, Fast Roaming', price: 2700000, img: 'images/products/omada/oc200.jpg' },
            { id: 99008, sku: 'SG2210P', name: 'Switch Quản Lý 10 Cổng Gigabit (8 PoE+ 61W + 2 SFP) SG2210P', qty: 1, role: 'Cấp nguồn PoE toàn bộ hệ thống APs', price: 5840000, img: 'images/products/omada/sg2210p.jpg' },
            { id: 99001, sku: 'EAP653', name: 'Access Point Gắn Trần Siêu Mỏng Wi-Fi 6 AX3000 EAP653', qty: 2, role: 'Phòng khách & Đại sảnh vòm', price: 4430000, img: 'images/products/omada/eap653.jpg' },
            { id: 99009, sku: 'EAP615-Wall', name: 'Access Point Âm Tường Wi-Fi 6 EAP615-Wall (4 LAN Port)', qty: 2, role: 'Phòng ngủ Master & Phòng giải trí', price: 3460000, img: 'images/products/omada/eap615_wall.jpg' },
            { id: 99002, sku: 'EAP610-Outdoor', name: 'Access Point Ngoài Trời IP67 EAP610-Outdoor', qty: 1, role: 'Sân vườn, bể bơi, khu tiệc BBQ', price: 5190000, img: 'images/products/omada/eap610_outdoor.jpg' }
          ],
          originalPrice: 25000000,
          retailTotal: 35130000,
          comboPrice: 32500000,
          savingsAmount: 2630000,
          savingsText: 'Tiết kiệm 2.630.000 ₫ (Tặng gói đo kiểm sóng Heatmap)',
          description: 'Giải pháp mạng Wi-Fi kiến trúc hoàn hảo cho biệt thự nghỉ dưỡng và dinh thự cao cấp. Kết hợp AP gắn trần siêu mỏng EAP653 với AP âm tường EAP615-Wall trong phòng ngủ và AP ngoài trời IP67 chịu nắng mưa sân vườn.'
        },
        office: {
          id: 'office',
          badge: 'DOANH NGHIỆP HIỆN ĐẠI • VĂN PHÒNG & CO-WORKING',
          icon: '🏢',
          tabLabel: 'Văn Phòng Doanh Nghiệp',
          tabSub: '150 – 200 User • Cổng 2.5GE',
          title: 'Combo Mạng Doanh Nghiệp Văn Phòng & Tòa Nhà Làm Việc',
          subtitle: 'Chịu tải mật độ cao High-Density 150 – 200 nhân sự, cổng 2.5GE không nghẽn cổ chai, chia 5 VLAN bảo mật nội bộ.',
          stats: [
            { label: 'Chịu tải đồng thời', val: '150 – 200 Nhân sự' },
            { label: 'Cổng kết nối AP', val: '2.5 Gigabit Multi-Gig' },
            { label: 'Băng thông', val: 'AX5400 (Kênh 160MHz)' },
            { label: 'Bảo mật', val: '5 VLAN + Captive Portal' }
          ],
          items: [
            { id: 99007, sku: 'ER7206', name: 'Router Doanh Nghiệp Multi-WAN Gigabit ER7206', qty: 1, role: 'Cân bằng tải 3 line mạng FPT/Viettel/VNPT', price: 5620000, img: 'images/products/omada/er7206.jpg' },
            { id: 99005, sku: 'OC200', name: 'Bộ Điều Khiển Phần Cứng Đám Mây OC200', qty: 1, role: 'Phát hành Wi-Fi Marketing Captive Portal', price: 2700000, img: 'images/products/omada/oc200.jpg' },
            { id: 99011, sku: 'SG2428P', name: 'Switch Quản Lý Smart JetStream 28 Cổng (24 PoE+ 250W) SG2428P', qty: 1, role: 'Cấp nguồn PoE cho 24 cổng APs & Camera', price: 13400000, img: 'images/products/omada/sg2428p.jpg' },
            { id: 99010, sku: 'EAP670', name: 'Access Point High-Density Wi-Fi 6 AX5400 Cổng 2.5GE EAP670', qty: 4, role: 'Chịu tải 150+ user/AP cho phòng mở & hội họp', price: 7350000, img: 'images/products/omada/eap670.jpg' }
          ],
          originalPrice: 38000000,
          retailTotal: 51120000,
          comboPrice: 47300000,
          savingsAmount: 3820000,
          savingsText: 'Tiết kiệm 3.820.000 ₫ (Miễn phí cấu hình VLAN & Trang chào)',
          description: 'Hạ tầng mạng chuẩn công nghệ dành cho văn phòng công ty 50 – 150 nhân viên. Phân tách mạng riêng biệt cho Giám đốc, Kế toán, Nhân viên và Khách hàng; cổng 2.5GE trên AP EAP670 giải phóng tối đa tốc độ họp trực tuyến và sao lưu NAS nội bộ.'
        },
        factory: {
          id: 'factory',
          badge: 'CÔNG NGHIỆP NẶNG • NHÀ MÁY & KHU CHẾ XUẤT',
          icon: '🏭',
          tabLabel: 'Doanh Nghiệp & Xưởng',
          tabSub: 'Trục 10G SFP+ • 500+ Thiết bị',
          title: 'Combo Mạng Công Nghiệp Siêu Cấp Nhà Máy & Kho Bãi Logistics',
          subtitle: 'Hệ thống Gateway 10G Multi-WAN, Switch 10G SFP+ Uplink, AP công suất lớn phủ xuyên giá kệ kim loại nhà xưởng 2.000 – 10.000m².',
          stats: [
            { label: 'Quy mô chịu tải', val: '500 – 1.000+ Thiết bị' },
            { label: 'Trục cáp quang', val: '10G SFP+ Dual Redundant' },
            { label: 'Diện tích xưởng', val: '2.000 – 10.000 m²' },
            { label: 'Roaming xe nâng', val: 'Handheld Scanner < 10ms' }
          ],
          items: [
            { id: 99012, sku: 'ER8411', name: 'Router Siêu Cấp 10G Multi-WAN Dual Power ER8411', qty: 1, role: 'Gateway 10G, CPU lõi tứ, nguồn kép dự phòng', price: 19010000, img: 'images/products/omada/er8411.jpg' },
            { id: 99013, sku: 'OC300', name: 'Bộ Điều Khiển Phần Cứng Enterprise OC300', qty: 1, role: 'Quản trị 500 thiết bị & 15.000 client', price: 6050000, img: 'images/products/omada/oc300.jpg' },
            { id: 99014, sku: 'SG3428XMP', name: 'Switch Quản Lý L2+ Managed 28 Cổng (24 PoE+ 384W + 4 10G SFP+) SG3428XMP', qty: 2, role: 'Trục chính kéo cáp quang 10G về từng phân xưởng', price: 25490000, img: 'images/products/omada/sg3428xmp.jpg' },
            { id: 99015, sku: 'EAP683 LR', name: 'Access Point Tầm Xa High-Density Wi-Fi 6 AX6000 4x4 EAP683 LR', qty: 6, role: 'Phủ sóng nhà xưởng trần cao & kho kệ kim loại', price: 10590000, img: 'images/products/omada/eap683_lr.jpg' },
            { id: 99016, sku: 'EAP650-Outdoor', name: 'Access Point Ngoài Trời Cao Cấp IP67 EAP650-Outdoor', qty: 2, role: 'Bãi container, cầu cảng xuất nhập hàng', price: 6920000, img: 'images/products/omada/eap650_outdoor.jpg' }
          ],
          originalPrice: 110000000,
          retailTotal: 153420000,
          comboPrice: 142000000,
          savingsAmount: 11420000,
          savingsText: 'Tiết kiệm 11.420.000 ₫ (Bao gồm khảo sát mô phỏng phổ nhiệt sóng RF 3D)',
          description: 'Hạ tầng mạng công nghiệp hoàn hảo cho nhà xưởng sản xuất quy mô lớn và trung tâm logistics. Đáp ứng nghiêm ngặt việc kết nối thiết bị quét mã vạch Barcode Handheld trên xe nâng di chuyển liên tục, camera AI giám sát dây chuyền sản xuất và hệ thống cảm biến IoT.'
        }
      }
    },
    ruijie: {
      brandId: 'ruijie',
      brandName: 'Ruijie Reyee Cloud',
      brandBadge: 'HỆ THỐNG MẠNG ĐÁM MÂY TỰ TỔ CHỨC • RUIJIE REYEE CLOUD',
      sectionTitle: 'Combo Giải Pháp Wi-Fi 6 / 7 & Cân Bằng Tải Ruijie Reyee',
      sectionSub: 'Được thiết kế từ dòng sản phẩm chính hãng <strong>Ruijie Networks</strong>: Router tích hợp PoE cấp nguồn trực tiếp, Switch đám mây thông minh và Access Point Wi-Fi 6 / Wi-Fi 7 BE3600. Tự động tối ưu mạng Reyee Mesh, chuyển vùng cực nhanh và giám sát toàn diện qua ứng dụng Ruijie Cloud 24/7.',
      exploreText: 'Xem 42 Thiết Bị Ruijie Trong Kho ↓',
      combos: {
        home: {
          id: 'home',
          badge: 'TIÊU CHUẨN HIỆN ĐẠI • NHÀ PHỐ & CĂN HỘ',
          icon: '🏠',
          tabLabel: 'Nhà Ở & Căn Hộ',
          tabSub: '30 – 60 Thiết bị • 100-220m²',
          title: 'Combo Mạng Wi-Fi Reyee Mesh Nhà Phố & Căn Hộ Cao Cấp',
          subtitle: 'Router tích hợp sẵn 4 cổng PoE cấp nguồn trực tiếp cho AP, không cần nối thêm switch hay adapter rườm rà.',
          stats: [
            { label: 'Chịu tải đề xuất', val: '30 – 60 Thiết bị' },
            { label: 'Diện tích phủ sóng', val: '100 – 220 m²' },
            { label: 'Chuẩn Wi-Fi', val: 'Reyee Mesh Gigabit' },
            { label: 'Quản trị Cloud', val: 'Ruijie Cloud App 24/7' }
          ],
          items: [
            { id: 1181491, sku: 'RG-EG105G-P-V3', name: 'Modem Router Ruijie Cân Bằng Tải RG-EG105G-P-V3', qty: 1, role: 'Định tuyến 600Mbps, 100 user, 4 PoE cấp nguồn AP', price: 4430000, img: 'https://sapo.dktcdn.net/100/825/511/variants/rg-eg105g-p-v2-1777900777711.png' },
            { id: 1181499, sku: 'RG-RAP2200(E)', name: 'Bộ Phát Wifi Ruijie Gắn Trần/Tường RG-RAP2200(E)', qty: 2, role: 'Phát sóng 1267Mbps, 2 LAN Gigabit, Roaming mượt', price: 2920000, img: 'images/products/1181499.jpg' }
          ],
          originalPrice: 7500000,
          retailTotal: 10270000,
          comboPrice: 9500000,
          savingsAmount: 770000,
          savingsText: 'Tiết kiệm 770.000 ₫ (Miễn phí cấu hình Reyee Cloud)',
          description: 'Giải pháp mạng tối ưu cho nhà phố 2-4 tầng hoặc căn hộ cao cấp. Router RG-EG105G-P-V3 có sẵn 4 cổng PoE tự cấp nguồn trực tiếp cho 2 bộ phát RG-RAP2200(E) qua dây mạng LAN, giúp trần nhà thẩm mỹ tuyệt đối, không lo ổ điện.'
        },
        villa: {
          id: 'villa',
          badge: 'ĐẲNG CẤP THƯỢNG LƯU • BIỆT THỰ & DINH THỰ',
          icon: '🏰',
          tabLabel: 'Biệt Thự & Villa Sân Vườn',
          tabSub: '80 – 150 Thiết bị • IP68 Ngoài Trời',
          title: 'Combo Wi-Fi 6 Toàn Diện Biệt Thự & Villa Sân Vườn Ruijie',
          subtitle: 'Sóng phủ căng tràn từ đại sảnh vòm, phòng ngủ âm tường đến khuôn viên sân vườn hồ bơi chuẩn chống nước IP68.',
          stats: [
            { label: 'Chịu tải đề xuất', val: '80 – 150 Thiết bị' },
            { label: 'Diện tích phủ sóng', val: '300 – 700 m²' },
            { label: 'Chuẩn Wi-Fi', val: 'Wi-Fi 6 AX1800' },
            { label: 'Ngoài trời', val: 'IP68 Chống sét 4kV' }
          ],
          items: [
            { id: 1181489, sku: 'RG-EG210G-P-V3', name: 'Modem Router Ruijie Cân Bằng Tải RG-EG210G-P-V3', qty: 1, role: '10 cổng Gigabit (8 PoE 70W), chịu tải 200 user', price: 7350000, img: 'https://sapo.dktcdn.net/100/825/511/variants/rg-eg210g-p-v3-1769089890621-1777900746049.jpg' },
            { id: 1181498, sku: 'RG-RAP2260(G)', name: 'Bộ Phát Wifi Ruijie Gắn Trần Wi-Fi 6 RG-RAP2260(G)', qty: 2, role: 'Wi-Fi 6 1775Mbps, 2 LAN Gigabit đại sảnh & phòng khách', price: 5510000, img: 'images/products/1181498.jpg' },
            { id: 1181501, sku: 'RG-RAP1200(F)', name: 'Bộ Phát Wifi Ruijie Âm Tường RG-RAP1200(F)', qty: 1, role: 'Thiết kế âm tường chuẩn 86 phòng ngủ Master', price: 1950000, img: 'https://sapo.dktcdn.net/100/825/511/variants/20226235933911-1777902331553.jpg' },
            { id: 1181497, sku: 'RG-RAP6262(G)', name: 'Bộ Phát Wifi Ruijie Ngoài Trời Wi-Fi 6 RG-RAP6262(G)', qty: 1, role: 'Chuẩn IP68 chịu nắng mưa, phủ sóng sân vườn hồ bơi', price: 7780000, img: 'https://sapo.dktcdn.net/100/825/511/variants/202281731502316-1777902280160.jpg' }
          ],
          originalPrice: 20000000,
          retailTotal: 28100000,
          comboPrice: 26000000,
          savingsAmount: 2100000,
          savingsText: 'Tiết kiệm 2.100.000 ₫ (Tặng gói phân vùng mạng an ninh IoT)',
          description: 'Kiến trúc Wi-Fi toàn diện cho dinh thự và biệt thự sân vườn. Kết hợp hoàn hảo AP gắn trần công suất cao RG-RAP2260(G) với AP âm tường RG-RAP1200(F) và AP ngoài trời IP68 chống chịu thời tiết khắc nghiệt.'
        },
        office: {
          id: 'office',
          badge: 'DOANH NGHIỆP HIỆN ĐẠI • VĂN PHÒNG & CO-WORKING',
          icon: '🏢',
          tabLabel: 'Văn Phòng Doanh Nghiệp',
          tabSub: '150 – 250 User • Cổng 2.5GE',
          title: 'Combo Mạng Doanh Nghiệp Ruijie Cổng 2.5GE High-Density',
          subtitle: 'Chịu tải đồng thời 150 – 250 nhân sự, cổng 2.5GE giải phóng băng thông không nghẽn, chia 5 VLAN bảo mật.',
          stats: [
            { label: 'Chịu tải đồng thời', val: '150 – 250 Nhân sự' },
            { label: 'Cổng Gateway', val: '5 LAN 2.5GE + 1 SFP 10GE' },
            { label: 'Băng thông', val: 'Wi-Fi 6 High-Density' },
            { label: 'Bảo mật', val: 'VLAN + Portal Khách' }
          ],
          items: [
            { id: 1181485, sku: 'RG-EG406XS-P', name: 'Modem Router Cân Bằng Tải Ruijie RG-EG406XS-P', qty: 1, role: '5 LAN 2.5GE, 4 PoE, 1 SFP 10GE, chịu tải 400 user', price: 10310000, img: 'https://sapo.dktcdn.net/100/825/511/variants/rg-eg406xs-p-4-1777898814728.jpg' },
            { id: 1181427, sku: 'RG-ES209GC-P', name: 'Switch PoE Ruijie RG-ES209GC-P Cloud Managed', qty: 1, role: '8 PoE Gigabit, 1 Uplink, công suất 120W', price: 4540000, img: 'https://sapo.dktcdn.net/100/825/511/variants/202251027525239-1777902378631.png' },
            { id: 1181498, sku: 'RG-RAP2260(G)', name: 'Bộ Phát Wifi Ruijie Gắn Trần Wi-Fi 6 RG-RAP2260(G)', qty: 3, role: 'Chịu tải 100+ user/AP, phủ sóng phòng làm việc mở', price: 5510000, img: 'images/products/1181498.jpg' }
          ],
          originalPrice: 23000000,
          retailTotal: 31380000,
          comboPrice: 29040000,
          savingsAmount: 2340000,
          savingsText: 'Tiết kiệm 2.340.000 ₫ (Miễn phí phân tách VLAN phòng ban)',
          description: 'Giải pháp mạng tốc độ cao cho văn phòng 50 - 150 nhân viên. Router RG-EG406XS-P trang bị cổng 2.5GE thế hệ mới cùng cổng quang 10G SFP+, kết hợp 3 AP Wi-Fi 6 High-Density đảm bảo họp trực tuyến và truy xuất file server tốc độ ánh sáng.'
        },
        factory: {
          id: 'factory',
          badge: 'CÔNG NGHỆ ĐỈNH CAO • TÒA NHÀ & KHÁCH SẠN',
          icon: '🏭',
          tabLabel: 'Tòa Nhà & Khách Sạn',
          tabSub: 'Trục 10G SFP+ • Wi-Fi 7 BE3600',
          title: 'Combo Mạng Tòa Nhà & Khách Sạn Siêu Cấp Wi-Fi 7 Ruijie',
          subtitle: 'Gateway 10G SFP+ chịu tải 700 user, Switch PoE 24 cổng, kết hợp AP Wi-Fi 7 BE3600 cổng 2.5GE và AP ngoài trời IP68.',
          stats: [
            { label: 'Quy mô chịu tải', val: '500 – 700+ Thiết bị' },
            { label: 'Trục quang chính', val: '2 Cổng SFP+ 10GE' },
            { label: 'Chuẩn Wi-Fi', val: 'Wi-Fi 7 BE3600 2.5GE' },
            { label: 'Ngoài trời', val: 'IP68 Dual-Band Mesh' }
          ],
          items: [
            { id: 1181484, sku: 'RG-EG710XS', name: 'Modem Router Cân Bằng Tải Enterprise RG-EG710XS', qty: 1, role: '4 GE, 4 Lan 2.5GE, 2 SFP 10GE, chịu tải 700 user', price: 14690000, img: 'https://sapo.dktcdn.net/100/825/511/variants/rg-eg710xs-1-1778412259848.jpg' },
            { id: 1181421, sku: 'RG-ES228GS-P', name: 'Switch PoE Ruijie 24 Cổng RG-ES228GS-P (370W)', qty: 1, role: '24 PoE Gigabit, 2 Uplink, 2 SFP, cấp nguồn hệ thống', price: 13400000, img: 'https://sapo.dktcdn.net/100/825/511/variants/d3f40f850c614c3fb06c62bac33d3a62-1777902356590.png' },
            { id: 1181495, sku: 'RG-RAP72', name: 'Bộ Phát Wifi Ruijie Gắn Trần Wi-Fi 7 RG-RAP72', qty: 2, role: 'Wi-Fi 7 BE3600, cổng 2.5GE, công nghệ đa liên kết MLO', price: 7130000, img: 'https://sapo.dktcdn.net/100/825/511/variants/rg-rap72-1777898908891.jpg' },
            { id: 1181497, sku: 'RG-RAP6262(G)', name: 'Bộ Phát Wifi Ruijie Ngoài Trời Wi-Fi 6 RG-RAP6262(G)', qty: 2, role: 'IP68 công suất lớn cho sân golf, hồ bơi, khuôn viên', price: 7780000, img: 'https://sapo.dktcdn.net/100/825/511/variants/202281731502316-1777902280160.jpg' }
          ],
          originalPrice: 42000000,
          retailTotal: 57910000,
          comboPrice: 53600000,
          savingsAmount: 4310000,
          savingsText: 'Tiết kiệm 4.310.000 ₫ (Bao gồm thiết lập Captive Portal & Marketing)',
          description: 'Hạ tầng mạng chuẩn công nghiệp cho tòa nhà văn phòng, chuỗi khách sạn và resort. Gateway RG-EG710XS kết hợp các bộ phát Wi-Fi 7 thế hệ mới RG-RAP72 mang lại trải nghiệm mạng không giới hạn, độ trễ tiệm cận 0ms.'
        }
      }
    },
    huawei: {
      brandId: 'huawei',
      brandName: 'Huawei eKit Enterprise',
      brandBadge: 'HỆ THỐNG MẠNG VIỄN THÔNG DOANH NGHIỆP • HUAWEI eKit Wi-Fi 7',
      sectionTitle: 'Combo Giải Pháp Wi-Fi 7 & Mạng Doanh Nghiệp Huawei eKit',
      sectionSub: 'Đột phá công nghệ từ tập đoàn viễn thông hàng đầu thế giới <strong>Huawei Technologies</strong>: Router cân bằng tải chuẩn Wi-Fi 7 thế hệ mới tích hợp cổng 2.5GE, kết hợp Access Point gắn trần và âm tường công nghệ AI Smart Antenna roaming liền mạch.',
      exploreText: 'Xem 3 Thiết Bị Huawei eKit Trong Kho ↓',
      combos: {
        home: {
          id: 'home',
          badge: 'ĐỘT PHÁ WI-FI 7 • NHÀ PHỐ & CĂN HỘ',
          icon: '🏠',
          tabLabel: 'Nhà Ở & Căn Hộ',
          tabSub: '30 – 50 Thiết bị • Wi-Fi 7 3600M',
          title: 'Combo Mạng Wi-Fi 7 Huawei eKit Nhà Phố & Căn Hộ',
          subtitle: 'Trải nghiệm công nghệ Wi-Fi 7 thế hệ mới với router AR180 cổng 2.5GE và bộ phát AP361 độ ổn định viễn thông.',
          stats: [
            { label: 'Chịu tải đề xuất', val: '30 – 50 Thiết bị' },
            { label: 'Diện tích phủ sóng', val: '100 – 200 m²' },
            { label: 'Chuẩn Wi-Fi', val: 'Wi-Fi 7 BE3600' },
            { label: 'Cổng WAN', val: '2.5 Gigabit Multi-Gig' }
          ],
          items: [
            { id: 1181509, sku: 'AR180', name: 'Modem Router Wifi Cân Bằng Tải Huawei eKit AR180', qty: 1, role: 'Chuẩn Wi-Fi 7 3600Mbps, WAN 2.5GE, 4 LAN GE, 100 user', price: 5190000, img: 'images/products/1181509.jpg' },
            { id: 1181511, sku: 'AP361', name: 'Bộ Phát Wifi Huawei Gắn Trần/Tường AP361', qty: 1, role: 'Chuẩn Wi-Fi 6 AX1800, Gigabit PoE phủ tầng 2', price: 3640000, img: 'images/products/1181511.jpg' }
          ],
          originalPrice: 6500000,
          retailTotal: 8830000,
          comboPrice: 8160000,
          savingsAmount: 670000,
          savingsText: 'Tiết kiệm 670.000 ₫ (Miễn phí cấu hình eKit Cloud)',
          description: 'Combo gia đình và căn hộ dẫn đầu công nghệ với Router Huawei AR180 tích hợp sẵn Wi-Fi 7 tốc độ 3600Mbps kết hợp 1 Access Point AP361. Đảm bảo xem video 8K, chơi game không giật lag và tải file dung lượng lớn trong chớp mắt.'
        },
        villa: {
          id: 'villa',
          badge: 'THẨM MỸ CAO CẤP • BIỆT THỰ & DINH THỰ',
          icon: '🏰',
          tabLabel: 'Biệt Thự & Villa Sân Vườn',
          tabSub: '60 – 100 Thiết bị • Âm Tường Thẩm Mỹ',
          title: 'Combo Wi-Fi 6/7 Toàn Diện Biệt Thự & Villa Huawei eKit',
          subtitle: 'Kết hợp router trung tâm Wi-Fi 7 2.5GE với AP gắn trần phòng khách và AP âm tường thanh lịch cho phòng ngủ Master.',
          stats: [
            { label: 'Chịu tải đề xuất', val: '60 – 100 Thiết bị' },
            { label: 'Diện tích phủ sóng', val: '250 – 500 m²' },
            { label: 'Kiến trúc lắp đặt', val: 'Trần vòm & Âm tường' },
            { label: 'Cấp nguồn PoE', val: 'Switch PoE Gigabit' }
          ],
          items: [
            { id: 1181509, sku: 'AR180', name: 'Modem Router Wifi Cân Bằng Tải Huawei eKit AR180', qty: 1, role: 'Gateway Wi-Fi 7 3600Mbps, WAN 2.5GE trung tâm', price: 5190000, img: 'images/products/1181509.jpg' },
            { id: 1181428, sku: 'RG-ES206GC-P', name: 'Switch PoE Gigabit 6 Cổng Cloud Managed', qty: 1, role: 'Cấp nguồn PoE chuẩn IEEE 802.3af/at cho toàn bộ AP', price: 2810000, img: 'https://sapo.dktcdn.net/100/825/511/variants/202251025306435-32ee1637-45a3-4ee2-9fda-20e3be37bbbb-1777902385162.png' },
            { id: 1181511, sku: 'AP361', name: 'Bộ Phát Wifi Huawei Gắn Trần/Tường AP361', qty: 2, role: 'Gắn trần sảnh chính & phòng khách không gian mở', price: 3640000, img: 'images/products/1181511.jpg' },
            { id: 1181510, sku: 'AP160', name: 'Bộ Phát Wifi Huawei Âm Tường AP160', qty: 1, role: 'Thiết kế âm tường sang trọng phòng ngủ Master', price: 3680000, img: 'https://sapo.dktcdn.net/100/825/511/variants/ap160-1766647325774-1777898994607.jpg' }
          ],
          originalPrice: 14000000,
          retailTotal: 18960000,
          comboPrice: 17520000,
          savingsAmount: 1440000,
          savingsText: 'Tiết kiệm 1.440.000 ₫ (Miễn phí đo kiểm sóng đa tầng)',
          description: 'Giải pháp mạng cao cấp cho biệt thự hiện đại. Router trung tâm Huawei AR180 quản lý đa đường truyền tốc độ cao, cấp nguồn PoE an toàn cho 2 AP gắn trần và 1 AP âm tường phẳng tiệp màu tường, đem lại vẻ đẹp tinh tế đẳng cấp.'
        },
        office: {
          id: 'office',
          badge: 'DOANH NGHIỆP TỐC ĐỘ CAO • VĂN PHÒNG & STUDIO',
          icon: '🏢',
          tabLabel: 'Văn Phòng Doanh Nghiệp',
          tabSub: '80 – 120 User • Đường Truyền 2.5GE',
          title: 'Combo Mạng Doanh Nghiệp Huawei eKit Cổng 2.5GE Siêu Tốc',
          subtitle: 'Đường truyền 2.5GE không thắt cổ chai, tối ưu cho văn phòng sáng tạo nội dung, đồ họa, họp truyền hình trực tuyến.',
          stats: [
            { label: 'Chịu tải đồng thời', val: '80 – 120 Nhân sự' },
            { label: 'Cổng kết nối WAN', val: '2.5GE Multi-WAN' },
            { label: 'Độ trễ Roaming', val: '< 10ms AI Seamless' },
            { label: 'Quản trị mạng', val: 'Huawei eKit App Cloud' }
          ],
          items: [
            { id: 1181509, sku: 'AR180', name: 'Modem Router Wifi Cân Bằng Tải Huawei eKit AR180', qty: 1, role: 'Router Wi-Fi 7, WAN 2.5GE, 4 LAN GE, 100 user', price: 5190000, img: 'images/products/1181509.jpg' },
            { id: 1181427, sku: 'RG-ES209GC-P', name: 'Switch PoE Gigabit 8 Cổng (120W) Cloud Managed', qty: 1, role: 'Cấp nguồn PoE ổn định cho 3 AP và camera văn phòng', price: 4540000, img: 'https://sapo.dktcdn.net/100/825/511/variants/202251027525239-1777902378631.png' },
            { id: 1181511, sku: 'AP361', name: 'Bộ Phát Wifi Huawei Gắn Trần/Tường AP361', qty: 3, role: 'Wi-Fi 6 High-Density cho các phòng ban & phòng họp', price: 3640000, img: 'images/products/1181511.jpg' }
          ],
          originalPrice: 15500000,
          retailTotal: 20650000,
          comboPrice: 19080000,
          savingsAmount: 1570000,
          savingsText: 'Tiết kiệm 1.570.000 ₫ (Miễn phí phân luồng ưu tiên Zoom/Teams)',
          description: 'Lựa chọn lý tưởng cho các doanh nghiệp số, agency truyền thông và studio sáng tạo. Băng thông 2.5GE cùng công nghệ chuyển vùng AI thông minh của Huawei giúp mọi cuộc gọi video và tác vụ upload/download dữ liệu mượt mà tuyệt đối.'
        },
        factory: {
          id: 'factory',
          badge: 'CĂN HỘ DỊCH VỤ & KHÁCH SẠN • CHUYÊN BIỆT TỪNG PHÒNG',
          icon: '🏨',
          tabLabel: 'Khách Sạn & Homestay',
          tabSub: '4 Phòng Riêng + 1 Sảnh • AP Âm Tường',
          title: 'Combo Mạng Khách Sạn & Căn Hộ Dịch Vụ Huawei eKit',
          subtitle: 'Mỗi phòng một bộ phát âm tường riêng biệt, tốc độ tối đa không nhiễu sóng, quản lý băng thông từng phòng khách.',
          stats: [
            { label: 'Quy mô phòng', val: '4 Phòng + 1 Đại Sảnh' },
            { label: 'Access Point', val: '4 Âm Tường + 1 Gắn Trần' },
            { label: 'Bảo mật phòng', val: 'Mỗi phòng 1 SSID riêng' },
            { label: 'Quản trị', val: 'Huawei Cloud 24/7' }
          ],
          items: [
            { id: 1181509, sku: 'AR180', name: 'Modem Router Wifi Cân Bằng Tải Huawei eKit AR180', qty: 1, role: 'Gateway Wi-Fi 7 cân bằng tải 2 đường truyền Internet', price: 5190000, img: 'images/products/1181509.jpg' },
            { id: 1181427, sku: 'RG-ES209GC-P', name: 'Switch PoE Gigabit 8 Cổng (120W) Cloud Managed', qty: 1, role: 'Cấp nguồn PoE cho 5 AP qua cáp mạng đi âm tường', price: 4540000, img: 'https://sapo.dktcdn.net/100/825/511/variants/202251027525239-1777902378631.png' },
            { id: 1181510, sku: 'AP160', name: 'Bộ Phát Wifi Huawei Âm Tường AP160', qty: 4, role: 'Lắp âm tường từng phòng khách sạn, có cổng LAN cắm Smart TV', price: 3680000, img: 'https://sapo.dktcdn.net/100/825/511/variants/ap160-1766647325774-1777898994607.jpg' },
            { id: 1181511, sku: 'AP361', name: 'Bộ Phát Wifi Huawei Gắn Trần/Tường AP361', qty: 1, role: 'Gắn trần sảnh lễ tân & khu vực đón tiếp khách', price: 3640000, img: 'images/products/1181511.jpg' }
          ],
          originalPrice: 20000000,
          retailTotal: 28090000,
          comboPrice: 25960000,
          savingsAmount: 2130000,
          savingsText: 'Tiết kiệm 2.130.000 ₫ (Miễn phí thiết lập trang chào khách sạn)',
          description: 'Mô hình Wi-Fi chuyên nghiệp nhất cho khách sạn mini, villa nghỉ dưỡng hoặc căn hộ dịch vụ cao cấp. Mỗi phòng đều có riêng 1 AP âm tường AP160, bảo đảm sự riêng tư tuyệt đối, khách xem Netflix hay gọi video không ảnh hưởng phòng bên cạnh.'
        }
      }
    }
  };

  // Keep window.OMADA_COMBOS for backward compatibility
  window.OMADA_COMBOS = window.ALL_WIFI_COMBOS.omada.combos;
  window.RUIJIE_COMBOS = window.ALL_WIFI_COMBOS.ruijie.combos;
  window.HUAWEI_COMBOS = window.ALL_WIFI_COMBOS.huawei.combos;

  let currentActiveWifiBrand = 'omada';
  let currentActiveWifiCombo = 'home';

  function renderWifiBrandTabs(brandKey) {
    const tabsNav = document.getElementById('omadaTabsNav');
    if (!tabsNav) return;

    const brandData = window.ALL_WIFI_COMBOS[brandKey] || window.ALL_WIFI_COMBOS.omada;
    const combos = brandData.combos;

    let html = '';
    Object.keys(combos).forEach(k => {
      const c = combos[k];
      const isActive = (k === currentActiveWifiCombo);
      html += `
        <button class="omada-tab-btn ${isActive ? 'active' : ''}" data-combo="${k}" type="button">
          <span class="tab-icon">${c.icon}</span>
          <div class="tab-text">
            <strong>${c.tabLabel || c.title}</strong>
            <small>${c.tabSub || c.subtitle}</small>
          </div>
        </button>
      `;
    });
    tabsNav.innerHTML = html;
  }

  function renderWifiCombo(brandKey, comboKey) {
    const container = document.getElementById('omadaComboDisplay');
    if (!container) return;

    const brandData = window.ALL_WIFI_COMBOS[brandKey] || window.ALL_WIFI_COMBOS.omada;
    const combo = brandData.combos[comboKey] || brandData.combos.home;
    currentActiveWifiBrand = brandKey;
    currentActiveWifiCombo = comboKey;

    // Update section titles & header
    const badgeTextEl = document.getElementById('wifiBadgeText');
    if (badgeTextEl) badgeTextEl.textContent = brandData.brandBadge;

    const titleEl = document.getElementById('wifiSectionTitle');
    if (titleEl) titleEl.textContent = brandData.sectionTitle;

    const subEl = document.getElementById('wifiSectionSub');
    if (subEl) subEl.innerHTML = brandData.sectionSub;

    // Update section dataset for brand styling
    const sectionEl = document.getElementById('omadaCombos');
    if (sectionEl) sectionEl.setAttribute('data-brand', brandKey);

    let statsHtml = '';
    combo.stats.forEach(st => {
      statsHtml += `
        <div class="combo-stat-pill">
          <small>${st.label}</small>
          <strong>${st.val}</strong>
        </div>
      `;
    });

    let defaultLogo = 'images/logo_omada.svg';
    if (brandKey === 'ruijie') defaultLogo = 'images/logo_ruijie.svg';
    if (brandKey === 'huawei') defaultLogo = 'images/logo_huawei.svg';

    let itemsHtml = '';
    combo.items.forEach((item) => {
      const lineTotal = item.price * (item.qty || 0);
      const isMuted = (item.qty === 0);
      itemsHtml += `
        <div class="combo-hw-card ${isMuted ? 'item-muted' : ''}" data-prod-id="${item.id}">
          <div class="combo-hw-img-wrap" onclick="window.viewComboProductDetail(${item.id}, '${item.sku}')" title="Xem chi tiết ${item.name}">
            <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.src='${defaultLogo}'" />
            <span class="combo-hw-qty-badge">x${item.qty}</span>
          </div>
          <div class="combo-hw-info">
            <div class="combo-hw-top">
              <span class="combo-hw-sku" onclick="window.viewComboProductDetail(${item.id}, '${item.sku}')" title="Xem chi tiết ${item.sku}">${item.sku}</span>
              <span class="combo-hw-role">${item.role}</span>
            </div>
            <div class="combo-hw-name" title="${item.name}" onclick="window.viewComboProductDetail(${item.id}, '${item.sku}')">${item.name}</div>
            <div class="combo-hw-pricing">
              <span class="combo-hw-unit">${formatVND(item.price)} / bộ</span>
              ${item.qty > 0 ? `<span class="combo-hw-subtotal">Tổng: <strong>${formatVND(lineTotal)}</strong></span>` : '<span class="combo-hw-subtotal muted-text">(Chưa chọn)</span>'}
            </div>
          </div>
          <div class="combo-hw-actions">
            <div class="combo-qty-stepper" title="Tùy chỉnh số lượng thiết bị">
              <button type="button" class="btn-qty-step btn-qty-minus" onclick="event.stopPropagation(); window.stepWifiComboQty('${brandKey}', '${combo.id}', ${item.id}, -1)" ${item.qty <= 0 ? 'disabled' : ''} aria-label="Giảm số lượng">−</button>
              <span class="combo-qty-value">${item.qty}</span>
              <button type="button" class="btn-qty-step btn-qty-plus" onclick="event.stopPropagation(); window.stepWifiComboQty('${brandKey}', '${combo.id}', ${item.id}, 1)" ${item.qty >= 99 ? 'disabled' : ''} aria-label="Tăng số lượng">+</button>
            </div>
            <button type="button" class="btn-hw-detail" onclick="event.stopPropagation(); window.viewComboProductDetail(${item.id}, '${item.sku}')" title="Xem chi tiết thông số kỹ thuật ${item.sku}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Chi tiết</span>
            </button>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="omada-combo-card" data-brand="${brandKey}" data-combo="${combo.id}">
        <!-- Left / Main Column: Overview & Equipment List -->
        <div class="combo-main-col">
          <div class="combo-header-box">
            <span class="combo-card-badge">${combo.badge}</span>
            <h3 class="combo-card-title">${combo.title}</h3>
            <p class="combo-card-subtitle">${combo.subtitle}</p>
          </div>

          <!-- Fast Metrics Strip -->
          <div class="combo-stats-strip">
            ${statsHtml}
          </div>

          <!-- Included Hardware Grid -->
          <div class="combo-hw-section">
            <div class="combo-hw-header">
              <span>DANH SÁCH THIẾT BỊ TRỌN BỘ (${combo.items.reduce((s, i) => s + i.qty, 0)} THIẾT BỊ)</span>
              <span class="combo-hw-co-cq">✓ 100% Phân Phối Chính Hãng CO/CQ</span>
            </div>
            <div class="combo-hw-grid">
              ${itemsHtml}
            </div>
          </div>
        </div>

        <!-- Right Column: Price & High-Converting Actions -->
        <div class="combo-side-col">
          <div class="combo-pricing-card">
            <div class="combo-price-head">
              <span class="price-head-label">DỰ TOÁN TRỌN GÓI ƯU ĐÃI</span>
              <span class="price-save-badge">🔥 ${combo.savingsText}</span>
            </div>

            <div class="combo-price-body">
              <div class="combo-retail-price">
                <span class="label">Tổng giá bán lẻ linh kiện:</span>
                <span class="val strike">${formatVND(combo.retailTotal)}</span>
              </div>
              <div class="combo-final-price">
                <span class="label">Giá Combo Trọn Gói Chu Gia:</span>
                <div class="price-val-wrap">
                  <span class="val-num">${formatVND(combo.comboPrice)}</span>
                  <span class="val-note">Đã gồm cấu hình đám mây Cloud &amp; Tối ưu mạng</span>
                </div>
              </div>
            </div>

            <!-- Value Props List -->
            <ul class="combo-guarantees-list">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Bảo hành chính hãng <strong>24 tháng (1 đổi 1)</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Khảo sát đo kiểm bản đồ sóng Wi-Fi tận nơi <strong>0đ</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Bàn giao sơ đồ nguyên lý &amp; tài khoản Cloud quản trị trọn đời</span>
              </li>
            </ul>

            <!-- Actions -->
            <div class="combo-actions-wrap">
              <button type="button" class="btn-combo-cart" onclick="window.addComboToCart('${brandKey}', '${combo.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span>Thêm Toàn Bộ Vào Giỏ Báo Giá</span>
              </button>

              <button type="button" class="btn-combo-zalo" onclick="window.bookComboZalo('${brandKey}', '${combo.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>Tư Vấn &amp; Nhận Báo Giá Zalo</span>
              </button>

              <button type="button" class="btn-combo-explore" onclick="window.filterWifiBrandCatalog('${brandKey}')">
                <span>${brandData.exploreText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function switchWifiBrand(brandKey) {
    if (!window.ALL_WIFI_COMBOS[brandKey]) brandKey = 'omada';
    currentActiveWifiBrand = brandKey;
    currentActiveWifiCombo = 'home';

    // Update brand selector buttons
    const brandNav = document.getElementById('wifiBrandNav');
    if (brandNav) {
      brandNav.querySelectorAll('.wifi-brand-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-brand') === brandKey);
      });
    }

    renderWifiBrandTabs(brandKey);
    renderWifiCombo(brandKey, currentActiveWifiCombo);
  }

  function switchWifiCombo(comboKey) {
    currentActiveWifiCombo = comboKey;
    const tabsNav = document.getElementById('omadaTabsNav');
    if (tabsNav) {
      tabsNav.querySelectorAll('.omada-tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-combo') === comboKey);
      });
    }
    renderWifiCombo(currentActiveWifiBrand, comboKey);
  }

  function initWifiCombos() {
    // Brand Switcher click events
    const brandNav = document.getElementById('wifiBrandNav');
    if (brandNav) {
      brandNav.addEventListener('click', e => {
        const btn = e.target.closest('.wifi-brand-btn');
        if (!btn) return;
        const brandKey = btn.getAttribute('data-brand');
        if (brandKey) switchWifiBrand(brandKey);
      });
    }

    // Segment Tabs click events (delegated on container)
    const tabsNav = document.getElementById('omadaTabsNav');
    if (tabsNav) {
      tabsNav.addEventListener('click', e => {
        const btn = e.target.closest('.omada-tab-btn');
        if (!btn) return;
        const comboKey = btn.getAttribute('data-combo');
        if (comboKey) switchWifiCombo(comboKey);
      });
    }

    renderWifiBrandTabs('omada');
    renderWifiCombo('omada', 'home');
  }

  function stepWifiComboQty(brandKey, comboKey, itemId, delta) {
    const brandData = window.ALL_WIFI_COMBOS[brandKey];
    if (!brandData) return;
    const combo = brandData.combos[comboKey];
    if (!combo) return;
    const item = combo.items.find(it => it.id === itemId);
    if (!item) return;

    if (combo.baseDiscountRatio === undefined) {
      combo.baseRetailTotal = combo.retailTotal;
      combo.baseComboPrice = combo.comboPrice;
      combo.baseDiscountRatio = (combo.comboPrice / combo.retailTotal);
    }

    const nextQty = Math.max(0, Math.min(item.qty + delta, 99));
    if (nextQty === item.qty) return;
    item.qty = nextQty;

    const newRetail = combo.items.reduce((s, it) => s + it.price * it.qty, 0);
    let newCombo = 0;
    if (newRetail > 0) {
      newCombo = Math.round((newRetail * combo.baseDiscountRatio) / 10000) * 10000;
    }
    const newSavings = Math.max(0, newRetail - newCombo);

    combo.retailTotal = newRetail;
    combo.comboPrice = newCombo;
    combo.savingsAmount = newSavings;
    combo.savingsText = newSavings > 0 
      ? `Tiết kiệm ${formatVND(newSavings)} (Đã áp dụng chiết khấu combo)`
      : 'Giá theo số lượng cấu hình';

    renderWifiCombo(brandKey, comboKey);
  }

  // Global Helpers for Wi-Fi Combos
  window.switchWifiBrand = brandKey => switchWifiBrand(brandKey);
  window.switchWifiCombo = comboKey => switchWifiCombo(comboKey);
  window.switchOmadaCombo = comboKey => switchWifiCombo(comboKey);
  window.stepWifiComboQty = (brandKey, comboKey, itemId, delta) => stepWifiComboQty(brandKey, comboKey, itemId, delta);

  window.viewComboProductDetail = function(itemId, itemSku) {
    let prod = null;
    if (state.products && state.products.length > 0) {
      prod = state.products.find(p => p.id === itemId || (p.sku && itemSku && p.sku.toLowerCase() === itemSku.toLowerCase()) || (p.sku && itemSku && p.sku.toLowerCase().includes(itemSku.toLowerCase())));
    }
    if (!prod) {
      // Look up in ALL_WIFI_COMBOS across all brands
      for (const bKey in window.ALL_WIFI_COMBOS) {
        const brandObj = window.ALL_WIFI_COMBOS[bKey];
        for (const cKey in brandObj.combos) {
          const matchItem = brandObj.combos[cKey].items.find(it => it.id === itemId || it.sku === itemSku);
          if (matchItem) {
            prod = {
              id: matchItem.id,
              name: matchItem.name,
              sku: matchItem.sku,
              brand: brandObj.brandName,
              categoryName: 'Thiết Bị Mạng & Wi-Fi',
              warranty: '24 Tháng (1 đổi 1 chính hãng)',
              retailPrice: matchItem.price,
              image: matchItem.img,
              images: [matchItem.img],
              description: `<p><strong>${matchItem.name} (${matchItem.sku})</strong></p><p>Thiết bị chính hãng phân phối bởi Chu Gia Security, vai trò trong giải pháp: <em>${matchItem.role}</em>.</p><p>Cam kết 100% hàng chính hãng đầy đủ giấy tờ CO/CQ, bảo hành 24 tháng 1 đổi 1, hỗ trợ cài đặt cấu hình Cloud 24/7.</p>`
            };
            break;
          }
        }
        if (prod) break;
      }
    }
    if (!prod && window.ALL_INTERCOM_COMBOS) {
      for (const bKey in window.ALL_INTERCOM_COMBOS) {
        const brandObj = window.ALL_INTERCOM_COMBOS[bKey];
        for (const cKey in brandObj.combos) {
          const matchItem = brandObj.combos[cKey].items.find(it => it.id === itemId || it.sku === itemSku);
          if (matchItem) {
            prod = {
              id: matchItem.id,
              name: matchItem.name,
              sku: matchItem.sku,
              brand: brandObj.brandName,
              categoryName: 'Chuông Cửa Có Hình & Khóa Thông Minh',
              warranty: '24 Tháng (1 đổi 1 chính hãng)',
              retailPrice: matchItem.price,
              image: matchItem.img,
              images: [matchItem.img],
              description: `<p><strong>${matchItem.name} (${matchItem.sku})</strong></p><p>Thiết bị chính hãng phân phối bởi Chu Gia Security, vai trò trong giải pháp: <em>${matchItem.role}</em>.</p><p>Cam kết 100% hàng chính hãng đầy đủ giấy tờ CO/CQ, bảo hành 24 tháng 1 đổi 1, hỗ trợ khảo sát lắp đặt chuyển giao tận nơi.</p>`
            };
            break;
          }
        }
        if (prod) break;
      }
    }
    if (prod) {
      openQuickView(prod);
    }
  };

  window.addComboToCart = function(brandOrCombo, maybeCombo) {
    let brandKey = currentActiveWifiBrand;
    let comboKey = brandOrCombo;
    if (maybeCombo) {
      brandKey = brandOrCombo;
      comboKey = maybeCombo;
    }

    const brandData = window.ALL_WIFI_COMBOS[brandKey];
    if (!brandData) return;
    const combo = brandData.combos[comboKey];
    if (!combo) return;

    const activeItems = combo.items.filter(item => item.qty > 0);
    if (activeItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thiết bị để thêm vào giỏ báo giá!');
      return;
    }

    activeItems.forEach(item => {
      const prod = state.products.find(p => p.id === item.id || p.sku === item.sku) || {
        id: item.id,
        name: item.name,
        sku: item.sku,
        brand: brandData.brandName,
        retailPrice: item.price,
        image: item.img
      };

      const existing = state.cart.find(c => c.id === prod.id);
      if (existing) {
        existing.qty = Math.min(existing.qty + item.qty, 99);
      } else {
        state.cart.push({
          id: prod.id,
          name: prod.name,
          sku: prod.sku || item.sku,
          brand: prod.brand || brandData.brandName,
          retailPrice: prod.retailPrice || item.price,
          image: prod.image || item.img,
          qty: item.qty
        });
      }
    });

    saveCartToStorage();
    updateCartUI();
    renderCartDrawer();
    openCartDrawer();

    // Visual toast feedback on button
    const btn = document.querySelector(`.omada-combo-card[data-combo="${comboKey}"] .btn-combo-cart`);
    if (btn) {
      const origText = btn.innerHTML;
      btn.classList.add('added');
      btn.innerHTML = `<span>✓ Đã Thêm Toàn Bộ ${activeItems.reduce((s, i) => s + i.qty, 0)} Thiết Bị!</span>`;
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = origText;
      }, 2000);
    }
  };

  window.bookComboZalo = function(brandOrCombo, maybeCombo) {
    let brandKey = currentActiveWifiBrand;
    let comboKey = brandOrCombo;
    if (maybeCombo) {
      brandKey = brandOrCombo;
      comboKey = maybeCombo;
    }

    const brandData = window.ALL_WIFI_COMBOS[brandKey];
    if (!brandData) return;
    const combo = brandData.combos[comboKey];
    if (!combo) return;

    const activeItems = combo.items.filter(item => item.qty > 0);
    if (activeItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thiết bị để nhận tư vấn Zalo!');
      return;
    }

    let msg = `Xin chào Chu Gia Security! Tôi quan tâm đến giải pháp mạng:\n`;
    msg += `⭐ ${brandData.brandName.toUpperCase()} — ${combo.title.toUpperCase()}\n`;
    msg += `• Giá combo ưu đãi trọn gói: ${formatVND(combo.comboPrice)}\n`;
    msg += `• Quy mô đề xuất: ${combo.stats.map(s => s.label + ': ' + s.val).join(' | ')}\n\n`;
    msg += `Danh sách thiết bị cấu hình:\n`;
    activeItems.forEach((item, idx) => {
      msg += `${idx + 1}. [${item.sku}] ${item.name} — SL: ${item.qty} (${item.role})\n`;
    });
    msg += `\nNhờ Chu Gia tư vấn chi tiết, khảo sát thực địa và hỗ trợ lên phương án lắp đặt trọn gói giúp tôi. Cảm ơn!`;

    window.open(`https://zalo.me/0941204125?text=${encodeURIComponent(msg)}`, '_blank');
  };

  window.filterWifiBrandCatalog = function(brandKey) {
    if (brandKey === 'omada') {
      setCategory(53999);
    } else if (brandKey === 'ruijie') {
      setBrand('RUIJIE');
    } else if (brandKey === 'huawei') {
      setBrand('HUAWEI');
    }
    const catalogEl = document.getElementById('catalogMain');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.filterOmadaCatalog = function() {
    window.filterWifiBrandCatalog('omada');
  };

  function setBrand(brandName) {
    state.selectedBrand = brandName;
    state.selectedCategoryId = -1;
    state.currentPage = 1;
    if (el.brandFilters) {
      el.brandFilters.querySelectorAll('.brand-chip').forEach(c => {
        c.classList.toggle('active', (c.dataset.brand || '').toUpperCase() === brandName.toUpperCase());
      });
    }
    if (el.quickPills) {
      el.quickPills.querySelectorAll('.quick-pill').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.catId === '-1');
      });
    }
    applyFilters();
  }

  // Alias for backward compatibility
  function initOmadaCombos() {
    initWifiCombos();
  }


  // ===================== SPECIALIZED MULTI-BRAND INTERCOM & SMART LOCK COMBOS SYSTEM =====================
  // Quy tắc cốt lõi: Nút ấn chuông hình hãng nào 100% đi liền với màn hình hãng đấy (Hikvision - Dahua - EZVIZ)
  window.ALL_INTERCOM_COMBOS = {
  "hikvision": {
    "brandName": "Hikvision",
    "brandBadge": "HỆ THỐNG CHUÔNG HÌNH IP & AN NINH RA VÀO • HIKVISION",
    "sectionTitle": "Combo Chuông Cửa Có Hình & Khóa Thông Minh Hikvision",
    "sectionSub": "Nút nhấn camera chuông hình Hikvision kết nối 100% đồng bộ chuẩn giao thức ISAPI/PoE với màn hình IP Hikvision và khóa cửa thông minh cao cấp.",
    "exploreText": "Xem Tất Cả 75+ Thiết Bị Hikvision Trong Kho ↓",
    "combos": {
      "apartment": {
        "id": "apartment",
        "badge": "GIẢI PHÁP TIÊU BIỂU • CĂN HỘ CHUNG CƯ",
        "title": "Combo Chuông Hình IP Hikvision & Khóa Vân Tay Căn Hộ",
        "subtitle": "Nút chuông PoE/Wifi ngoài cửa chống nước, màn hình 7 inch cảm ứng đàm thoại và khóa cửa vân tay YLOCK chống trộm đa điểm.",
        "tabLabel": "Căn Hộ & Chung Cư",
        "tabSub": "Chuông 2MP + Màn 7\" + YLock",
        "icon": "🏢",
        "stats": [
          {
            "label": "Phân khúc",
            "val": "Chung cư cao cấp"
          },
          {
            "label": "Chuông hình",
            "val": "Hikvision 2MP PoE/Wifi"
          },
          {
            "label": "Màn hình",
            "val": "Hikvision 7\" IPS Touch"
          },
          {
            "label": "Khóa cửa",
            "val": "YLOCK 4 chế độ"
          }
        ],
        "items": [
          {
            "id": 1168271,
            "sku": "DS-KV6113-WPE1",
            "name": "Nút nhấn Camera chuông hình Hikvision DS-KV6113-WPE1 (PoE, Wifi)",
            "qty": 1,
            "role": "Nút nhấn Camera Hikvision 2MP ngoài cửa, PoE/Wifi góc rộng",
            "price": 4220000,
            "img": "images/products/1168271.jpg"
          },
          {
            "id": 1168260,
            "sku": "DS-KH6320-WTDE1",
            "name": "Màn hình chuông hình Hikvision DS-KH6320-WTDE1 (7 inch, PoE, Wifi)",
            "qty": 1,
            "role": "Màn hình chuông hình Hikvision 7 inch cảm ứng, đàm thoại 2 chiều",
            "price": 4540000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ds-kh6320-wte1-6813f0de-19f3-4c27-a2ac-0e8b71f16373-1777900023215.jpg"
          },
          {
            "id": 1168270,
            "sku": "DS-KABV6113-RS",
            "name": "Vỏ che camera chuông hình Hikvision DS-KABV6113-RS",
            "qty": 1,
            "role": "Vỏ che kim loại chống mưa nắng cho camera chuông hình Hikvision",
            "price": 270000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/1-1777901088907.jpg"
          },
          {
            "id": 1181939,
            "sku": "YL-8882-B",
            "name": "Khóa cửa điện tử YLOCK YL-8882-B (Vân tay, Thẻ từ, Mật mã, Khóa cơ)",
            "qty": 1,
            "role": "Khóa cửa điện tử vân tay, mật mã, thẻ từ, chìa cơ YLOCK YL-8882-B",
            "price": 4760000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/8882-1777900287823.png"
          }
        ],
        "comboPrice": 12740000,
        "savingsText": "Tiết kiệm 1.050.000 ₫ (Miễn phí cài đặt Cloud Hik-Connect)",
        "retailTotal": 13790000,
        "savingsAmount": 1050000
      },
      "villa": {
        "id": "villa",
        "badge": "GIẢI PHÁP CAO CẤP • BIỆT THỰ & LIỀN KỀ",
        "title": "Combo Chuông Hình Hợp Kim IK08 & Màn 10\" Biệt Thự",
        "subtitle": "Nút chuông vỏ kim loại chuẩn chống va đập IK08, màn hình 10 inch siêu lớn và khóa điện tử Solity GM-1000BK nhập khẩu Hàn Quốc.",
        "tabLabel": "Biệt Thự & Villa",
        "tabSub": "Chuông IK08 + Màn 10\" + Solity",
        "icon": "🏛️",
        "stats": [
          {
            "label": "Phân khúc",
            "val": "Biệt thự & Villa sân vườn"
          },
          {
            "label": "Nút chuông",
            "val": "Kim loại chuẩn IK08/IP65"
          },
          {
            "label": "Màn hình",
            "val": "Hikvision 10\" IPS Cực Đại"
          },
          {
            "label": "Khóa cửa",
            "val": "Solity Hàn Quốc GM-1000BK"
          }
        ],
        "items": [
          {
            "id": 1168267,
            "sku": "DS-KV8113-WME1",
            "name": "Nút nhấn Camera chuông hình Hikvision DS-KV8113-WME1 (PoE, Wifi)",
            "qty": 1,
            "role": "Nút nhấn Camera Hikvision hợp kim IK08 ngoài cổng biệt thự",
            "price": 5840000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ds-kv8113-wme1-3da689b3-e5a8-45ab-84bf-fd887ac67a77-1777901083737.jpg"
          },
          {
            "id": 1168258,
            "sku": "DS-KH8520-WTE1",
            "name": "Màn hình chuông hình Hikvision DS-KH8520-WTE1 (10 inch, PoE, Wifi)",
            "qty": 1,
            "role": "Màn hình chuông hình Hikvision 10 inch cảm ứng sang trọng sảnh chính",
            "price": 6480000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ds-kh8520-wte1-1777901098139.jpg"
          },
          {
            "id": 1168266,
            "sku": "DS-KABV8113-RS/Surface",
            "name": "Vỏ che camera chuông hình Hikvision DS-KABV8113-RS/Surface (lắp nổi)",
            "qty": 1,
            "role": "Vỏ che kim loại chống nước lắp nổi cho nút chuông Hikvision",
            "price": 480000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ds-kabv8113-rs-1777901082797.jpg"
          },
          {
            "id": 1181945,
            "sku": "GM-1000BK",
            "name": "Khóa cửa điện tử SOLITY GM-1000BK",
            "qty": 1,
            "role": "Khóa cửa điện tử SOLITY GM-1000BK chuẩn công nghệ Hàn Quốc",
            "price": 9080000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/gm-1000bk-1777900066203.png"
          }
        ],
        "comboPrice": 20240000,
        "savingsText": "Tiết kiệm 1.640.000 ₫ (Miễn phí đo kiểm kết nối liên tầng)",
        "retailTotal": 21880000,
        "savingsAmount": 1640000
      },
      "faceid": {
        "id": "faceid",
        "badge": "GIẢI PHÁP ĐỈNH CAO • 3D FACE ID FLAGSHIP",
        "title": "Combo Chuông Hình FaceID 4.3\" & Khóa Solity 3D Khuôn Mặt",
        "subtitle": "Nút chuông nhận diện khuôn mặt tự động mở cổng kết hợp 2 màn hình 10 inch tầng 1-2 và khóa Solity GP-6000BAK mở cửa không chạm.",
        "tabLabel": "Siêu Dinh Thự 3D Face ID",
        "tabSub": "FaceID 4.3\" + 2 Màn 10\" + Solity",
        "icon": "👑",
        "stats": [
          {
            "label": "Công nghệ",
            "val": "3D FaceID Không Chạm"
          },
          {
            "label": "Nút cổng",
            "val": "Hikvision FaceID 4.3\""
          },
          {
            "label": "Màn hình",
            "val": "2x Hikvision 10\" Đa Tầng"
          },
          {
            "label": "Khóa cửa",
            "val": "Solity GP-6000BAK Flagship"
          }
        ],
        "items": [
          {
            "id": 1168265,
            "sku": "DS-KV9503-WBE1",
            "name": "Nút nhấn Camera chuông hình Hikvision DS-KV9503-WBE1 (Nhận diện khuôn mặt, màn 4.3 inch, PoE, Wifi)",
            "qty": 1,
            "role": "Nút nhấn nhận diện khuôn mặt FaceID, màn hình 4.3 inch cảm ứng Hikvision",
            "price": 8210000,
            "img": "images/products/1168265.jpg"
          },
          {
            "id": 1168258,
            "sku": "DS-KH8520-WTE1",
            "name": "Màn hình chuông hình Hikvision DS-KH8520-WTE1 (10 inch, PoE, Wifi)",
            "qty": 2,
            "role": "2 Màn hình chuông hình Hikvision 10 inch (Tầng 1 phòng khách & Tầng 2 phòng ngủ)",
            "price": 6480000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ds-kh8520-wte1-1777901098139.jpg"
          },
          {
            "id": 1181943,
            "sku": "GP-6000BAK",
            "name": "Khóa cửa điện tử SOLITY GP-6000BAK (khuôn mặt, vân tay, mã số, thẻ từ, chìa cơ, smartphone)",
            "qty": 1,
            "role": "Khóa cửa điện tử SOLITY GP-6000BAK Flagship mở khóa khuôn mặt 3D",
            "price": 21600000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/gp-6000bak-1777900366357.png"
          }
        ],
        "comboPrice": 39600000,
        "savingsText": "Tiết kiệm 3.170.000 ₫ (Tặng gói cài đặt bảo mật đa lớp)",
        "retailTotal": 42770000,
        "savingsAmount": 3170000
      },
      "office": {
        "id": "office",
        "badge": "GIẢI PHÁP CỬA KÍNH • VĂN PHÒNG & SHOWROOM",
        "title": "Combo Chuông Hình Hikvision & Khóa Kẹp Kính ZKTeco",
        "subtitle": "Giải pháp kiểm soát ra vào chuyên biệt cho cửa kính thủy lực văn phòng, đàm thoại từ bàn lễ tân và mở khóa từ xa qua màn hình.",
        "tabLabel": "Văn Phòng Cửa Kính",
        "tabSub": "Chuông IK08 + Khóa Kẹp Kính",
        "icon": "🏢",
        "stats": [
          {
            "label": "Loại cửa",
            "val": "Cửa kính thủy lực/bản lề sàn"
          },
          {
            "label": "Nút chuông",
            "val": "Hikvision IK08 chống nước"
          },
          {
            "label": "Màn lễ tân",
            "val": "Hikvision 7\" cảm ứng"
          },
          {
            "label": "Khóa điện tử",
            "val": "ZKTeco chuyên cửa kính"
          }
        ],
        "items": [
          {
            "id": 1168267,
            "sku": "DS-KV8113-WME1",
            "name": "Nút nhấn Camera chuông hình Hikvision DS-KV8113-WME1 (PoE, Wifi)",
            "qty": 1,
            "role": "Nút nhấn Camera Hikvision chuông hình ngoài cửa văn phòng",
            "price": 5840000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ds-kv8113-wme1-3da689b3-e5a8-45ab-84bf-fd887ac67a77-1777901083737.jpg"
          },
          {
            "id": 1168260,
            "sku": "DS-KH6320-WTDE1",
            "name": "Màn hình chuông hình Hikvision DS-KH6320-WTDE1 (7 inch, PoE, Wifi)",
            "qty": 1,
            "role": "Màn hình chuông hình Hikvision 7 inch đặt tại quầy lễ tân đàm thoại",
            "price": 4540000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ds-kh6320-wte1-6813f0de-19f3-4c27-a2ac-0e8b71f16373-1777900023215.jpg"
          },
          {
            "id": 1181934,
            "sku": "ZKT-GL300",
            "name": "Khóa cửa điện tử ZKTeco cửa kính ZKT-GL300 (Vân tay, Thẻ từ, Mật mã, Remote)",
            "qty": 1,
            "role": "Khóa cửa điện tử ZKTeco ZKT-GL300 kẹp kính không cần khoan kính",
            "price": 5840000,
            "img": "images/products/1181934.jpg"
          }
        ],
        "comboPrice": 15000000,
        "savingsText": "Tiết kiệm 1.220.000 ₫ (Miễn phí khảo sát lắp ráp cửa kính)",
        "retailTotal": 16220000,
        "savingsAmount": 1220000
      }
    }
  },
  "dahua": {
    "brandName": "Dahua",
    "brandBadge": "HỆ THỐNG CHUÔNG HÌNH IP GÓC RỘNG & KHÓA DAHUA • DAHUA TECHNOLOGY",
    "sectionTitle": "Combo Chuông Cửa Có Hình & Khóa Điện Tử Dahua",
    "sectionSub": "Nút nhấn camera chuông hình Dahua đồng bộ 100% chuẩn giao thức VTO/VTH với màn hình IP Dahua và khóa thông minh Dahua nguyên bản.",
    "exploreText": "Xem Tất Cả 110+ Thiết Bị Dahua Trong Kho ↓",
    "combos": {
      "apartment": {
        "id": "apartment",
        "badge": "GIẢI PHÁP TIÊU BIỂU • CĂN HỘ HIỆN ĐẠI",
        "title": "Combo Chuông Hình Dahua VTO2211G & Khóa Dahua Đồng",
        "subtitle": "Nút chuông PoE/Wifi nhỏ gọn, màn hình 7 inch trắng tinh tế và khóa điện tử màu đồng hoàng gia Dahua ASL9112R-B.",
        "tabLabel": "Căn Hộ Chung Cư",
        "tabSub": "VTO2211G + Màn 7\" + Dahua",
        "icon": "🏠",
        "stats": [
          {
            "label": "Phân khúc",
            "val": "Chung cư & Nhà phố"
          },
          {
            "label": "Nút chuông",
            "val": "Dahua VTO2211G PoE/Wifi"
          },
          {
            "label": "Màn hình",
            "val": "Dahua VTH2621 7\" IPS"
          },
          {
            "label": "Khóa cửa",
            "val": "Dahua ASL9112R-B Đồng"
          }
        ],
        "items": [
          {
            "id": 1168278,
            "sku": "DHI-VTO2211G-WP",
            "name": "Nút nhấn Camera chuông hình Dahua DHI-VTO2211G-WP (PoE, Wifi)",
            "qty": 1,
            "role": "Nút nhấn Camera Dahua DHI-VTO2211G-WP ngoài cửa, PoE/Wifi",
            "price": 4540000,
            "img": "images/products/1168278.jpg"
          },
          {
            "id": 1168274,
            "sku": "DHI-VTH2621GW-WP",
            "name": "Màn hình chuông hình Dahua DHI-VTH2621GW-WP (7 inch, PoE, Wifi, trắng)",
            "qty": 1,
            "role": "Màn hình chuông hình Dahua 7 inch DHI-VTH2621GW-WP trắng tinh tế",
            "price": 4320000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/vth2621gw-wp-trang-1777901472022.jpg"
          },
          {
            "id": 1168277,
            "sku": "VTM09R",
            "name": "Chân đế Camera chuông hình Dahua VTM09R (dùng cho VTO2211)",
            "qty": 1,
            "role": "Chân đế gắn nổi chuyên dụng Dahua VTM09R cho VTO2211",
            "price": 330000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/vtm09r-1777901440523.png"
          },
          {
            "id": 1181950,
            "sku": "ASL9112R-B",
            "name": "Khóa cửa điện tử Dahua ASL9112R-B màu đồng",
            "qty": 1,
            "role": "Khóa cửa thông minh Dahua ASL9112R-B vân tay thẻ từ màu đồng hoàng gia",
            "price": 7780000,
            "img": "images/products/1181950.jpg"
          }
        ],
        "comboPrice": 15700000,
        "savingsText": "Tiết kiệm 1.270.000 ₫ (Miễn phí kết nối liên động mở khóa)",
        "retailTotal": 16970000,
        "savingsAmount": 1270000
      },
      "villa": {
        "id": "villa",
        "badge": "GIẢI PHÁP CAO CẤP • GÓC SIÊU RỘNG 140°",
        "title": "Combo Chuông Hình 140° VTO2201 & Màn 10\" VTH5441",
        "subtitle": "Nút chuông góc siêu rộng 140 độ quan sát toàn cảnh cổng, màn hình cảm ứng 10 inch cực đại và khóa Dahua màu diệp lục sang trọng.",
        "tabLabel": "Biệt Thự & Nhà Phố",
        "tabSub": "Góc Rộng 140° + Màn 10\" + Dahua",
        "icon": "🏛️",
        "stats": [
          {
            "label": "Góc nhìn",
            "val": "Siêu rộng 140 độ toàn cảnh"
          },
          {
            "label": "Nút chuông",
            "val": "Dahua VTO2201F-P-S2 PoE"
          },
          {
            "label": "Màn hình",
            "val": "Dahua 10\" VTH5441G"
          },
          {
            "label": "Khóa cửa",
            "val": "Dahua ASL9112C-B Diệp Lục"
          }
        ],
        "items": [
          {
            "id": 1168276,
            "sku": "DHI-VTO2201F-P-S2",
            "name": "Nút nhấn Camera chuông hình Dahua DHI-VTO2201F-P-S2 (PoE, góc rộng 140 độ)",
            "qty": 1,
            "role": "Nút chuông Dahua DHI-VTO2201F-P-S2 góc siêu rộng 140°, chống nước IP65",
            "price": 6050000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/dhi-vto2201f-p-1777901457241.jpg"
          },
          {
            "id": 1168273,
            "sku": "DHI-VTH5441G",
            "name": "Màn hình chuông hình Dahua DHI-VTH5441G (10 inch, PoE)",
            "qty": 1,
            "role": "Màn hình chuông hình Dahua 10 inch DHI-VTH5441G hiển thị sắc nét",
            "price": 8640000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/dhi-vth5441g-1777901468557.png"
          },
          {
            "id": 1168275,
            "sku": "VTM114",
            "name": "Chân đế Camera chuông hình Dahua VTM114 (lắp âm)",
            "qty": 1,
            "role": "Hộp đế âm tường kim loại Dahua VTM114 cho VTO2201",
            "price": 700000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/vtm114-1777901443071.jpg"
          },
          {
            "id": 1181951,
            "sku": "ASL9112C-B",
            "name": "Khóa cửa điện tử Dahua ASL9112C-B màu diệp lục",
            "qty": 1,
            "role": "Khóa cửa thông minh Dahua ASL9112C-B màu diệp lục độc đáo",
            "price": 7780000,
            "img": "images/products/1181951.jpg"
          }
        ],
        "comboPrice": 21440000,
        "savingsText": "Tiết kiệm 1.730.000 ₫ (Đã gồm hộp đế âm tường cao cấp)",
        "retailTotal": 23170000,
        "savingsAmount": 1730000
      },
      "multidoor": {
        "id": "multidoor",
        "badge": "GIẢI PHÁP ĐA CỔNG • 2 NÚT CHUÔNG & 2 MÀN HÌNH",
        "title": "Combo 2 Cổng Đa Tầng & Khóa Kéo Đẩy Solity Hàn Quốc",
        "subtitle": "2 nút chuông camera cho cổng chính và cửa phụ, 2 màn hình 7 inch các tầng và khóa cửa kéo đẩy Push-Pull Solity GSP-2000BK.",
        "tabLabel": "2 Cổng & Đa Tầng",
        "tabSub": "2 Nút Chuông + 2 Màn + Push-Pull",
        "icon": "🚪",
        "stats": [
          {
            "label": "Quy mô",
            "val": "Nhà 2 Cổng / 3 Tầng"
          },
          {
            "label": "Nút chuông",
            "val": "2 Nút Dahua (Cổng & Sảnh)"
          },
          {
            "label": "Màn hình",
            "val": "2 Màn Hình Dahua VTH2621"
          },
          {
            "label": "Khóa cửa",
            "val": "Solity Push-Pull GSP-2000BK"
          }
        ],
        "items": [
          {
            "id": 1168276,
            "sku": "DHI-VTO2201F-P-S2",
            "name": "Nút nhấn Camera chuông hình Dahua DHI-VTO2201F-P-S2 (PoE, góc rộng 140 độ)",
            "qty": 1,
            "role": "Nút chuông Dahua ngoài cổng chính góc rộng 140°",
            "price": 6050000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/dhi-vto2201f-p-1777901457241.jpg"
          },
          {
            "id": 1168279,
            "sku": "DHI-VTO2311R-WP",
            "name": "Nút nhấn Camera chuông hình Dahua DHI-VTO2311R-WP (PoE, Wifi)",
            "qty": 1,
            "role": "Nút chuông Dahua DHI-VTO2311R-WP lắp tại cửa phụ / sảnh tầng 1",
            "price": 3680000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/dhi-vto2311r-wp-1779201909691.jpg"
          },
          {
            "id": 1168274,
            "sku": "DHI-VTH2621GW-WP",
            "name": "Màn hình chuông hình Dahua DHI-VTH2621GW-WP (7 inch, PoE, Wifi, trắng)",
            "qty": 2,
            "role": "2 Màn hình chuông hình Dahua 7 inch (Tầng 1 phòng khách & Tầng 2 phòng sinh hoạt)",
            "price": 4320000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/vth2621gw-wp-trang-1777901472022.jpg"
          },
          {
            "id": 1181944,
            "sku": "GSP-2000BK DS",
            "name": "Khóa cửa điện tử SOLITY GSP-2000BK DS (màu đen bạc)",
            "qty": 1,
            "role": "Khóa cửa SOLITY GSP-2000BK DS tay nắm Push-Pull nguyên khối Hàn Quốc",
            "price": 16850000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/gsp-2000-1777900364917.jpg"
          }
        ],
        "comboPrice": 32600000,
        "savingsText": "Tiết kiệm 2.620.000 ₫ (Miễn phí thiết lập đàm thoại liên tầng)",
        "retailTotal": 35220000,
        "savingsAmount": 2620000
      },
      "economic": {
        "id": "economic",
        "badge": "GIẢI PHÁP TIẾT KIỆM • TỐI ƯU CHI PHÍ",
        "title": "Combo Chuông Hình Dahua VTO2111 & Khóa YLOCK",
        "subtitle": "Giải pháp chuông hình IP và khóa thông minh tiết kiệm chi phí nhưng vẫn đảm bảo sự đồng bộ và bền bỉ tuyệt đối.",
        "tabLabel": "Gói Tiết Kiệm",
        "tabSub": "VTO2111 + Màn 7\" + YLOCK",
        "icon": "💰",
        "stats": [
          {
            "label": "Chi phí",
            "val": "Tối ưu ngân sách"
          },
          {
            "label": "Nút chuông",
            "val": "Dahua VTO2111D-P-S2"
          },
          {
            "label": "Màn hình",
            "val": "Dahua VTH2621GW 7\""
          },
          {
            "label": "Khóa cửa",
            "val": "YLOCK YL-8882-B"
          }
        ],
        "items": [
          {
            "id": 1168280,
            "sku": "DHI-VTO2111D-P-S2",
            "name": "Nút nhấn Camera chuông hình Dahua DHI-VTO2111D-P-S2 (PoE)",
            "qty": 1,
            "role": "Nút nhấn Camera Dahua DHI-VTO2111D-P-S2 PoE nhỏ gọn ngoài cửa",
            "price": 3030000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/dahua-dhi-vto2111d-p-s2-1777901463797.png"
          },
          {
            "id": 1168274,
            "sku": "DHI-VTH2621GW-WP",
            "name": "Màn hình chuông hình Dahua DHI-VTH2621GW-WP (7 inch, PoE, Wifi, trắng)",
            "qty": 1,
            "role": "Màn hình chuông hình Dahua 7 inch DHI-VTH2621GW-WP",
            "price": 4320000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/vth2621gw-wp-trang-1777901472022.jpg"
          },
          {
            "id": 1181939,
            "sku": "YL-8882-B",
            "name": "Khóa cửa điện tử YLOCK YL-8882-B (Vân tay, Thẻ từ, Mật mã, Khóa cơ)",
            "qty": 1,
            "role": "Khóa cửa điện tử vân tay thẻ từ YLOCK YL-8882-B",
            "price": 4760000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/8882-1777900287823.png"
          }
        ],
        "comboPrice": 11200000,
        "savingsText": "Tiết kiệm 910.000 ₫ (Miễn phí cài đặt ứng dụng DMSS)",
        "retailTotal": 12110000,
        "savingsAmount": 910000
      }
    }
  },
  "ezviz": {
    "brandName": "EZVIZ",
    "brandBadge": "HỆ THỐNG SMART HOME CHUÔNG HÌNH & KHÓA THÔNG MINH • EZVIZ",
    "sectionTitle": "Combo Chuông Cửa Có Hình & Khóa Thông Minh EZVIZ",
    "sectionSub": "Chuông hình EZVIZ thế hệ mới kết nối màn hình cảm ứng trong nhà đồng bộ hoàn hảo cùng khóa cửa điện tử qua duy nhất 1 ứng dụng EZVIZ.",
    "exploreText": "Xem Tất Cả 60+ Thiết Bị EZVIZ Trong Kho ↓",
    "combos": {
      "apartment": {
        "id": "apartment",
        "badge": "GIẢI PHÁP KHÔNG DÂY • CĂN HỘ & NHÀ PHỐ",
        "title": "Combo Chuông Hình EZVIZ HP5 & Khóa Vân Tay DL05",
        "subtitle": "Trọn bộ chuông hình HP5 (màn 7 inch + nút camera 2MP) kết hợp khóa điện tử EZVIZ DL05 điều khiển mở khóa từ xa qua App EZVIZ.",
        "tabLabel": "Căn Hộ Không Dây",
        "tabSub": "HP5 + Khóa EZVIZ DL05",
        "icon": "📱",
        "stats": [
          {
            "label": "Hệ sinh thái",
            "val": "EZVIZ 1 App Duy Nhất"
          },
          {
            "label": "Bộ chuông",
            "val": "HP5 Trọn bộ (Màn 7\" + Camera 2MP)"
          },
          {
            "label": "Khóa cửa",
            "val": "EZVIZ DL05 Mở từ xa"
          },
          {
            "label": "Đàm thoại",
            "val": "2 chiều lọc tạp âm"
          }
        ],
        "items": [
          {
            "id": 1168282,
            "sku": "EZVIZ HP5",
            "name": "Chuông hình EZVIZ HP5 (Màn 7 inch, Wifi, Camera 2MP góc 134°)",
            "qty": 1,
            "role": "Trọn bộ chuông hình EZVIZ HP5 gồm Màn hình 7\" và Nút camera 2MP góc 134°",
            "price": 6050000,
            "img": "images/products/1168282.jpg"
          },
          {
            "id": 1181949,
            "sku": "EZVIZ DL05",
            "name": "Khóa cửa điện tử EZVIZ DL05 (APP, Vân tay, mật mã, thẻ từ, chìa cơ)",
            "qty": 1,
            "role": "Khóa cửa điện tử EZVIZ DL05 vân tay, app EZVIZ mở khóa từ xa",
            "price": 5400000,
            "img": "images/products/1181949.jpg"
          }
        ],
        "comboPrice": 10600000,
        "savingsText": "Tiết kiệm 850.000 ₫ (Miễn phí kết nối App EZVIZ)",
        "retailTotal": 11450000,
        "savingsAmount": 850000
      },
      "villa": {
        "id": "villa",
        "badge": "GIẢI PHÁP CAO CẤP • ĐỘ PHÂN GIẢI 2K 4MP",
        "title": "Combo Chuông Hình 2K EZVIZ HP7 & Khóa Vân Tay 2 Mặt DL06",
        "subtitle": "Trọn bộ chuông hình cao cấp HP7 camera 2K 4MP góc 162 độ cùng khóa cửa EZVIZ DL06 Pro vân tay 2 mặt an toàn tuyệt đối.",
        "tabLabel": "Biệt Thự 2K",
        "tabSub": "HP7 2K + Khóa DL06 Pro",
        "icon": "✨",
        "stats": [
          {
            "label": "Độ nét",
            "val": "2K 4MP Siêu Nét 162°"
          },
          {
            "label": "Bộ chuông",
            "val": "HP7 Trọn bộ (Màn 7\" + Camera 2K)"
          },
          {
            "label": "Khóa an toàn",
            "val": "DL06 Pro (Vân tay 2 mặt)"
          },
          {
            "label": "Chuông báo",
            "val": "Tích hợp đa âm sắc"
          }
        ],
        "items": [
          {
            "id": 1168281,
            "sku": "EZVIZ HP7",
            "name": "Chuông hình EZVIZ HP7 (Màn 7 inch, Wifi, Camera 4MP góc 162°)",
            "qty": 1,
            "role": "Trọn bộ chuông hình EZVIZ HP7 gồm Màn hình 7\" và Nút camera 2K 4MP góc 162°",
            "price": 6700000,
            "img": "images/products/1168281.jpg"
          },
          {
            "id": 1181946,
            "sku": "EZVIZ DL06 Pro",
            "name": "Khóa cửa điện tử EZVIZ DL06 Pro (APP, Vân tay 2 mặt, mật mã, thẻ từ, chìa cơ)",
            "qty": 1,
            "role": "Khóa cửa điện tử EZVIZ DL06 Pro vân tay 2 mặt chống thò tay mở khoá",
            "price": 7560000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ezviz-dl06-pro-3a53bfb3-306b-4bed-b497-efd8c94eea70-1777899476871.jpg"
          }
        ],
        "comboPrice": 13200000,
        "savingsText": "Tiết kiệm 1.060.000 ₫ (Miễn phí kích hoạt bảo hành điện tử)",
        "retailTotal": 14260000,
        "savingsAmount": 1060000
      },
      "faceid": {
        "id": "faceid",
        "badge": "GIẢI PHÁP FLAGSHIP • 3D FACE ID & MÀN HÌNH TÍCH HỢP",
        "title": "Combo Chuông Hình EZVIZ HP7 & Khóa Face ID DL50FVS",
        "subtitle": "Hệ thống an ninh đỉnh cao EZVIZ: Chuông hình HP7 ngoài cổng kết hợp khóa cửa Flagship DL50FVS nhận diện gương mặt 3D và tích hợp camera.",
        "tabLabel": "3D Face ID Cao Cấp",
        "tabSub": "HP7 2K + Khóa FaceID DL50",
        "icon": "👑",
        "stats": [
          {
            "label": "Nhận diện",
            "val": "3D Face ID Không Chạm"
          },
          {
            "label": "Bộ cổng",
            "val": "EZVIZ HP7 2K Màn 7\""
          },
          {
            "label": "Khóa cửa",
            "val": "DL50FVS Có Camera & Màn"
          },
          {
            "label": "Video call",
            "val": "Gọi video trực tiếp về App"
          }
        ],
        "items": [
          {
            "id": 1168281,
            "sku": "EZVIZ HP7",
            "name": "Chuông hình EZVIZ HP7 (Màn 7 inch, Wifi, Camera 4MP góc 162°)",
            "qty": 1,
            "role": "Trọn bộ chuông hình ngoài cổng EZVIZ HP7 2K sắc nét, đàm thoại 2 chiều",
            "price": 6700000,
            "img": "images/products/1168281.jpg"
          },
          {
            "id": 1181948,
            "sku": "EZVIZ DL50FVS",
            "name": "Khóa cửa điện tử EZVIZ DL50FVS (APP, Khuôn mặt, vân tay, mật mã, chìa cơ)",
            "qty": 1,
            "role": "Khóa cửa điện tử đỉnh cao EZVIZ DL50FVS nhận diện gương mặt 3D, tích hợp camera",
            "price": 13400000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/dl50fvs-1777901579969.jpg"
          }
        ],
        "comboPrice": 18600000,
        "savingsText": "Tiết kiệm 1.500.000 ₫ (Tặng gói lưu trữ Cloud 1 năm)",
        "retailTotal": 20100000,
        "savingsAmount": 1500000
      },
      "aluminum": {
        "id": "aluminum",
        "badge": "GIẢI PHÁP ĐỐ HẸP • CỬA NHÔM XINGFA",
        "title": "Combo Chuông Hình EZVIZ HP5 & Khóa Cửa Nhôm Xingfa",
        "subtitle": "Bộ chuông hình HP5 tiện lợi kết hợp khóa điện tử YLOCK YL-3368-G thiết kế thon gọn chuyên dụng cho cửa nhôm hệ Xingfa.",
        "tabLabel": "Cửa Nhôm Xingfa",
        "tabSub": "HP5 + Khóa YLOCK Nhôm",
        "icon": "🚪",
        "stats": [
          {
            "label": "Loại cửa",
            "val": "Cửa Nhôm Xingfa / Cửa Sắt"
          },
          {
            "label": "Chuông hình",
            "val": "Trọn bộ EZVIZ HP5 Wifi"
          },
          {
            "label": "Khóa cửa",
            "val": "YLOCK YL-3368-G Đố Hẹp"
          },
          {
            "label": "Mở khóa",
            "val": "Vân tay, mã số, thẻ, app"
          }
        ],
        "items": [
          {
            "id": 1168282,
            "sku": "EZVIZ HP5",
            "name": "Chuông hình EZVIZ HP5 (Màn 7 inch, Wifi, Camera 2MP góc 134°)",
            "qty": 1,
            "role": "Trọn bộ chuông hình EZVIZ HP5 (Màn 7 inch + Nút camera ngoài cổng)",
            "price": 6050000,
            "img": "images/products/1168282.jpg"
          },
          {
            "id": 1181937,
            "sku": "YL-3368-G",
            "name": "Khóa cửa điện tử YLOCK cửa nhôm cửa sắt YL-3368-G (màu vàng)",
            "qty": 1,
            "role": "Khóa cửa điện tử YLOCK YL-3368-G chuyên đố hẹp nhôm Xingfa màu vàng kim",
            "price": 4320000,
            "img": "https://sapo.dktcdn.net/100/825/511/variants/ylock-yl-3368-g-1739239809267-1777900297333.jpg"
          }
        ],
        "comboPrice": 9600000,
        "savingsText": "Tiết kiệm 770.000 ₫ (Miễn phí lắp đặt trên cửa nhôm)",
        "retailTotal": 10370000,
        "savingsAmount": 770000
      }
    }
  }
};

  let currentActiveIntercomBrand = 'hikvision';
  let currentActiveIntercomCombo = 'apartment';

  function renderIntercomBrandTabs(brandKey) {
    const tabsNav = document.getElementById('intercomTabsNav');
    if (!tabsNav) return;

    const brandData = window.ALL_INTERCOM_COMBOS[brandKey] || window.ALL_INTERCOM_COMBOS.hikvision;
    const combos = brandData.combos;

    let html = '';
    Object.keys(combos).forEach(k => {
      const c = combos[k];
      const isActive = (k === currentActiveIntercomCombo);
      html += `
        <button class="omada-tab-btn ${isActive ? 'active' : ''}" data-combo="${k}" type="button">
          <span class="tab-icon">${c.icon}</span>
          <div class="tab-text">
            <strong>${c.tabLabel || c.title}</strong>
            <small>${c.tabSub || c.subtitle}</small>
          </div>
        </button>
      `;
    });
    tabsNav.innerHTML = html;
  }

  function renderIntercomCombo(brandKey, comboKey) {
    const container = document.getElementById('intercomComboDisplay');
    if (!container) return;

    const brandData = window.ALL_INTERCOM_COMBOS[brandKey] || window.ALL_INTERCOM_COMBOS.hikvision;
    const combo = brandData.combos[comboKey] || brandData.combos.apartment;
    currentActiveIntercomBrand = brandKey;
    currentActiveIntercomCombo = comboKey;

    // Update section titles & header
    const badgeTextEl = document.getElementById('intercomBadgeText');
    if (badgeTextEl) badgeTextEl.textContent = brandData.brandBadge;

    const titleEl = document.getElementById('intercomSectionTitle');
    if (titleEl) titleEl.textContent = brandData.sectionTitle;

    const subEl = document.getElementById('intercomSectionSub');
    if (subEl) subEl.innerHTML = brandData.sectionSub;

    // Update section dataset for brand styling
    const sectionEl = document.getElementById('intercomCombos');
    if (sectionEl) sectionEl.setAttribute('data-brand', brandKey);

    let statsHtml = '';
    combo.stats.forEach(st => {
      statsHtml += `
        <div class="combo-stat-pill">
          <small>${st.label}</small>
          <strong>${st.val}</strong>
        </div>
      `;
    });

    let defaultLogo = 'images/logo_hikvision.svg';
    if (brandKey === 'dahua') defaultLogo = 'images/logo_dahua.svg';
    if (brandKey === 'ezviz') defaultLogo = 'images/logo_ezviz.png';

    let itemsHtml = '';
    combo.items.forEach((item) => {
      const lineTotal = item.price * (item.qty || 0);
      const isMuted = (item.qty === 0);
      itemsHtml += `
        <div class="combo-hw-card ${isMuted ? 'item-muted' : ''}" data-prod-id="${item.id}">
          <div class="combo-hw-img-wrap" onclick="window.viewComboProductDetail(${item.id}, '${item.sku}')" title="Xem chi tiết ${item.name}">
            <img src="${item.img}" alt="${item.name}" loading="lazy" onerror="this.src='${defaultLogo}'" />
            <span class="combo-hw-qty-badge">x${item.qty}</span>
          </div>
          <div class="combo-hw-info">
            <div class="combo-hw-top">
              <span class="combo-hw-sku" onclick="window.viewComboProductDetail(${item.id}, '${item.sku}')" title="Xem chi tiết ${item.sku}">${item.sku}</span>
              <span class="combo-hw-role">${item.role}</span>
            </div>
            <div class="combo-hw-name" title="${item.name}" onclick="window.viewComboProductDetail(${item.id}, '${item.sku}')">${item.name}</div>
            <div class="combo-hw-pricing">
              <span class="combo-hw-unit">${formatVND(item.price)} / chiếc</span>
              ${item.qty > 0 ? `<span class="combo-hw-subtotal">Tổng: <strong>${formatVND(lineTotal)}</strong></span>` : '<span class="combo-hw-subtotal muted-text">(Chưa chọn)</span>'}
            </div>
          </div>
          <div class="combo-hw-actions">
            <div class="combo-qty-stepper" title="Tùy chỉnh số lượng thiết bị">
              <button type="button" class="btn-qty-step btn-qty-minus" onclick="event.stopPropagation(); window.stepIntercomComboQty('${brandKey}', '${combo.id}', ${item.id}, -1)" ${item.qty <= 0 ? 'disabled' : ''} aria-label="Giảm số lượng">−</button>
              <span class="combo-qty-value">${item.qty}</span>
              <button type="button" class="btn-qty-step btn-qty-plus" onclick="event.stopPropagation(); window.stepIntercomComboQty('${brandKey}', '${combo.id}', ${item.id}, 1)" ${item.qty >= 99 ? 'disabled' : ''} aria-label="Tăng số lượng">+</button>
            </div>
            <button type="button" class="btn-hw-detail" onclick="event.stopPropagation(); window.viewComboProductDetail(${item.id}, '${item.sku}')" title="Xem chi tiết thông số kỹ thuật ${item.sku}">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <span>Chi tiết</span>
            </button>
          </div>
        </div>
      `;
    });

    const totalQty = combo.items.reduce((s, i) => s + i.qty, 0);

    container.innerHTML = `
      <div class="omada-combo-card" data-brand="${brandKey}" data-combo="${combo.id}">
        <!-- Left / Main Column: Overview & Equipment List -->
        <div class="combo-main-col">
          <div class="combo-header-box">
            <span class="combo-card-badge">${combo.badge}</span>
            <h3 class="combo-card-title">${combo.title}</h3>
            <p class="combo-card-subtitle">${combo.subtitle}</p>
          </div>

          <!-- Fast Metrics Strip -->
          <div class="combo-stats-strip">
            ${statsHtml}
          </div>

          <!-- Included Hardware Grid -->
          <div class="combo-hw-section">
            <div class="combo-hw-header">
              <span>DANH SÁCH THIẾT BỊ TRỌN BỘ (${totalQty} THIẾT BỊ)</span>
              <span class="combo-hw-co-cq">✓ 100% Đồng Bộ Chuẩn Giao Thức Cùng Hãng</span>
            </div>
            <div class="combo-hw-grid">
              ${itemsHtml}
            </div>
          </div>
        </div>

        <!-- Right Column: Price & High-Converting Actions -->
        <div class="combo-side-col">
          <div class="combo-pricing-card">
            <div class="combo-price-head">
              <span class="price-head-label">DỰ TOÁN TRỌN GÓI ƯU ĐÃI</span>
              <span class="price-save-badge">🔥 ${combo.savingsText}</span>
            </div>

            <div class="combo-price-body">
              <div class="combo-retail-price">
                <span class="label">Tổng giá bán lẻ linh kiện:</span>
                <span class="val strike">${formatVND(combo.retailTotal)}</span>
              </div>
              <div class="combo-final-price">
                <span class="label">Giá Combo Trọn Gói Chu Gia:</span>
                <div class="price-val-wrap">
                  <span class="val-num">${formatVND(combo.comboPrice)}</span>
                  <span class="val-note">Đã gồm cấu hình đồng bộ &amp; Lắp đặt chuyển giao</span>
                </div>
              </div>
            </div>

            <!-- Value Props List -->
            <ul class="combo-guarantees-list">
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Đồng bộ 100% <strong>nút chuông &amp; màn hình cùng hãng</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Bảo hành chính hãng <strong>24 tháng (1 đổi 1)</strong></span>
              </li>
              <li>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                <span>Khảo sát vị trí lắp &amp; đo kiểm đường dây tận nơi <strong>0đ</strong></span>
              </li>
            </ul>

            <!-- Actions -->
            <div class="combo-actions-wrap">
              <button type="button" class="btn-combo-cart" onclick="window.addIntercomComboToCart('${brandKey}', '${combo.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span>Thêm Toàn Bộ Vào Giỏ Báo Giá</span>
              </button>

              <button type="button" class="btn-combo-zalo" onclick="window.bookIntercomComboZalo('${brandKey}', '${combo.id}')">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                <span>Tư Vấn &amp; Nhận Báo Giá Zalo</span>
              </button>

              <button type="button" class="btn-combo-explore" onclick="window.filterIntercomBrandCatalog('${brandKey}')">
                <span>${brandData.exploreText}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function switchIntercomBrand(brandKey) {
    if (!window.ALL_INTERCOM_COMBOS[brandKey]) brandKey = 'hikvision';
    currentActiveIntercomBrand = brandKey;
    currentActiveIntercomCombo = 'apartment';

    // Update brand selector buttons
    const brandNav = document.getElementById('intercomBrandNav');
    if (brandNav) {
      brandNav.querySelectorAll('.wifi-brand-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-brand') === brandKey);
      });
    }

    renderIntercomBrandTabs(brandKey);
    renderIntercomCombo(brandKey, currentActiveIntercomCombo);
  }

  function switchIntercomCombo(comboKey) {
    currentActiveIntercomCombo = comboKey;
    const tabsNav = document.getElementById('intercomTabsNav');
    if (tabsNav) {
      tabsNav.querySelectorAll('.omada-tab-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-combo') === comboKey);
      });
    }
    renderIntercomCombo(currentActiveIntercomBrand, comboKey);
  }

  function stepIntercomComboQty(brandKey, comboKey, itemId, delta) {
    const brandData = window.ALL_INTERCOM_COMBOS[brandKey];
    if (!brandData) return;
    const combo = brandData.combos[comboKey];
    if (!combo) return;
    const item = combo.items.find(it => it.id === itemId);
    if (!item) return;

    if (combo.baseDiscountRatio === undefined) {
      combo.baseRetailTotal = combo.retailTotal;
      combo.baseComboPrice = combo.comboPrice;
      combo.baseDiscountRatio = (combo.comboPrice / combo.retailTotal);
    }

    const nextQty = Math.max(0, Math.min(item.qty + delta, 99));
    if (nextQty === item.qty) return;
    item.qty = nextQty;

    const newRetail = combo.items.reduce((s, it) => s + it.price * it.qty, 0);
    let newCombo = 0;
    if (newRetail > 0) {
      newCombo = Math.round((newRetail * combo.baseDiscountRatio) / 10000) * 10000;
    }
    const newSavings = Math.max(0, newRetail - newCombo);

    combo.retailTotal = newRetail;
    combo.comboPrice = newCombo;
    combo.savingsAmount = newSavings;
    combo.savingsText = newSavings > 0 
      ? `Tiết kiệm ${formatVND(newSavings)} (Đã áp dụng chiết khấu combo)`
      : 'Giá theo số lượng cấu hình';

    renderIntercomCombo(brandKey, comboKey);
  }

  function addIntercomComboToCart(brandOrCombo, maybeCombo) {
    let brandKey = currentActiveIntercomBrand;
    let comboKey = brandOrCombo;
    if (maybeCombo) {
      brandKey = brandOrCombo;
      comboKey = maybeCombo;
    }

    const brandData = window.ALL_INTERCOM_COMBOS[brandKey];
    if (!brandData) return;
    const combo = brandData.combos[comboKey];
    if (!combo) return;

    const activeItems = combo.items.filter(item => item.qty > 0);
    if (activeItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thiết bị để thêm vào giỏ báo giá!');
      return;
    }

    activeItems.forEach(item => {
      const prod = state.products.find(p => p.id === item.id || p.sku === item.sku) || {
        id: item.id,
        name: item.name,
        sku: item.sku,
        brand: brandData.brandName,
        retailPrice: item.price,
        image: item.img
      };

      const existing = state.cart.find(c => c.id === prod.id);
      if (existing) {
        existing.qty = Math.min(existing.qty + item.qty, 99);
      } else {
        state.cart.push({
          id: prod.id,
          name: prod.name,
          sku: prod.sku || item.sku,
          brand: prod.brand || brandData.brandName,
          retailPrice: prod.retailPrice || item.price,
          image: prod.image || item.img,
          qty: item.qty
        });
      }
    });

    saveCartToStorage();
    updateCartUI();
    renderCartDrawer();
    openCartDrawer();

    const btn = document.querySelector(`.omada-combo-card[data-combo="${comboKey}"] .btn-combo-cart`);
    if (btn) {
      const origText = btn.innerHTML;
      btn.classList.add('added');
      btn.innerHTML = `<span>✓ Đã Thêm Toàn Bộ ${activeItems.reduce((s, i) => s + i.qty, 0)} Thiết Bị!</span>`;
      setTimeout(() => {
        btn.classList.remove('added');
        btn.innerHTML = origText;
      }, 2000);
    }
  }

  function bookIntercomComboZalo(brandOrCombo, maybeCombo) {
    let brandKey = currentActiveIntercomBrand;
    let comboKey = brandOrCombo;
    if (maybeCombo) {
      brandKey = brandOrCombo;
      comboKey = maybeCombo;
    }

    const brandData = window.ALL_INTERCOM_COMBOS[brandKey];
    if (!brandData) return;
    const combo = brandData.combos[comboKey];
    if (!combo) return;

    const activeItems = combo.items.filter(item => item.qty > 0);
    if (activeItems.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thiết bị để nhận tư vấn Zalo!');
      return;
    }

    let msg = `Xin chào Chu Gia Security! Tôi quan tâm đến giải pháp Chuông hình & Khóa cửa thông minh:\n`;
    msg += `⭐ ${brandData.brandName.toUpperCase()} — ${combo.title.toUpperCase()}\n`;
    msg += `• Giá combo ưu đãi trọn gói: ${formatVND(combo.comboPrice)}\n`;
    msg += `• Quy mô đề xuất: ${combo.stats.map(s => s.label + ': ' + s.val).join(' | ')}\n\n`;
    msg += `Danh sách thiết bị cấu hình:\n`;
    activeItems.forEach((item, idx) => {
      msg += `${idx + 1}. [${item.sku}] ${item.name} — SL: ${item.qty} (${item.role})\n`;
    });
    msg += `\nĐặc biệt lưu ý: Nút ấn chuông hình camera ${brandData.brandName} và màn hình ${brandData.brandName} đồng bộ chuẩn giao thức chính hãng.\nNhờ Chu Gia khảo sát vị trí lắp và gửi báo giá trọn gói giúp tôi. Cảm ơn!`;

    window.open(`https://zalo.me/0941204125?text=${encodeURIComponent(msg)}`, '_blank');
  }

  function filterIntercomBrandCatalog(brandKey) {
    if (brandKey === 'hikvision') {
      setBrand('HIKVISION');
    } else if (brandKey === 'dahua') {
      setBrand('DAHUA');
    } else if (brandKey === 'ezviz') {
      setBrand('EZVIZ');
    }
    const catalogEl = document.getElementById('catalogMain');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function initIntercomCombos() {
    const brandNav = document.getElementById('intercomBrandNav');
    if (brandNav) {
      brandNav.addEventListener('click', e => {
        const btn = e.target.closest('.wifi-brand-btn');
        if (!btn) return;
        const brandKey = btn.getAttribute('data-brand');
        if (brandKey) switchIntercomBrand(brandKey);
      });
    }

    const tabsNav = document.getElementById('intercomTabsNav');
    if (tabsNav) {
      tabsNav.addEventListener('click', e => {
        const btn = e.target.closest('.omada-tab-btn');
        if (!btn) return;
        const comboKey = btn.getAttribute('data-combo');
        if (comboKey) switchIntercomCombo(comboKey);
      });
    }

    renderIntercomBrandTabs('hikvision');
    renderIntercomCombo('hikvision', 'apartment');
  }

  // Global Helpers for Intercom Combos
  window.switchIntercomBrand = brandKey => switchIntercomBrand(brandKey);
  window.switchIntercomCombo = comboKey => switchIntercomCombo(comboKey);
  window.stepIntercomComboQty = (brandKey, comboKey, itemId, delta) => stepIntercomComboQty(brandKey, comboKey, itemId, delta);
  window.addIntercomComboToCart = (brandOrCombo, maybeCombo) => addIntercomComboToCart(brandOrCombo, maybeCombo);
  window.bookIntercomComboZalo = (brandOrCombo, maybeCombo) => bookIntercomComboZalo(brandOrCombo, maybeCombo);
  window.filterIntercomBrandCatalog = brandKey => filterIntercomBrandCatalog(brandKey);
  // ===================== END SPECIALIZED INTERCOM & SMART LOCK COMBOS SYSTEM =====================

  // ===================== END SPECIALIZED MULTI-BRAND WI-FI COMBOS SYSTEM =====================

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
    initOmadaCombos();
    initIntercomCombos();
    applyFilters();
    updateCartUI();

    // Check URL parameters or hash for direct product preview or search query
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let targetProdId = urlParams.get('product') || urlParams.get('id');
      const hash = window.location.hash;
      if (!targetProdId && hash && hash.startsWith('#prod-')) {
        targetProdId = hash.replace('#prod-', '');
      } else if (!targetProdId && hash && hash.startsWith('#product-')) {
        targetProdId = hash.replace('#product-', '');
      }

      if (targetProdId) {
        const pid = parseInt(targetProdId, 10);
        const target = state.products.find(p => p.id === pid || String(p.id) === String(targetProdId) || p.sku === targetProdId);
        if (target) {
          setTimeout(() => openQuickView(target), 350);
        }
      }

      const catParam = urlParams.get('category') || urlParams.get('cat');
      if (catParam) {
        const cid = parseInt(catParam, 10);
        if (!isNaN(cid)) {
          setTimeout(() => setCategory(cid), 150);
        }
      }
      const brandParam = urlParams.get('brand') || urlParams.get('wifiBrand');
      if (brandParam && ['omada', 'ruijie', 'huawei'].includes(brandParam.toLowerCase())) {
        setTimeout(() => switchWifiBrand(brandParam.toLowerCase()), 100);
      }
      const comboParam = urlParams.get('combo');
      if (comboParam && ['home', 'villa', 'office', 'factory'].includes(comboParam)) {
        setTimeout(() => switchWifiCombo(comboParam), 150);
      }

      const intercomBrandParam = urlParams.get('intercomBrand');
      if (intercomBrandParam && ['hikvision', 'dahua', 'ezviz'].includes(intercomBrandParam.toLowerCase())) {
        setTimeout(() => switchIntercomBrand(intercomBrandParam.toLowerCase()), 120);
      }
      const intercomComboParam = urlParams.get('intercomCombo');
      if (intercomComboParam) {
        setTimeout(() => switchIntercomCombo(intercomComboParam), 180);
      }

      const searchParam = urlParams.get('search') || urlParams.get('q');
      if (searchParam) {
        state.searchQuery = searchParam.trim();
        if (el.searchHeroInput) el.searchHeroInput.value = searchParam.trim();
        if (el.searchHeroClear) el.searchHeroClear.classList.add('active');
        applyFilters();
      }
    } catch (e) {
      console.error('Error parsing catalog URL params:', e);
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
    const featuredOrder = [53999, 52930, 52929, 52931, 52932, 52936, 52945, 52940, 52941, 52948, 53652, 53301];
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
      const isOmada = cat.id === 53999;
      const omadaCls = isOmada ? 'quick-pill-omada' : '';
      const displayName = isOmada ? '📶 ' + cat.name : cat.name;
      html += `
        <button class="quick-pill ${activeCls} ${omadaCls}" data-cat-id="${cat.id}">
          <span>${displayName}</span>
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
      const isOmada = cat.id === 53999;
      const omadaCls = isOmada ? 'cat-item-omada' : '';
      const displayName = isOmada ? '📶 ' + cat.name : cat.name;
      html += `
        <li class="cat-filter-item ${activeCls} ${omadaCls}" data-cat-id="${cat.id}">
          <span>${displayName}</span>
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

        // Khi người dùng chủ động gõ từ khóa tìm kiếm,
        // nếu đang ở trong 1 danh mục cụ thể thì tự động chuyển về "Tất cả sản phẩm" để tìm trên toàn bộ kho
        if (state.selectedCategoryId !== -1) {
          state.selectedCategoryId = -1;
          if (el.quickPills) {
            el.quickPills.querySelectorAll('.quick-pill').forEach(btn => {
              btn.classList.toggle('active', btn.dataset.catId === '-1');
            });
            const allPill = el.quickPills.querySelector('.quick-pill[data-cat-id="-1"]');
            if (allPill) scrollPillToCenter(allPill);
          }
          if (el.sidebarCats) {
            el.sidebarCats.querySelectorAll('.cat-filter-item').forEach(item => {
              item.classList.toggle('active', item.dataset.catId === '-1');
            });
          }
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
        window.catalogClearSearch();
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

    // Tự động xóa bộ lọc tìm kiếm khi click sang danh mục sản phẩm khác
    state.searchQuery = '';
    if (el.searchHeroInput) el.searchHeroInput.value = '';
    if (el.searchHeroClear) el.searchHeroClear.classList.remove('active');

    // Xóa tham số search trên URL để tránh bị giữ từ khóa cũ khi tải lại trang
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('search');
      url.searchParams.delete('q');
      window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
    } catch (e) {}

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
      if (brandUpper === 'TP-LINK' || brandUpper === 'OMADA') {
        list = list.filter(p => {
          const b = (p.brand || '').toUpperCase();
          return b === 'TP-LINK' || b === 'OMADA' || p.primaryCategoryId === 53999;
        });
      } else {
        list = list.filter(p => (p.brand || '').toUpperCase() === brandUpper);
      }
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
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('search');
      url.searchParams.delete('q');
      window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
    } catch (e) {}
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

/**
 * CHU GIA SMART SECURITY - MAIN JAVASCRIPT
 * Công ty TNHH Đầu tư và Thương mại Chu Gia
 * Hotline: 0941204125
 * 
 * ĐỊNH GIÁ BÁN LẺ THỰC TẾ ĐẢM BẢO:
 * - Chi phí giá nhập (COGS ~50-55%)
 * - Chi phí chạy quảng cáo Ads (Facebook/Google/TikTok ~20%)
 * - Chi phí vận hành, công thợ & bảo hành 1 đổi 1 trong 24 tháng (~15%)
 * - Lợi nhuận ròng doanh nghiệp (~10-15%)
 */

document.addEventListener('DOMContentLoaded', () => {
  // ---------------- DANH MỤC SẢN PHẨM VỚI GIÁ BÁN TỐI ƯU HÓA ----------------
  const products = [
    {
      id: 'imou-cue-2c',
      name: 'Imou Cue 2C (1080P Siêu Rộng)',
      category: 'indoor',
      brand: 'imou',
      badge: 'GIÁ SỐC 490K',
      costPrice: 310000,
      price: 490000,
      oldPrice: 750000,
      image: 'images/imou_indoor_cue.png?v=3',
      specs: ['Góc rộng 108°', 'Đàm thoại 2 chiều', 'Đế hít nam châm'],
      desc: 'Camera nhỏ gọn dán tường không cần khoan, góc rộng bao quát phòng ngủ & quầy thu ngân.'
    },
    {
      id: 'imou-ranger-2mp',
      name: 'Imou Ranger 2 (2MP Xoay 360°)',
      category: 'indoor',
      brand: 'imou',
      badge: 'BÁN CHẠY 590K',
      costPrice: 390000,
      price: 590000,
      oldPrice: 890000,
      image: 'images/imou_indoor_ranger.png',
      specs: ['Xoay 360°', 'Bám đuổi người', 'Còi hú báo động'],
      desc: 'Dòng camera xoay 360° quốc dân giá tốt nhất, đàm thoại 2 chiều và cảnh báo chuyển động.'
    },
    {
      id: 'imou-bullet-2c',
      name: 'Imou Bullet 2C (Ngoài Trời IP67)',
      category: 'outdoor',
      brand: 'imou',
      badge: 'NGOÀI TRỜI 690K',
      costPrice: 450000,
      price: 690000,
      oldPrice: 1050000,
      image: 'images/imou_outdoor_bullet_2c.png?v=3',
      specs: ['Chống nước IP67', 'Hồng ngoại 30m', 'Anten kép bắt sóng'],
      desc: 'Camera thân trụ chuyên dụng lắp cổng nhà, sân vườn chịu mưa nắng bền bỉ.'
    },
    {
      id: 'imou-ranger-2',
      name: 'Imou Ranger 2 (2K/4MP)',
      category: 'indoor',
      brand: 'imou',
      costPrice: 590000,  // Giá nhập
      price: 850000,      // Giá bán lẻ tối ưu địa phương
      oldPrice: 1250000,  // Giá niêm yết hãng
      image: 'images/imou_indoor_ranger.png',
      specs: ['Xoay 360°', 'AI bám đuổi', 'Đàm thoại 2 chiều'],
      desc: 'Camera Wi-Fi quay quét 360° trong nhà, phát hiện chuyển động và tiếng ồn lạ.'
    },
    {
      id: 'ezviz-c6n-4k',
      name: 'EZVIZ C6N G1 4K',
      category: 'indoor',
      brand: 'ezviz',
      costPrice: 680000,
      price: 990000,
      oldPrice: 1450000,
      image: 'images/ezviz_indoor_c6n_4k.png',
      specs: ['Độ nét 4K', 'Góc nhìn 360°', 'Hồng ngoại 10m'],
      desc: 'Dòng camera quốc dân thế hệ mới sắc nét 4K, kết nối và đàm thoại dễ dàng.'
    },
    {
      id: 'imou-cruiser-2',
      name: 'Imou Cruiser 2 (3K AI 360°)',
      category: 'outdoor',
      brand: 'imou',
      costPrice: 1150000,
      price: 1650000,
      oldPrice: 2250000,
      image: 'images/imou_outdoor_cruiser.png',
      specs: ['Chuẩn 3K', 'Đêm có màu', 'Kháng nước IP66'],
      desc: 'Camera ngoài trời xoay 360°, có đèn rọi và còi báo động răn đe kẻ lạ.'
    },
    {
      id: 'ezviz-h80x-dual',
      name: 'EZVIZ H80x Dual (2 Mắt 3K)',
      category: 'outdoor',
      brand: 'ezviz',
      costPrice: 1390000,
      price: 1990000,
      oldPrice: 2650000,
      image: 'images/ezviz_outdoor_h80x_dual.png',
      specs: ['2 Mắt kép', 'Một cố định, một xoay', 'Đêm màu kép'],
      desc: 'Công nghệ 2 ống kính kép không góc chết, bao quát toàn diện sân vườn & cổng nhà.'
    },
    {
      id: 'ezviz-hb8-solar',
      name: 'EZVIZ HB8 Lite 4G Solar',
      category: 'solar',
      brand: 'ezviz',
      costPrice: 2650000,
      price: 3690000,
      oldPrice: 4800000,
      image: 'images/ezviz_solar_hb8_lite.png',
      specs: ['Sim 4G LTE', 'Pin sạc + Tấm Solar', 'Xoay 360°'],
      desc: 'Không cần dây điện hay wifi. Hoạt động độc lập tại trang trại, ao hồ, bến bãi.'
    },
    {
      id: 'imou-cell-wirefree',
      name: 'Imou Cell Go (Pin Sạc Không Dây)',
      category: 'solar',
      brand: 'imou',
      costPrice: 1450000,
      price: 2150000,
      oldPrice: 2890000,
      image: 'images/imou_wire_free_cell.png',
      specs: ['100% Không dây', 'Pin dùng nhiều tháng', 'Độ nét 2K'],
      desc: 'Lắp đặt linh hoạt mọi vị trí mà không cần đục tường hay đi dây điện.'
    },
    {
      id: 'imou-camera-4g-bullet',
      name: 'Imou Bullet 4G Ngoài Trời',
      category: 'solar',
      brand: 'imou',
      costPrice: 1890000,
      price: 2690000,
      oldPrice: 3500000,
      image: 'images/imou_camera_4g.png',
      specs: ['Sim 4G', 'Vỏ kim loại bền', 'Hồng ngoại 30m'],
      desc: 'Thiết kế thân trụ kim loại chống chịu thời tiết, chuyên dụng cho kho bãi xa nguồn mạng.'
    },
    {
      id: 'ezviz-smart-lock-dl05',
      name: 'Khóa Vân Tay EZVIZ DL05',
      category: 'lock',
      brand: 'ezviz',
      costPrice: 3250000,
      price: 4690000,
      oldPrice: 6200000,
      image: 'images/ezviz_smart_lock_dl05.png',
      specs: ['Vân tay 0.3s', 'Mã số chống nhìn', 'Mở qua App'],
      desc: 'Khóa cửa thông minh cao cấp, tự động chốt khóa và cảnh báo khi có người cạy cửa.'
    },
    {
      id: 'imou-smart-lock-pro',
      name: 'Khóa Cửa IMOU Smart Lock',
      category: 'lock',
      brand: 'imou',
      costPrice: 2890000,
      price: 4190000,
      oldPrice: 5500000,
      image: 'images/imou_smart_lock.png',
      specs: ['Đa phương thức mở', 'Báo trộm cạy phá', 'Pin 12 tháng'],
      desc: 'Khóa cửa vân tay hiện đại, đồng bộ hoàn hảo với hệ sinh thái camera an ninh.'
    },
    {
      id: 'ezviz-doorbell-hp7',
      name: 'Chuông Cửa Màn Hình EZVIZ HP7',
      category: 'lock',
      brand: 'ezviz',
      costPrice: 3890000,
      price: 5490000,
      oldPrice: 6900000,
      image: 'images/ezviz_smart_doorbell_hp7.png',
      specs: ['Màn hình 7 inch', 'Camera 2K', 'Mở khóa từ xa'],
      desc: 'Đàm thoại 2 chiều và mở cửa trực tiếp qua màn hình cảm ứng hoặc điện thoại.'
    }
  ];

  function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount).replace('₫', 'đ');
  }

  // ---------------- HỖ TRỢ CHIA SẺ SẢN PHẨM QUA LINK ----------------
  function getProductShareUrl(productId) {
    return `https://chugia.shop/?product=${encodeURIComponent(productId)}`;
  }

  function copyTextToClipboard(text, onSuccess, onError) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        if (onSuccess) onSuccess();
      }).catch(() => {
        fallbackCopy(text, onSuccess, onError);
      });
    } else {
      fallbackCopy(text, onSuccess, onError);
    }
  }

  function fallbackCopy(text, onSuccess, onError) {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      if (successful) {
        if (onSuccess) onSuccess();
      } else {
        if (onError) onError();
      }
    } catch (err) {
      if (onError) onError();
    }
  }

  function closeProductModal() {
    if (modalOverlay) modalOverlay.classList.remove('active');
    try {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('product');
      window.history.replaceState(null, '', newUrl.toString());
    } catch (e) {}
  }

  // ---------------- HIỂN THỊ SẢN PHẨM ----------------
  const productGrid = document.getElementById('productGrid');
  
  function renderProducts(filterCategory = 'all') {
    if (!productGrid) return;
    
    const filtered = filterCategory === 'all' 
      ? products 
      : products.filter(p => p.category === filterCategory);

    productGrid.innerHTML = filtered.map(product => `
      <div class="product-card ${product.id === 'imou-cue-2c' ? 'promo-featured-card' : ''}" id="${product.id}" data-category="${product.category}">
        <div class="product-image-box">
          <span class="badge-brand-chip ${product.brand}">${product.brand}</span>
          <button type="button" class="product-quick-share-btn" data-id="${product.id}" title="Sao chép link chia sẻ: ${product.name}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="18" cy="5" r="3"></circle>
              <circle cx="6" cy="12" r="3"></circle>
              <circle cx="18" cy="19" r="3"></circle>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
            </svg>
          </button>
          ${product.badge ? `<span class="badge-hot-tag">${product.badge}</span>` : ''}
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
        </div>
        <div class="product-body">
          <h4 class="product-name">${product.name}</h4>
          <div class="product-specs-compact">
            ${product.specs.map(s => `<span class="spec-badge">${s}</span>`).join('')}
          </div>
          <div class="product-footer">
            <div>
              <div class="product-price">${formatVND(product.price)}</div>
              <div style="font-size: 0.72rem; color: #94A3B8; text-decoration: line-through;">${formatVND(product.oldPrice)}</div>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-outline btn-sm quick-view-btn" data-id="${product.id}">Chi Tiết</button>
              <button class="btn btn-primary btn-sm quick-order-btn" data-name="${product.name}">Tư Vấn</button>
            </div>
          </div>
        </div>
      </div>
    `).join('');

    attachProductCardEvents();
  }

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.getAttribute('data-filter'));
    });
  });

  renderProducts();

  // ---------------- MODAL CHI TIẾT ----------------
  // ---------------- MODAL CHI TIẾT SẢN PHẨM ----------------
  const modalOverlay = document.getElementById('quickViewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  // ---------------- MODAL CHIA SẺ MÃ QR & ẢNH SẢN PHẨM ----------------
  const shareQrModal = document.getElementById('shareQrModal');
  const qrModalCloseBtn = document.getElementById('qrModalCloseBtn');
  const qrModalBody = document.getElementById('qrModalBody');

  function closeShareQrModal() {
    if (shareQrModal) shareQrModal.classList.remove('active');
  }

  if (qrModalCloseBtn && shareQrModal) {
    qrModalCloseBtn.addEventListener('click', closeShareQrModal);
    shareQrModal.addEventListener('click', (e) => {
      if (e.target === shareQrModal) closeShareQrModal();
    });
  }

  // Tải ảnh thẻ chia sẻ (gồm Tên + Giá + Ảnh sản phẩm + Mã QR ở góc ảnh)
  function downloadProductQrCard(product, shareUrl) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const w = 540;
    const h = 580;
    canvas.width = w;
    canvas.height = h;

    // Background trắng
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Header bar
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(0, 0, w, 52);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('CHU GIA SMART SECURITY  •  0941 204 125', w / 2, 33);

    // Khung ảnh sản phẩm to
    const heroX = 24;
    const heroY = 70;
    const heroW = w - 48;
    const heroH = 300;

    ctx.fillStyle = '#F8FAFC';
    ctx.beginPath();
    ctx.roundRect(heroX, heroY, heroW, heroH, 14);
    ctx.fill();
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Brand tag góc trên trái khung ảnh
    ctx.fillStyle = product.brand === 'imou' ? '#FF6600' : '#0084FF';
    ctx.beginPath();
    ctx.roundRect(heroX + 14, heroY + 14, 60, 22, 11);
    ctx.fill();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(product.brand.toUpperCase(), heroX + 44, heroY + 29);

    const b64 = (window.PRODUCT_SHARE_THUMBS && window.PRODUCT_SHARE_THUMBS[product.id]) ? window.PRODUCT_SHARE_THUMBS[product.id] : null;
    const prodImg = new Image();

    const drawAndSave = (hasProdImg) => {
      if (hasProdImg) {
        const imgSize = 230;
        ctx.drawImage(prodImg, (w - imgSize) / 2, heroY + 35, imgSize, imgSize);
      }

      // Vẽ mã QR ở GÓC DƯỚI PHẢI của khung ảnh sản phẩm
      const qrEl = document.querySelector('#qrCodeContainer canvas') || document.querySelector('#qrCodeContainer img');
      if (qrEl) {
        const badgeW = 98;
        const badgeH = 112;
        const badgeX = heroX + heroW - badgeW - 12;
        const badgeY = heroY + heroH - badgeH - 12;

        // Badge nền trắng viền xám cho QR
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 10);
        ctx.fill();
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Vẽ QR code (kích thước 82x82)
        ctx.drawImage(qrEl, badgeX + 8, badgeY + 8, 82, 82);

        // Nhãn "QUÉT MÃ QR"
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('QUÉT MÃ QR', badgeX + (badgeW / 2), badgeY + 103);
      }

      // Thông tin sản phẩm bên dưới khung ảnh
      ctx.textAlign = 'left';
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(product.name, heroX, heroY + heroH + 34);

      // Giá ưu đãi (màu cam nổi bật)
      ctx.fillStyle = '#FF6600';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      const priceText = formatVND(product.price);
      ctx.fillText(priceText, heroX, heroY + heroH + 66);
      const priceWidth = ctx.measureText(priceText).width;

      // Giá gốc (màu xám có gạch ngang rõ ràng)
      const oldPriceText = formatVND(product.oldPrice);
      const oldPriceX = heroX + priceWidth + 14;
      const oldPriceY = heroY + heroH + 66;
      ctx.fillStyle = '#94A3B8';
      ctx.font = '500 15px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(oldPriceText, oldPriceX, oldPriceY);
      const oldPriceWidth = ctx.measureText(oldPriceText).width;

      // Đường kẻ gạch ngang qua giá gốc
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(oldPriceX - 2, oldPriceY - 5);
      ctx.lineTo(oldPriceX + oldPriceWidth + 2, oldPriceY - 5);
      ctx.stroke();

      // Mô tả ngắn
      ctx.fillStyle = '#64748B';
      ctx.font = '13px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(product.desc.substring(0, 75) + '...', heroX, heroY + heroH + 94);

      // Footer
      ctx.fillStyle = '#94A3B8';
      ctx.font = '11px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Bảo hành chính hãng 24 tháng  •  Lắp đặt tận nơi: 0941 204 125', w / 2, h - 20);

      // Tải ảnh về máy an toàn (tương thích mọi giao thức file:// & http://)
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.download = `chugia-${product.id}-qr.png`;
        a.href = dataUrl;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 800);
        showToast(`Đã tải ảnh chia sẻ ${product.name}!`);
      } catch (err) {
        // Fallback: Tải mã QR trực tiếp nếu canvas bị chặn
        const qrImg = document.querySelector('#qrCodeContainer img');
        if (qrImg && qrImg.src) {
          const a = document.createElement('a');
          a.download = `chugia-${product.id}-qr.png`;
          a.href = qrImg.src;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => document.body.removeChild(a), 800);
          showToast(`Đã tải mã QR: ${product.name}`);
        } else {
          showToast('Vui lòng chụp màn hình hoặc nhấn giữ để lưu thẻ chia sẻ.');
        }
      }
    };

    prodImg.onload = () => drawAndSave(true);
    prodImg.onerror = () => drawAndSave(false);

    // Ưu tiên sử dụng data URL base64 sạch để không bao giờ bị dính CORS / Tainted Canvas
    if (b64) {
      prodImg.src = 'data:image/png;base64,' + b64;
    } else {
      if (window.location.protocol !== 'file:') {
        prodImg.crossOrigin = 'anonymous';
      }
      prodImg.src = product.image;
    }
  }

  // Tải lười script chia sẻ QR chỉ khi người dùng thực sự cần
  let shareScriptsLoading = false;
  function loadShareScripts(cb) {
    if (window.PRODUCT_SHARE_THUMBS && typeof QRCode !== 'undefined') {
      if (cb) cb();
      return;
    }
    if (shareScriptsLoading) {
      if (cb) setTimeout(() => loadShareScripts(cb), 250);
      return;
    }
    shareScriptsLoading = true;
    let loaded = 0;
    const checkDone = () => {
      loaded++;
      if (loaded >= 2) {
        shareScriptsLoading = false;
        if (cb) cb();
      }
    };
    const s1 = document.createElement('script');
    s1.src = 'js/qrcode.min.js';
    s1.async = true;
    s1.onload = checkDone;
    s1.onerror = checkDone;
    document.body.appendChild(s1);

    const s2 = document.createElement('script');
    s2.src = 'js/product-share-assets.js';
    s2.async = true;
    s2.onload = checkDone;
    s2.onerror = checkDone;
    document.body.appendChild(s2);
  }

  // Mở Popup Chia Sẻ Mã QR & Ảnh Sản Phẩm
  function openShareQrModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !shareQrModal || !qrModalBody) return;

    if (!window.PRODUCT_SHARE_THUMBS || typeof QRCode === 'undefined') {
      loadShareScripts(() => {
        if (shareQrModal.classList.contains('active')) {
          openShareQrModal(productId);
        }
      });
    }

    const shareUrl = getProductShareUrl(product.id);
    const heroImgSrc = (window.PRODUCT_SHARE_THUMBS && window.PRODUCT_SHARE_THUMBS[product.id]) 
      ? ('data:image/png;base64,' + window.PRODUCT_SHARE_THUMBS[product.id]) 
      : product.image;

    qrModalBody.innerHTML = `
      <div class="qr-share-card" id="qrShareCardElement">
        <div class="qr-card-header">
          <div class="qr-shop-brand">
            <span class="qr-shop-dot"></span>
            <strong>CHU GIA SMART SECURITY</strong>
          </div>
          <span class="qr-card-tag">Chính hãng 100%</span>
        </div>

        <!-- Khung ảnh sản phẩm to chính giữa, có mã QR nhỏ ở góc dưới phải -->
        <div class="qr-product-hero-wrap">
          <span class="badge-brand-chip ${product.brand}" style="position: absolute; top: 12px; left: 12px; z-index: 2;">${product.brand.toUpperCase()}</span>
          <img src="${heroImgSrc}" alt="${product.name}" class="qr-hero-img">

          <!-- Mã QR nhỏ ở góc ảnh sản phẩm đủ để quét được (82px) -->
          <div class="qr-corner-badge" title="Quét mã QR bằng Camera hoặc Zalo để mở link">
            <div class="qr-code-box-mini" id="qrCodeContainer"></div>
            <span class="qr-corner-label">Quét mã QR</span>
          </div>
        </div>

        <!-- Thông tin sản phẩm bên dưới -->
        <div class="qr-card-info-bottom">
          <h4 class="qr-card-title">${product.name}</h4>
          <div class="qr-card-price-row">
            <div class="qr-card-price">
              <span class="qr-price-val">${formatVND(product.price)}</span>
              <span class="qr-price-old">${formatVND(product.oldPrice)}</span>
            </div>
            <span class="qr-hotline-badge">0941 204 125</span>
          </div>
          <p class="qr-card-desc">${product.desc}</p>
        </div>
      </div>

      <div class="qr-modal-actions">
        <button type="button" class="btn btn-primary btn-qr-action" id="btnDownloadQrCard" title="Tải ảnh thẻ sản phẩm kèm mã QR về máy">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>Tải ảnh chia sẻ</span>
        </button>
        <button type="button" class="btn btn-outline btn-qr-action" id="btnCopyQrLink" title="Sao chép link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
          <span class="qr-copy-label">Sao chép link</span>
        </button>
        <a href="https://zalo.me/share?url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener noreferrer" class="btn-share-item share-btn-zalo" title="Gửi qua Zalo">
          <span class="zalo-tag">Zalo</span>
          <span>Gửi Zalo</span>
        </a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener noreferrer" class="btn-share-item share-btn-fb" title="Chia sẻ Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          <span>Facebook</span>
        </a>
      </div>
    `;

    shareQrModal.classList.add('active');

    // Tạo mã QR kích thước 82px ở góc ảnh
    const qrContainer = document.getElementById('qrCodeContainer');
    if (qrContainer) {
      qrContainer.innerHTML = '';
      if (typeof QRCode !== 'undefined') {
        new QRCode(qrContainer, {
          text: shareUrl,
          width: 82,
          height: 82,
          colorDark: "#0F172A",
          colorLight: "#FFFFFF",
          correctLevel: QRCode.CorrectLevel.M
        });
      } else {
        const img = document.createElement('img');
        img.src = `https://api.qrserver.com/v1/create-qr-code/?size=82x82&data=${encodeURIComponent(shareUrl)}`;
        img.alt = 'Mã QR sản phẩm';
        qrContainer.appendChild(img);
      }
    }

    // Sự kiện Copy Link trên modal QR
    const btnCopy = qrModalBody.querySelector('#btnCopyQrLink');
    if (btnCopy) {
      btnCopy.addEventListener('click', () => {
        copyTextToClipboard(shareUrl, () => {
          const label = btnCopy.querySelector('.qr-copy-label');
          if (label) label.textContent = '✓ Đã chép link!';
          showToast(`Đã sao chép link: ${product.name}`);
          setTimeout(() => {
            if (label) label.textContent = 'Sao chép link';
          }, 2500);
        });
      });
    }

    // Sự kiện Tải ảnh
    const btnDownload = qrModalBody.querySelector('#btnDownloadQrCard');
    if (btnDownload) {
      btnDownload.addEventListener('click', () => {
        downloadProductQrCard(product, shareUrl);
      });
    }
  }

  function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !modalOverlay || !modalBody) return;

    const shareUrl = getProductShareUrl(product.id);
    const shareTitle = `${product.name} - Giá ưu đãi tại Chu Gia Security`;
    const shareText = `${product.name} giá ${formatVND(product.price)}. ${product.desc}`;

    try {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('product', product.id);
      window.history.replaceState(null, '', newUrl.toString());
    } catch (e) {}

    modalBody.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: center; text-align: center;">
        <img src="${product.image}" alt="${product.name}" style="max-height: 180px; object-fit: contain;">
        <div style="width: 100%;">
          <span class="badge-brand-chip ${product.brand}" style="position: static; display: inline-block; margin-bottom: 6px;">${product.brand.toUpperCase()}</span>
          <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 4px;">${product.name}</h3>
          <div style="display: flex; align-items: baseline; justify-content: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 1.45rem; font-weight: 800; color: #FF6600;">${formatVND(product.price)}</span>
            <span style="font-size: 0.85rem; color: #94A3B8; text-decoration: line-through;">${formatVND(product.oldPrice)}</span>
          </div>
          <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 14px;">${product.desc}</p>
          <div style="display: flex; justify-content: center; gap: 6px; margin-bottom: 18px; flex-wrap: wrap;">
            ${product.specs.map(s => `<span class="spec-badge" style="padding: 4px 8px;">✓ ${s}</span>`).join('')}
          </div>
          <div class="modal-cta-group" style="display: flex; gap: 10px; justify-content: center; margin-bottom: 14px; flex-wrap: wrap;">
            <a href="tel:0941204125" class="btn btn-primary" style="flex: 1; min-width: 135px; justify-content: center; text-align: center;">Gọi 0941 204 125</a>
            <button class="btn btn-outline modal-consult-btn" data-name="${product.name}" style="flex: 1; min-width: 135px; justify-content: center; text-align: center;">Khảo Sát Tận Nhà</button>
          </div>

          <!-- KHỐI CHIA SẺ MẠNG XÃ HỘI QUA LINK -->
          <div class="modal-share-wrapper">
            <div class="modal-share-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
              <span>Chia sẻ sản phẩm qua link &amp; Mã QR:</span>
            </div>
            <div class="modal-share-btns">
              <!-- Nút Mã QR & Ảnh -->
              <button type="button" class="btn-share-item share-btn-qr" id="btnModalOpenQr" title="Hiện mã QR và ảnh để quét hoặc tải về máy">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Mã QR &amp; Ảnh</span>
              </button>

              <!-- Sao chép link -->
              <button type="button" class="btn-share-item share-btn-copy" id="btnShareCopy" title="Sao chép liên kết sản phẩm">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                </svg>
                <span class="share-copy-text">Sao chép link</span>
              </button>

              <!-- Facebook -->
              <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener noreferrer" class="btn-share-item share-btn-fb" title="Chia sẻ lên Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>

              <!-- Zalo -->
              <a href="https://zalo.me/share?url=${encodeURIComponent(shareUrl)}" target="_blank" rel="noopener noreferrer" class="btn-share-item share-btn-zalo" title="Gửi qua Zalo">
                <span class="zalo-tag">Zalo</span>
                <span>Zalo</span>
              </a>

              <!-- Ứng dụng khác -->
              <button type="button" class="btn-share-item share-btn-native" id="btnShareNative" title="Chia sẻ qua ứng dụng khác">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                <span>Khác</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');

    const consultBtn = modalBody.querySelector('.modal-consult-btn');
    if (consultBtn) {
      consultBtn.addEventListener('click', () => {
        closeProductModal();
        scrollToContact(product.name);
      });
    }

    // Mở popup QR từ nút trong modal
    const qrBtn = modalBody.querySelector('#btnModalOpenQr');
    if (qrBtn) {
      qrBtn.addEventListener('click', () => {
        openShareQrModal(product.id);
      });
    }

    const copyBtn = modalBody.querySelector('#btnShareCopy');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        copyTextToClipboard(shareUrl, () => {
          copyBtn.classList.add('copied');
          const textSpan = copyBtn.querySelector('.share-copy-text');
          if (textSpan) textSpan.textContent = '✓ Đã chép link!';
          showToast(`Đã sao chép link: ${product.name}`);
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            if (textSpan) textSpan.textContent = 'Sao chép link';
          }, 2500);
        }, () => {
          showToast('Vui lòng sao chép link trực tiếp trên thanh địa chỉ');
        });
      });
    }

    const nativeBtn = modalBody.querySelector('#btnShareNative');
    if (nativeBtn) {
      nativeBtn.addEventListener('click', () => {
        if (navigator.share) {
          navigator.share({
            title: shareTitle,
            text: shareText,
            url: shareUrl
          }).catch(() => {});
        } else {
          openShareQrModal(product.id);
        }
      });
    }
  }

  function attachProductCardEvents() {
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        openProductModal(e.currentTarget.getAttribute('data-id'));
      });
    });

    document.querySelectorAll('.quick-order-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        scrollToContact(e.currentTarget.getAttribute('data-name'));
      });
    });

    // Nút chia sẻ nhanh trên card sản phẩm: Mở ngay popup Mã QR & Ảnh sản phẩm
    document.querySelectorAll('.product-quick-share-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = e.currentTarget.getAttribute('data-id');
        openShareQrModal(pid);
      });
    });
  }

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => closeProductModal());
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeProductModal();
    });
  }

  function scrollToContact(productInterest = '') {
    const contactSection = document.getElementById('lien-he');
    const noteInput = document.getElementById('consultNote');
    if (noteInput && productInterest) {
      noteInput.value = `Tư vấn lắp đặt: ${productInterest}`;
    }
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // ---------------- SỰ KIỆN CLICK VÀO LINK CAMERA QUẢNG CÁO 490K ----------------
  function setupPromoHookLinks() {
    document.querySelectorAll('.promo-hook-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-id') || 'imou-cue-2c';

        // 1. Chuyển bộ lọc sản phẩm về "Tất Cả" để thẻ sản phẩm chắc chắn hiển thị
        const allTab = document.querySelector('.tab-btn[data-filter="all"]');
        if (allTab && !allTab.classList.contains('active')) {
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          allTab.classList.add('active');
          renderProducts('all');
        }

        // 2. Cuộn mượt màn hình đến đúng con camera
        setTimeout(() => {
          const targetCard = document.getElementById(targetId);
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Thêm hiệu ứng phát sáng neon cam nổi bật
            targetCard.classList.remove('highlight-target');
            void targetCard.offsetWidth; // trigger reflow
            targetCard.classList.add('highlight-target');

            // 3. Tự động bật Quick View Modal sau 650ms khi hoàn tất cuộn
            setTimeout(() => {
              openProductModal(targetId);
            }, 650);
          } else {
            const productSection = document.getElementById('san-pham');
            if (productSection) {
              productSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 60);
      });
    });
  }

  setupPromoHookLinks();

  // ---------------- BẢNG TÍNH DỰ TOÁN CHI PHÍ (NVR & HDD 24/7) ----------------
  const calcCameraType = document.querySelectorAll('input[name="calc_cam_type"]');
  const calcCamQty = document.getElementById('calcCamQty');
  const calcQtyMinus = document.getElementById('calcQtyMinus');
  const calcQtyPlus = document.getElementById('calcQtyPlus');
  const calcStorage = document.querySelectorAll('input[name="calc_storage"]');
  const calcNvr = document.querySelectorAll('input[name="calc_nvr"]');
  const calcHdd = document.querySelectorAll('input[name="calc_hdd"]');
  const calcInstall = document.getElementById('calcInstall');

  const tabModeCard = document.getElementById('tabModeCard');
  const tabModeNVR = document.getElementById('tabModeNVR');
  const storageCardsGroup = document.getElementById('storageCardsGroup');
  const storageNVRGroup = document.getElementById('storageNVRGroup');
  const nvrAdvisoryBox = document.getElementById('nvrAdvisoryBox');

  const days500GB = document.getElementById('days500GB');
  const days1000GB = document.getElementById('days1000GB');
  const days2000GB = document.getElementById('days2000GB');
  const advisoryCamCount = document.getElementById('advisoryCamCount');
  const advisoryHddCap = document.getElementById('advisoryHddCap');
  const advisoryDays = document.getElementById('advisoryDays');

  const summaryCamName = document.getElementById('summaryCamName');
  const summaryCamQty = document.getElementById('summaryCamQty');
  const summaryCamPrice = document.getElementById('summaryCamPrice');
  const lineSummaryCard = document.getElementById('lineSummaryCard');
  const lineSummaryNVR = document.getElementById('lineSummaryNVR');
  const lineSummaryHDD = document.getElementById('lineSummaryHDD');
  const summaryStoragePrice = document.getElementById('summaryStoragePrice');
  const summaryNvrPrice = document.getElementById('summaryNvrPrice');
  const summaryHddPrice = document.getElementById('summaryHddPrice');
  const summaryInstallPrice = document.getElementById('summaryInstallPrice');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');
  const btnBookCalc = document.getElementById('btnBookCalc');

  let currentQty = 2;
  let currentStorageMode = 'card'; // 'card' hoặc 'nvr'

  // Tính số ngày lưu 24/7 theo dung lượng ổ cứng và số camera (chuẩn H.265 ~20GB/ngày/mắt)
  function calc247Days(hddGB, qty) {
    return Math.max(1, Math.floor(hddGB / (qty * 20)));
  }

  // Cập nhật nhãn tư vấn ngày lưu trên các thẻ ổ cứng
  function updateHddLiveLabels() {
    const d500 = calc247Days(500, currentQty);
    const d1000 = calc247Days(1000, currentQty);
    const d2000 = calc247Days(2000, currentQty);

    if (days500GB) days500GB.textContent = `Lưu 24/7 ~${d500} ngày`;
    if (days1000GB) days1000GB.textContent = `Lưu 24/7 ~${d1000} ngày`;
    if (days2000GB) days2000GB.textContent = `Lưu 24/7 ~${d2000} ngày`;
  }

  function setStorageMode(mode) {
    currentStorageMode = mode;
    if (mode === 'card') {
      if (tabModeCard) tabModeCard.classList.add('active');
      if (tabModeNVR) tabModeNVR.classList.remove('active');
      if (storageCardsGroup) storageCardsGroup.style.display = 'block';
      if (storageNVRGroup) storageNVRGroup.style.display = 'none';

      // Bỏ chọn Đầu ghi và Ổ cứng
      calcNvr.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });
      calcHdd.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });

      // Nếu chưa có thẻ nhớ nào được chọn, chọn thẻ 64GB
      let hasCard = false;
      calcStorage.forEach(r => {
        if (r.checked) hasCard = true;
      });
      if (!hasCard) {
        const card64 = document.querySelector('input[name="calc_storage"][value="320000"]');
        if (card64) {
          card64.checked = true;
          card64.closest('.calc-option')?.classList.add('selected');
        }
      }
    } else {
      // mode === 'nvr'
      if (tabModeNVR) tabModeNVR.classList.add('active');
      if (tabModeCard) tabModeCard.classList.remove('active');
      if (storageNVRGroup) storageNVRGroup.style.display = 'block';
      if (storageCardsGroup) storageCardsGroup.style.display = 'none';

      // Bỏ chọn Thẻ nhớ
      calcStorage.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });

      // Nếu chưa chọn đầu ghi, tự động chọn IMOU NVR
      let hasNvr = false;
      calcNvr.forEach(r => {
        if (r.checked) hasNvr = true;
      });
      if (!hasNvr) {
        const nvrFirst = calcNvr[0];
        if (nvrFirst) {
          nvrFirst.checked = true;
          nvrFirst.closest('.calc-option')?.classList.add('selected');
        }
      }

      // Nếu chưa chọn ổ cứng, tự động chọn 1000GB (1TB)
      let hasHdd = false;
      calcHdd.forEach(r => {
        if (r.checked) hasHdd = true;
      });
      if (!hasHdd) {
        const hdd1000 = document.querySelector('input[name="calc_hdd"][data-gb="1000"]');
        if (hdd1000) {
          hdd1000.checked = true;
          hdd1000.closest('.calc-option')?.classList.add('selected');
        }
      }
    }

    updateCalculator();
  }

  // Chuyển tab chế độ lưu
  if (tabModeCard) {
    tabModeCard.addEventListener('click', () => setStorageMode('card'));
  }
  if (tabModeNVR) {
    tabModeNVR.addEventListener('click', () => setStorageMode('nvr'));
  }

  // Khi click vào bất kỳ tùy chọn thẻ nhớ -> Tự động chuyển mode card và bỏ chọn NVR + Ổ cứng
  calcStorage.forEach(radio => {
    radio.addEventListener('change', () => {
      currentStorageMode = 'card';
      if (tabModeCard) tabModeCard.classList.add('active');
      if (tabModeNVR) tabModeNVR.classList.remove('active');
      if (storageCardsGroup) storageCardsGroup.style.display = 'block';
      if (storageNVRGroup) storageNVRGroup.style.display = 'none';

      // Bỏ chọn toàn bộ Đầu ghi & Ổ cứng
      calcNvr.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });
      calcHdd.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });

      updateCalculator();
    });
  });

  // Khi click vào Đầu ghi -> Tự động chuyển mode NVR và BỎ CHỌN THẺ NHỚ
  calcNvr.forEach(radio => {
    radio.addEventListener('change', () => {
      currentStorageMode = 'nvr';
      if (tabModeNVR) tabModeNVR.classList.add('active');
      if (tabModeCard) tabModeCard.classList.remove('active');
      if (storageNVRGroup) storageNVRGroup.style.display = 'block';

      // BỎ CHỌN TOÀN BỘ THẺ NHỚ
      calcStorage.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });

      // Nếu chưa chọn ổ cứng, mặc định chọn 1000GB
      let hasHdd = false;
      calcHdd.forEach(r => { if (r.checked) hasHdd = true; });
      if (!hasHdd) {
        const hdd1000 = document.querySelector('input[name="calc_hdd"][data-gb="1000"]');
        if (hdd1000) {
          hdd1000.checked = true;
          hdd1000.closest('.calc-option')?.classList.add('selected');
        }
      }

      updateCalculator();
    });
  });

  // Khi click vào Ổ Cứng -> Tự động chuyển mode NVR và BỎ CHỌN THẺ NHỚ
  calcHdd.forEach(radio => {
    radio.addEventListener('change', () => {
      currentStorageMode = 'nvr';
      if (tabModeNVR) tabModeNVR.classList.add('active');
      if (tabModeCard) tabModeCard.classList.remove('active');
      if (storageNVRGroup) storageNVRGroup.style.display = 'block';

      // BỎ CHỌN TOÀN BỘ THẺ NHỚ
      calcStorage.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });

      // Nếu chưa chọn đầu ghi, tự động chọn đầu ghi đầu tiên
      let hasNvr = false;
      calcNvr.forEach(r => { if (r.checked) hasNvr = true; });
      if (!hasNvr) {
        const nvrFirst = calcNvr[0];
        if (nvrFirst) {
          nvrFirst.checked = true;
          nvrFirst.closest('.calc-option')?.classList.add('selected');
        }
      }

      updateCalculator();
    });
  });

  function updateCalculator() {
    updateHddLiveLabels();

    // 1. Camera Type
    let selectedCamPrice = 590000;
    let selectedCamLabel = 'Trong Nhà 360° (590k)';
    calcCameraType.forEach(radio => {
      if (radio.checked) {
        selectedCamPrice = parseInt(radio.value, 10);
        selectedCamLabel = radio.getAttribute('data-label');
      }
    });

    document.querySelectorAll('.cam-type-option').forEach(opt => {
      const input = opt.querySelector('input');
      if (input.checked) opt.classList.add('selected');
      else opt.classList.remove('selected');
    });

    // 2. Storage Mode Calculation
    let totalStorage = 0;

    if (currentStorageMode === 'card') {
      let selectedCardPrice = 320000;
      calcStorage.forEach(radio => {
        if (radio.checked) {
          selectedCardPrice = parseInt(radio.value, 10);
        }
      });

      document.querySelectorAll('.storage-card-option').forEach(opt => {
        const input = opt.querySelector('input');
        if (input.checked) opt.classList.add('selected');
        else opt.classList.remove('selected');
      });

      totalStorage = selectedCardPrice * currentQty;

      if (lineSummaryCard) lineSummaryCard.style.display = 'flex';
      if (lineSummaryNVR) lineSummaryNVR.style.display = 'none';
      if (lineSummaryHDD) lineSummaryHDD.style.display = 'none';
      if (summaryStoragePrice) summaryStoragePrice.textContent = `${formatVND(totalStorage)} (${currentQty} thẻ)`;
    } else {
      // Mode NVR + HDD
      let selectedNvrPrice = 1235000;
      let selectedNvrLabel = 'Đầu ghi IMOU NVR-N110W (10 kênh)';
      calcNvr.forEach(radio => {
        if (radio.checked) {
          selectedNvrPrice = parseInt(radio.value, 10);
          selectedNvrLabel = radio.getAttribute('data-label');
        }
      });

      document.querySelectorAll('.nvr-brand-option').forEach(opt => {
        const input = opt.querySelector('input');
        if (input.checked) opt.classList.add('selected');
        else opt.classList.remove('selected');
      });

      let selectedHddPrice = 850000;
      let selectedHddLabel = 'Ổ Cứng HDD 1000GB (1TB)';
      let selectedHddGB = 1000;
      calcHdd.forEach(radio => {
        if (radio.checked) {
          selectedHddPrice = parseInt(radio.value, 10);
          selectedHddLabel = radio.getAttribute('data-label');
          selectedHddGB = parseInt(radio.getAttribute('data-gb'), 10) || 1000;
        }
      });

      document.querySelectorAll('.nvr-hdd-option').forEach(opt => {
        const input = opt.querySelector('input');
        if (input.checked) opt.classList.add('selected');
        else opt.classList.remove('selected');
      });

      const days247 = calc247Days(selectedHddGB, currentQty);
      totalStorage = selectedNvrPrice + selectedHddPrice;

      // Cập nhật advisory box
      if (advisoryCamCount) advisoryCamCount.textContent = currentQty;
      if (advisoryHddCap) advisoryHddCap.textContent = `${selectedHddGB}GB`;
      if (advisoryDays) advisoryDays.textContent = `~${days247} ngày`;

      if (lineSummaryCard) lineSummaryCard.style.display = 'none';
      if (lineSummaryNVR) lineSummaryNVR.style.display = 'flex';
      if (lineSummaryHDD) lineSummaryHDD.style.display = 'flex';

      if (summaryNvrPrice) summaryNvrPrice.textContent = formatVND(selectedNvrPrice);
      if (summaryHddPrice) summaryHddPrice.textContent = `${formatVND(selectedHddPrice)} (Lưu 24/7 ~${days247} ngày)`;
    }

    // 3. Installation
    const isInstallChecked = calcInstall ? calcInstall.checked : true;
    const installPricePerCam = isInstallChecked ? 200000 : 0;
    const totalInstall = installPricePerCam * currentQty;

    // 4. Totals
    const totalCam = selectedCamPrice * currentQty;
    const grandTotal = totalCam + totalStorage + totalInstall;

    if (summaryCamName) summaryCamName.textContent = selectedCamLabel;
    if (summaryCamQty) summaryCamQty.textContent = `${currentQty} Mắt`;
    if (summaryCamPrice) summaryCamPrice.textContent = formatVND(totalCam);
    if (summaryInstallPrice) summaryInstallPrice.textContent = isInstallChecked ? formatVND(totalInstall) : '0 đ';
    if (summaryTotalPrice) summaryTotalPrice.textContent = formatVND(grandTotal);

    if (calcCamQty) calcCamQty.textContent = currentQty;
  }

  if (calcQtyMinus && calcQtyPlus) {
    calcQtyMinus.addEventListener('click', () => {
      if (currentQty > 1) {
        currentQty--;
        updateCalculator();
      }
    });
    calcQtyPlus.addEventListener('click', () => {
      if (currentQty < 16) {
        currentQty++;
        updateCalculator();
      }
    });
  }

  calcCameraType.forEach(radio => radio.addEventListener('change', updateCalculator));
  if (calcInstall) calcInstall.addEventListener('change', updateCalculator);

  updateCalculator();

  if (btnBookCalc) {
    btnBookCalc.addEventListener('click', () => {
      const camName = summaryCamName ? summaryCamName.textContent : 'Camera';
      const total = summaryTotalPrice ? summaryTotalPrice.textContent : '';
      let storageNote = '';
      if (currentStorageMode === 'card') {
        const cardRadio = document.querySelector('input[name="calc_storage"]:checked');
        const cardLbl = cardRadio ? cardRadio.getAttribute('data-label') : 'Thẻ nhớ';
        storageNote = `${currentQty} thẻ ${cardLbl}`;
      } else {
        const hddRadio = document.querySelector('input[name="calc_hdd"]:checked');
        const nvrRadio = document.querySelector('input[name="calc_nvr"]:checked');
        const nvrLbl = nvrRadio ? nvrRadio.getAttribute('data-label') : 'Đầu ghi NVR';
        const hddGB = hddRadio ? hddRadio.getAttribute('data-gb') : '1000';
        const days = calc247Days(parseInt(hddGB, 10), currentQty);
        storageNote = `${nvrLbl} + Ổ cứng ${hddGB}GB (Lưu 24/7 ~${days} ngày)`;
      }
      scrollToContact(`${currentQty} mắt ${camName} + ${storageNote} (Dự toán: ${total})`);
    });
  }

  // ---------------- FORM ----------------
  const contactForm = document.getElementById('consultationForm');
  const toastMsg = document.getElementById('toastMsg');

  function showToast(message) {
    if (!toastMsg) return;
    toastMsg.textContent = message;
    toastMsg.classList.add('show');
    setTimeout(() => toastMsg.classList.remove('show'), 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      if (!name || !phone) return;
      showToast(`Cảm ơn ${name}! Kỹ thuật Chu Gia sẽ gọi tới ${phone} ngay!`);
      contactForm.reset();
    });
  }

  // ---------------- MOBILE MENU & SCROLL ----------------
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => navMenu.classList.toggle('open'));
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => navMenu.classList.remove('open'));
    });
  }

  const floatTopBtn = document.getElementById('floatTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      if (floatTopBtn) floatTopBtn.classList.add('visible');
    } else {
      if (floatTopBtn) floatTopBtn.classList.remove('visible');
    }
  });

  // ---------------- HERO SHOWCASE SLIDER ----------------
  const heroSlides = document.querySelectorAll('.hero-slide');
  const sliderTabs = document.querySelectorAll('.slider-tab-btn');
  let currentHeroIndex = 0;
  let heroTimer = null;

  function setHeroSlide(index) {
    if (!heroSlides.length) return;
    currentHeroIndex = index;
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    sliderTabs.forEach((tab, i) => {
      tab.classList.toggle('active', i === index);
    });
  }

  sliderTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetIdx = parseInt(btn.getAttribute('data-target'), 10);
      setHeroSlide(targetIdx);
      resetHeroTimer();
    });
  });

  function startHeroTimer() {
    heroTimer = setInterval(() => {
      if (!heroSlides.length) return;
      const nextIdx = (currentHeroIndex + 1) % heroSlides.length;
      setHeroSlide(nextIdx);
    }, 5000);
  }

  function resetHeroTimer() {
    if (heroTimer) clearInterval(heroTimer);
    startHeroTimer();
  }

  // ---------------- TỰ ĐỘNG MỞ MODAL KHI TRUY CẬP TỪ LINK CHIA SẺ ----------------
  function checkUrlProductParam() {
    try {
      const params = new URLSearchParams(window.location.search);
      let prodId = params.get('product');
      if (!prodId && window.location.hash.startsWith('#product-')) {
        prodId = window.location.hash.replace('#product-', '');
      }
      if (prodId) {
        const found = products.find(p => p.id === prodId);
        if (found) {
          setTimeout(() => {
            openProductModal(prodId);
            const targetEl = document.getElementById(prodId) || document.getElementById('san-pham');
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 350);
        }
      }
    } catch (e) {}
  }

  checkUrlProductParam();

  startHeroTimer();
});

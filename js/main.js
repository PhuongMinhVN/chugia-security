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
      id: 'ezviz-c6n',
      name: 'EZVIZ C6N (Trong Nhà 2K AI)',
      category: 'indoor',
      brand: 'ezviz',
      badge: 'SIÊU NÉT 2K AI',
      costPrice: 620000,
      price: 850000,
      oldPrice: 1250000,
      image: 'images/ezviz_indoor_c6n_4k.png',
      specs: ['Độ nét 2K AI', 'Quay quét 360°', 'Đàm thoại 2 chiều'],
      desc: 'Camera Wi-Fi quay quét 360° trong nhà sắc nét chuẩn 2K, đàm thoại 2 chiều và bám theo người.'
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
      id: 'solar-4g',
      name: 'Camera Pin Solar 4G Năng Lượng Mặt Trời',
      category: 'solar',
      brand: 'ezviz',
      badge: 'PIN SOLAR 4G',
      costPrice: 2650000,
      price: 3690000,
      oldPrice: 4800000,
      image: 'images/ezviz_solar_eb3_4g.png',
      specs: ['Sim 4G không dây', 'Pin sạc + Tấm Solar', 'Không kéo điện/wifi'],
      desc: 'Giải pháp an ninh không dây độc lập, dùng tấm pin năng lượng mặt trời & Sim 4G cho trang trại, bến bãi.'
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
    let product = products.find(p => String(p.id) === String(productId));
    if (!product && window.HTA_PRODUCTS_DATA && window.HTA_PRODUCTS_DATA.products) {
      const hp = window.HTA_PRODUCTS_DATA.products.find(p => String(p.id) === String(productId));
      if (hp) {
        product = {
          id: hp.id,
          name: hp.name,
          brand: (hp.brand || 'CHÍNH HÃNG').toLowerCase(),
          price: hp.retailPrice,
          oldPrice: hp.originalPrice || Math.round(hp.retailPrice * 1.25),
          desc: hp.features && hp.features.length > 0 ? hp.features.slice(0, 2).join(' ') : (hp.description || hp.categoryName || ''),
          image: hp.image || 'images/imou_indoor_ranger.png',
          specs: [
            `Mã SKU: ${hp.sku || 'N/A'}`,
            `Bảo hành: ${hp.warranty || '24 tháng'}`,
            `Danh mục: ${hp.categoryName || 'Thiết bị an ninh'}`
          ]
        };
      }
    }
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

  // ---------------- BẢNG TÍNH DỰ TOÁN CHI PHÍ (MULTI-CAMERA & GÓI COMBO) ----------------
  const CAMERAS_DATA = {
    'imou-cue-2c': {
      id: 'imou-cue-2c',
      name: 'Imou Cue 2C (Trong Nhà Góc Rộng)',
      shortName: 'Trong Nhà Góc Rộng',
      type: 'indoor',
      typeLabel: 'Trong Nhà',
      price: 490000,
      img: 'images/imou_indoor_cue.png',
      badge: 'GIÁ TỐT 490K',
      specs: ['Góc rộng 108°', 'Đế nam châm', 'Đàm thoại 2C']
    },
    'imou-ranger-2': {
      id: 'imou-ranger-2',
      name: 'Imou Ranger 2 (Trong Nhà 360° AI)',
      shortName: 'Trong Nhà 360° AI',
      type: 'indoor',
      typeLabel: 'Trong Nhà',
      price: 590000,
      img: 'images/imou_indoor_ranger.png',
      badge: 'BÁN CHẠY NHẤT',
      specs: ['Xoay 360°', 'Bám theo người', 'Còi báo động']
    },
    'ezviz-c6n': {
      id: 'ezviz-c6n',
      name: 'EZVIZ C6N (Trong Nhà 2K AI)',
      shortName: 'Trong Nhà 2K AI',
      type: 'indoor',
      typeLabel: 'Trong Nhà',
      price: 850000,
      img: 'images/ezviz_indoor_c6n_4k.png',
      badge: 'SIÊU NÉT 2K AI',
      specs: ['Chuẩn nét 2K/4K', 'Xoay 360°', 'Đàm thoại 2C']
    },
    'imou-bullet-2c': {
      id: 'imou-bullet-2c',
      name: 'Imou Bullet 2C (Ngoài Trời IP67)',
      shortName: 'Ngoài Trời IP67',
      type: 'outdoor',
      typeLabel: 'Ngoài Trời',
      price: 690000,
      img: 'images/imou_outdoor_bullet_2c.png',
      badge: 'CHỐNG NƯỚC IP67',
      specs: ['Chống nước IP67', 'Hồng ngoại 30m', 'Anten thu xa']
    },
    'imou-cruiser-2': {
      id: 'imou-cruiser-2',
      name: 'Imou Cruiser 2 (Ngoài Trời 3K 360° AI)',
      shortName: 'Ngoài Trời 3K 360°',
      type: 'outdoor',
      typeLabel: 'Ngoài Trời',
      price: 1650000,
      img: 'images/imou_outdoor_cruiser.png',
      badge: 'ĐÊM CÓ MÀU 30M',
      specs: ['Xoay 360° ngoài trời', 'Đêm có màu 30m', 'Còi hú chớp đèn']
    },
    'solar-4g': {
      id: 'solar-4g',
      name: 'Camera Pin Solar 4G Năng Lượng Mặt Trời',
      shortName: 'Pin Solar 4G',
      type: 'outdoor',
      typeLabel: 'Ngoài Trời / 4G',
      price: 3690000,
      img: 'images/ezviz_solar_eb3_4g.png',
      badge: 'PIN SOLAR 4G KHÔNG DÂY',
      specs: ['Pin năng lượng MT', 'Sim 4G không wifi', 'Không kéo dây']
    }
  };

  // Trạng thái số lượng cho từng model camera (mặc định 1 Trong Nhà 360° + 1 Ngoài Trời IP67)
  const camQuantities = {
    'imou-cue-2c': 0,
    'imou-ranger-2': 1,
    'ezviz-c6n': 0,
    'imou-bullet-2c': 1,
    'imou-cruiser-2': 0,
    'solar-4g': 0
  };

  const calcStorage = document.querySelectorAll('input[name="calc_storage"]');
  const calcNvr = document.querySelectorAll('input[name="calc_nvr"]');
  const calcHdd = document.querySelectorAll('input[name="calc_hdd"]');
  const calcInstall = document.querySelectorAll('input[name="calc_install"]');

  const tabModeCard = document.getElementById('tabModeCard');
  const tabModeNVR = document.getElementById('tabModeNVR');
  const storageCardsGroup = document.getElementById('storageCardsGroup');
  const storageNVRGroup = document.getElementById('storageNVRGroup');
  const nvrAdvisoryBox = document.getElementById('nvrAdvisoryBox');

  const storageNvrRecommendBox = document.getElementById('storageNvrRecommendBox');
  const recCamCount = document.getElementById('recCamCount');
  const recBadgeChip = document.getElementById('recBadgeChip');
  const recBoxDesc = document.getElementById('recBoxDesc');
  const btnRecSwitchNvr = document.getElementById('btnRecSwitchNvr');
  const recTabBadge = document.getElementById('recTabBadge');
  const previewRecHint = document.getElementById('previewRecHint');
  const previewRecCamCount = document.getElementById('previewRecCamCount');
  const previewSwitchNvrBtn = document.getElementById('previewSwitchNvrBtn');

  const days500GB = document.getElementById('days500GB');
  const days1000GB = document.getElementById('days1000GB');
  const days2000GB = document.getElementById('days2000GB');
  const days4000GB = document.getElementById('days4000GB');
  const advisoryCamCount = document.getElementById('advisoryCamCount');
  const advisoryHddCap = document.getElementById('advisoryHddCap');
  const advisoryDays = document.getElementById('advisoryDays');

  const summaryCamList = document.getElementById('summaryCamList');
  const summaryTotalCamCount = document.getElementById('summaryTotalCamCount');
  const summaryCamPrice = document.getElementById('summaryCamPrice');
  const lineSummaryCard = document.getElementById('lineSummaryCard');
  const lineSummaryNVR = document.getElementById('lineSummaryNVR');
  const lineSummaryHDD = document.getElementById('lineSummaryHDD');
  const summaryStoragePrice = document.getElementById('summaryStoragePrice');
  const summaryNvrPrice = document.getElementById('summaryNvrPrice');
  const summaryHddPrice = document.getElementById('summaryHddPrice');
  const lineSummaryInstall = document.getElementById('lineSummaryInstall');
  const summaryInstallPrice = document.getElementById('summaryInstallPrice');
  const summaryTotalPrice = document.getElementById('summaryTotalPrice');
  const btnBookCalc = document.getElementById('btnBookCalc');

  const calcPreviewImg = document.getElementById('calcPreviewImg');
  const calcPreviewBadge = document.getElementById('calcPreviewBadge');
  const calcPreviewName = document.getElementById('calcPreviewName');
  const calcPreviewSpecs = document.getElementById('calcPreviewSpecs');
  const calcLiveTotalPrice = document.getElementById('calcLiveTotalPrice');

  const calcMobileStickyBar = document.getElementById('calcMobileStickyBar');
  const cmsbCamImg = document.getElementById('cmsbCamImg');
  const cmsbCamName = document.getElementById('cmsbCamName');
  const cmsbTotalPrice = document.getElementById('cmsbTotalPrice');
  const cmsbBtnDetail = document.getElementById('cmsbBtnDetail');
  const cmsbCamInfo = document.getElementById('cmsbCamInfo');
  const previewBtnDetail = document.getElementById('previewBtnDetail');
  const calcSummaryBox = document.getElementById('calcSummaryBox');
  const calcPreviewCta = document.getElementById('calcPreviewCta');
  // --- Tab Switcher & Catalog Picker DOM references ---
  const tabCalcPackage = document.getElementById('tabCalcPackage');
  const tabCalcCatalog = document.getElementById('tabCalcCatalog');
  const paneCalcPackage = document.getElementById('paneCalcPackage');
  const paneCalcCatalog = document.getElementById('paneCalcCatalog');

  const calcCatSearchInput = document.getElementById('calcCatSearchInput');
  const calcCatClearBtn = document.getElementById('calcCatClearBtn');
  const calcCatPillsBar = document.getElementById('calcCatPillsBar');
  const calcCatalogGrid = document.getElementById('calcCatalogGrid');
  const btnCalcCatLoadMore = document.getElementById('btnCalcCatLoadMore');
  const calcCatLoadMoreWrap = document.getElementById('calcCatLoadMoreWrap');

  const summaryCustomSection = document.getElementById('summaryCustomSection');
  const summaryCustomList = document.getElementById('summaryCustomList');
  const summaryCustomCount = document.getElementById('summaryCustomCount');
  const summaryCustomPrice = document.getElementById('summaryCustomPrice');

  let activeCalcTab = 'package'; // 'package' hoặc 'catalog'
  let customProducts = []; // [{id, name, sku, brand, retailPrice, image, qty}]
  let catFilter = 'all';
  let catSearchQuery = '';
  let catPage = 1;
  const CAT_PAGE_SIZE = 12;

  function loadCustomProductsFromStorage() {
    try {
      const saved = localStorage.getItem('chugia_quote_cart');
      if (saved) {
        customProducts = JSON.parse(saved);
        if (!Array.isArray(customProducts)) customProducts = [];
      }
    } catch (e) {
      customProducts = [];
    }
  }

  function saveCustomProductsToStorage() {
    try {
      localStorage.setItem('chugia_quote_cart', JSON.stringify(customProducts));
    } catch (e) {}
  }

  loadCustomProductsFromStorage();

  function switchCalcTab(tab) {
    activeCalcTab = tab;
    if (tab === 'package') {
      if (tabCalcPackage) {
        tabCalcPackage.classList.add('active');
        tabCalcPackage.setAttribute('aria-selected', 'true');
      }
      if (tabCalcCatalog) {
        tabCalcCatalog.classList.remove('active');
        tabCalcCatalog.setAttribute('aria-selected', 'false');
      }
      if (paneCalcPackage) paneCalcPackage.style.display = 'block';
      if (paneCalcCatalog) paneCalcCatalog.style.display = 'none';
    } else {
      if (tabCalcPackage) {
        tabCalcPackage.classList.remove('active');
        tabCalcPackage.setAttribute('aria-selected', 'false');
      }
      if (tabCalcCatalog) {
        tabCalcCatalog.classList.add('active');
        tabCalcCatalog.setAttribute('aria-selected', 'true');
      }
      if (paneCalcPackage) paneCalcPackage.style.display = 'none';
      if (paneCalcCatalog) paneCalcCatalog.style.display = 'block';
      renderCalcCatalog();
    }
  }

  function getFilteredCatalogProducts() {
    if (!window.HTA_PRODUCTS_DATA || !window.HTA_PRODUCTS_DATA.products) return [];
    let list = window.HTA_PRODUCTS_DATA.products;

    if (catFilter !== 'all') {
      const catId = parseInt(catFilter, 10);
      list = list.filter(p => {
        if (p.primaryCategoryId === catId) return true;
        if (p.categoryIds && p.categoryIds.includes(catId)) return true;
        return false;
      });
    }

    if (catSearchQuery.trim()) {
      const q = catSearchQuery.toLowerCase().trim();
      list = list.filter(p => {
        const nameMatch = p.name && p.name.toLowerCase().includes(q);
        const skuMatch = p.sku && p.sku.toLowerCase().includes(q);
        const brandMatch = p.brand && p.brand.toLowerCase().includes(q);
        const catMatch = p.categoryName && p.categoryName.toLowerCase().includes(q);
        return nameMatch || skuMatch || brandMatch || catMatch;
      });
    }

    return list;
  }

  function renderCalcCatalog(resetPage = false) {
    if (!calcCatalogGrid) return;
    if (resetPage) catPage = 1;

    const allFiltered = getFilteredCatalogProducts();
    const visibleCount = catPage * CAT_PAGE_SIZE;
    const itemsToShow = allFiltered.slice(0, visibleCount);

    if (itemsToShow.length === 0) {
      calcCatalogGrid.innerHTML = `
        <div class="calc-cat-empty">
          <div class="cce-icon">🔍</div>
          <div class="cce-title">Không tìm thấy thiết bị phù hợp</div>
          <div class="cce-desc">Thử đổi từ khóa tìm kiếm hoặc chọn danh mục "Tất Cả" để xem trọn bộ 480+ sản phẩm.</div>
        </div>
      `;
      if (calcCatLoadMoreWrap) calcCatLoadMoreWrap.style.display = 'none';
      return;
    }

    calcCatalogGrid.innerHTML = itemsToShow.map(p => {
      const cartItem = customProducts.find(item => item.id === p.id);
      const qty = cartItem ? cartItem.qty : 0;
      const isSelected = qty > 0;

      return `
        <div class="calc-prod-card ${isSelected ? 'selected' : ''}" data-id="${p.id}">
          <div class="calc-prod-header">
            <span class="calc-prod-brand">${p.brand || 'CHÍNH HÃNG'}</span>
            ${p.sku ? `<span class="calc-prod-sku">${p.sku}</span>` : ''}
          </div>
          <div class="calc-prod-img-wrap" data-id="${p.id}">
            <img src="${p.image || 'images/imou_indoor_ranger.png'}" alt="${p.name}" loading="lazy" onerror="this.src='images/imou_indoor_ranger.png'">
            ${isSelected ? `<span class="calc-prod-qty-badge">${qty}</span>` : ''}
          </div>
          <div class="calc-prod-body">
            <h4 class="calc-prod-title" title="${p.name}" data-id="${p.id}">${p.name}</h4>
            <div class="calc-prod-price-row">
              <span class="calc-prod-price">${formatVND(p.retailPrice)}</span>
              ${p.originalPrice && p.originalPrice > p.retailPrice ? `<span class="calc-prod-orig-price">${formatVND(p.originalPrice)}</span>` : ''}
            </div>
          </div>
          <div class="calc-prod-actions">
            ${qty === 0 ? `
              <button type="button" class="btn-calc-prod-add" data-id="${p.id}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                <span>Thêm vào dự toán</span>
              </button>
            ` : `
              <div class="calc-prod-stepper">
                <button type="button" class="cps-btn minus" data-id="${p.id}" aria-label="Giảm">−</button>
                <span class="cps-qty">${qty}</span>
                <button type="button" class="cps-btn plus" data-id="${p.id}" aria-label="Tăng">+</button>
              </div>
            `}
            <button type="button" class="btn-calc-prod-quickview" data-id="${p.id}" title="Xem chi tiết sản phẩm">
              <span>Chi tiết</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (calcCatLoadMoreWrap) {
      calcCatLoadMoreWrap.style.display = (visibleCount < allFiltered.length) ? 'block' : 'none';
    }

    bindCalcCatalogItemEvents();
  }

  function bindCalcCatalogItemEvents() {
    if (!calcCatalogGrid) return;

    // Nút thêm vào dự toán
    calcCatalogGrid.querySelectorAll('.btn-calc-prod-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        if (id) addCatalogProductToCalc(id);
      });
    });

    // Stepper giảm
    calcCatalogGrid.querySelectorAll('.cps-btn.minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        if (id) changeCatalogProductQty(id, -1);
      });
    });

    // Stepper tăng
    calcCatalogGrid.querySelectorAll('.cps-btn.plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = parseInt(btn.getAttribute('data-id'), 10);
        if (id) changeCatalogProductQty(id, 1);
      });
    });

    // Xem chi tiết
    calcCatalogGrid.querySelectorAll('.btn-calc-prod-quickview, .calc-prod-img-wrap, .calc-prod-title').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = el.getAttribute('data-id');
        if (id) openProductModal(id);
      });
    });
  }

  function addCatalogProductToCalc(prodId) {
    if (!window.HTA_PRODUCTS_DATA || !window.HTA_PRODUCTS_DATA.products) return;
    const prod = window.HTA_PRODUCTS_DATA.products.find(p => p.id === prodId);
    if (!prod) return;

    const existing = customProducts.find(item => item.id === prodId);
    if (existing) {
      existing.qty += 1;
    } else {
      customProducts.push({
        id: prod.id,
        name: prod.name,
        sku: prod.sku || '',
        brand: prod.brand || '',
        retailPrice: prod.retailPrice,
        image: prod.image || '',
        qty: 1
      });
    }

    saveCustomProductsToStorage();
    renderCalcCatalog();
    updateCalculator();
    showToast(`Đã thêm "${prod.name}" vào dự toán!`);
  }

  function changeCatalogProductQty(prodId, delta) {
    const idx = customProducts.findIndex(item => item.id === prodId);
    if (idx < 0) return;
    customProducts[idx].qty += delta;
    if (customProducts[idx].qty <= 0) {
      customProducts.splice(idx, 1);
    }
    saveCustomProductsToStorage();
    renderCalcCatalog();
    updateCalculator();
  }

  function removeCatalogProductFromCalc(prodId) {
    customProducts = customProducts.filter(item => item.id !== prodId);
    saveCustomProductsToStorage();
    renderCalcCatalog();
    updateCalculator();
  }

  let currentStorageMode = 'card'; // 'card' hoặc 'nvr'

  function getTotalCamCount() {
    return Object.values(camQuantities).reduce((acc, q) => acc + q, 0);
  }

  function getTotalCamPrice() {
    return Object.entries(camQuantities).reduce((acc, [id, q]) => {
      return acc + (q * (CAMERAS_DATA[id]?.price || 0));
    }, 0);
  }

  // Tính số ngày lưu 24/7 theo dung lượng ổ cứng và số camera (chuẩn H.265 ~20GB/ngày/mắt)
  function calc247Days(hddGB, qty) {
    const q = Math.max(1, qty);
    return Math.max(1, Math.floor(hddGB / (q * 20)));
  }

  // Cập nhật nhãn tư vấn ngày lưu trên các thẻ ổ cứng
  function updateHddLiveLabels() {
    const totalCount = getTotalCamCount();
    const d500 = calc247Days(500, totalCount);
    const d1000 = calc247Days(1000, totalCount);
    const d2000 = calc247Days(2000, totalCount);
    const d4000 = calc247Days(4000, totalCount);

    if (days500GB) days500GB.textContent = `Lưu 24/7 ~${d500} ngày`;
    if (days1000GB) days1000GB.textContent = `Lưu 24/7 ~${d1000} ngày`;
    if (days2000GB) days2000GB.textContent = `Lưu 24/7 ~${d2000} ngày`;
    if (days4000GB) days4000GB.textContent = `Lưu 24/7 ~${d4000} ngày`;
  }

  function updateCardUI(id) {
    const card = document.querySelector(`.calc-cam-card[data-id="${id}"]`);
    if (!card) return;
    const qty = camQuantities[id] || 0;
    const badge = card.querySelector('.calc-cam-qty-badge');
    const addBtn = card.querySelector('.cam-add-btn');
    const stepper = card.querySelector('.cam-stepper');
    const qtyVal = card.querySelector('.cam-stepper-val');

    if (qty > 0) {
      card.classList.add('selected');
      if (badge) {
        badge.textContent = qty;
        badge.style.display = 'flex';
      }
      if (addBtn) addBtn.style.display = 'none';
      if (stepper) stepper.style.display = 'flex';
      if (qtyVal) qtyVal.textContent = qty;
    } else {
      card.classList.remove('selected');
      if (badge) badge.style.display = 'none';
      if (addBtn) addBtn.style.display = 'flex';
      if (stepper) stepper.style.display = 'none';
      if (qtyVal) qtyVal.textContent = '0';
    }
  }

  function setCameraQty(id, qty) {
    qty = Math.max(0, Math.min(16, qty));
    camQuantities[id] = qty;
    updateCardUI(id);
    updateCalculator();
  }

  function changeCameraQty(id, delta) {
    const cur = camQuantities[id] || 0;
    setCameraQty(id, cur + delta);
  }

  function setStorageMode(mode) {
    currentStorageMode = mode;
    if (mode === 'card') {
      if (tabModeCard) tabModeCard.classList.add('active');
      if (tabModeNVR) tabModeNVR.classList.remove('active');
      if (storageCardsGroup) storageCardsGroup.style.display = 'block';
      if (storageNVRGroup) storageNVRGroup.style.display = 'none';

      calcNvr.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });
      calcHdd.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });

      // Mặc định chọn Thẻ 64GB
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
      if (tabModeCard) tabModeCard.classList.remove('active');
      if (tabModeNVR) tabModeNVR.classList.add('active');
      if (storageCardsGroup) storageCardsGroup.style.display = 'none';
      if (storageNVRGroup) storageNVRGroup.style.display = 'block';

      // Bỏ chọn thẻ nhớ
      calcStorage.forEach(r => {
        r.checked = false;
        r.closest('.calc-option')?.classList.remove('selected');
      });

      // Chọn NVR mặc định (IMOU 10 kênh)
      let hasNvr = false;
      calcNvr.forEach(r => {
        if (r.checked) hasNvr = true;
      });
      if (!hasNvr && calcNvr.length > 0) {
        const nvrFirst = calcNvr[0];
        nvrFirst.checked = true;
        nvrFirst.closest('.calc-option')?.classList.add('selected');
      }

      // Chọn HDD mặc định (1TB)
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

  if (tabModeCard) {
    tabModeCard.addEventListener('click', () => setStorageMode('card'));
  }
  if (tabModeNVR) {
    tabModeNVR.addEventListener('click', () => setStorageMode('nvr'));
  }
  if (btnRecSwitchNvr) {
    btnRecSwitchNvr.addEventListener('click', () => setStorageMode('nvr'));
  }
  if (previewSwitchNvrBtn) {
    previewSwitchNvrBtn.addEventListener('click', () => {
      setStorageMode('nvr');
      const step3 = document.getElementById('storageNVRGroup') || document.getElementById('tabModeNVR');
      if (step3) {
        step3.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }

  // Tương tác radio Thẻ nhớ
  calcStorage.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        currentStorageMode = 'card';
        if (tabModeCard) tabModeCard.classList.add('active');
        if (tabModeNVR) tabModeNVR.classList.remove('active');
        if (storageCardsGroup) storageCardsGroup.style.display = 'block';
        if (storageNVRGroup) storageNVRGroup.style.display = 'none';

        calcNvr.forEach(r => {
          r.checked = false;
          r.closest('.calc-option')?.classList.remove('selected');
        });
        calcHdd.forEach(r => {
          r.checked = false;
          r.closest('.calc-option')?.classList.remove('selected');
        });
        updateCalculator();
      }
    });
  });

  // Tương tác radio Đầu ghi NVR
  calcNvr.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        currentStorageMode = 'nvr';
        if (tabModeCard) tabModeCard.classList.remove('active');
        if (tabModeNVR) tabModeNVR.classList.add('active');
        if (storageCardsGroup) storageCardsGroup.style.display = 'none';
        if (storageNVRGroup) storageNVRGroup.style.display = 'block';

        calcStorage.forEach(r => {
          r.checked = false;
          r.closest('.calc-option')?.classList.remove('selected');
        });

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
      }
    });
  });

  // Tương tác radio Ổ cứng HDD
  calcHdd.forEach(radio => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        currentStorageMode = 'nvr';
        if (tabModeCard) tabModeCard.classList.remove('active');
        if (tabModeNVR) tabModeNVR.classList.add('active');
        if (storageCardsGroup) storageCardsGroup.style.display = 'none';
        if (storageNVRGroup) storageNVRGroup.style.display = 'block';

        calcStorage.forEach(r => {
          r.checked = false;
          r.closest('.calc-option')?.classList.remove('selected');
        });

        let hasNvr = false;
        calcNvr.forEach(r => { if (r.checked) hasNvr = true; });
        if (!hasNvr && calcNvr.length > 0) {
          const nvrFirst = calcNvr[0];
          nvrFirst.checked = true;
          nvrFirst.closest('.calc-option')?.classList.add('selected');
        }
        updateCalculator();
      }
    });
  });

  function updateCalculator() {
    const totalCamCount = getTotalCamCount();
    const totalCamPrice = getTotalCamPrice();

    // 1. Phân loại và tóm tắt số mắt trong nhà & ngoài trời
    let indoorCount = 0;
    let outdoorCount = 0;
    const selectedCams = [];

    Object.entries(camQuantities).forEach(([id, q]) => {
      if (q > 0) {
        const data = CAMERAS_DATA[id];
        if (data.type === 'indoor') indoorCount += q;
        else outdoorCount += q;
        selectedCams.push({ id, q, data });
      }
    });

    let breakdownShort = '';
    if (indoorCount > 0 && outdoorCount > 0) {
      breakdownShort = `${indoorCount} Trong Nhà + ${outdoorCount} Ngoài Trời`;
    } else if (indoorCount > 0) {
      breakdownShort = `${indoorCount} Trong Nhà`;
    } else if (outdoorCount > 0) {
      breakdownShort = `${outdoorCount} Ngoài Trời`;
    } else {
      breakdownShort = 'Chưa chọn camera';
    }

    // Cập nhật danh sách camera chi tiết trong Summary Box
    if (summaryCamList) {
      if (selectedCams.length === 0) {
        summaryCamList.innerHTML = `<div style="font-size: 0.74rem; color: #DC2626; padding: 4px 0; font-weight: 600;">Vui lòng chọn ít nhất 1 camera ở Bước 1!</div>`;
      } else {
        summaryCamList.innerHTML = selectedCams.map(item => {
          const itemSubtotal = item.q * item.data.price;
          return `<div class="summary-cam-item">
            <span>${item.q}x ${item.data.shortName} (${formatVND(item.data.price)})</span>
            <strong>${formatVND(itemSubtotal)}</strong>
          </div>`;
        }).join('');
      }
    }

    if (summaryTotalCamCount) summaryTotalCamCount.textContent = totalCamCount;
    if (summaryCamPrice) summaryCamPrice.textContent = formatVND(totalCamPrice);

    // 2. Storage Mode Calculation
    let totalStorage = 0;
    let storageChipText = '';

    if (currentStorageMode === 'card') {
      let selectedCardPrice = 320000;
      let selectedCardLabel = 'Thẻ nhớ 64GB';
      calcStorage.forEach(radio => {
        if (radio.checked) {
          selectedCardPrice = parseInt(radio.value, 10);
          selectedCardLabel = radio.getAttribute('data-label') || selectedCardLabel;
        }
      });

      document.querySelectorAll('.storage-card-option').forEach(opt => {
        const input = opt.querySelector('input');
        if (input.checked) opt.classList.add('selected');
        else opt.classList.remove('selected');
      });

      totalStorage = totalCamCount > 0 ? (selectedCardPrice * totalCamCount) : 0;
      storageChipText = totalCamCount > 0 ? `${totalCamCount}x ${selectedCardLabel}` : 'Thẻ nhớ';

      if (lineSummaryCard) lineSummaryCard.style.display = 'flex';
      if (lineSummaryNVR) lineSummaryNVR.style.display = 'none';
      if (lineSummaryHDD) lineSummaryHDD.style.display = 'none';
      if (summaryStoragePrice) {
        summaryStoragePrice.textContent = totalCamCount > 0 ? `${formatVND(totalStorage)} (${totalCamCount} thẻ)` : '0 đ';
      }
    } else {
      // Mode NVR + HDD
      let selectedNvrPrice = 1235000;
      calcNvr.forEach(radio => {
        if (radio.checked) {
          selectedNvrPrice = parseInt(radio.value, 10);
        }
      });

      document.querySelectorAll('.nvr-brand-option').forEach(opt => {
        const input = opt.querySelector('input');
        if (input.checked) opt.classList.add('selected');
        else opt.classList.remove('selected');
      });

      let selectedHddPrice = 850000;
      let selectedHddGB = 1000;
      calcHdd.forEach(radio => {
        if (radio.checked) {
          selectedHddPrice = parseInt(radio.value, 10);
          selectedHddGB = parseInt(radio.getAttribute('data-gb'), 10) || 1000;
        }
      });

      document.querySelectorAll('.hdd-option, .nvr-hdd-option').forEach(opt => {
        const input = opt.querySelector('input');
        if (input && input.checked) opt.classList.add('selected');
        else opt.classList.remove('selected');
      });

      const days247 = calc247Days(selectedHddGB, totalCamCount);
      totalStorage = totalCamCount > 0 ? (selectedNvrPrice + selectedHddPrice) : 0;
      storageChipText = `NVR + Ổ ${selectedHddGB}GB (~${days247} ngày)`;

      // Cập nhật advisory box
      if (advisoryCamCount) advisoryCamCount.textContent = totalCamCount;
      if (advisoryHddCap) advisoryHddCap.textContent = `${selectedHddGB}GB`;
      if (advisoryDays) advisoryDays.textContent = `~${days247} ngày`;

      if (lineSummaryCard) lineSummaryCard.style.display = 'none';
      if (lineSummaryNVR) lineSummaryNVR.style.display = 'flex';
      if (lineSummaryHDD) lineSummaryHDD.style.display = 'flex';

      if (summaryNvrPrice) summaryNvrPrice.textContent = formatVND(selectedNvrPrice);
      if (summaryHddPrice) summaryHddPrice.textContent = `${formatVND(selectedHddPrice)} (Lưu 24/7 ~${days247} ngày)`;
    }

    updateHddLiveLabels();

    // 3. Installation
    let installPricePerCam = 200000;
    let isSelfInstall = false;

    calcInstall.forEach(radio => {
      if (radio.checked) {
        installPricePerCam = parseInt(radio.value, 10);
        if (installPricePerCam === 0) {
          isSelfInstall = true;
        }
      }
    });

    document.querySelectorAll('.install-option').forEach(opt => {
      const input = opt.querySelector('input');
      if (input && input.checked) opt.classList.add('selected');
      else opt.classList.remove('selected');
    });

    const totalInstall = (isSelfInstall || totalCamCount === 0) ? 0 : (installPricePerCam * totalCamCount);

    if (summaryInstallPrice) {
      if (totalCamCount === 0) {
        summaryInstallPrice.textContent = '0 đ';
      } else {
        summaryInstallPrice.textContent = isSelfInstall ? '0 đ (Tự lắp)' : `${formatVND(totalInstall)} (${totalCamCount} mắt)`;
      }
    }

    // 3.5. Tính toán & hiển thị thiết bị chọn thêm từ gian hàng
    const totalCustomPrice = customProducts.reduce((acc, item) => acc + (item.qty * item.retailPrice), 0);
    const totalCustomCount = customProducts.reduce((acc, item) => acc + item.qty, 0);

    if (summaryCustomSection) {
      if (totalCustomCount > 0) {
        summaryCustomSection.style.display = 'block';
        if (summaryCustomCount) summaryCustomCount.textContent = totalCustomCount;
        if (summaryCustomPrice) summaryCustomPrice.textContent = formatVND(totalCustomPrice);

        if (summaryCustomList) {
          summaryCustomList.innerHTML = customProducts.map(item => `
            <div class="summary-custom-item">
              <div class="sci-info">
                <div class="sci-name" title="${item.name}">${item.name}</div>
                <div class="sci-price-row">
                  <span class="sci-unit-price">${formatVND(item.retailPrice)}</span>
                  ${item.sku ? `<span class="sci-sku">${item.sku}</span>` : ''}
                </div>
              </div>
              <div class="sci-actions">
                <div class="sci-stepper">
                  <button type="button" class="sci-btn minus" data-id="${item.id}" aria-label="Giảm">−</button>
                  <span class="sci-qty">${item.qty}</span>
                  <button type="button" class="sci-btn plus" data-id="${item.id}" aria-label="Tăng">+</button>
                </div>
                <div class="sci-subtotal">${formatVND(item.qty * item.retailPrice)}</div>
                <button type="button" class="sci-remove-btn" data-id="${item.id}" title="Xóa thiết bị này">✕</button>
              </div>
            </div>
          `).join('');

          summaryCustomList.querySelectorAll('.sci-btn.minus').forEach(b => {
            b.addEventListener('click', (e) => {
              e.stopPropagation();
              const id = parseInt(b.getAttribute('data-id'), 10);
              if (id) changeCatalogProductQty(id, -1);
            });
          });
          summaryCustomList.querySelectorAll('.sci-btn.plus').forEach(b => {
            b.addEventListener('click', (e) => {
              e.stopPropagation();
              const id = parseInt(b.getAttribute('data-id'), 10);
              if (id) changeCatalogProductQty(id, 1);
            });
          });
          summaryCustomList.querySelectorAll('.sci-remove-btn').forEach(b => {
            b.addEventListener('click', (e) => {
              e.stopPropagation();
              const id = parseInt(b.getAttribute('data-id'), 10);
              if (id) removeCatalogProductFromCalc(id);
            });
          });
        }
      } else {
        summaryCustomSection.style.display = 'none';
        if (summaryCustomList) summaryCustomList.innerHTML = '';
      }
    }

    // 4. Totals (Camera Package + Thiết Bị Gian Hàng)
    const packageTotal = totalCamCount > 0 ? (totalCamPrice + totalStorage + totalInstall) : 0;
    const grandTotal = packageTotal + totalCustomPrice;
    const formattedGrandTotal = formatVND(grandTotal);

    if (summaryTotalPrice) summaryTotalPrice.textContent = formattedGrandTotal;
    if (calcLiveTotalPrice) calcLiveTotalPrice.textContent = formattedGrandTotal;

    // 5. Cập nhật thẻ Live Preview đầu bảng tính
    const primaryCam = selectedCams[0]?.data || CAMERAS_DATA['imou-ranger-2'];

    if (calcPreviewImg) {
      if (totalCamCount > 0) {
        calcPreviewImg.src = primaryCam.img;
      } else if (customProducts.length > 0 && customProducts[0].image) {
        calcPreviewImg.src = customProducts[0].image;
      } else {
        calcPreviewImg.src = primaryCam.img;
      }
    }

    if (totalCamCount === 0 && totalCustomCount === 0) {
      if (calcPreviewBadge) calcPreviewBadge.textContent = 'CHƯA CHỌN THIẾT BỊ';
      if (calcPreviewName) calcPreviewName.textContent = 'Vui lòng chọn camera hoặc thiết bị từ gian hàng';
      if (calcPreviewSpecs) {
        calcPreviewSpecs.innerHTML = `<span class="preview-chip" style="background:#FEE2E2;color:#DC2626;border-color:#FECACA;">Chưa có thiết bị nào trong gói</span>`;
      }
    } else if (totalCamCount === 0 && totalCustomCount > 0) {
      if (calcPreviewBadge) calcPreviewBadge.textContent = `THIẾT BỊ TỰ CHỌN (${totalCustomCount} MÓN)`;
      if (calcPreviewName) {
        calcPreviewName.textContent = customProducts.map(p => p.sku || p.name).slice(0, 2).join(' + ') + (customProducts.length > 2 ? ' ...' : '');
      }
      if (calcPreviewSpecs) {
        const prodChips = customProducts.slice(0, 3).map(c => `<span class="preview-chip">${c.qty}x ${c.sku || c.name}</span>`);
        if (customProducts.length > 3) {
          prodChips.push(`<span class="preview-chip">+${customProducts.length - 3} món khác</span>`);
        }
        calcPreviewSpecs.innerHTML = prodChips.join('');
      }
    } else {
      if (calcPreviewBadge) {
        if (selectedCams.length === 1 && totalCustomCount === 0) {
          calcPreviewBadge.textContent = selectedCams[0].data.badge;
        } else if (totalCustomCount > 0) {
          calcPreviewBadge.textContent = `GÓI CAMERA (${totalCamCount} MẮT) + ${totalCustomCount} THIẾT BỊ`;
        } else {
          calcPreviewBadge.textContent = `GÓI LẮP ĐẶT (${totalCamCount} MẮT)`;
        }
      }

      if (calcPreviewName) {
        let nameDesc = `${totalCamCount} Mắt: ${breakdownShort}`;
        if (totalCustomCount > 0) {
          nameDesc += ` (+ ${totalCustomCount} thiết bị gian hàng)`;
        }
        calcPreviewName.textContent = nameDesc;
      }

      if (calcPreviewSpecs) {
        const camChips = selectedCams.map(c => `<span class="preview-chip">${c.q}x ${c.data.shortName}</span>`);
        const otherChips = [
          `<span class="preview-chip">${storageChipText}</span>`,
          `<span class="preview-chip">${isSelfInstall ? 'Tự lắp đặt (0đ)' : `Công lắp ${totalCamCount} mắt`}</span>`
        ];
        if (totalCustomCount > 0) {
          otherChips.push(`<span class="preview-chip" style="background:#ECFDF5;color:#059669;border-color:#A7F3D0;font-weight:700;">+ ${totalCustomCount} thiết bị gian hàng</span>`);
        }
        calcPreviewSpecs.innerHTML = [...camChips, ...otherChips].join('');
      }
    }

    // 6. Cập nhật Mobile Sticky Bar
    if (cmsbCamImg) {
      if (totalCamCount > 0) cmsbCamImg.src = primaryCam.img;
      else if (customProducts.length > 0 && customProducts[0].image) cmsbCamImg.src = customProducts[0].image;
      else cmsbCamImg.src = primaryCam.img;
    }
    if (cmsbCamName) {
      let mobileTitle = '';
      if (totalCamCount > 0) mobileTitle += `${totalCamCount} Cam (${breakdownShort})`;
      if (totalCustomCount > 0) mobileTitle += `${mobileTitle ? ' + ' : ''}${totalCustomCount} Thiết bị`;
      cmsbCamName.textContent = mobileTitle || 'Chưa chọn thiết bị';
    }
    if (cmsbTotalPrice) cmsbTotalPrice.textContent = formattedGrandTotal;

    // 7. Lời khuyên chọn Đầu Ghi & Ổ Cứng khi chọn >= 3 camera bất kỳ
    if (totalCamCount >= 3) {
      if (recTabBadge) recTabBadge.style.display = 'inline-block';

      if (currentStorageMode === 'card') {
        if (storageNvrRecommendBox) {
          storageNvrRecommendBox.style.display = 'block';
          storageNvrRecommendBox.classList.remove('applied-nvr');
        }
        if (recCamCount) recCamCount.textContent = totalCamCount;
        if (recBadgeChip) recBadgeChip.textContent = 'KHUYÊN DÙNG';
        if (recBoxDesc) {
          recBoxDesc.innerHTML = `Với hệ thống từ <strong>${totalCamCount} camera</strong> trở lên, bạn nên chọn <strong>Đầu Ghi &amp; Ổ Cứng 24/7</strong> để hệ thống chuyên nghiệp, xem trực tiếp trên TV, lưu trữ liên tục nhiều ngày và tối ưu chi phí hơn so với mua nhiều thẻ nhớ riêng lẻ.`;
        }
        if (btnRecSwitchNvr) btnRecSwitchNvr.style.display = 'inline-flex';

        if (previewRecHint) previewRecHint.style.display = 'flex';
        if (previewRecCamCount) previewRecCamCount.textContent = totalCamCount;
      } else {
        // Đã chọn sang mode NVR
        if (storageNvrRecommendBox) {
          storageNvrRecommendBox.style.display = 'block';
          storageNvrRecommendBox.classList.add('applied-nvr');
        }
        if (recCamCount) recCamCount.textContent = totalCamCount;
        if (recBadgeChip) recBadgeChip.textContent = 'ĐÃ CHỌN TỐI ƯU';
        if (recBoxDesc) {
          recBoxDesc.innerHTML = `✅ <strong>Lựa chọn tối ưu:</strong> Hệ thống <strong>${totalCamCount} camera</strong> đang dùng <strong>Đầu Ghi &amp; Ổ Cứng 24/7</strong> chuyên nghiệp, hỗ trợ xem trực tiếp trên TV và lưu trữ liên tục bền bỉ.`;
        }
        if (btnRecSwitchNvr) btnRecSwitchNvr.style.display = 'none';

        if (previewRecHint) previewRecHint.style.display = 'none';
      }
    } else {
      if (storageNvrRecommendBox) storageNvrRecommendBox.style.display = 'none';
      if (recTabBadge) recTabBadge.style.display = 'none';
      if (previewRecHint) previewRecHint.style.display = 'none';
    }
  }

  // Lắng nghe sự kiện tăng/giảm số lượng camera trên từng thẻ
  document.querySelectorAll('.cam-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (id) setCameraQty(id, 1);
    });
  });

  document.querySelectorAll('.cam-stepper-btn.minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (id) changeCameraQty(id, -1);
    });
  });

  document.querySelectorAll('.cam-stepper-btn.plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      if (id) changeCameraQty(id, 1);
    });
  });

  // Chạm vào thẻ camera: nếu chưa chọn thì thêm 1 mắt
  document.querySelectorAll('.calc-cam-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.cam-stepper-btn') || e.target.closest('.cam-add-btn') || e.target.closest('.cam-detail-btn')) return;
      const id = card.getAttribute('data-id');
      if (id) {
        const cur = camQuantities[id] || 0;
        if (cur === 0) {
          setCameraQty(id, 1);
        }
      }
    });
  });

  // Lắng nghe sự kiện click nút "Xem chi tiết" trên từng thẻ camera
  const CAM_MODAL_MAP = {
    'imou-cue-2c': 'imou-cue-2c',
    'imou-ranger-2': 'imou-ranger-2mp',
    'ezviz-c6n': 'ezviz-c6n',
    'imou-bullet-2c': 'imou-bullet-2c',
    'imou-cruiser-2': 'imou-cruiser-2',
    'solar-4g': 'solar-4g'
  };

  document.querySelectorAll('.cam-detail-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const prodId = CAM_MODAL_MAP[id] || id;
      openProductModal(prodId);
    });
  });

  // Lắng nghe thay đổi gói lắp đặt
  calcInstall.forEach(radio => {
    radio.addEventListener('change', updateCalculator);
    radio.addEventListener('click', updateCalculator);
  });
  document.querySelectorAll('.install-option').forEach(label => {
    label.addEventListener('click', () => {
      setTimeout(updateCalculator, 10);
    });
  });

  // Hàm cuộn mượt mà xuống Bảng Dự Toán Chi Phí Trọn Gói (Ảnh 3)
  function scrollToSummary() {
    const target = calcSummaryBox || document.querySelector('.calc-summary-box');
    if (!target) return;
    const headerOffset = 75;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
    target.classList.remove('summary-highlight-pulse');
    void target.offsetWidth; // trigger reflow
    target.classList.add('summary-highlight-pulse');
    setTimeout(() => {
      target.classList.remove('summary-highlight-pulse');
    }, 2200);
  }

  if (previewBtnDetail) {
    previewBtnDetail.addEventListener('click', scrollToSummary);
  }
  if (cmsbBtnDetail) {
    cmsbBtnDetail.addEventListener('click', scrollToSummary);
  }
  if (cmsbCamInfo) {
    cmsbCamInfo.addEventListener('click', scrollToSummary);
  }

  // Điều khiển ẩn/hiện Mobile Sticky Live Price Bar khi cuộn qua bảng dự toán
  function handleCalcStickyBarVisibility() {
    if (!calcMobileStickyBar) return;
    if (window.innerWidth > 768) {
      calcMobileStickyBar.classList.remove('visible');
      document.body.classList.remove('has-calc-sticky-visible');
      return;
    }
    const calcSection = document.getElementById('du-toan');
    if (!calcSection) return;
    const rect = calcSection.getBoundingClientRect();

    // Ẩn thanh nổi nếu màn hình đã cuộn tới bảng chi tiết tóm tắt để không che khuất
    const target = calcSummaryBox || document.querySelector('.calc-summary-box');
    let summaryInView = false;
    if (target) {
      const sRect = target.getBoundingClientRect();
      summaryInView = (sRect.top <= window.innerHeight - 100) && (sRect.bottom >= 120);
    }

    const inView = (rect.top <= window.innerHeight * 0.75) && (rect.bottom >= 140) && !summaryInView;
    calcMobileStickyBar.classList.toggle('visible', inView);
    document.body.classList.toggle('has-calc-sticky-visible', inView);
  }

  window.addEventListener('scroll', handleCalcStickyBarVisibility, { passive: true });
  window.addEventListener('resize', handleCalcStickyBarVisibility, { passive: true });

  // Khởi tạo trạng thái ban đầu cho các thẻ camera & kho sản phẩm
  Object.keys(camQuantities).forEach(id => updateCardUI(id));

  // Lắng nghe sự kiện chuyển Tab dự toán
  if (tabCalcPackage) tabCalcPackage.addEventListener('click', () => switchCalcTab('package'));
  if (tabCalcCatalog) tabCalcCatalog.addEventListener('click', () => switchCalcTab('catalog'));

  // Lọc Danh Mục trên Tab 2
  if (calcCatPillsBar) {
    calcCatPillsBar.querySelectorAll('.calc-cat-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        calcCatPillsBar.querySelectorAll('.calc-cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        catFilter = pill.getAttribute('data-cat') || 'all';
        renderCalcCatalog(true);
      });
    });
  }

  // Tìm kiếm sản phẩm trên Tab 2
  if (calcCatSearchInput) {
    let searchDebounce = null;
    calcCatSearchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        catSearchQuery = calcCatSearchInput.value.trim();
        if (calcCatClearBtn) {
          calcCatClearBtn.style.display = catSearchQuery ? 'flex' : 'none';
        }
        renderCalcCatalog(true);
      }, 150);
    });
  }

  if (calcCatClearBtn) {
    calcCatClearBtn.addEventListener('click', () => {
      if (calcCatSearchInput) calcCatSearchInput.value = '';
      catSearchQuery = '';
      calcCatClearBtn.style.display = 'none';
      renderCalcCatalog(true);
      if (calcCatSearchInput) calcCatSearchInput.focus();
    });
  }

  if (btnCalcCatLoadMore) {
    btnCalcCatLoadMore.addEventListener('click', () => {
      catPage += 1;
      renderCalcCatalog(false);
    });
  }

  // Render kho sản phẩm Tab 2 và cập nhật bảng tính
  renderCalcCatalog();
  updateCalculator();

  // Xử lý gửi trọn gói dự toán sang tin nhắn Zalo kèm cấu hình chi tiết khách chọn
  function handleBookPackageZalo() {
    const totalCount = getTotalCamCount();
    const totalCustomCount = customProducts.reduce((acc, item) => acc + item.qty, 0);

    if (totalCount === 0 && totalCustomCount === 0) {
      alert('Vui lòng chọn ít nhất 1 mắt camera hoặc 1 thiết bị từ gian hàng để tính dự toán và đặt lịch!');
      return;
    }

    let sections = [];

    if (totalCount > 0) {
      const camLines = [];
      let totalCamPriceCalc = 0;
      Object.entries(camQuantities).forEach(([id, q]) => {
        if (q > 0) {
          const cam = CAMERAS_DATA[id];
          const subtotal = q * cam.price;
          totalCamPriceCalc += subtotal;
          camLines.push(`• ${q}x ${cam.fullName || cam.name} (${formatVND(cam.price)}/mắt) = ${formatVND(subtotal)}`);
        }
      });

      let storageLine = '';
      if (currentStorageMode === 'card') {
        const cardRadio = document.querySelector('input[name="calc_storage"]:checked');
        const cardPrice = cardRadio ? parseInt(cardRadio.value, 10) : 320000;
        const cardLbl = cardRadio ? cardRadio.getAttribute('data-label') : 'Thẻ nhớ 64GB';
        const totalCardPrice = cardPrice * totalCount;
        storageLine = `• Thẻ nhớ MicroSD: ${totalCount}x ${cardLbl} (${formatVND(cardPrice)}/thẻ) = ${formatVND(totalCardPrice)}`;
      } else {
        const nvrRadio = document.querySelector('input[name="calc_nvr"]:checked');
        const hddRadio = document.querySelector('input[name="calc_hdd"]:checked');
        const nvrLbl = nvrRadio ? nvrRadio.getAttribute('data-label') : 'Đầu ghi NVR';
        const nvrPrice = nvrRadio ? parseInt(nvrRadio.value, 10) : 1235000;
        const hddLbl = hddRadio ? hddRadio.getAttribute('data-label') : 'Ổ cứng 500GB';
        const hddPrice = hddRadio ? parseInt(hddRadio.value, 10) : 850000;
        const hddGB = hddRadio ? hddRadio.getAttribute('data-gb') : '500';
        const days = calc247Days(parseInt(hddGB, 10), totalCount);
        storageLine = `• Đầu ghi hình: ${nvrLbl} (${formatVND(nvrPrice)})\n• Ổ cứng chuyên dụng 24/7: ${hddLbl} (${formatVND(hddPrice)} - Lưu liên tục ~${days} ngày)`;
      }

      const installRadio = document.querySelector('input[name="calc_install"]:checked');
      const isSelf = installRadio && parseInt(installRadio.value, 10) === 0;
      let installLine = '';
      if (isSelf) {
        installLine = '• Dịch vụ: Tự lắp đặt tại nhà (Chu Gia hỗ trợ cài đặt đồng bộ sẵn, 0 đ)';
      } else {
        const installTotal = 200000 * totalCount;
        installLine = `• Dịch vụ: Trọn gói lắp đặt thẩm mỹ tận nhà ${totalCount} mắt (200k/mắt) = ${formatVND(installTotal)}\n  (Bao gồm: Công thợ thẩm mỹ, hộp kỹ thuật, nẹp dây, nguồn nối dài & bảo hành tận nơi 24 tháng)`;
      }

      sections.push(
`📸 1. CAMERA ĐÃ CHỌN (${totalCount} MẮT):
${camLines.join('\n')}
👉 Tiền camera: ${summaryCamPrice ? summaryCamPrice.textContent : formatVND(totalCamPriceCalc)}

💾 2. PHƯƠNG THỨC LƯU TRỮ:
${storageLine}

🛠️ 3. GÓI DỊCH VỤ LẮP ĐẶT:
${installLine}`
      );
    }

    if (totalCustomCount > 0) {
      const totalCustomPrice = customProducts.reduce((acc, item) => acc + (item.qty * item.retailPrice), 0);
      const customLines = customProducts.map(item => `• ${item.qty}x ${item.name} (${item.sku ? `Mã: ${item.sku} - ` : ''}${formatVND(item.retailPrice)}/món) = ${formatVND(item.qty * item.retailPrice)}`);
      const secNum = totalCount > 0 ? '4' : '1';
      sections.push(
`📦 ${secNum}. THIẾT BỊ CHỌN THÊM TỪ GIAN HÀNG (${totalCustomCount} SẢN PHẨM):
${customLines.join('\n')}
👉 Tiền thiết bị gian hàng: ${formatVND(totalCustomPrice)}`
      );
    }

    const grandTotalText = summaryTotalPrice ? summaryTotalPrice.textContent : '';

    const zaloMsg = 
`Xin chào Chu Gia Security! Tôi muốn đặt lịch tư vấn & báo giá theo dự toán trên website:

${sections.join('\n\n')}

💰 TỔNG DỰ KIẾN TRỌN GÓI: ${grandTotalText}

Nhờ Chu Gia liên hệ tư vấn và xác nhận đơn hàng sớm giúp tôi nhé. Cảm ơn!`;

    // Tự động sao chép nội dung gói dự toán vào clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(zaloMsg).catch(() => {});
    }

    showToast('Đang mở Zalo kết nối với Chu Gia Security... Đã sao chép cấu hình gói!');

    const zaloUrl = `https://zalo.me/0941204125?text=${encodeURIComponent(zaloMsg)}`;
    window.open(zaloUrl, '_blank');
  }

  if (btnBookCalc) {
    btnBookCalc.addEventListener('click', handleBookPackageZalo);
  }
  if (calcPreviewCta) {
    calcPreviewCta.addEventListener('click', handleBookPackageZalo);
  }
  if (cmsbBtnBook) {
    cmsbBtnBook.addEventListener('click', handleBookPackageZalo);
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

  // ---------------- HERO SHOWCASE SLIDER (IMOU STYLE) ----------------
  const heroCarousel = document.getElementById('heroCarousel');
  const heroProgressNav = document.getElementById('heroProgressNav');
  const heroCarouselSlides = document.querySelectorAll('.hero-carousel-slide');
  const heroProgressItems = document.querySelectorAll('.hero-progress-item');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  let currentHeroSlide = 0;
  let heroSlideTimer = null;
  const HERO_SLIDE_DURATION = 5500;
  let isHeroVisible = true;

  function setHeroSlide(index) {
    if (!heroCarouselSlides.length) return;
    currentHeroSlide = (index + heroCarouselSlides.length) % heroCarouselSlides.length;

    heroCarouselSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentHeroSlide);
    });

    heroProgressItems.forEach((item, i) => {
      const isActive = (i === currentHeroSlide);
      item.classList.toggle('active', isActive);
      const fill = item.querySelector('.progress-bar-fill');
      if (fill) {
        if (isActive) {
          fill.style.animation = 'none';
          void fill.offsetHeight; // trigger reflow to reset animation
          fill.style.animation = '';
        } else {
          fill.style.animation = 'none';
          fill.style.width = '0%';
        }
      }
      // CHỈ cuộn thanh tab nằm ngang cục bộ, TUYỆT ĐỐI KHÔNG dùng scrollIntoView gây giật cuộn trang window
      if (isActive && heroProgressNav && window.innerWidth <= 768) {
        try {
          const scrollOffset = (item.offsetLeft + item.offsetWidth / 2) - (heroProgressNav.clientWidth / 2);
          heroProgressNav.scrollTo({ left: Math.max(0, scrollOffset), behavior: 'smooth' });
        } catch (err) {}
      }
    });
  }

  function nextHeroSlide() {
    setHeroSlide(currentHeroSlide + 1);
  }

  function prevHeroSlide() {
    setHeroSlide(currentHeroSlide - 1);
  }

  function startHeroTimer() {
    if (!heroCarouselSlides || !heroCarouselSlides.length) return;
    if (heroSlideTimer) clearInterval(heroSlideTimer);
    if (!isHeroVisible) return; // Tạm dừng nếu hero đang nằm ngoài màn hình (user đã cuộn xuống dưới)
    heroSlideTimer = setInterval(() => {
      nextHeroSlide();
    }, HERO_SLIDE_DURATION);
  }

  // Tạm dừng chạy slide khi người dùng cuộn xuống dưới, tự động tiếp tục khi cuộn lại lên đầu
  if ('IntersectionObserver' in window && heroCarousel) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroVisible = entry.isIntersecting;
        if (!isHeroVisible) {
          if (heroSlideTimer) clearInterval(heroSlideTimer);
        } else {
          startHeroTimer();
        }
      });
    }, { threshold: 0.1 });
    heroObserver.observe(heroCarousel);
  }

  function resetHeroTimer() {
    startHeroTimer();
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      nextHeroSlide();
      resetHeroTimer();
    });
  }

  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      prevHeroSlide();
      resetHeroTimer();
    });
  }

  heroProgressItems.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      const targetIdx = parseInt(btn.getAttribute('data-target') || idx, 10);
      setHeroSlide(targetIdx);
      resetHeroTimer();
    });
  });

  if (heroCarousel) {
    heroCarousel.addEventListener('mouseenter', () => {
      if (heroSlideTimer) clearInterval(heroSlideTimer);
      heroCarousel.classList.add('paused');
    });

    heroCarousel.addEventListener('mouseleave', () => {
      heroCarousel.classList.remove('paused');
      startHeroTimer();
    });

    let touchStartX = 0;
    let touchStartY = 0;

    heroCarousel.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches[0]) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    heroCarousel.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches[0]) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY)) {
          if (diffX > 0) {
            nextHeroSlide();
          } else {
            prevHeroSlide();
          }
          resetHeroTimer();
        }
      }
    }, { passive: true });
  }

  setHeroSlide(0);
  startHeroTimer();

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

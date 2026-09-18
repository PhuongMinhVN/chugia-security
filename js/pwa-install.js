/**
 * Chu Gia Technology - Progressive Web App (PWA) Install Manager
 * Hỗ trợ cài đặt PWA trên Android (Chrome, Edge, Samsung Internet...), iOS (Safari) và Desktop
 */

(function () {
  'use strict';

  // 1. Đăng ký Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.log('[PWA] Service Worker registration failed:', err);
        });
    });
  }

  // 2. State & DOM references
  let deferredPrompt = null;
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  function initPwa() {
    const installBtn = document.getElementById('pwaInstallBtn');
    const heroBtn = document.getElementById('pwaHeroBtn');
    const pwaModal = document.getElementById('pwaModal');
    const pwaModalClose = document.getElementById('pwaModalClose');
    const pwaModalActionBtn = document.getElementById('pwaModalActionBtn');
    const pwaIosSteps = document.getElementById('pwaIosSteps');
    const pwaAndroidSteps = document.getElementById('pwaAndroidSteps');

    // Nếu người dùng đã cài đặt và đang mở app dạng Standalone, có thể ẩn nút
    if (isStandalone) {
      if (installBtn) installBtn.style.display = 'none';
      if (heroBtn) heroBtn.style.display = 'none';
      return;
    }

    // Lắng nghe sự kiện beforeinstallprompt (Android / Chrome / Edge)
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      if (installBtn) installBtn.classList.add('pwa-ready');
      if (heroBtn) heroBtn.classList.add('pwa-ready');
      console.log('[PWA] beforeinstallprompt event captured');
    });

    // Lắng nghe khi cài đặt thành công
    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      console.log('[PWA] Application successfully installed');
      const updateSuccessText = (btn) => {
        if (!btn) return;
        btn.innerHTML = '<span>✓ Đã cài app</span>';
        btn.classList.remove('pwa-ready');
        setTimeout(() => {
          btn.style.display = 'none';
        }, 4000);
      };
      updateSuccessText(installBtn);
      updateSuccessText(heroBtn);
      closeModal();
    });

    function openModal() {
      if (!pwaModal) return;
      if (isIos) {
        if (pwaIosSteps) pwaIosSteps.style.display = 'flex';
        if (pwaAndroidSteps) pwaAndroidSteps.style.display = 'none';
      } else {
        if (pwaIosSteps) pwaIosSteps.style.display = 'none';
        if (pwaAndroidSteps) pwaAndroidSteps.style.display = 'flex';
      }
      pwaModal.style.display = 'flex';
      pwaModal.offsetHeight; // force reflow
      pwaModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      if (!pwaModal) return;
      pwaModal.classList.remove('active');
      setTimeout(() => {
        pwaModal.style.display = 'none';
        document.body.style.overflow = '';
      }, 250);
    }

    async function handleInstallClick() {
      if (deferredPrompt) {
        // Trình duyệt hỗ trợ prompt native (Android Chrome, Edge...)
        try {
          deferredPrompt.prompt();
          const choiceResult = await deferredPrompt.userChoice;
          console.log('[PWA] User response to install prompt:', choiceResult.outcome);
          if (choiceResult.outcome === 'accepted') {
            deferredPrompt = null;
          }
        } catch (err) {
          console.warn('[PWA] Error triggering install prompt:', err);
          openModal();
        }
      } else {
        // Trên iOS Safari hoặc khi beforeinstallprompt chưa trigger
        openModal();
      }
    }

    if (installBtn) {
      installBtn.addEventListener('click', handleInstallClick);
    }
    if (heroBtn) {
      heroBtn.addEventListener('click', handleInstallClick);
    }

    if (pwaModalClose) {
      pwaModalClose.addEventListener('click', closeModal);
    }
    if (pwaModalActionBtn) {
      pwaModalActionBtn.addEventListener('click', closeModal);
    }
    if (pwaModal) {
      pwaModal.addEventListener('click', (e) => {
        if (e.target === pwaModal) closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && pwaModal && pwaModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPwa);
  } else {
    initPwa();
  }
})();

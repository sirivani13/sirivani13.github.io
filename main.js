/**
 * Vani Portfolio - Interactive Scripts
 * Handles:
 * 1. Mobile navigation menu toggle
 * 2. Copy email to clipboard with feedback
 * 3. Dynamic certificate PDF detection, local file attachment & viewing
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initCopyEmail();
  initCertificates();
});

/* ==========================================================================
   1. Mobile Navigation
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('active');
  });

  // Close menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on click outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   2. Copy Email to Clipboard
   ========================================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailLink = document.getElementById('emailLink');

  if (!copyBtn || !emailLink) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailLink.textContent.trim();
    const btnText = copyBtn.querySelector('.copy-btn-text');

    try {
      await navigator.clipboard.writeText(email);
      if (btnText) btnText.textContent = 'Copied!';
      copyBtn.classList.add('btn-primary');
      copyBtn.classList.remove('btn-secondary');
      showToast('Email copied to clipboard: ' + email);

      setTimeout(() => {
        if (btnText) btnText.textContent = 'Copy';
        copyBtn.classList.remove('btn-primary');
        copyBtn.classList.add('btn-secondary');
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = email;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      if (btnText) btnText.textContent = 'Copied!';
      showToast('Email copied to clipboard: ' + email);

      setTimeout(() => {
        if (btnText) btnText.textContent = 'Copy';
      }, 2000);
    }
  });
}

/* ==========================================================================
   3. Certificate PDF Management
   ========================================================================== */
function initCertificates() {
  const certCards = document.querySelectorAll('.cert-card');

  certCards.forEach(card => {
    const pdfPath = card.getAttribute('data-pdf-path');
    const viewBtn = card.querySelector('.view-cert-btn');
    const downloadBtn = card.querySelector('.download-cert-btn');
    const fileInput = card.querySelector('.file-input-hidden');
    const statusBox = card.querySelector('.pdf-status-box');

    // 1. Check if the default static PDF file exists on the server / directory
    if (pdfPath) {
      checkPdfAvailability(pdfPath, card, statusBox, viewBtn, downloadBtn);
    }

    // 2. Allow user to attach their local PDF file right inside the browser
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
          showToast('Please select a valid PDF file.');
          return;
        }

        // Create object URL for local preview and download
        const objectUrl = URL.createObjectURL(file);

        // Update card buttons
        if (viewBtn) {
          viewBtn.href = objectUrl;
          viewBtn.classList.remove('disabled');
          viewBtn.removeAttribute('aria-disabled');
          viewBtn.setAttribute('title', 'View ' + file.name + ' in new tab');
        }

        if (downloadBtn) {
          downloadBtn.href = objectUrl;
          downloadBtn.setAttribute('download', file.name);
          downloadBtn.classList.remove('disabled');
          downloadBtn.removeAttribute('aria-disabled');
        }

        // Update status box UI
        if (statusBox) {
          const fileSizeKb = Math.round(file.size / 1024);
          statusBox.innerHTML = `
            <div class="ready-msg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <div>
                <strong style="color: var(--text-main);">PDF Attached:</strong> 
                <span class="file-name-preview">${escapeHtml(file.name)}</span> (${fileSizeKb} KB)
              </div>
            </div>
          `;
          statusBox.style.borderColor = 'var(--lavender-border)';
          statusBox.style.backgroundColor = 'rgba(184, 165, 254, 0.05)';
        }

        showToast(`Attached: ${file.name}. Click "View Certificate" to open.`);
      });
    }
  });
}

/**
 * Checks if the configured PDF path exists on the server.
 * If running via HTTP/HTTPS, performs a HEAD/GET request.
 */
function checkPdfAvailability(pdfPath, card, statusBox, viewBtn, downloadBtn) {
  // If loaded via file:// protocol, network fetch is restricted by browser security
  if (window.location.protocol === 'file:') {
    // Keep placeholder state and inform user they can attach or serve via localhost
    setPlaceholderState(statusBox, viewBtn, downloadBtn);
    return;
  }

  fetch(pdfPath, { method: 'HEAD' })
    .then(response => {
      if (response.ok) {
        // PDF exists on the server!
        setAvailableState(pdfPath, statusBox, viewBtn, downloadBtn);
      } else {
        setPlaceholderState(statusBox, viewBtn, downloadBtn);
      }
    })
    .catch(() => {
      setPlaceholderState(statusBox, viewBtn, downloadBtn);
    });
}

function setAvailableState(pdfPath, statusBox, viewBtn, downloadBtn) {
  const fileName = pdfPath.split('/').pop();

  if (viewBtn) {
    viewBtn.href = pdfPath;
    viewBtn.classList.remove('disabled');
    viewBtn.removeAttribute('aria-disabled');
  }

  if (downloadBtn) {
    downloadBtn.href = pdfPath;
    downloadBtn.classList.remove('disabled');
    downloadBtn.removeAttribute('aria-disabled');
  }

  if (statusBox) {
    statusBox.innerHTML = `
      <div class="ready-msg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <div>
          <span style="color: var(--text-main); font-weight: 500;">Certificate PDF available:</span>
          <span class="file-name-preview">${escapeHtml(fileName)}</span>
        </div>
      </div>
    `;
    statusBox.style.borderColor = 'var(--border-medium)';
  }
}

function setPlaceholderState(statusBox, viewBtn, downloadBtn) {
  if (viewBtn) {
    viewBtn.classList.add('disabled');
    viewBtn.setAttribute('aria-disabled', 'true');
  }

  if (downloadBtn) {
    downloadBtn.classList.add('disabled');
    downloadBtn.setAttribute('aria-disabled', 'true');
  }

  if (statusBox) {
    statusBox.innerHTML = `
      <div class="placeholder-msg">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
        <span class="status-text">Certificate PDF not added yet.</span>
      </div>
    `;
  }
}

/* ==========================================================================
   Notification Toast
   ========================================================================== */
function showToast(message) {
  let toast = document.querySelector('.toast-msg');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-msg';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

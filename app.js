/* ==========================================================================
   Jespar Naturals — Master Consultation Survey Logic & Google Sheets Auto-Sync
   ========================================================================== */

let GOOGLE_SHEET_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby-gzken8_mcB-2ax5_d5mTF2Wy-5TFyHPPkHZAcizSd4eIzfWGXC2HU_wyyPwDSHjy5Q/exec';
let surveyData = {
  age: '',
  environment: '',
  concern: '',
  treatment: '',
  texture: '',
  customization: '',
  budget: '',
  consistency: '',
  barrier: '',
  product: ''
};

document.addEventListener('DOMContentLoaded', () => {
  initNatureParticles();
  initScrollAnimations();
  initSeedLeads();
  console.log('Jespar Naturals Master Hair & Scalp Survey Initialized (Clinical Genesis Edition).');
});

/* Seed demo lead if storage is empty */
function initSeedLeads() {
  const existing = localStorage.getItem('jespar_vip_subscribers');
  if (!existing) {
    const seed = [
      {
        name: "Priya Kethana",
        email: "hello@jesparnaturals.com",
        phone: "+91 98765 43210",
        product: "Jespar Active Scalp Serum",
        timestamp: new Date().toLocaleString()
      }
    ];
    localStorage.setItem('jespar_vip_subscribers', JSON.stringify(seed));
  }
}

/* 1. Interactive Nature Particles Animation Canvas */
function initNatureParticles() {
  const canvas = document.getElementById('natureCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = 28;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 6,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: Math.sin(Math.random() * Math.PI * 2) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.2,
      color: Math.random() > 0.4 ? '#b86d43' : '#d49b6a'
    });
  }

  function drawLeaf(ctx, x, y, size, rotation, color, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;

    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.bezierCurveTo(size / 2, -size / 2, size / 2, size / 2, 0, size);
    ctx.bezierCurveTo(-size / 2, size / 2, -size / 2, -size / 2, 0, -size);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += Math.sin(p.y * 0.01) * p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y < -20) {
        p.y = height + 20;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      drawLeaf(ctx, p.x, p.y, p.size, p.rotation, p.color, p.opacity);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* 2. Scroll Reveal Animations */
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.product-card, .lab-card, .quiz-section-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/* 3. Master Survey Step Navigation & Data Validation */
function selectSurveyOption(stepNumber, fieldKey, element, val) {
  const parent = element.parentElement;
  parent.querySelectorAll('.quiz-option-btn').forEach(btn => btn.classList.remove('selected'));
  element.classList.add('selected');
  surveyData[fieldKey] = val;
}

function validateSurveyStep(step) {
  if (step === 1) {
    if (!surveyData.age || !surveyData.environment) {
      showToast('⚠️ Please select options for both Age Group and Environment to proceed.');
      return false;
    }
  } else if (step === 2) {
    if (!surveyData.concern || !surveyData.treatment) {
      showToast('⚠️ Please select your Primary Concern and Current Treatment to proceed.');
      return false;
    }
  } else if (step === 3) {
    if (!surveyData.texture || !surveyData.customization) {
      showToast('⚠️ Please select options for Texture Preference and Customization.');
      return false;
    }
  } else if (step === 4) {
    if (!surveyData.budget || !surveyData.consistency || !surveyData.barrier) {
      showToast('⚠️ Please select options for Budget, Consistency, and Barrier.');
      return false;
    }
  }
  return true;
}

function nextSurveyStep(currentStep) {
  if (!validateSurveyStep(currentStep)) return;

  document.getElementById(`surveyStep${currentStep}`).classList.remove('active');
  const nextStep = currentStep + 1;
  const nextEl = document.getElementById(`surveyStep${nextStep}`);
  if (nextEl) {
    nextEl.classList.add('active');
    document.getElementById('surveyProgressBar').style.width = `${nextStep * 20}%`;
  }
}

function prevSurveyStep(currentStep) {
  document.getElementById(`surveyStep${currentStep}`).classList.remove('active');
  const prevStep = currentStep - 1;
  const prevEl = document.getElementById(`surveyStep${prevStep}`);
  if (prevEl) {
    prevEl.classList.add('active');
    document.getElementById('surveyProgressBar').style.width = `${prevStep * 20}%`;
  }
}

/* Validation helpers for contact details */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10 && digitsOnly.length <= 13;
}

async function submitMasterSurvey(e) {
  e.preventDefault();
  const name = document.getElementById('surveyName').value.trim();
  const email = document.getElementById('surveyEmail').value.trim();
  const phone = document.getElementById('surveyPhone').value.trim();

  // Validate contact details before submitting
  if (!name || name.length < 2) {
    showToast('⚠️ Please enter your valid Full Name.');
    return;
  }
  if (!isValidEmail(email)) {
    showToast('⚠️ Please enter a valid Email Address (e.g. name@example.com).');
    return;
  }
  if (!isValidPhone(phone)) {
    showToast('⚠️ Please enter a valid 10-digit Phone Number / WhatsApp.');
    return;
  }

  const timestamp = new Date().toLocaleString();

  const payload = {
    name,
    email,
    phone,
    age: surveyData.age || 'Not Specified',
    environment: surveyData.environment || 'Not Specified',
    concern: surveyData.concern || 'Not Specified',
    treatment: surveyData.treatment || 'Not Specified',
    texture: surveyData.texture || 'Not Specified',
    customization: surveyData.customization || 'Not Specified',
    budget: surveyData.budget || 'Not Specified',
    consistency: surveyData.consistency || 'Not Specified',
    barrier: surveyData.barrier || 'Not Specified',
    product: surveyData.product || 'Jespar Active Scalp Serum (30ml)',
    voucherStatus: 'Skincare Guide & 20% Coupon Queued for WhatsApp/Email',
    timestamp
  };

  // 1) Save to local storage
  const vipList = JSON.parse(localStorage.getItem('jespar_vip_subscribers') || '[]');
  vipList.push(payload);
  localStorage.setItem('jespar_vip_subscribers', JSON.stringify(vipList));

  // 2) Auto-sync all 15 parameters to Google Sheets Endpoint
  const scriptUrl = GOOGLE_SHEET_SCRIPT_URL || localStorage.getItem('jespar_google_sheet_url');
  if (scriptUrl) {
    try {
      const params = new URLSearchParams();
      params.append('name', name);
      params.append('email', email);
      params.append('phone', phone);
      params.append('age', payload.age);
      params.append('environment', payload.environment);
      params.append('concern', payload.concern);
      params.append('treatment', payload.treatment);
      params.append('texture', payload.texture);
      params.append('customization', payload.customization);
      params.append('budget', payload.budget);
      params.append('consistency', payload.consistency);
      params.append('barrier', payload.barrier);
      params.append('product', payload.product);
      params.append('voucherStatus', payload.voucherStatus);
      params.append('timestamp', timestamp);

      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
      console.log('Master survey responses auto-synced to Google Sheets:', payload);
    } catch (err) {
      console.warn('Google Sheets sync error:', err);
    }
  }

  // Hide step 5, show thank you card
  document.getElementById('surveyStep5').classList.remove('active');
  document.getElementById('surveyProgressBar').style.width = '100%';
  
  const resultsCard = document.getElementById('surveyResultsCard');
  document.getElementById('thanksPhoneText').textContent = phone;
  document.getElementById('thanksEmailText').textContent = email;
  resultsCard.classList.add('active');

  showToast(`✨ Survey Complete! Skincare guide & 20% coupon reserved for ${name}.`);
}

/* 4. VIP Modal Management */
function openVipModal(productName = '') {
  const modal = document.getElementById('vipModal');
  const select = document.getElementById('vipProduct');
  if (productName && select) {
    select.value = productName;
  }
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeVipModal() {
  const modal = document.getElementById('vipModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* 5. Handle Standard VIP Form Submission */
async function handleVipSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('vipName').value.trim();
  const email = document.getElementById('vipEmail').value.trim();
  const phone = document.getElementById('vipPhone').value.trim();
  const product = document.getElementById('vipProduct').value;

  if (!isValidEmail(email)) {
    showToast('⚠️ Please enter a valid Email Address.');
    return;
  }
  if (!isValidPhone(phone)) {
    showToast('⚠️ Please enter a valid 10-digit Phone Number.');
    return;
  }

  const timestamp = new Date().toLocaleString();
  const payload = { name, email, phone, product, timestamp };

  const vipList = JSON.parse(localStorage.getItem('jespar_vip_subscribers') || '[]');
  vipList.push(payload);
  localStorage.setItem('jespar_vip_subscribers', JSON.stringify(vipList));

  const scriptUrl = GOOGLE_SHEET_SCRIPT_URL || localStorage.getItem('jespar_google_sheet_url');
  if (scriptUrl) {
    try {
      const params = new URLSearchParams();
      params.append('name', name);
      params.append('email', email);
      params.append('phone', phone);
      params.append('product', product);
      params.append('timestamp', timestamp);

      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });
    } catch (err) {
      console.warn('Google Sheets sync error:', err);
    }
  }

  closeVipModal();
  showToast(`✨ Thank you, ${name}! Your VIP reservation for ${product} has been recorded.`);
}

window.addEventListener('click', (e) => {
  const vipModal = document.getElementById('vipModal');
  if (e.target === vipModal) closeVipModal();
});

// Lab Cards Tab Filter
function filterLabCards(category) {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  event.target.classList.add('active');

  const cards = document.querySelectorAll('.lab-card');
  cards.forEach(card => {
    if (category === 'all') {
      card.style.display = 'block';
    } else {
      const cardCategory = card.getAttribute('data-category');
      if (cardCategory === category) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    }
  });
}

// Toast Notification
function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.style.cssText = `
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: #2b1a13;
      color: #faf4ef;
      border: 1px solid #b86d43;
      padding: 16px 24px;
      border-radius: 14px;
      box-shadow: 0 12px 35px rgba(0,0,0,0.35);
      z-index: 3000;
      font-weight: 600;
      font-size: 0.95rem;
      max-width: 380px;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      opacity: 0;
      transform: translateY(20px);
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
  }, 4500);
}

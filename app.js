/**
 * Foreign Training Portal (FTP) | SIRC IIT Kharagpur
 * Autoplay Text Carousel + Reverse 3D Lateral Flip Card + Functional Eye Toggles + Email Institute Validation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Feather Icons
  if (typeof feather !== 'undefined') {
    feather.replace();
  }

  /* ==========================================================================
     1. PERIODIC DYNAMIC TEXT CAROUSEL WITH PROGRESS BAR (BLUE/CYAN)
     ========================================================================== */

  const SLIDE_DURATION = 6000; // 6 seconds per slide
  let currentSlideIndex = 0;
  let carouselTimer = null;
  let isPaused = false;
  let progressInterval = null;
  let progressPercentage = 0;

  const slides = document.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dots .dot');
  const progressBarFill = document.getElementById('progressBarFill');
  const currentSlideNum = document.getElementById('currentSlideNum');
  const totalSlideNum = document.getElementById('totalSlideNum');
  const prevSlideBtn = document.getElementById('prevSlideBtn');
  const nextSlideBtn = document.getElementById('nextSlideBtn');
  const carouselContainer = document.getElementById('carouselContainer');

  const totalSlides = slides.length;
  if (totalSlideNum) {
    totalSlideNum.textContent = String(totalSlides).padStart(2, '0');
  }

  function goToSlide(index) {
    if (index === currentSlideIndex && slides[index].classList.contains('active')) {
      return;
    }

    slides[currentSlideIndex].classList.remove('active');
    if (dots[currentSlideIndex]) {
      dots[currentSlideIndex].classList.remove('active');
    }

    currentSlideIndex = (index + totalSlides) % totalSlides;

    slides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) {
      dots[currentSlideIndex].classList.add('active');
    }

    if (currentSlideNum) {
      currentSlideNum.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }

    resetProgressBar();
  }

  function nextSlide() {
    goToSlide(currentSlideIndex + 1);
  }

  function prevSlide() {
    goToSlide(currentSlideIndex - 1);
  }

  function startSlideshow() {
    if (carouselTimer) clearInterval(carouselTimer);
    resetProgressBar();

    carouselTimer = setInterval(() => {
      if (!isPaused) {
        nextSlide();
      }
    }, SLIDE_DURATION);

    startProgressBar();
  }

  function startProgressBar() {
    if (progressInterval) clearInterval(progressInterval);
    progressPercentage = 0;

    const stepTime = 50; // update every 50ms
    const totalSteps = SLIDE_DURATION / stepTime;
    const increment = 100 / totalSteps;

    progressInterval = setInterval(() => {
      if (!isPaused) {
        progressPercentage += increment;
        if (progressPercentage > 100) progressPercentage = 100;
        if (progressBarFill) {
          progressBarFill.style.width = `${progressPercentage}%`;
        }
      }
    }, stepTime);
  }

  function resetProgressBar() {
    if (progressInterval) clearInterval(progressInterval);
    progressPercentage = 0;
    if (progressBarFill) {
      progressBarFill.style.width = '0%';
    }
    startProgressBar();
  }

  // Event Listeners for Nav Arrows & Dots
  if (prevSlideBtn) prevSlideBtn.addEventListener('click', prevSlide);
  if (nextSlideBtn) nextSlideBtn.addEventListener('click', nextSlide);

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('data-index'), 10);
      goToSlide(index);
    });
  });

  // Autoplay & Hover Pause / Resume Functionality
  if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
      isPaused = true;
    });

    carouselContainer.addEventListener('mouseleave', () => {
      isPaused = false;
    });
  }

  startSlideshow();


  /* ==========================================================================
     2. OPPOSITE-DIRECTION CONTINUOUS 3D LATERAL FLIP
     ========================================================================== */

  const authCardFlipper = document.getElementById('authCardFlipper');
  const tabSignInFront = document.getElementById('tabSignInFront');
  const tabRegisterFront = document.getElementById('tabRegisterFront');
  const tabSignInBack = document.getElementById('tabSignInBack');
  const tabRegisterBack = document.getElementById('tabRegisterBack');
  const linkToRegister = document.getElementById('linkToRegister');
  const linkToSignIn = document.getElementById('linkToSignIn');

  let currentRotation = 0;
  let isFlipping = false;

  function flipToRegister() {
    if (!authCardFlipper || isFlipping || Math.abs(currentRotation) % 360 === 180) return;
    isFlipping = true;
    currentRotation -= 180;
    authCardFlipper.style.transform = `rotateY(${currentRotation}deg)`;

    clearAllErrors();
    hideAllAlerts();

    if (tabSignInFront) tabSignInFront.setAttribute('aria-selected', 'false');
    if (tabRegisterBack) tabRegisterBack.setAttribute('aria-selected', 'true');

    setTimeout(() => {
      isFlipping = false;
      const registerEmail = document.getElementById('registerEmail');
      if (registerEmail) registerEmail.focus();
    }, 650);
  }

  function flipToSignIn() {
    if (!authCardFlipper || isFlipping || Math.abs(currentRotation) % 360 === 0) return;
    isFlipping = true;
    currentRotation -= 180;
    authCardFlipper.style.transform = `rotateY(${currentRotation}deg)`;

    clearAllErrors();
    hideAllAlerts();

    if (tabSignInFront) tabSignInFront.setAttribute('aria-selected', 'true');
    if (tabRegisterBack) tabRegisterBack.setAttribute('aria-selected', 'false');

    setTimeout(() => {
      authCardFlipper.style.transition = 'none';
      currentRotation = 0;
      authCardFlipper.style.transform = 'rotateY(0deg)';
      void authCardFlipper.offsetWidth; // force reflow
      authCardFlipper.style.transition = '';

      isFlipping = false;
      const loginEmail = document.getElementById('loginEmail');
      if (loginEmail) loginEmail.focus();
    }, 650);
  }

  if (tabRegisterFront) tabRegisterFront.addEventListener('click', flipToRegister);
  if (linkToRegister) linkToRegister.addEventListener('click', flipToRegister);

  if (tabSignInBack) tabSignInBack.addEventListener('click', flipToSignIn);
  if (linkToSignIn) linkToSignIn.addEventListener('click', flipToSignIn);


  /* ==========================================================================
     3. FUNCTIONAL EYE BUTTONS FOR ALL PASSWORD FIELDS
     ========================================================================== */

  function setupPasswordToggle(toggleBtnId, inputId) {
    const toggleBtn = document.getElementById(toggleBtnId);
    const input = document.getElementById(inputId);
    if (!toggleBtn || !input) return;

    toggleBtn.addEventListener('click', () => {
      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      toggleBtn.setAttribute('title', isPassword ? 'Hide password' : 'Show password');

      toggleBtn.innerHTML = isPassword
        ? `<i data-feather="eye-off"></i>`
        : `<i data-feather="eye"></i>`;

      if (typeof feather !== 'undefined') {
        feather.replace();
      }
    });
  }

  setupPasswordToggle('toggleLoginPassword', 'loginPassword');
  setupPasswordToggle('toggleRegisterPassword', 'registerPassword');
  setupPasswordToggle('toggleRegisterConfirmPassword', 'registerConfirmPassword');


  /* ==========================================================================
     4. EMAIL SPLIT BY @ AND INSTITUTE FORMAT CHECK
     ========================================================================== */

  const loginEmail = document.getElementById('loginEmail');
  const loginEmailError = document.getElementById('loginEmailError');
  const registerEmail = document.getElementById('registerEmail');
  const registerEmailError = document.getElementById('registerEmailError');

  /**
   * Split by @ and check if it doesn't follow the institute format
   * Valid formats: kgpian.iitkgp.ac.in and iitkgp.ac.in
   */
  function checkInstituteEmail(input, errorSpan, isFinalCheck = false) {
    if (!input || !errorSpan) return true;
    const val = input.value.trim();

    if (!val) {
      if (isFinalCheck) {
        errorSpan.textContent = 'Please enter your email.';
        return false;
      }
      errorSpan.textContent = '';
      return true;
    }

    // Split by @
    const parts = val.split('@');

    if (parts.length > 1) {
      const domain = parts[1].toLowerCase().trim();
      // If user has started typing domain, or during final submit/blur
      if (domain.length > 0 || isFinalCheck) {
        if (domain !== 'kgpian.iitkgp.ac.in' && domain !== 'iitkgp.ac.in') {
          errorSpan.textContent = '(*Note: Please use institute email id)';
          return false;
        } else {
          errorSpan.textContent = '';
          return true;
        }
      }
    } else if (isFinalCheck) {
      errorSpan.textContent = '(*Note: Please use institute email id)';
      return false;
    }

    errorSpan.textContent = '';
    return true;
  }

  // Live validation on typing
  if (loginEmail) {
    loginEmail.addEventListener('input', () => checkInstituteEmail(loginEmail, loginEmailError, false));
    loginEmail.addEventListener('blur', () => checkInstituteEmail(loginEmail, loginEmailError, false));
  }

  if (registerEmail) {
    registerEmail.addEventListener('input', () => checkInstituteEmail(registerEmail, registerEmailError, false));
    registerEmail.addEventListener('blur', () => checkInstituteEmail(registerEmail, registerEmailError, false));
  }


  /* ==========================================================================
     5. FORM SUBMISSION (LOGIN & REGISTER)
     ========================================================================== */

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');

  const loginPassword = document.getElementById('loginPassword');
  const loginPasswordError = document.getElementById('loginPasswordError');
  const loginAlertBox = document.getElementById('loginAlertBox');
  const loginAlertMessage = document.getElementById('loginAlertMessage');
  const loginBtnText = document.getElementById('loginBtnText');

  const registerPassword = document.getElementById('registerPassword');
  const registerConfirmPassword = document.getElementById('registerConfirmPassword');
  const registerPasswordError = document.getElementById('registerPasswordError');
  const registerConfirmPasswordError = document.getElementById('registerConfirmPasswordError');
  const registerAlertBox = document.getElementById('registerAlertBox');
  const registerAlertMessage = document.getElementById('registerAlertMessage');
  const registerBtnText = document.getElementById('registerBtnText');

  const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

  function showNotification(box, msgSpan, message, type = 'info') {
    if (!box || !msgSpan) return;
    msgSpan.textContent = message;
    box.className = `alert-box ${type}`;
  }

  function hideAllAlerts() {
    if (loginAlertBox) loginAlertBox.className = 'alert-box hidden';
    if (registerAlertBox) registerAlertBox.className = 'alert-box hidden';
  }

  function clearAllErrors() {
    if (loginEmailError) loginEmailError.textContent = '';
    if (loginPasswordError) loginPasswordError.textContent = '';
    if (registerEmailError) registerEmailError.textContent = '';
    if (registerPasswordError) registerPasswordError.textContent = '';
    if (registerConfirmPasswordError) registerConfirmPasswordError.textContent = '';
  }

  // Handle Login Submission
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors();
      hideAllAlerts();

      const emailVal = loginEmail.value.trim();
      const passVal = loginPassword.value.trim();
      let isValid = true;

      const isEmailValid = checkInstituteEmail(loginEmail, loginEmailError, true);
      if (!isEmailValid) {
        isValid = false;
      }

      if (!passVal) {
        loginPasswordError.textContent = 'Please enter your password.';
        isValid = false;
      }

      if (!isValid) return;

      loginBtnText.textContent = 'Authenticating...';

      setTimeout(() => {
        loginBtnText.textContent = 'Sign In';
        showNotification(
          loginAlertBox,
          loginAlertMessage,
          `Welcome back! Authenticated as ${emailVal}. Redirecting to FTP portal...`,
          'success'
        );
      }, 900);
    });
  }

  // Handle Register Submission
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearAllErrors();
      hideAllAlerts();

      const emailVal = registerEmail.value.trim();
      const passVal = registerPassword.value.trim();
      const confirmVal = registerConfirmPassword.value.trim();
      let isValid = true;

      const isEmailValid = checkInstituteEmail(registerEmail, registerEmailError, true);
      if (!isEmailValid) {
        isValid = false;
      }

      if (!passVal) {
        registerPasswordError.textContent = 'Please create a password.';
        isValid = false;
      } else if (passVal.length < 6) {
        registerPasswordError.textContent = 'Password must be at least 6 characters.';
        isValid = false;
      }

      if (!confirmVal) {
        registerConfirmPasswordError.textContent = 'Please re-enter your password.';
        isValid = false;
      } else if (passVal !== confirmVal) {
        registerConfirmPasswordError.textContent = 'Passwords do not match.';
        isValid = false;
      }

      if (!isValid) return;

      registerBtnText.textContent = 'Registering Account...';

      setTimeout(() => {
        registerBtnText.textContent = 'Register Account';
        showNotification(
          registerAlertBox,
          registerAlertMessage,
          `Registration successful for ${emailVal}! Please verify your inbox to activate FTP access.`,
          'success'
        );
      }, 1000);
    });
  }

  // Forgot Password Handler
  if (forgotPasswordBtn) {
    forgotPasswordBtn.addEventListener('click', () => {
      const emailVal = loginEmail.value.trim();
      showNotification(
        loginAlertBox,
        loginAlertMessage,
        emailVal
          ? `Password reset link sent to ${emailVal}.`
          : 'Please enter your institute email above, then click Forgot password.',
        'info'
      );
    });
  }

  // Clear any legacy theme overrides from storage so permanent Graphite Slate styling applies cleanly
  try {
    localStorage.removeItem('sirc_ftp_custom_duo');
    localStorage.removeItem('sirc_ftp_theme');
  } catch (e) {}

  // Ensure Feather Icons are rendered
  if (typeof feather !== 'undefined') {
    feather.replace();
  }
});


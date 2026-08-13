const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const yearEl = document.getElementById('year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

const contactForm = document.getElementById('contactForm');
const formStatus = document.querySelector('.form-status');

if (contactForm && formStatus) {
  const fields = {
    name: contactForm.querySelector('#name'),
    email: contactForm.querySelector('#email'),
    message: contactForm.querySelector('#message'),
  };

  const validateField = (field) => {
    const value = field.value.trim();
    const errorNode = field.parentElement.querySelector('.error-message');

    if (!field.name) return true;

    if (field.name === 'name' && value.length < 2) {
      field.classList.add('invalid');
      field.classList.remove('valid');
      if (errorNode) errorNode.textContent = 'Please enter your name.';
      return false;
    }

    if (field.name === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isDiscordTag = /^.+#\d{4}$/.test(value) || value.startsWith('@');
      
      if (!emailPattern.test(value) && !isDiscordTag) {
        field.classList.add('invalid');
        field.classList.remove('valid');
        if (errorNode) errorNode.textContent = 'Please enter a valid email or contact handle.';
        return false;
      }
    }

    if (field.name === 'message' && value.length < 10) {
      field.classList.add('invalid');
      field.classList.remove('valid');
      if (errorNode) errorNode.textContent = 'Please add a few more details about your project.';
      return false;
    }

    field.classList.remove('invalid');
    field.classList.add('valid');
    if (errorNode) errorNode.textContent = '';
    return true;
  };

  Object.values(fields).forEach((field) => {
    if (field) {
      field.addEventListener('input', () => validateField(field));
      field.addEventListener('blur', () => validateField(field));
    }
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = Object.values(fields).every((field) => field ? validateField(field) : true);

    if (!isValid) {
      formStatus.textContent = 'Please correct the highlighted fields and try again.';
      formStatus.style.color = 'var(--error)';
      return;
    }

    const name = fields.name.value.trim();
    formStatus.textContent = name
      ? `Thanks, ${name}! Your message has been sent successfully.`
      : 'Thanks! Your message has been sent successfully.';
    formStatus.style.color = 'var(--success)';

    contactForm.reset();
    Object.values(fields).forEach((field) => {
      if (field) {
        field.classList.remove('valid', 'invalid');
        const errorNode = field.parentElement.querySelector('.error-message');
        if (errorNode) errorNode.textContent = '';
      }
    });
  });
}
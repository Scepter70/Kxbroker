// Progressive enhancement: navigation toggle, tabs, smooth scrolling, reveal animations
document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav
  const navToggle = document.getElementById('sv-nav-toggle');
  const nav = document.getElementById('sv-primary-nav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('show');
      // animate hamburger (simple)
      navToggle.classList.toggle('open');
    });

    // Close nav when a link is clicked
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('show');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Tabs
  const tabButtons = document.querySelectorAll('.sv-tabs-nav button[role="tab"]');
  const panels = document.querySelectorAll('.sv-tab-content');

  function activateTab(index) {
    tabButtons.forEach((btn, i) => {
      const selected = i === index;
      btn.setAttribute('aria-selected', String(selected));
    });
    panels.forEach((panel) => {
      const matches = Number(panel.dataset.tab) === index;
      panel.classList.toggle('active', matches);
      panel.hidden = !matches;
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = Number(btn.dataset.index);
      activateTab(i);
      // focus first element in panel for accessibility
      const panel = document.querySelector(`.sv-tab-content[data-tab="${i}"]`);
      if (panel) panel.querySelector('h3')?.focus();
    });
  });

  // Smooth scrolling for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // update focus
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

  // Reveal on scroll using IntersectionObserver with fallback
  const revealTargets = document.querySelectorAll('.sv-service-card, .sv-pricing-card, .sv-why-card');
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      obs.observe(el);
    });
  } else {
    // Fallback: reveal all
    revealTargets.forEach(el => el.style.opacity = '1');
  }
});

(function () {
  var navigation = document.querySelector('.nav-bar');
  if (!navigation) return;

  var links = Array.prototype.slice.call(
    navigation.querySelectorAll('a[href^="#"]')
  ).filter(function (link) {
    return document.getElementById(link.getAttribute('href').slice(1));
  });

  if (!links.length) return;

  var sections = links.map(function (link) {
    return document.getElementById(link.getAttribute('href').slice(1));
  });

  var navigationOffset = 0;

  function measureNavigation() {
    var measuredOffset = navigation.getBoundingClientRect().height + 16;

    if (measuredOffset !== navigationOffset) {
      navigationOffset = measuredOffset;
      document.documentElement.style.setProperty(
        '--section-nav-offset', navigationOffset + 'px'
      );
    }

    requestUpdate();
  }

  function setActiveLink(activeIndex) {
    links.forEach(function (link, index) {
      var isActive = index === activeIndex;
      link.classList.toggle('is-active', isActive);

      if (isActive) {
        link.setAttribute('aria-current', 'location');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  function updateActiveLink() {
    var activeIndex = -1;

    sections.forEach(function (section, index) {
      if (section && section.getBoundingClientRect().top <= navigationOffset + 1) {
        activeIndex = index;
      }
    });

    var isAtPageEnd =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 2;

    if (isAtPageEnd && sections.length) {
      activeIndex = sections.length - 1;
    }

    setActiveLink(activeIndex);
  }

  var ticking = false;

  function requestUpdate() {
    if (ticking) return;

    ticking = true;
    window.requestAnimationFrame(function () {
      updateActiveLink();
      ticking = false;
    });
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', measureNavigation);
  window.addEventListener('load', measureNavigation);
  window.addEventListener('hashchange', requestUpdate);

  if (window.ResizeObserver) {
    new window.ResizeObserver(measureNavigation).observe(navigation);
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measureNavigation);
  }

  measureNavigation();
})();

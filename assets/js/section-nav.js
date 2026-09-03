(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll('.nav-bar a[href^="#"]')
  );

  var sections = links.map(function (link) {
    return document.querySelector(link.getAttribute('href'));
  });

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
    var navigationOffset = 96;
    var activeIndex = -1;

    sections.forEach(function (section, index) {
      if (section && section.getBoundingClientRect().top <= navigationOffset) {
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
  window.addEventListener('resize', requestUpdate);
  window.addEventListener('hashchange', requestUpdate);
  updateActiveLink();
})();

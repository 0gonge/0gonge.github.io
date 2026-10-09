(function () {
  var toggle = document.getElementById('theme-toggle');
  if (!toggle) return;

  toggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';

  toggle.addEventListener('change', function () {
    var theme = toggle.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);

    try {
      localStorage.setItem('theme', theme);
    } catch (error) {}
  });
})();

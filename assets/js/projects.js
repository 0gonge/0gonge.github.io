(function () {
  "use strict";

  document.querySelectorAll("[data-github-repo]").forEach(function (link) {
    var repo = link.dataset.githubRepo;
    var stars = link.querySelector(".project-stars");
    var count = link.querySelector("[data-star-count]");
    if (!stars || !count || !/^[\w.-]+\/[\w.-]+$/.test(repo)) return;

    var cacheKey = "project-stars:" + repo;
    var cacheLifetime = 60 * 60 * 1000;

    function showCount(value) {
      count.textContent = new Intl.NumberFormat("en-US", {
        notation: value >= 10000 ? "compact" : "standard",
        maximumFractionDigits: 1
      }).format(value);
      stars.setAttribute("aria-label", value.toLocaleString("en-US") + " GitHub stars");
      stars.title = "GitHub stars · checked " + new Date().toLocaleDateString("en-US");
    }

    try {
      var cached = JSON.parse(localStorage.getItem(cacheKey));
      if (cached && Number.isSafeInteger(cached.count) && cached.count >= 0 && Date.now() - cached.time < cacheLifetime) {
        showCount(cached.count);
        return;
      }
    } catch (error) {}

    var controller = new AbortController();
    var timeout = window.setTimeout(function () { controller.abort(); }, 5000);
    fetch("https://api.github.com/repos/" + repo, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal
    }).then(function (response) {
      if (!response.ok) throw new Error("GitHub star count unavailable");
      return response.json();
    }).then(function (data) {
      if (!Number.isSafeInteger(data.stargazers_count) || data.stargazers_count < 0) return;
      showCount(data.stargazers_count);
      try {
        localStorage.setItem(cacheKey, JSON.stringify({ count: data.stargazers_count, time: Date.now() }));
      } catch (error) {}
    }).catch(function () {
      // Keep the dated count in the HTML when offline or rate limited.
    }).finally(function () {
      window.clearTimeout(timeout);
    });
  });
})();

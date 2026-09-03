(function () {
  var copyButton = document.querySelector('.copy-email');
  var feedback = document.querySelector('.copy-feedback');
  var feedbackTimer;

  if (!copyButton || !feedback) return;

  function fallbackCopy(text) {
    var textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();

    var copied = document.execCommand('copy');
    document.body.removeChild(textArea);
    return copied;
  }

  function showFeedback(message) {
    window.clearTimeout(feedbackTimer);
    feedback.textContent = message;
    feedback.classList.add('is-visible');

    feedbackTimer = window.setTimeout(function () {
      feedback.classList.remove('is-visible');
    }, 1600);
  }

  copyButton.addEventListener('click', function () {
    var email = copyButton.getAttribute('data-email');
    var copyPromise;

    if (navigator.clipboard && window.isSecureContext) {
      copyPromise = navigator.clipboard.writeText(email);
    } else {
      copyPromise = Promise.resolve(fallbackCopy(email));
    }

    copyPromise
      .then(function (copied) {
        showFeedback(copied === false ? 'Copy failed' : 'Copied!');
      })
      .catch(function () {
        showFeedback(fallbackCopy(email) ? 'Copied!' : 'Copy failed');
      });
  });
})();

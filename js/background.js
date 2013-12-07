chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('container.html', {
    'bounds': {
      'width': 600,
      'height': 400
    }
  });
});
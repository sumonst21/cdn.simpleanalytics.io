(function(window,d){
  try {
    if (!window) return;
    var nav = window.navigator;
    var userAgent = window.navigator.userAgent;
    if (userAgent.search(/(bot|spider|crawl)/ig) > -1) return;

    var post = function(url) {
      var data = { source: 'js' };
      if (url) data.url = url;
      if (userAgent) data.ua = userAgent;
      if (window.document.referrer) data.referrer = window.document.referrer;
      if (window.navigator.doNotTrack === '1') data.dnt = true;
      if (window.innerWidth) data.width = window.innerWidth;
      if (window.innerHeight) data.height = window.innerHeight;

      var request = new XMLHttpRequest();
      request.open('POST', d + '/post', true);

      // We use content type text/plain here because we don't want to send an
      // pre-flight OPTIONS request
      request.setRequestHeader('Content-Type', 'text/plain; charset=UTF-8');
      request.send(JSON.stringify(data));
    }

    // Thanks to https://gist.github.com/rudiedirkx/fd568b08d7bffd6bd372
    var his = window.history;
    if (his && his.pushState && his.replaceState && Event && window.dispatchEvent) {
      var stateListener = function(type) {
        var orig = his[type];
        return function() {
          var rv = orig.apply(this, arguments);
          var event = new Event(type);
          event.arguments = arguments;
          window.dispatchEvent(event);
          return rv;
        };
      };
      his.pushState = stateListener('pushState');
      his.replaceState = stateListener('replaceState');
      window.addEventListener('replaceState', function() {
        post(window.location.href);
      });
      window.addEventListener('pushState', function() {
        post(window.location.href);
      });
    }

    post(window.location.href);
  } catch (e) {
    if (console && console.error) console.error(e);
    var bodies = document.getElementsByTagName('body');
    var img = new Image();
    var url = d + '/hello.gif';
    if (e && e.message) url = url + '?error=' + encodeURIComponent(e.message);
    img.src = url;
    img.alt = '';
    if (bodies[0]) bodies[0].appendChild(img);
  }
})(window, '//simplewebsiteanalytics.com');

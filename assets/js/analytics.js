
// Very lightweight analytics logging in localStorage
window.PR_Analytics = (function() {
  function log(eventType, payload) {
    const events = window.PR_Storage.get('analytics', []);
    events.push({
      type: eventType,
      payload: payload || {},
      ts: new Date().toISOString()
    });
    window.PR_Storage.set('analytics', events);
  }

  function getAll() {
    return window.PR_Storage.get('analytics', []);
  }

  return { log, getAll };
})();

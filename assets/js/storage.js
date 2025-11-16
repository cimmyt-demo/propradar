
// Simple namespaced localStorage helper
window.PR_Storage = (function() {
  const NS = 'pr_';

  function _key(name) {
    return NS + name;
  }

  function get(name, fallback) {
    try {
      const raw = localStorage.getItem(_key(name));
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('PR_Storage get error', name, e);
      return fallback;
    }
  }

  function set(name, value) {
    try {
      localStorage.setItem(_key(name), JSON.stringify(value));
    } catch (e) {
      console.warn('PR_Storage set error', name, e);
    }
  }

  function push(name, value) {
    const arr = get(name, []);
    arr.push(value);
    set(name, arr);
  }

  return { get, set, push };
})();

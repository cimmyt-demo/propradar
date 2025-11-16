
// Simple auth simulation using localStorage
window.PR_Auth = (function() {
  function _users() {
    return window.PR_Storage.get('users', []);
  }

  function _saveUsers(users) {
    window.PR_Storage.set('users', users);
  }

  function _setSession(user) {
    window.PR_Storage.set('session', user ? { id: user.id, email: user.email } : null);
  }

  function getCurrentUser() {
    return window.PR_Storage.get('session', null);
  }

  function signup(email, password) {
    const users = _users();
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }
    const user = {
      id: 'u_' + Date.now(),
      email,
      password // NOTE: in real life this must be hashed; here it is just a demo.
    };
    users.push(user);
    _saveUsers(users);
    _setSession(user);
    window.PR_Analytics && window.PR_Analytics.log('signup', { email });
    return user;
  }

  function login(email, password) {
    const users = _users();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('Invalid credentials');
    _setSession(user);
    window.PR_Analytics && window.PR_Analytics.log('login', { email });
    return user;
  }

  function logout() {
    const current = getCurrentUser();
    _setSession(null);
    window.PR_Analytics && window.PR_Analytics.log('logout', { email: current && current.email });
  }

  function initAuthUI() {
    const user = getCurrentUser();
    const el = document.querySelector('[data-auth-status]');
    if (!el) return;
    if (user) {
      el.textContent = 'Signed in as ' + user.email;
    } else {
      el.textContent = 'Not signed in';
    }
  }

  return {
    getCurrentUser,
    signup,
    login,
    logout,
    initAuthUI
  };
})();

// Wire auth forms on auth.html
(function() {
  const signupForm = document.getElementById('auth-signup-form');
  const loginForm = document.getElementById('auth-login-form');
  const statusEl = document.getElementById('auth-status');
  const errorEl = document.getElementById('auth-error');

  function showError(msg) {
    if (errorEl) {
      errorEl.textContent = msg || '';
    } else {
      alert(msg);
    }
  }

  if (signupForm) {
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = new FormData(signupForm);
      const email = data.get('email');
      const password = data.get('password');
      try {
        window.PR_Auth.signup(email, password);
        if (statusEl) statusEl.textContent = 'Signed up & logged in as ' + email;
        showError('');
      } catch (err) {
        showError(err.message);
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const data = new FormData(loginForm);
      const email = data.get('email');
      const password = data.get('password');
      try {
        window.PR_Auth.login(email, password);
        if (statusEl) statusEl.textContent = 'Logged in as ' + email;
        showError('');
      } catch (err) {
        showError(err.message);
      }
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    window.PR_Auth.initAuthUI();
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      window.PR_Auth.initAuthUI();
    });
  }
})();

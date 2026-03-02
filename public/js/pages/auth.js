/**
 * Auth Page Module (Login / Signup)
 */
function renderAuthPage(mode = 'login') {
  const app = document.getElementById('app');
  const isLogin = mode !== 'signup';

  if (Store.isLoggedIn()) {
    const user = Store.getUser();
    if (user.role === 'admin') { window.location.hash = '#/admin'; return; }
  }

  app.innerHTML = `
    <section class="auth-page">
      <div class="auth-card fade-in">
        <h1>${isLogin ? 'Welcome back' : 'Create account'}</h1>
        <p class="subtitle">${isLogin ? 'Sign in to access your account' : 'Join ZABBRO for exclusive benefits'}</p>
        <form id="auth-form">
          ${!isLogin ? `<div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="auth-name" placeholder="John Doe" required></div>` : ''}
          <div class="form-group"><label class="form-label">Email Address</label><input class="form-input" id="auth-email" type="email" placeholder="you@example.com" required></div>
          <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="auth-password" type="password" placeholder="••••••••" minlength="6" required></div>
          <div id="auth-error" class="form-error" style="margin-bottom:16px;display:none"></div>
          <button type="submit" class="btn btn-primary btn-full btn-lg" id="auth-submit">${isLogin ? 'Sign In' : 'Create Account'}</button>
        </form>
        <div class="auth-divider">or</div>
        <div class="auth-switch">
          ${isLogin
      ? 'Don\'t have an account? <a href="#/auth/signup">Sign Up</a>'
      : 'Already have an account? <a href="#/auth">Sign In</a>'}
        </div>
      </div>
    </section>
  `;

  document.getElementById('auth-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('auth-submit');
    const errorEl = document.getElementById('auth-error');
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-ring" style="width:18px;height:18px;border-width:2px"></span>';
    errorEl.style.display = 'none';

    try {
      let res;
      if (isLogin) {
        res = await API.users.login({ email, password });
      } else {
        const name = document.getElementById('auth-name').value.trim();
        res = await API.users.register({ name, email, password });
      }
      if (res.success) {
        Store.setUser(res.data);
        Toast.show(`Welcome${res.data.name ? ', ' + res.data.name : ''}!`, 'success');
        window.location.hash = res.data.role === 'admin' ? '#/admin' : '#/';
      }
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.style.display = 'block';
      btn.disabled = false;
      btn.textContent = isLogin ? 'Sign In' : 'Create Account';
    }
  });
}

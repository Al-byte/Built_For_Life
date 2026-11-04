/**
 * Built For Life — shared navigation behavior.
 * Bootstrap's offcanvas and dropdowns remain managed by Bootstrap itself.
 * Each HTML page retains the same markup and breadcrumb; only the active
 * sidebar entry is selected here.
 */
const PAGE_LABELS = Object.freeze({
  dashboard: 'My dashboard',
  curriculum: 'Our curriculum',
  'weekly-playbook': 'Weekly playbook',
  'progress-goals': 'Progress & goals',
  huddle: 'The huddle',
  'plans-membership': 'Plans & membership',
  'help-faqs': 'Help & FAQs'
});

export function initializeNavigation(page) {
  initializeNotifications(page);
  const currentPage = PAGE_LABELS[page] || null;
  const sidebar = document.getElementById('bflSidebar');
  for (const link of document.querySelectorAll('.bfl-nav-link')) {
    const active = currentPage !== null && link.dataset.page === currentPage;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  }

  // Account is intentionally not a sidebar item. Keep its profile link
  // distinguishable without highlighting an unrelated sidebar link.
  if (page === 'account') {
    document.querySelectorAll('a[href$="account.html"]').forEach(link => {
      if (!link.classList.contains('bfl-nav-link')) link.setAttribute('aria-current', 'page');
    });
  }

  if (!sidebar) return;
  sidebar.addEventListener('click', (event) => {
    if (!event.target.closest('a[href]') || window.innerWidth >= 992) return;
    window.bootstrap?.Offcanvas?.getInstance(sidebar)?.hide();
  });
}


// One shared notification dialog for all member pages.
function initializeNotifications(page) {
  if (document.getElementById('bflNotificationsModal')) return;
  const playbookHref = page === 'dashboard'
    ? 'pages/weekly-playbook.html' : 'weekly-playbook.html';
  const modal = document.createElement('div');
  modal.className = 'modal fade bfl-notifications-modal';
  modal.id = 'bflNotificationsModal';
  modal.tabIndex = -1;
  modal.setAttribute('aria-labelledby', 'bflNotificationsTitle');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="bfl-notifications-header">
          <p class="bfl-notifications-eyebrow">Demo notifications</p>
          <h2 id="bflNotificationsTitle">Your next steps.</h2>
          <button class="bfl-notifications-close" type="button" data-bs-dismiss="modal" aria-label="Close notifications"><i class="bi bi-x-lg" aria-hidden="true"></i></button>
        </div>
        <div class="bfl-notifications-body">
          <ul class="bfl-notifications-list">
            <li><h3>Week 2 is ready</h3><p>Put your gifts to work. Your next challenge is waiting.</p></li>
            <li><h3>Week 3 unlocks November 2</h3><p>Use the demo timeline to preview the next lesson.</p></li>
          </ul>
          <a class="bfl-notifications-playbook" href="${playbookHref}">Open playbook <i class="bi bi-arrow-right" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
}

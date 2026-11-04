/**
 * BFL page module: account
 * Frontend prototype only — not an authenticated backend.
 */
import { initializeNavigation } from '../navigation.js';
import { readJson, writeJson, removeStoredValue } from '../storage.js';

initializeNavigation('account');

// Account-only demo behavior. Production roles and authorization must be enforced by Supabase.
    const BFL_DEMO_STORAGE_KEY = 'bfl-account-demo-v1';
    const bflDefaultDemo = { pathway: '6–8', role: 'Parent' };
    const bflDemoRoles = ['Parent', 'Mentee', 'Mentor', 'Administrator'];
    let bflDemo = { ...bflDefaultDemo };

    try {
      const saved = readJson(BFL_DEMO_STORAGE_KEY, {});
      if (['6–8', '9–11', '12–14', '15–17'].includes(saved.pathway)) bflDemo.pathway = saved.pathway;
      if (bflDemoRoles.includes(saved.role)) bflDemo.role = saved.role;
    } catch (error) {
      // Browser storage may be disabled; the prototype will still work during this visit.
    }

    const pathwayInput = document.getElementById('bflAgePathway');
    const roleValue = document.getElementById('bflDemoRole');
    const identityNote = document.getElementById('bflDemoIdentityNote');
    const statusMessage = document.getElementById('bflDemoStatus');

    function renderBflDemo() {
      pathwayInput.value = bflDemo.pathway;
      roleValue.textContent = bflDemo.role;
      identityNote.textContent = `${bflDemo.role} demo · No real account`;
    }
    function storeBflDemo() {
      try { writeJson(BFL_DEMO_STORAGE_KEY, bflDemo); } catch (error) { /* Nonpersistent demo fallback */ }
    }
    pathwayInput.addEventListener('change', () => {
      bflDemo.pathway = pathwayInput.value;
      storeBflDemo();
      statusMessage.textContent = 'Demo age pathway updated.';
    });
    document.getElementById('bflSwitchRole').addEventListener('click', () => {
      const next = (bflDemoRoles.indexOf(bflDemo.role) + 1) % bflDemoRoles.length;
      bflDemo.role = bflDemoRoles[next];
      renderBflDemo();
      storeBflDemo();
      statusMessage.textContent = `Switched to ${bflDemo.role} demo role.`;
    });
    document.getElementById('bflResetDemoData').addEventListener('click', () => {
      bflDemo = { ...bflDefaultDemo };
      try { removeStoredValue(BFL_DEMO_STORAGE_KEY); } catch (error) { /* No persistent storage */ }
      renderBflDemo();
      statusMessage.textContent = 'Demo profile reset to its defaults.';
    });
    renderBflDemo();

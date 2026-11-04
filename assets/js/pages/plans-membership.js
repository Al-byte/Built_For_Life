/**
 * BFL page module: plans-membership
 * Frontend prototype only — not an authenticated backend.
 */
import { initializeNavigation } from '../navigation.js';
import { readJson, writeJson } from '../storage.js';

initializeNavigation('plans-membership');

(() => {
  'use strict';
  const KEY = 'bfl-membership-demo-v1';
  const plans = ['Training', 'Mentoring', 'Combined'];
  const amounts = { monthly: { Training: 25, Mentoring: 25, Combined: 50 }, annual: { Training: 250, Mentoring: 250, Combined: 500 } };
  let state = { period: 'monthly', plan: 'Combined' };
  try {
    const stored = readJson(KEY, {});
    if (stored.period === 'annual' || stored.period === 'monthly') state.period = stored.period;
    if (plans.includes(stored.plan)) state.plan = stored.plan;
    if (['6–8', '9–11', '12–14', '15–17'].includes(stored.pathway)) state.pathway = stored.pathway;
  } catch (_) { /* browser storage may be unavailable */ }
  let pendingPlan = 'Combined';
  const modalElement = document.getElementById('bflExplorePlanModal');
  const exploreModal = bootstrap.Modal.getOrCreateInstance(modalElement);
  const successElement = document.getElementById('bflMembershipSuccessModal');
  const successModal = bootstrap.Modal.getOrCreateInstance(successElement);
  let checkoutTrigger = null;
  let confirming = false;
  successElement.addEventListener('hidden.bs.modal', () => checkoutTrigger?.focus());
  modalElement.addEventListener('hidden.bs.modal', () => {
    if (!confirming) checkoutTrigger?.focus();
  });


  const persist = () => writeJson(KEY, state);
  const paint = () => {
    document.querySelectorAll('[data-period]').forEach(button => {
      const active = button.dataset.period === state.period;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('[data-price]').forEach(node => { node.textContent = `$${amounts[state.period][node.dataset.price]}`; });
    document.querySelectorAll('[data-unit]').forEach(node => { node.textContent = state.period === 'monthly' ? '/ month' : '/ year'; });
    document.querySelectorAll('[data-terms]').forEach(node => {
      const plan = node.dataset.terms;
      node.textContent = state.period === 'monthly' ? 'Flexible monthly demo membership' : `$${amounts.monthly[plan] * 12 - amounts.annual[plan]} less than 12 monthly payments`;
    });
    document.querySelectorAll('[data-plan]').forEach(card => {
      const current = card.dataset.plan === state.plan;
      card.classList.toggle('bfl-plan-current', current);
      const ribbon = card.querySelector('.bfl-plan-ribbon');
      if (ribbon) ribbon.hidden = !current && card.dataset.plan !== 'Combined';
    });
    document.querySelectorAll('[data-footnote]').forEach(node => {
      node.textContent = node.dataset.footnote === state.plan ? 'Current demo membership' : 'Simulated checkout · No charges';
    });
  };

  document.querySelectorAll('[data-period]').forEach(button => button.addEventListener('click', () => {
    state.period = button.dataset.period;
    paint();
    persist();
  }));
  document.querySelectorAll('[data-explore]').forEach(button => button.addEventListener('click', () => {
    checkoutTrigger = button;
    pendingPlan = button.dataset.explore;
    document.getElementById('bflCheckoutPlan').textContent = pendingPlan + ' membership';
    document.getElementById('bflCheckoutPeriod').textContent = (state.period === 'monthly' ? 'Monthly' : 'Annual') + ' demo billing';
    document.getElementById('bflCheckoutAcknowledged').checked = false;
    document.getElementById('bflCheckoutError').hidden = true;
    document.getElementById('bflCheckoutPathway').value = state.pathway || '6–8';
    document.getElementById('bflConfirmPrice').textContent = '$' + amounts[state.period][pendingPlan];
    exploreModal.show();
  }));
  modalElement.addEventListener('shown.bs.modal', () => {
    modalElement.querySelector('.modal-content').scrollTop = 0;
  });
  document.getElementById('bflCheckoutForm').addEventListener('submit', event => {
    event.preventDefault();
    if (!event.currentTarget.reportValidity() || !document.getElementById('bflCheckoutAcknowledged').checked) return;
    const confirmation = 'DEMO-' + crypto.randomUUID().replaceAll('-', '').slice(0, 8).toUpperCase();
    const nextState = {...state, plan: pendingPlan, pathway: document.getElementById('bflCheckoutPathway').value, confirmation};
    if (!writeJson(KEY, nextState)) {
      document.getElementById('bflCheckoutError').textContent = 'Your demo membership could not be saved in this browser. Please try again.';
      document.getElementById('bflCheckoutError').hidden = false;
      return;
    }
    state = nextState;
    paint();
    document.getElementById('bflMembershipActivated').textContent = `${state.plan} demo activated`;
    document.getElementById('bflMembershipConfirmation').textContent = confirmation;
    confirming = true;
    modalElement.addEventListener('hidden.bs.modal', () => {
      successModal.show();
      confirming = false;
    }, { once: true });
    exploreModal.hide();
  });
  paint();
})();

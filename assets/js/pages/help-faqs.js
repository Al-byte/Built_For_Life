/**
 * BFL page module: help-faqs
 * Frontend prototype only — not an authenticated backend.
 */
import { initializeNavigation } from '../navigation.js';
import { showToast } from '../common.js';
import { readJson, writeJson } from '../storage.js';

initializeNavigation('help-faqs');

(() => {
  'use strict';
  const search = document.getElementById('bflFaqSearch');
  const rows = [...document.querySelectorAll('[data-faq-item]')];
  const empty = document.getElementById('bflFaqEmpty');
  const status = document.getElementById('bflFaqSearchStatus');
  const normalize = value => String(value).normalize('NFKD').toLocaleLowerCase().trim();
  const updateSearch = () => {
    const query = normalize(search.value);
    let visible = 0;
    rows.forEach(row => {
      const isMatch = !query || normalize(row.textContent).includes(query);
      row.hidden = !isMatch;
      if (isMatch) visible++;
    });
    empty.hidden = visible !== 0;
    status.textContent = query ? `${visible} matching question${visible === 1 ? '' : 's'}` : `Showing all ${visible} questions`;
  };
  search.addEventListener('input', updateSearch);
  document.getElementById('bflFaqClear').addEventListener('click', () => {
    search.value = '';
    updateSearch();
    search.focus();
  });
  updateSearch();

  const feedbackModal = document.getElementById('bflFaqFeedbackModal');
  const feedbackForm = document.getElementById('bflFaqFeedbackForm');
  const feedbackMessage = document.getElementById('bflFaqFeedbackMessage');

  feedbackForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!feedbackForm.reportValidity()) return;
    const entry = {
      category: document.getElementById('bflFaqFeedbackType').value,
      message: feedbackMessage.value.trim(),
      savedAt: new Date().toISOString()
    };
    if (!entry.message) { feedbackMessage.focus(); return; }
    const key = 'bfl-faq-feedback-demo-v1';
    let saved = false;
    try {
      const existing = readJson(key, []);
      const entries = Array.isArray(existing) ? existing : [];
      entries.push(entry);
      saved = writeJson(key, entries.slice(-30));
    } catch (_) { /* Private browsing or storage restrictions can prevent saving. */ }
    bootstrap.Modal.getOrCreateInstance(feedbackModal).hide();
    feedbackForm.reset();
    showToast(document.getElementById('bflFaqToast'), {
      messageElement: document.getElementById('bflFaqToastText'),
      message: saved
        ? 'Demo feedback saved in this browser only. It has not been sent to Built For Life.'
        : 'Browser storage is unavailable. Your feedback was not saved or sent.',
      delay: 4700
    });
  });
})();

/**
 * BFL page module: weekly-playbook
 * Frontend prototype only — not an authenticated backend.
 */
import { initializeNavigation } from '../navigation.js';
import { showToast } from '../common.js';
import { getStoredValue, setStoredValue } from '../storage.js';

initializeNavigation('weekly-playbook');

// All interactions below are prototype-only. Authorization and locking must be enforced server-side in production.
  (() => {
    'use strict';
    const lessons = {
      1: { week: 'Week 1 · Learn', title: 'Being gifted vs. being productive', description: 'Your gifts open the door. Your daily actions move you forward.', prompt: 'Identify one gift you have. How could you use it to complete one useful action this week?' },
      2: { week: 'Week 2 · Do', title: 'Put your gifts to work', description: 'Choose one strength. Turn it into a small, repeatable daily action.', prompt: 'Name one of your strengths, then write down a small daily action that uses that strength.' },
      3: { week: 'Week 3 · Account', title: 'Own your effort', unlock: 'Nov 2, 2026', days: 14 },
      4: { week: 'Week 4 · Reflect', title: 'Progress with a purpose', unlock: 'Nov 9, 2026', days: 21 }
    };
    const lessonModalEl = document.getElementById('bflLessonModal');
    const lessonModal = bootstrap.Modal.getOrCreateInstance(lessonModalEl);
    const lockedModalEl = document.getElementById('bflLockedLessonModal');
    const lockedModal = bootstrap.Modal.getOrCreateInstance(lockedModalEl);
    let unlockTrigger = null;
    let openingSchedule = false;
    let currentLesson = null;
    function notify(message) {
      showToast(document.getElementById('bflDemoToast'), {
        messageElement: document.getElementById('bflToastMessage'), message
      });
    }
    function demoCompleted(week) { return getStoredValue('bfl-playbook-demo-completed-'+week)==='yes'; }
    function setCompleted(week) { setStoredValue('bfl-playbook-demo-completed-'+week,'yes'); }
    function refreshStatus() {
      for (const week of [1,2]) {
        const card = document.querySelector(`[data-week="${week}"]`);
        const step = document.querySelector(`[data-timeline="${week}"]`);
        const done = week === 1 || demoCompleted(week);
        card.dataset.state = done ? 'done' : 'ready';
        step.dataset.state = done ? 'done' : 'ready';
        step.querySelector('.bfl-playbook-timeline-dot').innerHTML = done ? '<i class="bi bi-check-lg" aria-hidden="true"></i>' : String(week);
        const badge = card.querySelector('.bfl-playbook-state');
        badge.innerHTML = done ? '<i class="bi bi-check-lg" aria-hidden="true"></i><span data-status-text>Completed</span>' : '<i class="bi bi-play-btn" aria-hidden="true"></i><span data-status-text>Ready for you</span>';
        const button = card.querySelector('[data-open-lesson]');
        button.innerHTML = (done ? 'Review lesson' : 'Open lesson') + ' <i class="bi bi-arrow-right" aria-hidden="true"></i>';
        if (done) step.removeAttribute('aria-current'); else step.setAttribute('aria-current','step');
      }
    }
    document.querySelectorAll('[data-open-lesson]').forEach(btn => btn.addEventListener('click', () => {
      const week = Number(btn.dataset.openLesson);
      currentLesson = week;
      const data = lessons[week];
      document.getElementById('bflLessonModalWeek').textContent = data.week + (week === 1 ? ' · 12 min' : ' · 10 min');
      document.getElementById('bflLessonModalTitle').textContent = data.title;
      document.getElementById('bflLessonModalDescription').textContent = data.description;
      document.getElementById('bflLessonSectionHeading').textContent = week === 1 ? 'The idea' : 'Your challenge';
      document.getElementById('bflLessonModalPrompt').textContent = week === 1
        ? 'Your gifts are a starting point. Talent, intelligence, and athletic ability become meaningful when you develop them through consistent action. Production means doing something purposeful with what you have.'
        : 'Choose one gift and put it to work. Keep the action small enough to repeat at home, at school, or with your team. Record your effort in your weekly goals.';
      document.getElementById('bflLessonReflection').value = getStoredValue('bfl-playbook-demo-reflection-' + week, '');
      document.getElementById('bflLessonSaveStatus').hidden = true;
      document.getElementById('bflMarkCompleted').innerHTML = (week === 1 || demoCompleted(week) ? 'Save reflection' : 'Complete lesson') + ' <i class="bi bi-check-lg" aria-hidden="true"></i>';
      lessonModal.show();
    }));
    document.querySelectorAll('[data-unlock-details]').forEach(btn => btn.addEventListener('click', () => {
      const week = Number(btn.dataset.unlockDetails);
      const data = lessons[week];
      unlockTrigger = btn;
      document.getElementById('bflLockedLessonName').textContent = `Week ${week}: ${data.title}`;
      document.getElementById('bflLockedLessonDate').textContent = data.unlock;
      document.getElementById('bflLockedLessonDays').textContent = String(data.days);
      lockedModal.show();
    }));
    lockedModalEl.addEventListener('hidden.bs.modal', () => {
      if (!openingSchedule) unlockTrigger?.focus();
    });
    document.getElementById('bflPreviewUnlockSchedule').addEventListener('click', () => {
      openingSchedule = true;
      lockedModalEl.addEventListener('hidden.bs.modal', () => {
        const scheduleEl = document.getElementById('bflUnlockModal');
        scheduleEl.addEventListener('hidden.bs.modal', () => unlockTrigger?.focus(), { once: true });
        bootstrap.Modal.getOrCreateInstance(scheduleEl).show();
        openingSchedule = false;
      }, { once: true });
      lockedModal.hide();
    });
    document.getElementById('bflMarkCompleted').addEventListener('click', () => {
      if (currentLesson == null) return;
      const saved = setStoredValue('bfl-playbook-demo-reflection-' + currentLesson, document.getElementById('bflLessonReflection').value);
      const status = document.getElementById('bflLessonSaveStatus');
      status.hidden = false;
      if (!saved) {
        status.textContent = 'Your reflection could not be saved in this browser. Please try again.';
        return;
      }
      if (currentLesson === 2 && !demoCompleted(2)) {
        if (!setStoredValue('bfl-playbook-demo-completed-2', 'yes')) {
          status.textContent = 'Reflection saved, but lesson completion could not be saved. Please try again.';
          return;
        }
        refreshStatus();
      }
      document.getElementById('bflMarkCompleted').innerHTML = 'Save reflection <i class="bi bi-check-lg" aria-hidden="true"></i>';
      status.textContent = 'Your reflection is saved in this browser.';

    });
    lessonModalEl.addEventListener('shown.bs.modal', () => {
      lessonModalEl.querySelector('.modal-content').scrollTop = 0;
    });
    refreshStatus();
  })();

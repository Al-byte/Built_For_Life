/**
 * BFL page module: dashboard
 * Frontend prototype only — not an authenticated backend.
 */
import { getStoredValue, setStoredValue } from '../storage.js';
import { initializeNavigation } from '../navigation.js';


initializeNavigation('dashboard');

const newGoalForm = document.getElementById('bflAddGoalForm');
    newGoalForm.addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('bflNewGoalName');
      if (!newGoalForm.reportValidity()) return;
      const target = Number(document.getElementById('bflNewGoalTarget').value);
      const unit = document.getElementById('bflNewGoalUnit').value;
      const category = document.getElementById('bflNewGoalCategory').value;
      const name = input.value.trim();
      if (!name) return;
      const goalId = 'bflAddedGoal' + Date.now();
      const row = document.createElement('div');
      row.className = 'bfl-goal-row';
      const checkbox = document.createElement('input');
      checkbox.className = 'bfl-goal-check';
      checkbox.type = 'checkbox';
      checkbox.id = goalId;
      checkbox.setAttribute('aria-label', 'Mark ' + name + ' complete');
      const info = document.createElement('div');
      info.className = 'bfl-goal-info';
      const heading = document.createElement('div');
      heading.className = 'bfl-goal-heading';
      const label = document.createElement('label');
      label.className = 'bfl-goal-name';
      label.htmlFor = goalId;
      label.textContent = name;
      const count = document.createElement('span');
      count.className = 'bfl-goal-count';
      count.textContent = '0 / ' + target + ' ' + unit;
      heading.append(label, count);
      const track = document.createElement('div');
      track.className = 'bfl-goal-track';
      track.setAttribute('role', 'progressbar');
      track.setAttribute('aria-label', name + ' progress');
      track.setAttribute('aria-valuenow', '0');
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', String(target));
      const fill = document.createElement('div');
      fill.className = 'bfl-goal-fill';
      fill.style.width = '0%';
      track.appendChild(fill);
      checkbox.addEventListener('change', () => {
        const done = checkbox.checked;
        fill.style.width = done ? '100%' : '0%';
        count.textContent = (done ? target : 0) + ' / ' + target + ' ' + unit;
        track.setAttribute('aria-valuenow', done ? String(target) : '0');
      });
      const pillar = document.createElement('small');
      pillar.textContent = category;
      info.append(heading, pillar, track);
      row.append(checkbox, info);
      document.getElementById('bflGoalsList').appendChild(row);
      newGoalForm.reset();
      bootstrap.Modal.getOrCreateInstance(document.getElementById('bflAddGoalModal')).hide();
    });

// Both dashboard buttons use this single Bootstrap dialog.
const lessonDialog = document.getElementById('bflDashboardLessonModal');
const reflection = document.getElementById('bflDashboardReflection');
const completeLesson = document.getElementById('bflDashboardCompleteLesson');
const lessonStatus = document.getElementById('bflDashboardLessonStatus');
const completionKey = 'bfl-playbook-demo-completed-2';
const reflectionKey = 'bfl-playbook-demo-reflection-2';

function refreshLessonCompletion() {
  const completed = getStoredValue(completionKey) === 'yes';
  completeLesson.disabled = completed;
  completeLesson.innerHTML = (completed ? 'Lesson completed' : 'Complete lesson') +
    ' <i class="bi bi-check-lg" aria-hidden="true"></i>';
}
lessonDialog.addEventListener('show.bs.modal', () => {
  reflection.value = getStoredValue(reflectionKey, '');
  lessonStatus.hidden = true;
  refreshLessonCompletion();
});
lessonDialog.addEventListener('shown.bs.modal', () => {
  lessonDialog.querySelector('.modal-content').scrollTop = 0;
});
reflection.addEventListener('input', () => {
  if (!setStoredValue(reflectionKey, reflection.value)) {
    lessonStatus.textContent = 'Your reflection could not be saved in this browser.';
    lessonStatus.hidden = false;
  }
});
completeLesson.addEventListener('click', () => {
  const reflectionSaved = setStoredValue(reflectionKey, reflection.value);
  const completed = setStoredValue(completionKey, 'yes');
  refreshLessonCompletion();
  lessonStatus.textContent = completed
    ? (reflectionSaved ? 'Lesson completed. Your reflection and progress are saved in this browser.' : 'Lesson completed, but your reflection could not be saved.')
    : 'Your progress could not be saved in this browser. Please try again.';
  lessonStatus.hidden = false;
});

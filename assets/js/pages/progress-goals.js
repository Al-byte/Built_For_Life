/**
 * BFL page module: progress-goals
 * Frontend prototype only — not an authenticated backend.
 */
import { defaultProgressState as defaults } from '../progress-defaults.js';
import { initializeNavigation } from '../navigation.js';
import { byId as el, escapeHtml, cloneData as clone, clampNumber as number, showToast } from '../common.js';
import { readJson, writeJson } from '../storage.js';

initializeNavigation('progress-goals');

(() => {
  'use strict';
  // Browser-only prototype. Data is not uploaded or shared between accounts.
  const KEY = 'bfl-progress-goals-prototype-v1';


let state = clone(defaults);
  try {
    const stored = readJson(KEY);
    if(stored && Array.isArray(stored.goals) && stored.grades && stored.checkin){
      state = {goals:stored.goals.slice(0,15), grades:stored.grades,checkin:stored.checkin};
    }
  } catch(e) { /* Browsers may block storage; the page still works in memory. */ }

const persist = () => writeJson(KEY, state);


const toast = message => showToast(el('bflToast'), { messageElement: el('bflToastBody'), message, delay: 2700 });
  function renderGoals(){
    el('bflGoalCards').innerHTML=state.goals.map(g=>{
      const done=number(g.done,0,999), target=Math.max(1,number(g.target,1,999));
      const percent=Math.min(100,Math.round(done/target*100));
      const finished=done>=target;
      return `<article class="bfl-goal-card">
        <div><span class="bfl-goal-category">${escapeHtml(g.category)}</span>
        <h3 class="bfl-goal-title">${escapeHtml(g.name)}</h3>
        <p class="bfl-goal-description">${escapeHtml(g.description)}</p></div>
        <div class="bfl-goal-tracking">
          <div class="bfl-goal-track" role="progressbar" aria-label="${escapeHtml(g.name)} progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><div class="bfl-goal-fill" style="width:${percent}%"></div></div>
          <div class="bfl-goal-stat"><strong>${done} of ${target} ${escapeHtml(g.unit)}</strong><span>${percent}%</span></div>
          <div class="bfl-goal-actions">${finished ? `<span class="bfl-goal-complete">Goal complete <i class="bi bi-check-lg" aria-hidden="true"></i></span>` : `<button type="button" class="bfl-solid-button" data-add-goal="${escapeHtml(g.id)}">+1 progress <i class="bi bi-plus-lg" aria-hidden="true"></i></button>`}
          <button type="button" class="bfl-goal-edit" data-edit-goal="${escapeHtml(g.id)}">Edit goal</button></div>
        </div></article>`;
    }).join('');
  }
  function renderGrades(){
    const grades=[['Mathematics','math'],['Language Arts','language'],['Science','science']];
    el('bflGradesList').innerHTML=grades.map(([label,key])=>{
      const grade=number(state.grades[key],0,100);
      return `<div class="bfl-grade-row"><span class="bfl-grade-name">${label}</span><span class="bfl-grade-value">${grade}%</span><div class="bfl-grade-track" role="progressbar" aria-label="${label} percentage" aria-valuenow="${grade}" aria-valuemin="0" aria-valuemax="100"><div class="bfl-grade-fill" style="width:${grade}%"></div></div></div>`;
    }).join('');
  }
  function renderCheckin(){
    document.querySelectorAll('[data-mood]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.mood===state.checkin.mood)));
    el('bflCheckinNotes').value=state.checkin.notes||'';
    el('bflCheckinStatus').textContent=state.checkin.savedAt?'Last saved in this browser: '+state.checkin.savedAt:'';
  }
  let editing = null;
  const goalModal = bootstrap.Modal.getOrCreateInstance(el('bflGoalModal'));
  const gradeModal = bootstrap.Modal.getOrCreateInstance(el('bflGradeModal'));
  function openGoal(id=null){
    editing=id;
    const goal=state.goals.find(g=>g.id===id);
    el('bflGoalModalTitle').textContent=goal?'Edit your goal.':'Start with one small action.';
    el('bflGoalEditFields').hidden = !goal;
    el('bflGoalTarget').max = goal ? Math.max(20, goal.target) : 20;
    el('bflGoalName').value=goal?.name||'';
    el('bflGoalDescription').value=goal?.description||'A small action, practiced consistently.';
    el('bflGoalCategory').value=goal?.category||'Character';
    el('bflGoalDone').value=goal?.done??0;
    el('bflGoalTarget').value=goal?.target??5;
    const unit = goal?.unit || 'days';
    const unitSelect = el('bflGoalUnit');
    if (![...unitSelect.options].some(option => option.value === unit)) unitSelect.add(new Option(unit, unit));
    unitSelect.value = unit;
    goalModal.show();
  }
  el('bflSetGoal').addEventListener('click',()=>{
    if(state.goals.length>=15){toast('This prototype allows up to 15 sample goals.');return;}
    openGoal();
  });
  el('bflGoalCards').addEventListener('click', e=>{
    const add=e.target.closest('[data-add-goal]');
    const edit=e.target.closest('[data-edit-goal]');
    if(add){const goal=state.goals.find(g=>g.id===add.dataset.addGoal);if(!goal)return;
      goal.done=Math.min(goal.target,number(goal.done,0,999)+1);persist();renderGoals();toast('Sample goal progress updated.');}
    if(edit)openGoal(edit.dataset.editGoal);
  });
  el('bflGoalForm').addEventListener('submit',e=>{
    e.preventDefault();
    if (!e.target.reportValidity()) return;
    const done=number(el('bflGoalDone').value,0,999), target=number(el('bflGoalTarget').value,1,Number(el('bflGoalTarget').max));
    const item={id:editing||('goal-'+Date.now().toString(36)),name:el('bflGoalName').value.trim(),
      category:el('bflGoalCategory').value,description:el('bflGoalDescription').value.trim()||'A small action, practiced consistently.',
      done:Math.min(done,target),target,unit:el('bflGoalUnit').value.trim()};
    if(!item.name||!item.unit){e.target.reportValidity();return;}
    const index=state.goals.findIndex(g=>g.id===editing);
    if(index>=0)state.goals[index]=item;else state.goals.push(item);
    persist();renderGoals();goalModal.hide();toast('Sample goal saved in this browser.');
  });
  document.querySelectorAll('[data-mood]').forEach(button=>button.addEventListener('click',()=>{
    state.checkin.mood=button.dataset.mood;
    document.querySelectorAll('[data-mood]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  }));
  el('bflSaveCheckin').addEventListener('click',()=>{
    state.checkin.notes=el('bflCheckinNotes').value.trim();
    state.checkin.savedAt=new Date().toLocaleString(undefined,{dateStyle:'medium',timeStyle:'short'});
    persist();renderCheckin();toast('Sample check-in saved to this browser.');
  });
  el('bflUpdateGrades').addEventListener('click',()=>{
    el('bflGradeMath').value=state.grades.math;
    el('bflGradeLanguage').value=state.grades.language;
    el('bflGradeScience').value=state.grades.science;
    gradeModal.show();
  });
  el('bflGradeForm').addEventListener('submit',e=>{
    e.preventDefault();state.grades={math:number(el('bflGradeMath').value,0,100),language:number(el('bflGradeLanguage').value,0,100),science:number(el('bflGradeScience').value,0,100)};
    persist();renderGrades();gradeModal.hide();toast('Sample grades updated in this browser.');
  });
  renderGoals();renderGrades();renderCheckin();
})();

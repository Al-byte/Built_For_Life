/**
 * BFL page module: curriculum
 * Frontend prototype only — not an authenticated backend.
 */
import { defaultProgressState } from '../progress-defaults.js';
import { initializeNavigation } from '../navigation.js';
import { readJson, writeJson } from '../storage.js';

initializeNavigation('curriculum');

// Prototype-only data. Supabase can replace this content without changing the layout.
    const bflCurriculumStages = {
      '6–8': {
        verb: 'Understand', title: 'The Foundation Years',
        description: 'Build confidence through movement, kindness, listening, and simple everyday wins.'
      },
      '9–11': {
        verb: 'Practice', title: 'The Building Years',
        description: 'Turn good intentions into habits through teamwork, responsibility, and everyday choices.'
      },
      '12–14': {
        verb: 'Own', title: 'The Identity Years',
        description: 'Explore identity, self-control, and accountability while building standards that last.'
      },
      '15–17': {
        verb: 'Live & Lead', title: 'The Preparation Years',
        description: 'Prepare for what comes next through leadership, decision-making, service, and life skills.'
      }
    };
    // Exact Month 1 mentoring lessons from the four age-pathway screenshots.
    const bflMonthOneLessons = {
      '6–8': [
        {title: 'Know your strengths', description: 'Name one thing you do well and one thing you want to practice.'},
        {title: 'Practice kindness', description: 'Choose one kind action to do at home today.'},
        {title: 'Follow through', description: 'Finish a small task before starting your favorite activity.'},
        {title: 'Be a good teammate', description: 'Invite someone to join your game and take turns.'}
      ],
      '9–11': [
        {title: 'Own your effort', description: 'Pick a task and give it your full effort for 15 minutes.'},
        {title: 'Respect in action', description: 'Show respect when someone makes a choice you disagree with.'},
        {title: 'Build better habits', description: 'Write a three-step routine for getting ready for school.'},
        {title: 'Lead by example', description: 'Help your team finish a challenge without taking over.'}
      ],
      '12–14': [
        {title: 'Gifted vs. productive', description: 'Name a gift you have. Choose one action that turns it into production.'},
        {title: 'Respond, don’t react', description: 'Practice a five-second pause before responding to a frustrating moment.'},
        {title: 'The standard you set', description: 'Choose one personal standard for school, home, or your team.'},
        {title: 'Accountability in action', description: 'Own a missed commitment and write your next step to repair it.'}
      ],
      '15–17': [
        {title: 'Purpose into practice', description: 'Connect one strength to a goal you can act on this week.'},
        {title: 'Lead under pressure', description: 'Write how you will respond when your values are tested.'},
        {title: 'Prepare for opportunity', description: 'Plan three steps toward your next school, work, or athletic opportunity.'},
        {title: 'Leave a legacy', description: 'Design a small service action that benefits someone else.'}
      ]
    };
    const bflMonths = [
      {title:"Identity & self-awareness", heading:'Learning who I am', focus:'See the strengths you already have.', description:'Explore personal strengths, interests, and values through simple activities and encouraging conversations.'},
      {title:"Habits & discipline", heading:'Small actions, lasting habits', focus:'Grow through steady effort.', description:'Practice everyday routines that help build positive habits and confidence.'},
      {title:"Respect & character", heading:'Character in action', focus:'Choose kindness every day.', description:'Explore respect, empathy, and treating other people well.'},
      {title:"Communication", heading:'Speak and listen with purpose', focus:'Make every conversation count.', description:'Practice listening, understanding, and expressing thoughts with care.'},
      {title:"Relationships & teamwork", heading:'Better together', focus:'Help others succeed.', description:'Explore cooperation, encouragement, and working toward shared goals.'},
      {title:"Leadership", heading:'Lead by example', focus:'Leadership starts with service.', description:'Explore how everyday choices can positively influence a community.'},
      {title:"Decision-making", heading:'Choose with purpose', focus:'Think ahead and act wisely.', description:'Consider consequences and practice making responsible decisions.'},
      {title:'Resilience', heading:'Keep growing through challenges', focus:'Learn and try again.', description:'Practice recovering from setbacks, adapting, and asking for support.'},
      {title:"Responsibility", heading:'Owning your choices', focus:'Build trust through action.', description:'Learn how consistent choices and follow-through strengthen responsibility.'},
      {title:'Goal setting', heading:'Turn intentions into action', focus:'Choose a clear next step.', description:'Set a meaningful goal and break it into small, achievable steps.'},
      {title:"Service & impact", heading:'Use your gifts for good', focus:'Your gifts can help others.', description:'Find practical ways to contribute and serve.'},
      {title:'Purpose & preparation', heading:'Prepare for what comes next', focus:'Connect your gifts with purpose.', description:'Reflect on your strengths and prepare practical steps toward future opportunities.'}
    ];
    let bflSelectedAge = '6–8';
    let bflSelectedTrack = 'Training';
    const bflAccountStorageKey = 'bfl-account-demo-v1';
    try {
      const saved = readJson(bflAccountStorageKey, {});
      if (Object.hasOwn(bflCurriculumStages, saved.pathway)) bflSelectedAge = saved.pathway;
    } catch (error) { /* Works without local storage */ }

    const bflMonthSelect = document.getElementById('bflCurriculumMonth');
    function bflRenderCurriculum() {
      const stage = bflCurriculumStages[bflSelectedAge];
      document.querySelectorAll('[data-age]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.age === bflSelectedAge)));
      document.querySelectorAll('[data-track]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.track === bflSelectedTrack)));
      document.getElementById('bflCurriculumOverline').textContent = `${stage.verb} · Ages ${bflSelectedAge}`;
      document.getElementById('bflCurriculumBannerTitle').textContent = stage.title;
      document.getElementById('bflCurriculumBannerDescription').textContent = stage.description;
      document.getElementById('bflCurriculumBannerAge').textContent = bflSelectedAge;
      const index = Number(bflMonthSelect.value);
      const month = bflMonths[index];
      document.getElementById('bflCurriculumMonthHeading').textContent = month.title;
      const weekTypes = ['LEARN', 'DO', 'ACCOUNT', 'REFLECT'];
      const monthlyWeeks = [
        {title:`Explore ${month.title.toLowerCase()}`, description:month.description},
        {title:'Put it into practice', description:`Choose one small action that helps you practice ${month.title.toLowerCase()} this week.`},
        {title:'Show your progress', description:'Set a simple goal, follow through, and share your progress with your mentor.'},
        {title:'Look back and grow', description:'Reflect on one thing you learned and one way you want to keep growing.'}
      ];
      const trainingWeeks = [
        {title:'Move with control', description:`Explore what ${month.title.toLowerCase()} means at ages ${bflSelectedAge}. Connect the theme to a moment at school, home, or on your team.`},
        {title:'Build your engine', description:`Choose one age-appropriate action connected to ${month.title.toLowerCase()}. Practice it and notice what changes.`},
        {title:'Strength with intention', description:'Talk with a trusted adult about what you tried, what worked, and where you need support.'},
        {title:'Compete as a teammate', description:'Identify one lesson from this month and one next step you will carry forward.'}
      ];
      // Mentoring Month 1 matches the screenshots for every age pathway.
      // Other months and the Training track are illustrative placeholders until curriculum is finalized.
      const selectedWeeks = bflSelectedTrack === 'Training' ? trainingWeeks
        : index === 0 ? bflMonthOneLessons[bflSelectedAge] : monthlyWeeks;
      document.querySelectorAll('[data-week-card]').forEach((card, i) => {
        const week = selectedWeeks[i];
        card.querySelector('[data-week-label]').textContent = `WEEK ${String(i + 1).padStart(2, '0')} / ${weekTypes[i]}`;
        card.querySelector('[data-week-title]').textContent = week.title;
        card.dataset.previewDescription = week.description;
        const trainingDescriptions = ['Practice balance and body control with slow, steady movements.', 'Set a movement goal you can repeat consistently.', 'Focus on technique and controlled movement rather than maximum effort.', 'Encourage your teammates and practice communicating clearly.'];
        card.querySelector('[data-week-description]').textContent = bflSelectedTrack === 'Training' ? trainingDescriptions[i] : week.description;
        card.querySelector('.bfl-curriculum-week-icon').innerHTML = bflSelectedTrack === 'Training'
          ? '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><g transform="rotate(-45 12 12)"><path d="M6 12h12M4 9v6M7 7v10M17 7v10M20 9v6M2 12h2M20 12h2"/></g></svg>'
          : `<i aria-hidden="true" class="bi bi-${['bullseye', 'heart', 'shield-check', 'flag'][i]}"></i>`;
      });
    }
    document.querySelectorAll('[data-age]').forEach(button => {
      button.addEventListener('click', () => {
        bflSelectedAge = button.dataset.age;
        try {
          const saved = readJson(bflAccountStorageKey, {});
          writeJson(bflAccountStorageKey, {...saved, pathway:bflSelectedAge});
        } catch (error) { /* Works without local storage */ }
        bflRenderCurriculum();
      });
    });
    document.querySelectorAll('[data-track]').forEach(button => {
      button.addEventListener('click', () => { bflSelectedTrack = button.dataset.track; bflRenderCurriculum(); });
    });
    bflMonthSelect.addEventListener('change', bflRenderCurriculum);
    let trainingTrigger = null;
    document.querySelectorAll('[data-explore-week]').forEach(button => {
      button.addEventListener('click', () => {
        const card = button.closest('[data-week-card]');
        if (bflSelectedTrack === 'Training') {
          trainingTrigger = button;
          document.getElementById('bflTrainingTheme').textContent = 'Sample curriculum · ' + bflMonths[Number(bflMonthSelect.value)].title;
          document.getElementById('bflTrainingTitle').textContent = card.querySelector('[data-week-title]').textContent;
          document.getElementById('bflTrainingAge').textContent = 'Ages ' + bflSelectedAge + ' · Training';
          document.getElementById('bflTrainingDescription').textContent = card.dataset.previewDescription;
          bootstrap.Modal.getOrCreateInstance(document.getElementById('bflTrainingPreview')).show();
          return;
        }
        document.getElementById('bflCurriculumLessonModalOverline').textContent = card.querySelector('[data-week-label]').textContent;
        document.getElementById('bflCurriculumLessonModalTitle').textContent = card.querySelector('[data-week-title]').textContent;
        document.getElementById('bflCurriculumLessonModalDescription').textContent = card.querySelector('[data-week-description]').textContent;
        bootstrap.Modal.getOrCreateInstance(document.getElementById('bflCurriculumLessonModal')).show();
      });
    });
    bflRenderCurriculum();

const trainingPreview = document.getElementById('bflTrainingPreview');
const relatedGoalModal = document.getElementById('bflRelatedGoalModal');
let switchingToGoal = false;
[trainingPreview, relatedGoalModal].forEach(modal => {
  modal.addEventListener('shown.bs.modal', () => {
    modal.querySelector('.modal-content').scrollTop = 0;
  });
});
trainingPreview.addEventListener('hidden.bs.modal', () => {
  if (!switchingToGoal) trainingTrigger?.focus();
});
document.getElementById('bflRelatedGoal').addEventListener('click', () => {
  switchingToGoal = true;
  document.getElementById('bflRelatedGoalForm').reset();
  document.getElementById('bflRelatedGoalStatus').hidden = true;
  trainingPreview.addEventListener('hidden.bs.modal', () => {
    bootstrap.Modal.getOrCreateInstance(relatedGoalModal).show();
    switchingToGoal = false;
  }, {once: true});
  bootstrap.Modal.getOrCreateInstance(trainingPreview).hide();
});
relatedGoalModal.addEventListener('hidden.bs.modal', () => trainingTrigger?.focus());
document.getElementById('bflRelatedGoalForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const name = document.getElementById('bflRelatedGoalName').value.trim();
  const target = Number(document.getElementById('bflRelatedGoalTarget').value);
  if (!name || !Number.isInteger(target) || target < 1 || target > 20) return;
  const key = 'bfl-progress-goals-prototype-v1';
  const state = readJson(key, JSON.parse(JSON.stringify(defaultProgressState)));
  const status = document.getElementById('bflRelatedGoalStatus');
  status.hidden = false;
  if (!state || !Array.isArray(state.goals) || !state.grades || !state.checkin) {
    status.textContent = 'Saved goal data could not be read. Please check Progress & Goals.';
    return;
  }
  if (state.goals.length >= 15) {
    status.textContent = 'This prototype allows up to 15 sample goals.';
    return;
  }
  state.goals.push({
    id: 'goal-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2,7),
    name, category: document.getElementById('bflRelatedGoalCategory').value,
    target, unit: document.getElementById('bflRelatedGoalUnit').value, done: 0,
    description: 'Related lesson: ' + document.getElementById('bflTrainingTitle').textContent
  });
  if (!writeJson(key, state)) {
    status.textContent = 'Your goal could not be saved in this browser. Please try again.';
    return;
  }
  form.reset();
  status.textContent = 'Goal saved. You can track it on Progress & Goals.';
});

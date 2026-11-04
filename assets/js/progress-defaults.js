/** Initial browser-local progress data shared by goal entry points. */
export const defaultProgressState = {
    goals: [
      {id:'goal-1', category:'Academic success', name:'Turn in every assignment', description:'A small action, practiced consistently.', done:3, target:5, unit:'days'},
      {id:'goal-2', category:'Physical development', name:'Move with purpose', description:'A small action, practiced consistently.', done:2, target:3, unit:'sessions'},
      {id:'goal-3', category:'Character', name:'Practice a pause before reacting', description:'A small action, practiced consistently.', done:5, target:5, unit:'days'}
    ],
    grades:{math:86, language:91, science:88}, checkin:{mood:'on-track',notes:'',savedAt:''}
  };

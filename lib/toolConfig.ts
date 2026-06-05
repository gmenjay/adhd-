// ─── Tool type definitions ─────────────────────────────────────────────────

export type ToolType =
  | 'timer'
  | 'list'
  | 'pairs'
  | 'form'
  | 'checklist'
  | 'coin'
  | 'bingo'
  | 'blackjack'
  | 'truthdare'
  | 'kanban'
  | 'matrix'
  | 'rank'
  | 'rewards'
  | 'contract'
  | 'breakdown'
  | 'wanted'
  | 'proscons'
  | 'cards'
  | 'prompt'
  | 'steps';

export interface ToolConfig {
  type: ToolType;
  [key: string]: unknown;
}

// ─── Per-tool config shapes ────────────────────────────────────────────────

export interface TimerConfig    extends ToolConfig { type:'timer';     minutes:number; mode?:'countdown'|'stopwatch'|'pomodoro'|'estimate'; workMins?:number; breakMins?:number; label?:string; }
export interface ListConfig     extends ToolConfig { type:'list';      placeholder?:string; checkable?:boolean; addLabel?:string; emptyMsg?:string; hint?:string; }
export interface PairsConfig    extends ToolConfig { type:'pairs';     col1:string; col2:string; ph1?:string; ph2?:string; hint?:string; }
export interface FormConfig     extends ToolConfig { type:'form';      fields:{ key:string; label:string; placeholder?:string; multiline?:boolean; rows?:number }[]; hint?:string; }
export interface ChecklistConfig extends ToolConfig { type:'checklist'; items:string[]; userFillable?:boolean; hint?:string; }
export interface CoinConfig     extends ToolConfig { type:'coin';      heads?:string; tails?:string; }
export interface BingoConfig    extends ToolConfig { type:'bingo';     categories:string[]; }
export interface BlackjackConfig extends ToolConfig { type:'blackjack'; taskCount?:number; }
export interface TruthDareConfig extends ToolConfig { type:'truthdare'; truth:string; dare:string; }
export interface KanbanConfig   extends ToolConfig { type:'kanban';    columns?:string[]; }
export interface MatrixConfig   extends ToolConfig { type:'matrix';    xLabel?:string; yLabel?:string; q1?:string; q2?:string; q3?:string; q4?:string; }
export interface RankConfig     extends ToolConfig { type:'rank';      levels?:string[]; hint?:string; }
export interface RewardsConfig  extends ToolConfig { type:'rewards';   hint?:string; }
export interface ContractConfig extends ToolConfig { type:'contract';  fields:{ key:string; label:string; placeholder?:string }[]; hint?:string; }
export interface BreakdownConfig extends ToolConfig { type:'breakdown'; hint?:string; }
export interface WantedConfig   extends ToolConfig { type:'wanted'; }
export interface ProsConsConfig extends ToolConfig { type:'proscons';  context?:string; }
export interface CardsConfig    extends ToolConfig { type:'cards';     suits:{ label:string; emoji:string; items:string[] }[]; hint?:string; }
export interface PromptConfig   extends ToolConfig { type:'prompt';    label:string; placeholder?:string; hint?:string; }
export interface StepsConfig    extends ToolConfig { type:'steps';     steps:string[]; noteLabel?:string; notePlaceholder?:string; }

// ─── Strategy → tool mapping (all 92 strategies) ──────────────────────────

const T: Record<string, ToolConfig> = {

  // ── STUCK 1.1 ─────────────────────────────────────────────────────────
  'stuck-hit-list': {
    type: 'wanted',
  } as WantedConfig,

  'stuck-heads-tails': {
    type: 'coin',
    heads: 'Do it today!',
    tails: 'Guilt-free pass — skip it.',
  } as CoinConfig,

  'stuck-roadblocks': {
    type: 'pairs',
    col1: 'What's the roadblock?',
    col2: 'Possible workaround?',
    ph1: 'e.g. Don\'t know where to start',
    ph2: 'e.g. Just open the file',
    hint: 'Think systems, not willpower.',
  } as PairsConfig,

  'stuck-music-challenge': {
    type: 'timer',
    minutes: 3,
    mode: 'countdown',
    label: 'Race the song. Go until the music stops.',
  } as TimerConfig,

  'stuck-task-adjacency': {
    type: 'steps',
    steps: [
      'Name the task you\'ve been avoiding.',
      'Think of something small that\'s near it — same room, same app, same topic.',
      'Do that small adjacent thing first.',
      'Notice if starting the adjacent thing pulls you toward the real task.',
    ],
    noteLabel: 'What\'s your adjacent task?',
    notePlaceholder: 'e.g. Open the doc. Just open it.',
  } as StepsConfig,

  'stuck-body-doubling': {
    type: 'timer',
    minutes: 25,
    mode: 'countdown',
    label: 'Work alongside someone. Put on headphones. Begin.',
  } as TimerConfig,

  'stuck-verbal-processing': {
    type: 'prompt',
    label: 'What are you about to do? Say it out loud, then write it here.',
    placeholder: 'I\'m going to… starting with…',
    hint: 'Talking through a plan activates a different part of your brain than just thinking it.',
  } as PromptConfig,

  // ── STUCK 1.2 ─────────────────────────────────────────────────────────
  'stuck-pros-cons': {
    type: 'proscons',
    context: 'What are you deciding?',
  } as ProsConsConfig,

  'stuck-fortune-teller': {
    type: 'cards',
    hint: 'Add up to 8 tasks. The fortune teller picks one.',
    suits: [
      { label: 'Your tasks', emoji: '✨', items: [] },
    ],
  } as CardsConfig,

  'stuck-dice-roll': {
    type: 'cards',
    hint: 'Add your tasks. Roll the die. That\'s where you start.',
    suits: [{ label: 'Tasks', emoji: '🎲', items: [] }],
  } as CardsConfig,

  'stuck-decisions-faster': {
    type: 'steps',
    steps: [
      'Figure out your criteria for "success" — what does a good outcome actually look like?',
      'Try to stay objective. What would you tell a friend to do?',
      'Set a time limit: you have 5 minutes to decide. Go.',
      'Trust your gut. Most decisions aren\'t permanent.',
      'Write your choice below.',
    ],
    noteLabel: 'My decision:',
    notePlaceholder: 'I\'m going with…',
  } as StepsConfig,

  'stuck-coin-spin': {
    type: 'coin',
    heads: 'Start this task first.',
    tails: 'Skip it — guilt-free.',
  } as CoinConfig,

  // ── STUCK 1.3 ─────────────────────────────────────────────────────────
  'stuck-half-ass': {
    type: 'proscons',
    context: 'What project or task are you half-assing?',
  } as ProsConsConfig,

  'stuck-realistic-expectations': {
    type: 'pairs',
    col1: 'Old expectation',
    col2: 'Good enough version',
    ph1: 'e.g. Clean the whole house',
    ph2: 'e.g. Just do the dishes',
    hint: 'A baby step that\'s better than nothing counts.',
  } as PairsConfig,

  'stuck-inbox-sprint': {
    type: 'timer',
    minutes: 30,
    mode: 'countdown',
    label: 'How many emails can you clear in 30 minutes? Go.',
  } as TimerConfig,

  'stuck-speed-run': {
    type: 'timer',
    minutes: 10,
    mode: 'countdown',
    label: 'Speed through it. Perfection is not the goal. Done is.',
  } as TimerConfig,

  'stuck-timer-challenge': {
    type: 'breakdown',
    hint: 'Assign a time limit to each step. Total it up. Race the clock.',
  } as BreakdownConfig,

  // ── STUCK 1.4 ─────────────────────────────────────────────────────────
  'stuck-distractions-list': {
    type: 'pairs',
    col1: 'Distraction',
    col2: 'Workaround I\'d actually try',
    ph1: 'e.g. Phone notifications',
    ph2: 'e.g. Put phone face-down in other room',
    hint: 'No-bullshit time. What would you actually do?',
  } as PairsConfig,

  'stuck-time-wasters': {
    type: 'form',
    hint: 'Name your top time-wasters per category.',
    fields: [
      { key: 'apps',       label: 'Top 5 time-wasting apps',       placeholder: 'e.g. TikTok, Reddit, YouTube…',       multiline: true, rows: 3 },
      { key: 'activities', label: 'Top 5 time-wasting activities',  placeholder: 'e.g. Scrolling, reorganizing my desk…', multiline: true, rows: 3 },
      { key: 'people',     label: 'Top 5 time-wasting social traps',placeholder: 'e.g. Group chats, certain coworkers…',  multiline: true, rows: 3 },
      { key: 'plan',       label: 'One thing I\'ll actually change', placeholder: 'Starting with…',                        multiline: true, rows: 2 },
    ],
  } as FormConfig,

  'stuck-stop-screens': {
    type: 'checklist',
    hint: 'Pick a difficulty level and check off each challenge you complete.',
    items: [
      '🟢 EASY — Rearrange your phone home screen, apps on last page',
      '🟢 EASY — Don\'t leave phone within arm\'s reach',
      '🟡 NORMAL — Disable push notifications',
      '🟡 NORMAL — Put phone on airplane mode while working',
      '🔴 HARD — Uninstall one app you waste time on',
      '🔴 HARD — Leave phone in another room for 1 hour',
      '⚫ LEGENDARY — Phone off for a full work block',
      '⚫ LEGENDARY — No screens for the first hour after waking',
    ],
    userFillable: true,
  } as ChecklistConfig,

  'stuck-idea-parking-lot': {
    type: 'list',
    placeholder: 'Park an idea here…',
    checkable: false,
    addLabel: 'Park it',
    emptyMsg: 'No ideas parked yet.',
    hint: 'When a thought interrupts you, drop it here and get back to work.',
  } as ListConfig,

  'stuck-dream-workstation': {
    type: 'form',
    hint: 'Design your ideal setup. Then build toward it.',
    fields: [
      { key: 'place',    label: 'Favorite place to work',          placeholder: 'e.g. Coffee shop, corner of bedroom…' },
      { key: 'clothes',  label: 'Favorite clothes to work in',     placeholder: 'e.g. Hoodie and sweatpants, always' },
      { key: 'decor',    label: 'Desk decorations that help',      placeholder: 'e.g. One plant, no clutter, a candle' },
      { key: 'supplies', label: 'Office supplies you love',        placeholder: 'e.g. Specific pens, notebooks…' },
      { key: 'drink',    label: 'Morning drink ritual',            placeholder: 'e.g. Coffee before anything else' },
      { key: 'snack',    label: 'Afternoon snack',                 placeholder: 'e.g. Something crunchy' },
    ],
  } as FormConfig,

  'stuck-focus-mixtape': {
    type: 'list',
    placeholder: 'Song or album to put on repeat…',
    checkable: false,
    addLabel: 'Add to mixtape',
    emptyMsg: 'No tracks yet.',
    hint: 'Music you can loop without getting distracted by it. Focus-mode only.',
  } as ListConfig,

  // ── OVERWHELMED 2.1 ───────────────────────────────────────────────────
  'ow-visualization': {
    type: 'steps',
    steps: [
      'Close your eyes. Take a breath.',
      'Pick the one thing you want to accomplish.',
      'Visualize the very first step — what do you physically do first?',
      'Then what? And then what? Walk through every step.',
      'See yourself finishing. What does that feel like?',
      'Open your eyes. Write the first step below.',
    ],
    noteLabel: 'My first step is:',
    notePlaceholder: 'As small as possible…',
  } as StepsConfig,

  'ow-task-breakdown': {
    type: 'breakdown',
    hint: 'Smash the task into steps, then sub-steps, until everything feels doable.',
  } as BreakdownConfig,

  'ow-batching': {
    type: 'breakdown',
    hint: 'List all tasks, find the repeated steps, and do those steps for ALL tasks at once.',
  } as BreakdownConfig,

  'ow-break-down-tasks': {
    type: 'breakdown',
    hint: 'Envision done. Write main steps. Pull each apart. Repeat until the list looks manageable.',
  } as BreakdownConfig,

  'ow-intimidation-reframing': {
    type: 'form',
    hint: 'Name what\'s making this feel impossible. Then look at it differently.',
    fields: [
      { key: 'task',    label: 'What task is intimidating you?',                    placeholder: 'Be specific.' },
      { key: 'why',     label: 'Why don\'t you want to work on it?',                placeholder: 'What emotions are making it hard to start?', multiline: true, rows: 3 },
      { key: 'anxiety', label: 'Anxiety level right now (1–10)',                    placeholder: 'e.g. 7' },
      { key: 'reframe', label: 'How could you look at this differently?',           placeholder: 'e.g. This is hard, but I\'ve done hard things before.', multiline: true, rows: 3 },
    ],
  } as FormConfig,

  'ow-pomodoro': {
    type: 'timer',
    minutes: 25,
    mode: 'pomodoro',
    workMins: 25,
    breakMins: 5,
    label: 'Work 25 min, break 5 min. Repeat.',
  } as TimerConfig,

  'ow-time-estimation': {
    type: 'timer',
    minutes: 0,
    mode: 'estimate',
    label: 'Guess how long it\'ll take — then time yourself. Reality is usually faster.',
  } as TimerConfig,

  // ── OVERWHELMED 2.2 ───────────────────────────────────────────────────
  'ow-get-out': {
    type: 'steps',
    steps: [
      'You have the right to say no without an explanation.',
      'For a general request: "I won\'t be able to right now, but I appreciate you thinking of me."',
      'For social plans: "That sounds fun, but I can\'t this time. Hope you all have a blast."',
      'For work: "I\'m at capacity right now — can we revisit this next week?"',
      'For being overloaded: "I need to protect my bandwidth right now. I can\'t take this on."',
      'Practice your no below.',
    ],
    noteLabel: 'The "no" I need to say:',
    notePlaceholder: 'I need to tell [person] that I can\'t…',
  } as StepsConfig,

  'ow-truth-dare-overcommitted': {
    type: 'truthdare',
    truth: 'Who do you struggle to enforce boundaries with? Why? What would you tell them if you could?',
    dare: 'Say "no" to something you don\'t want to do — today. Write what you said no to.',
  } as TruthDareConfig,

  'ow-commitment-list': {
    type: 'list',
    placeholder: 'One commitment or obligation on your plate…',
    checkable: true,
    addLabel: 'Add commitment',
    emptyMsg: 'Nothing listed yet.',
    hint: 'List everything you\'ve said yes to. Check off what you can actually drop or delegate.',
  } as ListConfig,

  'ow-realistic-work': {
    type: 'form',
    hint: 'Under-promise, over-deliver. Set expectations before they set themselves.',
    fields: [
      { key: 'project',     label: 'Project or deliverable',          placeholder: 'What are you working on?' },
      { key: 'realistic',   label: 'Realistic timeline',              placeholder: 'How long will this actually take (add buffer)?' },
      { key: 'underpromise',label: 'What I\'ll tell the client/boss', placeholder: 'What I\'ll say vs. what I expect…' },
      { key: 'risks',       label: 'What could go wrong?',            placeholder: 'Plan for it now.', multiline: true, rows: 2 },
    ],
  } as FormConfig,

  // ── OVERWHELMED 2.3 ───────────────────────────────────────────────────
  'ow-stress-plan': {
    type: 'form',
    hint: 'You can always do SOMETHING. Map each stressor to a concrete action.',
    fields: [
      { key: 's1', label: 'Stressor 1', placeholder: 'What\'s stressing you out?' },
      { key: 'a1', label: 'What can you do about it?', placeholder: 'Even one small action…' },
      { key: 'w1', label: 'When?', placeholder: 'Today? This week?' },
      { key: 's2', label: 'Stressor 2 (optional)', placeholder: '' },
      { key: 'a2', label: 'What can you do?', placeholder: '' },
      { key: 'w2', label: 'When?', placeholder: '' },
      { key: 's3', label: 'Stressor 3 (optional)', placeholder: '' },
      { key: 'a3', label: 'What can you do?', placeholder: '' },
      { key: 'w3', label: 'When?', placeholder: '' },
    ],
  } as FormConfig,

  'ow-jumanji': {
    type: 'form',
    hint: 'Pick one task. Work through these prompts to find your next move.',
    fields: [
      { key: 'task',     label: 'What task are you struggling with?',      placeholder: 'Be specific.' },
      { key: 'obstacle', label: 'What\'s actually blocking you?',          placeholder: 'e.g. Don\'t know where to start, scared of failing…', multiline: true, rows: 2 },
      { key: 'smallest', label: 'What\'s the smallest possible next step?', placeholder: 'Tiny. Embarrassingly small.' },
      { key: 'when',     label: 'When will you do that one step?',         placeholder: 'Right now? After this?' },
    ],
  } as FormConfig,

  'ow-anxiety-vent': {
    type: 'prompt',
    label: 'Write down every stressed-out thought. No filter. Just get it out.',
    placeholder: 'Everything that\'s swirling around right now…',
    hint: 'Your brain is not a storage device. Empty it here.',
  } as PromptConfig,

  'ow-coloring': {
    type: 'checklist',
    hint: 'A coloring page for when you need to scream first. Check off as you color each section.',
    items: [
      'Section 1 — the big letters',
      'Section 2 — the background',
      'Section 3 — the border',
      'Section 4 — any remaining space',
      'Done coloring — feel slightly better? ✓',
    ],
  } as ChecklistConfig,

  'ow-meditation': {
    type: 'steps',
    steps: [
      'Find somewhere you won\'t be disturbed. Sit comfortably.',
      'Close your eyes. Take a slow breath in through your nose.',
      'Breathe out through your mouth. Again.',
      'Your thoughts will wander. That\'s fine. Just notice them and return to your breath.',
      'Try 5 minutes. Set a timer. You don\'t have to clear your mind — just observe it.',
      'When the timer goes off, open your eyes slowly.',
    ],
    noteLabel: 'How do you feel after?',
    notePlaceholder: 'Even one word is fine…',
  } as StepsConfig,

  // ── OVERWHELMED 2.4 ───────────────────────────────────────────────────
  'ow-damn-break': {
    type: 'list',
    placeholder: 'Something I enjoy but never make time for…',
    checkable: true,
    addLabel: 'Add it',
    emptyMsg: 'Nothing here yet. That\'s part of the problem.',
    hint: 'Check one off — right now, or today. Recharging is not optional.',
  } as ListConfig,

  'ow-feed-yourself': {
    type: 'checklist',
    hint: 'Eating something is non-negotiable. Check what you can actually make right now.',
    items: [
      '🟢 Fresh fruit',
      '🟢 Cheese stick or string cheese',
      '🟢 Yogurt',
      '🟢 Hummus + crackers',
      '🟢 Nuts or trail mix',
      '🟢 Protein bar',
      '🟡 Instant oatmeal (microwave)',
      '🟡 Instant soup (microwave)',
      '🟡 Quesadilla (microwave)',
      '🟡 Mac and cheese (microwave)',
      '🟡 Frozen meal',
      '🔵 Avocado or peanut butter toast',
      '🔵 Scrambled eggs',
      '🔵 Grilled cheese',
      '🔵 Frozen pizza',
    ],
  } as ChecklistConfig,

  'ow-ask-help': {
    type: 'steps',
    steps: [
      '"Could I ask for your help with [?]?"',
      '"Would you mind taking a look at [?]? I\'d love your input."',
      '"I\'m feeling a little [overwhelmed] and would love some support with [?] if you have time."',
      '"Could you possibly do me a favor and [?]?"',
      'Tip: People generally want to help. The ask is usually scarier than the answer.',
    ],
    noteLabel: 'Who I\'m going to ask, and for what:',
    notePlaceholder: 'I\'m going to ask [person] to help me with…',
  } as StepsConfig,

  'ow-signs-burnout': {
    type: 'checklist',
    hint: 'Check everything that applies. This is information, not judgment.',
    items: [
      'Issues falling or staying asleep',
      'Appetite changes',
      'Headaches',
      'Gastrointestinal issues',
      'Muscle tension',
      'Getting sick more often',
      'Feeling anxious',
      'Feeling numb or empty',
      'Apathy — nothing feels worth it',
      'Irritability',
      'Feeling unsatisfied with everything',
      'Mood instability',
      'Difficulty concentrating',
      'Forgetting things more than usual',
      'Dreading the day before it starts',
      'Withdrawing from people',
    ],
  } as ChecklistConfig,

  'ow-selfcare-challenge': {
    type: 'checklist',
    hint: 'Real self-care. How many can you check off over time?',
    items: [
      'Watch videos of cute animals',
      'Watch a bad movie with friends and make fun of it',
      'Learn a new board game',
      'Make a new playlist',
      'Read one chapter of a book',
      'Turn off notifications for a day',
      'Say no to something you don\'t want to do',
      'Wrap in a blanket and re-watch a comfort show',
      'Text someone you miss',
      'Delete an ex\'s phone number',
      'Try a new local restaurant',
      'Go through your camera roll and delete 50 photos',
      'Take a walk with no destination',
      'Sleep in on a day you don\'t have to be anywhere',
    ],
    userFillable: true,
  } as ChecklistConfig,

  // ── UNMOTIVATED 3.1 ───────────────────────────────────────────────────
  'um-avoidance-bingo': {
    type: 'bingo',
    categories: ['Cleaning', 'Work', 'Health', 'Life Admin', 'Personal'],
  } as BingoConfig,

  'um-avoidance-log': {
    type: 'form',
    hint: 'Get it out of your head and onto paper. That alone helps.',
    fields: [
      { key: 'task',    label: 'Task you\'re avoiding',           placeholder: 'Be specific.' },
      { key: 'anxiety', label: 'Anxiety level (1–10)',             placeholder: 'e.g. 6' },
      { key: 'why',     label: 'Why are you avoiding it?',         placeholder: 'All the reasons, even the petty ones.', multiline: true, rows: 3 },
      { key: 'fears',   label: 'What fears are making it worse?',  placeholder: 'e.g. Afraid I\'ll do it wrong…', multiline: true, rows: 2 },
      { key: 'step',    label: 'Your tiniest first step',          placeholder: 'e.g. Just open the document.' },
    ],
  } as FormConfig,

  'um-blackjack': {
    type: 'blackjack',
    taskCount: 3,
  } as BlackjackConfig,

  'um-excuse-list': {
    type: 'pairs',
    col1: 'Excuse',
    col2: 'Rebuttal',
    ph1: 'e.g. I don\'t feel like it',
    ph2: 'e.g. Feelings aren\'t facts. Set a 5-min timer.',
    hint: 'Call yourself out. Then answer back.',
  } as PairsConfig,

  'um-productive-mood': {
    type: 'form',
    hint: 'Build a ritual that tells your brain it\'s time to work.',
    fields: [
      { key: 'place',   label: 'Where do you work best?',          placeholder: 'A specific spot, room, or place outside.' },
      { key: 'music',   label: 'What music or sound helps?',       placeholder: 'e.g. Lo-fi, silence, brown noise.' },
      { key: 'clothes', label: 'Do you have a work outfit/feeling?',placeholder: 'e.g. I work better when I\'m not in pajamas.' },
      { key: 'ritual',  label: 'What\'s your start ritual?',       placeholder: 'e.g. Coffee + 5 min of reading before I open my laptop.', multiline: true, rows: 2 },
    ],
  } as FormConfig,

  'um-morning-person': {
    type: 'steps',
    steps: [
      'Delete all existing alarms on your phone.',
      'Create Alarm 1: 30 minutes before you want to get up.',
      'Create Alarm 2: 15 minutes before you want to get up.',
      'Create Alarm 3: The actual time you want to get up.',
      'Label each alarm so you know which is which.',
      'When Alarm 1 goes off: you get 15 minutes of snooze/phone time.',
      'When Alarm 2 goes off: start mentally waking up, stretch.',
      'When Alarm 3 goes off: feet on the floor. That\'s the rule.',
    ],
    noteLabel: 'The time I actually want to wake up:',
    notePlaceholder: 'e.g. 8:00am',
  } as StepsConfig,

  'um-suit-up': {
    type: 'cards',
    hint: 'Draw 4 cards. Each suit = a task category. The number = how many minutes. Pick one.',
    suits: [
      { label: 'Admin', emoji: '♠️', items: ['Pay a bill', 'Clear emails', 'Organize your desktop', 'Delegate something', 'Update your calendar'] },
      { label: 'Self-Care', emoji: '♥️', items: ['Go for a walk', 'Drink a full glass of water', 'Eat something real', 'Stretch for 5 minutes', 'Call someone you love'] },
      { label: 'Chores', emoji: '♣️', items: ['Do one load of laundry', 'Wash dishes', 'Take out trash', 'Wipe counters', 'Vacuum one room'] },
      { label: 'Creative', emoji: '♦️', items: ['Write for 10 minutes', 'Sketch or doodle', 'Work on a project', 'Send one message you\'ve been putting off', 'Plan something fun'] },
    ],
  } as CardsConfig,

  'um-switch-it-up': {
    type: 'form',
    hint: 'New environment, new brain. Commit before you go.',
    fields: [
      { key: 'place',  label: 'Where will you go?',          placeholder: 'e.g. Coffee shop, library, park bench…' },
      { key: 'task',   label: 'What will you work on?',      placeholder: 'Be specific — one thing only.' },
      { key: 'time',   label: 'When will you be done?',      placeholder: 'e.g. I\'ll leave when I finish the draft, or by 3pm.' },
    ],
  } as FormConfig,

  // ── UNMOTIVATED 3.2 ───────────────────────────────────────────────────
  'um-bet-ya-cant': {
    type: 'contract',
    hint: 'Spite is a valid motivator. Draw the doubter in your head. Prove them wrong.',
    fields: [
      { key: 'task',     label: 'What\'s the task?',                    placeholder: 'The thing you\'re going to prove you can do.' },
      { key: 'doubter',  label: 'Who (or what voice) is saying you can\'t?', placeholder: 'Your inner critic, an ex-boss, whoever.' },
      { key: 'time',     label: 'Time limit',                           placeholder: 'e.g. 20 minutes. Go.' },
      { key: 'proof',    label: 'Proof you did it (fill in after):',    placeholder: 'I completed… by…' },
    ],
  } as ContractConfig,

  'um-task-battle': {
    type: 'form',
    hint: 'Play battleship with a friend using your to-do lists. Each "hit" = you do that task before your next guess.',
    fields: [
      { key: 'task1', label: 'Your hidden task 1', placeholder: 'A task you\'d like to get done.' },
      { key: 'task2', label: 'Your hidden task 2', placeholder: '' },
      { key: 'task3', label: 'Your hidden task 3', placeholder: '' },
      { key: 'task4', label: 'Your hidden task 4', placeholder: '' },
      { key: 'task5', label: 'Your hidden task 5', placeholder: '' },
      { key: 'task6', label: 'Your hidden task 6', placeholder: '' },
      { key: 'task7', label: 'Your hidden task 7', placeholder: '' },
      { key: 'buddy', label: 'Playing with:',     placeholder: 'Who\'s your opponent?' },
    ],
  } as FormConfig,

  'um-accountability-betting': {
    type: 'contract',
    hint: 'Loss aversion is powerful. Put something real on the line.',
    fields: [
      { key: 'task',     label: 'Task or goal',                    placeholder: 'What are you committing to?' },
      { key: 'deadline', label: 'Deadline',                        placeholder: 'When will it be done?' },
      { key: 'buddy',    label: 'Accountability buddy',            placeholder: 'Who\'s holding you to this?' },
      { key: 'stakes',   label: 'Stakes (what happens if you miss)', placeholder: 'e.g. I owe them dinner / I donate $20' },
    ],
  } as ContractConfig,

  'um-creating-accountability': {
    type: 'pairs',
    col1: 'What\'s motivated me before',
    col2: 'How I can recreate that',
    ph1: 'e.g. Last-minute panic',
    ph2: 'e.g. Set a fake earlier deadline',
    hint: 'You\'ve gotten stuff done before. What made that happen?',
  } as PairsConfig,

  'um-grime-punishment': {
    type: 'contract',
    hint: 'If you don\'t do the thing, you do the chore you hate most.',
    fields: [
      { key: 'task',       label: 'What are you committing to do?', placeholder: 'Be specific and measurable.' },
      { key: 'deadline',   label: 'By when?',                       placeholder: 'e.g. Before I go to bed tonight.' },
      { key: 'punishment', label: 'Punishment if you miss',         placeholder: 'The chore or task you hate most.' },
      { key: 'witness',    label: 'Who\'s witnessing this contract?', placeholder: 'Optional but more effective with one.' },
    ],
  } as ContractConfig,

  // ── UNMOTIVATED 3.3 ───────────────────────────────────────────────────
  'um-treat-yo-self': {
    type: 'rewards',
    hint: 'After I do X, I get Y. Match reward size to effort size.',
  } as RewardsConfig,

  'um-worst-tasks': {
    type: 'form',
    hint: 'Name why it\'s terrible. Then find one thing that might make it slightly less terrible.',
    fields: [
      { key: 'task',  label: 'Task you hate',         placeholder: 'Don\'t hold back.' },
      { key: 'why',   label: 'Why it sucks',          placeholder: 'All the reasons.', multiline: true, rows: 3 },
      { key: 'help',  label: 'What might make it less miserable', placeholder: 'e.g. Do it with music, reward myself after, split it up…', multiline: true, rows: 2 },
    ],
  } as FormConfig,

  'um-truth-dare-disinterested': {
    type: 'truthdare',
    truth: 'What\'s the last task you completed that you didn\'t want to do? How\'d you get yourself to finally do it?',
    dare: 'Find a new productivity app or method and use it for three whole days. Write down which one.',
  } as TruthDareConfig,

  'um-complaint-form': {
    type: 'form',
    hint: 'File your official complaint. Get it all out. Then do it anyway.',
    fields: [
      { key: 'task',   label: 'Task name',            placeholder: 'What are you filing a complaint about?' },
      { key: 'status', label: 'Current status',       placeholder: 'Not started / Partially done / Past due' },
      { key: 'issues', label: 'All grievances (however minor)', placeholder: 'Everything making this task frustrating, overwhelming, or boring.', multiline: true, rows: 5 },
      { key: 'step',   label: 'Smallest possible next step', placeholder: 'OK fine… I\'ll start by…' },
    ],
  } as FormConfig,

  // ── UNMOTIVATED 3.4 ───────────────────────────────────────────────────
  'um-goals-dont-suck': {
    type: 'form',
    hint: 'Vague goals fail. Specific ones have a fighting chance.',
    fields: [
      { key: 'want',    label: 'What do I want?',                       placeholder: 'Be specific. Vague shit never helped anyone.', multiline: true, rows: 2 },
      { key: 'why',     label: 'Why does it actually matter to me?',     placeholder: 'Dig deeper. Ask why three times.', multiline: true, rows: 2 },
      { key: 'takes',   label: 'What\'s it gonna take?',                 placeholder: 'Resources, skills, time, help needed.', multiline: true, rows: 2 },
      { key: 'success', label: 'What does success really look like?',    placeholder: 'Specific, not abstract.' },
      { key: 'feels',   label: 'How does it feel to have it?',           placeholder: 'Close your eyes. What\'s different?' },
      { key: 'hard',    label: 'What\'s making it hard to achieve?',     placeholder: 'Be honest.', multiline: true, rows: 2 },
      { key: 'keep',    label: 'How will I keep going when it gets hard?',placeholder: 'Your actual plan.', multiline: true, rows: 2 },
    ],
  } as FormConfig,

  'um-pump-up-mixtape': {
    type: 'list',
    placeholder: 'Song title — Artist',
    checkable: false,
    addLabel: 'Add track',
    emptyMsg: 'No tracks yet.',
    hint: 'Songs that make you feel like a total boss. Play before you start.',
  } as ListConfig,

  'um-role-models': {
    type: 'form',
    hint: 'Reconnect with what inspires you by putting it into words.',
    fields: [
      { key: 'who1', label: '#1 — Who?', placeholder: 'Name or description' },
      { key: 'why1', label: '#1 — Why do you admire them?', placeholder: 'What specifically about them inspires you?' },
      { key: 'who2', label: '#2 — Who?', placeholder: '' },
      { key: 'why2', label: '#2 — Why?', placeholder: '' },
      { key: 'who3', label: '#3 — Who?', placeholder: '' },
      { key: 'why3', label: '#3 — Why?', placeholder: '' },
      { key: 'who4', label: '#4 — Who?', placeholder: '' },
      { key: 'why4', label: '#4 — Why?', placeholder: '' },
      { key: 'who5', label: '#5 — Who?', placeholder: '' },
      { key: 'why5', label: '#5 — Why?', placeholder: '' },
    ],
  } as FormConfig,

  'um-stay-inspired': {
    type: 'form',
    hint: 'What gets your motor going? Build a plan to use it when you\'re running on empty.',
    fields: [
      { key: 'activities', label: 'Activities that reliably inspire me',    placeholder: 'e.g. Reading, a certain podcast, talking to a specific person…', multiline: true, rows: 3 },
      { key: 'triggers',   label: 'Things that kill my motivation fast',    placeholder: 'Avoid or manage these.', multiline: true, rows: 2 },
      { key: 'plan',       label: 'My plan when I\'m in a funk',            placeholder: 'First I\'ll try… then…', multiline: true, rows: 2 },
    ],
  } as FormConfig,

  'um-truth-dare-uninspired': {
    type: 'truthdare',
    truth: 'What does your ideal life look like? Who would you need to become to make it happen?',
    dare: 'Find a motivational YouTube video right now. Watch it. Rate it below.',
  } as TruthDareConfig,

  // ── DISORGANIZED 4.1 ──────────────────────────────────────────────────
  'dis-design-environment': {
    type: 'form',
    hint: 'Build a system around reality, not theory.',
    fields: [
      { key: 'item1', label: 'Problem item 1',      placeholder: 'e.g. Dirty clothes' },
      { key: 'loc1',  label: 'Where it ends up',    placeholder: 'e.g. Bathroom floor' },
      { key: 'sol1',  label: 'Possible solution',   placeholder: 'e.g. Put a hamper in the bathroom' },
      { key: 'item2', label: 'Problem item 2',      placeholder: '' },
      { key: 'loc2',  label: 'Where it ends up',    placeholder: '' },
      { key: 'sol2',  label: 'Possible solution',   placeholder: '' },
      { key: 'item3', label: 'Problem item 3',      placeholder: '' },
      { key: 'loc3',  label: 'Where it ends up',    placeholder: '' },
      { key: 'sol3',  label: 'Possible solution',   placeholder: '' },
    ],
  } as FormConfig,

  'dis-clean-by-numbers': {
    type: 'checklist',
    hint: 'Assign a color to each area. Clean it, unlock the color, fill it in.',
    items: [
      '🔴 Red area — define it, clean it',
      '🟠 Orange area — define it, clean it',
      '🟡 Yellow area — define it, clean it',
      '🟢 Green area — define it, clean it',
      '🔵 Blue area — define it, clean it',
      '🟣 Purple area — define it, clean it',
    ],
    userFillable: true,
  } as ChecklistConfig,

  'dis-speed-clean': {
    type: 'steps',
    steps: [
      'Take a "before" photo of the room.',
      'Grab a garbage bag. Walk through and throw away every piece of trash you see.',
      'Collect all dirty clothes into a hamper.',
      'Collect all dirty dishes and take them to the kitchen.',
      'Go through each surface: clear it, wipe it.',
      'Sweep or vacuum the floor.',
      'Take an "after" photo. Breathe.',
    ],
    noteLabel: 'Timer (optional)',
    notePlaceholder: 'How long did it take?',
  } as StepsConfig,

  'dis-scavenger-hunt': {
    type: 'checklist',
    hint: 'Find and put away one item per prompt. Turn tidying into a hunt.',
    items: [
      'Something red',
      'Something orange',
      'Something yellow',
      'Something green',
      'Something blue',
      'Something purple',
      'Something you can write with',
      'Something made of plastic',
      'Something that goes in the kitchen',
      'Something under your bed',
      'Something you can wear',
      'Something in a drawer',
      'Something that belongs in the bathroom',
      'Something that smells funny',
      'Something you can donate',
      'Something that opens and closes',
      'Something you can read',
      'Something that goes on your feet',
    ],
  } as ChecklistConfig,

  'dis-fridge-overhaul': {
    type: 'steps',
    steps: [
      'Grab rubber gloves. Put on a badass playlist.',
      'Take a "before" photo of the fridge.',
      'Throw out expired food and condiments.',
      'Remove any moldy leftovers. (You know which ones.)',
      'Take everything off one shelf. Wipe it down.',
      'Repeat for remaining shelves and drawers.',
      'Put everything back — expired stuff stays out.',
      'Take an "after" photo. Take a breath.',
    ],
    noteLabel: 'Something I found that surprised me:',
    notePlaceholder: 'Optional…',
  } as StepsConfig,

  'dis-digital-workspace': {
    type: 'checklist',
    hint: 'Less messy, less stressy. Work through these in order.',
    items: [
      'Create main folders: Work, Personal, Photos, Finances, Education',
      'Move everything off the desktop into the right folder',
      'Clear the Downloads folder (delete or file each item)',
      'Create email labels for main life areas',
      'Archive or delete any emails older than 3 months you\'ll never read',
      'Unsubscribe from 5 newsletters you ignore',
      'Clear browser tabs: bookmark what matters, close the rest',
    ],
  } as ChecklistConfig,

  'dis-personal-records': {
    type: 'timer',
    minutes: 0,
    mode: 'stopwatch',
    label: 'Time a regular task and try to beat your own record.',
  } as TimerConfig,

  'dis-piles-coloring': {
    type: 'steps',
    steps: [
      'Look at the pile.',
      'Take 5 slow breaths.',
      'Pick up the one item on top.',
      'Decide: throw away, donate, or put away.',
      'Repeat for the next item.',
      'Set a timer for 10 minutes. Stop when it goes off.',
    ],
    noteLabel: 'What I actually dealt with:',
    notePlaceholder: 'Even one item counts.',
  } as StepsConfig,

  // ── DISORGANIZED 4.2 ──────────────────────────────────────────────────
  'dis-labeling': {
    type: 'kanban',
    columns: ['Contact', 'Create', 'Decide', 'Purchase', 'Research', 'Other'],
  } as KanbanConfig,

  'dis-kanban': {
    type: 'kanban',
    columns: ['To-Do', 'Doing', 'On Hold', 'Done'],
  } as KanbanConfig,

  'dis-rank-that-stuff': {
    type: 'rank',
    levels: ['High', 'Medium', 'Low'],
    hint: 'Rate everything, then rank within each level. Start at #1.',
  } as RankConfig,

  'dis-priority-worksheet': {
    type: 'rank',
    levels: ['🔥 8-10 — Do it now', '📋 6-7 — As soon as you can', '🕐 4-5 — Eventually', '🗑️ 1-3 — Skip it'],
    hint: 'Score importance (1–5) + urgency (1–5). Total determines when you do it.',
  } as RankConfig,

  'dis-theme-weeks': {
    type: 'list',
    placeholder: 'Something I already completed this week…',
    checkable: true,
    addLabel: 'Log it',
    emptyMsg: 'Nothing logged yet. Pick a theme and go.',
    hint: 'This is NOT a to-do list. Add items only AFTER you\'ve done them.',
  } as ListConfig,

  'dis-eisenhower': {
    type: 'matrix',
    xLabel: 'Urgency',
    yLabel: 'Importance',
    q1: 'Do Now',
    q2: 'Schedule',
    q3: 'Delegate',
    q4: 'Drop',
  } as MatrixConfig,

  // ── DISCOURAGED 5.1 ───────────────────────────────────────────────────
  'dc-compassion-pep': {
    type: 'pairs',
    col1: 'I\'m upset because…',
    col2: 'I\'d tell a friend…',
    ph1: 'What\'s actually hurting right now?',
    ph2: 'What would you say to them if they came to you with this?',
    hint: 'You\'re harder on yourself than you\'d ever be on someone else.',
  } as PairsConfig,

  'dc-draw-feels': {
    type: 'form',
    hint: 'Name it. Draw it (or describe it). No art skills required.',
    fields: [
      { key: 'emotion',  label: 'The emotion',             placeholder: 'e.g. Anxious, frustrated, hollow, angry…' },
      { key: 'where',    label: 'Where do you feel it in your body?', placeholder: 'e.g. Chest, throat, stomach…' },
      { key: 'describe', label: 'Describe or draw what it looks like', placeholder: 'What color, texture, or shape is it? Describe it.', multiline: true, rows: 4 },
    ],
  } as FormConfig,

  'dc-ta-da-list': {
    type: 'list',
    placeholder: 'Something I actually did today…',
    checkable: false,
    addLabel: 'Add to Ta-Da list',
    emptyMsg: 'Add the first thing you did today. However small.',
    hint: 'Not a to-do list. A DONE list. Never add things you haven\'t done yet.',
  } as ListConfig,

  'dc-forgive-yourself': {
    type: 'pairs',
    col1: 'What I can\'t stop blaming myself for',
    col2: 'Reality check',
    ph1: 'Write it out.',
    ph2: 'Is anyone else still thinking about this? What would you tell a friend?',
    hint: 'You\'re likely holding on to things others don\'t remember.',
  } as PairsConfig,

  'dc-not-alone-coloring': {
    type: 'steps',
    steps: [
      'You\'re not the only one who feels this way.',
      'ADHD affects millions of people. Shame spirals affect even more.',
      'The people you compare yourself to are hiding their struggles too.',
      'You found this app. You\'re trying. That counts.',
      'Take a breath. Write one thing below.',
    ],
    noteLabel: 'One thing I\'m giving myself credit for right now:',
    notePlaceholder: 'Even showing up today counts.',
  } as StepsConfig,

  'dc-lessons-learned': {
    type: 'pairs',
    col1: 'Something hard that happened',
    col2: 'What I learned from it',
    ph1: 'Even if it still hurts to think about.',
    ph2: 'What did it teach you about yourself or the world?',
    hint: 'Not to minimize what happened — to find the signal.',
  } as PairsConfig,

  // ── DISCOURAGED 5.2 ───────────────────────────────────────────────────
  'dc-trophy-shelf': {
    type: 'list',
    placeholder: 'A small win (however tiny)…',
    checkable: false,
    addLabel: 'Add to shelf',
    emptyMsg: 'Your shelf is empty. Add something — even making this appointment.',
    hint: 'Log the little things before they get overshadowed by the setbacks.',
  } as ListConfig,

  'dc-scumbag-brain': {
    type: 'pairs',
    col1: 'What the voice says',
    col2: 'What you say back',
    ph1: 'e.g. You\'re going to fail at this too.',
    ph2: 'e.g. That\'s not a fact. That\'s fear.',
    hint: 'Name the voice. Give it a ridiculous name. Then answer it.',
  } as PairsConfig,

  'dc-thought-traps': {
    type: 'checklist',
    hint: 'Cognitive distortions you might be falling into right now. Check what applies.',
    items: [
      'All-or-nothing thinking ("If it\'s not perfect, it\'s a failure")',
      'Catastrophizing ("This is going to be a disaster")',
      'Mind reading ("They definitely think I\'m an idiot")',
      'Fortune telling ("I know it\'s not going to work")',
      'Emotional reasoning ("I feel stupid, therefore I am stupid")',
      'Downplaying positives ("That doesn\'t count")',
      'Labeling ("I\'m a failure" instead of "I failed at this thing")',
      '"Should" statements ("I should have done this already")',
      'Personalizing ("This is my fault")',
      'Filtering (only noticing the negative parts)',
    ],
  } as ChecklistConfig,

  'dc-insecurity-list': {
    type: 'form',
    hint: 'Whose judgment are you actually afraid of? Naming it helps.',
    fields: [
      { key: 'what1',  label: 'Feeling insecure about #1',    placeholder: 'What specifically?' },
      { key: 'why1',   label: 'Why?',                         placeholder: 'What\'s the fear underneath?' },
      { key: 'whose1', label: 'Whose judgment are you afraid of?', placeholder: 'Be honest.' },
      { key: 'what2',  label: 'Feeling insecure about #2',    placeholder: '' },
      { key: 'why2',   label: 'Why?',                         placeholder: '' },
      { key: 'whose2', label: 'Whose judgment?',              placeholder: '' },
      { key: 'pattern',label: 'Do you notice a pattern?',     placeholder: 'Same person? Same type of situation?', multiline: true, rows: 2 },
    ],
  } as FormConfig,

  'dc-real-you': {
    type: 'form',
    hint: 'What\'s great about you? Don\'t say nothing. Think harder.',
    fields: [
      { key: 'iam1',    label: 'I am…',                                   placeholder: 'A personality trait you\'re proud of.' },
      { key: 'iam2',    label: 'I am…',                                   placeholder: 'Another one.' },
      { key: 'iam3',    label: 'I am…',                                   placeholder: 'And another.' },
      { key: 'happy',   label: 'I\'m happiest when I get to:',            placeholder: '' },
      { key: 'pride',   label: 'I take pride in being someone who:',      placeholder: '' },
      { key: 'better',  label: 'I\'ve gotten better at:',                 placeholder: '' },
      { key: 'taught',  label: 'I taught myself how to:',                 placeholder: '' },
      { key: 'friends', label: 'My friends would say I\'m:',              placeholder: '' },
    ],
  } as FormConfig,

  'dc-victory-lap': {
    type: 'list',
    placeholder: 'A moment I\'m proud of…',
    checkable: false,
    addLabel: 'Add to victory lap',
    emptyMsg: 'Start the list. Anything counts.',
    hint: 'Big and small. Running list. Come back and read it when you\'re down.',
  } as ListConfig,
};

export function getToolConfig(strategyId: string): ToolConfig | null {
  return T[strategyId] ?? null;
}

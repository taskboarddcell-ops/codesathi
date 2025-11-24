import { TrackType, Difficulty, Lesson, Project, Badge } from './types';

// --- MOCK LESSONS (Expanded for 5-Step Loop) ---

export const LESSONS: Lesson[] = [
  // --- SCRATCH TRACK ---
  {
    id: 'scratch-101',
    title: 'Unit 1: First Steps',
    description: 'Learn the concept of "Motion" and sequences.',
    track: TrackType.SCRATCH,
    difficulty: Difficulty.BEGINNER,
    xpReward: 50,
    introText: "Welcome to the world of Scratch! Today we'll learn how to make things MOVE! 🏃‍♂️",
    theoryCards: [
      { id: 't1', title: 'What is a Sprite?', content: 'A Sprite is a character or object you control. Like the cat! 🐱' },
      { id: 't2', title: 'The Stage', content: 'The Stage is the world where your Sprites live and act. 🎭' },
      { id: 't3', title: 'Sequencing', content: 'Code runs from top to bottom. Order matters! ⬇️' }
    ],
    initialCode: '// Drag blocks here\n// [Move 10 Steps]\n// [Turn 15 Degrees]',
    solutionPattern: /Move.*Steps/i, 
    instructions: [
      'Drag the "Move 10 Steps" block into the coding area.',
      'Click "Run" to see the cat move!'
    ],
    hints: [
      'Look for the blue Motion blocks.',
      'The "Move" block helps the cat go forward.'
    ],
    challenge: {
      description: "Can you make the cat move AND turn?",
      initialCode: "// Start here",
      solutionPattern: /Move.*Steps.*Turn|Turn.*Move/i,
      successMessage: "Great job! You made a dance move! 💃"
    }
  },
  {
    id: 'scratch-102',
    title: 'Unit 2: Loops',
    description: 'Repeat actions without getting tired.',
    track: TrackType.SCRATCH,
    difficulty: Difficulty.BEGINNER,
    xpReward: 75,
    introText: "Why do things once when you can do them forever? Let's learn Loops! 🔄",
    theoryCards: [
      { id: 't1', title: 'Repetition', content: 'Computers love doing the same thing over and over. They never get bored! 🤖' },
      { id: 't2', title: 'The Loop Block', content: 'The "Repeat" block looks like a mouth. It eats other blocks! 👄' }
    ],
    initialCode: '// [Repeat 10 times]\n//   [Move 10 Steps]',
    solutionPattern: /Repeat/i,
    instructions: [
      'Use a "Repeat" block to make the cat walk continuously.',
      'Put the "Move" block INSIDE the "Repeat" block.'
    ],
    hints: [
      'The Repeat block is yellow (Control).',
      'Make sure the move block is inside the "mouth".'
    ],
    challenge: {
      description: "Make the cat spin around forever!",
      initialCode: "// Use Forever",
      solutionPattern: /Forever.*Turn/i,
      successMessage: "Weeee! It never stops! 🌪️"
    }
  },
  
  // --- PYTHON TRACK ---
  {
    id: 'py-101',
    title: 'Unit 1: Python Power',
    description: 'Intro to Python syntax and printing.',
    track: TrackType.PYTHON,
    difficulty: Difficulty.BEGINNER,
    xpReward: 75,
    introText: "Python is a real coding language used by NASA and Google! Let's write your first line. 🐍",
    theoryCards: [
      { id: 't1', title: 'Syntax', content: 'Syntax is like grammar for code. It tells the computer how to read your instructions. 📚' },
      { id: 't2', title: 'The Print Function', content: 'print() is how we make the computer talk to us. 💬' }
    ],
    initialCode: '# Use the print function to say hello\n\n',
    solutionPattern: /print\s*\(\s*["']Hello.*World["']\s*\)/i,
    instructions: [
      'Type `print("Hello World")` below.',
      'Hit Run to see the computer speak.'
    ],
    hints: [
      'Don\'t forget the parentheses `()`!',
      'Text must be inside quotes `""`.'
    ],
    challenge: {
      description: "Print your own name!",
      initialCode: "# Print your name",
      solutionPattern: /print\s*\(\s*["'].*["']\s*\)/i,
      successMessage: "Nice to meet you! 👋"
    }
  },
  {
    id: 'py-102',
    title: 'Unit 2: Magic Boxes',
    description: 'Understanding Variables.',
    track: TrackType.PYTHON,
    difficulty: Difficulty.BEGINNER,
    xpReward: 100,
    introText: "Data is heavy! Let's put it in a box so we can carry it around. 📦",
    theoryCards: [
      { id: 't1', title: 'Variables', content: 'A variable is a labeled box where you store information. 🏷️' },
      { id: 't2', title: 'Assignment', content: 'We use the `=` sign to put things in the box. `score = 10`' }
    ],
    initialCode: '# Create a variable called hero_name\n\nprint("Welcome, " + hero_name)',
    solutionPattern: /hero_name\s*=\s*["'].*["']/,
    instructions: [
      'Create a variable named `hero_name`.',
      'Assign it your favorite hero name (in quotes).'
    ],
    hints: [
      'Example: `hero_name = "Batman"`',
      'Put it before the print statement.'
    ],
    challenge: {
      description: "Create a variable for your age and print it.",
      initialCode: "# age variable",
      solutionPattern: /age\s*=\s*\d+/,
      successMessage: "Stored successfully! 💾"
    }
  },

  // --- JS TRACK ---
  {
    id: 'js-101',
    title: 'Unit 1: Web Magic',
    description: 'Make the browser pop.',
    track: TrackType.JAVASCRIPT,
    difficulty: Difficulty.BEGINNER,
    xpReward: 80,
    introText: "JavaScript is the magic behind every website you visit. Let's cast a spell! ✨",
    theoryCards: [
      { id: 't1', title: 'The Web', content: 'HTML builds the house, CSS paints it, and JavaScript creates the electricity! ⚡' },
      { id: 't2', title: 'Alerts', content: 'An alert is a pop-up box that grabs the user\'s attention. 🚨' }
    ],
    initialCode: '// Make a browser popup appear\n',
    solutionPattern: /alert\s*\(\s*["'].*["']\s*\)/,
    instructions: [
      'Type `alert("I am a coder!");`',
      'Watch the popup appear.'
    ],
    hints: [
      'Don\'t forget the semicolon `;` at the end.',
      'It works like print, but visually.'
    ],
    challenge: {
      description: "Make an alert that says 'Hello World'",
      initialCode: "// Alert code here",
      solutionPattern: /alert\s*\(\s*["']Hello World["']\s*\)/i,
      successMessage: "You hacked the browser! (Just kidding) 🌐"
    }
  },
  {
    id: 'js-102',
    title: 'Unit 2: Console Secrets',
    description: 'Developer tools exposed.',
    track: TrackType.JAVASCRIPT,
    difficulty: Difficulty.BEGINNER,
    xpReward: 90,
    introText: "Hackers and developers have a secret chat room called the Console. 🕵️‍♀️",
    theoryCards: [
      { id: 't1', title: 'console.log', content: 'This command sends messages to the secret developer tools area. 🛠️' }
    ],
    initialCode: '// Log a secret message\n',
    solutionPattern: /console\.log/,
    instructions: [
      'Use `console.log("Secret")` to write a message.',
      'Check the output panel below.'
    ],
    hints: [
      'Lower case `console`, dot, `log`.'
    ],
    challenge: {
      description: "Log your favorite food.",
      initialCode: "",
      solutionPattern: /console\.log\s*\(\s*["'].*["']\s*\)/,
      successMessage: "Yum! 🍕"
    }
  }
];

export const PROJECTS: Project[] = [
  {
    id: 'p1',
    title: 'Space Dodger',
    description: 'Build a game where a spaceship avoids asteroids.',
    track: TrackType.SCRATCH,
    difficulty: Difficulty.INTERMEDIATE,
    xpReward: 500,
    image: '🚀',
    locked: false
  },
  {
    id: 'p2',
    title: 'Digital Pet',
    description: 'Create a pet that needs food and sleep.',
    track: TrackType.PYTHON,
    difficulty: Difficulty.ADVANCED,
    xpReward: 800,
    image: '👾',
    locked: true
  },
  {
    id: 'p3',
    title: 'Joke Generator',
    description: 'A button that tells random dad jokes.',
    track: TrackType.JAVASCRIPT,
    difficulty: Difficulty.BEGINNER,
    xpReward: 300,
    image: '😂',
    locked: false
  }
];

export const BADGES: Badge[] = [
  { id: 'b1', name: 'First Code', description: 'Completed your first lesson', icon: '🐣', condition: '1_lesson' },
  { id: 'b2', name: 'Bug Hunter', description: 'Fixed 5 errors without hints', icon: '🐛', condition: 'debug_5' },
  { id: 'b3', name: 'Streak Master', description: 'Coded for 7 days in a row', icon: '🔥', condition: 'streak_7' },
  { id: 'b4', name: 'Python Charmer', description: 'Finished Python Unit 1', icon: '🐍', condition: 'track_python' },
];

export const INITIAL_USER_STATE = {
  xp: 0,
  streak: 0,
  completedLessons: [],
  badges: [],
  currentTrack: TrackType.SCRATCH
};

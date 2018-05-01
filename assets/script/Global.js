window.Global = {
    inited:false,
    currentLevel: "easy",
    puzzles: {easy: [], medium: [], hard: [], extreme: []},
    currentPuzzleId: -1,
    currentPuzzle: null,
    currentAnswer: null,
    seenLevels: {easy: [], medium: [], hard: [], extreme: []},
    passedLevels: {easy: [], medium: [], hard: [], extreme: []},
    filledNumbers:[],
    filledCandidates:[],
    mute: false
};

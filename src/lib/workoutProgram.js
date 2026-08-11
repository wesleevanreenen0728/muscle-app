// Home dumbbell program — built for: a pair of 10kg dumbbells + bodyweight,
// no bench, no bar. Full-body, 3 sessions/week (A/B/C), rotate through them
// with a rest day between where possible. Progressive: once every set of an
// exercise feels comfortable at the top of its rep range, that's the signal
// to look at adding load (a second, heavier pair of dumbbells) rather than
// endlessly adding reps.

export const WORKOUT_PROGRAM = {
  A: {
    label: 'Full Body A — Push focus',
    exercises: [
      {
        name: 'Goblet Squat',
        sets: 3,
        reps: '10-12',
        cue: 'Hold one dumbbell vertically against your chest with both hands. Feet shoulder-width, squat down until thighs are roughly parallel to the floor, drive back up through your heels.',
      },
      {
        name: 'Dumbbell Floor Press',
        sets: 3,
        reps: '8-10',
        cue: 'Lie on your back on the floor, knees bent. Press both dumbbells up from chest level until arms are straight, lower until your upper arms touch the floor.',
      },
      {
        name: 'Dumbbell Shoulder Press',
        sets: 3,
        reps: '8-10',
        cue: 'Standing or seated, press both dumbbells overhead from shoulder height until arms are straight, lower with control.',
      },
      {
        name: 'Dumbbell Romanian Deadlift',
        sets: 3,
        reps: '10-12',
        cue: 'Hold both dumbbells in front of thighs, soft knees, hinge at the hips pushing your bum back until you feel a stretch in your hamstrings, then drive hips forward to stand.',
      },
      {
        name: 'Plank',
        sets: 3,
        reps: '30-45 sec',
        cue: 'Forearms and toes on the floor, straight line from head to heels, brace your core, don\u2019t let your hips sag.',
      },
    ],
  },
  B: {
    label: 'Full Body B — Pull focus',
    exercises: [
      {
        name: 'Dumbbell Reverse Lunge',
        sets: 3,
        reps: '10 per leg',
        cue: 'Holding a dumbbell in each hand, step backward into a lunge until your front thigh is parallel to the floor, push back to standing. Alternate legs.',
      },
      {
        name: 'Single-Arm Dumbbell Row',
        sets: 3,
        reps: '10-12 per arm',
        cue: 'Support yourself with one hand and knee on a sturdy chair/bed, row the dumbbell up to your hip with the other arm, squeeze your shoulder blade.',
      },
      {
        name: 'Dumbbell Deadlift',
        sets: 3,
        reps: '8-10',
        cue: 'Dumbbells in front of your shins, hinge down keeping your back flat, stand up by driving through your heels and squeezing your glutes at the top.',
      },
      {
        name: 'Dumbbell Bicep Curl',
        sets: 3,
        reps: '10-12',
        cue: 'Standing, curl both dumbbells up toward your shoulders without swinging your torso, lower slowly.',
      },
      {
        name: 'Side Plank',
        sets: 2,
        reps: '20-30 sec per side',
        cue: 'Lie on your side, prop up on one forearm, lift your hips so your body forms a straight line. Switch sides.',
      },
    ],
  },
  C: {
    label: 'Full Body C — Accessory focus',
    exercises: [
      {
        name: 'Dumbbell Step-up',
        sets: 3,
        reps: '10 per leg',
        cue: 'Using a sturdy chair or step, hold a dumbbell in each hand and step fully up onto it, drive through the front heel, step back down with control.',
      },
      {
        name: 'Dumbbell Floor Chest Fly',
        sets: 3,
        reps: '10-12',
        cue: 'Lie on your back, arms extended above your chest with a slight bend in the elbows, lower the dumbbells out to the sides until you feel a chest stretch, bring back together.',
      },
      {
        name: 'Dumbbell Lateral Raise',
        sets: 3,
        reps: '12-15',
        cue: 'Standing, raise both dumbbells out to the sides until arms are roughly parallel to the floor, lower slowly. Keep a slight bend in the elbows.',
      },
      {
        name: 'Dumbbell Sumo Squat',
        sets: 3,
        reps: '10-12',
        cue: 'Feet wider than shoulder-width, toes turned out, hold one dumbbell with both hands between your legs, squat down and drive back up.',
      },
      {
        name: 'Dumbbell Overhead Tricep Extension',
        sets: 3,
        reps: '10-12',
        cue: 'Hold one dumbbell with both hands overhead, lower it behind your head by bending your elbows, extend back up.',
      },
    ],
  },
}

export const PROGRAM_NOTES = [
  'Rest 60-90 seconds between sets. If you\u2019re short on time, 45 seconds is fine too.',
  'Aim for roughly 3 sessions a week (e.g. Mon/Wed/Fri), rotating A \u2192 B \u2192 C \u2192 A...',
  'If the top of a rep range feels easy for all 3 sets, that\u2019s the cue to progress \u2014 either a heavier pair of dumbbells, or slow the reps down for more time under tension.',
  'Walking and occasional running are great to add on top of this \u2014 log them separately below as cardio, they don\u2019t replace a strength session.',
]

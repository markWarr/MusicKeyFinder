// Frequency map for musical notes (A4 = 440Hz)
const NOTE_FREQUENCIES: { [key: string]: number } = {
    'C4': 261.63,
    'C#4': 277.18,
    'Db4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'Eb4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'Gb4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'Ab4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'Bb4': 466.16,
    'B4': 493.88,
};

// Map chord names to their constituent notes
const CHORD_NOTES: { [key: string]: string[] } = {
    // Major chords
    'C': ['C4', 'E4', 'G4'],
    'C#': ['C#4', 'F4', 'G#4'],
    'Db': ['Db4', 'F4', 'Ab4'],
    'D': ['D4', 'F#4', 'A4'],
    'D#': ['D#4', 'G4', 'A#4'],
    'Eb': ['Eb4', 'G4', 'Bb4'],
    'E': ['E4', 'G#4', 'B4'],
    'F': ['F4', 'A4', 'C4'],
    'F#': ['F#4', 'A#4', 'C#4'],
    'Gb': ['Gb4', 'Bb4', 'Db4'],
    'G': ['G4', 'B4', 'D4'],
    'G#': ['G#4', 'C4', 'D#4'],
    'Ab': ['Ab4', 'C4', 'Eb4'],
    'A': ['A4', 'C#4', 'E4'],
    'A#': ['A#4', 'D4', 'F4'],
    'Bb': ['Bb4', 'D4', 'F4'],
    'B': ['B4', 'D#4', 'F#4'],
    // Minor chords
    'Cm': ['C4', 'Eb4', 'G4'],
    'C#m': ['C#4', 'E4', 'G#4'],
    'Dbm': ['Db4', 'E4', 'Ab4'],
    'Dm': ['D4', 'F4', 'A4'],
    'D#m': ['D#4', 'F#4', 'A#4'],
    'Ebm': ['Eb4', 'Gb4', 'Bb4'],
    'Em': ['E4', 'G4', 'B4'],
    'Fm': ['F4', 'Ab4', 'C4'],
    'F#m': ['F#4', 'A4', 'C#4'],
    'Gbm': ['Gb4', 'Bb4', 'Db4'],
    'Gm': ['G4', 'Bb4', 'D4'],
    'G#m': ['G#4', 'B4', 'D#4'],
    'Abm': ['Ab4', 'B4', 'Eb4'],
    'Am': ['A4', 'C4', 'E4'],
    'A#m': ['A#4', 'C#4', 'F4'],
    'Bbm': ['Bb4', 'Db4', 'F4'],
    'Bm': ['B4', 'D4', 'F#4'],
    // Diminished chords
    'Cdim': ['C4', 'Eb4', 'Gb4'],
    'C#dim': ['C#4', 'E4', 'G4'],
    'Dbdim': ['Db4', 'E4', 'G4'],
    'Ddim': ['D4', 'F4', 'Ab4'],
    'D#dim': ['D#4', 'F#4', 'A4'],
    'Ebdim': ['Eb4', 'Gb4', 'A4'],
    'Edim': ['E4', 'G4', 'Bb4'],
    'Fdim': ['F4', 'Ab4', 'B4'],
    'F#dim': ['F#4', 'A4', 'C4'],
    'Gbdim': ['Gb4', 'Bb4', 'Db4'],
    'Gdim': ['G4', 'Bb4', 'Db4'],
    'G#dim': ['G#4', 'B4', 'D4'],
    'Abdim': ['Ab4', 'Cb4', 'D4'],
    'Adim': ['A4', 'C4', 'Eb4'],
    'A#dim': ['A#4', 'C#4', 'E4'],
    'Bbdim': ['Bb4', 'Db4', 'E4'],
    'Bdim': ['B4', 'D4', 'F4'],
};

let audioContext: AudioContext | null = null;

export function playChord(chordName: string) {
    // Initialize AudioContext on first use (needs to be triggered by user interaction)
    if (!audioContext) {
        audioContext = new AudioContext();
    }

    const notes = CHORD_NOTES[chordName];
    if (!notes) return;

    notes.forEach((note) => {
        const frequency = NOTE_FREQUENCIES[note];
        if (!frequency || !audioContext) return;

        // Create oscillator
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);

        // Create gain node for envelope
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1.5);

        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        // Start and stop
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 1.5);
    });
} 
type KeyData = {
    key: string;
    chords: Set<string>;
};

// Mapping of enharmonic equivalents (both directions for easier lookup)
const enharmonicMap: Record<string, string> = {
    // Major chords
    'ab': 'g#',
    'g#': 'ab',
    'a#': 'bb',
    'bb': 'a#',
    'c#': 'db',
    'db': 'c#',
    'd#': 'eb',
    'eb': 'd#',
    'f#': 'gb',
    'gb': 'f#',
    // Minor chords
    'abm': 'g#m',
    'g#m': 'abm',
    'a#m': 'bbm',
    'bbm': 'a#m',
    'c#m': 'dbm',
    'dbm': 'c#m',
    'd#m': 'ebm',
    'ebm': 'd#m',
    'f#m': 'gbm',
    'gbm': 'f#m',
    // Diminished chords
    'abdim': 'g#dim',
    'g#dim': 'abdim',
    'a#dim': 'bbdim',
    'bbdim': 'a#dim',
    'c#dim': 'dbdim',
    'dbdim': 'c#dim',
    'd#dim': 'ebdim',
    'ebdim': 'd#dim',
    'f#dim': 'gbdim',
    'gbdim': 'f#dim'
};

const rawKeys: string[][] = [
    // Ab Major
    ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
    // A Major
    ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
    // Bb Major
    ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
    // B Major
    ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
    // C Major
    ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
    // C# Major
    ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"],
    // Db Major
    ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
    // D Major
    ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
    // Eb Major
    ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
    // E Major
    ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
    // F Major
    ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
    // F# Major
    ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
    // Gb Major
    ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"],
    // G Major
    ["G", "Am", "Bm", "C", "D", "Em", "F#dim"]
];

const keyData: ReadonlyArray<KeyData> = rawKeys.map(row => ({
    key: row[0],
    chords: new Set(row.map(chord => chord.toLowerCase()))
}));

export const commonChords = [
    // Natural chords
    "A", "Am", "B", "Bm", "C", "Cm", "D", "Dm",
    "E", "Em", "F", "Fm", "G", "Gm",
    // Sharp chords
    "C#", "C#m", "D#", "D#m", "F#", "F#m", "G#", "G#m", "A#", "A#m",
    // Flat chords
    "Ab", "Abm", "Bb", "Bbm", "Db", "Dbm", "Eb", "Ebm", "Gb", "Gbm",
    // Special cases from raw keys
    "E#m", "B#dim", "Cb"
] as const;

export function getKeysFromChords(chords: string[]): string[] {
    if (!chords || chords.length === 0) {
        throw new Error("At least one chord must be provided.");
    }

    const normalizedChords = chords.map(chord => chord.toLowerCase());
    
    return keyData
        .filter(({ chords: keyChords }) => 
            normalizedChords.every(inputChord => {
                // Check both the chord and its enharmonic equivalent
                if (keyChords.has(inputChord)) return true;
                const enharmonic = enharmonicMap[inputChord];
                return enharmonic ? keyChords.has(enharmonic) : false;
            })
        )
        .map(({ key }) => key);
} 
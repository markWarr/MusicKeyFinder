type KeyData = {
    key: string;
    chords: Set<string>;
};

const rawKeys: string[][] = [
    ["Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"],
    ["A", "Bm", "C#m", "D", "E", "F#m", "G#dim"],
    ["Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"],
    ["B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"],
    ["C", "Dm", "Em", "F", "G", "Am", "Bdim"],
    ["C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"],
    ["Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"],
    ["D", "Em", "F#m", "G", "A", "Bm", "C#dim"],
    ["Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"],
    ["E", "F#m", "G#m", "A", "B", "C#m", "D#dim"],
    ["F", "Gm", "Am", "Bb", "C", "Dm", "Edim"],
    ["F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"],
    ["Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"],
    ["G", "Am", "Bm", "C", "D", "Em", "F#dim"],
];

const keyData: ReadonlyArray<KeyData> = rawKeys.map(row => ({
    key: row[0],
    chords: new Set(row.map(chord => chord.toLowerCase()))
}));

export const commonChords = [
    "A", "Am", "B", "Bm", "C", "Cm", "D", "Dm",
    "E", "Em", "F", "Fm", "G", "Gm",
    "Ab", "Abm", "Bb", "Bbm", "C#", "C#m",
    "Db", "Dbm", "Eb", "Ebm", "F#", "F#m",
    "Gb", "Gbm"
] as const;

export function getKeysFromChords(chords: string[]): string[] {
    if (!chords || chords.length === 0) {
        throw new Error("At least one chord must be provided.");
    }

    const normalizedChords = chords.map(chord => chord.toLowerCase());
    
    return keyData
        .filter(({ chords: keyChords }) => 
            normalizedChords.every(chord => 
                keyChords.has(chord)
            )
        )
        .map(({ key }) => key);
} 
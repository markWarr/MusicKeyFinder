type KeyData = {
    key: string;
    chords: Set<string>;
    isMinor?: boolean;
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

// Create both major and minor key data
const keyData: ReadonlyArray<KeyData> = rawKeys.flatMap(row => {
    const majorKey = {
        key: row[0],
        chords: new Set(row.map(chord => chord.toLowerCase()))
    };
    
    // For the relative minor, we use the sixth chord (index 5) without the 'm' suffix
    const relativeMinorKey = {
        key: row[5].slice(0, -1), // Remove the 'm' from the sixth chord
        chords: new Set(row.map(chord => chord.toLowerCase())),
        isMinor: true
    };
    
    return [majorKey, relativeMinorKey];
});

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
    
    // If we have a single minor chord, prioritize it as a potential tonic
    if (chords.length === 1 && normalizedChords[0].endsWith('m') && !normalizedChords[0].endsWith('dim')) {
        const minorKey = normalizedChords[0].slice(0, -1); // Remove 'm' suffix
        
        // Find both the minor key and its relative major
        const results: string[] = [];
        
        // Add the minor key
        results.push(`${minorKey}m`);
        
        // Find the relative major by looking for a major key where this chord is the sixth
        const relativeMajor = rawKeys.find(row => 
            row[5].toLowerCase() === normalizedChords[0] // Check if our chord is the sixth chord
        );
        
        if (relativeMajor) {
            results.push(relativeMajor[0]); // Add the major key (first chord in the row)
        }
        
        return results;
    }
    
    // For multiple chords or non-minor chords, find all matching keys
    return keyData
        .filter(({ chords: keyChords }) => 
            normalizedChords.every(inputChord => {
                // Check both the chord and its enharmonic equivalent
                if (keyChords.has(inputChord)) return true;
                const enharmonic = enharmonicMap[inputChord];
                return enharmonic ? keyChords.has(enharmonic) : false;
            })
        )
        .map(({ key, isMinor }) => isMinor ? `${key}m` : key);
}

export function getChordsForKey(key: string): string[] {
    // Handle both major and minor keys
    const isMinor = key.endsWith('m');
    const baseKey = isMinor ? key.slice(0, -1) : key;
    
    let matchingRow: string[] | undefined;
    
    if (isMinor) {
        // For minor keys, find the relative major key where this is the sixth chord
        matchingRow = rawKeys.find(row => 
            row[5].slice(0, -1).toLowerCase() === baseKey.toLowerCase()
        );
        
        if (matchingRow) {
            // Reorder chords to start with the minor key
            // Original order: [major, IIm, IIIm, IV, V, VIm, VIIdim]
            // New order: [VIm (now Im), VIIdim (now IIdim), I (now bIII), IIm (now IVm), IIIm (now Vm), IV (now bVI)]
            const [major, IIm, IIIm, IV, V, VIm] = matchingRow;
            return [VIm, matchingRow[6], major, IIm, IIIm, IV, V];
        }
    } else {
        // For major keys, find the row where this is the first chord
        matchingRow = rawKeys.find(row => 
            row[0].toLowerCase() === baseKey.toLowerCase()
        );
    }
    
    return matchingRow || [];
} 
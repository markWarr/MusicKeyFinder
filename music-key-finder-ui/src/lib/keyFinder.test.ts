import { describe, it, expect } from 'vitest';
import { getKeysFromChords } from './keyFinder';

describe('getKeysFromChords', () => {
    it('should find key of C when given C, F, and G', () => {
        const result = getKeysFromChords(['C', 'F', 'G']);
        expect(result).toContain('C');
        expect(result).toHaveLength(1);
    });

    it('should find multiple possible keys for a single chord', () => {
        const result = getKeysFromChords(['E']);
        expect(result).toContain('E');
        expect(result).toContain('A');
        expect(result).toContain('B');
    });

    it('should handle case-insensitive chord names', () => {
        const result = getKeysFromChords(['c', 'f', 'g']);
        expect(result).toContain('C');
    });

    it('should return empty array for invalid chord combinations', () => {
        const result = getKeysFromChords(['C', 'C#']);
        expect(result).toHaveLength(0);
    });

    it('should throw error for empty chord array', () => {
        expect(() => getKeysFromChords([])).toThrow('At least one chord must be provided');
    });

    it('should find key of G when given all diatonic chords', () => {
        const result = getKeysFromChords(['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#dim']);
        expect(result).toContain('G');
        expect(result).toHaveLength(1);
    });

    it('should find key regardless of chord order', () => {
        const result = getKeysFromChords(['Em', 'G', 'C', 'D', 'Am', 'Bm', 'F#dim']);
        expect(result).toContain('G');
        expect(result).toHaveLength(1);
    });
}); 
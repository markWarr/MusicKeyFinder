import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';

describe('App', () => {
    beforeEach(() => {
        render(<App />);
    });

    it('should render the title', () => {
        expect(screen.getByRole('heading', { name: /musical key finder tool/i })).toBeInTheDocument();
    });

    it('should add a chord when entered', () => {
        const input = screen.getByPlaceholderText(/enter a chord/i);
        const addButton = screen.getByRole('button', { name: /add chord/i });

        fireEvent.change(input, { target: { value: 'C' } });
        fireEvent.click(addButton);

        const chordList = screen.getByRole('list', { name: /added chords/i });
        const addedChord = within(chordList).getByText('C');
        expect(addedChord).toBeInTheDocument();
        expect(addedChord.closest('.chord-tag')).not.toHaveClass('suggestion');
    });

    it('should show suggestions when typing', () => {
        const input = screen.getByPlaceholderText(/enter a chord/i);
        
        fireEvent.change(input, { target: { value: 'A' } });
        
        const suggestions = screen.getByRole('list', { name: /chord suggestions/i });
        const suggestedChords = within(suggestions).getAllByRole('button', { name: /^[A-G][#b]?m?$/ });
        expect(suggestedChords.some(chord => chord.textContent === 'A')).toBe(true);
        expect(suggestedChords.some(chord => chord.textContent === 'Am')).toBe(true);
        suggestedChords.forEach(chord => {
            expect(chord).toHaveClass('chord-tag');
            expect(chord).toHaveClass('suggestion');
        });
    });

    it('should remove a chord when clicking remove button', () => {
        const input = screen.getByPlaceholderText(/enter a chord/i);
        const addButton = screen.getByRole('button', { name: /add chord/i });
        
        fireEvent.change(input, { target: { value: 'C' } });
        fireEvent.click(addButton);

        const chordList = screen.getByRole('list', { name: /added chords/i });
        const removeButton = within(chordList).getByRole('button', { name: /remove c chord/i });
        fireEvent.click(removeButton);

        expect(within(chordList).queryByText('C')).not.toBeInTheDocument();
    });

    it('should show error for duplicate chord', () => {
        const input = screen.getByPlaceholderText(/enter a chord/i);
        const addButton = screen.getByRole('button', { name: /add chord/i });

        fireEvent.change(input, { target: { value: 'C' } });
        fireEvent.click(addButton);
        fireEvent.change(input, { target: { value: 'C' } });
        fireEvent.click(addButton);

        expect(screen.getByText('This chord is already added')).toBeInTheDocument();
    });

    it('should show possible keys when valid chords are added', () => {
        const input = screen.getByPlaceholderText(/enter a chord/i);
        const addButton = screen.getByRole('button', { name: /add chord/i });

        ['C', 'F', 'G'].forEach(chord => {
            fireEvent.change(input, { target: { value: chord } });
            fireEvent.click(addButton);
        });

        const keySection = screen.getByRole('region', { name: /possible keys/i });
        expect(within(keySection).getByText('C')).toBeInTheDocument();
    });

    it('should handle chord input via Enter key', () => {
        const input = screen.getByPlaceholderText(/enter a chord/i);
        
        fireEvent.change(input, { target: { value: 'C' } });
        fireEvent.keyPress(input, { key: 'Enter', code: 'Enter', charCode: 13 });

        const chordList = screen.getByRole('list', { name: /added chords/i });
        const addedChord = within(chordList).getByText('C');
        expect(addedChord).toBeInTheDocument();
        expect(addedChord.closest('.chord-tag')).not.toHaveClass('suggestion');
    });

    it('should clear error when all chords are removed', () => {
        const input = screen.getByPlaceholderText(/enter a chord/i);
        const addButton = screen.getByRole('button', { name: /add chord/i });

        fireEvent.change(input, { target: { value: 'C' } });
        fireEvent.click(addButton);
        fireEvent.change(input, { target: { value: 'C' } });
        fireEvent.click(addButton);

        expect(screen.getByText('This chord is already added')).toBeInTheDocument();

        const chordList = screen.getByRole('list', { name: /added chords/i });
        const removeButton = within(chordList).getByRole('button', { name: /remove c chord/i });
        fireEvent.click(removeButton);

        expect(screen.queryByText('This chord is already added')).not.toBeInTheDocument();
    });
}); 
import { useState, type KeyboardEvent, type ChangeEvent } from 'react';
import { getKeysFromChords, commonChords } from './lib/keyFinder';
import './App.css';

function App() {
  const [chords, setChords] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.trim()) {
      const matchingSuggestions = commonChords
        .filter(chord => 
          chord.toLowerCase().startsWith(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(matchingSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const addChord = (chord: string) => {
    const normalizedChord = chord.trim();
    if (!normalizedChord) {
      setError('Please enter a chord');
      return;
    }
    
    if (chords.includes(normalizedChord)) {
      setError('This chord is already added');
      return;
    }

    setChords(prev => [...prev, normalizedChord]);
    setInputValue('');
    setSuggestions([]);
    setError('');
  };

  const removeChord = (chordToRemove: string) => {
    setChords(prev => {
      const newChords = prev.filter(chord => chord !== chordToRemove);
      if (newChords.length === 0) {
        setError('');
      }
      return newChords;
    });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addChord(inputValue);
    }
  };

  let possibleKeys: string[] = [];
  try {
    possibleKeys = chords.length > 0 ? getKeysFromChords(chords) : [];
  } catch (err) {
    console.error('Error finding keys:', err);
  }

  return (
    <div className="container">
      <h1>Musical Key Finder Tool</h1>
      <h2>Add the chords in your song below</h2>
      
      <div className="chord-input">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter a chord (e.g., Am, C, F#m)"
        />
        <button onClick={() => addChord(inputValue)}>Add Chord</button>
      </div>

      {suggestions.length > 0 && (
        <div 
          className="chord-tags"
          role="list"
          aria-label="chord suggestions"
        >
          {suggestions.map(suggestion => (
            <button 
              key={suggestion} 
              className="chord-tag suggestion"
              onClick={() => addChord(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {error && <div className="error" role="alert">{error}</div>}

      <div 
        className="chord-tags"
        role="list"
        aria-label="added chords"
      >
        {chords.map(chord => (
          <div key={chord} className="chord-tag">
            {chord}
            <button 
              className="remove-chord" 
              onClick={() => removeChord(chord)}
              aria-label={`Remove ${chord} chord`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {chords.length > 0 && (
        <div 
          className="keys-section"
          role="region"
          aria-label="possible keys"
        >
          <h2>Possible Keys:</h2>
          {possibleKeys.length > 0 ? (
            <div className="key-results">
              {possibleKeys.map(key => (
                <span key={key} className="key-result">
                  {key}
                </span>
              ))}
            </div>
          ) : (
            <div className="error">
              No matching keys found for these chords
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;

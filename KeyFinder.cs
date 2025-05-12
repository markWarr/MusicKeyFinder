using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;

namespace MusicKeyFinder
{
	public class KeyFinder
	{
		private static readonly ReadOnlyCollection<(string Key, HashSet<string> Chords)> _keyData;

		static KeyFinder()
		{
			var rawKeys = new string[,]
			{
				{"Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"},
				{"A", "Bm", "C#m", "D", "E", "F#m", "G#dim"},
				{"Bb", "Cm", "Dm", "Eb", "F", "Gm", "Adim"},
				{"B", "C#m", "D#m", "E", "F#", "G#m", "A#dim"},
				{"C", "Dm", "Em", "F", "G", "Am", "Bdim"},
				{"C#", "D#m", "E#m", "F#", "G#", "A#m", "B#dim"},
				{"Db", "Ebm", "Fm", "Gb", "Ab", "Bbm", "Cdim"},
				{"D", "Em", "F#m", "G", "A", "Bm", "C#dim"},
				{"Eb", "Fm", "Gm", "Ab", "Bb", "Cm", "Ddim"},
				{"E", "F#m", "G#m", "A", "B", "C#m", "D#dim"},
				{"F", "Gm", "Am", "Bb", "C", "Dm", "Edim"},
				{"F#", "G#m", "A#m", "B", "C#", "D#m", "E#dim"},
				{"Gb", "Abm", "Bbm", "Cb", "Db", "Ebm", "Fdim"},
				{"G", "Am", "Bm", "C", "D", "Em", "F#dim"},
			};

			_keyData = Enumerable.Range(0, rawKeys.GetLength(0))
				.Select(i => (
					Key: rawKeys[i, 0],
					Chords: new HashSet<string>(
						Enumerable.Range(0, rawKeys.GetLength(1))
							.Select(j => rawKeys[i, j]),
						StringComparer.OrdinalIgnoreCase
					)
				))
				.ToList()
				.AsReadOnly();
		}

		public IEnumerable<string> GetKeysFromChords(IEnumerable<string> chords)
		{
			if (chords is null)
				throw new ArgumentNullException(nameof(chords));

			var inputChords = chords.ToList();
			if (!inputChords.Any())
				throw new ArgumentException("At least one chord must be provided.", nameof(chords));

			return _keyData
				.Where(keyData => inputChords.All(chord => keyData.Chords.Contains(chord)))
				.Select(keyData => keyData.Key);
		}
	}
}


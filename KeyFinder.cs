using System;
namespace MusicKeyFinder
{
	public class KeyFinder
	{
       string[,] keys = {
            {"Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"},
            {"Ab", "Bbm", "Cm", "Db", "Eb", "Fm", "Gdim"},
            {"A", "Bm",  "C#m", "D", "E", "F#m", "G#dim"},
            {"Bb","Cm", "Dm", "Eb","F",  "Gm",  "Adim"},
            {"B", "C#m","D#m", "E", "F#", "G#m", "A#dim"},
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

		public KeyFinder()
		{

        }

        public string[] GetKeysFromChords(string[] chords)
        {
            var potentialkeys = new List<string>();
            for(int i = 0; i < this.keys.GetLength(0); i++)
            {
                var chordsToSatisfy = new List<string>(chords);
                for (int j = 0; j < this.keys.GetLength(1); j++)
                {
                    foreach(string chordToSatisfy in chords)
                    {
                        if (this.keys[i, j].ToLower().Equals(chordToSatisfy.ToLower()))
                        {
                            var indexToRemove = chordsToSatisfy.FindIndex(x => x.Equals(chordToSatisfy, StringComparison.OrdinalIgnoreCase));
                            chordsToSatisfy.RemoveAt(indexToRemove);            
                        }
                    }
                    if (chordsToSatisfy.Count == 0)
                    {
                        potentialkeys.Add(this.keys[i, 0]);
                        break;
                    }

                }
            }
            return potentialkeys.ToArray();
        }
    }
}


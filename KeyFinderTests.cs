using System.Linq;

namespace MusicKeyFinder;

public class KeyFinderTests
{
    [Fact]
    public void With_Chord_E_suggest_keys_E_B_A()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new[] { "E" });
        Assert.Contains("E", keys);
        Assert.Contains("B", keys);
        Assert.Contains("A", keys);
    }

    [Fact]
    public void With_Chords_In_mixed_case_suggest_correct_keys()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new[] { "c#m", "D#M", "E", "F#", "g#M", "A#DiM" });
        Assert.Contains("B", keys);
    }

    [Fact]
    public void With_Chord_A_Bm_suggest_keys_A_D()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new[] { "A", "Bm" });
        Assert.Equal(2, keys.Count());
        Assert.Contains("A", keys);
        Assert.Contains("D", keys);
    }

    [Fact]
    public void With_Non_existant_Chord_suggests_no_keys()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new[] { "Z", "Bm" });
        Assert.Empty(keys);
    }

    [Fact]
    public void With_bad_Chord_combination_suggests_no_keys()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new[] { "B", "Bm" });
        Assert.Empty(keys);
    }

    [Fact]
    public void With_All_Chords_In_B_suggest_B()
    { 
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new[] { "C#m", "D#m", "E", "F#", "G#m", "A#dim" });
        Assert.Contains("B", keys);
    }

    [Fact]
    public void With_All_Chords_In_B_out_order_suggest_B()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new[] { "D#m", "E", "F#", "G#m", "A#dim", "C#m" });
        Assert.Contains("B", keys);
    }

    [Fact]
    public void With_All_Chords_In_G_out_of_order_suggest_G()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new[] { "G", "F#dim", "Am", "C", "D", "Bm", "Em" });
        Assert.Contains("G", keys);
    }

    [Fact]
    public void With_Null_Input_Throws_ArgumentNullException()
    {
        KeyFinder keyfinder = new();
        Assert.Throws<ArgumentNullException>(() => keyfinder.GetKeysFromChords(null!));
    }

    [Fact]
    public void With_Empty_Input_Throws_ArgumentException()
    {
        KeyFinder keyfinder = new();
        Assert.Throws<ArgumentException>(() => keyfinder.GetKeysFromChords(Array.Empty<string>()));
    }
}

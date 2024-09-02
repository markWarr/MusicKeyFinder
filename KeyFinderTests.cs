namespace MusicKeyFinder;

public class KeyFinderTests
{
    [Fact]
    public void With_Chord_E_suggest_keys_E_B_A()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new string[] { "E" });
        Assert.Contains("E", keys);
        Assert.Contains("B", keys);
        Assert.Contains("A", keys);
    }

    [Fact]
    public void With_Chords_In_mixed_case_suggest_correct_keys()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new string[] { "c#m", "D#M", "E", "F#", "g#M", "A#DiM" });
        Assert.Contains("B", keys);
    }

    [Fact]
    public void With_Chord_A_Bm_suggest_keys_A_D()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new string[] { "A", "Bm" });
        Assert.True(keys.Length == 2);
        Assert.Contains("A", keys);
        Assert.Contains("D", keys);
    }

    [Fact]
    public void With_Non_existant_Chord_suggests_no_keys()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new string[] { "Z", "Bm" });
        Assert.True(keys.Length == 0);
    }

    [Fact]
    public void With_bad_Chord_combination_suggests_no_keys()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new string[] { "B", "Bm" });
        Assert.True(keys.Length == 0);
    }

    [Fact]
    public void With_All_Chords_In_B_suggest_B()
    { 
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new string[] { "C#m", "D#m", "E", "F#", "G#m", "A#dim" });
        Assert.Contains("B", keys);
    }

    [Fact]
    public void With_All_Chords_In_B_out_order_suggest_B()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new string[] { "D#m", "E", "F#", "G#m", "A#dim", "C#m" });
        Assert.Contains("B", keys);
    }

    [Fact]
    public void With_All_Chords_In_G_out_of_order_suggest_G()
    {
        KeyFinder keyfinder = new();
        var keys = keyfinder.GetKeysFromChords(new string[] { "G", "F#dim", "Am", "C", "D", "Bm", "Em" });
        Assert.Contains("G", keys);
    }
}

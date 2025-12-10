(() => {
  const notesSharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const notesFlat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];

  const noteToIndex = {
    C: 0, "C#": 1, Db: 1,
    D: 2, "D#": 3, Eb: 3,
    E: 4, Fb: 4, "E#": 5,
    F: 5, "F#": 6, Gb: 6,
    G: 7, "G#": 8, Ab: 8,
    A: 9, "A#": 10, Bb: 10,
    B: 11, Cb: 11
  };

  function shiftNote(note, step) {
    const idx = noteToIndex[note];
    if (idx === undefined) return note;

    const prefersFlat = note.includes("b");
    const prefersSharp = note.includes("#");
    const useFlat = prefersFlat && !prefersSharp;

    const targetIndex = (idx + step + 12) % 12;
    return useFlat ? notesFlat[targetIndex] : notesSharp[targetIndex];
  }

  function transposeChord(chord, step) {
    // Match root + quality + optional slash bass: e.g., F#m7b5/G#
    const match = chord.match(/^([A-G][b#]?)([^/]*)(?:\/([A-G][b#]?))?$/);
    if (!match) return chord;

    const [, root, quality, bass] = match;
    const newRoot = shiftNote(root, step);
    const newBass = bass ? shiftNote(bass, step) : null;

    return newBass ? `${newRoot}${quality}/${newBass}` : `${newRoot}${quality}`;
  }

  function transposeText(text, step) {
    return text.replace(/\[([^\]]+)\]/g, (_, chordText) => {
      // If multiple chords inside one bracket separated by space, transpose each.
      const parts = chordText.split(/\s+/).map((ch) => transposeChord(ch, step));
      return `[${parts.join(" ")}]`;
    });
  }

  function adjustTone(step) {
    const songBlocks = document.querySelectorAll("pre.song");
    songBlocks.forEach((block) => {
      block.textContent = transposeText(block.textContent, step);
    });
  }

  function init() {
    const btnUp = document.getElementById("tone-up");
    const btnDown = document.getElementById("tone-down");
    if (!btnUp || !btnDown) return;

    btnUp.addEventListener("click", () => adjustTone(1));
    btnDown.addEventListener("click", () => adjustTone(-1));
  }

  document.addEventListener("DOMContentLoaded", init);
})();


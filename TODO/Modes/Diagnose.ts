import { LocationWord } from "bc-vscode-words";
import { DiagnosticsBuilder } from "../../Diagnostics/Builder";
import { ModeCollection } from "bc-minecraft-bedrock-types/lib/src/Modes/ModeCollection";

export function DiagnoseMode(Word: LocationWord, Mode: ModeCollection, builder: DiagnosticsBuilder): void {
  const Text = Word.text;

  const Modes = Mode.modes;
  for (let I = 0; I < Modes.length; I++) {
    let Element = Modes[I];

    if (Text === Element.name) {
      return;
    }
  }

  builder.AddWord(Word, `Unknown mode type: ${Text} for mode type: '${Mode.name}'`).code = `${Mode.name.toLowerCase()}.invalid`;
}

import { Internal, Map, TextDocument } from "bc-minecraft-bedrock-project";
import { MinecraftData } from "bc-minecraft-bedrock-vanilla-data";
import { DiagnosticSeverity } from "../../../../main";
import { DiagnosticsBuilder } from "../../../Types/DiagnosticsBuilder/DiagnosticsBuilder";
import { education_enabled } from "../../Definitions";
import { Json } from "../../Json/Json";

/**Diagnoses the given document as a `sound_definitions` file
 * @param doc The text document to diagnose
 * @param diagnoser The diagnoser builder to receive the errors*/
export function Diagnose(doc: TextDocument, diagnoser: DiagnosticsBuilder): void {
  const defintions = Json.LoadReport<Internal.ResourcePack.SoundDefinitions>(doc, diagnoser);
  if (!Internal.ResourcePack.SoundDefinitions.is(defintions)) return;

  //Get pack for files search
  const pack = diagnoser.context.getCache().ResourcePacks.get(doc.uri);
  if (pack === undefined) return;

  const sounds = defintions.sound_definitions;
  const sound_files = diagnoser.context
    .getFiles(pack.folder, ["**/sounds/**/*.{fsb,wav,ogg}"], pack.context.ignores)
    .map((item) => item.replace(/\\/gi, "/"));

  //For each sound definition
  Map.forEach(sounds, (sound, sound_id) => {
    //For each file reference
    sound.sounds.forEach((soundSpec) => {
      if (typeof soundSpec === "string") {
        sound_files_diagnose(sound_id, soundSpec, sound_files, diagnoser);
      } else {
        const name = (<{ name?: string }>soundSpec).name;
        if (typeof name === "string") {
          sound_files_diagnose(sound_id, name, sound_files, diagnoser);
        }
      }
    });
  });
}

export function sound_files_diagnose(owner: string, file: string, files: string[], diagnoser: DiagnosticsBuilder): void {
  for (let I = 0; I < files.length; I++) {
    if (files[I].includes(file)) {
      //Found then return out
      return;
    }
  }

  if (MinecraftData.ResourcePack.hasSound(file, education_enabled(diagnoser))) return;

  diagnoser.Add(`${owner}/${file}`, `Cannot find file: ${file}`, DiagnosticSeverity.error, "resourpack.sound.missing");
}

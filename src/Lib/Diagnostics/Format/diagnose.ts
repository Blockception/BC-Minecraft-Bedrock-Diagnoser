import { Pack } from "bc-minecraft-bedrock-project";
import { DiagnosticsBuilder, DiagnosticSeverity } from "../../Types/DiagnosticsBuilder";

/**Max relative length form pack / worldtemplate */
const LengthFromRoot = 80;
const SegmentLength = 59;
const PackNameLength = 10;

export function format_diagnose_path(pack: Pack, uri: string, diagnoser: DiagnosticsBuilder) {
  const root = pack.folder;
  const index = uri.indexOf(root);
  let length = root.length;

  const c = uri.charAt(index + length);
  if (c === '/' || c === '\\') length++;

  const relpath = uri.slice(index + length);

  if (relpath.length > LengthFromRoot) {
    diagnoser.Add(0, `Path is too long: '${relpath}', should be maximum of: ${LengthFromRoot} but is: ${relpath.length} characters long`, DiagnosticSeverity.error, "minecraft.format.path.length");
  }

  //Check each segment of the path
  relpath.split(/[\\\/]/gim).forEach(seg => {
    if (seg.length > SegmentLength) {
      diagnoser.Add(0, `Segment of path is too long: '${seg}' in ${relpath}, should be maximum of: ${SegmentLength} but is: ${seg.length} characters long`, DiagnosticSeverity.error, "minecraft.format.path.length");
    }
  });

  //TODO folder name check
}

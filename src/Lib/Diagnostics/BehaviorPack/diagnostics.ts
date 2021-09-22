/** //TODO validatie behavior folder pack
export function ValidateBehaviorFolder(doc: TextDocument): void {
  const SubFolder = GetSubFolder(doc.uri);

  if (!SubFolder) return;

  switch (SubFolder.toLowerCase()) {
    case "animation_controllers":
    case "animations":
    case "blocks":
    case "biomes":
    case "dialogue":
    case "documentation":
    case "entities":
    case "feature_rules":
    case "features":
    case "functions":
    case "loot_tables":
    case "items":
    case "recipes":
    case "scripts":
    case "spawn_rules":
    case "structures":
    case "trading":
    case "texts":
    case "volumes":
      return;

    default:
      IllegalFolder(doc, SubFolder);
  }
}
*/

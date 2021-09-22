/** //TODO check resourcepack folders
export function ValidateResourceFolder(doc: TextDocument): void {
  const SubFolder = GetSubFolder(doc.uri);

  if (!SubFolder) return;

  switch (SubFolder.toLowerCase()) {
    case "animation_controllers":
    case "animations":
    case "attachables":
    case "blocks":
    case "entity":
    case "fogs":
    case "font":
    case "items":
    case "materials":
    case "models":
    case "particles":
    case "render_controllers":
    case "sounds":
    case "texts":
    case "textures":
    case "ui":
      return;

    default:
      IllegalFolder(doc, SubFolder);
  }
}
 */

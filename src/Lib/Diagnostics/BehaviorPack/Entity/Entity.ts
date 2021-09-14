import { Internal, Map } from "bc-minecraft-bedrock-project";

export function getUsedComponents(entity: Internal.BehaviorPack.Entity): string[] {
  const out: string[] = [];

  if (entity["minecraft:entity"].components) {
    Object.getOwnPropertyNames(entity["minecraft:entity"].components).forEach((c) => {
      if (!out.includes(c)) out.push(c);
    });
  }

  const groups = entity["minecraft:entity"].component_groups;

  if (groups) {
    Map.forEach(groups, (group) => {
      Object.getOwnPropertyNames(group).forEach((c) => {
        if (!out.includes(c)) out.push(c);
      });
    });
  }

  return out;
}

export function getUsedGroups(entity: Internal.BehaviorPack.Entity): string[] {
  const groups = entity["minecraft:entity"].component_groups;

  if (groups) {
    return Object.getOwnPropertyNames(groups);
  }

  return [];
}

/**
 *
 * @param entity
 * @param group
 * @returns
 */
export function hasGroup(entity: Internal.BehaviorPack.Entity, group: string): boolean {
  if (entity["minecraft:entity"].component_groups) {
    if (entity["minecraft:entity"].component_groups[group]) {
      return true;
    }
  }

  return false;
}



interface Container {
  components: Record<string, any>;
  component_groups: Record<string, Record<string, any>>;
}


export function getUsedComponents(entity: Internal.BehaviorPack.Entity): string[] {
  const out: string[] = [];

  if (entity["minecraft:entity"].components) {
    Object.getOwnPropertyNames(entity["minecraft:entity"].components).forEach((c) => {
      if (!out.includes(c)) out.push(c);
    });
  }

  const groups = entity["minecraft:entity"].component_groups;

  if (groups) {
    SMap.forEach(groups, (group) => {
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
import { DiagnosticsBuilder } from "../../../../main";
import { Minecraft } from "bc-minecraft-bedrock-types";
import { diagnose_filter_is_family } from './Filters/is_family';
import { diagnose_filter_has_tag } from './Filters/has_tag';

export function minecraft_diagnose_filters(value: any, diagnoser: DiagnosticsBuilder) {
  if (typeof value !== "object") return;

  Minecraft.Filter.Filter.forEach(value, (filter) => minecraft_diagnose_filter(filter, diagnoser));
}

export function minecraft_diagnose_filter(value: Minecraft.Filter.Filter, diagnoser: DiagnosticsBuilder) {
  const callfn = FilterDiagnose[value.test];

  if (callfn) {
    callfn(value, diagnoser);
  }
}

const FilterDiagnose: { [key: string]: (value: Minecraft.Filter.Filter, diagnoser: DiagnosticsBuilder) => void } = {
    "is_family": diagnose_filter_is_family,
    "has_tag": diagnose_filter_has_tag,
};
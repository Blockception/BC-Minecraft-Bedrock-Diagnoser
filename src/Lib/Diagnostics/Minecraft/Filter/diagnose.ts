import { DiagnosticsBuilder } from "../../../../main";
import { Minecraft } from "bc-minecraft-bedrock-types";
import { diagnose_filter_is_family } from "./Filters/is_family";
import { diagnose_filter_has_tag } from "./Filters/has_tag";
import { diagnose_filter_property } from "./Filters/property";

export function minecraft_diagnose_filters(value: any, diagnoser: DiagnosticsBuilder) {
  if (typeof value !== "object") return;

  Minecraft.Filter.Filter.forEach(value, (filter) => minecraft_diagnose_filter(filter, diagnoser));
}

export function minecraft_diagnose_filter(value: Minecraft.Filter.Filter, diagnoser: DiagnosticsBuilder) {
  const callFn = FilterDiagnose[value.test];

  if (callFn) {
    callFn(value, diagnoser);
  }
}

const FilterDiagnose: Record<string, (value: Minecraft.Filter.Filter, diagnoser: DiagnosticsBuilder) => void> = {
  is_family: diagnose_filter_is_family,
  has_tag: diagnose_filter_has_tag,

  //Properties
  int_property: diagnose_filter_property,
  bool_property: diagnose_filter_property,
  float_property: diagnose_filter_property,
  enum_property: diagnose_filter_property,
  has_property: diagnose_filter_property,
};

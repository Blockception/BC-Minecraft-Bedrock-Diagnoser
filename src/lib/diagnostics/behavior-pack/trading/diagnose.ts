import { Types } from "bc-minecraft-bedrock-types";
import { Errors } from "../..";
import { DiagnosticsBuilder } from "../../../types";

export function diagnose_trading_implementation(id: Types.OffsetWord | string, diagnoser: DiagnosticsBuilder): boolean {
  const strId = typeof id === "string" ? id : id.text;

  //Project has trading
  const anim = diagnoser.context.getProjectData().behaviors.trading.get(strId, diagnoser.project);
  if (anim === undefined) {
    Errors.missing("behaviors", "trading", id, diagnoser);
    return false;
  }

  return true;
}

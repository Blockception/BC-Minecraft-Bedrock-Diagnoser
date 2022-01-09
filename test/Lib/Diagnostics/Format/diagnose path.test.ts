import { BehaviorPack } from 'bc-minecraft-bedrock-project';
import { MCProject } from 'bc-minecraft-project';
import { format_diagnose_path } from '../../../../src/Lib/Diagnostics/Format/diagnose';
import { TestDiagnoser } from "../../../diagnoser";

describe("Filepath lengths", ()=>{
  it("Total length",()=>{
    const diagnoser = new TestDiagnoser();
    const path = 'Content/world_template/behavior_packs/TE-bp/functions/abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyabcdefghijklmnopqrstuvwxy.mcfunction';

    const p = new BehaviorPack.BehaviorPack('Content/world_template/behavior_packs/TE-bp', MCProject.createEmpty());
    format_diagnose_path(p, path, diagnoser);

    diagnoser.expectAmount(2);
  });

  it("Total length2",()=>{
    const diagnoser = new TestDiagnoser();
    const path = 'Content/world_template/behavior_packs/TE-bp/functions/abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz/abcdefghijklmnopqrstuvwxy/abcdefghijklmnopqrstuvwxy.mcfunction';

    const p = new BehaviorPack.BehaviorPack('Content/world_template/behavior_packs/TE-bp', MCProject.createEmpty());
    format_diagnose_path(p, path, diagnoser);

    diagnoser.expectAmount(1);
  });

  it("Segment length2",()=>{
    const diagnoser = new TestDiagnoser();
    const path = 'Content/world_template/behavior_packs/TE-bp/functions/abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefg.mcfunction';

    const p = new BehaviorPack.BehaviorPack('Content/world_template/behavior_packs/TE-bp', MCProject.createEmpty());
    format_diagnose_path(p, path, diagnoser);

    diagnoser.expectAmount(1);
  });

  it("Just Okay",()=>{
    const diagnoser = new TestDiagnoser();
    const path = 'Content/world_template/behavior_packs/TE-bp/functions/abcdefghij/abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstu.mcfunction';

    const p = new BehaviorPack.BehaviorPack('Content/world_template/behavior_packs/TE-bp', MCProject.createEmpty());
    format_diagnose_path(p, path, diagnoser);

    diagnoser.expectEmpty();
  });
});
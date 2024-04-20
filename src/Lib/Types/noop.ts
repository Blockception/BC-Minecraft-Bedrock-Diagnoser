import { TextDocument } from 'bc-minecraft-bedrock-project';
import { DocumentLocation } from 'bc-minecraft-bedrock-types/lib/src/types';
import { MCProject } from 'bc-minecraft-project';
import { DiagnosticsBuilder, DiagnosticsBuilderContent } from './DiagnosticsBuilder';
import { DiagnosticSeverity } from './Severity';


export class NoopDiagnoser<T extends TextDocument> implements DiagnosticsBuilder<T> {
  context: DiagnosticsBuilderContent<T>;
  project: MCProject;

  constructor(base: DiagnosticsBuilder<T>) {
    this.context = base.context;
    this.project = base.project;
  }

  add(position: DocumentLocation, message: string, severity: DiagnosticSeverity, code: string | number): void {
    //Do nothing
  }
}
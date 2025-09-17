import { Types } from "bc-minecraft-bedrock-types";

export interface Diagnostic {
  /** any additional data the diagnostic might carry across for hints */
  withData(data: any): this;
  /** marks the code that is selected via @see Types.DocumentLocation as deprecated, usefull for some LSP */
  isDeprecated(): this;
  /** marks the code that is selected via @see Types.DocumentLocation as unnecessary, usefull for some LSP */
  isUnnecessary(): this;
  /** some LSP's can link to the code that is causing or source of trouble */
  withRelated(message: string, uri: string, pos: Types.DocumentLocation): this;
}

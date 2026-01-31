export type FileType = "code" | "config" | "manifest" | "pipeline" | "unknown";

export type Runtime = "client" | "server" | "unknown";

export type Platform =
  | "android"
  | "ios"
  | "web"
  | "backend"
  | "devops"
  | "unknown";

export type AssignmentStyle = "code" | "markup" | "env" | "unknown";

export interface ContextSignals {
  fileType: FileType;
  runtime: Runtime;
  platform: Platform;
  assignmentStyle: AssignmentStyle;
}

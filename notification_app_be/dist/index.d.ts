type Stack = "frontend" | "backend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";
type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "route" | "service" | "auth" | "config" | "middleware" | "utils";
type Package = FrontendPackage | BackendPackage;
export declare function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void>;
export {};

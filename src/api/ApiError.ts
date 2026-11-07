export type ApiErrorKind = "http" | "network" | "invalid-response";

type ApiErrorDetails = {
  kind: ApiErrorKind;
  method: string;
  path: string;
  status?: number;
  cause?: unknown;
};

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly method: string;
  readonly path: string;
  readonly status?: number;

  constructor({ kind, method, path, status, cause }: ApiErrorDetails) {
    const reason =
      kind === "http"
        ? `HTTP ${status}`
        : kind === "network"
          ? "Network request failed"
          : "Invalid API response";

    super(`[Questlog API] ${method} ${path}: ${reason}`, { cause });

    this.name = "ApiError";
    this.kind = kind;
    this.method = method;
    this.path = path;
    this.status = status;
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === "AbortError";
}

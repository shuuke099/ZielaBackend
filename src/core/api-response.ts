export class ApiResponse<T> {
  constructor(
    public success: boolean,
    public data: T | null,
    public message?: string,
    public timestamp: string = new Date().toISOString(),
  ) {}

  static success<T>(data: T, message?: string) {
    return new ApiResponse(true, data, message);
  }

  static error(message: string) {
    return new ApiResponse(false, null, message);
  }
}

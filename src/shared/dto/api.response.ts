// src/shared/dto/success-response.dto.ts
export class ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

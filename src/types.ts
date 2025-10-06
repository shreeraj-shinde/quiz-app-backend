// Shared backend <-> frontend types
// Importing only types avoids bundling runtime code when consumed by frontend using `import type`

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
// JWT payload embedded in tokens
export interface TokenPayload {
  userId: string;
  role: Role;
  // Standard JWT fields
  iat?: number;
  exp?: number;
}

// Shape added by auth middleware on `req.user`
export interface AuthUser {
  id: string;
  role: Role;
}

// Generic API error response
export interface ApiError {
  error: string;
}

// ===== Auth endpoints =====
export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface LoginResponseBody {
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  token: string;
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponseBody {
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  status?: number;
}

export enum QuestionType {
  MCQ = "MCQ",
  
}

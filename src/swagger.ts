import type { Express } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Build Swagger/OpenAPI spec
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Quiz App API",
    version: "1.0.0",
    description: "API documentation for the Quiz App backend",
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 5000}`,
      description: "Local development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "token",
        description: "JWT set as httpOnly cookie named 'token'",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: { type: "string" },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string" },
                message: { type: "string" },
              },
            },
          },
        },
      },
      MessageResponse: {
        type: "object",
        properties: { message: { type: "string" } },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["ADMIN", "USER"] },
        },
      },
      Option: {
        type: "object",
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          isCorrect: { type: "boolean" },
        },
      },
      Question: {
        type: "object",
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          type: {
            type: "string",
            enum: [
              "MCQ",
              "TRUE_FALSE",
              "FILL_BLANK",
              "MCQ_MULTIPLE",
              "DESCRIPTIVE",
            ],
          },
          timeLimit: { type: "number" },
          options: {
            type: "array",
            items: { $ref: "#/components/schemas/Option" },
          },
        },
      },
      Quiz: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          questions: {
            type: "array",
            items: { $ref: "#/components/schemas/Question" },
          },
        },
      },
      QuizSummary: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          isAttempted: { type: "boolean" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password", "role"],
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string" },
          role: { type: "string", enum: ["ADMIN", "USER"] },
        },
      },
      CreateQuizRequest: {
        type: "object",
        required: ["title", "description", "questions"],
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          questions: {
            type: "array",
            items: {
              type: "object",
              required: ["text", "type", "timeLimit"],
              properties: {
                text: { type: "string" },
                type: {
                  type: "string",
                  enum: [
                    "MCQ",
                    "TRUE_FALSE",
                    "FILL_BLANK",
                    "MCQ_MULTIPLE",
                    "DESCRIPTIVE",
                  ],
                },
                timeLimit: { type: "number" },
                options: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      text: { type: "string" },
                      isCorrect: { type: "boolean" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      UpdateQuizRequest: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          questions: { $ref: "#/components/schemas/CreateQuizRequest/properties/questions" },
        },
      },
      AttemptQuizRequest: {
        type: "object",
        required: ["answers"],
        properties: {
          answers: {
            type: "array",
            items: {
              oneOf: [
                {
                  type: "object",
                  required: ["questionId", "selectedOptionId"],
                  properties: {
                    questionId: { type: "string" },
                    selectedOptionId: { type: "string" },
                  },
                },
                {
                  type: "object",
                  required: ["questionId", "selectedOptionIds"],
                  properties: {
                    questionId: { type: "string" },
                    selectedOptionIds: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
                {
                  type: "object",
                  required: ["questionId", "answer"],
                  properties: {
                    questionId: { type: "string" },
                    answer: { type: "string", maxLength: 300 },
                  },
                },
              ],
            },
          },
        },
      },
      SubmitResult: {
        type: "object",
        properties: {
          quizId: { type: "string" },
          userId: { type: "string" },
          score: { type: "number" },
          total: { type: "number" },
          resultId: { type: "string" },
          details: {
            type: "array",
            items: {
              type: "object",
              properties: {
                questionId: { type: "string" },
                correct: { type: "boolean" },
                expected: { type: "string" },
                received: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }, { cookieAuth: [] }],
  tags: [
    { name: "Auth", description: "Authentication endpoints" },
    { name: "Users", description: "User management endpoints" },
    { name: "Quiz", description: "Quiz management and submission endpoints" },
  ],
  paths: {
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          200: {
            description: "Login successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    user: { $ref: "#/components/schemas/User" },
                    token: { type: "string" },
                  },
                },
              },
            },
          },
          400: { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterRequest" },
            },
          },
        },
        responses: {
          201: {
            description: "User registered",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/MessageResponse" },
              },
            },
          },
          400: { description: "Validation/Email already registered", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/users/": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: {
            description: "List of users",
            content: {
              "application/json": {
                schema: { type: "array", items: { $ref: "#/components/schemas/User" } },
              },
            },
          },
          401: { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/users/profile": {
      get: {
        tags: ["Users"],
        summary: "Get current user profile",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: { description: "Current user", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          400: { description: "User id missing", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          401: { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/users/{id}": {
      get: {
        tags: ["Users"],
        summary: "Get user by id",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "User", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/quiz/create": {
      post: {
        tags: ["Quiz"],
        summary: "Create quiz (admin)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": { schema: { $ref: "#/components/schemas/CreateQuizRequest" } },
          },
        },
        responses: {
          201: { description: "Created quiz", content: { "application/json": { schema: { $ref: "#/components/schemas/Quiz" } } } },
          401: { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          403: { description: "Admin access required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/quiz/{id}": {
      patch: {
        tags: ["Quiz"],
        summary: "Update quiz (admin)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateQuizRequest" } } },
        },
        responses: {
          200: { description: "Updated quiz", content: { "application/json": { schema: { $ref: "#/components/schemas/Quiz" } } } },
          404: { description: "Quiz not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      delete: {
        tags: ["Quiz"],
        summary: "Delete quiz (admin)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/MessageResponse" } } } },
          404: { description: "Quiz not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
      get: {
        tags: ["Quiz"],
        summary: "Get quiz by id",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: {
            description: "Quiz",
            content: {
              "application/json": {
                schema: {
                  allOf: [
                    { $ref: "#/components/schemas/Quiz" },
                    {
                      type: "object",
                      properties: { isAttempted: { type: "boolean" } },
                    },
                  ],
                },
              },
            },
          },
          404: { description: "Quiz not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/quiz/getQuestions/{id}": {
      get: {
        tags: ["Quiz"],
        summary: "Get questions by quiz id",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        responses: {
          200: { description: "Questions", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/Question" } } } } },
          404: { description: "Quiz/Questions not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/quiz/all": {
      get: {
        tags: ["Quiz"],
        summary: "Get all quizzes",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        responses: {
          200: { description: "Quizzes", content: { "application/json": { schema: { type: "array", items: { $ref: "#/components/schemas/QuizSummary" } } } } },
          404: { description: "Not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
    "/quiz/submit/{id}": {
      post: {
        tags: ["Quiz"],
        summary: "Submit quiz (user)",
        security: [{ bearerAuth: [] }, { cookieAuth: [] }],
        parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { $ref: "#/components/schemas/AttemptQuizRequest" } } },
        },
        responses: {
          200: { description: "Submission result", content: { "application/json": { schema: { $ref: "#/components/schemas/SubmitResult" } } } },
          401: { description: "Authentication required", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          500: { description: "Server error", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
        },
      },
    },
  },
};

const swaggerOptions: swaggerJsdoc.Options = {
  definition: swaggerDefinition as any,
  // Optionally scan route/controller files with JSDoc @swagger comments
  apis: [
    "./src/routes/*.ts",
    "./src/controllers/*.ts",
    "./src/validationSchema/*.ts",
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);

export function setupSwagger(app: Express) {
  // UI at /docs
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
  // Raw JSON at /swagger.json
  app.get("/swagger.json", (_req, res) => {
    res.json(swaggerSpec);
  });
}

export default setupSwagger;
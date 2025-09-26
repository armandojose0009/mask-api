import { HttpException, HttpStatus } from "@nestjs/common";

export class CacheConnectionException extends HttpException {
  constructor() {
    super("Cache service unavailable", HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class DatabaseConnectionException extends HttpException {
  constructor() {
    super("Database service unavailable", HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class InvalidInputException extends HttpException {
  constructor(message: string) {
    super(`Invalid input: ${message}`, HttpStatus.BAD_REQUEST);
  }
}

import { Test, TestingModule } from "@nestjs/testing";
import { HttpException, HttpStatus } from "@nestjs/common";
import { MaskController } from "./mask.controller";
import { MaskService } from "./mask.service";
import {
  InvalidInputException,
  DatabaseConnectionException,
  CacheConnectionException,
} from "./exceptions/mask.exceptions";

describe("MaskController", () => {
  let controller: MaskController;
  let mockMaskService: jest.Mocked<MaskService>;

  beforeEach(async () => {
    mockMaskService = {
      maskString: jest.fn(),
      getHistory: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MaskController],
      providers: [{ provide: MaskService, useValue: mockMaskService }],
    }).compile();

    controller = module.get<MaskController>(MaskController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe('maskString', () => {
    it("should return masked string", async () => {
      mockMaskService.maskString.mockResolvedValue("###########3561");
      const input = { input: "455636460793561" };
      const result = await controller.maskString(input);
      expect(result).toEqual({ result: "###########3561" });
    });

    it("should throw InvalidInputException", async () => {
      mockMaskService.maskString.mockRejectedValue(new InvalidInputException("Invalid input"));
      const input = { input: "" };
      await expect(controller.maskString(input)).rejects.toThrow(InvalidInputException);
    });

    it("should throw DatabaseConnectionException", async () => {
      mockMaskService.maskString.mockRejectedValue(new DatabaseConnectionException());
      const input = { input: "test" };
      await expect(controller.maskString(input)).rejects.toThrow(DatabaseConnectionException);
    });

    it("should throw CacheConnectionException", async () => {
      mockMaskService.maskString.mockRejectedValue(new CacheConnectionException());
      const input = { input: "test" };
      await expect(controller.maskString(input)).rejects.toThrow(CacheConnectionException);
    });

    it("should throw HttpException for unexpected errors", async () => {
      mockMaskService.maskString.mockRejectedValue(new Error("Unexpected error"));
      const input = { input: "test" };
      await expect(controller.maskString(input)).rejects.toThrow(HttpException);
    });
  });

  describe('getHistory', () => {
    it("should return history", async () => {
      const mockHistory = [] as any;
      mockMaskService.getHistory.mockResolvedValue(mockHistory);
      const result = await controller.getHistory();
      expect(result).toEqual(mockHistory);
    });

    it("should throw DatabaseConnectionException", async () => {
      mockMaskService.getHistory.mockRejectedValue(new DatabaseConnectionException());
      await expect(controller.getHistory()).rejects.toThrow(DatabaseConnectionException);
    });

    it("should throw HttpException for unexpected errors", async () => {
      mockMaskService.getHistory.mockRejectedValue(new Error("Unexpected error"));
      await expect(controller.getHistory()).rejects.toThrow(HttpException);
    });
  });
});

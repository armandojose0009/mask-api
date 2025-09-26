import { Test, TestingModule } from "@nestjs/testing";
import { MaskController } from "./mask.controller";
import { MaskService } from "./mask.service";

describe("MaskController", () => {
  let controller: MaskController;
  let mockMaskService: jest.Mocked<MaskService>;

  beforeEach(async () => {
    mockMaskService = {
      maskString: jest.fn(),
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

  it("should return masked string", async () => {
    mockMaskService.maskString.mockResolvedValue("###########3561");
    const input = { input: "455636460793561" };
    const result = await controller.maskString(input);
    expect(result).toEqual({ result: "###########3561" });
  });
});

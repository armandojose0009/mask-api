import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MaskService } from './mask.service';
import { CacheService } from './cache.service';
import { MaskRecord } from './schemas/mask-record.schema';

describe('MaskService', () => {
  let service: MaskService;
  let mockCacheService: jest.Mocked<CacheService>;
  let mockMaskRecordModel: any;

  beforeEach(async () => {
    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
    } as any;

    mockMaskRecordModel = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaskService,
        { provide: CacheService, useValue: mockCacheService },
        { provide: getModelToken(MaskRecord.name), useValue: mockMaskRecordModel },
      ],
    }).compile();

    service = module.get<MaskService>(MaskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should mask long string keeping last 4 characters', async () => {
    mockCacheService.get.mockResolvedValue(null);
    mockMaskRecordModel.create.mockResolvedValue({});
    const result = await service.maskString('455636460793561');
    expect(result).toBe('###########3561');
  });

  it('should return same string if length is 4 or less', async () => {
    expect(await service.maskString('1')).toBe('1');
    expect(await service.maskString('')).toBe('');
    expect(await service.maskString('1234')).toBe('1234');
  });

  it('should throw InvalidInputException for null input', async () => {
    await expect(service.maskString(null as any)).rejects.toThrow('Invalid input: Input cannot be null or undefined');
  });

  it('should throw InvalidInputException for non-string input', async () => {
    await expect(service.maskString(123 as any)).rejects.toThrow('Invalid input: Input must be a string');
  });
});

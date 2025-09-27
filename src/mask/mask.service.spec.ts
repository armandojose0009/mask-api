import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MaskService } from './mask.service';
import { CacheService } from './cache.service';
import { MaskRecord } from './schemas/mask-record.schema';
import {
  InvalidInputException,
  DatabaseConnectionException,
} from './exceptions/mask.exceptions';

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
      find: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn(),
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

  describe('maskString', () => {
    it('should mask long string keeping last 4 characters', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockMaskRecordModel.create.mockResolvedValue({});
      const result = await service.maskString('455636460793561');
      expect(result).toBe('###########3561');
    });

    it('should return cached result when available', async () => {
      mockCacheService.get.mockResolvedValue('###########3561');
      const result = await service.maskString('455636460793561');
      expect(result).toBe('###########3561');
      expect(mockMaskRecordModel.create).not.toHaveBeenCalled();
    });

    it('should return same string if length is 4 or less', async () => {
      expect(await service.maskString('1')).toBe('1');
      expect(await service.maskString('')).toBe('');
      expect(await service.maskString('1234')).toBe('1234');
    });

    it('should throw InvalidInputException for null input', async () => {
      await expect(service.maskString(null as any)).rejects.toThrow(InvalidInputException);
    });

    it('should throw InvalidInputException for non-string input', async () => {
      await expect(service.maskString(123 as any)).rejects.toThrow(InvalidInputException);
    });

    it('should throw DatabaseConnectionException when database save fails', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockMaskRecordModel.create.mockRejectedValue(new Error('DB Error'));
      await expect(service.maskString('12345')).rejects.toThrow(DatabaseConnectionException);
    });

    it('should continue when cache is unavailable', async () => {
      mockCacheService.get.mockRejectedValue(new Error('Cache error'));
      mockCacheService.set.mockRejectedValue(new Error('Cache error'));
      mockMaskRecordModel.create.mockResolvedValue({});
      const result = await service.maskString('12345');
      expect(result).toBe('#2345');
    });
  });

  describe('getHistory', () => {
    it('should return history records', async () => {
      const mockHistory = [{ input: 'test', output: 'test', createdAt: new Date() }];
      mockMaskRecordModel.limit.mockResolvedValue(mockHistory);
      const result = await service.getHistory();
      expect(result).toEqual(mockHistory);
      expect(mockMaskRecordModel.find).toHaveBeenCalled();
      expect(mockMaskRecordModel.sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockMaskRecordModel.limit).toHaveBeenCalledWith(100);
    });

    it('should throw DatabaseConnectionException when query fails', async () => {
      mockMaskRecordModel.limit.mockRejectedValue(new Error('DB Error'));
      await expect(service.getHistory()).rejects.toThrow(DatabaseConnectionException);
    });
  });
});

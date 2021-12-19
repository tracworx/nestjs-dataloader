import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import DataLoader from 'dataloader';
import { DataloaderProvider } from '../decorators/dataloader-provider.decorator';
import { DataloaderDiscoveryService } from './dataloader-discovery.service';

@DataloaderProvider()
class TestLoader {
  createDataloader() {
    return new DataLoader<string, string>(async (keys) => keys);
  }
}

describe('DataloaderDiscoveryService', () => {
  let module: TestingModule;
  let service: DataloaderDiscoveryService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [DataloaderDiscoveryService, TestLoader],
    }).compile();

    service = module.get<DataloaderDiscoveryService>(DataloaderDiscoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should discover dataloader providers on init', async () => {
    const spy = jest.spyOn(service, 'discoverDataloaders');
    await module.init();
    expect(spy).toHaveBeenCalled();
  });

  it('should build a map of discovered dataloaders', async () => {
    const mockGqlExecutionContext = createMock<GqlExecutionContext>();
    const spy = jest.spyOn(TestLoader.prototype, 'createDataloader');
    await module.init(); // must be called before createDataloaderMap
    const map = service.createDataloaderMap(mockGqlExecutionContext);
    expect(map.get(TestLoader)).toBeInstanceOf(DataLoader);
    expect(spy).toHaveBeenCalledWith(mockGqlExecutionContext);
  });

  it('should throw when trying to build dataloader map before init', () => {
    const mockCtx = createMock<GqlExecutionContext>();
    expect(() => service.createDataloaderMap(mockCtx)).toThrow(InternalServerErrorException);
  });
});

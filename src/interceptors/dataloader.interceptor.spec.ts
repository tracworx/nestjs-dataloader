import { createMock } from '@golevelup/ts-jest';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Test, TestingModule } from '@nestjs/testing';
import { GQL_CONTEXT_KEY } from 'src/constants';
import { DataloaderDiscoveryService, DataloaderMap } from 'src/services/dataloader-discovery.service';
import { DataloaderInterceptor } from './dataloader.interceptor';

describe('DataloaderInterceptor', () => {
  let module: TestingModule;
  let service: DataloaderDiscoveryService;
  let interceptor: DataloaderInterceptor;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DiscoveryModule],
      providers: [DataloaderDiscoveryService, DataloaderInterceptor],
    }).compile();

    service = module.get<DataloaderDiscoveryService>(DataloaderDiscoveryService);
    interceptor = module.get<DataloaderInterceptor>(DataloaderInterceptor);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should inject dataloaders into the GraphQL context object', () => {
    const mockExecutionContext = createMock<ExecutionContext>();
    const mockGqlExecutionContext = GqlExecutionContext.create(mockExecutionContext);
    const mockCallHandler = createMock<CallHandler>();
    const mockDataloaders = createMock<DataloaderMap>();

    const spy = jest.spyOn(service, 'createDataloaderMap').mockReturnValue(mockDataloaders);

    interceptor.intercept(mockExecutionContext, mockCallHandler);

    expect(mockGqlExecutionContext.getContext()).toHaveProperty(GQL_CONTEXT_KEY, mockDataloaders);
    expect(spy).toHaveBeenCalledWith(mockGqlExecutionContext);
    expect(mockCallHandler.handle).toHaveBeenCalled();
  });
});

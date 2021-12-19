import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { InstanceToken } from '@nestjs/core/injector/module';
import { GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { GQL_CONTEXT_KEY } from '../constants';
import { Loader, loaderDecoratorFactory } from './loader.decorator';

class TestLoader {}

const createMockExecutionContext = (
  dataloaders?: readonly (readonly [InstanceToken, DataLoader<any, any>])[] | null,
): DeepMocked<ExecutionContext> => {
  const mockExecutionContext = createMock<ExecutionContext>();
  const mockGqlExecutionContext = GqlExecutionContext.create(mockExecutionContext);
  if (dataloaders) {
    mockGqlExecutionContext.getContext()[GQL_CONTEXT_KEY] = new Map(dataloaders);
  }
  return mockExecutionContext;
};

describe('Loader', () => {
  it('should be defined', () => {
    expect(Loader).toBeDefined();
  });

  it('should return a dataloader instance from the GraphQL context', async () => {
    const mockToken = TestLoader;
    const mockDataloader = createMock<DataLoader<any, any>>();
    const mockExecutionContext = createMockExecutionContext([[mockToken, mockDataloader]]);

    const dataloader = await loaderDecoratorFactory(mockToken, mockExecutionContext);
    expect(dataloader).toBe(mockDataloader);
  });

  it('should throw if no dataloader map exists in the GraphQL context', async () => {
    const mockToken = TestLoader;
    const mockExecutionContext = createMockExecutionContext();
    await expect(loaderDecoratorFactory(mockToken, mockExecutionContext)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw if no dataloader is found for a function token', async () => {
    const mockToken = TestLoader;
    const mockExecutionContext = createMockExecutionContext([]);
    await expect(loaderDecoratorFactory(mockToken, mockExecutionContext)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw if no dataloader is found for a string token', async () => {
    const mockToken = 'StringToken';
    const mockExecutionContext = createMockExecutionContext([]);
    await expect(loaderDecoratorFactory(mockToken, mockExecutionContext)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw if no dataloader is found for a symbol token', async () => {
    const mockToken = Symbol('SymbolToken');
    const mockExecutionContext = createMockExecutionContext([]);
    await expect(loaderDecoratorFactory(mockToken, mockExecutionContext)).rejects.toThrow(InternalServerErrorException);
  });
});

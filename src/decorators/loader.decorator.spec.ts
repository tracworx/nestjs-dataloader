import { createMock } from '@golevelup/ts-jest';
import { InternalServerErrorException } from '@nestjs/common';
import DataLoader from 'dataloader';
import { gqlExecutionContextMockFactory } from '../../test/utils';
import { Loader, loaderDecoratorFactory } from './loader.decorator';

class TestLoader { }

describe('Loader', () => {
  it('should be defined', () => {
    expect(Loader).toBeDefined();
  });

  it('should return a dataloader instance from the GraphQL context', async () => {
    const mockToken = TestLoader;
    const mockDataloader = createMock<DataLoader<any, any>>();
    const mockExecutionContext = gqlExecutionContextMockFactory([[mockToken, mockDataloader]]);

    const dataloader = await loaderDecoratorFactory(mockToken, mockExecutionContext);
    expect(dataloader).toBe(mockDataloader);
  });

  it('should throw if no dataloader map exists in the GraphQL context', async () => {
    const mockToken = TestLoader;
    const mockExecutionContext = gqlExecutionContextMockFactory();
    await expect(loaderDecoratorFactory(mockToken, mockExecutionContext)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw if no dataloader is found for a function token', async () => {
    const mockToken = TestLoader;
    const mockExecutionContext = gqlExecutionContextMockFactory([]);
    await expect(loaderDecoratorFactory(mockToken, mockExecutionContext)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw if no dataloader is found for a string token', async () => {
    const mockToken = 'StringToken';
    const mockExecutionContext = gqlExecutionContextMockFactory([]);
    await expect(loaderDecoratorFactory(mockToken, mockExecutionContext)).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw if no dataloader is found for a symbol token', async () => {
    const mockToken = Symbol('SymbolToken');
    const mockExecutionContext = gqlExecutionContextMockFactory([]);
    await expect(loaderDecoratorFactory(mockToken, mockExecutionContext)).rejects.toThrow(InternalServerErrorException);
  });
});

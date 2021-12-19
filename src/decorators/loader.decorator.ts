import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { InstanceToken } from '@nestjs/core/injector/module';
import { GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { GQL_CONTEXT_KEY } from '../constants';
import { DataloaderInterceptor } from '../interceptors/dataloader.interceptor';
import { DataloaderMap } from '../services/dataloader-discovery.service';
import { DataloaderProvider } from './dataloader-provider.decorator';

/**
 * Stringifies a NestJS `InstanceToken`.
 */
const tokenToString = (token: InstanceToken): string => {
  if (typeof token === 'string') {
    return token;
  } else if (typeof token === 'symbol') {
    return String(token);
  } else {
    return token.name;
  }
};

/**
 * @see `Loader`
 */
export const loaderDecoratorFactory = async (
  token: InstanceToken,
  context: ExecutionContext,
): Promise<DataLoader<any, any, any>> => {
  // Get the dataloader map from the GraphQL context object
  const gqlContext: any = GqlExecutionContext.create(context).getContext();
  const dataloaders: DataloaderMap | undefined = gqlContext[GQL_CONTEXT_KEY];
  if (!dataloaders) {
    throw new InternalServerErrorException(
      `No dataloaders found in GraphQL context object. Did you forget to provide the ${DataloaderInterceptor.name}?`,
    );
  }

  // Get the dataloader instance from the map
  const dataloader = dataloaders.get(token);
  if (!dataloader) {
    throw new InternalServerErrorException(
      `No dataloader found for ${tokenToString(token)}. Did you forget to decorate it with @${
        DataloaderProvider.name
      }()?`,
    );
  }

  return dataloader;
};

/**
 * Parameter decorator that injects a `DataLoader` instance from the GraphQL context.
 * If the token does not match any available class decorated with `@DataloaderProvider()`,
 * an `InternalServerErrorException` is thrown.
 */
export const Loader = createParamDecorator(loaderDecoratorFactory);

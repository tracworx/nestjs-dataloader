import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { InstanceToken } from '@nestjs/core/injector/module';
import { GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { GQL_CONTEXT_KEY } from 'src/constants';
import { DataloaderInterceptor } from 'src/interceptors/dataloader.interceptor';
import { DataloaderMap } from 'src/services/dataloader-discovery.service';
import { DataloaderProvider } from './dataloader-provider.decorator';

/**
 * Stringifies a NestJS `InstanceToken`.
 */
function tokenToString(token: InstanceToken): string {
  if (typeof token === 'string') {
    return token;
  } else if (typeof token === 'symbol') {
    return String(token);
  } else {
    return token.name;
  }
}

/**
 * Retrieves the dataloader map from the `ExecutionContext`.
 */
function getDataloadersFromContext(context: ExecutionContext): DataloaderMap {
  const gqlContext: any = GqlExecutionContext.create(context).getContext();
  const dataloaders: DataloaderMap | undefined = gqlContext[GQL_CONTEXT_KEY];
  if (!dataloaders) {
    throw new InternalServerErrorException(
      `No dataloaders found in GraphQL context object. Did you forget to provide the ${DataloaderInterceptor.name}?`,
    );
  }
  return dataloaders;
}

/**
 * Parameter decorator that injects a `DataLoader` instance from the GraphQL context.
 * If the token does not match any available class decorated with `@DataloaderProvider()`,
 * an `InternalServerErrorException` is thrown.
 */
export const Loader = createParamDecorator(
  async (token: InstanceToken, context: ExecutionContext): Promise<DataLoader<any, any, any>> => {
    const dataloader = getDataloadersFromContext(context).get(token);
    if (!dataloader) {
      throw new InternalServerErrorException(
        `No dataloader found for ${tokenToString(token)}. Did you forget to decorate it with @${
          DataloaderProvider.name
        }()?`,
      );
    }
    return dataloader;
  },
);

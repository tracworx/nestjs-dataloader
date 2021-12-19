import { GqlExecutionContext } from '@nestjs/graphql';
import DataLoader from 'dataloader';

/**
 * Interface for a dataloader factory provider.
 * All providers decorated with `@DataloaderProvider` must implement this interface.
 */
export interface DataloaderFactory<K = unknown, V = unknown, C = K> {
  /**
   * Factory method that builds a new dataloader instance.
   * @param ctx - the GraphQL execution context
   */
  createDataloader(ctx: GqlExecutionContext): DataLoader<K, V, C>;
}

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { GQL_CONTEXT_KEY } from 'src/constants';
import { DataloaderDiscoveryService } from '../services/dataloader-discovery.service';

/**
 * Interceptor that builds a dataloader map and injects it into the GraphQL context for each request.
 */
@Injectable()
export class DataloaderInterceptor implements NestInterceptor {
  constructor(private readonly dataloaderDiscovery: DataloaderDiscoveryService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const gqlContext: Record<string, unknown> = GqlExecutionContext.create(context).getContext();
    gqlContext[GQL_CONTEXT_KEY] = this.dataloaderDiscovery.createDataloaderMap(GqlExecutionContext.create(context));
    return next.handle();
  }
}

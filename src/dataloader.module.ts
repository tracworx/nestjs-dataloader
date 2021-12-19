import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, DiscoveryModule } from '@nestjs/core';
import { DataloaderInterceptor } from './interceptors/dataloader.interceptor';
import { DataloaderDiscoveryService } from './services/dataloader-discovery.service';

@Module({
  imports: [DiscoveryModule],
  providers: [DataloaderDiscoveryService, { provide: APP_INTERCEPTOR, useClass: DataloaderInterceptor }],
  exports: [DataloaderDiscoveryService],
})
export class DataloaderModule {}

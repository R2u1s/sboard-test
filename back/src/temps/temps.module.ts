import { Module } from '@nestjs/common';
import { TempsService } from './temps.service';
import { TempsGateway } from './temps.gateway';

@Module({
  providers: [TempsGateway, TempsService],
})
export class TempsModule {}

import { Module } from '@nestjs/common';
import { CorreiosService } from './correios.service';
import { HttpModule } from '@nestjs/axios';
import { CorreiosController } from './correios.controller';

@Module({
   imports: [HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })],
  providers: [CorreiosService],
  controllers: [CorreiosController]
})
export class CorreiosModule {}

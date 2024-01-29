import { Module } from '@nestjs/common';
import { AtStrategy } from 'src/strategies';
import { JwtModule } from '@nestjs/jwt';
import { CollaboratorController } from './collaborator.controller';
import { CollaboratorService } from './collaborator.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [CollaboratorController],
  providers: [CollaboratorService, AtStrategy],
})
export class CollaboratorModule {}

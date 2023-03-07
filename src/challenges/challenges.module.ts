import { CategoriesModule } from './../categories/categories.module';
import { ChallengeSchema } from './interfaces/challenge.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ChallengeService } from './challenges.service';
import { ChallengeController } from './challenges.controller';
import { PlayersModule } from './../players/players.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Challenge', schema: ChallengeSchema }]),
    PlayersModule,
    CategoriesModule,
  ],
  controllers: [ChallengeController],
  providers: [ChallengeService],
})
export class ChallengeModule {}

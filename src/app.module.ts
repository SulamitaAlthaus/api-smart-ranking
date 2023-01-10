import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { ConfigModule } from '@nestjs/config';

ConfigModule.forRoot();

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@cluster0.bptbrp4.mongodb.net/smartRanking?retryWrites=true&w=majority`,
    ),
    PlayersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

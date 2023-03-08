import { ChallengeStatus } from './../interfaces/challenge-status.enum';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
  IsDate,
} from 'class-validator';
import { Player } from 'src/players/interfaces/players.interface';

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsDateString()
  datetimeChallenge: Date;

  @IsNotEmpty()
  challenger: Player;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  players: Array<Player>;
}

export class UpdateChallengeDto {
  @IsNotEmpty()
  status: ChallengeStatus;

  @IsDate()
  datetimeAnswer: Date;
}

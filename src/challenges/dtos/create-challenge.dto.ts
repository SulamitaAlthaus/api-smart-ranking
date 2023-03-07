import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  ArrayMinSize,
  ArrayMaxSize,
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

import { IsNotEmpty } from 'class-validator';

import { Result } from '../interfaces/challenge.interface';
import { Player } from 'src/players/interfaces/players.interface';

export class SetMatchChallengeDto {
  @IsNotEmpty()
  def: Player;

  @IsNotEmpty()
  result: Result[];
}

import { ChallengeStatus } from './../interfaces/challenge-status.enum';
import { IsNotEmpty, IsDate } from 'class-validator';

export class UpdateChallengeDto {
  @IsNotEmpty()
  status: ChallengeStatus;

  @IsDate()
  datetimeAnswer: Date;
}

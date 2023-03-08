import { PipeTransform, BadRequestException } from '@nestjs/common';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';

export class StatusChallengeValidationPipe implements PipeTransform {
  readonly statusAllow = [
    ChallengeStatus.ACCEPTED,
    ChallengeStatus.DENIED,
    ChallengeStatus.CANCELED,
  ];
  transform(value: any) {
    const status = value.status.toUpperCase();

    if (!this.statusValidation(status)) {
      throw new BadRequestException(`${status} é um status inválido.`);
    }

    return value;
  }

  private statusValidation(status: any) {
    const index = this.statusAllow.indexOf(status);
    return index !== -1;
  }
}

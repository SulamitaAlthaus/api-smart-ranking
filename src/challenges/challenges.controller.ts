import { ValidationParametersPipe } from './../common/pipes/validation-parameters.pipe';
import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ChallengeService } from './challenges.service';
import {
  CreateChallengeDto,
  UpdateChallengeDto,
} from './dtos/create-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { StatusChallengeValidationPipe } from './pipes/status-challenge-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengeController {
  constructor(private readonly challengesService: ChallengeService) {}

  private readonly logger = new Logger(ChallengeController.name);

  @Post()
  @UsePipes(ValidationPipe)
  async createChallenge(
    @Body() createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    this.logger.log(`createChallenge: ${JSON.stringify(createChallengeDto)}`);
    return await this.challengesService.createChallenge(createChallengeDto);
  }

  @Get()
  async getChallenges(@Query('idPlayer') _id: string): Promise<Challenge[]> {
    return _id
      ? await this.challengesService.getPlayerChallenges(_id)
      : await this.challengesService.getChallenges();
  }

  @Put('/:_id')
  async updateChallenge(
    @Body(StatusChallengeValidationPipe) updateChallengeDto: UpdateChallengeDto,
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<boolean> {
    console.log('HERE');
    return this.challengesService.updateChallenge(_id, updateChallengeDto);
  }
}

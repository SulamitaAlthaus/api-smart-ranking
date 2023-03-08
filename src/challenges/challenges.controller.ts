import { ValidationParametersPipe } from './../common/pipes/validation-parameters.pipe';
import {
  Body,
  Controller,
  Delete,
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
  SetMatchChallengeDto,
  UpdateChallengeDto,
} from './dtos';
import { Challenge, Match } from './interfaces/challenge.interface';
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
    return this.challengesService.updateChallenge(_id, updateChallengeDto);
  }
  @Post('/:_id/match')
  async setMatchChallenge(
    @Param('_id', ValidationParametersPipe) _id: string,
    @Body() setMatchChallengeDto: SetMatchChallengeDto,
  ): Promise<Match> {
    this.logger.log(
      `setMatchChallenge: ${JSON.stringify(setMatchChallengeDto)}`,
    );
    return await this.challengesService.setMatchChallenge(
      _id,
      setMatchChallengeDto,
    );
  }
  @Delete('/:_id')
  async deleteChallenge(
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<boolean> {
    return await this.challengesService.deleteChallenge(_id);
  }
}

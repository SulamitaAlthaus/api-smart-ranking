import { CategoriesService } from './../categories/categories.service';
import { PlayersService } from './../players/players.service';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateChallengeDto } from './dtos/create-challenge.dto';
import { Challenge } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challenge-status.enum';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    private readonly playersService: PlayersService,
    private readonly categoriesService: CategoriesService,
  ) {}

  private readonly logger = new Logger(ChallengeService.name);

  async createChallenge(
    createChallengeDto: CreateChallengeDto,
  ): Promise<Challenge> {
    const players = await this.playersService.getAllPlayers();
    createChallengeDto.players.map((playerDto) => {
      const playerFilter = players.filter(
        (player) => player._id == playerDto._id,
      );

      if (playerFilter.length == 0) {
        throw new BadRequestException(
          `Jogador com id ${playerDto._id} não encontrado.`,
        );
      }
    });

    const challengerInMatch = await createChallengeDto.players.filter(
      (player) => player._id == createChallengeDto.challenger,
    );

    this.logger.log(`challengerInMatch: ${challengerInMatch}`);

    if (challengerInMatch.length == 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida.`,
      );
    }

    const categoryPlayer = await this.categoriesService.getPlayerCategory(
      createChallengeDto.challenger,
    );
    if (!categoryPlayer) {
      throw new BadRequestException(
        'O solicitante precisa estar registrado em uma categoria.',
      );
    }

    const { datetimeChallenge, challenger } = createChallengeDto;

    const challengeFind = await this.challengeModel
      .findOne({ datetimeChallenge, challenger })
      .exec();

    if (challengeFind) {
      throw new BadRequestException(
        'O solicitante já tem um desafio para essa data e horário.',
      );
    }
    const newChallenge = new this.challengeModel(createChallengeDto);
    newChallenge.category = categoryPlayer.category;
    newChallenge.datetimeSolicitation = new Date();
    this.logger.log(
      `newChallenge.datetimeSolicitation = ${newChallenge.datetimeSolicitation}`,
    );

    newChallenge.status = ChallengeStatus.PENDING;
    this.logger.log(`newChallenge = ${JSON.stringify(newChallenge)}`);
    return await newChallenge.save();
  }
}

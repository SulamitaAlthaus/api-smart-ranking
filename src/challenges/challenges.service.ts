import { CategoriesService } from './../categories/categories.service';
import { PlayersService } from './../players/players.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateChallengeDto,
  SetMatchChallengeDto,
  UpdateChallengeDto,
} from './dtos';
import { Challenge, Match } from './interfaces/challenge.interface';
import { ChallengeStatus } from './interfaces/challenge-status.enum';

@Injectable()
export class ChallengeService {
  constructor(
    @InjectModel('Challenge') private readonly challengeModel: Model<Challenge>,
    @InjectModel('Match') private readonly matchModel: Model<Match>,
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

  async getChallenges(): Promise<Challenge[]> {
    return await this.challengeModel
      .find()
      .populate('players')
      .populate('match')
      .exec();
  }

  async getPlayerChallenges(player: any): Promise<Challenge[]> {
    const playerFind = await this.playersService.getPlayer(player);
    if (!playerFind) {
      throw new BadRequestException('Jogador não encontrado');
    }

    return await this.challengeModel
      .find({
        players: {
          $elemMatch: { $eq: { _id: player } },
        },
      })
      .exec();
  }

  async updateChallenge(
    _id: string,
    updateChallengeDto: UpdateChallengeDto,
  ): Promise<boolean> {
    const findChallenge = await this.challengeModel.findOne({ _id }).exec();
    if (!findChallenge) {
      throw new NotFoundException('Desafio não encontrado.');
    }
    if (updateChallengeDto.status) {
      findChallenge.datetimeAnswer = new Date();
    }
    findChallenge.status = updateChallengeDto.status;
    findChallenge.datetimeAnswer = updateChallengeDto.datetimeAnswer;
    const updateChallenge = await this.challengeModel
      .findByIdAndUpdate({ _id }, { $set: updateChallengeDto })
      .exec();
    if (!updateChallenge) {
      return false;
    }

    return true;
  }

  async setMatchChallenge(
    _id: string,
    setMatchChallengeDto: SetMatchChallengeDto,
  ): Promise<Match> {
    const findChallenge = await this.challengeModel
      .findOne({ _id })
      .populate('match')
      .exec();
    if (!findChallenge) {
      throw new NotFoundException('Desafio não encontrado.');
    }
    const playerFilter = findChallenge.players.filter(
      (player) => player._id == setMatchChallengeDto.def,
    );

    this.logger.log(`findChallenge: ${findChallenge}`);
    this.logger.log(`playerFilter: ${playerFilter}`);

    if (playerFilter.length == 0) {
      throw new NotFoundException('Jogador faz parte do desafio.');
    }
    const createMatch = new this.matchModel(setMatchChallengeDto);

    createMatch.category = findChallenge.category;
    createMatch.players = findChallenge.players;
    const result = await createMatch.save();

    findChallenge.status = ChallengeStatus.ACCOMPLISHED;
    findChallenge.match = result._id;
    findChallenge.save();

    try {
      await this.challengeModel
        .findOneAndUpdate({ _id }, { $set: { findChallenge } })
        .exec();
    } catch (error) {
      await this.matchModel.deleteOne({ _id: result._id }).exec();
      throw new InternalServerErrorException();
    }

    return result;
  }

  async deleteChallenge(_id): Promise<boolean> {
    const findChallenge = await this.challengeModel
      .findOne({ _id })
      .populate('match')
      .exec();
    if (!findChallenge) {
      throw new NotFoundException('Desafio não encontrado.');
    }

    findChallenge.status = ChallengeStatus.CANCELED;
    findChallenge.save();

    return true;
  }
}

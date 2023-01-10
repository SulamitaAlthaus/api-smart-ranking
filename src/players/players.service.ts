import { CreatePlayerDto } from './dto/create-player.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Player } from './interfaces/players.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const playerFind = await this.playerModel.findOne({ email }).exec();

    let player;
    if (playerFind) {
      player = await this.update(createPlayerDto);
    } else {
      player = await this.create(createPlayerDto);
    }

    return player;
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayer(email): Promise<Player> {
    const playerFind = await this.playerModel.findOne({ email }).exec();
    if (!playerFind) {
      throw new NotFoundException('Jogador não encontrado.');
    }
    return playerFind;
  }

  async deletePlayer(email): Promise<any> {
    return await this.playerModel.deleteOne({ email }).exec();
  }

  private async create(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const newPlayer = new this.playerModel(createPlayerDto);
    return await newPlayer.save();
  }

  private async update(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const updatePlayer = await this.playerModel
      .findOneAndUpdate(
        { email: createPlayerDto.email },
        { $set: createPlayerDto },
      )
      .exec();

    return updatePlayer;
  }
}

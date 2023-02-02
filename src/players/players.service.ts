import { UpdatePlayerDto } from './dto/update-player.dto';
import { CreatePlayerDto } from './dto/create-player.dto';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Player } from './interfaces/players.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel('Player') private readonly playerModel: Model<Player>,
  ) {}

  private readonly logger = new Logger(PlayersService.name);

  async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const playerFind = await this.playerModel.findOne({ email }).exec();

    if (playerFind) {
      throw new BadRequestException(
        `Jogador com e-mail ${email} já cadastrado.`,
      );
    }
    const newPlayer = new this.playerModel(createPlayerDto);
    return await newPlayer.save();
  }

  async updatePlayer(
    _id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const playerFind = await this.playerModel.findById({ _id }).exec();
    if (!playerFind) {
      throw new NotFoundException('Jogador não encontrado.');
    }
    const updatePlayer = await this.playerModel
      .findByIdAndUpdate({ _id }, { $set: updatePlayerDto })
      .exec();

    return updatePlayer;
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.playerModel.find().exec();
  }

  async getPlayer(_id): Promise<Player> {
    const playerFind = await this.playerModel.findOne({ _id }).exec();
    if (!playerFind) {
      throw new NotFoundException('Jogador não encontrado.');
    }
    return playerFind;
  }

  async deletePlayer(_id): Promise<any> {
    const playerFind = await this.playerModel.findByIdAndDelete({ _id }).exec();
    if (!playerFind) {
      return false;
    }
    return true;
  }
}

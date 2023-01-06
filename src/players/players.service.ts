import { CreatePlayerDto } from './dto/create-player.dto';
import { Injectable, Logger } from '@nestjs/common';
import { Player } from './interfaces/players.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = await this.create(createPlayerDto);
    return player;
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.players;
  }

  private create(createPlayerDto: CreatePlayerDto): Player {
    const { name, phone, email } = createPlayerDto;

    const player: Player = {
      _id: uuidv4(),
      name,
      phone,
      email,
      ranking: 'A',
      position: 1,
      urlPofilePicture: 'https://teste.com/picture.png',
    };
    this.logger.log(`createUpdatePlayer: ${JSON.stringify(player)}`);
    this.players.push(player);
    return player;
  }
}

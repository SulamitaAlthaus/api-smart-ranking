import { CreatePlayerDto } from './dto/create-player.dto';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Player } from './interfaces/players.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private readonly logger = new Logger(PlayersService.name);

  async createUpdatePlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
    const { email } = createPlayerDto;
    const playerFind = this.players.find((player) => player.email === email);

    let player;
    if (playerFind) {
      player = await this.update(playerFind, createPlayerDto);
    } else {
      player = await this.create(createPlayerDto);
    }

    return player;
  }

  async getAllPlayers(): Promise<Player[]> {
    return await this.players;
  }

  async getPlayer(email): Promise<Player> {
    const playerFind = this.players.find((player) => player.email === email);
    if (!playerFind) {
      throw new NotFoundException('Jogador não encontrado.');
    }
    return playerFind;
  }

  async deletePlayer(email): Promise<boolean> {
    const playerFind = this.players.find((player) => player.email === email);
    if (!playerFind) {
      throw new NotFoundException('Jogador não encontrado.');
    }
    this.players = this.players.filter((player) => player != playerFind);

    return true;
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

  private update(playerFind: Player, createPlayerDto: CreatePlayerDto): Player {
    const { name } = createPlayerDto;
    playerFind.name = name;

    return playerFind;
  }
}

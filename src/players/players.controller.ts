import { Player } from './interfaces/players.interface';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('api/jogadores')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const player = await this.playerService.createUpdatePlayer(createPlayerDto);
    return player;
  }

  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return this.playerService.getAllPlayers();
  }
}

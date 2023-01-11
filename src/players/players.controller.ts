import { Player } from './interfaces/players.interface';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('api/jogadores')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const player = await this.playerService.createUpdatePlayer(createPlayerDto);

    return player;
  }

  @Get()
  async getPlayers(@Query('email') email: string): Promise<Player | Player[]> {
    if (email) {
      return this.playerService.getPlayer(email);
    } else {
      return this.playerService.getAllPlayers();
    }
  }
  @Delete()
  async deletePlayer(@Query('email') email: string): Promise<boolean> {
    return this.playerService.deletePlayer(email);
  }
}

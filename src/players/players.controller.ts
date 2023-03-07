import { UpdatePlayerDto } from './dto/update-player.dto';
import { ValidationParametersPipe } from '../common/pipes/validation-parameters.pipe';
import { Player } from './interfaces/players.interface';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('api/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  @UsePipes(ValidationPipe)
  async createPlayer(@Body() createPlayerDto: CreatePlayerDto) {
    return await this.playerService.createPlayer(createPlayerDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async updatePlayer(
    @Body() updatePlayerDto: UpdatePlayerDto,
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<Player> {
    return await this.playerService.updatePlayer(_id, updatePlayerDto);
  }

  @Get()
  async getAllPlayers(): Promise<Player[]> {
    return this.playerService.getAllPlayers();
  }

  @Get('/:_id')
  async getPlayer(
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<Player> {
    return this.playerService.getPlayer(_id);
  }

  @Delete('/:_id')
  async deletePlayer(
    @Param('_id', ValidationParametersPipe) _id: string,
  ): Promise<boolean> {
    return this.playerService.deletePlayer(_id);
  }
}

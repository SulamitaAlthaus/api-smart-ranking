import { CreatePlayerDto } from './dto/create-player.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('api/jogadores')
export class PlayersController {
  @Post()
  async createUpdatePlayer(@Body() createPlayerDto: CreatePlayerDto) {
    const { email } = createPlayerDto;
    return JSON.stringify({ email });
  }
}

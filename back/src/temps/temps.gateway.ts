import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { TempsService } from './temps.service';
import { CreateTempDto } from './dto/create-temp.dto';
import { UpdateTempDto } from './dto/update-temp.dto';

@WebSocketGateway()
export class TempsGateway {
  constructor(private readonly tempsService: TempsService) {}

  @SubscribeMessage('createTemp')
  create(@MessageBody() createTempDto: CreateTempDto) {
    return this.tempsService.create(createTempDto);
  }

  @SubscribeMessage('findAllTemps')
  findAll() {
    return this.tempsService.findAll();
  }

  @SubscribeMessage('findOneTemp')
  findOne(@MessageBody() id: number) {
    return this.tempsService.findOne(id);
  }

  @SubscribeMessage('updateTemp')
  update(@MessageBody() updateTempDto: UpdateTempDto) {
    return this.tempsService.update(updateTempDto.id, updateTempDto);
  }

  @SubscribeMessage('removeTemp')
  remove(@MessageBody() id: number) {
    return this.tempsService.remove(id);
  }
}

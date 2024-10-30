import { Injectable } from '@nestjs/common';
import { CreateTempDto } from './dto/create-temp.dto';
import { UpdateTempDto } from './dto/update-temp.dto';

@Injectable()
export class TempsService {
  create(createTempDto: CreateTempDto) {
    return 'This action adds a new temp';
  }

  findAll() {
    return `This action returns all temps`;
  }

  findOne(id: number) {
    return `This action returns a #${id} temp`;
  }

  update(id: number, updateTempDto: UpdateTempDto) {
    return `This action updates a #${id} temp`;
  }

  remove(id: number) {
    return `This action removes a #${id} temp`;
  }
}

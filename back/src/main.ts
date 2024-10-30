import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{ cors: true });
  app.setGlobalPrefix('api');
  const port = process.env.PORT;
  await app.listen(port, () => console.log(`Server started on the port ${port}`));
}
bootstrap();

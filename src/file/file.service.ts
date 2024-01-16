import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

export enum FileTypes {
  AUDIO = 'audio',
  IMAGE = 'image',
}

@Injectable()
export class FileService {
  createFile(type: FileTypes, file: Express.Multer.File): string {
    try {
      // расширение файла
      const fileExtension = file.originalname.split('.').pop();
      // uuid.v4() - случайная строка
      const fileName = uuid.v4() + '.' + fileExtension;
      // путь "из текущей директории" выйти на уровень выше,
      // войти в папку "static", а далее в папку, согласно типу файла 
      const filePath = path.resolve(__dirname, '..', 'static', type);
      // если папка по указанному пути не найдена,
      // то она будет создана, включая родительские
      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }
      // сохранить файл по указанному пути
      fs.writeFileSync(path.resolve(filePath, fileName), file.buffer);
      return type + '/' + fileName;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  removeFile(fileName: string) {}
}

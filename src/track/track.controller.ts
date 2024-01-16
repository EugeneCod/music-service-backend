import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { ObjectId } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express/multer';

@Controller('/tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'picture', maxCount: 1 },
      { name: 'audio', maxCount: 1 },
    ]),
  )

  create(
    @UploadedFiles()
    files: { picture?: Express.Multer.File[]; audio?: Express.Multer.File[] },
    @Body() dto: CreateTrackDto,
  ) {
    const { picture, audio } = files;
    return this.trackService.create(dto, picture[0], audio[0]);
  }

  @Get()
  getAll() {
    return this.trackService.getAll();
  }

  @Get(':id')
  getOne(@Param() params: { id: ObjectId }) {
    return this.trackService.getOne(params.id);
  }

  @Delete(':id')
  delete(@Param() params: { id: ObjectId }) {
    return this.trackService.delete(params.id);
  }

  @Post('/comments')
  addComment(@Body() dto: CreateCommentDto) {
    return this.trackService.addComment(dto);
  }

  @Post('/listen/:id')
  incListeningCounter(@Param() params: { id: ObjectId }) {
    return this.trackService.incListeningCounter(params.id);
  }
}

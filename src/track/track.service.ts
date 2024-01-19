import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Track, TrackDocument } from './schemas/track.schema';
import { Model, ModifyResult, ObjectId } from 'mongoose';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileService, FileTypes } from 'src/file/file.service';

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private fileService: FileService,
  ) {}

  async create(
    dto: CreateTrackDto,
    pictureFile: Express.Multer.File,
    audioFile: Express.Multer.File,
  ): Promise<Track> {
    const audioPath = this.fileService.createFile(FileTypes.AUDIO, audioFile);
    const picturePath = this.fileService.createFile(
      FileTypes.IMAGE,
      pictureFile,
    );
    const track = await this.trackModel.create({
      ...dto,
      listens: 0,
      audio: audioPath,
      picture: picturePath,
    });
    return track;
  }

  async getAll(count: number = 10, offset: number = 0): Promise<Track[]> {
    // При offset = 0 в выборку попадут элементы, начиная с первого
    // limit ограничивает количество элементов в выдаче
    const tracks = await this.trackModel.find().skip(offset).limit(count);
    return tracks;
  }

  async search(query: string): Promise<Track[]> {
    const  tracks = await this.trackModel.find({
      // Поиск по регулярному выражению без учета регистра
      name: {$regex: new RegExp(query, 'i')}
    })
    return tracks;
  }

  async getOne(id: ObjectId): Promise<Track> {
    const track = (await this.trackModel.findById(id)).populate('comments');
    return track;
  }

  async delete(id: ObjectId): Promise<ModifyResult<Track>> {
    const track = await this.trackModel.findByIdAndDelete(id);
    return track;
  }

  async addComment(dto: CreateCommentDto): Promise<Comment> {
    const track = await this.trackModel.findById(dto.trackId);
    const comment = await this.commentModel.create({ ...dto });
    track.comments.push(comment);
    await track.save();
    return comment;
  }

  async incListeningCounter(id: ObjectId) {
    const track = await this.trackModel.findById(id);
    track.listens++;
    track.save();
  }
}

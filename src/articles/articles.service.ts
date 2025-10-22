import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Injectable()
export class ArticlesService {
  constructor(@InjectModel(Article.name) private articleModel: Model<Article>) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = new this.articleModel(createArticleDto);
    return article.save();
  }

  async findAll(query: any) {
    let filter: any = {};

    if (query.search) {
      filter.$or = [
        { titre: { $regex: query.search, $options: 'i' } },
        { resume: { $regex: query.search, $options: 'i' } },
        { contenu: { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.statut) {
      filter.statut = query.statut;
    }

    if (query.dateDebut || query.dateFin) {
      filter.datePublication = {};
      if (query.dateDebut) {
        filter.datePublication.$gte = new Date(query.dateDebut);
      }
      if (query.dateFin) {
        filter.datePublication.$lte = new Date(query.dateFin);
      }
    }

    return this.articleModel.find(filter).sort({ datePublication: -1 }).exec();
  }

  async findOne(id: string) {
    return this.articleModel.findById(id).exec();
  }

  async update(id: string, updateArticleDto: UpdateArticleDto) {
    return this.articleModel.findByIdAndUpdate(id, updateArticleDto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.articleModel.findByIdAndDelete(id).exec();
  }
}

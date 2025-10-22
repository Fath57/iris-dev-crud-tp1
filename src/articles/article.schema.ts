import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ArticleDocument = HydratedDocument<Article>;

@Schema({ timestamps: true })
export class Article {
  @Prop({ required: true })
  titre: string;

  @Prop({ required: true })
  resume: string;

  @Prop({ required: true })
  contenu: string;

  @Prop()
  extract: string;

  @Prop({ type: Date, required: true })
  datePublication: Date;

  @Prop({ enum: ['brouillon', 'publie', 'archive'], default: 'brouillon' })
  statut: string;

  @Prop({ type: Date, default: Date.now })
  dateCreation: Date;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

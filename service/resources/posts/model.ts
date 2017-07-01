import { Schema, Document, Model, model } from 'mongoose';

export interface IPost {
    title?: string;
    body?: string;
    bodyRaw?: string;
    slug?: string;
    postedAtUtc?: Date;
    postedBy?: string;
}

export const PostSchema: Schema = new Schema({
    title: String,
    body: String,
    bodyRaw: String,
    slug: String,
    postedAtUtc: Date,
    postedBy: String
});
PostSchema.pre('save', function(next) {
    if(!this.postedAtUtc) {
        this.postedAtUtc = new Date().getUTCDate();
    }

    next();
});

export interface IPostModel extends IPost, Document {
}

export const Post: Model<IPostModel> = model<IPostModel>('Post', PostSchema);

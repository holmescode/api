import { IPostModel, IPost, Post } from './model';

export class PostsRepository {
    list(page: number, pageSize: number): Promise<IPostModel[]> {
        return Post
            .find()
            .skip(page * pageSize)
            .limit(pageSize)
            .exec();
    }

    singleBySlug(slug: string): Promise<IPostModel> {
        return Post
            .findOne({ slug })
            .exec();
    }

    create(data: IPost): Promise<IPostModel> {
        return Post
            .create(data);
    }

    updateBySlug(slug: string, data: IPost): Promise<IPostModel> {
        return Post
            .findOneAndUpdate({ slug }, data)
            .exec();
    }
}

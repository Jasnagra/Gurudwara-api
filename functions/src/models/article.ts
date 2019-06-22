import { ArticleType } from '../enums/article-types';

export function isArticleValid(obj: Article): boolean {
    if (Object.keys(obj).length !== 9) return false;
    if (!obj.shortTitle || typeof obj.shortTitle !== 'string') return false;
    if (!obj.longTitle || typeof obj.longTitle !== 'string') return false;
    if (!obj.shortDesc || typeof obj.shortDesc !== 'string') return false;
    if (!obj.longDesc || typeof obj.longDesc !== 'string') return false;
    if (!obj.itemType) return false;
    if (!obj.datePosted) return false;
    if (!obj.datePublished) return false;
    return true;
}

export interface Article {
    shortTitle: string;
    longTitle: string;
    shortDesc: string;
    longDesc: string;
    itemType: ArticleType;
    datePublished: Date;
    datePosted: Date;
    thumbnail?: any;
    mainImage?: any;
}
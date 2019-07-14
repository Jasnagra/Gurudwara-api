import {Request, Response} from 'express';
import * as admin from 'firebase-admin';
import { ArticleType } from '../../enums/article-types';
import { Article, isArticleValid } from '../../models/article';
import { ErrorType } from '../../enums/error-types';

export class ArticleService {
    db: any;

    constructor() { 
        if (!admin.apps.length) {
            admin.initializeApp({});
        }
        this.db = admin.firestore();
    }

    getArticles(req: Request, res: Response, articleType: ArticleType): void {
        res.set('Access-Control-Allow-Origin', '*');
        const gid = req.params.gid;
        const articlesRef = this.db.collection(`gurudwaras/${gid}/articles`).where('itemType', '==', articleType);
        articlesRef.get().then((querySnapshot: any) => {
          if (querySnapshot.empty) {
            res.status(200).json([]) 
          } else {
            const docs = querySnapshot.docs.map((doc: any) => { 
              const tempDoc = this.mapDocument(doc);
              return { id: doc.id, data: tempDoc };
            });
            res.status(200).json(docs);
          }
        }).catch((err: any) => {
            return res.status(500).send({ "code": '5002', "message": ErrorType.ERR5002 });
        });
    }

    getArticleById(req: Request, res: Response, articleType: ArticleType): void {
        res.set('Access-Control-Allow-Origin', '*');
        const gid = req.params.gid;
        const aid = req.params.aid;
        const articlesRef = this.db.collection(`gurudwaras/${gid}/articles`).doc(`${aid}`);
          articlesRef.get().then((doc: any) => {
            if (!doc.exists) {
              res.status(200).json({ data: null })
            } else {
              const tempDoc = this.mapDocument(doc);
              res.status(200).json({ data: tempDoc });
            }
        }).catch((err: any) => res.status(500).send({ "code": "5002", "message": ErrorType.ERR5002 }));
    }

    addArticle(req: Request, res: Response, articleType: ArticleType): void {
        const bodyJson: Article = req.body;
        const gid = req.params.gid;
        if (isArticleValid(bodyJson) && bodyJson.itemType === articleType) {
            this.db.collection(`gurudwaras/${gid}/articles`).add(bodyJson).then(() => {
            res.status(200).json(`Article ${bodyJson.shortTitle} has been added`);
            }).catch((err: any) => res.status(500).send({ "code": "5001", "message": "item could not be added" }));  
        } else {
            res.status(500).send({ "code": "5001", "message": ErrorType.ERR5001 });
        }
    }

    private mapDocument(doc: any): any {
      const dp = this.convertFSTimeStamp(doc.data().datePosted);
      const st = this.convertFSTimeStamp(doc.data().startTime);
      const et = this.convertFSTimeStamp(doc.data().endTime);
      return {...doc.data(), 'startTime': st, 'endTime': et, 'datePosted': dp };
    }

    private convertFSTimeStamp(timeSt: admin.firestore.Timestamp): any {
      if (timeSt) {
        const ts = new admin.firestore.Timestamp(timeSt.seconds, timeSt.nanoseconds);
        return ts.toMillis();  
      }
      return 0;
    }
}
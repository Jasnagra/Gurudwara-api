import * as express from "express";
import * as admin from 'firebase-admin';
import { Article, isArticleValid } from '../../models/article';
import { ArticleType } from "../../enums/article-types";

export const eventRouter = express.Router();
if (!admin.apps.length) {
  admin.initializeApp({});
}
const db = admin.firestore();

eventRouter.get("/:gid", async function getEvents(req: express.Request, res: express.Response) {
    const gid = req.params.gid;
    const articlesRef = db.collection(`gurudwaras/${gid}/articles`).where('itemType', '==', ArticleType.event);
    articlesRef.get().then((querySnapshot) => {
      if (querySnapshot.empty) {
        res.status(200).json({ result: null }) 
      } else {
        const docs = querySnapshot.docs.map(doc => { return { id: doc.id, data: doc.data() } });
        res.status(200).json({ result: docs })  
      }
    }).catch(err => res.status(500).send({ "code": "5002", "message": "could not fetch data" }));
});

eventRouter.get("/:gid/:aid", async function getEventsId(req: express.Request, res: express.Response) {
  const gid = req.params.gid;
  const aid = req.params.aid;
  const articlesRef = db.collection(`gurudwaras/${gid}/articles`).doc(`${aid}`);
    articlesRef.get().then((doc) => {
      if (!doc.exists) {
        res.status(200).json({ data: null })
      } else {
        res.status(200).json({ data: doc })
      }
    }).catch(err => res.status(500).send({ "code": "5002", "message": "could not fetch data" }));
});

eventRouter.post("/:gid", async function setEvent(req: express.Request, res: express.Response) {
  const bodyJson: Article = req.body;
  const gid = req.params.gid;
  if (isArticleValid(bodyJson) && bodyJson.itemType === ArticleType.event) {
    db.collection(`gurudwaras/${gid}/articles`).add(bodyJson).then(() => {
      res.status(200).json(`Article ${bodyJson.shortTitle} has been added`);
    }).catch(err => res.status(500).send({ "code": "5001", "message": "item could not be added" }));  
  } else {
    res.status(500).send({ "code": "5001", "message": "format of event was invalid" });
  }
});

// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
eventRouter.get("*", async (req: express.Request, res: express.Response) => {
	res.status(404).send("This route does not exist.");
});
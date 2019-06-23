import * as express from "express";
import { ArticleType } from "../../enums/article-types";
import { ArticleService } from "../shared/articles.service";

export const eventRouter = express.Router();
const articleService = new ArticleService();

eventRouter.get("/:gid", async function getEvents(req, res) {
  articleService.getArticles(req, res, ArticleType.event);
});

eventRouter.get("/:gid/:aid", async function getEventsById(req: express.Request, res: express.Response) {
  articleService.getArticleById(req, res, ArticleType.event);
});

eventRouter.post("/:gid", async function setEvent(req: express.Request, res: express.Response) {
  articleService.addArticle(req, res, ArticleType.event);
});

// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
eventRouter.get("*", async (req: express.Request, res: express.Response) => {
	res.status(404).send("This route does not exist.");
});
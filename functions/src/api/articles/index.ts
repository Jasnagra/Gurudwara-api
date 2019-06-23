import * as express from "express";
import { ArticleType } from "../../enums/article-types";
import { ArticleService } from "../shared/articles.service";

export let articleRouter = express.Router();
const articleService = new ArticleService();

articleRouter.get("/:gid", async function getArticles(req: express.Request, res: express.Response) {
  articleService.getArticles(req, res, ArticleType.article);
});

articleRouter.get("/:gid/:aid", async function getArticleById(req: express.Request, res: express.Response) {
  articleService.getArticleById(req, res, ArticleType.article);
});

articleRouter.post("/:gid", async function setArticles(req: express.Request, res: express.Response) {
  articleService.addArticle(req, res, ArticleType.article);
});

// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
articleRouter.get("*", async (req: express.Request, res: express.Response) => {
	res.status(404).send("This route does not exist.");
});
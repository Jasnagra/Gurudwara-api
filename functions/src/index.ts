import * as express from "express";
import * as functions from 'firebase-functions';
import * as articlesApi from "./api/articles";
import * as eventsAPi from "./api/events";
import * as bodyParser from "body-parser";

const app = express();
app.disable("x-powered-by");
app.use(bodyParser.json()); // support json encoded bodies

app.use("/articles", articlesApi.articleRouter);
app.use("/events", eventsAPi.eventRouter);

export const api = functions.https.onRequest(app);


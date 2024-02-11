"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const UserAuth_1 = require("./Routes/UserAuth");
const connectToDb_1 = __importDefault(require("./Database/connectToDb"));
const config_1 = require("./Config/config");
const cors_1 = __importDefault(require("cors"));
const EventRoutes_1 = require("./Routes/EventRoutes");
const AnnouncementRoutes_1 = require("./Routes/AnnouncementRoutes");
const isLoggedIn_1 = require("./middlewares/isLoggedIn");
const ClubRouter_1 = require("./Routes/ClubRouter");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/v1/auth', UserAuth_1.authRouter);
app.use(isLoggedIn_1.isLoggedIn);
app.use('/api/v1/event', EventRoutes_1.eventRouter);
app.use('/api/v1/announcement', AnnouncementRoutes_1.announcementRouter);
app.use('/api/v1/club', ClubRouter_1.ClubRouter);
app.use((error, req, res, next) => {
    if (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectToDb_1.default)();
        app.listen(config_1.App.port, () => {
            console.log(`Server listening on ${config_1.App.port}`);
        });
    }
    catch (error) {
        console.log('something went wrong ', error);
    }
});
startServer();

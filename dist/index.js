"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const schedule_1 = require("./routes/schedule");
const server = (0, express_1.default)();
server.use(express_1.default.json());
server.use((0, cors_1.default)({ origin: '*' }));
server.use('notifications', schedule_1.sheduleRoute);
server.listen(7777, () => {
    console.log(`Server is started at: ${7777}`);
});

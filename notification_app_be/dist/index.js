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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = Log;
const LOG_API_URL = "http://4.224.186.213/evaluation-service/logs";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkljoiaHR0cDovL2xvY2FsSG9zdC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJzeTA2MDkzNjBAZ21haWwuY29tIiwiZXhwIjoxNzgwNDc0NzYxLCJpYXQiOjE3ODA0NzExNjEsImlzcyI6Imh0dHA6Ly80LjIyNC4xODYuMjEzIiwianRpIjoiZTc0YTVmMzEtNDk0Zi05YVmLTNjYTBkTZkNjY2ZClsImxvY2FsSG9zdCI6IkpXVCIsIm5hbWUiOiJzaHViaGFtIHlhZGF2Iiwicm9sbE5vIjoiMjMzMDI4NiIsInN1YiI6IjM5NTU3Nzg2LTFiNjYtNGE5Ny1hYjIzLWM1NzlmMTI2YTM5NyJ9fQ.BJsjY_fEPO-K5ftL3F8OWBd4GB1GdohfBC1_WWNw2A4";
function Log(stack, level, pkg, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(LOG_API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${ACCESS_TOKEN}`,
                },
                body: JSON.stringify({
                    stack,
                    level,
                    package: pkg,
                    message,
                }),
            });
            if (!response.ok) {
                console.error(`[Logger] Failed to send log: ${response.status} ${response.statusText}`);
            }
        }
        catch (err) {
            console.error("[Logger] Error sending log:", err);
        }
    });
}

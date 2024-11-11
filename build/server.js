"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./src/app");
const port = process.env.PORT || 3000;
console.log();
app_1.app.listen(port, () => {
    console.log("Application running on port ", port);
});

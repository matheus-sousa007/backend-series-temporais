"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const timeseries_controller_1 = require("../controllers/timeseries.controller");
const router = (0, express_1.Router)();
router.get('/time-series/:id', timeseries_controller_1.getTimeSeriesById);
exports.default = router;

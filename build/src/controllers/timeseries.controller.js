"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeSeriesById = void 0;
// import * as ss from 'simple-statistics';
const database_1 = require("../config/database");
// import { LinearRegressionResult } from '../../types';
const add_dummy_variables = (time_series_data) => {
    const new_cols = ['janeiro', 'fevereiro', 'marco', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    for (const row in time_series_data) {
        for (const [index, month] of new_cols.entries()) {
            time_series_data[row][month] = time_series_data[row]['month'] == index + 1;
        }
    }
    return time_series_data;
};
// TODO: Add new response messages in another file called utils.controller
const getTimeSeriesById = async (req, res) => {
    const searchParams = new URLSearchParams(req.params);
    const codename = searchParams.get('id');
    console.log(`codename: ${codename.toLowerCase()}`);
    try {
        const start = new Date().getMilliseconds();
        let { rows } = await database_1.db.query(`SELECT * FROM ${'a' + codename.toLowerCase() + '_'}`);
        const end = new Date().getMilliseconds();
        console.log(`Time elapsed during query: ${end - start} ms`);
        console.log('Adding dummy variables');
        rows = add_dummy_variables(rows);
        res.status(200).send({
            "message": `Time Series ${codename} got successfully!`,
            "time_series": rows
        });
    }
    catch (err) {
        res.status(500).send({
            "message": `Error while getting time series ${codename}`,
            "error": err
        });
    }
};
exports.getTimeSeriesById = getTimeSeriesById;
/**
const fitLinearRegression = (X: number[], y: number[]): LinearRegressionResult => {
  // Calculando a regressão linear
  const regressionLine = ss.linearRegressionLine(ss.linearRegression(X.map((x, index) => [x, y[index]])));
  const slope = ss.linearRegression(X.map((x, index) => [x, y[index]])).m;
  const intercept = regressionLine(0); // Intercepto é o valor da linha em X = 0

  // Coeficiente de correlação
  const rValue = ss.sampleCorrelation(X, y);

  // Erro padrão da estimativa
  const stdErr = ss.standardDeviation(
    y.map((value, index) => value - regressionLine(X[index]))
  );

  // Calculando p-value para a hipótese nula de que o slope = 0
  const n = X.length;
  const tStat = rValue * Math.sqrt((n - 2) / (1 - rValue ** 2));
  const pValue = 2 * (1 - ss.tDistributionCumulativeProbability(tStat, n - 2));

  return {
    slope,
    intercept,
    rValue,
    pValue,
    stdErr
  };
}

const toOrdinal = (date: Date): number => {
    const referenceDate = new Date(1, 0, 1); // 1st Jan, Year 1
    const daysSinceReference = Math.floor((date.getTime() - referenceDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceReference;
}

export const getFitLinearRegression = async (req: express.Request, res: express.Response) => {
    try{
        const time_series: Array<object> = await getTimeSeriesById(req, res);
        const X: Array<number> = [];
        const y: Array<number> = [];
        for(const line of time_series){
            X.push(toOrdinal(new Date(line['valdata'])))
            y.push(line['valvalor']);
        }
        const properties = fitLinearRegression(X, y)

        console.log(`properties: ${JSON.stringify(properties)}`)
    }catch(err){
        console.error(`Erro ao tentar obter a Regressão Linear: $`)
    }
}
*/ 

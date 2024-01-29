import express from 'express';
import { Request, Response } from 'express';
import {getAllStatesSortedByRevenue, getPlantDetails, filterStateData, getAllPlantsSortedByRevenue, processExcel} from './controllers/index'

import swaggerUi from 'swagger-ui-express';
import * as bodyParser from "body-parser";
import  swaggerOutput  from "../src/swagger_output.json";


const app = express();

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

app.listen(8080, () => {
    console.log('Server started at port 8080');
});

app.post('/data', (req: Request, res: Response) =>{
  const body = req.body;
  if (! body['file_path']) {
    res.status(400);
    res.send("File Path is mandatory");
  }
  const data = processExcel(String(body['file_path']));
  res.send(data);
});


app.get('/states', (req: Request, res: Response) => {
    const number_states = req.query['number_states'];
    getAllStatesSortedByRevenue(Number(number_states)).then(incoming_data=>{
        res.send(incoming_data)
    });
  });

  app.get('/plant/details', (req: Request, res: Response) => {
    const plant_name = req.query['plant_name'];
    getPlantDetails(String(plant_name)).then(incoming_data=>{
        res.send(incoming_data)
    });
  });

  app.get('/states/details', (req: Request, res: Response) => {
    const state_abr = req.query['state_abr'];
    filterStateData(String(state_abr)).then(incoming_data=>{
        res.send(incoming_data)
    });
  });

  app.get('/plants', (req: Request, res: Response) => {
    const number_of_plants = req.query['number_plants'];
    getAllPlantsSortedByRevenue(Number(number_of_plants)).then(incoming_data=>{
        res.send(incoming_data)
    });
  });

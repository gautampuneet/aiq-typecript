import * as XLSX from 'xlsx';
import { StateModel, PlantsModel } from '../models/aiq';


async function processExcelFile(filePath: string): Promise<{ [key: string]: any[] }> {
    try {
        const workbook = XLSX.readFile(filePath);
        const allData: { [key: string]: any[] } = {};

        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet) as { [key: string]: any }[];
            let data: any[] = [];

            if (sheetName == "ST21") {
              jsonData.forEach((item: { [key: string]: any }) => {
                  data.push({
                      'state_abr': item['State abbreviation'],
                      'state_annual_net_generation': item['State annual net generation (MWh)'],
                  });
              });
          } else if (sheetName == "PLNT21") {
              jsonData.forEach((item: { [key: string]: any }) => {
                  if (!item['Plant annual net generation (MWh)']) {
                      item['Plant annual net generation (MWh)'] = 0;
                  }
                  data.push({
                      'state_abr': item['Plant state abbreviation'],
                      'plant_name': item['Plant name'],
                      'plant_net_revenue_generation': item['Plant annual net generation (MWh)'],
                  });
              });
          }          

            allData[sheetName] = data;
        });

        return allData; // Return parsed data for further use
    } catch (error) {
        console.error('Error processing Excel file:', error);
        throw error; // Re-throw the error for handling elsewhere
    }
}

// Example usage:
export function processExcel(filePath: string){processExcelFile(filePath)
    .then(data => {

        // Do something with the extracted data
        const stateData = data['ST21'];
        const plantData = data['PLNT21'];


        const stateModels = stateData.map(state => {
          const stateNetGeneration = state['state_annual_net_generation'];
      
          // Check if stateNetGeneration is a valid number
          if (typeof stateNetGeneration === 'number' && !isNaN(stateNetGeneration)) {
              return {
                  state_abr: state['state_abr'],
                  state_net_revenue_generation: stateNetGeneration,
              };
          } else {
              // Skip this entry if state_annual_net_generation is not a valid number
              return {
                "message": "Data saved Failed"
            };
          }
      }).filter(Boolean); // Remove null entries from the array
      
      const plantModels = plantData.map(plant => {
          const plantNetGeneration = plant['plant_net_revenue_generation'];
      
          // Check if plantNetGeneration is a valid number
          if (typeof plantNetGeneration === 'number' && !isNaN(plantNetGeneration)) {
              return {
                  state_abr: plant['state_abr'],
                  plant_net_revenue_generation: plantNetGeneration,
                  plant_name: plant['plant_name'],
              };
          } else {
              // Skip this entry if plant_annual_net_generation is not a valid number
              return {
                "message": "Data saved Failed"
            };
          }
      }).filter(Boolean); // Remove null entries from the array
        // Now you can use stateModels and plantModels as arrays of the corresponding models
        // For example, you can insert them into the database using Mongoose as shown in a previous response
        StateModel.insertMany(stateModels);
        PlantsModel.insertMany(plantModels);

        return {
            "message": "Sucessfully saved Data"
        };
    })
    .catch(error => {
      console.error('Error processing Excel file:', error);
      console.error('Error stack:', error.stack);
    });
}


export async function getAllStatesSortedByRevenue(numberOfStates=10): Promise<StateModel[]> {
  try {
      const states = await StateModel.find().sort({ state_net_revenue_generation: -1 }).limit(numberOfStates).exec();
      return states;
  } catch (error) {
      console.error('Error retrieving states:', error);
      throw error;
  }
}
export async function getAllPlantsSortedByRevenue(numberOfPlants=10): Promise<PlantsModel[]> {
  try {
      const plants = await PlantsModel.find().sort({ state_net_revenue_generation: -1 }).limit(numberOfPlants).exec();
      return plants;
  } catch (error) {
      console.error('Error retrieving plants:', error);
      throw error;
  }
}

export async function getPlantDetails(plant_name:String): Promise<Object>{
    try {
        const plant = await PlantsModel.find({"plant_name": plant_name}).exec();
        const states_abr = plant[0]["state_abr"]

        const state_data = await StateModel.find({"state_abr": states_abr}).exec();
        const state_net_annual_generation = state_data[0]['state_net_revenue_generation']
            
        return {
            "plant_name": plant_name,
            "plant_net_revenue_generation": plant[0]['plant_net_revenue_generation'],
            "percentage_in_state": (plant[0]['plant_net_revenue_generation'] / state_net_annual_generation) * 100
        };
    } catch (error) {
        console.error('Error retrieving plants:', error);
        throw error;
    }
  }


export async function filterStateData(state_name: String): Promise<Object> {

    try {
        const stateData = await StateModel.find({"state_abr": state_name}).exec();
        const plantsData = await PlantsModel.find({"state_abr": state_name}).exec();
        let plantsResponseData: any[]  = [];
        plantsData.forEach((item: { [key: string]: any }) => {
            plantsResponseData.push({
                'state_abr': item['Plant state abbreviation'],
                'plant_name': item['Plant name'],
                'plant_net_revenue_generation': item['Plant annual net generation (MWh)'],
            });
        });
        return {
            "state_abr": stateData[0]['state_abr'],
            "state_annual_net_generation": stateData[0]['state_net_revenue_generation'],
            "plants_data": plantsResponseData
        };
    }catch (error) {
        console.error('Error Filtering States Data:', error);
        throw error;
    }
}
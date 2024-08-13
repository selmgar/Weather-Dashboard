import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// City class definition
class City {
  constructor(public id: string, public name: string) {}
}

// HistoryService class definition
class HistoryService {
  private filePath: string;

  constructor() {
    this.filePath = path.resolve(process.cwd(), 'src', 'service', 'searchHistory.json');
  }

  // Read method to read from the searchHistory.json file
  async read() {
      try {
          const data = await fs.readFile(this.filePath, 'utf-8');
          return JSON.parse(data);
      } catch (error) {
          throw error;
      }
  }

  // Write method to write the updated cities array to the searchHistory.json file
  async write(cities: City[]) {
      const data = JSON.stringify(cities, null, 2);
      await fs.writeFile(this.filePath, data, 'utf-8');
  }

  // GetCities method to read the cities from the searchHistory.json file and return them as an array of City objects
  async getCities() {
      return this.read();
  }

  // AddCity method to add a city to the searchHistory.json file
  async addCity(cityName: string) {
      const cities: City[] = await this.read();
      if (cities.find((city) => city.name === cityName)) {
        return;
      }
      const id = uuidv4();
      const city = new City(id, cityName);
      cities.push(city);
      await this.write(cities);
  }


  async removeCity(id: string) {
    const cities: City[] = await this.read(); 
    const updatedCities = cities.filter((city) => city.id !== id); 
    if (updatedCities.length === cities.length) {
      // City not found
      return;
    }
    await this.write(updatedCities); 
  }
}

export default new HistoryService();

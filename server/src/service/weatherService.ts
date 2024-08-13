import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}

interface Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;
}

class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiKey: string = process.env.API_KEY as string;
  private cityName: string;

  constructor(cityName: string) {
    this.cityName = cityName;
  }

  private async fetchLocationData(query: string): Promise<any> {
    const response = await fetch(query);
    return response.json();
  }

  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData.city.coord;
    return { lat, lon };
  }

  private buildGeocodeQuery(): string {
    return `https://api.openweathermap.org/data/2.5/forecast?q=${this.cityName}&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  private parseCurrentWeather(response: any): Weather[] {
    const city = response.city.name;

    return response.list.map((day: any) => {
      const windSpeed = day.wind.speed;
      const humidity = day.main.humidity;
      const tempF = day.main.temp;
      const iconDescription = day.weather[0].description;
      const icon = day.weather[0].icon;
      const date = day.dt_txt;
  
      return {
        city,
        date,
        windSpeed,
        humidity,
        tempF,
        iconDescription,
        icon,
      };
    })

  }

  public async getWeatherForCity(): Promise<Weather[]> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    const coordinates = this.destructureLocationData(locationData);
    const weatherQuery = this.buildWeatherQuery(coordinates);
    const weatherData = await this.fetchLocationData(weatherQuery);
    const currentWeather = this.parseCurrentWeather(weatherData);
    return currentWeather;
  }
}

export default WeatherService;

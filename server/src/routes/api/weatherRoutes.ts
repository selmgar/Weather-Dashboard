import { Router } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  const { cityName } = req.body;

  // Ensure cityName is provided
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Create an instance of WeatherService with the provided city name
    const weatherService = new WeatherService(cityName);
    const weatherData = await weatherService.getWeatherForCity();

    // Save the city to search history
    await HistoryService.addCity(cityName);

    // Send weather data as response
    return res.json(weatherData);
  } catch (error) {
    console.error('Error retrieving weather data:', error);
    // Send error response
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET search history
router.get('/history', async (_, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    res.status(400).json({ error: 'ID is required' });
    return; // Ensure the function exits here
  }

  try {
    await HistoryService.removeCity(id);
    res.status(204).send(); // No content
  } catch (error) {
    console.error('Error removing city from history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

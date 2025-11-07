import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Index() {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cityWeatherList, setCityWeatherList] = useState<any[]>([]);
  const [weather, setWeather] = useState<any>(null);

  const additionalCities = [
    { name: "New York", latitude: 40.7128, longitude: -74.0060 },
    { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
    { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
    { name: "Houston", latitude: 29.7604, longitude: -95.3698 },
    { name: "Miami", latitude: 25.7617, longitude: -80.1918 },
    { name: "Philadelphia", latitude: 39.9526, longitude: -75.1652 },
    { name: "Phoenix", latitude: 33.4484, longitude: -112.0740 },
    { name: "Dallas", latitude: 32.7767, longitude: -96.7970 },
    { name: "Seattle", latitude: 47.6062, longitude: -122.3321 },
    { name: "Denver", latitude: 39.7392, longitude: -104.9903 },
  ];

  const fetchWeather = async (latitude: number, longitude: number, cityName: string) => {
    const apiKey = '87e5ad0cf28f4fac7f515ef8b0392ea2';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.cod === 200) {
        const cityWeather = {
          name: cityName,
          temp: `${data.main.temp}°F`,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          humidity: `${data.main.humidity}%`,
          windSpeed: `${data.wind.speed} MPH`,
        };

        setCityWeatherList((prevList) => [cityWeather, ...prevList]);
        setWeather(cityWeather);
      } else {
        alert('Failed to fetch weather data.');
      }
    } catch (error) {
      alert('Error fetching weather data.');
    }
  };

  const getLocationAndFetchWeather = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = currentLocation.coords;

    setLocation({ latitude, longitude });

    await fetchWeather(latitude, longitude, 'Your Location');
    for (const city of additionalCities) {
      await fetchWeather(city.latitude, city.longitude, city.name);
    }
  };

  useEffect(() => {
    getLocationAndFetchWeather();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather in Your Location and Other Cities:</Text>

      {errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : (
        <FlatList
          data={cityWeatherList}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/CityDetail',
                  params: { cityData: JSON.stringify(item) },
                } as any)
              }
            >
              <View style={styles.card}>
                <Text style={styles.cityName}>{item.name}</Text>
                <Text style={styles.infoText}>Temperature: {item.temp}</Text>
                <Text style={styles.infoText}>Conditions: {item.description}</Text>
                <Image
                  style={{ width: 75, height: 75 }}
                  source={{
                    uri: `https://openweathermap.org/img/wn/${item.icon}@2x.png`,
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', // light green background
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
    color: '#2E7D32',
  },
  card: {
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 250,
  },
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  infoText: {
    fontSize: 16,
    marginVertical: 2,
    color: '#333',
  },
});

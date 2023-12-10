import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from "react-native";

const SavedLocationsPage = ({ savedLocations, deleteLocation }) => {
  const [displayedLocations, setDisplayedLocations] = useState(savedLocations);

  // mapping custom icons for different weather

  const iconMapping = {
    "01d": require("./assets/01d.png"),
    "01n": require("./assets/01n.png"),
    "02d": require("./assets/02d.png"),
    "02n": require("./assets/02n.png"),
    "03d": require("./assets/03d.png"),
    "03n": require("./assets/03n.png"),
    "04d": require("./assets/04d.png"),
    "04n": require("./assets/04n.png"),
    "09d": require("./assets/09d.png"),
    "09n": require("./assets/09n.png"),
    "10d": require("./assets/10d.png"),
    "10n": require("./assets/10n.png"),
    "11d": require("./assets/11d.png"),
    "11n": require("./assets/11n.png"),
    "13d": require("./assets/13d.png"),
    "13n": require("./assets/13n.png"),
    "50d": require("./assets/50d.png"),
    "50n": require("./assets/50n.png"),
  };

  // fetch weather data

  const fetchWeatherData = async (latitude, longitude) => {
    const apiKey = process.env.EXPO_PUBLIC_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    const response = await fetch(apiUrl);
    if (response.ok) {
      const data = await response.json();
      return {
        main: { temp: data.main.temp },
        name: data.name,
        icon: data.weather[0].icon,
        description: data.weather[0].description,
        wind: { speed: data.wind.speed },
      };
    } else {
      return { error: "Failed to fetch weather data" };
    }
  };

  // fetch weather data for each saved location

  useEffect(() => {
    const fetchWeatherForSavedLocations = async () => {
      const updatedLocations = await Promise.all(
        savedLocations.map(async (location) => {
          const data = await fetchWeatherData(
            location.latitude,
            location.longitude
          );
          return { ...location, data };
        })
      );
      setDisplayedLocations(updatedLocations);
    };

    fetchWeatherForSavedLocations();
  }, [savedLocations]);

  return (
    // flatlist displaying the favourite locations and the weather data
    <View style={styles.container}>
      <FlatList
        data={displayedLocations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.locationText}>{item.location}</Text>
            <View style={styles.weatherContainer}>
              <View style={styles.weatherDetails}>
                <Text style={styles.weatherHeaderText}>
                  {item.data && item.data.name}
                </Text>
                <Text style={styles.weatherText}>
                  Weather:{" "}
                  {item.data && item.data.description
                    ? item.data.description
                    : "N/A"}
                </Text>
                {item.data && item.data.main && (
                  <Text style={styles.weatherText}>
                    Temperature: {Math.round(item.data.main.temp)}°C
                  </Text>
                )}

                {item.data && item.data.wind && (
                  <Text style={styles.weatherText}>
                    Wind Speed: {item.data.wind.speed.toFixed(1)} m/s
                  </Text>
                )}
              </View>
              {item.data && item.data.icon && (
                <Image
                  source={iconMapping[item.data.icon]}
                  style={styles.weatherIcon}
                />
              )}
            </View>
            <TouchableOpacity
              // delete button
              style={styles.deleteButton}
              onPress={() => deleteLocation(item.id)}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  itemContainer: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 5,
    elevation: 3,
  },
  locationText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#348feb",
    borderRadius: 5,
    padding: 10,
  },
  weatherIcon: {
    width: 30,
    height: 30,
    marginRight: 50,
  },
  weatherDetails: {
    flex: 1,
  },
  weatherHeaderText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  weatherText: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "red",
    textAlign: "center",
  },
});

export default SavedLocationsPage;

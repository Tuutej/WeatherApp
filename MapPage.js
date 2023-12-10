import React, { useState, useEffect } from "react";
import { View, Text, Button, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";

// mapping weather to custom icons

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

const MapPage = ({ addLocationToList }) => {
  // states to manage location and weather data

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  // fetch weather data from openweathermap api
  const fetchWeatherData = async (latitude, longitude) => {
    try {
      const apiKey = process.env.EXPO_PUBLIC_API_KEY;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();

      setWeatherData(data);
    } catch (error) {
      console.error("Error fetching weather data", error);
    }
  };

  // fetch weather data when location changes

  useEffect(() => {
    if (selectedLocation) {
      // triggers fetchWeatherData with the latitude and longitude from selectedLocation
      fetchWeatherData(selectedLocation.latitude, selectedLocation.longitude);
    }
  }, [selectedLocation]);

  return (
    // map display
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1, width: "100%" }}
        initialRegion={{
          latitude: 60.192059,
          longitude: 24.945831,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        // updates selectedLocation based on user input
        onPress={(e) => setSelectedLocation(e.nativeEvent.coordinate)}
      >
        {selectedLocation && (
          <Marker
            coordinate={{
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
            }}
            title="Selected Location"
          />
        )}
      </MapView>

      <View
        // button to save location to the favourites list
        style={{
          position: "absolute",
          bottom: 20,
          left: 20,
          backgroundColor: "white",
          padding: 5,
          borderRadius: 5,
        }}
      >
        <Button
          title="Save Location"
          onPress={() => {
            if (selectedLocation) {
              addLocationToList(selectedLocation);
            } else {
              console.error("No location selected to save.");
            }
          }}
          color="#348feb"
        />
      </View>
      {weatherData && weatherData.main && (
        // box showing the weather data of currently selected location
        <View
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            backgroundColor: "white",
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Image
            source={iconMapping[weatherData.weather[0].icon]}
            style={{ width: 25, height: 25 }}
          />
          <Text style={{ color: "#348feb" }}>Location: {weatherData.name}</Text>
          <Text style={{ color: "#348feb" }}>
            Temperature: {Math.round(weatherData.main.temp)}°C
          </Text>
          <Text style={{ color: "#348feb" }}>
            Wind Speed: {weatherData.wind.speed.toFixed(1)} m/s
          </Text>
        </View>
      )}
    </View>
  );
};

export default MapPage;

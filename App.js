import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SavedLocationsPage from "./SavedLocationsPage";
import MapPage from "./MapPage";
import Icon from "react-native-vector-icons/Ionicons";
import { openDatabase } from "expo-sqlite";

const Tab = createBottomTabNavigator();

const App = () => {
  // state for managing saved locations

  const [savedLocations, setSavedLocations] = useState([]);

  // open sqlite database

  const db = openDatabase("locations.db");

  // create a table

  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS locations (id INTEGER PRIMARY KEY AUTOINCREMENT, location TEXT, latitude REAL, longitude REAL)"
    );
  });
  // function to add a location to the database
  const addLocationToList = (selectedLocation) => {
    db.transaction((tx) => {
      // sql command add location to the database
      tx.executeSql(
        "INSERT INTO locations (location, latitude, longitude) VALUES (?, ?, ?)",
        [
          selectedLocation.location,
          selectedLocation.latitude,
          selectedLocation.longitude,
        ],
        (_, { insertId }) => {
          // update saved locations
          setSavedLocations([
            ...savedLocations,
            { id: insertId, ...selectedLocation },
          ]);
        }
      );
    });
  };

  // function to delete location from the database
  const deleteLocation = (locationId) => {
    const updatedLocations = savedLocations.filter(
      (location) => location.id !== locationId
    );
    // sql command delete location from database
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM locations WHERE id = ?", [locationId], () => {
        // update saved locations
        setSavedLocations(updatedLocations);
      });
    });
  };

  // tab navigator

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Map View"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Favourite Locations") {
              iconName = focused ? "heart" : "heart-outline";
            } else if (route.name === "Map View") {
              iconName = focused ? "map" : "map-outline";
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#348feb",
          tabBarInactiveTintColor: "gray",
        })}
      >
        <Tab.Screen name="Favourite Locations">
          {() => (
            <SavedLocationsPage
              savedLocations={savedLocations}
              deleteLocation={deleteLocation}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Map View">
          {(props) => (
            <MapPage {...props} addLocationToList={addLocationToList} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

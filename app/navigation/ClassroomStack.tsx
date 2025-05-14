import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ClassroomDetailsScreen from "../screens/ClassroomsDetailsScreen";
import ClassroomsScreen from "../screens/ClassroomsScreen";
import { Stack } from "expo-router";

const ClassroomStack: React.FC = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen name="Classrooms List" component={ClassroomsScreen} />
      <Stack.Screen
        name="ClassroomsDetails"
        component={ClassroomDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default ClassroomStack;

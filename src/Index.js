import { View, Text } from "react-native";
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useMainStore } from "./stores/mainStore";
import Login from "./screens/Login";
import Main from "./screens/Main";

const Stack = createStackNavigator();

const Index = () => {
    const token = useMainStore((state) => state.token);
  return (
    <Stack.Navigator>
      {token === null ? (
        <Stack.Screen component={Login} name="login" />
      ) : (
        <Stack.Screen component={Main} name="main" />
      )}
    </Stack.Navigator>
  );
};

export default Index;

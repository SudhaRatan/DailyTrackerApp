import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import Index from "./src/Index";

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Index />
    </NavigationContainer>
  );
}

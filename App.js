import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import Index from "./src/Index";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View } from "react-native";

export default function App() {
  return (
    <GestureHandlerRootView>
      <View style={{ width: "100%", height: "100%" }}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Index />
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}

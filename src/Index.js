import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Main from "./screens/Main";
import { useAuthStore } from "./stores/authStore";
import { Image, Pressable, Text, View } from "react-native";
import axios from "axios";
import { API_URL } from "./config";
import AddEfforts from "./screens/AddEfforts";

const Stack = createStackNavigator();

const Index = () => {
  const loggedIn = useAuthStore((state) => state.loggedIn);

  const logoutClient = useAuthStore((state) => state.logout);

  const logout = async () => {
    try {
      await axios.get(`${API_URL}/api/AuthApi/Logout`);
      logoutClient();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Stack.Navigator>
      {!loggedIn ? (
        <Stack.Screen
          component={Login}
          name="login"
          options={{
            headerStyle: {
              elevation: 10,
            },
            headerTitle: "Login to daily tracker",
            headerTitleAlign: "center",
          }}
        />
      ) : (
        <>
          <Stack.Screen
            options={{
              headerTitle: "Efforts",
              headerTitleAlign: "center",
              headerLeft: () => (
                <View className="justify-center">
                  <Image
                    source={require("../assets/logo.png")}
                    resizeMode="contain"
                    className="h-[80%]"
                  />
                </View>
              ),
              headerRight: () => (
                <Pressable
                  className="p-2 mr-2"
                  android_ripple={{ borderless: false }}
                  onPress={logout}
                >
                  <Text className="text-accent font-semibold">Logout</Text>
                </Pressable>
              ),
            }}
            component={Main}
            name="main"
          />
          <Stack.Screen options={{
            presentation:"modal"
          }} name="AddEffort" component={AddEfforts} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Index;

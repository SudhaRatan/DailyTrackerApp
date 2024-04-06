import { View, Text } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useMainStore } from "../stores/mainStore";

const Login = () => {
  const login = useMainStore((state) => state.login);
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Text>Login</Text>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => login({ token: "token", name: "name", role: "role" })}
        style={{
          backgroundColor: "lavender",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
          elevation: 1,
        }}
      >
        <Text>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;

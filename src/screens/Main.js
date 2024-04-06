import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useMainStore } from "../stores/mainStore";

const Main = () => {
  const logout = useMainStore((state) => state.logout);
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
      }}
    >
      <Text>Main</Text>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => logout({ token: "token", name: "name", role: "role" })}
        style={{
          backgroundColor: "lavender",
          paddingHorizontal: 20,
          paddingVertical: 10,
          borderRadius: 5,
          elevation: 1,
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Main;

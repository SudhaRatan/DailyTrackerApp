import { View, Text, Keyboard, Image } from "react-native";
import React, { useRef, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import Button from "../components/Button";
import axios from "axios";
import { API_URL } from "../config";
import SnackBar from "../components/SnackBar";
import { useAuthStore } from "../stores/authStore";

const Login = () => {
  const login = useAuthStore((state) => state.login);

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const snackBarRef = useRef();

  const loginToServer = async () => {
    Keyboard.dismiss();
    if (userName !== "" && password !== "") {
      setLoading(true);
      try {
        const result = await axios.post(`${API_URL}/api/AuthApi/Login`, {
          userName,
          password,
          keepLoggedIn: true,
        });
        console.log(result)
        login({ ...result.data });
        setLoading(false);
      } catch (error) {
        console.log(error)
        setLoading(false);
        setMessage(error.response ? error.response?.data : "Network Error!!");
        snackBarRef.current.show();
      }
    } else {
      setMessage("Enter username and password");
      snackBarRef.current.show();
    }
  };

  const check = async () => {
    try {
      const result = await axios.get(`${API_URL}/api/AdminOperations/Users`);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View className="flex-1 pt-10 bg-primary-light px-8" style={{ gap: 20 }}>
        <View className="items-center">
          <Image className="" source={require("../../assets/logo.png")} />
        </View>
        <View style={{ gap: 5 }}>
          <Text>User ID</Text>
          <TextInput
            value={userName}
            onChangeText={setUserName}
            placeholder="Ex: 5538"
            className="border border-slate-400 focus:border-accent rounded-sm px-2 py-1"
          />
        </View>
        <View style={{ gap: 5 }}>
          <Text>Password</Text>
          <TextInput
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="Enter password"
            className="border border-slate-400 focus:border-accent rounded-sm px-2 py-1"
          />
        </View>
        <Button loading={loading} onPress={loginToServer} title="LOGIN" />
      </View>
      <SnackBar
        ref={snackBarRef}
        type={"error"}
        title={message}
        actionText="OK"
        autoDestroy={true}
      />
    </>
  );
};

export default Login;

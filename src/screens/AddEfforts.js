import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, { useEffect, useReducer, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import Button from "../components/Button";
import { theme } from "../services/theme";
import { useAuthStore } from "../stores/authStore";
import { useShallow } from "zustand/react/shallow";
import axios from "axios";
import { API_URL } from "../config";
import BottomSheet from "../components/BottomSheet";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList } from "react-native-gesture-handler";

const AddEfforts = () => {
  const { height } = Dimensions.get("screen");
  const PagerRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);

  const BSUserModules = useRef();
  const BSPMT = useRef();

  const { employeeId, userName } = useAuthStore(
    useShallow((state) => ({
      employeeId: state.employeeId,
      userName: state.name,
    }))
  );

  const initialState = {
    userId: employeeId,
    userName: userName,
    moduleId: 0,
    pmt: 0,
    ticketId: "",
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case "Module":
        return { ...state, moduleId: action.payload };
        break;
      case "PMT":
        return { ...state, pmt: action.payload };
        break;
      case "Ticket":
        return { ...state, ticketId: action.payload };
        break;
    }
  };

  const [effort, dispatchEffort] = useReducer(formReducer, initialState);

  const [userModules, setUserModules] = useState([
    { id: 0, name: "Select modules" },
  ]);

  const [pmt, setPmt] = useState([{ id: 0, name: "Select PMT" }]);

  const getModules = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/Modules/GetUserModules/${employeeId}`
      );
      setUserModules([
        { id: 0, name: "Select modules" },
        ...res.data.map((i) => ({ id: i.moduleId, name: i.module.name })),
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getPMT = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Efforts/GetPMT`);
      setPmt([{ id: 0, name: "Select PMT" }, ...res.data]);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getModules();
    getPMT();
  }, []);

  return (
    <View className="flex-1 bg-primary-light">
      <PagerView
        className="flex-1"
        initialPage={0}
        scrollEnabled={false}
        ref={PagerRef}
      >
        <ScrollView className="p-4" contentContainerStyle={{alignItems:"center",gap:20}} key={1}>
          <View className="w-[100%]">
            <Text className="font-semibold">Name</Text>
            <TextInput
              className="text-slate-500 bg-secondary-light border-slate-400 focus:border-accent border px-2 py-1 rounded-sm"
              editable={false}
              value={effort.userName}
            />
          </View>

          <View className="w-[100%]">
            <Text className="font-semibold ">Module</Text>
            <TouchableOpacity
              className="p-2 text-slate-500 border-slate-400 focus:border-accent border rounded-sm flex-row items-center justify-between"
              onPress={() => {
                BSUserModules.current.open();
              }}
            >
              <Text>
                {userModules.find((i) => i.id === effort.moduleId).name}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="w-[100%]">
            <Text className="font-semibold ">Project Management Tool</Text>
            <TouchableOpacity
              className="p-2 text-slate-500 border-slate-400 focus:border-accent border rounded-sm flex-row items-center justify-between"
              onPress={() => {
                BSPMT.current.open();
              }}
            >
              <Text>{pmt.find((i) => i.id === effort.pmt).name}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="w-[100%]">
            <Text className="font-semibold">Ticket Id</Text>
            <TextInput
              className="text-slate-500 border-slate-400 focus:border-accent border px-2 py-1 rounded-sm"
              onChangeText={(text) => dispatchEffort({type:"Ticket", payload:text})}
              value={effort.ticketId}
            />
          </View>

          <Text>{JSON.stringify(effort)}</Text>
        </ScrollView>
        <View className="justify-center items-center" key={2}>
          <Text>2</Text>
        </View>
        <View className="justify-center items-center" key={3}>
          <Text>3</Text>
        </View>
      </PagerView>
      <View className="flex-row m-4" style={{ gap: 10 }}>
        <Button
          className="flex-1"
          title={"Prev"}
          color={theme.backgroundColor.secondary.light}
          border={theme.colors.accent}
          textColor={theme.colors.tertiary.light}
          onPress={() => {
            if (currentPage > 0) {
              PagerRef.current.setPage(currentPage - 1);
              setCurrentPage(currentPage - 1);
            }
          }}
        />
        {currentPage === 2 ? (
          <Button className="flex-1" title={"Add"} onPress={() => {}} />
        ) : (
          <Button
            className="flex-1"
            title={"Next"}
            onPress={() => {
              if (currentPage < 2) {
                PagerRef.current.setPage(currentPage + 1);
                setCurrentPage(currentPage + 1);
              }
            }}
          />
        )}
      </View>

      {/* Modules */}
      <BottomSheet ref={BSUserModules}>
        <View style={{ maxHeight: height / 2.5 }}>
          <FlatList
            data={userModules}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  className="p-2 bg-tertiary-light rounded-md"
                  onPress={() => {
                    BSUserModules.current.close();
                    dispatchEffort({ type: "Module", payload: item.id });
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </BottomSheet>

      {/* PMT */}
      <BottomSheet ref={BSPMT}>
        <View style={{ maxHeight: height / 2.5 }}>
          <FlatList
            data={pmt}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  className="p-2 bg-tertiary-light rounded-md"
                  onPress={() => {
                    BSPMT.current.close();
                    dispatchEffort({ type: "PMT", payload: item.id });
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

export default AddEfforts;

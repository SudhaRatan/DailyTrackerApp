import { View, Text, TextInput } from "react-native";
import React, { useEffect, useReducer, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import Button from "../components/Button";
import { theme } from "../services/theme";

const AddEfforts = () => {
  const PagerRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);

  const initialState = {
    userId: "",
    moduleId: "",
  };

  const formReducer = (state, action) => {
    switch (action.type) {
      case "Name":
        return { ...state, userId: action.payload };
        break;
      case "Module":
        return { ...state, moduleId: action.payload };
        break;
    }
  };

  const [effort, dispatchEffort] = useReducer(formReducer, initialState);

  return (
    <View className="flex-1 bg-primary-light">
      <PagerView
        className="flex-1"
        initialPage={0}
        scrollEnabled={false}
        ref={PagerRef}
      >
        <View className="items-center p-2" key={1}>
          <TextInput
            placeholder="Name"
            className="w-[100%]"
            onChangeText={(text) =>
              dispatchEffort({ type: "Name", payload: text })
            }
          />
          <TextInput
            placeholder="Module"
            className="w-[100%]"
            onChangeText={(text) =>
              dispatchEffort({ type: "Module", payload: text })
            }
          />
          <Text>{effort.userId+" "+effort.moduleId}</Text>
        </View>
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
    </View>
  );
};

export default AddEfforts;

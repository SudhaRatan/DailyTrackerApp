import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { useAuthStore } from "../stores/authStore";
import { RefreshControl } from "react-native-gesture-handler";
import BottomSheet from "../components/BottomSheet";
import { Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { FlatList as FL } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { theme } from "../services/theme";

import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { DividerH } from "../components/Divider";

const Main = ({navigation}) => {
  const { height } = Dimensions.get("screen");
  const logout = useAuthStore((state) => state.logout);
  const employeeId = useAuthStore((state) => state.employeeId);



  const [efforts, setEfforts] = useState([]);
  const [effort, setEffort] = useState({});

  const [gettingEfforts, setGettingEfforts] = useState(false);

  var [tempEfforts, setTempEfforts] = useState([]);

  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [tempModules, setTempModules] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const [project, setProject] = useState(0);
  const [module, setModule] = useState(0);
  const [status, setStatus] = useState(0);

  const [filter, setFilter] = useState(false);

  const filterEfforts = async () => {
    try {
      setGettingEfforts(true);
      const res = await axios.post(`${API_URL}/api/Efforts/search`, {
        employeeName: search,
        projectId: project,
        moduleId: module,
        statusId: status,
      });
      setEfforts([...res.data]);
      setTempEfforts([...res.data]);
      setGettingEfforts(false);
    } catch (error) {
      setGettingEfforts(false);
      console.log(error);
    }
  };

  const clearFilter = () => {
    setProject(0);
    setModule(0);
    setModules(tempModules);
    setStatus(0);
    setSearch("");
  };

  const perVal = useSharedValue(0);
  const perAnim = useAnimatedStyle(() => {
    return {
      width: perVal.value <= 100 ? perVal.value + "%" : 100 + "%",
    };
  });

  const filterVal = useSharedValue(0);
  const filterAnim = useAnimatedStyle(() => {
    return {
      // transform: [{ scaleY: filterVal.value }],
      height: interpolate(filterVal.value, [0, 1], [0, 30]),
      opacity: interpolate(filterVal.value, [0.5, 1], [0, 1]),
      marginVertical: interpolate(filterVal.value, [0, 1], [5, 10]),
    };
  });

  const getEfforts = async () => {
    try {
      setGettingEfforts(true);
      const res = await axios.get(`${API_URL}/api/Efforts`);
      setTempEfforts([...res.data.efforts]);
      setEfforts((prev) => [...res.data.efforts]);
      setGettingEfforts(false);
    } catch (error) {
      setGettingEfforts(false);
      console.log(error);
    }
  };

  const getProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Projects`);
      setProjects([...res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const getStatus = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Efforts/GetStatus`);
      setStatuses([...res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const getModules = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/Modules`);
      setModules([...res.data]);
      setTempModules([...res.data]);
    } catch (error) {
      console.log(error);
    }
  };

  const BSRef = useRef();
  const BSProjects = useRef();
  const BSModules = useRef();
  const BSStatus = useRef();

  useEffect(() => {
    getEfforts();
    getProjects();
    getStatus();
    getModules();
  }, []);

  const [search, setSearch] = useState("");

  return (
    <View className="flex-1 bg-primary-light p-3">
      <View className="flex-row justify-between" style={{ gap: 10 }}>
        <TouchableOpacity
          className="bg-tertiary-light p-2 rounded-md"
          onPress={() => filterEfforts()}
        >
          <MaterialIcons name="search" size={24} color={theme.colors.accent} />
        </TouchableOpacity>
        <View className="flex-row items-center border border-tertiary-dark rounded-lg flex-1 p-1">
          <TextInput
            placeholder="Search"
            className="flex-1"
            value={search}
            onChangeText={(text) => {
              setSearch(text);
              setEfforts([
                ...tempEfforts.filter(
                  (item) =>
                    item.userName.toLowerCase().includes(text.toLowerCase()) ||
                    item.moduleName
                      .toLowerCase()
                      .includes(text.toLowerCase()) ||
                    item.ticketId.toLowerCase().includes(text.toLowerCase())
                ),
              ]);
            }}
          />
        </View>
        <TouchableOpacity
          className="justify-center items-center bg-tertiary-light px-2 rounded-lg"
          onPress={() => {
            filterVal.value =
              filterVal.value === 0 ? withTiming(1) : withTiming(0);
            filterVal.value === 1
              ? runOnJS(() => {
                  clearFilter();
                  getEfforts();
                  setFilter(false);
                })()
              : runOnJS(() => {
                  setFilter(true);
                })();
          }}
        >
          <MaterialIcons
            name={!filter ? "filter-list" : "filter-list-off"}
            size={24}
            color={theme.colors.accent}
          />
        </TouchableOpacity>

        <TouchableOpacity
        onPress={() => navigation.navigate("AddEffort")}
          className="bg-accent rounded-lg shadow-sm px-2 justify-center items-center"
          style={{ elevation: 4 }}
        >
          <AntDesign name="plus" size={24} color={theme.colors.primary.dark} />
        </TouchableOpacity>
      </View>
      {/* Filters */}
      <Animated.View style={[{}, filterAnim]}>
        <ScrollView horizontal style={{ flex: 0 }}>
          <View className="flex-row relative" style={{ gap: 10 }}>
            <TouchableOpacity
              className="px-3 py-1 items-center rounded-full bg-accent2 justify-center flex-row"
              style={{ gap: 4 }}
              onPress={() => {
                BSProjects.current.open();
              }}
            >
              {project === 0 ? (
                <>
                  <Text className="text-accent font-semibold">Projects</Text>
                  <FontAwesome
                    name="angle-down"
                    size={18}
                    color={theme.colors.accent}
                  />
                </>
              ) : (
                <>
                  <Text className="text-accent font-semibold">
                    {projects.find((item) => item.id == project).name}
                  </Text>
                  <FontAwesome
                    name="angle-down"
                    size={18}
                    color={theme.colors.accent}
                  />
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="px-3 py-1 items-center rounded-full bg-accent2 justify-center flex-row"
              style={{ gap: 4 }}
              onPress={() => {
                BSModules.current.open();
              }}
            >
              {module === 0 ? (
                <>
                  <Text className="text-accent font-semibold">Modules</Text>
                  <FontAwesome
                    name="angle-down"
                    size={18}
                    color={theme.colors.accent}
                  />
                </>
              ) : (
                <>
                  <Text className="text-accent font-semibold">
                    {modules.find((item) => item.id == module).name}
                  </Text>
                  <FontAwesome
                    name="angle-down"
                    size={18}
                    color={theme.colors.accent}
                  />
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="px-3 py-1 items-center rounded-full bg-accent2 justify-center flex-row"
              style={{ gap: 4 }}
              onPress={() => {
                BSStatus.current.open();
              }}
            >
              {status === 0 ? (
                <>
                  <Text className="text-accent font-semibold">Status</Text>
                  <FontAwesome
                    name="angle-down"
                    size={18}
                    color={theme.colors.accent}
                  />
                </>
              ) : (
                <>
                  <Text className="text-accent font-semibold">
                    {statuses.find((item) => item.id == status).name}
                  </Text>
                  <FontAwesome
                    name="angle-down"
                    size={18}
                    color={theme.colors.accent}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
      <View className="rounded-lg border border-tertiary-dark flex-1 overflow-hidden">
        {efforts.length > 0 ? (
          <>
            <View className="flex-row bg-tertiary-light border-b border-b-accent px-2 py-4">
              <Text className="flex-[2.5] font-semibold">Name</Text>
              <Text className="flex-1 font-semibold text-center">Module</Text>
              <Text className="flex-1 font-semibold text-center">
                Ticket Id
              </Text>
            </View>
            <FlatList
              data={efforts}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                borderColor: theme.colors.accent,
              }}
              refreshControl={
                <RefreshControl
                  refreshing={gettingEfforts}
                  onRefresh={getEfforts}
                  colors={[theme.colors.accent]}
                />
              }
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    className={`flex-row justify-between px-2 py-4 ${
                      index % 2 === 0
                        ? "bg-secondary-light"
                        : "bg-tertiary-light"
                    }`}
                    activeOpacity={0.5}
                    onPress={() => {
                      BSRef.current.open();
                      perVal.value = withDelay(
                        400,
                        withSpring(item.percentageCompleted, {
                          damping: 18,
                        })
                      );
                      runOnJS(() => {
                        setEffort({
                          ...item,
                        });
                      })();
                    }}
                  >
                    <Text className="flex-[2.5]">{item.userName}</Text>
                    <Text className="flex-1 text-center">
                      {item.moduleName}
                    </Text>
                    <Text className="flex-1 text-center">{item.ticketId}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={theme.colors.accent} />
          </View>
        )}
      </View>
      {/* Efforts BottomSheet */}
      <BottomSheet style={{ gap: 10 }} ref={BSRef}>
        <View className="gap-1">
          <View className="mb-2">
            <Text className="font-semibold text-xl">{effort.userName}</Text>
          </View>
          <DividerH />
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-semibold">{effort.moduleName}</Text>
            <Text
              className="text-sm bg-tertiary-light px-1 rounded-md"
              style={{ fontFamily: "monospace" }}
            >
              {effort.status}
            </Text>
          </View>
          <View className="">
            <Text className="text-sm">{effort.ticketId}</Text>
          </View>
          <View className="flex-row flex-wrap">
            <Text className="text-sm">{effort.taskDetails}</Text>
          </View>
          <View className="flex-row flex-wrap mb-2 bg-tertiary-light self-start px-1 rounded-md">
            <Text className="text-sm">
              {effort.hoursSpentToday} hours spent on&nbsp;
            </Text>
            <Text className="font-semibold text-sm">{effort.effortDate}</Text>
          </View>
          <DividerH />
          <View className="flex-row items-center" style={{ gap: 8 }}>
            <View className="flex-1 bg-tertiary-light h-3 p-[2] justify-center rounded-full">
              <Animated.View
                className={`bg-accent h-2 rounded-full`}
                style={[perAnim]}
              />
            </View>
            <Text className="">{effort.percentageCompleted}% completed</Text>
          </View>
        </View>
        {employeeId === effort.userId ? (
          <View className="flex-1 gap-2 flex-row">
            <TouchableOpacity className="p-2 bg-tertiary-light flex-1 items-center justify-center rounded-lg">
              <Feather name="edit-2" size={20} color="green" />
            </TouchableOpacity>
            <TouchableOpacity className="p-2 bg-tertiary-light flex-1 items-center justify-center rounded-lg">
              <MaterialIcons name="delete-outline" size={24} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-4 bg-tertiary-light flex-1 items-center justify-center rounded-lg"
              onPress={() => BSRef.current.close()}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={theme.colors.accent}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 gap-2 flex-row">
            <TouchableOpacity
              className="p-4 bg-tertiary-light flex-1 items-center justify-center rounded-lg"
              onPress={() => BSRef.current.close()}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={theme.colors.accent}
              />
            </TouchableOpacity>
          </View>
        )}
      </BottomSheet>

      {/* Projects BottomSheet */}
      <BottomSheet ref={BSProjects}>
        <View style={{ gap: 10 }}>
          <Text className="text-xl font-semibold">Select projects</Text>
          <DividerH />
          <View className="" style={{ maxHeight: height / 2, gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                BSProjects.current.close();
                runOnJS(() => {
                  setProject((prev) => 0);
                  setModules(tempModules);
                })();
              }}
              className="bg-tertiary-light p-2 rounded-md"
              key={0}
            >
              <Text>Any</Text>
            </TouchableOpacity>
            <FL
              data={projects}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      BSProjects.current.close();
                      runOnJS(() => {
                        setModule(0);
                        setProject((prev) => item.id);
                        setModules((prev) =>
                          tempModules.filter((i) => i.projectId === item.id)
                        );
                      })();
                    }}
                    className="bg-tertiary-light p-2 rounded-md"
                    key={item.id}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </BottomSheet>

      {/* Modules BottomSheet */}
      <BottomSheet ref={BSModules}>
        <View style={{ gap: 10 }}>
          <Text className="text-xl font-semibold">Select modules</Text>
          <DividerH />
          <View className="" style={{ maxHeight: height / 2.5, gap: 10 }}>
            {modules.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  BSModules.current.close();
                  runOnJS(() => setModule((prev) => 0))();
                }}
                className="bg-tertiary-light p-2 rounded-md"
                key={0}
              >
                <Text>Any</Text>
              </TouchableOpacity>
            )}
            {modules.length > 0 ? (
              <FL
                data={modules}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ gap: 10 }}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        BSModules.current.close();
                        runOnJS(() => setModule((prev) => item.id))();
                      }}
                      className="bg-tertiary-light p-2 rounded-md"
                      key={item.id}
                    >
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
                  );
                }}
              />
            ) : (
              <Text>No modules in this project</Text>
            )}
          </View>
        </View>
      </BottomSheet>

      {/* Status BottomSheet */}
      <BottomSheet ref={BSStatus}>
        <View style={{ gap: 10 }}>
          <Text className="text-xl font-semibold">Select status</Text>
          <DividerH />
          <View className="" style={{ maxHeight: height / 2.5, gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                BSStatus.current.close();
                runOnJS(() => setStatus((prev) => 0))();
              }}
              className="bg-tertiary-light p-2 rounded-md"
              key={0}
            >
              <Text>Any</Text>
            </TouchableOpacity>
            <FL
              data={statuses}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ gap: 10 }}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      BSStatus.current.close();
                      runOnJS(() => setStatus((prev) => item.id))();
                    }}
                    className="bg-tertiary-light p-2 rounded-md"
                    key={item.id}
                  >
                    <Text>{item.name}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </BottomSheet>
    </View>
  );
};

export default Main;

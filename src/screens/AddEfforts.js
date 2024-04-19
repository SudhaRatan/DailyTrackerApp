import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import React, {
  Suspense,
  useDeferredValue,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
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
import { useMainStore } from "../stores/mainStore";
import SnackBar from "../components/SnackBar";
import RNDateTimePicker from "@react-native-community/datetimepicker";

const AddEfforts = ({ navigation }) => {
  const [ticketId, setTicketId] = useState("");
  const deferredTI = useDeferredValue(ticketId);

  const { height } = Dimensions.get("screen");
  const PagerRef = useRef();
  const [currentPage, setCurrentPage] = useState(0);

  const BSUserModules = useRef();
  const BSPMT = useRef();
  const BSStatus = useRef();

  const statuses = useMainStore((state) => state.statuses);
  const setStatuses = useMainStore((state) => state.setStatuses);

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
    pmtId: 0,
    ticketId: "",
    taskDetails: "",
    StatusId: 0,
    totalEstimatedHours: "",
    hoursSpentToday: "",
    totalHoursSpent: "",
    percentageCompleted: 0,
    effortDate: getDate(),
    startDate: "",
    endDate: "",
    edit: false,
  };

  const SnackBarRef = useRef();
  const [message, setMessage] = useState("");

  const [showEffortDate, setShowEffortDate] = useState(false);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);

  function getDate(date) {
    var dt;
    if (date) {
      dt = new Date(date);
    } else {
      dt = new Date();
    }
    var month = dt.getMonth() + 1;
    var date = dt.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (date < 10) {
      date = "0" + date;
    }

    return dt.getFullYear() + "" + month + "" + date;
  }

  const formReducer = (state, action) => {
    switch (action.type) {
      case "Module":
        return { ...state, moduleId: action.payload };
        break;
      case "PMT":
        return { ...state, pmtId: action.payload, ticketId: "" };
        break;
      case "Ticket":
        return { ...state, ticketId: action.payload };
        break;
      case "TaskDetails":
        return { ...state, taskDetails: action.payload };
        break;
      case "Status":
        return { ...state, StatusId: action.payload };
        break;
      case "PmtId":
        return { ...state, pmt: action.payload };
        break;
      case "TotalEstHours":
        return { ...state, totalEstimatedHours: action.payload };
        break;
      case "TodayHours":
        return {
          ...state,
          hoursSpentToday: action.payload,
          percentageCompleted: (
            ((Number(action.payload) + Number(state.totalHoursSpent)) /
              Number(state.totalEstimatedHours)) *
            100
          ).toFixed(2),
        };
        break;
      case "TotalHours":
        return { ...state, totalHoursSpent: action.payload };
        break;
      case "EffortDate":
        return { ...state, effortDate: action.payload };
        break;
      case "StartDate":
        return {
          ...state,
          startDate: action.payload.split("-").reverse().join("-"),
        };
        break;
      case "EndDate":
        return {
          ...state,
          endDate: action.payload.split("-").reverse().join("-"),
        };
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
      console.log(error);
    }
  };

  const GetInfo = (pmtId) => {
    if (pmtId !== 0 && effort.userId) {
      GetHours(pmtId);
      GetDates(pmtId);
    }
  };

  const GetHours = async (pmtId) => {
    try {
      const res = await axios.post(`${API_URL}/api/Efforts/GetHours`, {
        PMT: pmtId,
        EmployeeId: effort.userId,
      });
      const { totalEstimatedHours, totalHoursSpent } = res.data;
      if (totalEstimatedHours !== 0 && totalHoursSpent !== 0) {
        dispatchEffort({
          type: "TotalEstHours",
          payload: totalEstimatedHours.toString(),
        });
        dispatchEffort({
          type: "TotalHours",
          payload: totalHoursSpent.toString(),
        });
      } else {
        dispatchEffort({ type: "TotalEstHours", payload: "" });
        dispatchEffort({ type: "TotalHours", payload: "" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const GetDates = async (pmtId) => {
    try {
      const res = await axios.post(`${API_URL}/api/Efforts/GetDates`, {
        PMT: pmtId,
        EmployeeId: effort.userId,
      });
      console.log(res.data);
      dispatchEffort({
        type: "StartDate",
        payload: res.data.startDate
          .split("T")[0]
          .split("-")
          .reverse()
          .join("-"),
      });
      dispatchEffort({
        type: "EndDate",
        payload: res.data.endDate.split("T")[0].split("-").reverse().join("-"),
      });
      dispatchEffort({ type: "Module", payload: res.data.moduleId });
    } catch (error) {
      console.log("Not exists",error);
    }
  };

  const handleButtonPrev = () => {
    if (currentPage > 0) {
      PagerRef.current.setPage(currentPage - 1);
      setCurrentPage(currentPage - 1);
    }
  };

  const handleButtonNext = () => {
    if (currentPage < 1) {
      switch (currentPage) {
        case 0:
          if (
            effort.userId === "" ||
            effort.moduleId === 0 ||
            effort.pmtId === 0 ||
            effort.ticketId === "" ||
            effort.taskDetails === ""
          ) {
            setMessage("Fill all details");
            SnackBarRef.current.show();
          } else {
            PagerRef.current.setPage(currentPage + 1);
            setCurrentPage(currentPage + 1);
          }
          break;
        case 1:
          break;
      }
    }
  };

  const getEfforts = useMainStore((state) => state.getEfforts);

  const HandleAdd = async () => {
    if (
      effort.StatusId !== 0 &&
      effort.totalEstimatedHours !== "" &&
      effort.hoursSpentToday !== "" &&
      effort.effortDate !== "" &&
      effort.startDate !== "" &&
      effort.endDate !== ""
    ) {
      try {
        var tempEffort = effort;
        tempEffort.totalHoursSpent =
          Number(effort.totalHoursSpent) + Number(effort.hoursSpentToday);
        const res = await axios.post(`${API_URL}/api/Efforts`, tempEffort);
        console.log(res.data);
        getEfforts();
        navigation.goBack();
      } catch (error) {
        console.log(error.response?.data);
      }
    } else {
      setMessage("Fill all details");
      SnackBarRef.current.show();
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
        <ScrollView
          className="p-4"
          contentContainerStyle={{ alignItems: "center", gap: 20, }}
          key={1}
        >
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
              <Text>{pmt.find((i) => i.id === effort.pmtId).name}</Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View className="w-[100%]">
            <Text className="font-semibold">Ticket Id</Text>
            <TextInput
              className="border-slate-400 focus:border-accent border px-2 py-1 rounded-sm"
              onChangeText={(text) => {
                setTicketId(text);
                dispatchEffort({ type: "Ticket", payload: text });
              }}
              value={effort.ticketId}
            />
          </View>

          <TicketDetailsResult
            effort={effort}
            dispatchEffort={dispatchEffort}
            deferredTI={deferredTI}
            GetInfo={GetInfo}
          />

          {/* <Text>{JSON.stringify(effort)}</Text> */}
        </ScrollView>
        <ScrollView
          className="p-4"
          contentContainerStyle={{
            gap: 20,
            alignItems: "center",
          }}
          key={2}
        >
          <View className="w-[100%]">
            <Text className="font-semibold ">Status</Text>
            <TouchableOpacity
              className="p-2 text-slate-500 border-slate-400 focus:border-accent border rounded-sm flex-row items-center justify-between"
              onPress={() => {
                BSStatus.current.open();
              }}
            >
              <Text>
                {statuses.length > 0 &&
                  statuses.find((i) => i.id === effort.StatusId).name}
              </Text>
              <MaterialIcons name="arrow-drop-down" size={24} color="black" />
            </TouchableOpacity>
          </View>
          <View className="flex-row w-[100%]" style={{ gap: 10 }}>
            <View className="flex-1">
              <Text className="font-semibold">Total estimated hours</Text>
              <TextInput
                className="border-slate-400 focus:border-accent border px-2 py-1 rounded-sm"
                onChangeText={(text) => {
                  dispatchEffort({ type: "TotalEstHours", payload: text });
                }}
                keyboardType="number-pad"
                value={effort.totalEstimatedHours}
              />
            </View>

            <View className="flex-1">
              <Text className="font-semibold">Hours spent today</Text>
              <TextInput
                className="border-slate-400 focus:border-accent border px-2 py-1 rounded-sm"
                onChangeText={(text) => {
                  dispatchEffort({ type: "TodayHours", payload: text });
                }}
                keyboardType="number-pad"
                value={effort.hoursSpentToday}
              />
            </View>
          </View>

          <View className="w-[100%]">
            <Text className="font-semibold ">Effort Date</Text>
            <TouchableOpacity
              className="p-2 text-slate-500 border-slate-400 focus:border-accent border rounded-sm flex-row items-center justify-between"
              onPress={() => {
                setShowEffortDate(true);
              }}
            >
              <Text>
                {effort.effortDate.slice(6, 8) +
                  "-" +
                  effort.effortDate.slice(4, 6) +
                  "-" +
                  effort.effortDate.slice(0, 4)}
              </Text>
            </TouchableOpacity>
            {showEffortDate && (
              <RNDateTimePicker
                onChange={(event, date) => {
                  dispatchEffort({
                    type: "EffortDate",
                    payload: date
                      .toLocaleDateString()
                      .split("/")
                      .reverse()
                      .join(""),
                  });
                  setShowEffortDate(false);
                }}
                mode="date"
                value={new Date()}
              />
            )}
          </View>

          <View className="w-[100%] flex-row" style={{ gap: 10 }}>
            <View className="flex-1">
              <Text className="font-semibold ">Start Date</Text>
              <TouchableOpacity
                className="p-2 text-slate-500 border-slate-400 focus:border-accent border rounded-sm flex-row items-center justify-between"
                onPress={() => {
                  setShowStartDate(true);
                }}
              >
                <Text>{effort.startDate.split("-").reverse().join("-")}</Text>
              </TouchableOpacity>
              {showStartDate && (
                <RNDateTimePicker
                  onChange={(event, date) => {
                    dispatchEffort({
                      type: "StartDate",
                      payload: date.toLocaleDateString().split("/").join("-"),
                    });
                    setShowStartDate(false);
                  }}
                  mode="date"
                  value={new Date()}
                />
              )}
            </View>
            <View className="flex-1">
              <Text className="font-semibold ">End Date</Text>
              <TouchableOpacity
                className="p-2 text-slate-500 border-slate-400 focus:border-accent border rounded-sm flex-row items-center justify-between"
                onPress={() => {
                  setShowEndDate(true);
                }}
              >
                <Text>{effort.endDate.split("-").reverse().join("-")}</Text>
              </TouchableOpacity>
              {showEndDate && (
                <RNDateTimePicker
                  accentColor={theme.colors.accent}
                  onChange={(event, date) => {
                    dispatchEffort({
                      type: "EndDate",
                      payload: date.toLocaleDateString().split("/").join("-"),
                    });
                    setShowEndDate(false);
                  }}
                  mode="date"
                  value={new Date()}
                />
              )}
            </View>
          </View>
          <View className="w-full">
            <View className="w-full flex-row justify-between">
              <Text className="font-semibold mb-1">Percentage Completed</Text>
              <Text className="font-semibold">
                {effort.totalEstimatedHours !== ""
                  ? (
                      ((Number(effort.hoursSpentToday) +
                        Number(effort.totalHoursSpent)) /
                        Number(effort.totalEstimatedHours)) *
                      100
                    ).toFixed(2) + "%"
                  : "0%"}
              </Text>
            </View>
            <View className="bg-tertiary-light rounded-full w-full p-1">
              <View
                className="bg-accent h-2 rounded-full"
                style={{
                  width:
                    effort.totalEstimatedHours !== ""
                      ? (
                          ((Number(effort.hoursSpentToday) +
                            Number(effort.totalHoursSpent)) /
                            Number(effort.totalEstimatedHours)) *
                          100
                        ).toFixed(2) <= 100
                        ? (
                            ((Number(effort.hoursSpentToday) +
                              Number(effort.totalHoursSpent)) /
                              Number(effort.totalEstimatedHours)) *
                            100
                          ).toFixed(2) + "%"
                        : "100%"
                      : "0%",
                }}
              />
            </View>
          </View>
        </ScrollView>
      </PagerView>
      <View className="flex-row m-4" style={{ gap: 10 }}>
        <Button
          className="flex-1"
          title={"Prev"}
          color={theme.backgroundColor.secondary.light}
          border={theme.colors.accent}
          textColor={theme.colors.tertiary.light}
          onPress={handleButtonPrev}
        />
        {currentPage === 1 ? (
          <Button className="flex-1" title={"Add"} onPress={HandleAdd} />
        ) : (
          <Button
            className="flex-1"
            title={"Next"}
            onPress={handleButtonNext}
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

      {/* Statuses */}
      <BottomSheet ref={BSStatus}>
        <View style={{ maxHeight: height / 2.5 }}>
          <FlatList
            data={statuses}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ gap: 10 }}
            renderItem={({ item }) => {
              return (
                <TouchableOpacity
                  className="p-2 bg-tertiary-light rounded-md"
                  onPress={() => {
                    BSStatus.current.close();
                    dispatchEffort({ type: "Status", payload: item.id });
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </BottomSheet>
      <SnackBar
        ref={SnackBarRef}
        type={"error"}
        title={message}
        actionText="OK"
        autoDestroy={true}
      />
    </View>
  );
};

export default AddEfforts;

function TicketDetailsResult({ effort, dispatchEffort, deferredTI, GetInfo }) {
  const getTaskDetails = async () => {
    try {
      const res = await axios.post(`${API_URL}/api/Efforts/GetTaskDetails`, {
        TicketID: effort.ticketId,
        PmtId: effort.pmtId,
        TaskDetails: effort.taskDetails,
      });
      console.log(res.data);
      if (res.data.taskDetails != undefined) {
        dispatchEffort({ type: "TaskDetails", payload: res.data.taskDetails });
        dispatchEffort({ type: "PmtId", payload: res.data.id });
        setTDR(true);
        GetInfo(res.data.id);
      } else {
        dispatchEffort({ type: "TaskDetails", payload: "" });
        setTDR(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [tdR, setTDR] = useState(false);

  useEffect(() => {
    if (deferredTI != "" && effort.pmtId != 0) getTaskDetails();
  }, [deferredTI]);

  return (
    <Suspense>
      <View className="w-[100%]">
        <Text className="font-semibold">Task details</Text>
        <TextInput
          multiline
          readOnly={tdR}
          className="border-slate-400 focus:border-accent border px-2 py-1 rounded-sm"
          onChangeText={(text) =>
            dispatchEffort({ type: "TaskDetails", payload: text })
          }
          value={effort.taskDetails}
        />
      </View>
    </Suspense>
  );
}

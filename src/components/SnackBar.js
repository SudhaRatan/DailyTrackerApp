import { View, Text, Pressable } from "react-native";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SnackBar = forwardRef(
  ({ title, actionText = "OK", autoDestroy = true, type }, ref) => {
    const [textColor, setTextColor] = useState("black");
    const translate = useSharedValue(100);
    useEffect(() => {
      translate.value = withTiming(100,{duration:10});
      switch (type) {
        case "error":
          setTextColor("red");
          break;
        case "warning":
          setTextColor("orange");
          break;
        default:
          setTextColor("black");
          break;
      }
    }, []);
    const hide = () => {
      if (translate.value === 0) {
        translate.value = withSpring(100, { duration: 1000 });
      }
    };
    useImperativeHandle(ref, () => ({
      show: () => {
        if (translate.value !== 0) {
          translate.value = withSpring(0, { damping: 13 });
          if (autoDestroy) {
            setTimeout(() => {
              if (translate.value === 0) {
                translate.value = withSpring(translate.value + 100, {
                  duration: 1000,
                });
              }
            }, 4000);
          }
        }
      },
    }));

    return (
      <Animated.View
        className="absolute bottom-0 pb-3 px-4 shadow-md"
        style={[useAnimatedStyle(() => ({
            transform:[{translateY:translate.value}]
        }))]}
      >
        <View
          className="flex-row w-full p-3 rounded-md justify-between items-center bg-primary-light"
          style={{ elevation: 4 }}
        >
          <Text style={{ color: textColor }}>{title}</Text>
          <Pressable onPress={hide} android_ripple={{ borderless: true }}>
            <Text className="text-accent font-semibold">{actionText}</Text>
          </Pressable>
        </View>
      </Animated.View>
    );
  }
);

export default SnackBar;

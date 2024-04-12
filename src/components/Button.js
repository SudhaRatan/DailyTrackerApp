import { View, ActivityIndicator, Pressable, Text } from "react-native";
import { theme } from "../services/theme";

const Button = ({
  title,
  onPress,
  loading,
  iconColor,
  iconsize,
  color,
  textColor,
  border,
  disabled,
  style,
}) => {
  return (
    <View
      className={`rounded-sm shadow-sm ${
        border ? "border-[" + border + "]" : "border-accent"
      }`}
      style={[
        {
          elevation: 4,
          backgroundColor: color ? color : theme.colors.accent,
          borderWidth: border ? 1 : 0,
          borderColor: border && border
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          className="px-5 py-[7.5]"
          size={iconsize ? iconsize : "small"}
          color={iconColor ? iconColor : "#efefef"}
        />
      ) : (
        <Pressable
          android_ripple={{ borderless: true }}
          className="px-5 py-2 items-center rounded-sm "
          onPress={onPress}
        >
          <Text
            className={`font-semibold`}
            style={{ color: textColor ? textColor : theme.colors.primary.dark }}
          >
            {title}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default Button;

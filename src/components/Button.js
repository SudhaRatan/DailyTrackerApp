import { View, ActivityIndicator, Pressable, Text } from "react-native";

const Button = ({
  title,
  onPress,
  loading,
  iconColor,
  iconsize,
  color,
  border,
  disabled,
  style
}) => {
  return (
    <View
      className={`rounded-sm ${!disabled && color ? color : "bg-accent"} ${
        border && "border"
      } ${border ? border : "border-accent"}`}
      style={[{ elevation: 4 },style]}
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
          <Text className="text-primary-dark font-semibold">{title}</Text>
        </Pressable>
      )}
    </View>
  );
};

export default Button;
import { View } from "react-native";

export const DividerH = ({ color, width, height }) => {
  return (
    <View
      style={{
        backgroundColor: color ? color : "#808080",
        width: width ? width : "100%",
        height: height ? height : 1,
      }}
    />
  );
};

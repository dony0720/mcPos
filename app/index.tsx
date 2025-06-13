import { Text, View, Pressable } from "react-native";
import LottieView from "lottie-react-native";
import McPosLogo from "../assets/icon/mcPosLogo.svg";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View className="h-full w-full box-border px-[20%] bg-white flex flex-col items-center justify-center">
      <View className="flex justify-center items-center">
        <McPosLogo className="w-full h-full" />
      </View>
      <LottieView
        source={require("../assets/animation/mcCoffee.json")}
        autoPlay
        loop
        style={{ width: 400, height: 400 }}
      />

      <Pressable
        role="button"
        className="w-full h-[80px] flex justify-center items-center bg-primaryGreen rounded-lg"
        onPress={() => router.push("/(tabs)")}
      >
        <Text className="text-white text-3xl font-bold">Start</Text>
      </Pressable>
    </View>
  );
}

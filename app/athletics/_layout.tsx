import { Stack } from "expo-router";
import { sharedScreenOptions } from "../shared/screenOptions";

export default function AthleticsLayout() {
  return (
    <Stack>
      <Stack.Screen name="list" options={sharedScreenOptions} />
    </Stack>
  );
}

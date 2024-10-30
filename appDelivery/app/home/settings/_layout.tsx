import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{title: "Ver Ajustes", headerShown: true }} />
      <Stack.Screen
        name="inventory"
        options={{ title: "Gestionar inventario", headerShown: true }}
      />
    </Stack>
  );
}

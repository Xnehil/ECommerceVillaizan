import { Stack } from "expo-router";

export default function DeliveryLayout() {
  return (
    <Stack initialRouteName="index">
      <Stack.Screen name="index" options={{title: "Ver Entregas", headerShown: true }} />
      <Stack.Screen
        name="handDeliver"
        options={{ title: "Realizar entrega", headerShown: true }}
      />
      <Stack.Screen
        name="detalles"
        options={{ title: "Detalles de entrega", headerShown: true }}
      />
      <Stack.Screen
          name="confirmada"
          options={{
            presentation: "card",
            title: "Entrega Confirmada",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="cancelada"
          options={{
            presentation: "card",
            title: "Entrega Confirmada",
            headerShown: false,
          }}
        />
    </Stack>
  );
}


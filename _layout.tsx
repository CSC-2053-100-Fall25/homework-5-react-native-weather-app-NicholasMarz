import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Nick's Weather App",
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
        }}
      />

       {/* Detail Screen */}
      <Stack.Screen
        name="CityDetail"
        options={{
          title: "City Details",
          headerStyle: { backgroundColor: '#4CAF50' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 24 },
        }}
      />
    </Stack>
  );
}

// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { LoadingScreen } from "./screens/LoadingScreen";
import { LoginScreen } from "./screens/LoginScreen";
import { DashboardScreen } from "./screens/DashboardScreen";
import { SubjectScreen } from "./screens/SubjectScreen";


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Loading" options= {{headerShown : false}}>
          {props =><LoadingScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Dashboard" options= {{headerShown : false}}>
          {props =><DashboardScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Subject" options= {{headerShown : false}}>
          {props =><SubjectScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Login" options= {{headerShown : false}}>
          {props =><LoginScreen {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
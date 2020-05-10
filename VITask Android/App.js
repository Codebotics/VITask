// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import LoadingScreen from "./screens/LoadingScreen";
import  LoginScreen  from "./screens/LoginScreen";
import  DashboardScreen from "./screens/DashboardScreen";
import { SubjectScreen } from "./screens/SubjectScreen";
import  MoodleScreen from "./screens/MoodleScreen";
import CourseScreen from './screens/CourseScreen'
import { AboutUsScreen } from "./screens/AboutUsScreen";
import GpaCalculator from './screens/GpaCalculator'
import MoodleDisplay from './screens/MoodleDisplay'
import  DrawerContent  from "./screens/Drawer";
import { BetaOver } from "./screens/BetaOver";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function customDrawer(props){
  return (
    <DrawerContent {...props}/>
  )
}

function App() {
  let today = new Date()
  let beta = new Date(2020,4,18)
  let initial = "Login"
  if (today>beta){
    initial = "Beta"
  }
  return (
    <NavigationContainer>
    <Drawer.Navigator drawerContent={customDrawer} drawerStyle={{
      backgroundColor:"#081631"
    }} initialRouteName={initial}>
        <Drawer.Screen name="Login" component={LoginScreen} options={{swipeEnabled:false,gestureEnabled:false}}/>
        <Drawer.Screen name="Loading" component={LoadingScreen}  options={{swipeEnabled:false,gestureEnabled:false}}/>
        <Drawer.Screen name="Dashboard" component={DashboardScreen} />
        <Drawer.Screen name="About" component={AboutUsScreen} />
        <Drawer.Screen name="MoodleLogin" component={MoodleScreen} />
        <Drawer.Screen name="Subject" component={SubjectScreen} />
        <Drawer.Screen name="Courses" component={CourseScreen} />
        <Drawer.Screen name="GpaCalculator" component={GpaCalculator} />
        <Drawer.Screen name="MoodleDisplay" component={MoodleDisplay} />
        <Drawer.Screen name="Beta" component={BetaOver} />

    </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
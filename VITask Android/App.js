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
import  WelcomeScreen  from "./screens/WelcomeScreen";

const Drawer = createDrawerNavigator();

function customDrawer(props){
  return (
    <DrawerContent {...props}/>
  )
}

const LoginStack = createStackNavigator()

const LoginStackScreen = ({navigation})=>(
  <LoginStack.Navigator>
    <LoginStack.Screen name="Login" component={LoginScreen} options={{headerShown:false}} />
    <LoginStack.Screen name="Loading" component={LoadingScreen} options={{headerShown:false}} />
  </LoginStack.Navigator>
)


const DashboardStack = createStackNavigator()

const DashboardStackScreen = ({navigation})=>(
  <DashboardStack.Navigator>
    <DashboardStack.Screen name="Dashboard" component={DashboardScreen} options={{headerShown:false}} />
    <DashboardStack.Screen name="Subject" component={SubjectScreen} options={{headerShown:false}} />
  </DashboardStack.Navigator>
)

const AboutStack = createStackNavigator()

const AboutStackScreen = ({navigation})=>(
  <AboutStack.Navigator>
    <AboutStack.Screen name="About" component={AboutUsScreen} options={{headerShown:false}} />
  </AboutStack.Navigator>
)

const MoodleLoginStack = createStackNavigator()

const MoodleLoginStackScreen = ({navigation})=>(
  <MoodleLoginStack.Navigator>
    <MoodleLoginStack.Screen name="MoodleLogin" component={MoodleScreen} options={{headerShown:false}} drawerNavigate={navigation} />
  </MoodleLoginStack.Navigator>
)

const SubjectStack = createStackNavigator()

const SubjectStackScreen = ({navigation})=>(
  <SubjectStack.Navigator>
    <DashboardStack.Screen name="Subject" component={SubjectScreen} options={{headerShown:false}} />
  </SubjectStack.Navigator>
)

const CourseStack = createStackNavigator()

const CourseStackScreen = ({navigation})=>(
  <CourseStack.Navigator>
    <CourseStack.Screen name="Courses" component={CourseScreen} options={{headerShown:false}} />
    <CourseStack.Screen name="Subject" component={SubjectScreen} options={{headerShown:false}} />
  </CourseStack.Navigator>
)

const GPAStack = createStackNavigator()

const GPAStackScreen = ({navigation})=>(
  <GPAStack.Navigator>
    <GPAStack.Screen name="GpaCalulator" component={GpaCalculator} options={{headerShown:false}} />
  </GPAStack.Navigator>
)

const BetaStack = createStackNavigator()

const BetaStackScreen = ({navigation})=>(
  <BetaStack.Navigator>
    <BetaStack.Screen name="Beta" component={BetaOver} options={{headerShown:false}} />
  </BetaStack.Navigator>
)

function App() {
  let today = new Date()
  let beta = new Date(2020,4,31)
  let initial = "Welcome"
  if (today>beta){
    initial = "Beta"
  }
  return (
    <NavigationContainer>
    <Drawer.Navigator drawerContent={customDrawer} drawerStyle={{
      backgroundColor:"#081631"
    }} initialRouteName={initial}>
        <Drawer.Screen name="Login" component={LoginStackScreen} options={{swipeEnabled:false,gestureEnabled:false}}/>
        <Drawer.Screen name="Welcome" component={WelcomeScreen} options={{swipeEnabled:false,gestureEnabled:false}}/>
        {/* <Drawer.Screen name="Loading" component={LoadingStackScreen}  options={{swipeEnabled:false,gestureEnabled:false}}/> */}
        <Drawer.Screen name="Dashboard" component={DashboardStackScreen} />
        <Drawer.Screen name="About" component={AboutStackScreen} />
        <Drawer.Screen name="MoodleLogin" component={MoodleLoginStackScreen} />
        <Drawer.Screen name="Subject" component={SubjectStackScreen} />
        <Drawer.Screen name="Courses" component={CourseStackScreen} />
        <Drawer.Screen name="GpaCalculator" component={GPAStackScreen} />
        <Drawer.Screen name="MoodleDisplay" component={MoodleDisplay} />
        <Drawer.Screen name="Beta" component={BetaStackScreen} />

    </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
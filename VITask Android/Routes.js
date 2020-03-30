import React from 'react'
import Home from './Home.js'
import Dashboard from './Dashboard.js'
import { Router, Scene } from 'react-native-router-flux'

const Routes = () => (
   <Router>
      <Scene key = "root">
         <Scene key = "home" component = {Home} title = "Home" initial = {true} />
         <Scene key = "dashboard" component = {Dashboard} title = "Dashboard" />
      </Scene>
   </Router>
)
export default Routes
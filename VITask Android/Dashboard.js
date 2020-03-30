import React, { Component } from 'react'
import { AsyncStorage, View, Text, TouchableOpacity, StyleSheet } from 'react-native'

export default class Dashboard extends Component {
   state = {
      Name: '',
      School: '',
      Branch: '',
      Program: '',
      RegNo: '',
      AppNo: '',
      Email: '',
      ProctorEmail: '',
      ProctorName: '',
      APItoken: '',
      hide: 'true',
      details: 'Show Details'
   }
   updateState = (hide) => AsyncStorage.getItem('JSON').then((value) => {
      if(hide=='true')
      {
         let resObject = JSON.parse(value)
         this.setState({ 'Name': 'Name: '+ resObject.Name, 'School': 'School: '+ resObject.School, 'Branch': 'Branch: ' + resObject.Branch, 'Program': 'Program: ' + resObject.Program, 'RegNo': 'Registration Number: ' + resObject.RegNo, 'AppNo': 'Application Number: ' + resObject.AppNo, 'Email': 'Email: ' + resObject.Email, 'ProctorEmail': 'Proctor Email: ' + resObject.ProctorEmail, 'ProctorName': 'Proctor Name: ' + resObject.ProctorName, 'APItoken': 'API Token: ' + resObject.APItoken, 'hide': 'false', 'details': 'Hide Details'})
      }
      else if(hide=='false')
      {
         this.setState({ 'Name': '', 'School': '', 'Branch': '', 'Program': '', 'RegNo': '', 'AppNo': '', 'Email': '', 'ProctorEmail': '', 'ProctorName': '', 'APItoken': '', 'hide': 'true', 'details': 'Show Details'})
      }
      
      
   })
   render() {
   return (
      <View style={styles.container}>
         <View style= {styles.card}>
            <TouchableOpacity
               style = {styles.Button}
               onPress = {() => this.updateState(this.state.hide)}>
               <Text style = {{color: '#ffffff', fontWeight: "bold"}}> {this.state.details} </Text>
            </TouchableOpacity>
             <Text style = {styles.show}>
                {this.state.Name}
             </Text>
             <Text style = {styles.show}>
                {this.state.School}
             </Text>
             <Text style = {styles.show}>
                {this.state.Branch}
             </Text>
             <Text style = {styles.show}>
                {this.state.Program}
             </Text>
             <Text style = {styles.show}>
                {this.state.RegNo}
             </Text>
             <Text style = {styles.show}>
                {this.state.AppNo}
             </Text>
             <Text style = {styles.show}>
                {this.state.Email}
             </Text>
             <Text style = {styles.show}>
                {this.state.ProctorEmail}
             </Text>
             <Text style = {styles.show}>
                {this.state.ProctorName}
             </Text>
             <Text style = {styles.show}>
                {this.state.APItoken}
             </Text>
          </View>
      </View>
   )}
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: '#282828'
   },
   card: {
      backgroundColor: '#f54254',
      borderColor: '#ffffff',
      borderWidth: 2,
      borderRadius: 5,
      height: 500
   },
  show: {
      height: 40,
      width: 380,
      color: '#ffffff',
      fontWeight: "bold",
      marginLeft: 20
  },
  Button: {
      backgroundColor: '#a32c38',
      padding: 10,
      margin: 15,
      height: 40,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: '#ffffff',
      justifyContent: 'center',
      alignItems: 'center'
   }
})
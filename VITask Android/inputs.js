import React, { Component } from 'react'
import { AsyncStorage, View, Text, TouchableOpacity, TextInput, StyleSheet} from 'react-native'
import { Actions } from 'react-native-router-flux';

class Inputs extends Component {
   state = {
      regno: '',
      password: '',
      captcha: '',
      data: ''
   }
   handleRegno = (text) => {
      this.setState({ regno: text })
   }
   handlePassword = (text) => {
      this.setState({ password: text })
   }
   login = (regno, pass) => {
         var url =  `http://10.0.2.2:5000/authenticate?username=`+regno+`&password=`+pass;
         fetch(url, {
            method: 'GET'
         })
         .then((response) => response.json())
         .then((responseJson) => {
            console.log(responseJson);
            AsyncStorage.setItem('JSON', JSON.stringify(responseJson))
            .then(() => { 
            Actions.dashboard();
            });
            
         })
         .catch((error) => {
            console.error(error);
         });
   }
   render() {
      return (
         <View style = {styles.container}>
            <View>
               <TextInput style = {styles.input}
                  underlineColorAndroid = "transparent"
                  placeholder = "Registration Number"
                  placeholderTextColor = "#ffffff"
                  autoCapitalize = "none"
                  textAlign = "left"
                  onChangeText = {this.handleRegno}/>
            </View>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               placeholderTextColor = "#ffffff"
               autoCapitalize = "none"
               textAlign = "left"
               secureTextEntry= {true}
               password = {true}
               onChangeText = {this.handlePassword}/>
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.login(this.state.regno, this.state.password)
               }>
               <Text style = {styles.submitButtonText}> LOGIN </Text>
            </TouchableOpacity>
         </View>
      )
   }
}
export default Inputs


const styles = StyleSheet.create({
   container: {
      paddingTop: -20,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
   },
   input: {
      margin: 15,
      height: 40,
      width: 300,
      borderColor: 'rgba(255, 65, 108,0.99)',
      borderWidth: 2,
      borderRadius: 5,
      backgroundColor: 'rgba(255, 65, 108,0.99)',
      color: '#ffffff',
      fontWeight: 'bold',
      paddingLeft: 20,
      shadowColor: '#000000',
      shadowOffset: { width: 20, height: 20 },
      shadowOpacity: 0.9,
      shadowRadius: 20,  
      elevation: 5
   },
   submitButton: {
      backgroundColor: 'rgba(32,40,48,0.9)',
      padding: 10,
      margin: 15,
      height: 45,
      width: 100,
      borderRadius: 5,
      borderWidth: 2,
      borderColor: 'rgba(32,40,48,0.9)',
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000000',
      shadowOffset: { width: 20, height: 20 },
      shadowOpacity: 0.9,
      shadowRadius: 20,  
      elevation: 10
   },
   submitButtonText:{
      color: 'white',
      fontWeight: "bold"
   }
})
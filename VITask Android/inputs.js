import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet} from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Captcha from './captcha.js'

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
   handleCaptcha = (text) => {
      this.setState({ captcha: text })
   }
   login = (regno, pass, captcha) => {
         var url =  `http://10.0.2.2:5000/authenticate?username=`+regno+`&password=`+pass+`&captcha=`+captcha;
         fetch(url, {
            method: 'GET'
         })
         .then((response) => response.json())
         .then((responseJson) => {
            console.log(responseJson);
            this.setState({
               data: responseJson
            });
            alert('Name: ' + this.state.data.Name + ' Branch: ' + this.state.data.Branch)
         })
         .catch((error) => {
            console.error(error);
         });
   }
   render() {
      return (
         <View style = {styles.container}>
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Registration Number"
               placeholderTextColor = "#ffffff"
               autoCapitalize = "none"
               textAlign = "center"
               onChangeText = {this.handleRegno}/>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Password"
               placeholderTextColor = "#ffffff"
               autoCapitalize = "none"
               textAlign = "center"
               secureTextEntry= {true}
               password = {true}
               onChangeText = {this.handlePassword}/>

            <Captcha />

            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Captcha"
               placeholderTextColor = "#ffffff"
               autoCapitalize = "none"
               textAlign = "center"
               onChangeText = {this.handleCaptcha}/>
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.login(this.state.regno, this.state.password, this.state.captcha)
               }>
               <Text style = {styles.submitButtonText}> Login </Text>
            </TouchableOpacity>
         </View>
      )
   }
}
export default Inputs

const styles = StyleSheet.create({
   container: {
      paddingTop: 23
   },
   input: {
      margin: 15,
      height: 40,
      width: 300,
      borderColor: '#ffffff',
      borderWidth: 1,
      borderRadius: 5,
      backgroundColor: '#f54254',
      color: '#ffffff'
   },
   submitButton: {
      backgroundColor: '#f54254',
      padding: 10,
      margin: 15,
      height: 40,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center'
   },
   submitButtonText:{
      color: 'white'
   }
})
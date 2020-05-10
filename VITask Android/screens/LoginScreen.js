import React, { Component } from 'react'
import { View, StyleSheet, ToastAndroid, Linking, Image,ScrollView,AsyncStorage } from 'react-native'
import { Headline,  TextInput, Button, Subheading, ActivityIndicator} from "react-native-paper";
import * as Animatable from "react-native-animatable"


class LoginScreen extends Component {
    state = {
        text : "",
        password : ""
    }
    constructor(props){
        super(props)
    }
    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem('VITask_user');
          console.log(value)
          const user_obj = JSON.parse(value)
          if (user_obj.status == 1) {
            this.props.navigation.navigate("Loading", {username: user_obj.regno, password: user_obj.password})

          }
        //   else{
//else for splash Screen
        //   }
        } catch (error) {
             console.log(error)
        }
      }
      

    UNSAFE_componentWillMount(){
        console.log('inside Component will mount of Login')

          this._retrieveData();
    }
    _storeData = async (reg , pass , status) => {
        let user_obj = {
          regno : reg ,
          password : pass,
          status : status
        }
        console.log("Storing data in ASYNC")
        try {
          await AsyncStorage.setItem('VITask_user', JSON.stringify(user_obj));
        } catch (error) {
          // Error saving data
          console.log(error)
          await AsyncStorage.setItem('VITask_user', JSOn.stringify({
            email : '',
            password :'',
            status : 0
          }))
        }
      };
    checkAndProceed(){
        if(this.state.text=== ''){
            ToastAndroid.show("Please Enter Registration Number to proceed", ToastAndroid.SHORT)
        }
        else if(this.state.password === ""){
            ToastAndroid.show("Please Enter Password to proceed", ToastAndroid.SHORT)
        }
        else{
            this._storeData(this.state.text,this.state.password,1)
            this.props.navigation.navigate("Loading", {username: this.state.text, password: this.state.password})
        }
    }
    //TODO: Use regex statement for checking registration number
    render() {
        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
            <View style={styles.view}>
            <Animatable.View animation="fadeIn" easing="ease-out" duration={1500}>
                <Image
                    style = {{marginBottom:"5%"}}
                    source = {require("../assests/favicon.png")} 
                 />
            </Animatable.View>
            <Animatable.View animation="fadeIn" easing="ease-out" delay={500} duration={1500}>

                 <Subheading style={{paddingTop:"10%", paddingBottom:"3%", fontSize:20, color:"#BBB"}}>Proceed with your</Subheading>
                 <Headline style={{fontSize:30, color:"white"}}>VTOP Credentials</Headline>
            </Animatable.View>
            
                 <View style={{marginTop:"30%"}}>
                <Animatable.View animation="fadeIn" easing="ease-out" delay={1000} duration={1500}>
                    
                     <TextInput 
                        label="Registration Number" 
                        mode="outlined" 
                        theme={{
                         colors:{
                            primary:"#A7C0F1",
                            text:"white",
                            placeholder:"#A7C0F1"
                         }}} 
                        onChangeText={text=>this.setState({text})} 
                        value={this.state.text}
                        style={{
                            backgroundColor:"#22365d",
                            borderColor:"white"}} />
                    </Animatable.View>
                    <Animatable.View animation="fadeIn" easing="ease-out" delay={1200} duration={1500}>
                    
                     <TextInput 
                     label="Password" 
                     style={{marginTop:"5%"}} 
                     mode="outlined" 
                     theme={{
                         colors:{
                             primary:"#A7C0F1", 
                             placeholder:"#A7C0F1",
                             text:"white"
                        }}} 
                    textContentType="password"
                    secureTextEntry={true}
                    onChangeText={password=>this.setState({password})} 
                    value={this.state.password} 
                    style={{
                            backgroundColor:"#22365d",
                            borderColor:"white",
                        }}/>
                     <Button style={{marginTop:"5%", width:"40%", alignSelf:"center"}} mode="contained" color="#f90024" onPress={()=>{this.checkAndProceed()}}>Login</Button>
                 </Animatable.View>
                 </View>
            </View>
            </ScrollView>
        )
    }
}


export default LoginScreen

const styles = StyleSheet.create({
    view : {
        margin : "10%",
        marginTop:"17%",
    },
    textbox : {
        marginTop : "5%",
        marginRight : "10%",   
    },
    button : {
        marginVertical : "5%",
        marginHorizontal : "30%"
    },
    continue : {
        width : 70,
        height : 70,
        borderRadius : 70/ 2,
        backgroundColor : "#9075E3",
        alignItems : "center",
        justifyContent : "center",
        backgroundColor : "#4A00E0"
    },
    linearGradient: {
        flex: 1,
        borderRadius: 0
      },
      justifySpaceRow:{ 
        flexDirection: 'row', 
        justifyContent:"space-around", 
        marginTop:"2%",
        marginBottom:"10%"
    },
    logo:{
        width:50,
        height:50
    }
})

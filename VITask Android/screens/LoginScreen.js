import React, { Component } from 'react'
import { View, StyleSheet, ToastAndroid, Linking, Image } from 'react-native'
import { Headline,  TextInput,  Card, Caption, Button, Subheading} from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

export class LoginScreen extends Component {
    state = {
        text : "",
        password : ""
    };
    checkAndProceed(){
        if(this.state.text=== ''){
            ToastAndroid.show("Please Enter Registration Number to proceed", ToastAndroid.SHORT)
        }
        else if(this.state.password === ""){
            ToastAndroid.show("Please Enter Password to proceed", ToastAndroid.SHORT)
        }
        else{
            this.props.navigation.navigate("Loading")
        }
    }
    //TODO: Use regex statement for checking registration number
    render() {
        return (
            <View style={styles.view}>
                <Image
                    style = {{marginBottom:"5%"}}
                    source = {require("../favicon.png")} 
                 />
                 <Subheading style={{paddingTop:"10%", paddingBottom:"3%", fontSize:20, color:"gray"}}>Proceed with your</Subheading>
                 <Headline style={{fontSize:30}}>VTOP Credentials</Headline>
                 <View style={{marginTop:"30%"}}>
                     <TextInput label="Registration Number" mode="outlined" theme={{colors:{primary:"#f90024"}}} onChangeText={text=>this.setState({text})} value={this.state.text} />
                     <TextInput label="Password" style={{marginTop:"5%"}} mode="outlined" theme={{colors:{primary:"#f90024"}}} onChangeText={password=>this.setState({password})} value={this.state.password}/>
                     <Button style={{marginTop:"5%", width:"40%", alignSelf:"center"}} mode="contained" color="#f90024" onPress={()=>{this.checkAndProceed()}}>Login</Button>
                 </View>
            </View>
        )
    }
}

export default LoginScreen

const styles = StyleSheet.create({
    view : {
        margin : "10%",
        marginTop:"17%"
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

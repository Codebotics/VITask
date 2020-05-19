import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet, ToastAndroid,StatusBar } from 'react-native'
import { Caption, Subheading, Headline, TextInput, Button, ActivityIndicator } from "react-native-paper";
import  Icon  from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable"
import { connect } from 'react-redux';
import {moodleLogin} from "../actions/actions"

class MoodleScreen extends Component {
    state={
        password:"",
        display:"none"
    }
    textInput = null;
    loading = null
    checkAndProceed(){
        if (this.state.password===""){
            ToastAndroid.show("Enter Password", ToastAndroid.SHORT)
        }
        else{
            this.textInput.fadeOutDown(500)
            .then(endState=>{
            this.setState({
                display:"flex"
            })
            this.loading.fadeIn(800)
            this.props.loginMoodle(this.state.password)
        })
        }
    }
    componentDidUpdate(prevProps){
        if(prevProps.state.status !== this.props.state.status){
            const { state } = this.props
            if(state.status === "LOGIN_MOODLE_SUCCESS"){
                // Moodle fetch complete
                ToastAndroid.show("Logged into Moodle", ToastAndroid.SHORT)
                this.props.navigation.jumpTo("Dashboard")
            }else if(state.status == "ERROR"){
                ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
                this.props.navigation.jumpTo("Dashboard") 
            }
        }
    }
    render() {
        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
            <StatusBar backgroundColor="#081631" />
            <View style={styles.view}>
            <View>
                <Subheading style={{ paddingBottom:"3%", fontSize:20, color:"#BBB"}}>Sign In</Subheading>
                 <Headline style={{fontSize:30, color:"white"}}>Moodle</Headline>
                <Caption style={{color:"white", paddingTop:"3%"}}>Leave all the extra work to us</Caption>
            </View>
            <View style={{paddingTop:"3%"}}>
            <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop:"10%",marginBottom:"4%"}}>
                <Icon name="assignment" size={20} style={{color:"#00e6ac"}} />
                <Caption style={{color:"#00e6ac", paddingLeft:"4%"}}>See all your Moodle Assignments</Caption>
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop:"3%",marginBottom:"4%"}}>
                <Icon name="remove-circle" size={20} style={{color:"#00e6ac"}} />
                <Caption style={{color:"#00e6ac", paddingLeft:"4%"}}>Remove Extra assignments that are not yours</Caption>
            </View>
            <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginTop:"3%",marginBottom:"4%"}}>
                <Icon name="assignment-late" size={20} style={{color:"#00e6ac"}} />
                <Caption style={{color:"#00e6ac", paddingLeft:"4%"}}>Recieve Notifications when assignments are due</Caption>
            </View>
            <Animatable.View style={{flexDirection: "row", justifyContent: "center", alignItems: "center", marginTop:"20%",marginBottom:"4%", display:this.state.display}} ref={ref => this.loading = ref}>
                    <ActivityIndicator color="#f90024"/><Text style={{color:"white", paddingLeft:"5%"}}> Aligning Planets in order</Text>
            </Animatable.View>
            <Animatable.View style={{paddingTop:"7%"}} ref={ref => this.textInput = ref}>
                        <Caption style={{color:"white", paddingVertical:"5%"}}>You will be Signed as {this.props.state.userInfo.Name+" "+this.props.state.userInfo.RegNo }</Caption>
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
                     <Button style={{marginTop:"5%", width:"40%", alignSelf:"flex-end"}} mode="contained" color="#f90024" onPress={()=>{this.checkAndProceed()}}>Continue</Button>
                    
            </Animatable.View>
            
            </View>
            </View>
            </ScrollView>
        )
    }
}
function mapStateToProps(state){
    return {
        state: state.reducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loginMoodle:(password)=>{
            dispatch(moodleLogin(password))
        }
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(MoodleScreen)

const styles = StyleSheet.create({
    view : {
        margin : "10%",
        marginTop:"15%",
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
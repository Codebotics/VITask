import React, { Component } from 'react'
import {View, Image, TouchableWithoutFeedback,ToastAndroid } from 'react-native'
import {Caption} from 'react-native-paper'
import * as Animatable from  'react-native-animatable'
import {connect} from 'react-redux'
import {
    loginVTOP,
    fetchAttendance,
    fetchTimetable,
    reformatData,
    fetchMarks,
    fetchMoodleAssignments,
    fetchAcadHistory
} from '../actions/actions'

class LoadingScreen extends Component {
    state = {
        text : "Wandering in the dungeons of VTOP",
        token : "",
        name : "",
        process: "",
        profile : {},
        timetable : {},
        attendance:{}
    }
    checkAndProceed(){
        if(this.state.process === "Click on above logo to continue."){
            this.props.navigation.navigate("Dashboard")
        }
    }
    handleLogoRef = ref => this.logo = ref
    handleTextRef = ref => this.text = ref
    handleProcessRef = ref => this.process = ref
    componentDidMount(){
        console.log(this.props.route.params)
        // First call login function
        // Change the dummy api calls in the ./actions/actions.js
        this.props.login(this.props.route.params.username, this.props.route.params.password)
    }
    componentDidUpdate(prevProps){
        if(prevProps.state.status !== this.props.state.status){
            const { state } = this.props
            if(state.status === "ERROR"){
                // SOME ERROR OCCURED
                if(state.error === "Password / Username Incorrect"){
                    ToastAndroid.show("Password/ Registration Number is incorrect", ToastAndroid.LONG)
                    this.props.navigation.navigate("Login", {error: "Password Incorrect"})
                }
                else {
                    // Connection error or Server Error
                    ToastAndroid.show("Something went wrong", ToastAndroid.SHORT)
                    this.setState({
                        text: "Oops! This was not supposed to happen. ",
                        process: "Please check your Internet Connection and try again"
                    })
                    this.logo.stopAnimation()
                    this.text.stopAnimation()
                    this.process.stopAnimation()
                }
            }
            else if (state.status === "VTOP_COMPLETE" && this.state.process !== "Getting your Timetable."){
                // After authenticating, call the timetable function
                this.props.getTimetable()
                let greetMsg = `Welcome ${state.userInfo.Name}.`
                this.setState({
                    name:state.userInfo.Name,
                    text : greetMsg,
                    process:"Getting your Timetable.",
                })
            }
            else if (state.status === "TIMETABLE_COMPLETE" && this.state.process !== "Getting your Attendances"){
                // Timetable complete, call the attendance api
                this.props.getAttendance()
                this.props.getMarks()
                this.props.getMoodle()
                this.props.getAcadHistory()
                this.setState({
                    text:"And before we forget...",
                    process: "Getting your Attendance"
                })
            }
            else if (state.status === "ATTENDANCE_COMPLETE"){
                // Attendance complete call the reformat api
                this.props.reformat()
            }
            else if (state.status === "FORMAT_COMPLETE"){
            let greetMsg = `Welcome ${state.userInfo.Name}. VITask is at your service`
            this.setState({
                text:greetMsg,
                process: "Click on above logo to continue."
            })
            }
        }
    }
    render() {
        let image = (
            <View style={{
                flexWrap:"wrap",
            }}>
            <TouchableWithoutFeedback onPress={()=>{this.checkAndProceed()}}>
                <Image
                style={{width:90,height:90}}
                source = {require("../assests/favicon.png")} 
                />
            </TouchableWithoutFeedback>
            </View>
        )
        return (
            <View style={{backgroundColor:"#081631", width:"100%", height:"100%", flexDirection:"column",justifyContent:"space-around"}}>
                <View>
                <View style={{
                    flexDirection:"row", 
                    justifyContent:"space-around", 
                    }}>
                        <Animatable.View
                            ref = {this.handleLogoRef}
                            animation="fadeIn"
                            duration={1500} 
                            easing="ease-out" 
                            iterationCount="infinite" 
                            style={{
                                padding:"5%", 
                                backgroundColor:"#FFF",
                                borderRadius:1000,
                                }}
                            >
                            {image}
                </Animatable.View>
                            
                            
                </View>
                            <Animatable.Text
                            ref = {this.handleTextRef}
                            animation="fadeIn"
                            duration={1500} 
                            easing="ease-out" 
                            iterationCount="infinite" 
                            style={{
                                paddingTop:"5%", 
                                borderRadius:1000,
                                flexWrap:"wrap",
                                textAlign:"center",
                                color:"#EEE",
                                marginTop:"3%",
                                paddingHorizontal:"20%"
                                }}
                            >
                            <Caption style={{color:"#EEE"}}>{this.state.text}</Caption>
                            </Animatable.Text>
                            <Animatable.Text 
                            ref = {this.handleProcessRef}
                            animation="fadeIn"
                            duration={1500} 
                            easing="ease-out" 
                            iterationCount="infinite" 
                            style={{ 
                                borderRadius:1000,
                                flexWrap:"wrap",
                                textAlign:"center",
                                color:"#EEE",
                                marginTop:"3%",
                                paddingHorizontal:"20%"
                                }}
                            >
                            <Caption style={{color:"#EEE"}}>{this.state.process}</Caption>
                            </Animatable.Text> 
                </View>
            </View>
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
      login: (username, password) => {
        dispatch(loginVTOP(username, password))
      },
      getAttendance: ()=>{
          dispatch(fetchAttendance())
      },
      getTimetable: ()=>{
          dispatch(fetchTimetable())
      },
      getMarks:()=>{
        dispatch(fetchMarks())
      },
      getMoodle:()=>{
        dispatch(fetchMoodleAssignments())
      },
      getAcadHistory:()=>{
          dispatch(fetchAcadHistory())
      },
      reformat: ()=>{
          dispatch(reformatData())
      }
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)

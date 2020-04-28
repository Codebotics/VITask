import React, { Component } from 'react'
import {View, Image, TouchableWithoutFeedback,ToastAndroid } from 'react-native'
import {Caption} from 'react-native-paper'
import * as Animatable from  'react-native-animatable'
import {connect} from 'react-redux'
import {
    loginVTOP,
    fetchAttendance,
    fetchTimetable
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
            this.props.navigation.navigate("Dashboard", {
                profile : this.state.profile,
                timetable: this.state.timetable,
                attendance: this.state.attendance,
                moodle : {}
            })
        }
    }
    handleLogoRef = ref => this.logo = ref
    handleTextRef = ref => this.text = ref
    handleProcessRef = ref => this.process = ref
    async getAuth(username, password){
        let response = await fetch(`https://vitask.me/authenticate?username=${username}&password=${password}`)
        let json = await response.json()
        return json
    }
    async getTimetable(){
        let response = await fetch("https://vitask.me/timetableapi?token=MjAxNzAyNjk1NA==")
        let json = await response.json()
        return json
    }
    async getAttendance(){
        let response = await fetch("https://vitask.me/classesapi?token=MjAxNzAyNjk1NA==")
        let json = await response.json()
        return json
    }
    // async componentDidMount(){
    //     try{
    //         let api = await this.getAuth(this.props.route.params.username, this.props.route.params.password)
    //         if(api.Error){
    //         // Error occured and password incorrect
    //         ToastAndroid.show("Password/ Registration Number is incorrect", ToastAndroid.LONG)
    //         this.props.navigation.navigate("Login", {"Error":"Password"})
    //         }
    //         let greetMsg = `Welcome ${api.Name}.`
    //         this.setState({
    //             token:api.APItoken,
    //             name:api.Name,
    //             text : greetMsg,
    //             process:"Getting your Timetable.",
    //             profile : api
    //         })
    //         let timetable = await this.getTimetable()
    //         this.setState({
    //             text:"And before we forget...",
    //             process: "Getting your Attendance",
    //              timetable: timetable
    //         })
    //         let attendance = await this.getAttendance()
    //         greetMsg = `Welcome ${api.Name}. VITask is at your service`
    //         // While changing process statement below make sure to change checkAndProceed also
    //         this.setState({
    //             text: greetMsg,
    //             process:"Click on above logo to continue.",
    //         // While changing process statement below make sure to change checkAndProceed also
    //             attendance: attendance
    //         })
    //         this.logo.stopAnimation()
    //         this.text.stopAnimation()
    //         this.process.stopAnimation()
    //     }
    //     catch(err){
    //         this.setState({
    //             text: "Oops! This was not supposed to happen. ",
    //             process: "Please check your Internet Connection and try again"
    //         })
    //     }
        
        
    // }
    componentDidMount(){
        // First call login function
        // this.props.login('17BEC1162', 'tempPass123@')
        // console.log(this.props)
    }
    componentDidUpdate(){
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
        else if (state.status === "VTOP_COMPLETE"){
            // After authenticating, call the timetable function
            let greetMsg = `Welcome ${state.userInfo.Name}.`
            this.setState({
                name:state.userInfo.Name,
                text : greetMsg,
                process:"Getting your Timetable.",
            })
            this.props.getTimetable()
        }
        else if (state.status === "TIMETABLE_COMPLETE"){
            // Timetable complete, call the attendance api
            this.setState({
                text:"And before we forget...",
                process: "Getting your Attendance"
            })
            this.props.getAttendance()
        }
        else if (state.status === "ATTENDANCE_COMPLETE"){
            // Attendance complete call the reformat api
            
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
      }
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)

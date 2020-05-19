import React, { Component } from 'react'
import {View, Image, TouchableWithoutFeedback,ToastAndroid, AsyncStorage,StatusBar } from 'react-native'
import {Caption} from 'react-native-paper'
import * as Animatable from  'react-native-animatable'
import {connect} from 'react-redux'
import {
    // loginVTOP,
    // fetchAttendance,
    // fetchTimetable,
    // reformatData,
    // fetchMarks,
    // fetchMoodleAssignments,
    // fetchAcadHistory,
    storeState,
    getToken,
    firstTimetable,
    firstAttendance,
    firstMarks,
    firstHistory,
    reformatData,
    storeRedux
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
            this.props.navigation.jumpTo("Dashboard")
        }
    }
    handleLogoRef = ref => this.logo = ref
    handleTextRef = ref => this.text = ref
    handleProcessRef = ref => this.process = ref
    componentDidMount(){
        // First call login function
        // Change the dummy api calls in the ./actions/actions.js
        console.log(this.props.route.params.username, this.props.route.params.password)
        this.props.login(this.props.route.params.username, this.props.route.params.password)
    }
    storeStateIntoRedux = async (reduxState , reduxStatus) => {
       let reduxObj = {
           reduxState : reduxState,
           reduxStatus : reduxStatus
       } 
       console.log("Storing Redux State data in ASYNC",reduxObj)
       try {
        await AsyncStorage.setItem('VITask_reduxState', JSON.stringify(reduxObj));
      } catch (error) {
        // Error saving data
        console.log(error)
        await AsyncStorage.setItem('VITask_user', JSON.stringify({ //Yash will see this after beta (reminder)
            reduxState : reduxState,
            reduxStatus : 0
        }))
      }

    }

    _retrieveRedux = async () => {
        console.log("Retirve called")
        try {
          const value = await AsyncStorage.getItem('VITask_reduxState');
          console.log("FROM REDUX ASYNC",value)
          const reduxObj = JSON.parse(value)
          if (reduxObj.reduxStatus == 1) {
            this.props.storeState(reduxObj.reduxState)
            this.props.navigation.jumpTo("Dashboard")
            // console.warn("dkljshbffffffffffffffffffffffffffffffffffffffffffffk")
          }
        //   else{
//else for splash Screen
        //   }
        } catch (error) {
             console.log(error)
        }
      }
    //   UNSAFE_componentWillMount(){
          
    //     //   this._retrieveRedux()
    //   }

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
                    this.props.navigation.navigate("Login", {error: "Something went Wrong! Please, try again."})

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
                // Marks and acadhistory can be updated 
                this.setState({
                    text:"And before we forget...",
                    process: "Getting your Attendance"
                })
            }
            else if (state.status === "ATTENDANCE_COMPLETE" && this.state.process !== "Getting your Marks"){
                this.props.getMarks()
                this.setState({
                    text:"Something we all hate...",
                    process: "Getting your Marks"
                })
            }
            else if (state.status === "MARKS_COMPLETE" && this.state.process !== "Getting your Academic History"){
                this.props.getAcadHistory()
                this.setState({
                    text:"We all are haunted by our past...",
                    process: "Getting your Academic History"
                })
            }
            else if (state.status === "ACADHISTORY_COMPLETE"){
                // Attendance complete call the reformat api
                this.props.reformat()
            }
            else if (state.status === "FORMAT_COMPLETE"){
            let greetMsg = `Welcome ${state.userInfo.Name}. VITask is at your service`
            this.setState({
                text:greetMsg,
                process: "Click on above logo to continue."
            })
            this.logo.stopAnimation()
            this.text.stopAnimation()
            this.process.stopAnimation()
            console.log("LOADINGSCREEN" , this.props.state)
            this.storeStateIntoRedux(this.props.state , 1)
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
                <StatusBar backgroundColor="#081631" />
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
        dispatch(getToken(username, password))
      },
      getAttendance: ()=>{
          dispatch(firstAttendance())
      },
      getTimetable: ()=>{
          dispatch(firstTimetable())
      },
      getMarks:()=>{
        dispatch(firstMarks())
      },
      getAcadHistory:()=>{
          dispatch(firstHistory())
      },
      reformat: ()=>{
          dispatch(reformatData())
      },
      storeState: (rState)=>{
          dispatch(storeState(rState))
      }
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)

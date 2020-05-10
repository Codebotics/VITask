import React, { Component } from 'react'
import {  View, ScrollView,TouchableOpacity } from 'react-native'
import PushNotification from 'react-native-push-notification'
import { Headline, Caption } from "react-native-paper";
import Timetable from '../components/Timetable/Timetable'
import { connect } from 'react-redux';
import LastSync  from "../components/LastSync/LastSync";


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const date = new Date()
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
// const today = days[date.getDay()]
// Just for Testing
const today = "Thursday"
class DashboardScreen extends Component {
    state = {
        day: today,
        timetable : this.props.state.timetable[today],
        totalClass:0,
        totalLab:0
    }
    
    
    componentDidMount(){
        let totalClass = 0
        let totalLab = 0
        for(classes of this.state.timetable){
            if (classes['slot'][0]!=="L"){
                totalClass++;
            }
            else{
                totalLab++;
            }
        }
        this.setState({
            totalClass,
            totalLab
        })
    }


    render() {
        let  moodleLogin = false

        let timetable=[]
        // Sample String
        // var dateString = days[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() + " " + "1:40:30 GMT+0530"
        
        // Constant part of string
        var dateString = days[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear()
        for(let i=0;i<this.state.timetable.length;++i){
            timetable.push(
                <Timetable
                    slot = {this.state.timetable[i]['slot']}
                    time = {`${this.state.timetable[i]['startTime']} - ${this.state.timetable[i]['endTime']}`}
                    key = {i}
                    showMoodle = {moodleLogin}
                    isLab = {this.state.timetable[i]['slot'][0] === 'L'}
                    navigation = {this.props.navigation}
                />
            )
            // spliting time from ":"
            var timeSplit = this.state.timetable[i]['startTime'].split(':')
            // converting time to integer for further calculations
            var time = parseInt(timeSplit[0])

            if(time == 8 || time == 9 || time == 10 || time == 11 || time == 12){
            var dateStringSchedule = dateString + " " + this.state.timetable[i]['startTime'] +" GMT+0530"
            }else{
                time = time+12
                time = time.toString()
                var dateStringSchedule = dateString + " " + time + ":" + timeSplit[1] +" GMT+0530"
                console.log(dateStringSchedule)
            }

            // Scheduling Notifications
            // PushNotification.localNotificationSchedule({
            //     autoCancel: true,
            //     bigText:"Upcoming Class",
            //     subText: this.state.timetable[i]['slot'],
            //     title:"you have class in slot " + this.state.timetable[i]['slot'] + " at time " + this.state.timetable[i]['startTime'] + " - " + this.state.timetable[i]['endTime'],
            //     message:"",
            //     vibrate: true,
            //     vibration: 300,
            //     playSound: true,
            //     soundName: 'default',
            //     actions: '["Yes", "No"]',
            //     date : new Date(dateStringSchedule)
            //   })
            }

        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
            <View style={{backgroundColor:"#081631"}}>
                <View style={{padding:"5%", paddingTop:"10%", height:"100%"}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.navigate('MoodleDisplay')}>
                <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"2%", fontFamily:"ProductSans", color:"#FFF"}}>{this.state.day}</Headline></TouchableOpacity>
                    <Caption style={{paddingLeft:"5%", paddingTop:"1%", color:"#FFF"}}>You have {this.state.totalClass} classes and {this.state.totalLab} labs</Caption>
                    <Caption style={{paddingLeft:"5%", paddingTop:"1%", marginBottom:"5%", color:"#FFF"}}>Login Moodle to show assignments</Caption>
                    {timetable}
                    <LastSync/>
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
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(DashboardScreen)

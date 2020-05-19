import React, { Component } from 'react'
import {  View, ScrollView,TouchableOpacity, Alert,StatusBar } from 'react-native'
import PushNotification from 'react-native-push-notification'
import { Headline, Caption } from "react-native-paper";
import Timetable from '../components/Timetable/Timetable'
import { connect } from 'react-redux';
import LastSync  from "../components/LastSync/LastSync";


const days = ['Monday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Monday']
const date = new Date()
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const today = days[date.getDay()]
// Just for Testing
// const today = "Thursday"
class DashboardScreen extends Component {

    componentDidMount(){
        console.log("DashBoard" , this.props.state)
    }
    state = {
        day: today,
        timetable : this.props.state.timetable[today],
        totalClass:0,
        totalLab:0
    }
    
    createTwoButtonAlert = () =>
    Alert.alert(
      "Disclaimer",
      `
      This is the beta version of VITask. As you would know, beta versions are usually unstable and may be trouble to use. But don't worry, if you face any problem we are happy to help.
    
      Note that this version will expire on 31 May 2020. After that use Google Playstore to download the app.

      Also, congrats! you get to test the latest VITask app. If you have any queries or feedback hit us up on instagram @vitask.me
      `,
      [
        { text: "I understand", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    );
    componentDidMount(){
        this.createTwoButtonAlert()
        let totalClass = 0
        let totalLab = 0
        // for(classes of this.state.timetable){
        //     if (classes['slot'][0]!=="L"){
        //         totalClass++;
        //     }
        //     else{
        //         totalLab++;
        //     }
        // }
        // this.setState({
        //     totalClass,
        //     totalLab
        // })
    }


    render() {
        let  moodleLogin = false
    //     // PushNotification.cancelAllLocalNotifications()

        let timetable=[]
    //     // Sample String
    //     // var dateString = days[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear() + " " + "1:40:30 GMT+0530"
        
    //     // Constant part of string
    //     var dateString = days[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + " " + date.getFullYear()
        console.log(this.state.timetable)
        for(let i=0;i<this.state.timetable.length;++i){
            console.log(this.state.timetable[i])
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
            }
    //         // spliting time from ":"
    //         var timeSplit = this.state.timetable[i]['startTime'].split(':')
    //         // converting time to integer for further calculations
    //         var time = parseInt(timeSplit[0])

    //         if(time == 8 || time == 9 || time == 10 || time == 11 || time == 12){
    //         var dateStringSchedule = dateString + " " + this.state.timetable[i]['startTime'] +" GMT+0530"
    //         }else{
    //             time = time+12
    //             time = time.toString()
    //             var dateStringSchedule = dateString + " " + time + ":" + timeSplit[1] +" GMT+0530"
    //             console.log(dateStringSchedule)
    //         }

    //         var count = new Date(dateStringSchedule).getTime();
    //         var now = new Date().getTime();
    //         var d = count - now;

    //         var dayss = Math.floor(d/(1000*60*60*24));
    //         var hours = Math.floor((d%(1000*60*60*24))/(1000*60*60));
    //         var minutes = Math.floor((d%(1000*60*60))/(1000*60));

    //         // not to show missed notifications
    //         if(dayss <0 || hours <0 || minutes <0){
    //             var temp = 0 // anything
    //         }else{
    //         PushNotification.localNotificationSchedule({
    //             autoCancel: true,
    //             bigText:"Upcoming Class",
    //             subText: this.state.timetable[i]['slot'],
    //             title:"you have class in slot " + this.state.timetable[i]['slot'] + " at time " + this.state.timetable[i]['startTime'] + " - " + this.state.timetable[i]['endTime'],
    //             message:"Classes",
    //             largeIcon : 'icon',
    //             smallIcon : 'icon',
    //             vibrate: true,
    //             vibration: 300,
    //             playSound: true,
    //             soundName: 'default',
    //             date : new Date(dateStringSchedule),
    //             repeatType : 'day',
    //             fireDate: Date.now()
    //         })                
    //         }

    //         // Scheduling Notifications

    //           console.log("running loop",dateStringSchedule)
    //           PushNotification.cancelAllLocalNotifications()
            // }

        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
                
                <StatusBar backgroundColor="#081631" />
            <View style={{backgroundColor:"#081631"}}>
                <View style={{padding:"5%", paddingTop:"10%", height:"100%"}}>
                    <TouchableOpacity onPress={()=>this.props.navigation.jumpTo('MoodleDisplay')}>
                <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"2%", fontFamily:"ProductSans", color:"#FFF"}}>{this.state.day}</Headline>
                </TouchableOpacity>
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

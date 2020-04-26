import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Headline, Caption, ActivityIndicator } from "react-native-paper";
import {Timetable} from '../components/Timetable/Timetable'

export class DashboardScreen extends Component {
    state = {
        attendance : this.props.route.params.attendance,
        profile : this.props.route.params.profile,
        timetable : this.props.route.params.timetable,
        moodle : this.props.route.params.moodle,
        today : this.props.route.params.timetable.Timetable.Thursday,
        dashboard:[],
        loading : true,
        classes:0,
        labs: 0
    }
    setStateAsync = updater => new Promise(resolve => this.setState(updater, resolve))
    titleCase = (str)=>{
        // This function is copied from https://stackoverflow.com/a/32589289
        // Thank you @somethinghere. I could've wrote this myself but im lazy
        let splitStr = str.toLowerCase().split(' ');
        for (let i = 0; i < splitStr.length; i++) {
            // You do not need to check if i is larger than splitStr length, as your for does that for you
            // Assign it back to the array
            splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
        }
        // Directly return the joined string
        return splitStr.join(' '); 
     }
    combineData = async () => {
        // This function combines all the data into one single object
        // Using Thrusday coz today is sunday and im blank on sunday
        // TODO: Change according to day of week
        let today = this.props.route.params.timetable.Timetable.Tuesday
        let attendance = this.props.route.params.attendance
        let classes = 0
        let labs = 0
        for(let i=0; i< today.length; ++i){
            // Ik this is O(n^2) but it doesn't matter
            // TODO: Combine two labs together
            let subCode = today[i]['code']
            let slot = today[i]['slot']
            let isLab = slot[0] === 'L'
            
            for(let j=0;j<attendance['Attended'].length;++j){
                if (attendance['Attended'][j]['code'] === subCode){
                    // Check for Lab and Theory
                    if(isLab && attendance['Attended'][j]['type'] === "Embedded Lab"){
                        today[i]['attended'] = attendance['Attended'][j]['attended']
                        today[i]['total']= attendance['Attended'][j]['total']
                        today[i]['percentage']= attendance['Attended'][j]['percentage']
                        today[i]['faculty']= this.titleCase(attendance['Attended'][j]['faculty'])
                        labs = labs+1
                    }
                    else if ((!isLab && attendance['Attended'][j]['type'] === "Embedded Theory") || (subCode[0]==='S' && attendance['Attended'][j]['type']==="Soft Skill")){
                        today[i]['attended'] = attendance['Attended'][j]['attended']
                        today[i]['total']= attendance['Attended'][j]['total']
                        today[i]['percentage']= attendance['Attended'][j]['percentage']
                        today[i]['faculty']= this.titleCase(attendance['Attended'][j]['faculty'])
                        classes= classes+1
                    }
                }
            }
            // console.log(today[i])
        }
        labs = Number(labs/2)
        await this.setStateAsync({dashboard:today, loading:false, classes :classes, labs :labs})
    }

    async componentDidMount(){
        await this.combineData()
        console.log("----")
    }
    render() {
        console.log("Render Called")
        let moodle, moodleLogin
        if (Object.keys(this.state.moodle).length===0){
            //Moodle not login
            // TODO: Add link for Moodle login
            moodleLogin = false
            moodle = (
                <Caption style={{paddingLeft:"5%", paddingTop:"1%", marginBottom:"5%", color:"#FFF"}}>Login Moodle to show assignments</Caption>
            ) 
        }
        else{
            moodleLogin = true
            moodle =(
                <Caption style={{paddingLeft:"5%", paddingTop:"1%", marginBottom:"5%", color:"#FFF"}}>Currently 2 assignments are due.</Caption>
            )
        }
        if(this.state.loading){
            return(
                <View style={{justifyContent:"center",backgroundColor:"#081631", alignItems:"center", height:"100%" }}>
                    <ActivityIndicator />
                    <Caption style={{color:"white"}}>Loading..</Caption>
                </View>
            )
        }
        else{
            let timetable=[]
            for(let i=0;i<this.state.dashboard.length;++i){
                console.log(this.state.dashboard[i])
                timetable.push(
                    <Timetable
                        course= {this.state.dashboard[i]['courseName']}
                        slot = {this.state.dashboard[i]['slot']}
                        time = {`${this.state.dashboard[i]['startTime']} - ${this.state.dashboard[i]['endTime']}`}
                        class = {this.state.dashboard[i]['class']}
                        teacher = {this.state.dashboard[i]['faculty']}
                        assignments = {i}
                        attendance = {this.state.dashboard[i]['percentage']}
                        attended = {this.state.dashboard[i]['attended']}
                        total = {this.state.dashboard[i]['total']}
                        key = {i}
                        showMoodle = {moodleLogin}
                        isLab = {this.state.dashboard[i]['slot'][0] === 'L'}
                    />
                )
            }
        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
            <View style={{backgroundColor:"#081631"}}>
                <View style={{padding:"5%", paddingTop:"10%", height:"100%"}}>
                    <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"2%", fontFamily:"ProductSans", color:"#FFF"}}>Thursday</Headline>
                    <Caption style={{paddingLeft:"5%", paddingTop:"1%", color:"#FFF"}}>You have {this.state.classes} classes and {this.state.labs} labs</Caption>
                    {moodle}
                    {timetable}
                    
                    

                </View>
                <View>

                </View>
            </View>
            </ScrollView>
        )
        }
    }
}

export default DashboardScreen

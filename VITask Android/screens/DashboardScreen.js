import React, { Component } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Headline, Caption, Subheading,Card } from "react-native-paper";
import {Timetable} from '../components/Timetable/Timetable'

export class DashboardScreen extends Component {
    componentDidMount(){
        console.log(this.props.route.params)
    }
    render() {
        return (
            <ScrollView>
            <View style={{backgroundColor:"#081631"}}>
                <View style={{padding:"5%", paddingTop:"10%", height:"100%"}}>
                    <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"2%", fontFamily:"ProductSans", color:"#FFF"}}>Thrusday</Headline>
                    <Caption style={{paddingLeft:"5%", paddingTop:"1%", color:"#FFF"}}>You have 7 classes 3 Labs.</Caption>
                    <Caption style={{paddingLeft:"5%", paddingTop:"1%", marginBottom:"5%", color:"#FFF"}}>Currently 2 assignments are due.</Caption>
                    <Timetable
                        course= "Operating Systems"
                        slot = "B1"
                        time = "8:00 - 8:50"
                        class = "AB1 503"
                        teacher = "Amit Kumar Tyagi"
                        assignments = {0}
                        attendance = {90}
                    />
                    <Timetable
                        course= "Organizational Behaviour"
                        slot = "G1"
                        time = "8:55 - 9:40"
                        class = "AB1 508"
                        teacher = "Balaji Vishwanath"
                        assignments = {0}
                        attendance = {78}

                    />
                    <Timetable
                        course= "Computer Networking"
                        slot = "A1"
                        time = "8:00 - 8:55"
                        class = "AB1 503"
                        teacher = "Saranya Nair"
                        assignments = {1}
                        attendance = {69}

                    />
                    <Timetable
                        course= "Robotics and Automation"
                        slot = "C1"
                        time = "8:00 - 8:55"
                        class = "AB1 503"
                        teacher = "Madarchod Teacher"
                        assignments = {0}
                        attendance = {90}

                    />
                    <Timetable
                        course= "Community Development in India"
                        slot = "A1"
                        time = "8:00 - 8:55"
                        class = "AB1 503"
                        teacher = "Teacher Name"
                        assignments = {1}
                        attendance = {85}

                    />
                    

                </View>
                <View>

                </View>
            </View>
            </ScrollView>
        )
    }
}

export default DashboardScreen

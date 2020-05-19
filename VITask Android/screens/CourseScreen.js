import React, { Component } from 'react'
import {  View, ScrollView,StatusBar } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Headline, Caption } from "react-native-paper";
import { connect } from 'react-redux';
import Course from '../components/Course/Course'
import LastSync  from "../components/LastSync/LastSync";


class CourseScreen extends React.Component{
    state={
        courses : this.props.state.coursesInfo
    }

    render(){
        let moodleLogin = false
        let courses = []
        for(let i=0;i<this.state.courses.length;++i){
            courses.push(
                <Course
                    slot = {this.state.courses[i]['slot']}
                    faculty = {this.state.courses[i]['faculty']}
                    time = {`${this.state.courses[i]['startTime']} - ${this.state.courses[i]['endTime']}`}
                    key = {i}
                    showMoodle = {moodleLogin}
                    isLab = {this.state.courses[i]['slot'][0] === 'L'}
                    navigation = {this.props.navigation}
                    percentage = {this.state.courses[i].percentage}
                    courseName = {this.state.courses[i].courseName}
                    courseDetails = {this.state.courses[i]}
                />
            )
            }
        return(
            <ScrollView style={{backgroundColor:"#081631"}}>
            <StatusBar backgroundColor="#081631" />
            <View style={{backgroundColor:"#081631"}}>
                <View style={{padding:"5%", paddingTop:"10%", height:"100%"}}>
                <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"2%", fontFamily:"ProductSans", color:"#FFF"}}>Courses</Headline>
                    <Caption style={{paddingLeft:"5%", paddingTop:"1%", marginBottom:"5%", color:"#FFF"}}>All your registered courses are listed below</Caption>
                    {courses}
                    <LastSync/>
                </View>
                <View>

                </View>
            </View>
            </ScrollView>
        )

    }
}

function mapStateToProps(state){
    return {
        state : state.reducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseScreen)
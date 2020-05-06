import React, { Component } from 'react'
import {  View, ScrollView } from 'react-native'
import { Headline, Caption } from "react-native-paper";
import Timetable from '../components/Timetable/Timetable'
import { connect } from 'react-redux';
import LastSync  from "../components/LastSync/LastSync";


const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const date = new Date()
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
            }

        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
            <View style={{backgroundColor:"#081631"}}>
                <View style={{padding:"5%", paddingTop:"10%", height:"100%"}}>
                <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"2%", fontFamily:"ProductSans", color:"#FFF"}}>{this.state.day}</Headline>
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

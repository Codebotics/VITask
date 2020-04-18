import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import {Caption} from 'react-native-paper'
import * as Animatable from  'react-native-animatable'

export class LoadingScreen extends Component {
    state = {
        text : "Ssh! Logging into VTOP"
    }
    componentDidMount(){
        setTimeout(()=>{
            this.setState({
                text:"Getting Your Timetable"
            })},6000)
        setTimeout(()=>{
            this.setState({
                text:"Getting Your Attendance"
            })}, 10000)
    }
    render() {
        let image = (
            <View style={{
                flexWrap:"wrap",
            }}>
            <Image
            style={{width:90,height:90}}
            source = {require("../assets/favicon.png")} 
            />  
            </View>
        )
        return (
            <View style={{backgroundColor:"#f90024", width:"100%", height:"100%", flexDirection:"column",justifyContent:"space-around"}}>
                <View>
                <View style={{
                    flexDirection:"row", 
                    justifyContent:"space-around", 
                    }}>
                        <Animatable.View 
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
                            animation="fadeIn"
                            duration={1500} 
                            easing="ease-out" 
                            iterationCount="infinite" 
                            style={{
                                padding:"5%", 
                                borderRadius:1000,
                                flexWrap:"wrap",
                                textAlign:"center",
                                color:"#EEE",
                                marginTop:"3%"
                                }}
                            >
                            <Caption style={{color:"#EEE"}}>{this.state.text}</Caption>
                            </Animatable.Text>
                            <Caption style={{color:"#EEE", textAlign:"center"}}>Subsequent Loading will be faster.</Caption>
                </View>
            </View>
        )
    }
}

export default LoadingScreen

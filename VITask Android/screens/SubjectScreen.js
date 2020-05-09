import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet, Image } from 'react-native'
import { Headline, Caption, Subheading,Card, Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons'
import Assignment from '../components/Assignment/Assignment'
import Marks from '../components/Marks/Marks'
import LastSync  from "../components/LastSync/LastSync";


export class SubjectScreen extends Component {
    state = {
        ...this.props.route.params.course,
        bunk:0,
        color: "#00e6ac",
        loading: true
    }
    
    onMiss(type){
        let bunk = this.state.bunk+ (type*1)
        let attended = this.state.attended+ (type*1)
        let total = this.state.total+1
        let attendance = Math.ceil((attended/total)*100)
        let color = "#00e6ac"
        if(attendance<75){
            color = "#ff6070"
        }
        else if(attendance>=75 && attendance<=80){
            color = "#ffc480"
        }
        this.setState({
            percentage:attendance,
            attended,
            total,
            bunk,
            color,
        })
    }
    componentDidMount(){
        const course = this.props.route.params.course
        this.setState({
            ...course
        })
        if(course.percentage<75){
            this.setState({
                color:"#ff6070"
            })
        }
        else if(course.percentage>=75 && course.percentage<=80){
            this.setState({
            color :"#ffc480"
            })
        }
    }
    render() {
        let assignments,marks, shortNotice
        if(!this.state.moodle){
            assignments = (
                <View>
                    <Card style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}} >
                    <Subheading style={{color:"#FFF"}}>See your pending assignments</Subheading>
                    <Caption style={{color:"#FFF", paddingTop:"5%"}}>VITask can also show you assignments. Just Sign In Moodle and see your assignments here.</Caption>
                    <Card.Actions style={{justifyContent:"flex-end"}}>
                    <Button mode="contained" color="#f90024" style={{marginTop:"1%", flex:1, maxWidth:"30%"}} onPress={()=>{this.props.navigation.navigate("MoodleLogin")}}>Log In</Button>
                    </Card.Actions>
                    </Card>
                </View>
            )
        }
        if(!this.state.marks){
            marks = (
                <View>
                    <Card style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}} >
                    <Subheading style={{marginVertical:"10%", marginHorizontal:"20%", textAlign:"center", color:"white"}}>Nothing to see here</Subheading>
                    </Card>
                </View>
            )
        }
        else{
            marks = []
            for(const mark in this.state.marks){
                marks.push(
                    <Marks 
                        title = {mark}
                        marks = {this.state.marks[mark]}
                        key = {mark}
                    />
                )
            }
        }
        if (this.state.percentage<75){
            shortNotice = (
                <Card elevation={12} style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#ffc480"}}>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                        <View style={{flex:1}}>
                            <Icon name="error" style={{fontSize:30, textAlign:"center"}} color="#ff6070"/>
                        </View>
                        <View style={{flex:7}}>
                            <Caption >You're short by {75-this.state.percentage}%. You can make it up by attending ADDLOGICHERE classes</Caption>
                        </View>
                    </View>
                </Card>
            )
        }
        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
                <View style={{backgroundColor:"#081631"}}>
                    <View>
                        <Headline style={{color:"#FFF", textAlign:"center", marginVertical:"5%"}}>{this.state.courseName}</Headline>
                        <Card elevation={12} style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}}>
                            <View style={{...styles.justifySpaceRow, marginTop:0}}>
                            <View style={{...styles.justifySpaceCol, marginTop:0, flex:1}}>
                                <Headline style={{color:this.state.color, fontSize:57, paddingTop:"32%", textAlign:"center"}}>{this.state.percentage}%</Headline>
                                <Caption style={{color:"#BBB", textAlign:"center"}} >{this.state.attended} out of {this.state.total}</Caption>
                            </View>
                            <View style={{...styles.justifySpaceCol, marginTop:0, flex:1, justifyContent:"center", alignItems:"center"}}>
                                <Icon.Button name="add" size={20} iconStyle={{marginRight:0}} onPress={()=>{this.onMiss(1)}}/>
                                <Text style={{color:"#FFF", paddingVertical:"5%"}}>{this.state.bunk} classes</Text>
                                <Icon.Button name="remove" size={20} iconStyle={{marginRight:0}} onPress={()=>{this.onMiss(-1)}}/>
                            </View>
                        </View>
                        </Card>
                        {shortNotice}
                            
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginHorizontal:"7%", marginTop:"10%",marginBottom:"4%"}}>
                                    <Icon name="assignment" size={20} style={{color:"#FFF"}} />
                                    <Subheading style={{color:"#FFF", paddingLeft:"4%"}}>Assignments</Subheading >
                        </View>
                        {assignments}
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginHorizontal:"7%", marginTop:"10%",marginBottom:"4%"}}>
                                    <Icon name="assessment" size={20} style={{color:"#FFF"}} />
                                    <Subheading style={{color:"#FFF", paddingLeft:"4%"}}>Marks</Subheading >
                        </View>
                        {marks}
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginHorizontal:"7%", marginTop:"10%",marginBottom:"4%"}}>
                                    <Icon name="info" size={20} style={{color:"#FFF"}} />
                                    <Subheading style={{color:"#FFF", paddingLeft:"4%"}}>Course Info</Subheading >
                        </View>
                        <Card style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}} >
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="description" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>{this.state.code}</Text >
                        </View>
                        
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="person" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>{this.state.faculty}</Text >
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="room" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>{this.state.class}</Text >
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="note" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>{this.state.type}</Text >
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="label" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>{this.state.slot.join(" + ")}</Text >
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="event-note" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>{this.state.days.join(", ")}</Text >
                        </View>
                        </Card>

                        <LastSync/>

                    </View>

                </View>
            </ScrollView>
        )
    }
}

export default SubjectScreen
const styles = StyleSheet.create({
    justifySpaceRow:{ 
        flexDirection: 'row', 
        justifyContent:"space-between", 
        marginTop:"2%"
    },
    justifySpaceCol:{ 
        flexDirection: 'column', 
        justifyContent:"space-between", 
        marginTop:"2%",
        alignContent:"center"
    }
})



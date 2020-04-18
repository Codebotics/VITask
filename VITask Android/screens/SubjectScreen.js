import React, { Component } from 'react'
import { Text, View, ScrollView, StyleSheet } from 'react-native'
import { Headline, Caption, Subheading,Card,Button } from "react-native-paper";
import Icon from 'react-native-vector-icons/MaterialIcons'
import Assignment from '../components/Assignment/Assignment'
import Marks from '../components/Marks/Marks'


export class SubjectScreen extends Component {
    state = {
        attendance :67,
        bunk : 0,
        attended: 8,
        total : 12,
        color: "#00e6ac"
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
            attendance,
            attended,
            total,
            bunk,
            color
        })
    }
    componentDidMount(){
        if(this.state.attendance<75){
            this.setState({
                color:"#ff6070"
            })
        }
        else if(this.state.attendance>=75 && this.state.attendance<=80){
            this.setState({
            color :"#ffc480"
            })
        }
    }
    render() {
        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
                <View style={{backgroundColor:"#081631"}}>
                    <View>
                        <Headline style={{color:"#FFF", textAlign:"center", marginVertical:"5%"}}>Operating Systems</Headline>
                        <Card elevation={12} style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}}>
                            <View style={{...styles.justifySpaceRow, marginTop:0}}>
                            <View style={{...styles.justifySpaceCol, marginTop:0, flex:1}}>
                                <Headline style={{color:this.state.color, fontSize:65, paddingTop:"40%", textAlign:"center"}}>{this.state.attendance}%</Headline>
                                <Caption style={{color:"#BBB", textAlign:"center"}} >{this.state.attended} out of {this.state.total}</Caption>
                            </View>
                            <View style={{...styles.justifySpaceCol, marginTop:0, flex:1, justifyContent:"center", alignItems:"center"}}>
                                <Icon.Button name="add" size={20} iconStyle={{marginRight:0}} onPress={()=>{this.onMiss(1)}}/>
                                <Text style={{color:"#FFF", paddingVertical:"5%"}}>{this.state.bunk} classes</Text>
                                <Icon.Button name="remove" size={20} iconStyle={{marginRight:0}} onPress={()=>{this.onMiss(-1)}}/>
                            </View>
                        </View>
                        </Card>
                        <Card elevation={12} style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#ffc480"}}>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                                <View style={{flex:1}}>
                                    <Icon name="error" style={{fontSize:30, textAlign:"center"}} color="#ff6070"/>
                                </View>
                                <View style={{flex:7}}>
                                    <Caption >You're short by 8%. You can make it up by attending 5 classes</Caption>
                                </View>
                            </View>
                        </Card>
                            
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginHorizontal:"7%", marginTop:"10%",marginBottom:"4%"}}>
                                    <Icon name="assignment" size={20} style={{color:"#FFF"}} />
                                    <Subheading style={{color:"#FFF", paddingLeft:"4%"}}>Assignments</Subheading >
                        </View>
                        <Assignment 
                            title="Digital Assignment - 1" 
                            time="2 days left" 
                            info = "Some information about DA. This is just a filler text."
                            completed= {true}
                            />
                        <Assignment 
                            title="DA -2" 
                            time="5 days left" 
                            info = "Information about Assignment. Just 1-2 lines"
                            attachment = "Attachment 1.pdf"
                            completed={false}
                            />
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginHorizontal:"7%", marginTop:"10%",marginBottom:"4%"}}>
                                    <Icon name="assessment" size={20} style={{color:"#FFF"}} />
                                    <Subheading style={{color:"#FFF", paddingLeft:"4%"}}>Marks</Subheading >
                        </View>
                        <Marks
                            title="CAT-1"
                            marks={30}
                            weightage = {9}
                            weightagePercent = {15}
                            max = {50}
                        />
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", marginHorizontal:"7%", marginTop:"10%",marginBottom:"4%"}}>
                                    <Icon name="info" size={20} style={{color:"#FFF"}} />
                                    <Subheading style={{color:"#FFF", paddingLeft:"4%"}}>Course Info</Subheading >
                        </View>
                        <Card style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}} >
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="description" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>CSE2003</Text >
                        </View>
                        
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="person" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>Amit Kumar Tyagi</Text >
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="room" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>AB1 403</Text >
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="note" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>CH2019205000871</Text >
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="label" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>B1</Text >
                        </View>
                        <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center",marginBottom:"4%"}}>
                                    <Icon name="event-note" size={20} style={{color:"#FFF"}} />
                                    <Text style={{color:"#FFF", paddingLeft:"4%"}}>Monday, Thrusday</Text >
                        </View>
                        </Card>

                        <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center",marginBottom:"4%", paddingVertical:"5%"}}>
                                    <Icon name="sync" size={15} style={{color:"#FFF"}} />
                                    <Caption style={{color:"#FFF", paddingLeft:"1%"}}>5 hours ago.</Caption >
                        </View>           

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



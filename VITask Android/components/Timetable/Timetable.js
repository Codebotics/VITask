import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Card, Caption, Subheading, TouchableRipple } from "react-native-paper";
import ProgressBar from 'react-native-progress/Bar';
import Icon  from "react-native-vector-icons/MaterialIcons";


export class Timetable extends Component {
    state = {
        color:"#00e6ac",
        attendance : this.props.attendance/100

    }
    componentDidMount(){
        if (this.state.attendance<0.8 && this.state.attendance>0.75){
            this.setState({
                color:"#ffb560"
            })
        }
        else if (this.state.attendance<0.75){
            this.setState({
                color:"#ff6070"
            })
        }
    }

    render() {
        let moodle
        if(this.props.showMoodle){
            moodle = (
                <View style={{paddingVertical: "2%",paddingHorizontal:"7%", justifyContent: "flex-start", flexDirection:"row", alignItems: "center"}}>
                    <Icon name="assignment" color="#FFF" size={18}/>
                    <Text style={{fontWeight:"bold", color:"#EEE"}}>  {this.props.assignments}</Text> 
                </View>
            )
        }
        let lab 
        if(this.props.isLab){
            lab = (
                <View style={{
                    paddingVertical: "1%",
                    flexDirection: "row",
                    justifyContent:"flex-end",
                    flex:1
                }}>
                    <View style={{ paddingVertical: "1%", flexDirection: "row",justifyContent: "flex-start", alignItems: "center"}}>
                        <Text style={{fontWeight:"bold", color:"#EEE", backgroundColor:"#0068b3", paddingHorizontal:"6%", paddingVertical:"3%", borderRadius:10}}>Lab</Text> 
                    </View>
                </View>
            )
        }
        return (
            <View style={{marginVertical:"2%"}}>
                <TouchableRipple>
                <Card elevation={12} style={{borderRadius:10, paddingBottom:"5%", paddingTop:"5%", backgroundColor:"#22365d", paddingHorizontal:"5%"}}>
                    <View style={{}} >
                        <View style={{paddingLeft:"3%", marginRight:"2%"}}>
                            <Subheading style={{fontSize:17, fontWeight:"bold", color:"#EEE"}}>{this.props.course}</Subheading>
                            <View>
                            <View style={{
                                paddingVertical: "2%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <View style={{paddingVertical: "2%",flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Icon name="place" color="#FFF" size={18}/>
                                    <Text style={{fontWeight:"bold", color:"#EEE"}}>  {this.props.class}</Text> 
                                </View>

                                <View style={{ paddingVertical: "2%",flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Icon name="access-time" color="#FFF" size={18}/>
                                    <Text style={{fontWeight:"bold", color:"#EEE"}}>  {this.props.time}</Text> 
                                </View>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                flex:1
                            }}>
                            <View style={{
                                paddingVertical: "2%",
                                flexDirection: "row",
                                alignItems: "center",
                                flex:1
                            }}>
                                <View style={{ paddingVertical: "2%", flexDirection: "row",justifyContent: "flex-start", alignItems: "center"}}>
                                    <Icon name="label" color="#FFF" size={18}/>
                                    <Text style={{fontWeight:"bold", color:"#EEE"}}>  {this.props.slot}</Text> 
                                </View>

                                {moodle}
                            </View>
                            {lab}
                            </View>
                            </View>
                            
                            <View style={{paddingTop:"5%", flexDirection:"row"}}>
                                <View style={{flex:8, justifyContent:"center"}}>
                                <ProgressBar progress={this.state.attendance} color={this.state.color} width={null} unfilledColor="#081631"/>
                                </View>
                                <View style={{flex:2}}>
                                <Text style={{color:"#FFF", textAlign:"center"}}>{this.state.attendance*100}%</Text>
                                </View>
                            </View>
                            <Caption style={{color:"#FFF", textAlign:"center"}}>Attended {this.props.attended} out of {this.props.total} classes</Caption>
                        </View>
                    </View>
                </Card>
                </TouchableRipple>
            </View>
        )
    }
}

export default Timetable

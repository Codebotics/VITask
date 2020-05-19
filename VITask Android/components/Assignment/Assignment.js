import React, { Component } from 'react'
import { Text, View,StyleSheet,Linking } from 'react-native'
import { Subheading,Card,  Button, TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons"
import HTML from 'react-native-render-html';


export class Assignment extends Component {
    state = {
        ...this.props.data,
        timeRemain : null
    }
    millisecondsToStr (milliseconds) {
        // Copied from https://stackoverflow.com/a/8212878/8077711
        // Thanks @Dan from Stackoverflow
        // TIP: to find current time in milliseconds, use:
        // var  current_time_milliseconds = new Date().getTime();
    
        function numberEnding (number) {
            return (number > 1) ? 's' : '';
        }
    
        var temp = Math.floor(milliseconds / 1000);
        var years = Math.floor(temp / 31536000);
        if (years) {
            return years + ' year' + numberEnding(years);
        }
        //TODO: Months! Maybe weeks? 
        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            return days + ' day' + numberEnding(days);
        }
        var hours = Math.floor((temp %= 86400) / 3600) ;
        if (hours) {
            return hours + ' hour' + numberEnding(hours);
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return minutes + ' minutes' + numberEnding(minutes);
        }
        var seconds = temp % 60;
        if (seconds) {
            return seconds + ' second' + numberEnding(seconds);
        }
        return 'Hurry Up'; //'just now' //or other string you like;
    }
    componentDidMount(){
        const diff = new Date().getTime() - this.props.data.time*1000
        let submission
        if (diff>0){
            submission  = "Late by "+this.millisecondsToStr(diff)
        }
        else {
            submission = this.millisecondsToStr + " left"
        }
        this.setState({
            timeRemain: submission
        })
        setInterval(()=>{
            this.setState({
                timeRemain: submission
            })
        }, 60000) //Change every 1 min
    }
    render() {
        const data = this.state
        if(!this.props.completed){
            return (
                <View>
                    <Card style={{margin:"5%", border:1, borderRadius: 10, marginVertical:"2%", backgroundColor:"#22365d"}} >
                        <TouchableRipple style={{padding: "5%",}} onPress={()=>{}}>
                        <View style={{...styles.justifySpaceRow, marginTop:0}}>
                            <View style={{...styles.justifySpaceCol, marginTop:0}}>
                                <Subheading style={{color:"#FFF"}}>{data.name}</Subheading>
                                <HTML html={data.description} tagsStyles={{p:{color:"#BBB", paddingTop:10}, a:{color:"white"}, b:{color:"#BBB", paddingTop:10}}}/>
                                <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop:"2%"}}>
                                    <Icon name="assignment-late" size={20} style={{color:"white"}} />
                                    <Subheading style={{color:"white", paddingLeft:"2%", paddingVertical:"3%"}}>{data.timeRemain}</Subheading >
                                </View>
                                <Button onPress={()=>{Linking.openURL(data.url)}} color="#f90024" style={{marginTop:"5%"}} mode="contained">Open Assignment URL</Button> 
                            </View>
                        </View>
                        </TouchableRipple>
                    </Card>
                </View>
            )
        }
    else {
        return(
            <View>
                <Card style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}} >
                    <View style={{...styles.justifySpaceRow, marginTop:0}}>
                    <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Icon name="assignment-turned-in" style={{color:"#00e6ac"}} size={20} />
                                    <Subheading style={{paddingLeft:"4%", color:"#00e6ac"}}>{this.props.title}</Subheading >
                        </View>
                    </View>
                    </Card>
                </View>
        )
    }
}
}

export default Assignment

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
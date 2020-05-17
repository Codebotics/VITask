import React, { Component } from 'react'
import { View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux';
import { Caption } from "react-native-paper";

class LastSync extends Component {
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
            return years + ' year' + numberEnding(years) + ' ago';
        }
        //TODO: Months! Maybe weeks? 
        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            return days + ' day' + numberEnding(days) + ' ago';
        }
        var hours = Math.floor((temp %= 86400) / 3600) ;
        if (hours) {
            return hours + ' hour' + numberEnding(hours) + ' ago';
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            return minutes + ' minutes' + numberEnding(minutes) + ' ago';
        }
        var seconds = temp % 60;
        if (seconds) {
            return seconds + ' second' + numberEnding(seconds) + ' ago';
        }
        return 'Just Now'; //'just now' //or other string you like;
    }
    render() {
        return (
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center",marginBottom:"2%", paddingVertical:"5%"}}>
                        <Icon name="sync" size={15} style={{color:"#FFF"}} />
                        <Caption style={{color:"#FFF", paddingLeft:"1%"}}>{this.millisecondsToStr((new Date().getTime())-(new Date(this.props.state.coursesInfo[0].updatedOn).getTime()))}</Caption >
            </View>
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


export default connect(mapStateToProps, mapDispatchToProps)(LastSync)

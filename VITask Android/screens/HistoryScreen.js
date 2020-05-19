import React, { Component } from 'react'
import { Text, View, ScrollView, StatusBar, StyleSheet } from 'react-native'
import {Subheading, Caption, Card} from "react-native-paper"
import { connect } from "react-redux";

class HistoryScreen extends Component {
    state={
        history : this.props.state.acadhistory,
    }
    render() {
        let grades = []
        let count =0
        for(const subject in this.state.history.AcadHistory){
            grades.push(
                <Card style={{margin:"3%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}} key={count} >
                    <View style={{...styles.justifySpaceRow, marginTop:0}}>
                        <View style={{...styles.justifySpaceCol, marginTop:0, flex:7}}>
                        <Subheading style={{color:"#FFF"}}>{subject}</Subheading>
                        </View>
                        <View style={{...styles.justifySpaceCol, marginTop:0, flex:3}}>
                            <Subheading style={{textAlign:"right", color:"#FFF"}} >{this.state.history.AcadHistory[subject]}</Subheading>
                        </View>
                    </View>
                </Card>
            )
            count++
        }
        const curr = this.state.history.CurriculumDetails
        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
            <StatusBar backgroundColor="#081631" />
            <View style={{backgroundColor:"#081631", height:"100%"}}>
                <View style={{padding:"3%", paddingTop:"10%", height:"100%"}}>
                    <Subheading style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"5%", fontFamily:"ProductSans", color:"#FFF"}} numberOfLines={1} adjustsFontSizeToFit>Grade History</Subheading>
                    <Caption style={{color:"white", paddingLeft:"5%", paddingBottom:"5%"}}>Your past grades and courses will appear here </Caption>
                    <View>
                    <Card style={{margin:"3%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d", marginBottom:"7%"}} >
                    <View style={{...styles.justifySpaceRow, marginTop:0}}>
                        <View style={{...styles.justifySpaceCol, marginTop:0, flex:7}}>
                            <Subheading style={{color:"#FFF"}}>CGPA</Subheading>
                            <Subheading style={{color:"#BBB"}}>Credits Registered</Subheading>
                            <Subheading style={{color:"#BBB"}}>Credit Earned</Subheading>
                        </View>
                        <View style={{...styles.justifySpaceCol, marginTop:0, flex:3}}>
                            <Subheading style={{textAlign:"right", color:"#FFF"}} >{curr.CGPA}</Subheading>
                            <Subheading style={{textAlign:"right",color:"#BBB"}}>{curr.CreditsRegistered}</Subheading>
                            <Subheading style={{textAlign:"right",color:"#BBB"}}>{curr.CreditsEarned}</Subheading>
                        </View>
                    </View>
                    </Card>
                    {grades}
                    </View>
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


export default connect(mapStateToProps, mapDispatchToProps)(HistoryScreen)
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
import React, { Component } from 'react'
import { Text, View,StyleSheet } from 'react-native'
import { Headline, Caption, Subheading,Card } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons"


export class Assignment extends Component {
    render() {
        if(!this.props.completed){
            return (
                <View>
                    <Card style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}} >
                        <View style={{...styles.justifySpaceRow, marginTop:0}}>
                            <View style={{...styles.justifySpaceCol, marginTop:0, flex:7}}>
                                <Subheading style={{color:"#FFF"}}>{this.props.title}</Subheading>
                                <Caption style={{color:"#BBB"}} >{this.props.info}</Caption>
                                <View style={{flexDirection: "row", justifyContent: "flex-start", alignItems: "center", paddingTop:"2%"}}>
                                    <Icon name="attachment" size={15} style={{color:"#BBB"}} />
                                    <Caption style={{color:"#BBB", paddingLeft:"2%"}}>{this.props.attachment}</Caption >
                                </View> 
                            </View>
                            <View style={{...styles.justifySpaceCol, marginTop:0, flex:3}}>
                                <Subheading style={{textAlign:"right", color:"#FFF"}} >{this.props.time}</Subheading>
                            </View>
                        </View>
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
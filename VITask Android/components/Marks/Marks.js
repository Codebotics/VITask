import React, { Component } from 'react'
import { Text, View,StyleSheet } from 'react-native'
import { Headline, Caption, Subheading,Card } from "react-native-paper";


export class Marks extends Component {
    render() {
        return (
            <View>
                <Card style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#22365d"}} >
                    <View style={{...styles.justifySpaceRow, marginTop:0}}>
                        <View style={{...styles.justifySpaceCol, marginTop:0, flex:7}}>
                            <Subheading style={{color:"#FFF"}}>{this.props.title}</Subheading>
                        </View>
                        <View style={{...styles.justifySpaceCol, marginTop:0, flex:3}}>
                            <Subheading style={{textAlign:"center", color:"#FFF"}} >{this.props.marks}</Subheading>
                        </View>
                    </View>
                    <View>
                        
                    </View>
                </Card>
            </View>
        )
    }
}

export default Marks

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
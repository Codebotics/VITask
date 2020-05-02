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
                            <Subheading style={{color:"#BBB"}}>Max. Marks</Subheading>
                            <Subheading style={{color:"#BBB"}}>Weightage %</Subheading>
                            <Subheading style={{color:"#BBB"}}>Weightage Mark</Subheading>
                        </View>
                        <View style={{...styles.justifySpaceCol, marginTop:0, flex:3}}>
                            <Subheading style={{textAlign:"right", color:"#FFF"}} >{this.props.marks}</Subheading>
                            <Subheading style={{textAlign:"right",color:"#BBB"}}>{this.props.max}</Subheading>
                            <Subheading style={{textAlign:"right",color:"#BBB"}}>{this.props.weightagePercent}</Subheading>
                            <Subheading style={{textAlign:"right",color:"#BBB"}}>{this.props.weightage}</Subheading>
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
import React, { Component } from 'react'
import {  View , Image} from 'react-native'

export class WelcomeScreen extends Component {
    componentDidMount(){
        // Make async request
    }
    render() {
        return (
            <View style={{backgroundColor:"#081631", width:"100%", height:"100%", flexDirection:"column",justifyContent:"space-around"}}>
                <View>
                <View style={{
                    flexDirection:"row", 
                    justifyContent:"space-around", 
                    }}>
                        <View
                            ref = {this.handleLogoRef}
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
                            <View style={{
                                flexWrap:"wrap",
                            }}>
                                <Image
                                style={{width:90,height:90}}
                                source = {require("../assests/favicon.png")} 
                                />
                            </View>
                    </View>    
                </View>
            </View>
        </View>
        )
    }
}

export default WelcomeScreen

import React, { Component } from 'react'
import {  View , Image} from 'react-native'

export class WelcomeScreen extends Component {
    componentDidMount(){
        // Make async request
        // Checking for the fetch method
        const headers = {
            Accept : "application/json",
            "Content-Type" : "application/json",
            "X-VITASK-API" : "e95951eed941e60b6c8b95c0bddf6ab4339b563191038a3da296f9702e8270d4136ee26985a1c4b46fdf67436da5e89a9e24472ac4a4e6daba6dd0d9938b8ba8"
        }

        fetch("https://vitask.me/api/gettoken",{
            method : "POST",
            headers : headers,
            body : JSON.stringify({
                "username" : "17BEC1162",
                "password" : "tempPass123@"
            })
        }).then(res=>res.json())
        .then(res=>{console.log(res)})
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

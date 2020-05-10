import React, { Component } from 'react'
import { Text, View, ScrollView,Image } from 'react-native'
import { Headline,Caption } from "react-native-paper";
import * as Animatable from "react-native-animatable"

export class BetaOver extends Component {
    render() {
        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
            <View style={{backgroundColor:"#081631", height:"100%"}}>
                <View style={{padding:"5%", paddingTop:"10%", height:"100%"}}>
                    <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"5%", fontFamily:"ProductSans", color:"#FFF"}}>Oops</Headline>
                    <Animatable.View animation="fadeIn" easing="ease-out" duration={2000} style={{marginVertical:"5%"}}>
                        <Image
                            style = {{marginBottom:"5%"}}
                            source = {require("../assests/favicon.png")} 
                        />
                    </Animatable.View>
                    <Caption style={{color:"#BBB", paddingLeft:"5%", paddingVertical:"3%"}}>This preview was valid till 17 May 2020.</Caption>
                    <Caption style={{color:"white", paddingLeft:"5%", paddingVertical:"3%"}}>We are sorry to say but this beta preview is now over. </Caption>
                    <Caption style={{color:"white", paddingLeft:"5%", paddingVertical:"3%"}}>Please use Google Playstore to download the latest beta or visit vitask.me for new apk</Caption>
                    <Caption style={{color:"white", paddingLeft:"5%", paddingVertical:"3%"}}>Thank you for participating in VITask Beta Testing Program. We hope you liked the experience.</Caption>
            </View>
            </View>
            </ScrollView>
        )
    }
}

export default BetaOver

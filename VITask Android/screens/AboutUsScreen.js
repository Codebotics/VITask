import React, { Component } from 'react'
import { ScrollView, View, Image } from 'react-native'
import { Headline,Caption } from "react-native-paper";
import * as Animatable from "react-native-animatable"



export class AboutUsScreen extends Component {
    render() {
        return (
            <ScrollView style={{backgroundColor:"#081631"}}>
            <View style={{backgroundColor:"#081631", height:"100%"}}>
                <View style={{padding:"5%", paddingTop:"10%", height:"100%"}}>
                    <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"5%", fontFamily:"ProductSans", color:"#FFF"}}>About Us</Headline>
                    <Animatable.View animation="fadeIn" easing="ease-out" duration={2000} style={{marginVertical:"5%"}}>
                        <Image
                            style = {{marginBottom:"5%"}}
                            source = {require("../assests/favicon.png")} 
                        />
                    </Animatable.View>
                    <Caption style={{color:"white", paddingLeft:"5%", paddingVertical:"3%"}}>Who are we? We are students just like you who don't like to type Captcha in some box to check attendance.</Caption>
                    <Caption style={{color:"white", paddingLeft:"5%", paddingVertical:"3%"}}>We are just like you who used to set TimeTable as our wallpaper (please dont do this). So a bunch of students came together to make this amazing experience, VITask.</Caption>
                    <Caption style={{color:"white", paddingLeft:"5%", paddingVertical:"3%"}}>VITask tries to solve all the problems VITians face daily. We are just a group of VITians who love to contribute to our beautiful VITCC community.</Caption>
                    <Caption style={{color:"white", paddingLeft:"5%", paddingVertical:"3%"}}>Thank you for using this app and if you have any feedback or any feature to add please hit us up on Instagram @vitask.me</Caption>
            </View>
            </View>
            </ScrollView>
        )
    }
}

export default AboutUsScreen

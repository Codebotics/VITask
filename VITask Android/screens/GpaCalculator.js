import React, { Component } from 'react'
import {  View, ScrollView,Text,TouchableOpacity,StyleSheet,StatusBar } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Headline, Caption } from "react-native-paper";
import Slider from '@react-native-community/slider';
import Icon  from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from 'react-redux';


class GpaCalculator extends React.Component{
    state={
        credits1 : 0,
        credits2 : 0,
        credits3 : 0,
        credits4 : 0,
        credits5 : 0,
        credits6 : 0,
        credits7 : 0,
        credits8 : 0,
        grade1:0,
        grade2:0,
        grade3:0,
        grade4:0,
        grade5:0,
        grade6:0,
        grade7:0,
        grade8:0,
        
    }
    
    render(){
        const grades = ["S","A","B","C","D","E","F"]
        return(
            <ScrollView style={{backgroundColor:'#081631'}}>
                <StatusBar backgroundColor="#081631" />
                <View style={{padding : '5%',paddingTop : '5%'}}>
                        <Text style={{color:'#FFF',fontSize:wp('10%')}}>
                            GPA Calculator
                        </Text>
                        <View style={{flexDirection:'row',justifyContent:'space-around',paddingTop:'7%'}}>
                            <Text style={{color:'#FFF',fontSize:wp('5%')}}>
                                Credits
                            </Text>
                            <Text style={{color:'#FFF',fontSize:wp('5%')}}>
                                Grades
                            </Text>
                        </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                    <View style={{width:wp('40%')}}>
                     <Text style={{...style.creditsText}}>{this.state.credits1}</Text>
                    <Slider
                        style={{...style.creditSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.credits1}
                        step={1}
                        onValueChange={(value)=>{this.setState({credits1:value})
                                                    console.log(this.state);
                                                    
                    }}
                        minimumValue={0}
                        maximumValue={5}
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.creditsText}}>{this.state.credits2}</Text>
                    <Slider
                        style={{...style.creditSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.credits2}
                        step={1}
                        onValueChange={(value)=>{this.setState({credits2:value})
                                                    console.log(this.state);
                                                    
                    }}
                        minimumValue={0}
                        maximumValue={5}
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.creditsText}}>{this.state.credits3}</Text>
                    <Slider
                        style={{...style.creditSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.credits3}
                        step={1}
                        onValueChange={(value)=>{this.setState({credits3:value})
                                                    console.log(this.state);
                                                    
                    }}
                        minimumValue={0}
                        maximumValue={5}
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.creditsText}}>{this.state.credits4}</Text>
                    <Slider
                        style={{...style.creditSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.credits4}
                        step={1}
                        onValueChange={(value)=>{this.setState({credits4:value})
                                                    console.log(this.state);
                                                    
                    }}
                        minimumValue={0}
                        maximumValue={5}
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.creditsText}}>{this.state.credits5}</Text>
                    <Slider
                        style={{...style.creditSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.credits5}
                        step={1}
                        onValueChange={(value)=>{this.setState({credits5:value})
                                                    console.log(this.state);
                                                    
                    }}
                        minimumValue={0}
                        maximumValue={5}
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.creditsText}}>{this.state.credits6}</Text>
                    <Slider
                        style={{...style.creditSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.credits6}
                        step={1}
                        onValueChange={(value)=>{this.setState({credits6:value})
                                                    console.log(this.state);
                                                    
                    }}
                        minimumValue={0}
                        maximumValue={5}
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.creditsText}}>{this.state.credits7}</Text>
                    <Slider
                        style={{...style.creditSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.credits7}
                        step={1}
                        onValueChange={(value)=>{this.setState({credits7:value})
                                                    console.log(this.state);
                                                    
                    }}
                        minimumValue={0}
                        maximumValue={5}
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.creditsText}}>{this.state.credits8}</Text>
                    <Slider
                        style={{...style.creditSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.credits8}
                        step={1}
                        onValueChange={(value)=>{this.setState({credits8:value})
                                                    console.log(this.state);
                                                    
                    }}
                        minimumValue={0}
                        maximumValue={5}
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    
                    </View>
                    <View style={{width:wp('40%')}}>

                    <Text style={{...style.gradeText}}>{grades[this.state.grade1]}</Text>
                    <Slider
                        style={{...style.gradeSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.grade1}
                        step={1}
                        onValueChange={(value)=>{this.setState({grade1:value})}}
                        minimumValue={0}
                        maximumValue={6}
                        inverted
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.gradeText}}>{grades[this.state.grade2]}</Text>
                    <Slider
                        style={{...style.gradeSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.grade2}
                        step={1}
                        onValueChange={(value)=>{this.setState({grade2:value})}}
                        minimumValue={0}
                        maximumValue={6}
                        inverted
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.gradeText}}>{grades[this.state.grade3]}</Text>
                    <Slider
                        style={{...style.gradeSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.grade3}
                        step={1}
                        onValueChange={(value)=>{this.setState({grade3:value})}}
                        minimumValue={0}
                        maximumValue={6}
                        inverted
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.gradeText}}>{grades[this.state.grade4]}</Text>
                    <Slider
                        style={{...style.gradeSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.grade4}
                        step={1}
                        onValueChange={(value)=>{this.setState({grade4:value})}}
                        minimumValue={0}
                        maximumValue={6}
                        inverted
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.gradeText}}>{grades[this.state.grade5]}</Text>
                    <Slider
                        style={{...style.gradeSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.grade5}
                        step={1}
                        onValueChange={(value)=>{this.setState({grade5:value})}}
                        minimumValue={0}
                        maximumValue={6}
                        inverted
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.gradeText}}>{grades[this.state.grade6]}</Text>
                    <Slider
                        style={{...style.gradeSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.grade6}
                        step={1}
                        onValueChange={(value)=>{this.setState({grade6:value})}}
                        minimumValue={0}
                        maximumValue={6}
                        inverted
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.gradeText}}>{grades[this.state.grade7]}</Text>
                    <Slider
                        style={{...style.gradeSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.grade7}
                        step={1}
                        onValueChange={(value)=>{this.setState({grade7:value})}}
                        minimumValue={0}
                        maximumValue={6}
                        inverted
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    <Text style={{...style.gradeText}}>{grades[this.state.grade8]}</Text>
                    <Slider
                        style={{...style.gradeSlider}}
                        thumbTintColor="#FFF"
                        value={this.state.grade8}
                        step={1}
                        onValueChange={(value)=>{this.setState({grade8:value})}}
                        minimumValue={0}
                        maximumValue={6}
                        inverted
                        minimumTrackTintColor="#f26161"
                        maximumTrackTintColor="#FFF"
                    />

                    </View>
                </View>
                <View style={{flexDirection:'row',alignSelf:'center',alignItems:'center'}}>
                <View style={{height:hp('6%'),width:wp('40%'),alignSelf:'center',marginTop:hp('1%'),justifyContent:'center',alignItems:'center',borderWidth:2,borderColor:'#FFF',borderRadius:10}}>
                        <Text style={{fontSize:20,color:"#FFF",}}>
                            Caculate GPA
                        </Text>
                </View> 
                <Icon name="restore" size={25} color='#FFF' style={{marginLeft:wp('5%')}} />                   
                </View>

            </ScrollView>
        )
    }
}

export default GpaCalculator

const style = StyleSheet.create({
    creditSlider:{
        width: wp('40%'),
        alignSelf:'center',
        paddingTop : hp('1%')
    },
    creditsText:{
        color:"#f26161",
        alignSelf:'center',
        fontSize:18,
        paddingTop:hp('2%')
    },
    gradeSlider:{
        width: wp('40%'),
        alignSelf:'center',
        paddingTop : hp('1%')
    },
    gradeText:{
        color:"#f26161",
        alignSelf:'center',
        fontSize:18,
        paddingTop:hp('2%')   
    }
})
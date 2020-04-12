// react-native-reanimated - 1.1.0
// react-native-gesture-handler - 1.3.0
// native-base - 2.13.8
// Make sure to use EXPO , as it isnt working on CLI, or please try to figure out why it isnt working on cli.

import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TextInput,KeyboardAvoidingView,ScrollView,Keyboard,TouchableWithoutFeedback,TouchableOpacity } from 'react-native';
import Animated, {Easing} from 'react-native-reanimated';
import {TapGestureHandler, State} from 'react-native-gesture-handler';
import { Container, Header, Left, Item, Label, Input, Body, Right, Title } from 'native-base';
const {Value,block,cond,eq,set,event,Clock,startClock,stopClock,debug,timing,clockRunning,interpolate,Extrapolate,concat } = Animated
0
const { width, height } = Dimensions.get('window');


function runTiming(clock, value, dest) {
    const state = {
      finished: new Value(0),
      position: new Value(0),
      time: new Value(0),
      frameTime: new Value(0)
    };
  
    const config = {
      duration: 1000,
      toValue: new Value(0),
      easing: Easing.inOut(Easing.ease)
    };
  
    return block([
      cond(clockRunning(clock), 0, [
        set(state.finished, 0),
        set(state.time, 0),
        set(state.position, value),
        set(state.frameTime, 0),
        set(config.toValue, dest),
        startClock(clock)
      ]),
      timing(clock, state, config),
      cond(state.finished, debug('stop clock', stopClock(clock))),
      state.position
    ]);
  }

class LoginScreen extends Component {

    // to remove name from drawer.
    static navigationOptions = {
        drawerLabel: () => null
   }
   //for removing header
   static navigationOptions = {
    header : null
    
  };

    constructor(){
        super()        
        this.buttonOpacity=new Value(1)

        this.onStateChange = Animated.event([{
            nativeEvent:({state})=>block([
                cond(eq(state,State.END),set(this.buttonOpacity,runTiming(new Clock(),1,0)))
            ])
        }]);
        this.onCloseState =  Animated.event([{
          nativeEvent:({state})=>block([
              cond(eq(state,State.END),set(this.buttonOpacity,runTiming(new Clock(),0,1)))
          ])
      }]);
        this.buttonY = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[100,0],
            extrapolate : Extrapolate.CLAMP
        })
        this.bgY = interpolate(this.buttonOpacity,{
            inputRange:[0,1],
            outputRange:[-height/3,0],
            extrapolate : Extrapolate.CLAMP
        })
        this.textInputZindex = interpolate(this.buttonOpacity,{
          inputRange:[0,1],
          outputRange:[1,-1],
          extrapolate : Extrapolate.CLAMP
      })
      this.textInputY = interpolate(this.buttonOpacity,{
        inputRange:[0,1],
        outputRange:[0,100],
        extrapolate : Extrapolate.CLAMP
    })
    this.textInputOpacity = interpolate(this.buttonOpacity,{
      inputRange:[0,1],
      outputRange:[1,0],
      extrapolate : Extrapolate.CLAMP
  })
  this.rotateCross = interpolate(this.buttonOpacity,{
    inputRange:[0,1],
    outputRange:[180,360],
    extrapolate : Extrapolate.CLAMP,
   
})
    }
  render() {
    return (
      <View style={styles.container} behavior="padding" enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'flex-end'
        }}
      >
        
        <Animated.View style={{ ...StyleSheet.absoluteFill,transform:[{translateY:this.bgY}],backgroundColor:'#363636' }}>
          
        </Animated.View>

        
        <Animated.View style={{opacity:this.buttonOpacity}}>
           <Image
          source={require('../assets/fav.png')}
          style={{height:300,width:300,alignSelf:'center',position:'absolute',bottom:150}}
          />
        </Animated.View>

  
        {/*

        Here Another Image can Fade in when first one fades out.
        
        <Animated.View style={{opacity:this.textInputOpacity}}>
          <Image
          source={require('../assets/fav.png')}
          style={{height:300,width:300,alignSelf:'center'}}
          />
          </Animated.View> */}
          
      
        <View style={{ height: height / 3, justifyContent: 'center' }}>
            <TapGestureHandler onHandlerStateChange={this.onStateChange}>
               <Animated.View style={{ opacity: this.buttonOpacity,
             backgroundColor: '#d6545c',
             height: .09043*height,//70
             marginHorizontal: 0.04866*height,//20
             borderRadius: 0.0452*height,//35
             alignItems: 'center',
             justifyContent: 'center',
             marginVertical: 0.00645*height,//5
             transform:[{translateY:this.buttonY}]
             }}>
                    <Text style={{ fontSize: 0.02583*height, fontWeight: 'bold' }}>SIGN IN</Text>
                </Animated.View> 
            </TapGestureHandler>

          {/* <TouchableOpacity onPress={()=>{
              this.props.navigation.navigate('Home')
           
          }}>
              <Animated.View style={{ height: .09043*height,
             marginHorizontal: 0.04866*height,//20
             borderRadius: 0.0452*height,//35
             alignItems: 'center',
             justifyContent: 'center',
             marginVertical: 0.00645*height,//5
             transform:[{translateY:this.buttonY}]
              , backgroundColor: '#1D7A83',
              opacity:this.buttonOpacity }}>
            <Text style={{ fontSize: 0.02583*height , fontWeight: 'bold', color: 'white' }}>
              GUEST LOGIN
            </Text>
          </Animated.View>
          </TouchableOpacity> */}
          
          
            
            <Animated.View style={{height:height/3, ...StyleSheet.absoluteFill,top:null,justifyContent:"center",backgroundColor:'#d6545c',
            zIndex:this.textInputZindex,
            opacity:this.textInputOpacity,
            transform:[{translateY:this.textInputY}]
            }}>
              <TapGestureHandler onHandlerStateChange = {this.onCloseState}>
               
                <Animated.View style={styles.closeButton}>
                  <Animated.Text style={{fontSize: 0.02583*height ,color:"#003D5F",fontWeight:"bold",
                  transform:[{rotate:concat(this.rotateCross,'deg')}]}}>
                        X
                  </Animated.Text>
                </Animated.View>
              
              </TapGestureHandler>
         

              
{/*                   
                  <TextInput style={styles.textInput}
              placeholder="Registration number"
              placeholderTextColor="#575757"
              />
               <TextInput style={styles.textInput}
              placeholder="Password"
              placeholderTextColor="#575757"
              /> */}
              <Item floatingLabel>
                                <Label style={{ padding: 10, fontSize: 20, color: 'white' }}>Registration Number</Label>
                                <Input style={{ color: 'white', width: '90%' }}
                                // value={}
                                // onChangeText={text => {
                                //     this.setState({ firstName: text })
                                //     console.log(this.state)
                                //     if (this.state.firstName.length > 1 && this.state.lastName.length > 1) {
                                //         this.setState({ isFirst: true })
                                //     }
                                //     if (this.state.firstName.length === 1 || this.state.lastName.length === 1) {
                                //         this.setState({ isFirst: false })
                                //     }
                                // }} 
                                />
                            </Item>
                            <View style={{height:'8%'}}>

                            </View>
                            <Item floatingLabel>
                                <Label style={{ padding: 10, fontSize: 20, color: 'white' }}>Password</Label>
                                <Input style={{ color: 'white', width: '90%' }}
                                // value={}
                                // onChangeText={text => {
                                //     this.setState({ firstName: text })
                                //     console.log(this.state)
                                //     if (this.state.firstName.length > 1 && this.state.lastName.length > 1) {
                                //         this.setState({ isFirst: true })
                                //     }
                                //     if (this.state.firstName.length === 1 || this.state.lastName.length === 1) {
                                //         this.setState({ isFirst: false })
                                //     }
                                // }} 
                                />
                            </Item>
                            <View style={{height:'8%'}}>

                            </View>
              
        
        
             
              <Animated.View style={{    backgroundColor: '#575757',
                                          height: 0.090439*height,
                                          marginHorizontal: 0.04866*width,
                                          borderRadius: 35,
                                          borderColor:'black',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          marginVertical: 0.00645*height,//5
                                          shadowOffset:{width:2,height:2},
                                          shadowColor:'black'
                                          }}>

                <Text style={{fontSize:0.02583*height,fontWeight:'bold',color:'white'}}>SIGN IN</Text>

              </Animated.View>
            
                                            
            </Animated.View>
          
            
        </View>
    

      </View>
      </TouchableWithoutFeedback>
      </View>
    );
  }
}
export default LoginScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  // button: {
  //   backgroundColor: 'white',
  //   height: 70,
  //   marginHorizontal: 20,
  //   borderRadius: 35,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginVertical: 5,
  //   shadowOffset:{width:2,height:2},
  //   shadowColor:"black",
  //   shadowOpacity : 0.2
  // },
  closeButton:{
    height:0.0516*height,
    width:0.09732*width,
    backgroundColor:'white',
    borderRadius:0.025839*height,
    alignItems:'center',
    justifyContent:'center',
    position:'absolute',
    top:-0.025839*height,
    left : width/2 -0.025839*height , 



  },
  textInput:{
    height:.064599*height,
    borderRadius:0.032299*height,
    borderWidth:0.5,
    marginHorizontal:0.025839*height,
    paddingLeft:10,
    marginVertical:5,
    borderColor:'#575757',


  }
});
import React, { Component } from 'react';
import Inputs from './inputs.js'
import ImagesExample from './ImagesExample.js'
import { ImageBackground, View, StyleSheet } from 'react-native'

const image = { uri: "https://reactjs.org/logo-og.png" };

export default class Home extends Component {
   render() {
   return (
      <ImageBackground 
      source={require('./assets/bg.jpg')}
      style={{ flex: 1,
         width : '100%'
        }}
    >
      <View style={styles.container}>
            <ImagesExample />
            <View style={styles.container}>
               <Inputs />
            </View>
      </View>
      </ImageBackground>
   )}
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
   }
})
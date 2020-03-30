import React, { Component } from 'react';
import Inputs from './inputs.js'
import ImagesExample from './ImagesExample.js'
import { View, StyleSheet } from 'react-native'


export default class Home extends Component {
   render() {
   return (
      <View style={styles.container}>
         <ImagesExample />
         <Inputs />
      </View>
   )}
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: '#282828'
   }
})
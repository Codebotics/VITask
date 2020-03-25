import React from 'react';
import Inputs from './inputs.js'
import ImagesExample from './ImagesExample.js'
import { View, StyleSheet } from 'react-native'


const App = () => {
   return (
      <View style={styles.container}>
         <ImagesExample />
         <Inputs />
      </View>
   )
}
export default App

const styles = StyleSheet.create({
   container: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      backgroundColor: '#282828'
   }
})
import React, { Component } from 'react'
import { View, Image, StyleSheet, ActivityIndicator  } from 'react-native'


class Captcha extends Component {
   state = {
      data: '',
      isLoading: true
   }
   componentDidMount = () => {
      fetch('http://10.0.2.2:5000/captcha', {
         method: 'GET'
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);
         this.setState({
            data: responseJson
         });
         this.setState({ isLoading: false });
      })
      .catch((error) => {
         console.error(error);
      });
   }
   
   render() {
      return (
         <View style = {styles.container}>
            {this.state.isLoading && <ActivityIndicator color={"#f54254"} />}
            <Image style={styles.img} source={{uri: this.state.data.Captcha}}
            />
         </View>
      )
   }
}
export default Captcha

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    img: {
        width: 250,
        height: 60,
        borderWidth: 1,
        borderRadius: 5
     }
})
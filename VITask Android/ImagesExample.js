import React, { Component } from 'react'
import { Image, StyleSheet } from 'react-native'

const ImagesExample = () => (
   <Image source = {require('./assets/favicon.png')}
   style = {styles.img}
   />
)
export default ImagesExample

const styles = StyleSheet.create({
    img: {
       width: 100,
       height: 100
    }
})
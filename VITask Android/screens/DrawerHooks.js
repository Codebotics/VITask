import React from "react";
import {  View, StyleSheet,AsyncStorage } from 'react-native'
import {
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer
} from "react-native-paper"
import Icon from "react-native-vector-icons/MaterialIcons"
import { 
    DrawerContentScrollView,
    DrawerItem
 } from "@react-navigation/drawer";
import { useDispatch, useSelector } from "react-redux";
import { drawerState} from "../actions/actions"


export const DrawerHooks = (props) => {
  const state = useSelector(state => state.reducer);
  const dispatch = useDispatch();
  let info = state.userInfo
    let name,reg,school
    if (info){
        name=  info.Name,
        reg = info.RegNo,
        school = info.School
    }
    
  return (
    <View style={{flex:1}}>
              <DrawerContentScrollView {... props}>
                  <View style={styles.drawerContent}>
                      <View style={styles.userInfoSection}>
                          <View style={{flexDirection:"row", marginTop:"5%"}}>
                              <Avatar.Image
                                  source={{
                                      uri: 'https://vitask.me/static/home/images/logo_light.png'
                                  }}
                                  size={50}
                              />
                              <View style={{marginLeft:15, flexDirection:'column'}}>
                                  <Title style={styles.title} numberOfLines={1} adjustsFontSizeToFit>{name}</Title>
                                  <Caption style={styles.caption}>{reg}</Caption>
        
                              </View>
                          </View>
                          <View style={{marginTop:"5%"}}>
                              <Paragraph style={styles.paragraph} numberOfLines={1} adjustsFontSizeToFit>{school}</Paragraph>
                          </View>
                      </View>
                      <Drawer.Section style={styles.drawerSection}>
                              <DrawerItem 
                                  icon={({color, size}) => (
                                      <Icon 
                                      name="dashboard" 
                                      style={{color:"white"}}
                                      size={size}
                                      />
                                  )}
                                  labelStyle={{color:"white"}}
                                  label="Dashboard"
                                  onPress={() => { props.navigation.navigate('Dashboard')}}
                              />
                              <DrawerItem 
                                  icon={({color, size}) => (
                                      <Icon 
                                      name="assignment-ind" 
                                      style={{color:"white"}}
                                      size={size}
                                      />
                                  )}
                                  labelStyle={{color:"white"}}
                                  label="Login Moodle"
                                  onPress={() => { props.navigation.navigate('MoodleLogin')}}
                              /><DrawerItem 
                              icon={({color, size}) => (
                                  <Icon 
                                  name="class" 
                                  style={{color:"white"}}
                                  size={size}
                                  />
                              )}
                              labelStyle={{color:"white"}}
                              label="All Courses"
                              onPress={() => { props.navigation.navigate('Courses')}}
                          />
                          <DrawerItem 
                                  icon={({color, size}) => (
                                      <Icon 
                                      name="equalizer" 
                                      style={{color:"white"}}
                                      size={size}
                                      />
                                  )}
                                  labelStyle={{color:"white"}}
                                  label="GPA Calculator"
                                  onPress={() => { props.navigation.navigate('GpaCalculator')}}
                              />
                              <DrawerItem 
                                  icon={({color, size}) => (
                                      <Icon 
                                      name="developer-mode" 
                                      style={{color:"white"}}
                                      size={size}
                                      />
                                  )}
                                  labelStyle={{color:"white"}}
                                  label="About us"
                                  onPress={() => { props.navigation.navigate('About')}}
                              />
                              
                      </Drawer.Section>
                  </View>
              </DrawerContentScrollView>
              <Drawer.Section style={styles.bottomDrawerSection}>
                  <DrawerItem 
                                  icon={({color, size}) => (
                                      <Icon 
                                      name="exit-to-app" 
                                      style={{color:"white"}}
                                      size={size}
                                      />
                                  )}
                                  labelStyle={{color:"white"}}
                                  label="Logout"
                                  onPress={ async () => {
                                    try {
                                        await AsyncStorage.removeItem("VITask_reduxState")
                                    }
                                    catch(err) {
                                        console.log(err)
                                    }
                                    try {
                                        await AsyncStorage.removeItem("VITask_user")
                                    }
                                    catch(err) {
                                        console.log(err)
                                    }
                                     props.navigation.jumpTo('Login')
                                  }}
                              />
              </Drawer.Section>
            </View>
  );
};
const styles = StyleSheet.create({
    drawerContent: {
      flex: 1,
    },
    userInfoSection: {
      paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
      color:"white",
      
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
      color:"white"
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginTop:"5%",
      color:"#BBB",
      textAlign:"center"
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1,
        padding:"2%"
    },
    preference: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
  });
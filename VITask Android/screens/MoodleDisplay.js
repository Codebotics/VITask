import React, { Component } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen'
import Accordion from 'react-native-collapsible/Accordion';
import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIconsI from 'react-native-vector-icons/MaterialIcons'
import { connect } from 'react-redux';
import { Button, Paragraph, Menu, Divider, Provider,Headline,Card,Caption, } from 'react-native-paper';


import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,Animated,Easing,
} from 'react-native';
// import {Icon} from 'react-native-vector-icons/AntDesign'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { min } from 'react-native-reanimated';
// import MaterialCommunityIconsI from 'react-native-vector-icons/MaterialCommunityIcons'
// const SECTIONS=[
//     {   
//         id : 0,
//         title : "DA2 - IWP Assignment",
//         faculty : "Rajiv Vincent",
//         Date : "17-05-2020",
//         timeRemaining : '3 days 5 hours',
//         uploadedOn : "02-05-2020",
//         isOverdue : true
//     },
//     {

//         id : 1,
//         title : "OS Lab-3",
//         faculty : "Harini",
//         Date : "20-03-20",
//         timeRemaining : '3 days 5 hours',
//         uploadedOn : "02-02-2020",
//         isOverdue : true,

//     },
//     {
//         id : 2,
//         title : "MGT Assignment-2",
//         faculty : "Rajiv Vincent",
//         Date : "17-05-2020",
//         timeRemaining : '3 days 5 hours',
//         uploadedOn : "02-05-2020",
//         isOverdue : false,

//     },
//     {
//         id : 3,
//         title : "DA2 - IWP Assignment",
//         faculty : "Rajiv Vincent",
//         Date : "17-05-2020",
//         timeRemaining : '3 days 5 hours',
//         uploadedOn : "02-05-2020",
//         isOverdue : false,

//     },
//     {
//         id : 4,
//         title : "DA2 - IWP Assignment",
//         faculty : "Rajiv Vincent",
//         Date : "17-05-2020",
//         timeRemaining : '3 days 5 hours',
//         uploadedOn : "02-05-2020",
//         isOverdue : false,

//     }
// ]
const SECTIONS =[];

class MoodleDisplay extends React.Component{
    constructor(props){
        super(props)

          this.roatateValue = new Animated.Value(0) 
          this.totalOverdue 
          this.totalAssignments 
        }

        state = {
            activeSections: [],
            selectedOption : '',
            assignments : this.props.state.assignments.Assignments,
            totalOverdue : null,
            totalAssignments : null,
            isFirst : true
          };
          
    StartRotate() {
        // this.setState({
        //     roatateValue : Animated.Value(0)
        // })
          this.roatateValue.setValue(0)
    
              Animated.timing(this.roatateValue,{
                  toValue : 3.141592653589793238,
                  duration :800,
                  easing : Easing.linear,
              }).start()
    }

    UNSAFE_componentWillMount(){
        if(this.state.isFirst){
        for(var i=0 ; i<this.state.assignments.length ; i++){
            // finding Time reamining for any assignment
            var timeSplit = this.state.assignments[i].time.split(" ")

            var dateSplit = timeSplit[0].split("-")

            var dateString = dateSplit[1] + "/" + dateSplit[0] + "/" + dateSplit[2] + " " + timeSplit[1]
            
            var count = new Date(dateString).getTime();
            var now = new Date().getTime();
            var d = count - now;
        
            var isOverdue

            var days = Math.floor(d/(1000*60*60*24));
            var hours = Math.floor((d%(1000*60*60*24))/(1000*60*60));
            var minutes = Math.floor((d%(1000*60*60))/(1000*60));
            // taking mod of days and checking if assignment is overdue
            if(days <0 || hours <0 || minutes <0){
                isOverdue = true
                days = Math.abs(days)
                hours = Math.abs(hours)
                minutes = Math.abs(minutes)
            }else{
                isOverdue = false
            }

            var obj = {
                id:i,
                title : this.state.assignments[i].course,
                Date : this.state.assignments[i].time,
                isOverdue : isOverdue,
                timeRemaining : days + " days " + hours + " hours " + minutes + " minutes"
            }

            SECTIONS.push(obj)
        }

        var totalOverdue = 0;
        for(var i=0 ; i<SECTIONS.length ; i++)
        {
            if(SECTIONS[i].isOverdue == true){
                totalOverdue ++ 
            }
        }
        this.setState({
            totalAssignments : SECTIONS.length,
            totalOverdue : totalOverdue,
            isFirst : false
        })            
        }

    }

      


    render(){



        const rotateInterpolate = this.roatateValue.interpolate({
            inputRange : [0,3.141592653589793238],
            // outputRange : ["0deg", "180deg"]
            outputRange :  ['rgb(0,230,172)','rgb(255,96,112)']
        })
        // const animatedStyle = {
        //     transform : [{rotate : this.roatateValue}],
        //     backgroundColor : rotateInterpolate
        // }

        
    //   _renderSectionTitle = section => {
    //     return (
    //       <View>
    //         <Text>{section.title}</Text>
    //       </View>
    //     );
    //   };
    
      _renderHeader = (section,index) => {
          if(section.isOverdue){

          
        return (
            <View style={{flexDirection:'row',justifyContent:'space-between',width:wp('90%'),marginTop:'4%',alignSelf:'center',backgroundColor:'#22365d',borderRadius:10,height:hp('7%'),borderWidth : 2, borderColor : 'rgb(255,96,112)',elevation:20}}>
                <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                    <Icon name="note-add" color="#FFF" size={hp('3.5')} style={{marginLeft:wp('1%')}}/>
                    <Text style={{color:'#FFF',fontSize:hp('2.5%'),paddingLeft:wp('1%'),width:wp('70%')}} numberOfLines={1} adjustsFontSizeToFit>
                        {section.title}
                    </Text>
                </View>

            {
                (this.state.activeSections.length == 0) ? 
                <View style={{backgroundColor:'#00e6ac',height:hp('4%'), width:hp('4%'),borderRadius : 1000,justifyContent:'center',alignSelf:'center',marginRight : wp('2%'),alignContent:'center',alignItems:'center'}}>
                <Icon name="keyboard-arrow-up" size = {hp('4%')} color="#FFF"/>
            </View>
            :
            this.state.activeSections[0] != section.id ?
            <View style={{backgroundColor:'#00e6ac',height:hp('4%'), width:hp('4%'),borderRadius : 1000,justifyContent:'center',alignItems:'center',alignSelf:'center',marginRight:wp('2%')}}>
            <Icon name="keyboard-arrow-up" size = {hp('4%')} color="#FFF" />
        </View>
        :
            <Animated.View style={{backgroundColor:rotateInterpolate,height:hp('4%'), width:hp('4%'),alignSelf:'center',borderRadius : 100,transform : [{rotate :this.roatateValue}],marginRight:wp('2%'),alignItems:'center'}}>

            <Icon name="keyboard-arrow-up" size = {hp('4%')} color="#081631" />
        </Animated.View>
            }



          </View>
        );
          }
          else{
          
            return (
                <View style={{flexDirection:'row',justifyContent:'space-between',width:wp('90%'),marginTop:'4%',alignSelf:'center',backgroundColor:'#22365d',borderRadius:10,height:hp('7%')}}>
                    <View style={{justifyContent:'center',flexDirection:'row',alignItems:'center'}}>
                        <Icon name="note-add" color="#FFF" size={hp('3.5')} style={{marginLeft:wp('1%')}}/>
                        <Text style={{color:'#FFF',fontSize:hp('2.5%'),paddingLeft:wp('1%'),width:wp('70%')}} numberOfLines={1} adjustsFontSizeToFit>
                            {section.title}
                        </Text>
                    </View>
    
                {
                    (this.state.activeSections.length == 0) ? 
                    <View style={{backgroundColor:'#00e6ac',height:hp('4%'), width:hp('4%'),borderRadius : 1000,justifyContent:'center',alignSelf:'center',marginRight : wp('2%'),alignContent:'center',alignItems:'center'}}>
                    <Icon name="keyboard-arrow-up" size = {hp('4%')} color="#FFF"/>
                </View>
                :
                this.state.activeSections[0] != section.id ?
                <View style={{backgroundColor:'#00e6ac',height:hp('4%'), width:hp('4%'),borderRadius : 1000,justifyContent:'center',alignItems:'center',alignSelf:'center',marginRight:wp('2%')}}>
                <Icon name="keyboard-arrow-up" size = {hp('4%')} color="#FFF" />
            </View>
            :
                <Animated.View style={{backgroundColor:rotateInterpolate,height:hp('4%'), width:hp('4%'),alignSelf:'center',borderRadius : 100,transform : [{rotate :this.roatateValue}],marginRight:wp('2%'),alignItems:'center'}}>
    
                <Icon name="keyboard-arrow-up" size = {hp('4%')} color="#081631" />
            </Animated.View>
                }
    
    
    
              </View>
            )
          }
      };
    
      _renderContent = section => {
        return (
            <View style={{height:hp('21%'),backgroundColor:'#22365d',borderRadius:10,marginTop:hp('2%'),borderWidth:0,borderColor:'#FFF'}}>
                { /*  Not getting this data, so commented  */}
                {/* <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:hp('.5%')}}>
                <Text style={{color:'#FFF',paddingTop:hp('1%'),paddingLeft:hp('1%'),fontSize:hp('1.85%')}}>
                    By {section.faculty}
                </Text>  
                <Text style={{color:"#FFF",paddingTop:hp('1%'),paddingRight:hp('1%'),fontSize:hp('1.85%')}}>
                    Created on- {section.uploadedOn}
                </Text>                  
                </View> */}
            <View style={{ }}>
                <View style={{flexDirection:'row',alignItems:'center',marginTop:hp('1%'),justifyContent:'space-between'}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                <Icon name="event-note" color="#FFF" size={hp('3.5%')} style ={{marginTop : hp('2%'),marginLeft : hp('1%')}}/>
                <Text style={{color:'#FFF',marginTop:hp('2%'),marginLeft:hp('.5%')}}> {section.Date}</Text>                    
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                <MaterialIconsI name="attachment" size={hp('2.5%')} color="#BBB" style={{marginTop:hp('2%')}} />
                <Text style={{color:'#BBB',marginLeft:hp('.5%'),paddingRight:hp('1%'),marginTop:hp('2%')}}>attachment1.pdf</Text>
                </View>

                </View>

                <View style={{flexDirection:'row',alignItems:'center',marginTop : hp('1%')}}>
                    {
                        section.isOverdue ?
                        <MaterialCommunityIconsI name="calendar-clock" size={hp('3.5%')} color = "rgb(255,96,112)" style={{marginTop : hp('2%'),marginLeft:hp('1%')}} />
                        :
                        <MaterialCommunityIconsI name="calendar-clock" size={hp('3.5%')} color = "#FFF" style={{marginTop : hp('2%'),marginLeft:hp('1%')}} />
                    }

                    <Text style={{color:'#FFF',marginTop:hp('2%'),marginLeft:hp('.5%')}}> {section.timeRemaining}</Text>

                </View>

            </View>
            </View>
        );
      };

      _updateSections = activeSections => {
        this.setState({ activeSections });
      };
      console.disableYellowBox = true
        return(
            
            <View style={{flex:1,backgroundColor:'#081631'}}>
                    <Headline style={{fontSize:50, padding:"5%", paddingTop:"7%", paddingLeft:"5%", paddingBottom:"2%", fontFamily:"ProductSans", color:"#FFF",marginTop : hp('3%')}}>Moodle</Headline>
            {/* <View style={{width:wp('90%'),alignSelf:'center',backgroundColor:'red',height:hp('8%'),marginTop:hp('2%')}}>

            </View> */}
                        <Card elevation={12} style={{margin:"5%", padding: "5%", border:1, borderRadius: 10, marginVertical:"1%", backgroundColor:"#ffc480"}}>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                                <View style={{flex:1}}>
                                    <Icon name="error" style={{fontSize:30, textAlign:"center"}} color="#ff6070"/>
                                </View>
                                <View style={{flex:7}}>
                                    <Caption >You have yet to complete {this.state.totalAssignments} Assignments. Out of which {this.state.totalOverdue} are overdue.</Caption>
                                </View>
                            </View>
                        </Card>
                         <ScrollView style={{marginTop:10,marginLeft:5}}>
           <View style={{justifyContent:"center",flex:1,alignItems:"center"}}>
          <Accordion
          sections={SECTIONS}
          activeSections={this.state.activeSections}
          // renderSectionTitle={this._renderSectionTitle}
          renderHeader={_renderHeader}
          renderContent={_renderContent}
          onChange={_updateSections}
          underlayColor="#FFF"
          duration={1000}
          underlayColor = "#081631"
        //   containerStyle = {{height:600,}}
          onAnimationEnd = {this.StartRotate()}
          
        />
        {/* <FloatingButton /> */}
        </View>
        </ScrollView>
            </View>
        )
    }
}


function mapStateToProps(state){
    return {
        state: state.reducer
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
    }
  }


export default connect(mapStateToProps, mapDispatchToProps)(MoodleDisplay)
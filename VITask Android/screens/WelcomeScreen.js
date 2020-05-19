import React, { Component } from 'react'
import {  View , Image,AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import {
    storeState,
    storeRedux,
    softRefresh
} from '../actions/actions'

class WelcomeScreen extends Component {

    state={
        isAsyncAvailable : false,
        TimeTable : null,
        AcadHistory : null,
        UserInfo : null,
        // Attendance : null,
        CoursesInfo : null,
        password : null,
    }

    storeToRedux =()=>{
        this.props.storeState(this.state.TimeTable)
        this.props.storeState(this.state.AcadHistory)
        this.props.storeState(this.state.UserInfo)
        // this.props.storeState(this.state.Attendance)
        this.props.storeState(this.state.CoursesInfo)
    }

    _retrieveLogin = async () => {
        try {
          const value = await AsyncStorage.getItem('VITask_user');
          console.log(value)
          const user_obj = JSON.parse(value)
          if (user_obj.status == 1) {
            this.setState({
                password : user_obj.password
            })
          }
        //   else{
//else for splash Screen
        //   }
        } catch (error) {
             console.log(error)
        }
      }

    _retrieveRedux = async () => {
        try {
          const value = await AsyncStorage.getItem("VITask_reduxState");
          const reduxObj = JSON.parse(value)
          if (reduxObj.reduxStatus == 1) {
              var TIMETABLE = {
                  timetable : reduxObj.reduxState.timetable
              }
              var ACADHISTORY = {
                  acadhistory : reduxObj.reduxState.acadhistory
              }
              var USERINFO = {
                  userInfo : reduxObj.reduxState.userInfo
              }
            //   var ATTENDANCE = {
            //       attendance : reduxObj.reduxState.attendance
            //   }
              var COURSESINFO = {
                  coursesInfo : reduxObj.reduxState.coursesInfo
              }
              this.setState({
                isAsyncAvailable : true,
                TimeTable : TIMETABLE,
                AcadHistory : ACADHISTORY,
                UserInfo : USERINFO,
                // Attendance : ATTENDANCE,
                CoursesInfo : COURSESINFO
              })
              this.storeToRedux()
              this.props.softRefresh(this.state.password)
              this.props.reformat()

          }
        } catch (error) {
            //  console.log(error)
        }
      }



    componentDidMount(){
        this._retrieveLogin()
        this._retrieveRedux()
        setTimeout(() => {
            if(this.state.isAsyncAvailable){
                this.props.navigation.jumpTo("Dashboard")
            }else{
                this.props.navigation.jumpTo("Login")
            }
        }, 2500);
    }
    render() {
        return (
            <View style={{backgroundColor:"#081631", width:"100%", height:"100%", flexDirection:"column",justifyContent:"space-around"}}>
                <View>
                <View style={{
                    flexDirection:"row", 
                    justifyContent:"space-around", 
                    }}>
                        <View
                            ref = {this.handleLogoRef}
                            animation="fadeIn"
                            duration={1500} 
                            easing="ease-out" 
                            iterationCount="infinite" 
                            style={{
                                padding:"5%", 
                                backgroundColor:"#FFF",
                                borderRadius:1000,
                                }}
                            >
                            <View style={{
                                flexWrap:"wrap",
                            }}>
                                <Image
                                style={{width:90,height:90}}
                                source = {require("../assests/favicon.png")} 
                                />
                            </View>
                    </View>    
                </View>
            </View>
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
    return{
        storeState: (rState)=>{
            dispatch(storeState(rState))
        },
        reformat: ()=>{
            dispatch(reformatData())
        },
        softRefresh : (password)=>{
            dispatch(softRefresh(password))
        }
    }
}



export default connect(mapStateToProps,mapDispatchToProps)(WelcomeScreen)

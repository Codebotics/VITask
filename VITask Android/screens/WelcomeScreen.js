import React, { Component } from 'react'
import {  View , Image,AsyncStorage} from 'react-native'
import {connect} from 'react-redux'
import {
    // loginVTOP,
    // fetchAttendance,
    // fetchTimetable,
    // reformatData,
    // fetchMarks,
    // fetchMoodleAssignments,
    // fetchAcadHistory,
    // storeRedux,
    storeState,
    getToken,
    storeRedux
} from '../actions/actions'

class WelcomeScreen extends Component {

    state={
        isAsyncAvailable : false
    }

    storeToRedux =()=>{
        this.props.storeState(this.state.userInfo)
        this.props.storeState(this.state.timetable)
        this.props.storeState(this.state.acadhistory)
        console.log(this.state.timetable)
    }

    _retrieveData = async () => {
        try {
          const value = await AsyncStorage.getItem("VITask_reduxState");
        //   console.log(value)
          const reduxObj = JSON.parse(value)
          if (reduxObj.reduxStatus == 1) {
              this.setState({
                isAsyncAvailable : true,
                ...reduxObj.reduxState
              })
              console.log("REDUX", reduxObj.reduxState.timetable)
            //   this.storeToRedux()
            this.props.storeState(reduxObj.reduxState)
            // this.props.storeRedux(reduxObj.reduxState)
          }
        } catch (error) {
             console.log(error)
        }
      }

    componentDidMount(){
        this._retrieveData()
        // this.props.storeState(this.state)
        setTimeout(() => {
            if(this.state.isAsyncAvailable){
                this.props.navigation.jumpTo("Dashboard")
            }else{
                this.props.navigation.jumpTo("Login")
            }
        }, 2000);
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
        storeState :(rstate)=>{dispatch(storeRedux(rstate))},

    }
}



export default connect(mapStateToProps,mapDispatchToProps)(WelcomeScreen)

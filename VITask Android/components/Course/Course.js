import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Card, Caption, Subheading, TouchableRipple, ActivityIndicator } from "react-native-paper";
import ProgressBar from 'react-native-progress/Bar';
import Icon  from "react-native-vector-icons/MaterialIcons";
import { connect } from 'react-redux';



class Course extends Component {
    state = {
        color:"#00e6ac",
        slot : this.props.courseDetails.slot,
        course : {},
        loading: true
    }
    componentDidMount(){
        const courseInfo = this.props.courseDetails

        let slot = this.props.slot
        let slotUpdated = slot[0]
        for(let i=1; i<slot.length; i++){
            slotUpdated += " + " + slot[i]
        }
        this.setState({
            slot:slotUpdated
        })
        

        this.setState({
            course:courseInfo,
            loading : false
        })
        if (courseInfo.percentage<80 && courseInfo.percentage>75){
            this.setState({
                color:"#ffb560"
            })
        }
        else if (courseInfo.percentage<75){
            this.setState({
                color:"#ff6070"
            })
        }
    }
    componentDidUpdate(prevProps,prevState){
        if(prevProps.state != this.props.state){
            const {coursesInfo} = this.props.state
            // let slot = this.props.slot.split('+')
            const courseInfo = coursesInfo.find(x => {return x.slot.includes()})
            // console.log(courseInfo)
            this.setState({
                course:courseInfo,
                loading : false
            })
            if (courseInfo.percentage<80 && courseInfo.percentage>75){
                this.setState({
                    color:"#ffb560"
                })
            }
            else if (courseInfo.percentage<75){
                this.setState({
                    color:"#ff6070"
                })
            }
        }
    }

    render() {
        const isLab = this.props.slot[0][0]==="L"
        let moodle
        if(this.props.showMoodle){
            moodle = (
                <View style={{paddingVertical: "2%",paddingHorizontal:"7%", justifyContent: "flex-start", flexDirection:"row", alignItems: "center"}}>
                    <Icon name="assignment" color="#FFF" size={18}/>
                    <Text style={{fontWeight:"bold", color:"#EEE"}}>  {0}</Text> 
                </View>
            )
        }
        let lab 
        if(isLab){
            lab = (
                <View style={{
                    paddingVertical: "1%",
                    flexDirection: "row",
                    justifyContent:"flex-end",
                    flex:1
                }}>
                    <View style={{ paddingVertical: "1%", flexDirection: "row",justifyContent: "flex-start", alignItems: "center"}}>
                        <Text style={{fontWeight:"bold", color:"#EEE", backgroundColor:"#0068b3", paddingHorizontal:"6%", paddingVertical:"3%", borderRadius:10}}>Lab</Text> 
                    </View>
                </View>
            )
        }
        if(this.state.loading){
            return (
                <View style={{marginVertical:"2%"}}>
                <TouchableRipple>
                <Card elevation={12} style={{borderRadius:10, paddingBottom:"5%", paddingTop:"5%", backgroundColor:"#22365d", paddingHorizontal:"5%"}}>
                    <View style={{justifyContent:"center", alignContent:"center", flex:1}} >
                        <ActivityIndicator/>
                    </View>
                </Card>
                </TouchableRipple>
                </View>
            )
        }

        return (
            <View style={{marginVertical:"2%"}}>
                <TouchableRipple
                    onPress = {()=>{
                        console.log("")
                        this.props.navigation.navigate("Subject", {course : this.state.course})}}
                    rippleColor = "rgba(34, 54, 93, 0.32)"
                >
                <Card elevation={12} style={{borderRadius:10, paddingBottom:"5%", paddingTop:"5%", backgroundColor:"#22365d", paddingHorizontal:"5%"}}>
                    <View style={{}} >
                        <View style={{paddingLeft:"3%", marginRight:"2%"}}>
                            <Subheading style={{fontSize:17, fontWeight:"bold", color:"#EEE"}}>{this.state.course.courseName}</Subheading>
                            <View>
                            <View style={{
                                paddingVertical: "2%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <View style={{paddingVertical: "2%",flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Icon name="place" color="#FFF" size={18}/>
                                    <Text style={{fontWeight:"bold", color:"#EEE"}}>  {this.state.course.class}</Text> 
                                </View>

                                <View style={{ paddingVertical: "2%",flexDirection: "row", justifyContent: "flex-start", alignItems: "center"}}>
                                    <Icon name="person" color="#FFF" size={18}/>
                                    <Text style={{fontWeight:"bold", color:"#EEE"}}>  {this.props.faculty}</Text> 
                                </View>
                            </View>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                flex:1
                            }}>
                            <View style={{
                                paddingVertical: "2%",
                                flexDirection: "row",
                                alignItems: "center",
                                flex:1
                            }}>
                                <View style={{ paddingVertical: "2%", flexDirection: "row",justifyContent: "flex-start", alignItems: "center"}}>
                                    <Icon name="label" color="#FFF" size={18}/>
                                    <Text style={{fontWeight:"bold", color:"#EEE"}}>  {this.state.slot} </Text> 
                                </View>

                                {moodle}
                            </View>
                            {lab}
                            </View>
                            </View>
                            
                            <View style={{paddingTop:"5%", flexDirection:"row"}}>
                                <View style={{flex:8, justifyContent:"center"}}>
                                <ProgressBar progress={this.state.course.percentage/100} color={this.state.color} width={null} unfilledColor="#081631"/>
                                </View>
                                <View style={{flex:2}}>
                                <Text style={{color:"#FFF", textAlign:"center"}}>{this.state.course.percentage}%</Text>
                                </View>
                            </View>
                            <Caption style={{color:"#FFF", textAlign:"center"}}>Attended {this.state.course.attended} out of {this.state.course.total} classes</Caption>
                        </View>
                    </View>
                </Card>
                </TouchableRipple>
            </View>
        )
    }
}

function mapStateToProps(state){
    return {
        state : state.reducer
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Course)

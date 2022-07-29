import React, { Component } from 'react'
import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native'
import Loading from '../Loading/Loading';


class UpdateFile extends Component {
   state = {
      loading: true,
      scanner: "",
      newValue: '',
      tableData: [],
      filteredArray: [],
      arg1: "",
      arg2: "",
      position: "",
      currentValue: "",
   }

   async componentDidMount() {
      const tableData = await this.props.navigation.getParam("tableData", "No data read");
      const data = await this.props.navigation.getParam("data", "No data read");
      const position = await this.props.navigation.getParam("position", "No data read");
      const tableHead = await this.props.navigation.getParam("tableHead", "No data read");
      const scanner = await this.props.navigation.getParam("scanner", "No data read");
      // data sample "Inv:LIST100&Article:AR1"
      var argument = data.match(/Inv:([^]*)&Article:([^]*)/);
      var arg1 = argument[1];
      var arg2 = argument[2];
      var element = await (tableData).filter(function(data) { return data[0] == arg1 && data[1] == arg2});
      this.setState({currentValue:element[0][2],
                     position: element[0][4]});
      var filteredArray = await (tableData).filter(function(data) { return !(data[0] == arg1 && data[1] == arg2)});
      this.state.loading = false;
      this.setState({
                     arg1:arg1,
                     arg2:arg2,
                     position: position,
                     tableHead:tableHead,
                     scanner: scanner,
                     filteredArray: filteredArray
                  });
            
      
   }
   
   async Update(){
      
      this.state.filteredArray.unshift([this.state.arg1,this.state.arg2,this.state.currentValue,this.state.newValue,this.state.position]);
      await this.props.navigation.navigate("DisplayCsvDataTable", {
       tableData: this.state.filteredArray,
       tableHead: this.state.tableHead,
       source: 'UpdateFile',
       scanner: this.state.scanner,
      position: this.state.position});
   }

   
   render() {
      return (
         this.state.loading? <Loading/> :
         <View style = {styles.container}>
            <TextInput style = {styles.input}
               placeholder = "New Value"
               placeholderTextColor = "#0000FF"
               color='blue'
               keyboardType="numeric"
               autoCapitalize = "none"
               onChangeText = {newValue => this.setState({newValue })}
               value={this.state.newValue}/>
               {!!this.state.nameError && (
                     <Text style={{ color: "red" }}>{this.state.nameError}</Text>
                           )}
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {() => {
                  if (this.state.newValue.trim() === "") {
                    this.setState(() => ({ nameError: "New Value required." }));
                  } else {
                     this.setState(() => ({ nameError: null }));
                     this.Update();
                  }
                }}>
               <Text style = {styles.submitButtonText}> Submit </Text>
            </TouchableOpacity>
         </View>
      )
   }
}
export default UpdateFile

const styles = StyleSheet.create({
   container: {
    flex:2,
    alignItems:'center',
    justifyContent:'center'},

   input: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#0000FF",
    backgroundColor: "0000FF",
    paddingLeft: 10,
    marginTop: 5,
    marginBottom: 5,
   },
   submitButton: {
      backgroundColor: '#0000FF',
      padding: 10,
      margin: 15,
      height: 41,
      borderRadius: 5,
   },
   submitButtonText:{
      color: 'white'
   }
})
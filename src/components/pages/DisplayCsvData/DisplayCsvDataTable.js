import React, { Component, useEffect } from 'react';
import { Text,StyleSheet,RefreshControl, PermissionsAndroid, View, ScrollView,Button,Alert, PermissionAndroid,TextInput,AsyncStorage } from 'react-native';
import { Table, TableWrapper, Row } from 'react-native-table-component';
import ModalDropdown from 'react-native-modal-dropdown'
import {writeFile,
        readFile,
        DocumentDirectoryPath,
        DownloadDirectoryPath} 
        from 'react-native-fs';
import DocumentPicker from 'react-native-document-picker';
import Papa from 'papaparse';
import * as RNFS from 'react-native-fs';
import * as CSV from 'csv-string';
import Loading from '../Loading/Loading';
import RNFetchBlob from 'react-native-fetch-blob';



export default class CSV_Reader extends Component {

  //Constructor
  constructor(props) {
    super(props);
    this.state = {
      modified_row_index: -1,
      loading : true,
      tableHead: [],
      tableData : [],
      widthArr: [],
      list_inv:[],
      qrCodeData: " ", 
      scanner: "",
      uri:"",

    }
  }
  
  async saveData(){
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
    } catch (err) {
      console.warn(err);
    }
    const readGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE); 
    const writeGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    if(!readGranted || !writeGranted ) {
      console.log('Read and write permissions have not been granted');
      return;
    }
    
    //const pathToWrite = `${RNFetchBlob.fs.dirs.DocumentDir}/data.csv`;
    var data = JSON.parse(await AsyncStorage.getItem('data'))
    var pathToWrite = `${RNFS.ExternalStorageDirectoryPath}/Downloads/inv2.csv`
    
    RNFetchBlob.fs
    .writeFile(pathToWrite, JSON.stringify(data), 'utf8')
    .then(async () => {
      const response = await RNFS.readFile(pathToWrite);
    })
   .catch(error => console.error(error));

  }


  scanQRCodeAgain() {
      this.state.scanner.reactivate();
      this.props.navigation.navigate("QRCodeScannerScreen",{uri: this.state.uri,
      source : "DisplayCsvDataTable",
      tableHead:this.state.tableHead,
      tableData: this.state.tableData,
      position: this.state.qrCodeData});
    }
  
    
   

  async process_data(source){
    const headerSize = [];
    if (source == "UpdateFile"){
      const tableData = await this.props.navigation.getParam("tableData", "No data read");
      const tableHead = await this.props.navigation.getParam("tableHead", "No data read");
      const scanner = await this.props.navigation.getParam("scanner", "No data read");
      const position = await this.props.navigation.getParam("position", "No data read");
      var all = JSON.parse(await AsyncStorage.getItem('data'))

      for (let i = (tableData.length)- 1; i >=0 ; i -= 1){
        all.unshift(tableData[i]);
      }
      all.unshift(tableHead);
      await AsyncStorage.setItem(
        'data',
        JSON.stringify(all));

      this.setState({ tableData: tableData,
                      tableHead:tableHead,
                      scanner: scanner,
                      qrCodeData: position });
      this.state.loading = false;
      }
    else  {
      
      const response = await RNFS.readFile(this.state.uri);
      const csvFile = await response;
      var csv_Header = CSV.parse(csvFile)[0];
      var csv_data = CSV.parse(csvFile).slice(1);
      this.setState({ tableHead:csv_Header });
      var _data = this.state.qrCodeData
      var filteredArray = csv_data.filter(function(data) { return !(data[4] == _data)});
      csv_data = csv_data.filter(data => data[4] == _data);
      this.state.loading = false;
      try {
        await AsyncStorage.setItem(
          'data',
          JSON.stringify(filteredArray));

          await AsyncStorage.setItem(
            'uri',
            this.state.uri
        );
      } catch (error) {
        console.log(error)
      }
      this.setState({ tableData: csv_data });
      }
      for (let i = 0; i < ((this.state.tableHead).length); i += 1){
        headerSize.push(85);
      }
      this.setState({ widthArr: headerSize });
    }



  async componentDidMount() {
     //The code bellow will receive the props passed by QRCodeScannerScreen
      const qrCodeData = await this.props.navigation.getParam("data", "No data read");
      const uri = await this.props.navigation.getParam("uri", "No data read");// inv file's path
      const scanner = await this.props.navigation.getParam("scanner", () => false);
      const source = await this.props.navigation.getParam("source", "No data read");
      this.setState({ qrCodeData: qrCodeData, scanner: scanner, uri: uri });
      this.setState({uri: uri });
    //Read the csv File
      this.process_data(source);
    
  }
  
  render() {
    const state = this.state;
    return (
      //check if data is loaded, if it's the case then show the output table 
      state.loading ? <Loading/> :
      <View style={styles.container}>
        <View ><Text style={styles.uppertext}>POSITION: {state.qrCodeData}</Text></View>
        <ScrollView horizontal={true}>
          <View style = {{marginTop:30}}>
            <Table borderStyle={{marginTop:20,borderWidth: 3, borderColor: '#C1C0B9'}}>
              <Row data={state.tableHead} widthArr={state.widthArr} style={styles.header} textStyle={styles.text}/>
            </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table borderStyle={{borderWidth: 3, borderColor: '#C1C0B9'}}>
                        {
                          state.tableData.map((rowData, index) => (
                          <Row
                            key={index}
                            data={rowData}
                            widthArr={state.widthArr}
                            style={[styles.row, index%2 && {backgroundColor: '#F7F6E7'}]}
                            textStyle={styles.text}
                          />
                      ))
                    }
                  </Table>
                </ScrollView>
                
            </View>
            
        </ScrollView>
        <View style={styles.buttonsContainer}>
            <Button onPress={() => this.scanQRCodeAgain()}  
              title="Update"
              buttonStyle={{
                backgroundColor: '#0000FF',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              titleStyle={{ fontWeight: 'bold'}}
            /></View>
            <View style={styles.buttonsContainer}>
            <Button onPress={() => this.saveData()}  
              title="Save"
              buttonStyle={{
                backgroundColor: '#0000FF',
                borderWidth: 2,
                borderColor: 'white',
                borderRadius: 30,
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 50,
                marginVertical: 10,
              }}
              titleStyle={{ fontWeight: 'bold'}}
            />
            </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { height: '50%',flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '100',fontWeight: "bold", color:'black' },
  dataWrapper: { marginTop: -1 },
  fixToText: {
    flexDirection: 'right',
    justifyContent: 'space-between',
  },
  uppertext: {
    marginTop: 15,
    fontWeight: 'bold',
    color: 'blue',
    borderRadius: 5,

    backgroundColor: "0000FF",
    
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginVertical: 5,
  },
  row: { height: 40, backgroundColor: '#E7E6E1',flexDirection: 'row' }
});
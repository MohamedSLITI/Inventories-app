// Import React
import React, { Component,useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

// Import core components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
// Import Document Picker
import DocumentPicker from 'react-native-document-picker';
//import react native file system
import * as RNFS from 'react-native-fs';


export default class UploadFile extends Component{

  //const [singleFile, setSingleFile] = useState(null);
  
  constructor(props) {
    super(props);
    this.state = {
      singleFile:''
    }
  }

  selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // Setting the state to show single file attributes
      this.setState({ singleFile:res });
      //setSingleFile(res);
      if (res[0].uri.startsWith('content://')) {
                try {
                    //navigate to QRCodeScannerScreen and pass file url.
                    this.props.navigation.navigate("QRCodeScannerScreen",{uri : res[0].uri,
                      source : "UploadFile",
                      position: "No data"});
                  } catch (error) {
                    console.log(error);
                  }
                
            }
    } catch (err) {
      this.setState({ singleFile:null });
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
        alert('Canceled');
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };
  render(){
    return (
    <View style={styles.container}>
      {/*Showing the data of selected Single file*/}
      <Icon  name="upload" size={80} color="#0000ff" onPress={this.selectFile}/>
      <Text style={styles.text}>Upload Configuration File</Text>
    </View>
  );
}
};

const styles = StyleSheet.create({
  container: {
   flex:1,
   alignItems:'center',
   justifyContent:'center'},

   text: {
    marginTop: 20,
    fontWeight: 'bold',
    color: 'blue'
  },
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
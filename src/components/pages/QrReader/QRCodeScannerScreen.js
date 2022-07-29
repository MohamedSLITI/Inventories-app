import React, { Component } from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import QRCodeScanner from "react-native-qrcode-scanner";

export default class QRCodeScannerScreen extends Component {
  
  
  _isMounted = false; // _isMounted is used to prevent the multiple loading of the Function "componentDidMount"

  constructor(props) {
    super(props);
    this.state = { uri: " ", //inv file's uri
                   source:"" // source page : {uploadFile or DisplayCsvDataTable}
                  };
  }

  
  async componentDidMount() {
    this._isMounted = true;
    if (this._isMounted){
    //The code bellow will receive the props passed by QRCodeScannerScreen
    const uri = await this.props.navigation.getParam("uri", "No data read");// inv file's path
    this.setState({ uri:uri});
    //console.log("path in qr", this.state.uri);
  };
  }

    
  componentWillUnmount() {
    this._isMounted = false;
  }

  //Navigate to the next page
  onSuccess = async e => {
    const source = await this.props.navigation.getParam("source", "No source");
    const tableData = await this.props.navigation.getParam("tableData", "No data read"); 
    const position = await this.props.navigation.getParam("position", "No source");
    const tableHead = await this.props.navigation.getParam("tableHead", "No source");
    source == "UploadFile" ?
      await this.props.navigation.navigate("DisplayCsvDataTable", {
        source: "DisplayCsvDataTable",
        data: e.data,
        scanner: this.scanner,
        uri: this.state.uri}) :
        await this.props.navigation.navigate("UpdateFile",{data: e.data,
                                                          tableData:tableData,
                                                          position:position,
                                                          tableHead:tableHead,
                                                          scanner: this.scanner,
                                                        });
  };

  render() {
    return (
      <View style={styles.container}>
        <QRCodeScanner
          onRead={this.onSuccess}
          showMarker={true}
          checkAndroid6Permissions={true}
          ref={elem => {
            this.scanner = elem;
          }}
          cameraStyle={{ height: Dimensions.get("window").height }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  }
});

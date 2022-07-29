import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//import Home from "../pages/QrReader/Home";
import QRCodeScannerScreen from "../pages/QrReader/QRCodeScannerScreen";
//import QRCodeData from "../pages/QrReader/QRCodeData"; 
import UploadFile from "../pages/UploadFile/UploadFile";
import Login from "../pages/Login/Login";
import Registration from "../pages/Registration/Registration";
import DisplayCsvDataTable from "../pages/DisplayCsvData/DisplayCsvDataTable"
import UpdateFile from "../pages/UpdateFile/UpdateFile"


const mainStack = createStackNavigator(
  { 
    Login: Login,
    UploadFile: UploadFile,
    DisplayCsvDataTable:DisplayCsvDataTable,
    QRCodeScannerScreen: QRCodeScannerScreen,
    UpdateFile: UpdateFile,
    Registration: Registration
  },
  { defaultNavigationOptions: { headerShown: false } }
);

const AppContainer = createAppContainer(mainStack);

export default AppContainer;

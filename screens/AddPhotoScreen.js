import React from 'react';
import {Text, View ,TouchableOpacity,Platform, CameraRoll} from 'react-native';
import { Camera } from 'expo-camera';
import * as Permissions from 'expo-permissions';
import { FontAwesome, Ionicons,MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as FileSystem from 'expo-file-system';


export default class AddPhotoScreen extends React.Component {
  state = {
    hasPermission: null,
    cameraType: Camera.Constants.Type.back,
  }


  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Dodaj zdjęcie',
      headerRight: (
        <View style = {{width:80,
        justifyContent: 'space-between',
        flexDirection: 'row'}}>

{ <Icon name="list" size={30} color="#9c354d" 
          onPress=
            {() => {
              navigation.getParam('clearAll')
              navigation.navigate('HomeStack')
              }
            } /> }
            { <Icon name="image" size={30} color="#9c354d" 
          onPress=
            {() => {
              navigation.getParam('clearAll')
              navigation.navigate('PhotoStack')
              }
            } /> }
        </View>
      )
    };
  };



  async componentDidMount() {
    this.getPermissionAsync()
  }

  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasPermission: status === 'granted' });

    
  }


  handleCameraType=()=>{
    const { cameraType } = this.state

    this.setState({cameraType:
      cameraType === Camera.Constants.Type.back
      ? Camera.Constants.Type.front
      : Camera.Constants.Type.back
    })
  }

  takePicture = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      data = await this.camera.takePictureAsync()
      CameraRoll.saveToCameraRoll(data.uri, "photo")
    }
  }

  

  render(){
    const { hasPermission } = this.state
    if (hasPermission === null) {
      return <View />;
    } else if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
          <View style={{ flex: 1 }}>
            <Camera style={{ flex: 1 }} type={this.state.cameraType}  ref={ref => {this.camera = ref}}>
              <View style={{flex:1, flexDirection:"row",justifyContent:"space-between",margin:30}}>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                  onPress={()=>this.takePicture()}
                  >
                  <FontAwesome
                      name="camera"
                      style={{ color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    alignSelf: 'flex-end',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                  }}
                  onPress={()=>this.handleCameraType()}
                  >
                  <MaterialCommunityIcons
                      name="camera-switch"
                      style={{ color: "#fff", fontSize: 40}}
                  />
                </TouchableOpacity>
              </View>
            </Camera>
        </View>
      );
    }
  }
  
}
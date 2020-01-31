import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  CameraRoll,
  FlatList,
  Dimensions,
  Platform,
  Button,
  RefreshControl
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import ImageTile from '../components/ImageTile';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window')


console.disableYellowBox = true;

export default class ImageBrowser extends React.Component {





  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Galeria zdjęć',
      headerRight: (
        <View style={styles.iconContainer} >


{ <Icon name="camera" size={30} color="#9c354d" 
          onPress=
            {() => {
              navigation.getParam('clearAll')
              navigation.navigate('AddPhotoStack')
              }
            } /> }
{ <Icon name="list" size={30} color="#9c354d" 
          onPress=
            {() => {
              navigation.getParam('clearAll')
              navigation.navigate('HomeStack')
              }
            } /> }

        </View>
      )
    };
  };



  static ComponentCenter = () => {
    return(
      <View style={{ flex: 1, }}>
         <Image
          source={require('../assets/images/icon.png')}
          style={{resizeMode: 'contain', width: 200, height: 35, alignSelf: 'center' }}
        />
      </View>
    );
  };

  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      selected: {},
      after: null,
      has_next_page: true,
      refreshing: false
    }
  }

  componentDidMount() {
    this.getPhotos()
  }

  getPhotos = () => {
    let params = { first: 50, assetType: 'Photos' };
    if (this.state.after) params.after = this.state.after
    if (Platform.OS === 'ios') params.groupTypes = 'All'
    if (!this.state.has_next_page) return
    CameraRoll
      .getPhotos(params)
      .then(this.processPhotos)

    this.setState({refreshing: false});
  }

  processPhotos = (r) => {
    if (this.state.after === r.page_info.end_cursor) return;
    let uris = r.edges.map(i=> i.node).map(i=> i.image).map(i=>i.uri)
    this.setState({
      photos: [...this.state.photos, ...uris],
      after: r.page_info.end_cursor,
      has_next_page: r.page_info.has_next_page,
      refreshing: false
    });
  }
  _onRefresh=() => {
    this.setState({
      refreshing:true
    }, () => {
      this.getPhotos();
    });
  } 

  getItemLayout = (data,index) => {
    let length = width;
    return { length, offset: length * index, index }
  }

  renderImageTile = ({item, index}) => {
    let selected = this.state.selected[index] ? true : false
    return(
      <ImageTile
        item={item}
        index={index}
        selected={selected}
        selectImage={this.selectImage}
      />
    )
  }
  renderImages() {
    return(
      <View>
      <FlatList
        data={this.state.photos}
        numColumns={1}
        renderItem={this.renderImageTile}
        keyExtractor={(_,index) => index}
        onEndReached={()=> {this.getPhotos()}}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<Text>Loading...</Text>}
        initialNumToRender={24}
        getItemLayout={this.getItemLayout}
        refreshing={this.state.refreshing} 
        onRefresh={this._onRefresh}
      />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderImages()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 50,
    width: width,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginTop: 20
  },
  iconContainer: {
    width:80,
    justifyContent: 'space-between',
    flexDirection: 'row',

  }
})
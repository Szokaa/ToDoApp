import React from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity
} from 'react-native';

import { Dialog } from 'react-native-simple-dialogs';

import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';

import Icon from 'react-native-vector-icons/FontAwesome';

import Parse from "parse/react-native";
import { withNavigation } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';

export default class HomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Lista',
      headerRight: (
        <View style={styles.iconContainer}>
         { <Icon name="image" size={30} color="#9c354d" 
          onPress=
            {() => {
              navigation.getParam('clearAll')
              navigation.navigate('PhotoStack')
              }
            } /> }
         <Icon name="sign-out" size={30} color="#9c354d" 
          onPress=
            {() => {
              Alert.alert(
                'Wylogowanie',
                'Czy na pewno chcesz się wylogować?',
                [                  
                  {
                    text: 'Anuluj',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {
                    text: 'Tak', onPress: () => {
                      navigation.getParam('clearAll')
                      Parse.User.logOut();
                      navigation.navigate('LogInStack')
                  }},
                ],
                {cancelable: false},
              );
              }
            } />

        </View>
      )
    };
  };

  constructor(props){
    super(props);
    this.state = {
      dialogVisible: false,
      nameError: false,
      item: ''
    }
  }

 

  componentWillMount(){
    this.readAllItems();
  }

  navigateToPage = (page) => {
    this.props.navigation.navigate(page);
  }

  _alert = (title,message, namePage, linkToPage) => {
    Alert.alert(
      title,
      message,
      [                  
        {
          text: 'Ok',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: `Back to ${namePage} page`, onPress: () => {
            this.navigateToPage(linkToPage)
        }},
      ],
      {cancelable: false},
    );
  }

  _onPress = (id) => {
    this.setState({idObject: id});
    Alert.alert(
      "Wybierz akcje",
      '',
      [
        {text: 'Usuń', onPress: () => {
          this._onPressDeleteObject()}},
        {text: 'Aktualizuj', onPress: () => this.setState({dialogVisible: true})},
        {
          text: 'Wyjdź',
          onPress: () => console.log('Cancel Pressed'),
        }       
      ],
      {cancelable: false}
    );   
  }

  _onPressDeleteObject = async() => {
    const query = new Parse.Query("Todo");
    const object = await query.get(this.state.idObject);
    try{
      object.destroy();
      this.readAllItems();
    } catch (e){
      alert(e)
    }
  }

  createItem = () => {
    let item = this.state.item;

    if (item === "" || item === undefined){
      this.setState(() => ({ nameError: `Uzupełnij pola.` }));
    } else {
      const Todo = Parse.Object.extend("Todo");
      const todo = new Todo();

      todo.set("task", this.state.item);
      todo.set("userId", Parse.User.current());
      
      todo.save().then(object => {
        this.readAllItems();
        this.setState({item:''})
      }).catch(error=> {alert(error)})
    }
  }

  readAllItems = async() => {
    const idUser = await Parse.User.currentAsync();
    const query = new Parse.Query("Todo");
    query.exists("task");
    query.equalTo('userId', idUser);
    const resultQuery = await query.find();
    console.log(resultQuery)
    this.setState({results:resultQuery}); 
  }

  updateItem = () => {
    const query = new Parse.Query("Todo");
    query.get(this.state.idObject).then(object => {
      object.set("task", this.state.updateValueDialog);
      object.save().then(objUpdate => {
        this.setState({updateValueDialog:'', dialogVisible: false})
        this.readAllItems();
      });
    });  
  }

  deleteIten = async() => {
    const query = new Parse.Query("Todo");
    const object = await query.get(this.state.idObject);
    try{
      object.destroy();
      this.getAllData();
      this.readAllItems();
    } catch (e){
      alert(e)
    } 
  }

  renderItem = ({item, separators}) => {
    return (
      <TouchableOpacity
        style={styles.borderFlatListItens}
        onPress={() => {
          this._onPress(item.id);
          this.setState({updateValueDialog:item.get("task")})
        }}>
        <View>
            <Text>{item.get("task")}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.containerInputs}> 
          <TextInput style={styles.inputTask}
            placeholder="Dodaj...."
            underlineColorAndroid='transparent'
            ref={'inputObject'}
            value={this.state.item}
            onChangeText={(text) => this.setState({item: text, nameError: null})}/>
          <Icon 
            type="Feather"
            name='plus' 
            style={styles.icon}                
            onPress={() => this.createItem()}/>
        </View>
        {!!this.state.nameError && (
          <View styles={styles.divError}>
            <Text style={styles.divErrorFont}>{this.state.nameError}</Text>
          </View>
        )}
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={{padding: 30, flex: 1}}>
            <Text style={styles.titleItems}>Zadania</Text>
            <FlatList
              data={this.state.results}
              showsVerticalScrollIndicator={false}
              renderItem={this.renderItem}
              showsVerticalScrollIndicator={true}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <Dialog
            visible={this.state.dialogVisible}
            title="Aktualizuj zadanie"
            onTouchOutside={() => this.setState({dialogVisible: false})} >
            <View style={styles.containerInputs}> 
              <TextInput style={styles.inputTask}
                placeholder="Dodaj...."
                underlineColorAndroid='transparent'
                value={this.state.updateValueDialog}
                onChangeText={(text) => this.setState({updateValueDialog: text, nameErrorUpdate: null})}/>
              <Icon 
                type="Feather"
                name='plus' 
                style={styles.icon}                
                onPress={() => this.updateItem()}/>
            </View>
            {!!this.state.nameErrorUpdate && (
              <View styles={styles.divError}>
                <Text style={styles.divErrorFont}>{this.state.nameErrorUpdate}</Text>
              </View>
            )}
          </Dialog>
        </ScrollView>        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 10
  },
  containerInputs:{
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: '#9c354d'
  },
  inputTask: {
    flex: 1,
    padding: 15,
  },
  icon: {
    color: 'grey',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    fontSize: 40,
    color: '#9c354d'
  },
  titleItems: {
    fontWeight: 'bold',
    fontSize: 25,
    marginBottom: 25
  },
  divError:{
    marginTop: 20
  },
  divErrorFont:{
    textAlign: 'center',
    color: '#721c24',
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    padding: 20,
    marginTop: 10,
    marginBottom: 10,
    borderWidth: 2,
  },
  borderFlatListItens:{ 
    flexDirection: 'row', 
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#9c354d'
  },
  iconContainer: {
    width:80,
    justifyContent: 'space-between',
    flexDirection: 'row',

  }
});
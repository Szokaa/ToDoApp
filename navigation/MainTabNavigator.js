import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import HomeScreen from '../screens/HomeScreen';
import SignUpScreen from '../screens/SignUpScreen';
import LogInScreen from '../screens/LogInScreen';
import RestorePasswordScreen from '../screens/RestorePasswordScreen';
import PhotoScreen from '../screens/PhotoScreen';
import AddPhotoScreen from '../screens/AddPhotoScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

const SignUpStack = createStackNavigator({
  SignUp: SignUpScreen,
});

const LogInStack = createStackNavigator({
  LogIn: LogInScreen,
});

const RestorePasswordStack = createStackNavigator({
  RestorePassword: RestorePasswordScreen,
});

const PhotoStack = createStackNavigator({
  PhotoStack: PhotoScreen,
});

const AddPhotoStack = createStackNavigator({
  AddPhotoStack: AddPhotoScreen,
});



HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false } 
};

SignUpStack.navigationOptions = {
  tabBarLabel: 'Sign Up',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }
  
};

LogInStack.navigationOptions = {
  tabBarLabel: 'Log In',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }
  
};

RestorePasswordStack.navigationOptions = {
  tabBarLabel: 'Reset Password',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }
  
};


PhotoStack.navigationOptions = {
  tabBarLabel: 'Photos',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }
  
};

AddPhotoStack.navigationOptions = {
  tabBarLabel: 'AddPhotos',
  tabBarVisible: false,
  tabBarOptions: { showLabel: false }
  
};

export default createBottomTabNavigator({
  LogInStack,
  HomeStack,
  SignUpStack,
  RestorePasswordStack,
  PhotoStack,
  AddPhotoStack
});
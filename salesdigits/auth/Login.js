/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
} from 'react-native';
import {COLOR} from '../AssetDatabase';
import IonIcon from 'react-native-vector-icons/Ionicons';
const Login = ({navigation}) => {
  const [visible, setVisible] = React.useState(false);

  const username = React.useRef();
  const password = React.useRef();

  return (
    <ScrollView>
      <View style={{padding: 10}}>
        <Text style={{color: 'black'}}>Username</Text>
        <TextInput
          style={styles.textinput}
          placeholder={'Username'}
          onTextChange={e => (username.current = e)}
        />
        <Text style={{color: 'black'}}>Password</Text>
        <TextInput
          style={styles.textinput}
          placeholder={'Password'}
          secureTextEntry={visible}
          onTextChange={e => (password.current = e)}
        />
        <TouchableOpacity style={styles.button}>
          <Text style={{color: 'white'}}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Singup')}>
          <Text style={{color: 'white'}}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  textinput: {
    backgroundColor: COLOR.textfield,
    color: 'black',
    borderRadius: 15,
    padding: 10,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    backgroundColor: COLOR.primary3d,
    padding: 10,
    color: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },
});

export default Login;

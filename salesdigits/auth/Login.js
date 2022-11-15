/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useState} from 'react';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Image,
  Button,
  ActivityIndicator, 
  TouchableOpacity,
} from 'react-native';
import {COLOR,IMAGE} from '../AssetDatabase';
import Icon from 'react-native-vector-icons/Ionicons';
import {useMutation} from '@tanstack/react-query';
import data from '../server/data';
import EncryptedStorage from 'react-native-encrypted-storage';
import {AuthContext} from '../context/Context';
import axios from 'axios';
import {MessageModalNormal} from '../extra/CustomModal';


const Login = ({navigation}) => {
  const [visible, setVisible] = React.useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [load, setLoad] = useState(false);
  const {token, setToken} = useContext(AuthContext);

  const post = useMutation(data.login, {
    onSuccess: e => {
      axios.defaults.headers.common = {Authorization: `Token ${e.data.token}`};
      setLoad(false);

      console.log(e.data.token);
      EncryptedStorage.setItem('token', e.data.token);
      setToken(e.data.token);
    },
    onMutate: () => {
      setLoad(true);
    },
    onError: () => {
      alert('Username or Password is Incorrect');
      setLoad(false);
    },
  });

  return (
    <ScrollView>
      <MessageModalNormal show={load} width={'20%'}>
        <ActivityIndicator size={'large'} color={COLOR.primary2d} />
        <Text style={{color: COLOR.black, textAlign: 'center'}}>Loging</Text>
      </MessageModalNormal>
      <View
        style={{alignItems: 'center', justifyContent: 'center', padding: 30}}>
        <Image source={IMAGE.app_logo} style={{width:200,height:200}} resizeMode={'contain'}/>
        <Text style={{color: COLOR.black, fontSize: 20, fontWeight: 'bold'}}>
          Sales DIGITS
        </Text>
        <Text style={{color: COLOR.black, fontSize: 12}}>Sales 2D and 3D</Text>
      </View>
      <View style={{padding: 10}}>
        <Text style={{color: 'black'}}>Username</Text>
        <TextInput
          style={styles.textinput}
          placeholder={'Username'}
          onChangeText={e => {
            setUsername(e);
          }}
          autoComplete={'username'}
        />
        <Text style={{color: 'black'}}>Password</Text>
        <View
          style={{
            ...styles.textinput,
            flexDirection: 'row',
            padding: 0,
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              backgroundColor: COLOR.textfield,
              flex: 1,
              ...styles.textinput,
              padding: 10,
            }}
            placeholder={'Password'}
            autoComplete={'password'}
            secureTextEntry={visible}
            onChangeText={e => setPassword(e)}
          />
          <Icon
            name={visible ? 'eye' : 'eye-off'}
            size={25}
            color={'#000'}
            style={{padding: 5}}
            onPress={() => setVisible(!visible)}
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (username && password) {
              post.mutate({
                username: username,
                password: password,
              });
            } else {
              alert('Please Require Fills');
            }
          }}>
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

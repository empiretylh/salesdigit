import React, {useContext} from 'react';

import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import {COLOR, IMAGE} from '../AssetDatabase';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  validatePhoneNumber,
  validateShopName,
  validateUsername,
} from '../extra/Validation';
import Database from '../server/data';
import {useMutation} from '@tanstack/react-query';
import {AuthContext} from '../context/Context';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
const SignUp = ({navigation}) => {
  const [username, setUsername] = React.useState();
  const [password, setPassword] = React.useState();
  const [phoneno, setPhoneno] = React.useState();
  const [name, setName] = React.useState();
  const [visible, setVisible] = React.useState(false);
  const [load, setLoad] = React.useState(false);

  const PostToServer = useMutation(Database.register, {
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
      setLoad(false);
    },
  });

  const {token, setToken} = useContext(AuthContext);

  return (
    <ScrollView>
      <View style={{padding: 10}}>
        <Text style={{color: 'black'}}>Username</Text>
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
            placeholder={'Username'}
            onChangeText={e => setUsername(e)}
          />
          <Icon
            name={
              validateUsername(username) ? 'checkmark-circle' : 'close-circle'
            }
            size={25}
            color={'#000'}
            style={{padding: 5}}
          />
        </View>
        <Text style={{color: 'black'}}>Name</Text>
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
            placeholder={'Shop Name Or Other'}
            onChangeText={e => setName(e)}
          />
          <Icon
            name={validateShopName(name) ? 'checkmark-circle' : 'close-circle'}
            size={25}
            color={'#000'}
            style={{padding: 5}}
          />
        </View>

        <Text style={{color: 'black'}}>Phone No</Text>
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
            placeholder={'Phone Number'}
            onChangeText={e => setPhoneno(e)}
          />
          <Icon
            name={
              validatePhoneNumber(phoneno) ? 'checkmark-circle' : 'close-circle'
            }
            size={25}
            color={'#000'}
            style={{padding: 5}}
          />
        </View>

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

        {load ? <ActivityIndicator size="large" /> : null}

        <TouchableOpacity
          style={styles.button}
          disabled={load}
          onPress={() => {
            if (username && password && phoneno && name) {
              PostToServer.mutate({
                username: username,
                password: password,
                phoneno: phoneno,
                name: name,
              });
            } else {
              alert('Please Fill Require Fields');
            }
          }}>
          <Text style={{color: 'white'}}>Create Account</Text>
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

export default SignUp;

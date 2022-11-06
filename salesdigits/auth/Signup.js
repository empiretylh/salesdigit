import React from 'react';

import {View, Text,TextInput,ScrollView,Button} from 'react-native';

const SignUp = () => {

  const [username,setUsername] = React.useState()
  const [password,setPassword] = React.useState()
  const [phoneno,setPhoneno] = React.useState()
  const [name,setName] = React.useState()



  return (
   <ScrollView>
      <View style={{padding: 10}}>
        <Text style={{color: 'black'}}>Username</Text>
        <TextInput
          style={styles.textinput}
          placeholder={'Username'}

          // onTextChange={e => (username.current = e)}
        />
        <Text style={{color: 'black'}}>Name</Text>
        <TextInput
          style={styles.textinput} 
          placeholder={'Shop Name Or Other'}
          // onTextChange={e => (username.current = e)}
        />
        <Text style={{color: 'black'}}>Name</Text>
        <TextInput
          style={styles.textinput}
          placeholder={'Shop Name Or Other'}

          // onTextChange={e => (username.current = e)}
        />
        <Text style={{color: 'black'}}>Password</Text>
        <TextInput
          style={styles.textinput}
          placeholder={'Password'}
          secureTextEntry={visible}
          // onTextChange={e => (password.current = e)}
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

export default SignUp;

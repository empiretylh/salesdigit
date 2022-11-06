import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {AuthContext} from './context/Context';

import {NavigationContainer} from '@react-navigation/native';
import {useState, useEffect, useMemo} from 'react';
import SignUp from './auth/Signup';
import Login from './auth/Login';
import EncryptedStorage from 'react-native-encrypted-storage';

const Stack = createStackNavigator();

const Container = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      let userToken;
      try {
        userToken = await EncryptedStorage.getItem('token');
      } catch (e) {
        console.log(e);
      }

      console.log(userToken, 'Usertttttttttoken');
    };

    getToken();
  }, [token]);

  const authvalue = useMemo(() => {
    token, setToken;
  }, [token, setToken]);

  return (
    <AuthContext.Provider value={authvalue}>
      <NavigationContainer>
        <Stack.Navigator>
          {token === null ? (
            <>
              <Stack.Screen name="Signin" component={Login} />
              <Stack.Screen name="Singup" component={SignUp} />
            </>
          ) : null}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default Container;

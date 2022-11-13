import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {AuthContext} from './context/Context';

import {NavigationContainer} from '@react-navigation/native';
import {useState, useEffect, useMemo} from 'react';
import SignUp from './auth/Signup';
import Login from './auth/Login';
import Main from './screens/main';
import LuckyReport from './screens/LuckyReport';
import HistoryAllReport from './screens/HistoryAllReport';
import FinishedReport from './screens/finishreport';


import ThreedLuckyReport from './screens/ThreedLuckyReport';
import ThreedHistoryAllReport from './screens/ThreedHistoryAllReport';
import ThreedfinsihReport from './screens/Threedfinishreport';

import EncryptedStorage from 'react-native-encrypted-storage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import axios from 'axios';
import LoadSplashScreen from './extra/LoadingSplashScreen';

const Stack = createStackNavigator();8
const queryClient = new QueryClient();

const Container = () => {
  const [token, setToken] = useState(null);
  const [load, setLoad] = useState(true);
  axios.defaults.baseURL = 'http://192.168.43.247:8000';

  useEffect(() => {
    const getToken = async () => {
      let userToken;
      try {
        userToken = await EncryptedStorage.getItem('token');

        if (userToken !== null) {
          axios.defaults.headers.common = {Authorization: `Token ${userToken}`};
          setToken(userToken);
        }
        setLoad(false);
      } catch (e) {
        console.log(e);
        setLoad(false);
      }
    };

    getToken();
  }, [token]);

  const authvalue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token, setToken],
  );
  if (load) {
    return <LoadSplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={authvalue}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{headerShown: false}}>
            {token === null ? (
              <>
                <Stack.Screen name="Signin" component={Login} />
                <Stack.Screen name="Singup" component={SignUp} />
              </>
            ) : (
              <>
                <Stack.Screen name="main" component={Main} />
                <Stack.Screen name="2dluckyreport" component={LuckyReport} />
                <Stack.Screen name="2dhistoryallreport" component={HistoryAllReport} />
                 <Stack.Screen name="2dfinishreport" component={FinishedReport} />

                   <Stack.Screen name="3dluckyreport" component={ThreedLuckyReport} />
                <Stack.Screen name="3dhistoryallreport" component={ThreedHistoryAllReport} />
                 <Stack.Screen name="3dfinishreport" component={ThreedfinsihReport} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default Container;

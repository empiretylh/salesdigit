import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {AuthContext, SettingsContext} from './context/Context';

import {NavigationContainer} from '@react-navigation/native';
import {useState, useEffect, useMemo} from 'react';
import SignUp from './auth/Signup';
import Login from './auth/Login';
import Main from './screens/main';
import Settings from './screens/settings';
import LuckyReport from './screens/LuckyReport';
import HistoryAllReport from './screens/HistoryAllReport';
import FinishedReport from './screens/finishreport';
import Pricing from './screens/pricing';
import ThreedLuckyReport from './screens/ThreedLuckyReport';
import ThreedHistoryAllReport from './screens/ThreedHistoryAllReport';
import ThreedfinsihReport from './screens/Threedfinishreport';

import EncryptedStorage from 'react-native-encrypted-storage';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import axios from 'axios';
import LoadSplashScreen from './extra/LoadingSplashScreen';

const Stack = createStackNavigator();
8;
const queryClient = new QueryClient();

const Container = () => {
  const [token, setToken] = useState(null);
  const [settings, setSettings] = useState({
    ftype: 'custom',
  });
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

  useEffect(() => {
    const getSettings = async () => {
      let sett;
      try {
        sett = await EncryptedStorage.getItem('settings');

        if (sett !== null) {
          setSettings(JSON.parse(sett));
        } else {
          await EncryptedStorage.setItem('settings', JSON.stringify(settings));
        }
        setLoad(false);
      } catch (e) {
        console.log(e);
        setLoad(false);
      }
    };

    getSettings();
  }, []);

  const onSetSettings = (e,value) => {
    console.log(e)
    
     const b = {...settings, [e]: value};
   console.log(b);
    // console.log('On Set Settings...')
     setSettings(b)
   EncryptedStorage.setItem('settings',JSON.stringify(b))
  };

  const authvalue = useMemo(
    () => ({
      token,
      setToken,
    }),
    [token, setToken],
  );

  const settingvalue = useMemo(
    () => ({
      settings,
      onSetSettings,
    }),
    [settings],
  );

  if (load) {
    return <LoadSplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsContext.Provider value={settingvalue}>
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
                  <Stack.Screen name="settings" component={Settings} />
                  <Stack.Screen name="2dluckyreport" component={LuckyReport} />
                  <Stack.Screen
                    name="2dhistoryallreport"
                    component={HistoryAllReport}
                  />
                  <Stack.Screen
                    name="2dfinishreport"
                    component={FinishedReport}
                  />

                  <Stack.Screen
                    name="3dluckyreport"
                    component={ThreedLuckyReport}
                  />
                  <Stack.Screen
                    name="3dhistoryallreport"
                    component={ThreedHistoryAllReport}
                  />
                  <Stack.Screen
                    name="3dfinishreport"
                    component={ThreedfinsihReport}
                  />
                  <Stack.Screen name='pricing' component={Pricing}/>
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      </SettingsContext.Provider>
    </QueryClientProvider>
  );
};

export default Container;

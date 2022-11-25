import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import {AuthContext, SettingsContext, PricingContext} from './context/Context';

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
import {baseURL} from './AssetDatabase';

const Stack = createStackNavigator();
8;
const queryClient = new QueryClient();

const Container = () => {
  const [token, setToken] = useState(null);
  const [settings, setSettings] = useState({
    ftype: 'custom',
    combine: false,
  });
  const [load, setLoad] = useState(true);
  const [is_plan, setIs_Plan] = useState(true);
  
  axios.defaults.baseURL = baseURL;

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
          let r = JSON.parse(sett);

          if(Object.keys(r).includes('combine')){
            console.log('INClude Combine Key');
            setSettings(JSON.parse(sett));
          }else{
            console.log('Not Include Combine Key',r)
            await EncryptedStorage.setItem('settings', JSON.stringify(settings));
          }
          
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

  const onSetSettings = (e, value) => {
    console.log(e);

    const b = {...settings, [e]: value};
    console.log(b);
    // console.log('On Set Settings...')
    setSettings(b);
    EncryptedStorage.setItem('settings', JSON.stringify(b));
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

  const planvalue = useMemo(
    () => ({
      is_plan,
      setIs_Plan,
    }),
    [is_plan],
  );

  if (load) {
    return <LoadSplashScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsContext.Provider value={settingvalue}>
        <AuthContext.Provider value={authvalue}>
          <PricingContext.Provider value={planvalue}>
            <NavigationContainer>
              <Stack.Navigator screenOptions={{headerShown: false}}>
                {token === null ? (
                  <>
                    <Stack.Screen name="Signin" component={Login} />
                    <Stack.Screen name="Singup" component={SignUp} />
                  </>
                ) : (
                  <>
                    {is_plan ? (
                      <>
                        <Stack.Screen name="main" component={Main} />
                        <Stack.Screen name="settings" component={Settings} />
                        <Stack.Screen
                          name="2dluckyreport"
                          component={LuckyReport}
                        />
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
                        <Stack.Screen name="pricing" component={Pricing} />
                      </>
                    ) : (
                      <>
                        <Stack.Screen name="pricing" component={Pricing} />
                        <Stack.Screen name="settings" component={Settings} />
                      </>
                    )}
                  </>
                )}
              </Stack.Navigator>
            </NavigationContainer>
          </PricingContext.Provider>
        </AuthContext.Provider>
      </SettingsContext.Provider>
    </QueryClientProvider>
  );
};

export default Container;

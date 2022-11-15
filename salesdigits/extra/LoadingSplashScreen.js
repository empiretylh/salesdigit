import React from 'react';
import {View, Text, Image,ActivityIndicator} from 'react-native';
import {IMAGE as I} from '../AssetDatabase';

const SplashScreen = () => {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    
      <Image
        source={I.app_logo}
        style={{width: 60, height: 60}}
        resizeMode={'contain'}
      />
      <ActivityIndicator size={'small'} color={'#FF0C0C'} style={{marginTop:10}}/>
    </View>
  );
};

export default SplashScreen;

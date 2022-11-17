import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useMutation, useQuery} from '@tanstack/react-query';
import data from '../server/data';
import {COLOR, STYLE, IMAGE} from '../AssetDatabase';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import {GoToSettingsContext, PricingContext} from '../context/Context';

const CustomDrawer = props => {
  const profiledata = useQuery(['profile'], data.getProfile);

  const gotoSetting = useContext(GoToSettingsContext);

  const {is_plan, setIs_Plan} = useContext(PricingContext);

  useEffect(() => {
    if (profiledata.data) {
    
      setIs_Plan(profiledata.data.data.is_plan);
    }
  }, [profiledata.data]);

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', padding: 10,alignItems:'center',justifyContent:'center'}}>
        <Image
          source={IMAGE.app_logo}
          style={{width: 30, height: 30, borderRadius: 80}}
          resizeMode={'contain'}
        />
        <Text style={{color: COLOR.black, fontSize: 14,fontWeight:'bold',marginLeft:5}}>Sales Digits</Text>
      </View>
      <View style={STYLE.divider}/>
      <View
        style={{
          paddingTop: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 5,
        }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
          onPress={() => gotoSetting()}>
          <View style={{flexDirection: 'row'}}>
            {profiledata.data && (
              <Image
                source={{
                  uri:
                    axios.defaults.baseURL + profiledata.data.data.profileimage,
                }}
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 100,
                }}
              />
            )}
            <View>
              <View style={{marginTop: 10, marginLeft: 10}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: COLOR.black,
                  }}>
                  {profiledata.data && profiledata.data.data.name}
                </Text>
                <Text style={{fontSize: 15, color: COLOR.black}}>
                  {profiledata.data && profiledata.data.data.username}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={{top: 5}} onPress={() => gotoSetting()}>
            <Icon name={'settings-outline'} size={20} color={COLOR.black} />
          </TouchableOpacity>
        </TouchableOpacity>
        <View style={STYLE.divider} />
      </View>
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      
    </View>
  );
};

const styles = StyleSheet.create({
  pfimage: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },
});

export default CustomDrawer;

import React,{useState,useEffect,useContext} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useMutation, useQuery} from '@tanstack/react-query';
import data from '../server/data';
import {COLOR, STYLE} from '../AssetDatabase';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import {GoToSettingsContext} from '../context/Context';

const CustomDrawer = props => {
  const profiledata = useQuery(['profile'], data.getProfile);

  const Context  = useContext(GoToSettingsContext);



  return (
    <View style={{flex: 1}}>
      <View
        style={{
          paddingTop: 30,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 5,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
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
          <TouchableOpacity
            style={{top: 5}}
            onPress={() => Context()}>
            <Icon name={'settings-outline'} size={20} color={COLOR.black} />
          </TouchableOpacity>
        </View>
        <View style={STYLE.divider} />
      </View>
      <DrawerContentScrollView>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={{flex: 1, position: 'absolute', bottom: 0}}>
        <TouchableOpacity>
          <Text>LogOut</Text>
        </TouchableOpacity>
        <Text>Version 1.0</Text>
      </View>
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

import * as React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import Home from './Home';
import {View, Text} from 'react-native';
import Report from './Report';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator screenOptions={{headerShown: false}}>
      <Drawer.Screen
        name="stwod"
        component={Home}
        options={() => ({
          title: 'Sales Digits 2D',
        })}
      />
      <Drawer.Screen
        name="2dreport"
        component={Report}
        options={() => ({
          title: 'Report',
        })}
      />
      <Drawer.Screen name="Sales" component={Home} />
    </Drawer.Navigator>
  );
}

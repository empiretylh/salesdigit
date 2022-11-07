import * as React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import Home from './Home';
import {View, Text} from 'react-native';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator screenOptions={{headerShown: false}}>
      <Drawer.Screen
        name="sales2D"
        component={Home}
        options={() => ({
          title: 'Sales Digits 2D',
        })}
      />
      <Drawer.Screen
        name="sales3D"
        component={Home}
        options={() => ({
          title: 'Sales Digits 3D',
        })}
      />
      <Drawer.Screen name="Sales" component={Home} />
    </Drawer.Navigator>
  );
}

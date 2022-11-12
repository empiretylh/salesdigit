import * as React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import Home from './Home';
import {View, Text,Image} from 'react-native';
import Report from './Report';
import HistoryReport from './HistoryReport';
import CustomSideBar from '../extra/CustomSideBar';
import Icon from 'react-native-vector-icons/Ionicons';
import {IMAGE} from '../AssetDatabase'

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator screenOptions={{headerShown: false}} drawerContent={(props)=><CustomSideBar {...props}/>}>    
      <Drawer.Screen
        name="stwod"
        component={Home}
        options={() => ({
          title: 'Sales Digits 2D',
           drawerIcon:({color})=>(
              <Image source={IMAGE.twodicon} style={{width:30,height:30}}/>
            )
        })}

      />
      <Drawer.Screen
        name="2dreport"
        component={Report}
        options={{
          title: '2D Report',
          drawerIcon:({color})=>(
                    <Image source={IMAGE.threedicon} style={{width:30,height:30}}/>
       )

        }}
      />
       <Drawer.Screen
        name="2dhistoryreport"
        component={HistoryReport}
        options={() => ({
          title: 'Save Report & History Report',
        })}
      />
    
    </Drawer.Navigator>
  );
}

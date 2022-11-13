import * as React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

import Home from './Home';
import ThreedHome from './ThreedHome';
import ThreedReport from './ThreedReport';
import ThreedHistoryReport from './ThreedHistoryReport';

import {View, Text, Image} from 'react-native';
import Report from './Report';
import HistoryReport from './HistoryReport';
import CustomSideBar from '../extra/CustomSideBar';
import Icon from 'react-native-vector-icons/Ionicons';
import {IMAGE,COLOR} from '../AssetDatabase';

const Drawer = createDrawerNavigator();

export default function MyDrawer() {
  return (
    <Drawer.Navigator
    drawerContent={props => <CustomSideBar {...props} />} 
    screenOptions={{headerShown: false,
    drawerActiveBackgroundColor:'#fc5e03',
    drawerActiveTintColor:'#fff',
    drawerInactiveTintColor:'#333',
    drawerLabelStyle:{
      marginLeft:-25,
      fontSize:15,
    }
  }}
    
      >
      <Drawer.Screen
        name="stwod"
        component={Home}
        options={() => ({
          title: 'Sales Digits 2D',
          drawerIcon: ({color}) => (
            <Image source={IMAGE.twodicon} style={{width: 30, height: 30}} />
          ),
        })}
      />
      <Drawer.Screen
        name="2dreport"
        component={Report}
        options={{
          title: '2D Report',
          drawerIcon: ({color}) => (
            <Icon name={'document-outline'} size={30} color={COLOR.primary2d}/>
        
          ),
        }}
      />
      <Drawer.Screen
        name="2dhistoryreport"
        component={HistoryReport}
        options={() => ({
          title: 'Save 2D Report',
           drawerIcon: ({color}) => (
            <Icon name={'timer-outline'} size={30} color={COLOR.primary2d}/>
          ),
        })}
      />
       <Drawer.Screen
        name="sthreed"
        component={ThreedHome}
        options={() => ({
          title: 'Sales Digits 3D',
          drawerIcon: ({color}) => (
            <Image source={IMAGE.threedicon} style={{width: 30, height: 30}} />
          ),
        })}
      />
      <Drawer.Screen
        name="3dreport"
        component={ThreedReport}
        options={{
          title: '3D Report',
          drawerIcon: ({color}) => (
            <Icon name={'document-outline'} size={30} color={COLOR.primary3d}/>
        
          ),
        }}
      />
      <Drawer.Screen
        name="3dhistoryreport"
        component={ThreedHistoryReport}
        options={() => ({
          title: 'Save 3D Report',
           drawerIcon: ({color}) => (
            <Icon name={'timer-outline'} size={30} color={COLOR.primary3d}/>
          ),
        })}
      />
    </Drawer.Navigator>
  );
}

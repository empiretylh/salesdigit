export const COLOR = {
  black: '#000000',
  white: '#ffffff',
  textfield: '#D9D9D9',
  primary3d: '#0075FF',
  secondary3d: '#05A2FB',
  green: '#01964E',
  dividerColor: '#D9D9D9',
  dsibleColor: '#B0A2A2',
  bgColor: '#f1f1f1',
  primary2d: '#FFA800',
  secondary2d: '#FFC700',
  deleteColor: '#FF3D00',
  redColor: '#FF0000',
};

import {StyleSheet} from 'react-native';

export const STYLE = StyleSheet.create({
  tabbutton_active: {
    backgroundColor: COLOR.black,
    color: 'white',
    minWidth: 126,
    minHeight: 32,
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  tabbutton: {
    backgroundColor: COLOR.white,
    color: 'white',
    minWidth: 126,
    minHeight: 32,
    padding: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  textinput: {
    backgroundColor: COLOR.textfield,
    color: COLOR.black,
    padding: 10,
    borderRadius: 15,
    fontSize: 17,
    fontWeight: '800',
    margin: 5,
  },
});

export const IMAGE = {
  loadgif: require('./assets/spinnerloading.gif'),
};

export const baseURL = 'http://192.168.43.247:8000';

export const numberWithCommas = (x = 0) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

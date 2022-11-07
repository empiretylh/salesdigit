import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  Alert,
} from 'react-native';


export const MessageModalNormal = ({
  show,
  children,
  onClose,
  width,
  nobackExit,
  radius = 15,
  backgroundColor = 'white',
  height,
}) => {
  // const backAction = () => {
  //   console.log('What');

  //   return true;
  // };

  return (
    <Modal
      visible={show}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
      transparent
      animationType="fade"
    //   onRequestClose={() => (nobackExit ? a.asc(onClose) : onClose())}
      >
      <View
        style={{
          flex: 1,

          width: C.windowWidth * 100,
          height: C.windowHeight * 100,
          backgroundColor: 'rgba(52, 52, 52, 0.8)',

          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: width ? width : '80%',
            height: height ? height : height,
            backgroundColor: backgroundColor,
            borderRadius: radius,
            padding: 10,
          }}>
          {children}
        </View>
      </View>
    </Modal>
  );
};

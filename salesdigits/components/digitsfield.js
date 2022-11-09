import React, {useMemo, useState, useContext, useEffect, useRef} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLOR, numberWithCommas, STYLE as s} from '../AssetDatabase';
import Icon from 'react-native-vector-icons/Ionicons';
import {TwoDigitsContext} from '../context/Context';
const DigitsField = ({item, index}) => {
  const [digits, setDigits] = useState(item.digits ? '' : item.digits);
  const [amount, setAmount] = useState(item.amount ? 0 : item.amount);
  const {digitsData, setDigitsData, newForm, DeleteDigits} =
    useContext(TwoDigitsContext);

  const amountfield = useRef();

  useMemo(() => {
    let digits_clone = [...digitsData];
    digits_clone[index] = {...digits_clone[index], ['digits']: digits};
    digits_clone[index] = {...digits_clone[index], ['amount']: amount};
    setDigitsData(digits_clone);

    console.log(digits, index);

    console.log(digitsData);
  }, [digits, amount]);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomColor: COLOR.dividerColor,
        borderBottomWidth: 2,
      }}>
      <Text style={{color: COLOR.black, fontWeight: 'bold'}}>{index + 1}</Text>
      <TextInput
        style={{...s.textinput, flex: 1}}
        keyboardType={'number-pad'}
        placeholder={'00 - 99'}
        maxLength={2}
        onChangeText={e => {
          setDigits(e);
          if (e.length >= 2) {
            amountfield.current.focus();
          }
        }}
      />
      <TextInput
        style={{...s.textinput, flex: 1, textAlign: 'right'}}
        keyboardType={'number-pad'}
        placeholder={'ငွေအမောက်'}
        onChangeText={e => setAmount(e)}
        ref={amountfield}
        selectTextOnFocus={true}
      />
    </View>
  );
};

export default DigitsField;

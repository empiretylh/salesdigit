import React, {useMemo, useState, useContext, useEffect, useRef} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {COLOR, numberWithCommas, STYLE as s} from '../AssetDatabase';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  SettingsContext,
  TwoDigitsContext,
  ToolsContext,
} from '../context/Context';
import {useNavigationState} from '@react-navigation/native';
const DigitsField = ({item, index, threed = false}) => {
  const [digits, setDigits] = useState();
  const [amount, setAmount] = useState();

  const {digitsData, setDigitsData, newForm, DeleteDigits} =
    useContext(TwoDigitsContext);

  const {vtool, setVTool, setVdata} = !threed && useContext(ToolsContext);

  const amountfield = useRef();

  const [show, setShow] = useState(false);
  const [items, setItems] = useState([1000, 2000, 3000, 4000, 5000, 10000]);

  useMemo(() => {
    let digits_clone = [...digitsData];
    if(digits)
      digits_clone[index] = {...digits_clone[index], ['digits']: digits};
    if(amount)
      digits_clone[index] = {...digits_clone[index], ['amount']: amount};
    setDigitsData(digits_clone);
    if (!threed) {
      setVdata({digits: digits, amount: amount});
    }
 
  }, [digits, amount]);

 useEffect(()=>{
  setDigits(item.digits);
  setAmount(item.amount);
 },[])
  
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: COLOR.dividerColor,
        borderBottomWidth: 2,
      }}>
      <Text
        style={{
          color: COLOR.black,
          fontWeight: 'bold',
          fontSize: 16,
          marginTop: 15,
        }}>
        {index + 1}.
      </Text>

      <TextInput
        style={{...s.textinput, flex: 1, height: 50}}
        keyboardType={'number-pad'}
        defaulValue={item.digits}
        value={item.digits}
        placeholder={threed ? '000 - 999' : '00 - 99'}
        maxLength={threed ? 3 : 2}
        onChangeText={e => {
          setDigits(e);
          if (e.length >= (threed ? 3 : 2)) {
            amountfield.current.focus();
          }
        }}
        onFocus={e => {
          if (!threed) {
            setVTool(false);
          }
        }}
      />

      <View style={{flex: 1, flexDirection: 'column'}}>
        <View
          style={{...s.textinput, flex: 1, height: 50, flexDirection: 'row'}}>
          <TextInput
            style={{
              padding: 0,
              margin: 0,
              flex: 1,
              textAlign: 'right',
              fontSize: 17,
            }}
            keyboardType={'number-pad'}
            placeholder={'ငွေအမောက်'}
            value={item.amount !== 0 && item.amount + ''}
            onChangeText={e => setAmount(e)}
            ref={amountfield}
            selectTextOnFocus={true}
            onFocus={e => {
              if (digits.length >= (threed ? 3 : 2) && !threed) {
                  setVTool(true);
                  setTimeout(()=>{
                    setVTool(false);
                  },20000)
              }
            }}
          />
          <TouchableOpacity onPress={() => setShow(prev => !prev)}>
            <Icon
              name={show ? 'menu-up' : 'menu-down'}
              size={25}
              color={COLOR.black}
            />
          </TouchableOpacity>
        </View>
        {show && (
          <View
            style={{
              ...s.textinput,
              marginTop: 0,
              backgroundColor: COLOR.dsibleColor,
            }}>
            {items.map((item, index) => (
              <Item
                item={item}
                key={index}
                setAmount={setAmount}
                setShow={setShow}
              />
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const Item = ({item, setAmount, setShow}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setAmount(item);
        console.log('Here ', item);
        setShow(false);
      }}>
      <View>
        <Text
          style={{
            fontSize: 17,
            padding: 5,
            color: COLOR.black,
            textAlign: 'right',
          }}>
          {numberWithCommas(item)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default DigitsField;

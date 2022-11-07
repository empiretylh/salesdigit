import React, {useState, useMemo, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {COLOR, numberWithCommas, STYLE as styles} from '../AssetDatabase';
import Icon from 'react-native-vector-icons/Ionicons';
import DigitsField from '../components/digitsfield';
import {TwoDigitsContext} from '../context/Context';
const Home = () => {
  const [showPF, setPF] = useState(false);

  const [digitsData, setDigitsData] = useState([{digits: '', amount: 0}]);

  const newForm = useMemo(() => {
    let d = digitsData[digitsData.length - 1];
    if (d.amount > 0 && d.digits) {
      setDigitsData(prev => [...prev].concat([{digits: '', amount: 0}]));
    }
  }, [digitsData]);

  const SumValue = useMemo(() => {
    let sumtotal = 0;
    if (digitsData) {
      digitsData.map((item, index) => {
        let a = item.amount === '' ? 0 : item.amount;
        sumtotal += parseInt(a);
      });
    }
    return sumtotal;
  }, [digitsData]);

  const DeleteDigits = digits => {
    let digitsdata = [...digitsData];
    let index = digitsdata.indexOf(e => e.digits === digits);
    digitsdata.splice(index, 1);
    setDigitsData(digitsdata);
    console.log('Deleted Digits');
  };

  const bridge_value = useMemo(
    () => ({digitsData, setDigitsData, newForm, DeleteDigits}),
    [digitsData, setDigitsData],
  );

  return (
    <TwoDigitsContext.Provider value={bridge_value}>
      <View style={{flex: 1}}>
        <Text
          style={{
            color: COLOR.black,
            fontWeight: 'bold',
            fontSize: 20,
            padding: 10,
            letterSpacing: 1,
          }}>
          Sales Digits
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity style={styles.tabbutton_active}>
            <Text style={{color: 'white', fontSize: 18}}>2D</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabbutton}>
            <Text style={{color: 'black', fontSize: 18}}>3D</Text>
          </TouchableOpacity>
        </View>
        <View style={{padding: 10}}>
          <View
            style={{
              backgroundColor: COLOR.secondary2d,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: COLOR.black, fontSize: 20}}>
              စုစုပေါင်း - {numberWithCommas(SumValue)} Ks
            </Text>
          </View>
          <View>
            <Text style={{color: COLOR.black, fontSize: 18}}>အမည်</Text>
            <TextInput style={styles.textinput} placeholder={'အမည်'} />
            <TouchableOpacity
              style={{flexDirection: 'row-reverse'}}
              onPress={() => setPF(prev => !prev)}>
              <View style={{flexDirection: 'row'}}>
                <Text style={{color: COLOR.black}}>အပိုအချက်အလက်များ</Text>
                <Icon name={showPF ? 'arrow-up' : 'arrow-down'} size={18} />
              </View>
            </TouchableOpacity>
          </View>
          {showPF ? (
            <View>
              <Text style={{color: COLOR.black, fontSize: 18}}>
                ဖုန်းနံပါတ်
              </Text>
              <TextInput
                style={styles.textinput}
                placeholder={'ဖုန်းနံပါတ်'}
                keyboardType={'number-pad'}
              />
            </View>
          ) : null}
        </View>
        <View
          style={{
            backgroundColor: COLOR.dividerColor,
            width: '100%',
            height: 2,
            marginTop: 5,
            marginBottom: 5,
          }}
        />
        <ScrollView style={{padding: 10}}>
          <KeyboardAvoidingView>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: COLOR.black,
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flex: 1,
                }}>
                ဂဏန်း
              </Text>
              <Text
                style={{
                  color: COLOR.black,
                  fontSize: 18,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flex: 1,
                }}>
                ငွေအမောက်
              </Text>
            </View>
            {digitsData.map((item, index) => (
              <DigitsField key={index} item={item} index={index} />
            ))}
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </TwoDigitsContext.Provider>
  );
};

export default Home;

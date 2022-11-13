import React, {useState, useMemo, useEffect, useCallback, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {COLOR, numberWithCommas, STYLE as styles} from '../AssetDatabase';
import Icon from 'react-native-vector-icons/Ionicons';
import DigitsField from '../components/digitsfield';
import {TwoDigitsContext} from '../context/Context';
import {useMutation} from '@tanstack/react-query';
import data from '../server/data';
import {MessageModalNormal} from '../extra/CustomModal';
const ThreedHome = ({navigation}) => {
  const [showPF, setPF] = useState(false);

  const [digitsData, setDigitsData] = useState([{digits: '', amount: 0}]);

  const [is_uploading, setIsUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const customer_field = useRef(0);
  const cfieldref = useRef(0);
  const pfieldref = useRef(0);
  const phoneno_field = useRef(0);

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

  const bridge_value = useMemo(
    () => ({digitsData, setDigitsData, newForm}),
    [digitsData, setDigitsData],
  );

  const salesDigit = useMutation(data.sales3d, {
    onSuccess: () => {
      setIsUploading(false);
      setUploaded(true);
      setDigitsData([{digits: '', amount: 0}]);
      cfieldref.current.clear();
      pfieldref.current.clear();
      customer_field.current = '';
      phoneno_field.current = '';
    },
    onMutate: () => {
      setIsUploading(true);
      setUploaded(false);
      setDigitsData([{digits: '', amount: 0}]);
    },
    onError: e => {
      setIsUploading(false);
      console.log(e);
    },
  });

  const SaveDigits = () => {
    console.log(digitsData);
    const SaveData = digitsData.filter(obj => obj.amount && obj.digits);
    console.log('Saved Data ::::::', SaveData);
    console.log(SaveData.length);
    if (SaveData.length >= 1 && customer_field.current) {
      salesDigit.mutate({
        customername:
          customer_field.current === 0 ? '' : customer_field.current,
        phoneno: phoneno_field.current === 0 ? '' : phoneno_field.current,
        digits: JSON.stringify(SaveData),
        totalamount: SumValue,
      });
    } else {
      Alert.alert('Cannot Save', 'Please Fill Required Fields', [
        {titile: 'OK'},
      ]);
    }
  };

  return (
    <TwoDigitsContext.Provider value={bridge_value}>
      <MessageModalNormal show={is_uploading} width={'20%'}>
        <ActivityIndicator size={'large'} color={COLOR.primary3d} />
        <Text style={{color: COLOR.black, textAlign: 'center'}}>Creating</Text>
      </MessageModalNormal>
      <MessageModalNormal show={uploaded}>
        <Text
          style={{
            color: COLOR.green,
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: 18,
          }}>
          Successfully Created Data
        </Text>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.primary3d}}
          onPress={() => navigation.navigate('3dreport')}>
          <Text style={{color: COLOR.black}}>Show Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.black}}
          onPress={() => {
            setUploaded(false);
          
          }}>
          <Text style={{color: COLOR.white}}>Close</Text>
        </TouchableOpacity>
      </MessageModalNormal>
      <ScrollView style={{flex: 1}} nestedScrollEnabled={true}>
        <View style={{flexDirection:'row',alignItems:'center',padding:10}}>
          <Icon name='menu' size={30} color={COLOR.black} style={{paddingTop:5}} onPress={()=> navigation.openDrawer()}/>
        <Text
          style={{
            color: COLOR.black,
            fontWeight: 'bold',
            fontSize: 20,
            
            marginLeft:10
          }}>
          Sales 3D Digits
        </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <TouchableOpacity style={styles.tabbutton} onPress={()=> navigation.navigate('stwod')}>
            <Text style={{color: COLOR.black, fontSize: 18}}>2D</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabbutton_active} onPress={()=> navigation.navigate('sthreed')}>
            <Text style={{color: COLOR.white, fontSize: 18}}>3D</Text>
          </TouchableOpacity>
        </View>
        <View style={{padding: 10}}>
          <View
            style={{
              backgroundColor: COLOR.primary3d,
              padding: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: COLOR.white, fontSize: 20}}>
              စုစုပေါင်း - {numberWithCommas(SumValue)} Ks
            </Text>
          </View>
          <View>
            <Text style={{color: COLOR.black, fontSize: 18}}>အမည်</Text>
            <TextInput
              style={styles.textinput}
              placeholder={'အမည်'}
              onChangeText={e => (customer_field.current = e)}
              ref={cfieldref}
            />
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
                onChangeText={e => (phoneno_field.current = e)}
                ref={pfieldref}
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
        <View style={{padding: 10}}>
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
              <DigitsField key={index} item={item} index={index} threed={true} />
            ))}
          </KeyboardAvoidingView>
        </View>
        <View style={{padding: 10}}>
          <TouchableOpacity style={{...styles.button,backgroundColor:COLOR.primary3d}} onPress={() => SaveDigits()}>
            <Text style={{...styles.normaltextsize, color: COLOR.white}}>
              သိမ်းမည်
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.button,backgroundColor:COLOR.primary3d}}
            onPress={() => navigation.navigate('3dreport')}>
            <Text style={{...styles.normaltextsize, color: COLOR.white}}>
              3D စာရင်းချုပ်ကြည့်မည်
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TwoDigitsContext.Provider>
  );
};

export default ThreedHome;

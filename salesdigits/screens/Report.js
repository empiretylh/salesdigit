import {useState, useMemo, useEffect, useCallback, useRef} from 'react';
import * as React from 'react';

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
import {useMutation, useQuery} from '@tanstack/react-query';
import data from '../server/data';
import {MessageModalNormal} from '../extra/CustomModal';
const Report = ({navigation}) => {
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

  const salesDigit = useMutation(data.sales2d, {
    onSuccess: () => {
      setIsUploading(false);
      setUploaded(true);
      setDigitsData([{digits: '', amount: 0}]);
      cfieldref.current.clear();
      pfieldref.current.clear();
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

  const sales_data = useQuery(['sales2dreport'], data.getsold2d);

  sales_data.data && console.log(sales_data.data.data);

  const SumTotalValue = useMemo(() => {
    let value = 0;
    if (sales_data.data) {
      let data = sales_data.data.data;

      data.map((item, index) => {
        value += parseInt(item.totalprice);
      });
    }
    return value;
  }, [sales_data]);

  const ComputeCompoundDigitsData = useMemo(() => {
    let compund = [];

    if (sales_data.data) {
      let data = sales_data.data.data;
      data.map((item, index) => {
        item.two_sales_digits.map((item, index) => {
          compund.push({number: item.number, amount: parseInt(item.amount)});
        });
      });

      let finalresult = {};

      var result = compund.map(item => {
        if (!finalresult[item.number]) {
          finalresult[item.number] = item;
        } else {
          finalresult[item.number].amount =
            finalresult[item.number].amount + parseInt(item.amount);
        }
      });

      return finalresult;
    }
  }, [sales_data]);

  return (
    <TwoDigitsContext.Provider value={bridge_value}>
      <MessageModalNormal show={is_uploading} width={'20%'}>
        <ActivityIndicator size={'large'} color={COLOR.primary2d} />
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
          style={{...styles.button, backgroundColor: COLOR.primary2d}}>
          <Text style={{color: COLOR.black}}>Show Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.black}}
          onPress={() => {
            setUploaded(false);
            navigation.navigate('stwod');
          }}>
          <Text style={{color: COLOR.white}}>Close</Text>
        </TouchableOpacity>
      </MessageModalNormal>
      <ScrollView style={{flex: 1}} nestedScrollEnabled={true}>
        <Text
          style={{
            color: COLOR.black,
            fontWeight: 'bold',
            fontSize: 20,
            padding: 10,
          }}>
          2D Report
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',

            ...styles.textinput,
          }}>
          <TextInput
            style={{flex: 1, padding: 0, margin: 0}}
            placeholder={'Search with Name or Digits'}
          />
          <Icon name="search" size={20} color={COLOR.black} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={() => {
                sales_data.refetch();
                console.log('Sort');
              }}>
              <Icon name="funnel" color={COLOR.black} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log('change style')}
              style={{marginLeft: 10}}>
              <Icon name="grid" color={COLOR.black} size={20} />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{...styles.normaltextsize, color: COLOR.black}}>
              {sales_data.data && numberWithCommas(SumTotalValue)} Ks
            </Text>
          </View>
        </View>
        <View style={styles.divider} />
        <ScrollView style={{padding: 10}}>
          <View>
            <HeadingCell data={['ဂဏန်း', 'ငွေအမောက်']} />
            <ScrollView>
              {sales_data.data &&
                Object.values(ComputeCompoundDigitsData).map((item, index) => (
                  <Cell
                    key={index}
                    data={[item.number, item.amount]}
                    index={index}
                  />
                ))}
            </ScrollView>
          </View>
        </ScrollView>
      </ScrollView>
    </TwoDigitsContext.Provider>
  );
};

export default Report;

const HeadingCell = ({data}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.primary2d,
      }}>
      <Text
        style={{
          ...styles.normalboldsize,
          width: '30%',
          textAlign: 'center',
          ...styles.cell,
        }}>
        {data[0]}
      </Text>
      <Text
        style={{
          ...styles.normalboldsize,
          flex: 1,
          textAlign: 'center',
          ...styles.cell,
        }}>
        {data[1]}
      </Text>
    </View>
  );
};

const Cell = ({data, index}) => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: index % 2 === 1 ? COLOR.secondary2d : COLOR.white,
      }}>
      <Text
        style={{
          ...styles.normalboldsize,
          width: '30%',
          textAlign: 'center',
          ...styles.cell,
        }}>
        {data[0]}
      </Text>
      <Text
        style={{
          ...styles.normalboldsize,
          flex: 1,
          textAlign: 'right',
          ...styles.cell,
          padding:5,
        }}>
        {data[1]}
      </Text>
    </View>
  );
};

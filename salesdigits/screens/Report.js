/* eslint-disable react-native/no-inline-styles */
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
  const [searchtext, setSearchText] = useState('');

  const sales_data = useQuery(['sales2dreport'], data.getsold2d);


  const [sorttype, setSortype] = useState('Digits');

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

      let result = {};

      compund.map(item => {
        if (!result[item.number]) {
          result[item.number] = item;
        } else {
          result[item.number].amount =
            result[item.number].amount + parseInt(item.amount);
        }
      });

      let fresult = Object.values(result);
      let filter_finalresult = fresult.filter(item =>
        item.number.includes(searchtext),
      );
      let sorted_finalresult;

      sorted_finalresult = filter_finalresult.sort((a, b) => {
        if (sorttype === 'Digits') {
          return  parseInt(a.number) - parseInt(b.number);
        } else if (sorttype === 'Price') {
          return parseInt(b.amount) - parseInt(a.amount) ;
        } else {
          return parseInt(a.number) - parseInt(b.number);
        }
      });


      return sorted_finalresult;
    }
  }, [sales_data, searchtext, sorttype]);

  const [showSort, setShowSort] = useState(false);


  const onCloseSort = () => {
    setShowSort(false);
  };

  return (
    <>
      <MessageModalNormal show={showSort} onClose={onCloseSort}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="funnel" size={20} color={COLOR.black} />
          <Text style={{...styles.normalboldsize}}>Sort</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSortype('Price');
            onCloseSort();
          }}>
          <Text style={{...styles.normalboldsize, color: 'white'}}>
            Sort By Price
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}     onPress={() => {
            setSortype('Digits');
            onCloseSort();
          }}>
          <Text style={{...styles.normalboldsize, color: 'white'}}>
            Sort By Digits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>{
          setSortype('Name')
          onCloseSort();
        }}>
          <Text style={{...styles.normalboldsize, color: 'white'}}>
            Sort By Name
          </Text>
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
            onChangeText={e => setSearchText(e)}
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
          <View style={{flexDirection: 'column'}}>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity
              onPress={() => {
                setShowSort(true);
              }}>
              <Icon name="funnel" color={COLOR.black} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => console.log('change style')}
              style={{marginLeft: 10}}>
              <Icon name="grid" color={COLOR.black} size={20} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('change style');
                sales_data.refetch();
              }}
              style={{marginLeft: 10}}>
              <Icon name="refresh" color={COLOR.black} size={20} />
            </TouchableOpacity>
            </View>
          </View>
          <Text>Sorted By {sorttype}</Text>
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
                ComputeCompoundDigitsData.map((item, index) => (
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
    </>
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
          padding: 5,
        }}>
        {data[1]}
      </Text>
    </View>
  );
};

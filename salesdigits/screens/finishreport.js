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
const FinishedReport = ({navigation, route}) => {
  const [searchtext, setSearchText] = useState('');

  const {date,time} = route.params;

  const sales_data = useQuery(['sales2dreport', date,time], data.getfinish2d);

  const [view, setView] =
    useState(true); /*true = Digits View And false = User View */

  const [sorttype, setSortype] = useState('Digits');

  const [detailData, setDetailData] = useState();

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

    if (view) {
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
            return parseInt(a.number) - parseInt(b.number);
          } else if (sorttype === 'Price') {
            return parseInt(b.amount) - parseInt(a.amount);
          } else {
            return parseInt(a.number) - parseInt(b.number);
          }
        });

        return sorted_finalresult;
      }
    }
  }, [sales_data, searchtext, sorttype]);

  const USalesData = useMemo(() => {
    let compund = [];

    if (view === false) {
      if (sales_data.data) {
        let data = sales_data.data.data;

        let search_result = data.filter(e =>
          e.customername.toLowerCase().includes(searchtext.toLowerCase()),
        );

        let sorted_finalresult = search_result.sort((a, b) => {
          if (sorttype === 'Name') {
            return a.customername - b.customername;
          } else if (sorttype === 'Price') {
            return parseInt(b.totalprice) - parseInt(a.totalprice);
          } else {
            return parseInt(a.number) - parseInt(b.number);
          }
        });

        return sorted_finalresult;
      }
    }
  }, [sales_data, searchtext, sorttype]);

  const [showSort, setShowSort] = useState(false);

  const onCloseSort = () => {
    setShowSort(false);
  };

  const [detailshow, setDetailshow] = useState(false);

  const onDetailShow = () => {
    setDetailshow(prev => !prev);
  };

  return (
    <>
      <UserDetail show={detailshow} data={detailData} onClose={onDetailShow} />
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
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSortype('Digits');
            onCloseSort();
          }}>
          <Text style={{...styles.normalboldsize, color: 'white'}}>
            Sort By Digits
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            setSortype('Name');
            onCloseSort();
          }}>
          <Text style={{...styles.normalboldsize, color: 'white'}}>
            Sort By Name
          </Text>
        </TouchableOpacity>
      </MessageModalNormal>

      <View style={{flex: 1}}>
      <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <Icon
              name="arrow-back"
              size={30}
              color={COLOR.black}
              style={{paddingTop: 5}}
              onPress={() => navigation.goBack()}
            />
            <Text
              style={{
                color: COLOR.black,
                fontWeight: 'bold',
                fontSize: 20,

                marginLeft: 10,
              }}>
              2D History Report
            </Text>
          </View>
          <TouchableOpacity
            style={{padding: 5}}
            onPress={() =>
              navigation.navigate('2dluckyreport', {
                date: date,
                time:time,
              })
            }>
            <Icon name="document" size={25} color={COLOR.black} />
          </TouchableOpacity>
        </View>
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
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  setShowSort(true);
                }}>
                <Icon name="funnel" color={COLOR.black} size={20} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  console.log('change style');
                  setView(prev => !prev);
                }}
                style={{marginLeft: 10}}>
                <Icon
                  name="grid"
                  color={view ? COLOR.black : COLOR.secondary2d}
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  sales_data.refetch();
                }}
                style={{marginLeft: 10}}>
                <Icon name="refresh" color={COLOR.black} size={20} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'column', alignItems: 'center'}}>
            <Text>Sorted By {sorttype}</Text>
            {sales_data.data && view ? (
              <Text>{ComputeCompoundDigitsData.length} Digits</Text>
            ) : null}
          </View>

          <View>
            <Text style={{...styles.normaltextsize, color: COLOR.black}}>
              {sales_data.data && numberWithCommas(SumTotalValue)} Ks
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        <ScrollView style={{padding: 10}}>
          {view ? (
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
                <View style={{...styles.divider, padding: 5}} />
              </ScrollView>
            </View>
          ) : (
            <View>
              {USalesData.reverse().map((item, index) => (
                <View key={index}>
                  <UserItem
                    item_data={item}
                    index={index}
                    setDetailData={setDetailData}
                    onDetailShow={onDetailShow}
                  />
                </View>
              ))}
              <View style={styles.divider} />
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
};

const UserItem = ({item_data, index, setDetailData, onDetailShow}) => {
  let data = item_data;

  console.log(item_data);
  let date = new Date(data.datetime);

  return (
    <TouchableOpacity
      style={{
        backgroundColor: index % 2 === 1 ? COLOR.primary2d : COLOR.secondary2d,
        margin: 5,
        padding: 10,
        borderRadius: 15,
        flexDirection: 'column',
      }}
      onPress={() => {
        setDetailData(data);
        onDetailShow();
      }}>
      <Text style={{...styles.normalboldsize, fontSize: 25}}>
        {data.customername}
      </Text>

      {data.phoneno && <Text>{data.phoneno}</Text>}
      <Text style={{color: 'black'}}>{date.toLocaleString()}</Text>
      <Text style={{color: COLOR.black, fontSize: 18}}>
        {numberWithCommas(data.totalprice) + ' Ks'}
      </Text>
    </TouchableOpacity>
  );
};

const UserDetail = ({show, data, onClose}) => {
  return (
    <>
      {data ? (
        <MessageModalNormal
          show={show}
          width={'100%'}
          height={'100%'}
          onClose={onClose}>
          <Text style={{...styles.normalboldsize}}>Details</Text>
          <View style={{flex: 1, marginTop: 10}}>
            <Text style={{...styles.normalboldsize}}>
              Name : {data.customername}
            </Text>
            {data.phoneno && (
              <Text style={{...styles.normalboldsize}}>{data.phoneno}</Text>
            )}

            <Text style={{...styles.normalboldsize}}>
              Total Amount : {numberWithCommas(data.totalprice)} Ks
            </Text>

            <ScrollView style={{padding: 10}}>
              <View>
                <HeadingCell data={['ဂဏန်း', 'ငွေအမောက်']} />
                <ScrollView>
                  {data.two_sales_digits.map((item, index) => (
                    <Cell
                      key={index}
                      data={[item.number, item.amount]}
                      index={index}
                    />
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={{...styles.button, backgroundColor: COLOR.redColor}}
              onPress={() => onClose()}>
              <Text style={{...styles.normalboldsize, color: 'white'}}>
                ပိတ်မည်
              </Text>
            </TouchableOpacity>
          </View>
        </MessageModalNormal>
      ) : null}
    </>
  );
};

export default FinishedReport;

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
        {numberWithCommas(data[1])}
      </Text>
    </View>
  );
};

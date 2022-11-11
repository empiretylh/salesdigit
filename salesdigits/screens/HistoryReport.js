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
import DatePicker from 'react-native-date-picker';

const HistoryReport = ({navigation}) => {
  const [luckynumber, setLuckyNumber] = useState('');

  const [view, setView] =
    useState(true); /*true = Digits View And false = User View */

  const [sorttype, setSortype] = useState('Digits');

  const [detailData, setDetailData] = useState();

  const [is_uploading, setIsUploading] = useState(false);

  const postdata = useMutation(data.finish2d, {
    onSuccess: () => {
      setIsUploading(false);
      setShowAlert(false);
    },
    onMutate: () => {
      setIsUploading(true);
    },
    onError: () => {
      setShowAlert(false);
    },
  });

  const [showSort, setShowSort] = useState(false);

  const onCloseSort = () => {
    setShowSort(false);
  };

  const [detailshow, setDetailshow] = useState(false);

  const onDetailShow = () => {
    setDetailshow(prev => !prev);
  };

  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      <UserDetail show={detailshow} data={detailData} onClose={onDetailShow} />
      <MessageModalNormal show={is_uploading} width={'20%'}>
        <ActivityIndicator size={'large'} color={COLOR.primary2d} />
        <Text style={{color: COLOR.black, textAlign: 'center'}}>Creating</Text>
      </MessageModalNormal>
      <MessageModalNormal show={showAlert} width={'98%'}>
        <Text style={{...styles.normalboldsize}}>
          ပေါက်ဂဏန်းသည် {luckynumber} ဖြစ်သည်မှာ သေချာပါသလား?
        </Text>
        <Text style={{color: COLOR.black, padding: 5}}>
          ဤ functions သည် လက်ရှိ စာရင်းပြုလုပ်နေသာ ဒေတာများကို ပေါက်ဂဏန်းအတူ
          မှတ်သားထားမည်ဖြစ်ပါသည်။ ၎င်းဒေတာများအား Report အကန့်တွင်
          မမြင်နိုင်တော့ပါ။
        </Text>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.green}}
          onPress={() => {
            postdata.mutate({
              luckynumber,
              enddate: date,
            });
            setShowAlert(false);
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
            သေချာပါသည်။
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.redColor}}
          onPress={() => {
            setShowAlert(false);
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
            ပယ်ဖျက်မည်
          </Text>
        </TouchableOpacity>
      </MessageModalNormal>
      <View style={{flex: 1}}>
        <Text
          style={{
            color: COLOR.black,
            fontWeight: 'bold',
            fontSize: 20,
            padding: 10,
          }}>
          2D
        </Text>
        <View style={{padding: 10}}>
          <Text
            style={{
              color: 'black',
              ...styles.normaltextsize,
              fontWeight: 'bold',
            }}>
            ပေါက်ဂဏန်းထည့်ရန်
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',

              ...styles.textinput,
            }}>
            <TextInput
              style={{...styles.textinput, padding: 0, margin: 0, flex: 1}}
              placeholder={'ပေါက်ဂဏန်းထည့်ရန်'}
              onChangeText={e => setLuckyNumber(e)}
              keyboardType={'number-pad'}
              maxLength={2}
            />
            <Icon
              name={
                luckynumber.length === 2 ? 'checkmark-circle' : 'close-circle'
              }
              size={20}
              color={luckynumber.length === 2 ? COLOR.green : COLOR.redColor}
            />
          </View>
          <Text
            style={{
              color: 'black',
              ...styles.normaltextsize,
              fontWeight: 'bold',
            }}>
            ရက်စွဲ
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              ...styles.textinput,
            }}>
            <TextInput
              style={{...styles.textinput, padding: 0, margin: 0, flex: 1}}
              placeholder={'Search with Name or Digit'}
              value={date.toLocaleString()}
            />
            <Icon
              name="calendar-outline"
              size={20}
              color={COLOR.black}
              onPress={() => setOpen(true)}
            />
            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={date => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />
          </View>
          <TouchableOpacity
            style={{...styles.button, backgroundColor: COLOR.black}}
            onPress={() => {
              if (luckynumber) {
                setShowAlert(true);
              } else {
                Alert.alert('', 'ပေါက်ဂဏန်းထည့်ပါ။', [{title: 'OK'}]);
              }
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                ...styles.normalboldsize,
                color: 'white',
              }}>
              လက်ရှိဒေတာများအား သိမ်းမည်
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.divider} />
        <View style={{padding: 10}}>
          <TouchableOpacity
            style={{...styles.button, backgroundColor: COLOR.primary2d}}
            onPress={() => navigation.navigate('luckyreport')}>
            <Text style={{fontWeight: 'bold', ...styles.normalboldsize}}>
              ယနေ့ ဂဏန်းပေါက်သော သူများကိုကြည့်မည်
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              ...styles.button,
              backgroundColor: COLOR.secondary2d,
              marginTop: 10,
            }}>
            <Text style={{fontWeight: 'bold', ...styles.normalboldsize}}>
              ဒေတာအဟောင်းများကို ကြည့်မည်။
            </Text>
          </TouchableOpacity>
        </View>
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

export default HistoryReport;

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

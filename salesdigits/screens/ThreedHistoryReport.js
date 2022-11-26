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

  const [detailData, setDetailData] = useState([]);

  const [is_uploading, setIsUploading] = useState(false);

  const sales_data = useQuery(['sales3dreport'], data.getsold3d);

  const postdata = useMutation(data.finish3d, {
    onSuccess: () => {
      setIsUploading(false);
      setShowAlert(false);
      luckynumberref.current.clear();
      titleRef.current.clear();
      report.refetch();

      setDate(new Date());
    },
    onMutate: () => {
      setIsUploading(true);
    },
    onError: () => {
      setShowAlert(false);
      luckynumberref.current.clear();
      setDate(new Date());
      setIsUploading(false);
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

  const luckynumberref = useRef();
  const titleRef = useRef();

  const titletextRef = useRef();

  const report = useQuery(
    ['3d-lucky-report', date.toDateString()],
    data.getfinish3d,
  );

  report.data && console.log(report.data.data, 'Hey Report Data');

  return (
    <>
      <MessageModalNormal show={is_uploading} width={'20%'}>
        <ActivityIndicator size={'large'} color={COLOR.primary3d} />
        <Text style={{color: COLOR.black, textAlign: 'center'}}>Creating</Text>
      </MessageModalNormal>
      <MessageModalNormal
        show={showAlert}
        width={'98%'}
        onClose={() => setShowAlert(false)}>
        <Text style={{...styles.normalboldsize}}>
          ပေါက်ဂဏန်းသည် {luckynumber} ဖြစ်သည်မှာ သေချာပါသလား?
        </Text>
        <Text style={{color: COLOR.black, padding: 5}}>
          ဤ functions သည် လက်ရှိ စာရင်းပြုလုပ်နေသာ ဒေတာများကို
          ပေါက်ဂဏန်းနှင့်အတူ မှတ်သားထားမည်ဖြစ်ပါသည်။ ၎င်းဒေတာများအား Report
          အကန့်တွင် မမြင်နိုင်တော့ပါ။
        </Text>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.green}}
          onPress={() => {
            if (sales_data.data && report.data && report.data.data === 0) {
              if (sales_data.data.data.length >= 1 && titletextRef.current) {
                postdata.mutate({
                  luckynumber: luckynumber,
                  enddate: date,
                  title: titletextRef.current,
                });
                setShowAlert(false);
              } else {
                alert('No Report 3D Data');
              }
            } else {
              alert(
                'ယနေ့ပေါက်ဂဏန်း တစ်ခေါက်ထည့်ပြီးသောကြောင့် ထပ်ထည့်၍ မရတော့ပါ။ နောက်နေ့ (သို့) ရက်စွဲပြောင်းပြီးမှထည့်ပါ။',
              );
            }
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',

            justifyContent: 'space-between',
          }}>
          <View
            style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
            <Icon
              name="menu"
              size={30}
              color={COLOR.black}
              style={{paddingTop: 5}}
              onPress={() => navigation.openDrawer()}
            />
            <Text
              style={{
                color: COLOR.black,
                fontWeight: 'bold',
                fontSize: 20,

                marginLeft: 10,
              }}>
              Save 3D Digits
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              report.refetch();
              sales_data.refetch();
            }}>
            <Icon
              name="refresh"
              size={25}
              color={COLOR.black}
              style={{
                padding: 10,
              }}
            />
          </TouchableOpacity>
        </View>
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
              value={luckynumber}
              onChangeText={e => setLuckyNumber(e)}
              keyboardType={'number-pad'}
              maxLength={3}
              ref={luckynumberref}
            />
            <Icon
              name={
                luckynumber.length === 3 ? 'checkmark-circle' : 'close-circle'
              }
              size={20}
              color={luckynumber.length === 3 ? COLOR.green : COLOR.redColor}
            />
          </View>
          <Text
            style={{
              color: 'black',
              ...styles.normaltextsize,
              fontWeight: 'bold',
            }}>
            ခေါင်းစဉ်
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              ...styles.textinput,
            }}>
            <TextInput
              style={{...styles.textinput, padding: 0, margin: 0, flex: 1}}
              placeholder={'ခေါင်းစဉ်ထည့်ရန်'}
              ref={titleRef}
              onChangeText={e => (titletextRef.current = e)}
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
              value={date.toDateString()}
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
              mode={'date'}
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
          {report.isFetching ? 
            <ActivityIndicator size={'large'} color={COLOR.primary3d}/>
            : report.data && report.data.data !== 0 ? (
            <TouchableOpacity
              style={{...styles.button, backgroundColor: COLOR.primary3d}}
              onPress={() =>
                navigation.navigate('3dluckyreport', {
                  date: new Date().toDateString(),
                })
              }>
              <Text
                style={{
                  fontWeight: 'bold',
                  ...styles.normalboldsize,
                  color: COLOR.white,
                }}>
                ယနေ့ ဂဏန်းပေါက်သော သူများကိုကြည့်မည်
              </Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity
            style={{...styles.button, backgroundColor: COLOR.secondary3d}}
            onPress={() => navigation.navigate('3dhistoryallreport')}>
            <Text
              style={{
                fontWeight: 'bold',
                ...styles.normalboldsize,
                color: COLOR.black,
              }}>
              ဒေတာအဟောင်းများကို ကြည့်မည်
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
export default HistoryReport;

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


  const sales_data = useQuery(['sales2dreport'], data.getsold2d);

 
  const postdata = useMutation(data.finish2d, {
    onSuccess: () => {
      setIsUploading(false);
      setShowAlert(false);
      luckynumberref.current.clear();
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

  const report = useQuery(
    ['lucky-report', date.toDateString()],
    data.getCheckTwoDigits,
  );

  report.data && console.log(report.data.data);
  

  const checkData = ()=>{
    let a = report.data.data;
    
    if(a[0]===0 && a[1] === 0){
      console.log('m')
      return 'm'
    }else if (a[0]>=1 && a[1] >= 1){
      return true;
    }
      else{
      console.log('e')
      return 'e'
    }
  }

  return (
    <>
      <MessageModalNormal show={is_uploading} width={'20%'} >
        <ActivityIndicator size={'large'} color={COLOR.primary2d} />
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
          ဤ functions သည် လက်ရှိ စာရင်းပြုလုပ်နေသာ ဒေတာများကို ပေါက်ဂဏန်းနှင့်အတူ
          မှတ်သားထားမည်ဖြစ်ပါသည်။ ၎င်းဒေတာများအား Report အကန့်တွင်
          မမြင်နိုင်တော့ပါ။
        </Text>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.green}}
          onPress={() => {
            if (sales_data.data && checkData) {
              if (sales_data.data.data.length >= 1) {
                postdata.mutate({
                  luckynumber,
                  enddate: date,
                  time:checkData(),
                });
                setShowAlert(false);
              } else {
                alert('No Report Data');
              }
            } else {
              alert('You can input 2 Lucky Number in One Day');
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
        <View style={{flexDirection:'row',alignItems:'center',padding:10}}>
          <Icon name='menu' size={30} color={COLOR.black} style={{paddingTop:5}} onPress={()=> navigation.openDrawer()}/>
        <Text
          style={{
            color: COLOR.black,
            fontWeight: 'bold',
            fontSize: 20,
           
            marginLeft:10
          }}>
          Save 2D Digits
        </Text>
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
              maxLength={2}
              ref={luckynumberref}
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
          {report.data && report.data.data[0]>=1 ? (
            <TouchableOpacity
              style={{...styles.button, backgroundColor: COLOR.primary2d}}
              onPress={() =>
                navigation.navigate('2dluckyreport', {
                  date: new Date().toDateString(),
                  time: 'm'
                })
              }>
              <Text style={{fontWeight: 'bold', ...styles.normalboldsize}}>
                ယနေ့ {report.data.data[0]} ဂဏန်းပေါက်သော သူများကိုကြည့်မည်
              </Text>
            </TouchableOpacity>
          ) : null}
          {report.data && report.data.data[1]>=1 ? (
            <TouchableOpacity
              style={{...styles.button, backgroundColor: COLOR.primary2d}}
              onPress={() =>
                navigation.navigate('2dluckyreport', {
                  date: new Date().toDateString(),
                  time: 'e'
                })
              }>
              <Text style={{fontWeight: 'bold', ...styles.normalboldsize}}>
                ယနေ့ {report.data.data[1]} ဂဏန်းပေါက်သော သူများကိုကြည့်မည်
              </Text>
            </TouchableOpacity>
          ) : null}

          <View style={styles.divider}/>

        <TouchableOpacity
              style={{...styles.button, backgroundColor: COLOR.secondary2d}}
              onPress={() =>
                navigation.navigate('2dhistoryallreport')
              }>
              <Text style={{fontWeight: 'bold', ...styles.normalboldsize}}>
                ဒေတာအဟောင်းများကို ကြည့်မည်
                 </Text>
            </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
export default HistoryReport;

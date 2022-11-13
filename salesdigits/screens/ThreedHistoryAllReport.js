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

const HistoryAllReport = ({navigation}) => {
  const [luckynumber, setLuckyNumber] = useState('');

  const [view, setView] =
    useState(true); /*true = Digits View And false = User View */

  const [sorttype, setSortype] = useState('Digits');

  const [detailData, setDetailData] = useState();

  const [is_uploading, setIsUploading] = useState(false);
  const [date, setDate] = useState();
  const [open, setOpen] = useState(false);

  const [showAlert, setShowAlert] = useState(false);

  const luckynumberref = useRef();

  const report = useQuery(['3dhistory-report'], data.getHistory3d);

  report.data && console.log(report.data.data);

  const reportfilter = useMemo(() => {
    if (report.data) {
      let result = report.data.data.filter((item, index) => {
        const a = new Date(item.end_datetime);
        if (date) {
          const b = date;
          if (
            a.getDate() === b.getDate() &&
            a.getMonth() === b.getMonth() &&
            a.getYear() === b.getYear()
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          return true;
        }
      });

      return result.reverse();
    }
  }, [report.data, date]);

  const Item = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={{margin: 5}}
        onPress={() =>
          navigation.navigate('3dfinishreport', {
            date: new Date(item.end_datetime).toDateString(),
          })
        }>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor:
              index % 2 == 1 ? COLOR.primary3d : COLOR.secondary3d,
            borderRadius: 15,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: COLOR.white,
              backgroundColor: COLOR.black,
              fontSize: 25,
              fontWeight: 'bold',
              padding: 20,
            }}>
            {item.luckyNumber}
          </Text>
          <Text style={{color: COLOR.white, fontSize: 20, marginLeft: 10}}>
            {new Date(item.end_datetime).toLocaleString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <MessageModalNormal show={is_uploading} width={'20%'}>
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
          ဤ functions သည် လက်ရှိ စာရင်းပြုလုပ်နေသာ ဒေတာများကို ပေါက်ဂဏန်းအတူ
          မှတ်သားထားမည်ဖြစ်ပါသည်။ ၎င်းဒေတာများအား Report အကန့်တွင်
          မမြင်နိုင်တော့ပါ။
        </Text>
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.green}}
          onPress={() => {
            if (sales_data.data && report.data && report.data.data === 0) {
              if (sales_data.data.data.length >= 1) {
                postdata.mutate({
                  luckynumber,
                  enddate: date,
                });
                setShowAlert(false);
              } else {
                alert('Error');
              }
            } else {
              alert('Erorr');
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
          <Icon name='arrow-back' size={30} color={COLOR.black} style={{paddingTop:5}} onPress={()=> navigation.goBack()}/>
        <Text
          style={{
            color: COLOR.black,
            fontWeight: 'bold',
            fontSize: 20,
            
            marginLeft:10
          }}>
           3D History
        </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            ...styles.textinput,
          }}>
          <TextInput
            style={{...styles.textinput, padding: 0, margin: 0, flex: 1}}
            placeholder={'Select Date to Search'}
            value={date && date.toDateString()}
          />
          <Icon
            name={date ? 'close-outline' : 'calendar-outline'}
            size={20}
            color={COLOR.black}
            onPress={() => (date ? setDate(null) : setOpen(true))}
          />
          <DatePicker
            modal
            open={open}
            mode={'date'}
            date={new Date()}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
        </View>
        <View>
          {report.data
            ? reportfilter.map((item, index) => (
                <Item index={index} item={item} key={index} />
              ))
            : null}
        </View>
      </View>
    </>
  );
};

export default HistoryAllReport;

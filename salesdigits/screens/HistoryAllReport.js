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
  const [deletedata, setDeleteData] = useState([]);
  const [showDelete, setShowDelete] = useState(false);

  const luckynumberref = useRef();

  const report = useQuery(['history-report'], data.getHistory2d);

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

  const deleteItem = useMutation(data.deletefinish2d, {
    onSuccess: () => {
      report.refetch();
      setIsUploading(false);
    },
    onMutate: () => {
      setIsUploading(true);
    },
    onError: () => {
      setIsUploading(false);
    },
  });

  const Item = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={{margin: 5}}
        onLongPress={() => {
          setDeleteData(item);
          setShowDelete(true);
        }}
        onPress={() =>
          navigation.navigate('2dfinishreport', {
            date: item.end_datetime,
          })
        }>
        <View
          style={{
            flexDirection: 'row',
            backgroundColor:
              index % 2 == 1 ? COLOR.primary2d : COLOR.secondary2d,
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
          <View style={{flexDirection:'column',marginLeft:10}}>
         {item.title && <Text style={{color:COLOR.black,fontWeight:'bold',fontSize:18}}>{item.title}</Text>}
          <Text style={{color: COLOR.black, fontSize: 18}}>
            {new Date(item.end_datetime).toLocaleString()}
          </Text>
          </View>
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
        show={showDelete}
        onClose={() => setShowDelete(false)}>
        {deletedata ? (
          <Text
            style={{
              color: COLOR.redColor,
              fontWeight: 'bold',
              fontSize: 20,
              textAlign: 'center',
            }}>
            ဤ {deletedata.luckyNumber} ဂဏန်းနှင့် သတ်ဆိုင်သော ဒေတာများကို
            ဖျက်မှာသေချာပါသလား
          </Text>
        ) : null}
        <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.redColor}}
          onPress={() => {
            deleteItem.mutate({
              datetime: deletedata.end_datetime,
            });

            setShowDelete(false);
          }}>
          <Text style={{...styles.normaltextsize, color: 'white'}}>
            Delete Anyway
          </Text>
        </TouchableOpacity>
         <TouchableOpacity
          style={{...styles.button, backgroundColor: COLOR.primary3d}}
          onPress={() => {
              setShowDelete(false);
          }}>
          <Text style={{...styles.normaltextsize, color: 'white'}}>
            Cancel
          </Text>
        </TouchableOpacity>
      </MessageModalNormal>
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
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

          {report.isFetching?
            <ActivityIndicator size={'large'} color={COLOR.primary2d}/>:
            report.data
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

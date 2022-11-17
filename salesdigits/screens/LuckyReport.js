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
const LuckyReport = ({navigation, route}) => {
  const {date,time} = route.params;
  const report = useQuery(['lucky-report', date,time], data.getfinish2d);

  const [searchtext, setSearchText] = useState('');

  const LuckyData = useMemo(() => {
    if (report.data) {
      const data = report.data.data.filter((item, index) => {
        var luckynumber = item.luckyNumber_two;
        var final;
        var clone = item.two_sales_digits.map((item, index) => {
          // console.log(item.number, luckynumber);
          if (item.number === luckynumber) {
            // console.log('true');
            final = 1;
          } else {
            if (final === 0) {
              final = 0;
            }
          }
        });

        return (
          final &&
          item.customername.toLowerCase().includes(searchtext.toLowerCase())
        );
      });
      return data;
    }
  }, [report.data, searchtext]);

  const LuckyRoundData = useMemo(() => {
    if (report.data) {
      const data = report.data.data.filter((item, index) => {
        var luckynumber = item.luckyNumber_two;
        var final;
        var clone = item.two_sales_digits.map((item, index) => {
          // console.log(item.number, luckynumber);
          var number = item.number;
          if (luckynumber === number[1] + number[0]) {
            console.log('true');
            final = 1;
          } else {
            if (final === 0) {
              final = 0;
            }
          }
        });

        return (
          final &&
          item.customername.toLowerCase().includes(searchtext.toLowerCase())
        );
      });
      return data;
    }
  }, [report.data]);

  const [detailData, setDetailData] = useState();

  const [detailshow, setDetailshow] = useState(false);

  const onDetailShow = () => {
    setDetailshow(prev => !prev);
  };

  const [round, setRound] = useState(false);

  return (
    <View style={{flex: 1}}>
      <UserDetail
        show={detailshow}
        data={detailData}
        onClose={onDetailShow}
        round={round}
      />
      <View
        style={{
          backgroundColor: COLOR.primary2d,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon
          name="arrow-back"
          size={30}
          color={COLOR.black}
          style={{paddingTop: 5, position: 'absolute', left: 5}}
          onPress={() => navigation.goBack()}
        />

        <Text style={{color: 'black', fontSize: 40, fontWeight: 'bold'}}>
          {report.data && report.data.data[0].luckyNumber_two}
        </Text>
        <Text
          style={{position: 'absolute', bottom: 5, right: 5, color: 'white'}}>
          {new Date(date).toDateString()}
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          ...styles.textinput,
        }}>
        <TextInput
          style={{flex: 1, padding: 0, margin: 0}}
          placeholder={'Search with Name'}
          onChangeText={e => setSearchText(e)}
        />
        <Icon name="search" size={20} color={COLOR.black} />
      </View>
      {report.isFetching && report.isLoading ? (
        <ActivityIndicator size={'large'} color={COLOR.primary2d} />
      ) : (
        <ScrollView style={{flex: 1, padding: 10}}>
          {report.data ? (
            <View>
              <Text
                style={{color: COLOR.black, fontWeight: 'bold', fontSize: 18}}>
                ဂဏန်းပေါက်သူများ {LuckyData.length}
              </Text>
              <View style={styles.divider} />
              {LuckyData.map((item, index) => (
                <UserItem
                  item_data={item}
                  index={index}
                  setDetailData={setDetailData}
                  onDetailShow={onDetailShow}
                  round={false}
                  setRound={setRound}
                  key={index}
                />
              ))}
              <View style={styles.divider} />
              <Text
                style={{color: COLOR.black, fontWeight: 'bold', fontSize: 18}}>
                ဂဏန်း Round ရသူများ {LuckyRoundData.length}
              </Text>
              <View style={styles.divider} />
              {LuckyRoundData.map((item, index) => (
                <UserItem
                  item_data={item}
                  index={index}
                  setDetailData={setDetailData}
                  onDetailShow={onDetailShow}
                  round={true}
                  setRound={setRound}
                  key={index}
                />
              ))}
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  );
};

const UserItem = ({
  item_data,
  index,
  setDetailData,
  onDetailShow,
  round,
  setRound,
}) => {
  let data = item_data;

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
        setRound(round);
      }}>
      <Text style={{...styles.normalboldsize, fontSize: 25}}>
        {data.customername}
      </Text>

      {data.phoneno && <Text>{data.phoneno}</Text>}
      <Text style={{color: 'black'}}>{date.toLocaleString()}</Text>
      <Text style={{color: COLOR.redColor, fontSize: 18, fontWeigth: 'bold'}}>
        {numberWithCommas(
          SumValue(
            LuckyDigitsFilter(
              data.two_sales_digits,
              data.luckyNumber_two,
              round,
            ),
          ),
        )}
        Ks
      </Text>
    </TouchableOpacity>
  );
};

const LuckyDigitsFilter = (data, luckynumber, round) => {
  return !round
    ? data.filter(item => item.number === luckynumber)
    : data.filter(item => luckynumber === item.number[1] + item.number[0]);
};

const SumValue = data => {
  let value = 0;
  data.map((item, index) => {
    value += parseInt(item.amount);
  });
  return value;
};

const UserDetail = ({show, data, onClose, round}) => {
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
              Total Amount :{' '}
              {numberWithCommas(
                SumValue(
                  LuckyDigitsFilter(
                    data.two_sales_digits,
                    data.luckyNumber_two,
                    round,
                  ),
                ),
              )}
              Ks
            </Text>
            <ScrollView style={{padding: 10}}>
              <View>
                <HeadingCell data={['ဂဏန်း', 'ငွေအမောက်']} />
                <ScrollView>
                  {LuckyDigitsFilter(
                    data.two_sales_digits,
                    data.luckyNumber_two,
                    round,
                  ).map((item, index) => (
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

export default LuckyReport;

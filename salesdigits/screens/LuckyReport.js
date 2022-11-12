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

const LuckyReport = ({navigation, route}) => {
  const {date} = route.params;
  const report = useQuery(
    ['lucky-report', date.toUTCString],
    data.getfinish2d,
  );

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          backgroundColor: COLOR.primary2d,
          padding: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'black', fontSize: 40, fontWeight: 'bold'}}>
          {327}
        </Text>
        <Text
          style={{position: 'absolute', bottom: 5, right: 5, color: 'white'}}>
          {date.toLocaleString()}
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
      <View style={{flex: 1, alignItems: 'center'}}>
        {report.isLoading && <ActivityIndicator size={'large'} />}
      </View>
    </View>
  );
};

export default LuckyReport;

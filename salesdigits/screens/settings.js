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
const Settings = ({navigation}) => {
  const profile = useQuery(['profile'], data.getProfile);

  const [searchtext, setSearchText] = useState('');

  return <View style={{flex: 1}}>
    <Text>Profile</Text>
  </View>;
};

export default Settings;

/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import EncryptedStorage from 'react-native-encrypted-storage';
import {
  STYLE as s,
  COLOR as C,
  isArryHasData,
  IMAGE as I,
  COLOR,
} from '../AssetDatabase';
import axios from 'axios';
import {ScrollView} from 'react-native-gesture-handler';
import {MessageModalNormal} from '../extra/CustomModal';
const Pricing = ({navigation}) => {
  const [modalVisible, SetmodalVisible] = useState(false);

  const [pricing, setPricing] = useState(null);
  const [requestPrice, setRequestPrice] = useState(null);
  const [pdata, setPddata] = useState(null);

  useEffect(() => {
    GetPrice();
    LoadProfile();
  }, []);

  const LoadProfile = () => {
    axios
      .get('/api/profile/')
      .then(res => {
        console.log(res.data);
        setPddata(res.data);
      })
      .catch(res => {
        console.log(res);
      });
  };

  const GetPrice = () => {
    SetmodalVisible(true);
    axios
      .get('sd/api/pricing/')
      .then(res => {
        console.log(res.data);
        setPricing(res.data.pricing);
        setRequestPrice(res.data.pr_request);
        SetmodalVisible(false);
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  };

  const RequestPrice = id => {
    console.log('Requesting Price');
    if (isArryHasData(requestPrice)) {
    } else {
      SetmodalVisible(true);
      axios
        .post('sd/api/pricing/', {type: id})
        .then(res => {
          console.log(res.data);
          SetmodalVisible(false);
          GetPrice();
        })
        .catch(err => {
          console.log(err);
          SetmodalVisible(false);
        });
    }
  };

  const DeleteRequest = id => {
    console.log('Deleteing Request Price');
    SetmodalVisible(true);
    axios
      .delete('sd/api/pricing/', {
        params: {
          type: id,
        },
      })
      .then(res => {
        console.log(res.data);
        SetmodalVisible(false);
        GetPrice();
      })
      .catch(err => {
        console.log(err);
        SetmodalVisible(false);
      });
  };

  const Plan = (item, request) => {
    return (
      <View style={{flexDirection: 'column'}}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              padding: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                width: (C.windowWidth * 90) / 3.5,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {item.title}
              </Text>
              <Text style={{color: 'black', fontSize: 15}}>
                {item.days} Days
              </Text>
            </View>
            <View
              style={{
                backgroundColor: 'black',
                height: 60,
                padding: 0.5,
                margin: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center',
                width: (C.windowWidth * 90) / 5,
              }}>
              <Text
                style={{
                  color: 'red',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {item.discount}
              </Text>
              <Text style={{color: 'red'}}>Discount</Text>
            </View>
            <View
              style={{
                backgroundColor: 'black',
                height: 60,
                padding: 0.5,
                margin: 10,
              }}
            />
            <View
              style={{
                flexDirection: 'column',
                width: (C.windowWidth * 90) / 2.5,
              }}>
              <Text
                style={{
                  color: 'black',
                  fontSize: 20,
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}>
                {item.price} MMK
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          disabled={modalVisible}
          style={[
            {
              backgroundColor: COLOR.primary3d,
              borderRadius: 15,
              margin: 5,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            },
            request && {...s.black_button},
          ]}
          onPress={() =>
            request ? DeleteRequest(item.id) : RequestPrice(item.id)
          }>
          {request ? (
            <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
              Cancel Request
            </Text>
          ) : (
            <>
              <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                Buy{' '}
              </Text>
              <Text style={{fontSize: 19, color: 'yellow', fontWeight: 'bold'}}>
                {item.title}{' '}
              </Text>
              <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>
                Package
              </Text>
            </>
          )}
        </TouchableOpacity>
        {request ? (
          <TouchableOpacity
            style={{
              backgroundColor: COLOR.black,
              borderRadius: 15,
              margin: 5,
              padding: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() =>
              Linking.openURL(axios.defaults.baseURL + '/sd/howtopaymoney/')
            }>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              How to pay money
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  if (pricing && requestPrice && pdata) {
    return (
      <ScrollView style={styles.container}>
        <MessageModalNormal show={modalVisible} width={'20%'}>
          <ActivityIndicator size={'large'} color={C.primary2d} />
          <Text style={{color: C.black, textAlign: 'center'}}>Loading</Text>
        </MessageModalNormal>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{...s.bold_label, color: 'white', fontSize: 20}}>
            Pricing
          </Text>

          <TouchableOpacity onPress={() => navigation.navigate('settings')}>
            {pdata === null ? (
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
                }}
                style={{width: 40, height: 40, borderRadius: 30}}
              />
            ) : (
              <Image
                source={
                  pdata.profileimage
                    ? {
                        uri: axios.defaults.baseURL + pdata.profileimage,
                      }
                    : {
                        uri: 'https://cdn-icons-png.flaticon.com/512/3177/3177440.png',
                      }
                }
                style={{width: 40, height: 40, borderRadius: 30}}
              />
            )}
          </TouchableOpacity>
        </View>
        {pdata.is_plan ? (
          <View
            style={{
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 15,
              marginTop: 15,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 18,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              You have a purchased plan
            </Text>
            <Text
              style={{
                color: 'red',
                fontSize: 15,
                textAlign: 'center',
              }}>
              Your plan will be expire in {new Date(pdata.end_d).toDateString()}
            </Text>
          </View>
        ) : null}

        {/* Request Plan */}
        {isArryHasData(requestPrice) ? (
          <View
            style={{
              flexDirection: 'column',
              backgroundColor: 'yellow',
              padding: 2,
              marginTop: 15,
              borderRadius: 15,
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={I.app_logo}
                style={{width: 30, height: 30}}
                resizeMode={'contain'}
              />
              <Text
                style={{
                  ...s.bold_label,
                  color: 'black',
                  fontSize: 18,
                  marginLeft: 5,
                }}>
                Requested Plan
              </Text>
            </View>
            <View style={{margin: 2, marginTop: 0}}>
              {requestPrice.map((item, index) => (
                <View key={index}>{Plan(item.rq_price, true)}</View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Plans */}
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: 'white',
            padding: 2,
            marginTop: 15,
            borderRadius: 15,
            alignItems: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={I.app_logo}
              style={{width: 30, height: 30}}
              resizeMode={'contain'}
            />
            <Text
              style={{
                ...s.bold_label,
                color: 'black',
                fontSize: 18,
                marginLeft: 5,
              }}>
              PLANS
            </Text>
          </View>
          <View style={{margin: 2, marginTop: 0}}>
            {pricing.map((item, index) => (
              <View key={index}>{Plan(item)}</View>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  }
  return (
    <View>
      <Text>Loading</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.secondary3d,
    padding: 10,
  },
  appbar: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userdebtinfo: {
    backgroundColor: 'orange',
    height: 150,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginBottom: 5,
  },
  usertotaldebt: {
    backgroundColor: '#346beb',
    height: 80,
    borderRadius: 15,
    padding: 10,
    margin: 10,
    marginTop: 0,
  },
  citem: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    borderRadius: 15,
  },
});

export default Pricing;

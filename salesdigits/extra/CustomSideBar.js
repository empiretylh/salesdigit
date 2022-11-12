import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {useMutation, useQuery} from '@tanstack/react-query';
import data from '../server/data';

const CustomDrawer = props => {


	const profiledata = useQuery(['profile'],data.getProfile)


	return (
		<View style={{flex: 1}}>
			<View
				style={{
					paddingTop: 30,
					paddingBottom: 10,
					paddingLeft: 10,
					paddingRight: 5,
					backgroundColor: '#486575',
				}}>
				<Image
					source={{
						uri: 'https://i.pinimg.com/564x/2a/7e/54/2a7e54108b30e1bf4588b375eebeb3b0.jpg',
					}}
					style={{
						width: 80,
						height: 80,
						borderRadius:100,
					}}
				/>
				<View>
					<View style={{marginTop: 10,marginLeft:10}}>
						<Text style={{fontSize: 16, fontWeight: 'bold', color: 'white'}}>
							{profiledata.data && profiledata.data.data.name}
						</Text>
						<Text style={{fontSize: 15, color: 'white'}}>{profiledata.data && profiledata.data.data.username}</Text>
					</View>
				</View>
			</View>
			<DrawerContentScrollView>
				<DrawerItemList {...props} />
			</DrawerContentScrollView>
			<View style={{flex: 1, position: 'absolute', bottom: 0}}>
				<TouchableOpacity>
					<Text>LogOut</Text>
				</TouchableOpacity>
				<Text>Version 1.0</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	pfimage: {
		width: 55,
		height: 55,
		borderRadius: 50,
	},
});

export default CustomDrawer;

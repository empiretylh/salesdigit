import axios from 'axios';


class Database (){
	login({queryKey}){
		const [_,username,password] = queryKey;

		return axios.post("/auth/login/",{username:username,password});
	}

	regiser({queryKey}){
		const [_,username,password,name,phoneno] = queryKey;

		return axois.post("auth/salesdigit/register/",{username:username,name:name,phoneno:phoneno,password:password});
	}



}	
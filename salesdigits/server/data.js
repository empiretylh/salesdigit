import axios from 'axios';

class Database {
  login({queryKey}) {
    const [_, username, password] = queryKey;

    return axios.post('/auth/login/', {username: username, password});
  }

  register(data) {
    console.log('Resigerrrying');
    return axios.post('/auth/salesdigit/register/', data);
  }

  finish2d(data){
    return axios.post('/sd/api/finishtwodigit/',data);
  }

    getfinish2d(data){
    return axios.get('/sd/api/finishtwodigit/');
  }

  sales2d(data) {
    return axios.post('/sd/api/salestwodigit/', data);
  }

  getsold2d(data) {
    return axios.get('/sd/api/salestwodigit/');
  }


}

export default new Database();

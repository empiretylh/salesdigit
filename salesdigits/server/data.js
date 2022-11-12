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

  finish2d(data) {
    return axios.post('/sd/api/finishtwodigit/', data);
  }

  getfinish2d({queryKey}) {
    const [_, date] = queryKey;
    console.log(date);

    return axios.get('/sd/api/finishtwodigit/', {
      params: {
        datetime: date,
      },
    });
  }

  sales2d(data) {
    return axios.post('/sd/api/salestwodigit/', data);
  }

  getsold2d(data) {
    return axios.get('/sd/api/salestwodigit/');
  }

  getProfile(){
    return axios.get('/api/profile/');
  }

}

export default new Database();

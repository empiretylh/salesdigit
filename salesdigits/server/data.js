import axios from 'axios';

class Database {
  login(data) {
    return axios.post('/auth/login/', data);
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

  deletefinish2d(data) {
    console.log(data);
    return axios.delete('/sd/api/finishtwodigit/', {
      params: {
        datetime: data.datetime,
      },
    });
  }

  getHistory2d() {
    return axios.get('/sd/api/historytwodigit/');
  }

  sales2d(data) {
    return axios.post('/sd/api/salestwodigit/', data);
  }

  getsold2d(data) {
    return axios.get('/sd/api/salestwodigit/');
  }

  getCheckTwoDigits({queryKey}) {
    const [_, date] = queryKey;
    return axios.get('/sd/api/checktwodigtis/', {
      params: {
        datetime: date,
      },
    });
  }

  // 3D requests --------------------------------------------------------------------------------------

  finish3d(data) {
    return axios.post('/sd/api/finishthreedigit/', data);
  }

  getfinish3d({queryKey}) {
    const [_, date] = queryKey;
    console.log(date);

    return axios.get('/sd/api/finishthreedigit/', {
      params: {
        datetime: date,
      },
    });
  }

  deletefinish3d(data) {
    console.log(data);
    return axios.delete('/sd/api/finishthreedigit/', {
      params: {
        datetime: data.datetime,
      },
    });
  }

  getHistory3d() {
    return axios.get('/sd/api/historythreedigit/');
  }

  sales3d(data) {
    return axios.post('/sd/api/salesthreedigit/', data);
  }

  getsold3d(data) {
    return axios.get('/sd/api/salesthreedigit/');
  }

  getProfile() {
    return axios.get('/api/profile/');
  }
}

export default new Database();

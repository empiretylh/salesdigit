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
}

export default new Database();

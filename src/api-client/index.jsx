import axios from 'axios';
import { logoutUser } from '../util/UtilFunction';
// import { logoutUser } from '../UtilFunction';
import { logout } from '../redux/actions/user';



let config = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
};

const setAuthorizationToken = () => {
  let token = localStorage.getItem('_itoken');
  if (token) {
    axios.defaults.headers.common.Authorization = 'Bearer ' + token;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
};

class ApiClient {
  static async post(url, body, dispatch) {
    setAuthorizationToken();
    try {
      const response = await axios.post(url, body, config);
      return response.data;
    } catch (error) {
      if (error && error.response) {
        if (error.response?.status === 401) {
          console.log('error.response', error.response?.status);
          logoutUser()
      }
        return error.response.data;
      } else {
        throw error;
      }
    }
  }

  static async put(url, params, dispatch) {
    setAuthorizationToken();
    try {
      const response = await axios.put(url, JSON.stringify(params), config);
      return response.data;
    } catch (error) {
      if (error && error.response) {
        if (error.response?.status === 401) {
          console.log('error.response', error.response?.status);
          logoutUser()
      }
        return error.response.data;
      } else {
        throw error;
      }
    }
  }

  static async get(url, params, dispatch) {
    setAuthorizationToken();
    let query = new URLSearchParams(params).toString();
    url = query ? `${url}?${query}` : url;
    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.log('error.response', error.response?.status);
        if (error && error.response) {
            if (error.response?.status === 401) {
                console.log('error.response', error.response?.status);
                logoutUser()
            }
            return error.response;
        } else {
            throw error;
        }
    }
}


  static async patch(url, params, dispatch) {
    setAuthorizationToken();
    try {
      const response = await axios.patch(url, JSON.stringify(params), config);
      return response.data;
    } catch (error) {
      if (error && error.response) {
        if (error.response?.status === 401) {
          console.log('error.response', error.response?.status);
          logoutUser()
      }
        return error.response.data;
      } else {
        throw error;
      }
    }
  }

  static async patchStatus(url, dispatch) {
    setAuthorizationToken();
    try {
      const response = await axios.patch(url);
      return response.data;
    } catch (error) {
      if (error && error.response) {
        if (error.response?.status === 401) {
          console.log('error.response', error.response?.status);
          logoutUser()
      }
        return error.response.data;
      } else {
        throw error;
      }
    }
  }

  static async delete(url, dispatch) {
    setAuthorizationToken();
    try {
      const response = await axios.delete(url, config);
      return response.data;
    } catch (error) {
      if (error && error.response) {
        if (error.response?.status === 401) {
          console.log('error.response', error.response?.status);
          logoutUser()
      }
        return error.response.data;
      } else {
        throw error;
      }
    }
  }

  static async postFormData(url, params, dispatch) {
    setAuthorizationToken();
    try {
      const response = await axios.post(url, params, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      if (error && error.response) {
        if (error.response?.status === 401) {
          console.log('error.response', error.response?.status);
          logoutUser()
      }
        return error.response.data;
      } else {
        throw error;
      }
    }
  }

  static async putFormData(url, params, dispatch) {
    setAuthorizationToken();
    try {
      const response = await axios.put(url, params, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      if (error && error.response) {
        if (error.response?.status === 401) {
          console.log('error.response', error.response?.status);
          logoutUser()
      }
        return error.response.data;
      } else {
        throw error;
      }
    }
  }

  static async patchFormData(url, body, dispatch) {
    setAuthorizationToken();
    try {
      const response = await axios.patch(url, body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      if (error && error.response) {
        if (error.response?.status === 401) {
          console.log('error.response', error.response?.status);
          logoutUser()
      }
        return error.response.data;
      } else {
        throw error;
      }
    }
  }
}

export default ApiClient;

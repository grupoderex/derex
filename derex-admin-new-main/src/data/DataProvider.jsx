import { AxiosError } from 'axios';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

import {
  api_createPost,
  api_deletePost,
  api_login,
  api_refreshToken,
  api_setMediaForID,
  api_setMediaVideoForID,
  api_setPdfForID,
  api_updatePost,
} from './APICalls';

const DataContext = createContext();

const initialAdmin = {
  id: '',
  email: '',
  role: '',
  name: '',
  phone: '',
  avatar: '',
  token: '',
};

// eslint-disable-next-line react/prop-types
const DataProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dataAuth, setDataAuth] = useState(initialAdmin);
  const timeoutRef = useRef(null);

  const sessionTokenKey = 'admin_session_token';

  const getTokenFromStorage = () => {
    try {
      const raw = window.localStorage.getItem(sessionTokenKey);
      const parsed = JSON.parse(raw);
      return parsed?.token || '';
    } catch {
      return '';
    }
  };

  const getActiveToken = () => {
    const token = dataAuth?.token || getTokenFromStorage();
    if (!token || token === 'undefined' || token === 'null') return '';
    return token;
  };

  const handleExpiredSession = () => {
    if (typeof window === 'undefined') return;

    window.localStorage.removeItem(sessionTokenKey);
    window.localStorage.removeItem('token');
    setDataAuth(initialAdmin);

    if (!window.location.pathname.includes('/login')) {
      window.location.assign('/login');
    }
  };

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoading(true);
      let data;
      try {
        const dataRaw = window.localStorage.getItem(sessionTokenKey);
        data = JSON.parse(dataRaw);
      } catch {
        data = undefined;
      }

      if (data?.token) {
        api_refreshToken(data.token)
          .then((dataUser) => {
            window.localStorage.setItem(sessionTokenKey, JSON.stringify(dataUser));
            setDataAuth(dataUser);
          })
          .catch(() => {
            window.localStorage.removeItem(sessionTokenKey);
            setDataAuth(initialAdmin);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }

      clearTimeout(timeoutRef.current);
    }, 100);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const login = async ({ email, password }) => {
    try {
      const dataAdmin = await api_login({ email, password });
      window.localStorage.setItem(sessionTokenKey, JSON.stringify(dataAdmin));
      setDataAuth(dataAdmin);
      return dataAdmin;
    } catch (e) {
      setDataAuth(initialAdmin);
      window.localStorage.removeItem(sessionTokenKey);
      let error = 'Error al conectar con el servidor';
      if (e instanceof AxiosError) {
        error = e.response?.data.error || 'Error desconocido del servidor';
      }
      return { error };
    }
  };

  const logout = async () => {
    setLoading(true);
    window.localStorage.removeItem(sessionTokenKey);
    localStorage.removeItem('token');
    setDataAuth(initialAdmin);
    setLoading(false);
  };

  const setMediaForID = async (id, file) => {
    const token = getActiveToken();
    if (!token) {
      handleExpiredSession();
      throw new Error('Sesion invalida o expirada');
    }
    const response = await api_setMediaForID(id, file, token);

    return response?.url;
  };

  const setMediaVideoForID = async (id, file) => {
    const token = getActiveToken();
    if (!token) {
      handleExpiredSession();
      throw new Error('Sesion invalida o expirada');
    }
    const response = await api_setMediaVideoForID(id, file, token);
    return response?.url;
  };

  const setFileForID = async (id, file) => {
    const token = getActiveToken();
    if (!token) {
      handleExpiredSession();
      throw new Error('Sesion invalida o expirada');
    }
    const response = await api_setPdfForID(id, file, token);
    return response?.url;
  };

  const createBlog = async (post) => {
    const response = await api_createPost(post, dataAuth.token);
    return response;
  };

  const updateBlog = async (id, post) => {
    const response = await api_updatePost(id, post, dataAuth.token);
    return response;
  };

  const deleteBlog = async (id) => {
    const response = await api_deletePost(id, dataAuth.token);
    return response;
  };

  // eslint-disable-next-line react/jsx-no-constructed-context-values
  const globalData = {
    dataAuth,
    login,
    logout,
    setMediaForID,
    setMediaVideoForID,
    setFileForID,
    createBlog,
    updateBlog,
    deleteBlog,
    loading,
    setLoading,
  };

  return <DataContext.Provider value={globalData}>{children}</DataContext.Provider>;
};

const useAppContext = () => useContext(DataContext);

export default useAppContext;

export { DataProvider };


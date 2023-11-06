import React, { useEffect } from 'react';
import base64 from 'base-64';
import utf8 from 'utf8';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux/reducer/userSlice';
import { useState } from 'react';

const JWTdecode = () => {
  const dispatch = useDispatch();
  const userData = useSelector(setUserData).payload.user;
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));
  // const token = localStorage.getItem('jwtToken');
  useEffect(() => {
    //토큰 존재 시
    if (token) {
      // JWT 디코딩
      let payload = token.substring(
        token.indexOf('.') + 1,
        token.lastIndexOf('.')
      );
      //base64  디코딩
      const bytes = base64.decode(payload);
      //한글 디코딩
      const text = utf8.decode(bytes);

      const userInfo = JSON.parse(text);
      //   console.log(userInfo);

      dispatch(
        setUserData({
          data: {
            mem_code: userInfo.userCode,
            name: userInfo.userNm,
            position_name: userInfo.userPosition,
            dept_name: userInfo.userDeptNm,
            role: userInfo.userRole
          }
        })
      );
    }
  }, [token]);
};

export default JWTdecode;
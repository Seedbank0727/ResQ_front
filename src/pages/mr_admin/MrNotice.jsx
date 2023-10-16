import React from 'react';
import Editor from '../../components/mr_admin/Editor';
import SubHeader from '../../components/common/SubHeader';
import { Paper, styled, Button, Stack, Box, TextField } from '@mui/material';
import { useState } from 'react';
import OnOffSwitch from '../../components/mr_admin/OnOffSwitch';
import axios from 'axios';
import SubSidebar from '../../components/common/SubSidebar';
import MainContainer from '../../components/mr_user/MainContainer';
import WrapContainer from '../../components/mr_user/WrapContainer';

const MrNotice = () => {
  const [editorData, setEditorData] = useState('');
  const [isPublic, setIsPublic] = useState(true); // OnOff 스위치의 상태를 관리
  const [notice_title, setNotice_title] = useState('');
  const handleSwitchChange = (event) => {
    setIsPublic(event.target.checked);
  };
  const FormtoData = {
    contents: editorData,
    is_opened: isPublic ? 0 : 1,
    notice_title
  };
  const handleClick = () => {
    axios.post('http://localhost:8081/mr/notice', FormtoData).then(() => {
      alert('공지사항이 등록되었습니다.');
    });
    // console.log('텍스트:' + editorData);
    // console.log('공개 여부: ' + isPublic); // OnOff 스위치 상태 출력
  };
  return (
    <MainContainer>
      <WrapContainer bgColor={'#fff'}>
        <SubHeader title={'공지사항'} />
        <SubSidebar />
        <Box>
          <TextField
            id="outlined-basic"
            label="제목"
            variant="outlined"
            sx={{ width: '100%' }}
            placeholder="제목을 입력하세요"
            onChange={(e) => {
              setNotice_title(e.target.value);
            }}
          />
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
          >
            <OnOffSwitch checked={isPublic} onChange={handleSwitchChange} />
            <Button variant="outlined" onClick={handleClick}>
              작성 완료
            </Button>
          </Stack>

          <Editor onEditorChange={(data) => setEditorData(data)} />
        </Box>
      </WrapContainer>
    </MainContainer>
  );
};

export default MrNotice;

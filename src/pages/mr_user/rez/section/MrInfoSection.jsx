import styled from '@emotion/styled';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import DateRangeRoundedIcon from '@mui/icons-material/DateRangeRounded';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { Box, Chip, IconButton, Stack, Typography } from '@mui/material';

import RoomPreferencesRoundedIcon from '@mui/icons-material/RoomPreferencesRounded';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Carousel from '../../../../components/mr_user/Carousel';
import { setBmData } from '../../../../redux/reducer/BmSlice';
import {
  openSanckbar,
  setSnackbarContent
} from '../../../../redux/reducer/SnackbarSlice';
import { setUserData } from '../../../../redux/reducer/userSlice';
import { palette } from '../../../../theme/palette';
import axiosInstance from '../../../../utils/axios';
import { convertDayToText } from '../../../../utils/convertDayToText';

const MrInfoSection = ({ data }) => {
  const {
    mr_code,
    mr_name,
    location,
    maximum_capacity,
    avl_start_time,
    avl_end_time,
    mr_keyword,
    mr_img,
    mr_op_day,
    mr_supplies
  } = data;

  const dispatch = useDispatch();
  // 즐겨찾기 별 버튼
  const [isBm, setIsBm] = useState(false);
  // 어드민 여부
  const [isAdmin, setIsAdmin] = useState(false);

  const userData = useSelector(setUserData).payload.user;
  const bmData = useSelector(setBmData).payload.bm;

  useEffect(() => {
    // 현재 URL 주소 가져오기
    const currentUrl = window.location.href;

    // URL에 '/admin' 포함 여부 확인
    const isAdmin = currentUrl.includes('/admin');
    if (isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  // 즐겨찾기 회의실 리덕스 데이터
  const { mr_list } = bmData;

  // 즐겨찾기에 저장된 회의실일 경우 배열안에 객체가 담김. 없으면 빈배열
  const bmMrInfo = mr_list.filter((mr) => mr.mr.mr_code === mr_code);
  // 요일 number -> string으로 변경
  let newDays = [];

  if (mr_op_day) {
    const arr = [...mr_op_day];
    arr.sort((a, b) => a.day - b.day);
    arr.forEach((item) => newDays.push(convertDayToText(item.day)));
  }

  const handleOpenSnackbar = () => {
    dispatch(openSanckbar());
  };

  const handleSetSnackbarContent = (content) => {
    dispatch(setSnackbarContent(content));
  };

  // 즐겨찾기 유무
  const [bookmark, setBookmark] = useState(false);

  useEffect(() => {
    setBookmark(bmMrInfo.length !== 0 ? true : false);
  }, [data]);

  const handleBookmark = async () => {
    //이미 북마크 표시된건 리턴 처리
    if (bookmark) return;

    const data = {
      mem_code: userData.mem_code,
      mr_code: mr_code
    };

    try {
      // 즐겨찾기 추가 API 요청
      const res = await axiosInstance.axiosInstance.post('/mr/bm', data);
      if (res.status !== 201) return;

      handleSetSnackbarContent('즐겨찾기 등록되었습니다.');
      handleOpenSnackbar();
      console.log(res);
    } catch (err) {
      console.log(err);
    }

    setBookmark(!bookmark);
  };

  // 분기 처리를 통한 아이콘 렌더링
  const renderIcon = () => {
    if (isAdmin) {
      return null;
    } else {
      return bookmark ? (
        <StarRoundedIcon fontSize="large" color="primary" />
      ) : (
        <StarBorderRoundedIcon fontSize="large" color="primary" />
      );
    }
  };

  return (
    <Box
      component={'section'}
      sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
    >
      <Box>
        <Carousel data={mr_img} />
        <Stack sx={{ padding: '10px 20px 10px', rowGap: '6px' }}>
          <StyledRoomTitleInfoWrap>
            {/* 회의실명 영역 */}
            <StyledRoomName>{mr_name}</StyledRoomName>
            <IconButton onClick={handleBookmark} disabled={bookmark}>
              {renderIcon()}
            </IconButton>
          </StyledRoomTitleInfoWrap>

          <Stack sx={{ rowGap: '6px' }}>
            {/* 위치 영역 */}
            <StyledRoomInfoWrap>
              <FmdGoodOutlinedIcon fontSize="small" />
              <StyledInfoText>{location}</StyledInfoText>
            </StyledRoomInfoWrap>

            {/* 최대 인원수 영역 */}
            <StyledRoomInfoWrap>
              <PermIdentityOutlinedIcon fontSize="small" />
              <StyledInfoText>최대 {maximum_capacity} 명</StyledInfoText>
            </StyledRoomInfoWrap>

            {/* 이용시간 영역 */}
            <StyledRoomInfoWrap>
              <AccessTimeRoundedIcon fontSize="small" />
              <StyledInfoText>
                {new Date(avl_start_time)
                  .toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })
                  .replace(/:\d+\s/, ' ')}
                -
                {new Date(avl_end_time)
                  .toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })
                  .replace(/:\d+\s/, ' ')}
              </StyledInfoText>
            </StyledRoomInfoWrap>

            {/* 요일 영역 */}
            <StyledRoomInfoWrap>
              <DateRangeRoundedIcon fontSize="small" />
              {newDays &&
                newDays.map((day, index) => (
                  <StyledInfoText key={index}>{day}</StyledInfoText>
                ))}
            </StyledRoomInfoWrap>

            {/* 장비 영역 */}
            <Stack sx={{ marginTop: '10px', rowGap: '6px' }}>
              <Stack direction={'row'} sx={{ alignItems: 'center' }}>
                <RoomPreferencesRoundedIcon
                  fontSize="small"
                  sx={{ marginRight: '4px' }}
                />
                <StyledInfoTilte>기본 장비</StyledInfoTilte>
              </Stack>

              <StyledRoomTagsWrap>
                {mr_supplies &&
                  mr_supplies.map((item, index) => (
                    <>
                      {item.supplies.supplies_name === null ? null : (
                        <Chip
                          label={item.supplies.supplies_name}
                          sx={{
                            backgroundColor: palette.grey['300'],
                            fontSize: '14px'
                          }}
                        />
                      )}
                    </>
                  ))}
              </StyledRoomTagsWrap>
            </Stack>

            {/* 태그 영역 */}
            <Stack sx={{ marginTop: '10px', rowGap: '6px' }}>
              <Stack direction={'row'} sx={{ alignItems: 'center' }}>
                <TagRoundedIcon fontSize="small" sx={{ marginRight: '4px' }} />
                <StyledInfoTilte>회의실 태그</StyledInfoTilte>
              </Stack>
              <StyledRoomTagsWrap>
                {mr_keyword &&
                  mr_keyword.map((tag, index) => (
                    <Chip
                      label={tag.keyword_name}
                      sx={{ backgroundColor: palette.grey['300'] }}
                    />
                  ))}
              </StyledRoomTagsWrap>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default MrInfoSection;

const StyledRoomTitleInfoWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center'
}));

const StyledRoomInfoWrap = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '4px',
  alignItems: 'center'
}));

const StyledRoomName = styled('h3')(({ theme }) => ({
  margin: 0,
  fontSize: '24px',
  fontWeight: theme.typography.fontWeightbold
}));

const StyledInfoText = styled(Typography)(({ theme }) => ({
  fontSize: '16px'
}));

const StyledInfoTilte = styled(Typography)(({ theme }) => ({
  fontSize: '16x'
}));

const StyledRoomTagsWrap = styled(StyledRoomInfoWrap)(({ theme }) => ({
  flexWrap: 'wrap'
}));

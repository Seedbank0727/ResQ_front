import {
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import Searchbar from '../common/Searchbar';
import NoRow from './NoRow';
import RectangleBtn from '../common/RectangleBtn';
import { palette } from '../../theme/palette';
import RectangleIcon from '@mui/icons-material/Rectangle';
import axiosInstance from '../../utils/axios';

// 서브 사이드바 콘텐츠
const SubSideContents = ({ setSelectedRows, rezStart_at, rezReturn_at }) => {
  const [searchInput, setSearchInput] = useState('');
  //const [carCode, setCarCode] = useState('');
  const [rows, setRows] = useState([]);
  useEffect(() => {
    axiosInstance
      .get(
        `http://localhost:8081/car_rez/availableCars/${rezStart_at}/${rezReturn_at}`
      )
      .then((res) => {
        setRows(
          res.data.map((car) => ({
            id: car.carVO.car_code,
            car_name: car.carVO.car_name,
            car_address: car.car_address
          }))
        );
      });
  }, []);
  const handleInput = (e) => {
    setSearchInput(e.target.value);
  };
  const filterCarData = rows.filter((item) =>
    item['car_name'].includes(searchInput)
  );
  // 검색 클릭 이벤트
  const handleSearchBtn = (e) => {
    e.preventDefault();
  };
  const handleItem = (e, car_code, car_address, car_name) => {
    //setCarCode(car_code);
    setSelectedRows({ car_code, car_address, car_name });
  };
  // hover
  const [isHovered, setIsHovered] = useState(null);
  const handleHover = (index) => {
    setIsHovered(index);
  };
  const handleMouseLeave = () => {
    setIsHovered(null);
  };
  const CarList = ({ rows }) => {
    if (rows.length == 0) {
      return <NoRow />;
    } else {
      return (
        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <List dense component="div" role="list">
            {rows.map((car, index) => {
              return (
                <ListItem
                  key={car.id}
                  // onMouseEnter={() => handleHover(index)}
                  // onMouseLeave={handleMouseLeave}
                  // sx={{ background: isHovered === index && '#FFFFFF' }}
                  // {isHovered&&}
                  onClick={(e) =>
                    handleItem(e, car.id, car.car_address, car.car_name)
                  }
                >
                  <ListItemButton>
                    <ListItemText
                      primary={`${car.id}`}
                      secondary={`${car.car_name}`}
                    />
                    <ListItemText primary={`${car.car_address}`} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </div>
      );
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflow: 'hidden',
        // px: 2,
        // pt: 0,
        '& .MuiPaper-rounded2': {
          mt: 1,
          backgroundColor: '#f5f5f5',
          height: '60vh'
        }
      }}
    >
      {/* <Grid container sx={{ pt: 3, pl: 1, pr: 1, pb: 3 }}>
        <Button variant="contained" sx={{ width: '100%' }}>
          차량 예약
        </Button>
        <RectangleBtn
          type={'button'}
          text={'차량 예약'}
          sx={{ padding: '14px 12px', backgroundColor: palette.grey['500'] }}
        />
      </Grid> */}

      <Divider />
      {/* <Box
        display="flex"
        // marginTop="15px"
        sx={{
          width: '100%',
          borderBottom: '3px solid black',
          padding: '5px 0px',
          mb: 1
        }}
      >
        <RectangleIcon
          sx={{
            color: 'black',
            marginTop: 'auto',
            marginBottom: 'auto',
            width: '6px',
            height: '6px'
          }}
        />
        <Typography variant="subtitle1" sx={{ marginLeft: '10px' }}>
          차량 검색
        </Typography>
      </Box> */}
      <Searchbar
        width={'100%'}
        placeholder={'차종을 입력하세요'}
        value={searchInput}
        handleInputChange={handleInput}
        handleSearchBtn={handleSearchBtn}
      />
      <Divider />
      <Paper className="MuiPaper-rounded2" width={'100%'}>
        <CarList rows={filterCarData} />
      </Paper>
    </Box>
  );
};

export default SubSideContents;

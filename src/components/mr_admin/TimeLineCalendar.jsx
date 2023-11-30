import koLocale from '@fullcalendar/core/locales/ko';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import FullCalendar from '@fullcalendar/react';
import resourceTimeGridPlugin from '@fullcalendar/resource-timegrid';
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import DnsOutlinedIcon from '@mui/icons-material/DnsOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import {
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import MrInfoSection from '../../pages/mr_user/rez/section/MrInfoSection.jsx';
import {
  openSanckbar,
  setSnackbarContent,
  setSnackbarStatus
} from '../../redux/reducer/SnackbarSlice';
import axiosInstance from '../../utils/axios.js';
import Modal from '../common/Modal.jsx';

const TimeLineCalendar = ({ events, resources }) => {
  const [mrResources, setMrResources] = useState({});
  const [rezData, setRezData] = useState();
  const [rezPt, setRezPt] = useState();
  const dispatch = useDispatch();
  // snackbar 상태 관리 함수
  const handleOpenSnackbar = () => {
    dispatch(openSanckbar());
  };

  const handleSetSnackbarStatus = (status) => {
    dispatch(setSnackbarStatus(status));
  };

  const handleSetSnackbarContent = (content) => {
    dispatch(setSnackbarContent(content));
  };

  const [currentView, setCurrentView] = useState('resourceTimeline');
  // console.log(events[0].title);
  const handleEventClick = (info) => {
    // console.log(info.event.title);
    handleSetSnackbarStatus('info');
    handleOpenSnackbar();
    handleSetSnackbarContent(info.event.title);
    // dayGridPlugin 페이지로 전환
    setCurrentView('dayGrid');
    /**클릭한 이벤트의 시작 날짜를 가져옴 */
    const eventDate = info.event.start;
    const mr_code = info.event._def.resourceIds[0];
    const mr_rez_code = info.event._def.extendedProps.mr_rez_code;
    console.log(mr_rez_code);
    axiosInstance.axiosInstance
      .get(`/mr/${mr_code}`)
      .then((res) => {
        // console.log(res.data);
        setMrResources(res.data);
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
    axiosInstance.axiosInstance
      .get(`/mr/mrRez/${mr_rez_code}`)
      .then((res) => {
        console.log(res.data);
        setRezData(res.data);
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
    axiosInstance.axiosInstance
      .get(`/mr/mrRezPt/${mr_rez_code}`)
      .then((res) => {
        console.log(res.data);
        setRezPt(res.data);
      })
      .catch((error) => {
        console.error('데이터 가져오기 오류:', error);
      });
    info.view.calendar.gotoDate(eventDate);
    handleModal();
  };
  const businessHours = {
    daysOfWeek: [1, 2, 3, 4, 5], // 월~토

    startTime: '9:00', // 시작 시간
    endTime: '19:00' // 종료 시간
  };
  const [open, setOpen] = useState(false);
  /** 모달창 열림닫힘 이벤트*/
  const handleModal = () => setOpen(!open);
  const filteredRezPt = rezPt && rezPt.filter((pt) => pt.name !== rezData.name);
  console.log(filteredRezPt);
  const ModalContentExample = () => {
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <MrInfoSection data={mrResources} />
        </Grid>
        <Grid item xs={6}>
          <Typography sx={{ mt: 1, mb: 2 }} variant="h4" component="div">
            예약 정보
          </Typography>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon sx={{ color: '#000000' }}>
                <DnsOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary={rezData && rezData.m_name} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <PersonAddAltOutlinedIcon sx={{ color: '#000000' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  rezData?.name &&
                  rezData &&
                  rezData.name +
                    ' ' +
                    rezData.position_name +
                    ' (' +
                    rezData.dept_name +
                    ')'
                }
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CalendarMonthOutlinedIcon sx={{ color: '#000000' }} />
              </ListItemIcon>
              <ListItemText primary={rezData && rezData.rez_date} />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <ScheduleOutlinedIcon sx={{ color: '#000000' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  rezData && rezData.start_time + ' ~ ' + rezData.end_time
                }
              />
            </ListItem>
            <Divider />
          </List>
          <Typography sx={{ mt: 3, mb: 2 }} variant="h4" component="div">
            참석자 정보
          </Typography>
          <Divider />
          <List>
            {filteredRezPt &&
              filteredRezPt.map((participant, index) => (
                <React.Fragment key={index}>
                  <ListItem>
                    <ListItemIcon sx={{ color: '#000000' }}>
                      <PersonOutlineOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        participant &&
                        participant.name +
                          ' ' +
                          participant.position_name +
                          ' (' +
                          participant.dept_name +
                          ')'
                      }
                    />
                  </ListItem>
                  {/* {index !== filteredRezPt.length - 1 && <Divider />} */}
                  <Divider />
                </React.Fragment>
              ))}
          </List>
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      {/* <TimeField
        withMonth={true}
        label={'시작 시간'}
        timeValue={dayjs().hour(9).minute(0)}
      /> */}
      <FullCalendar
        plugins={[
          dayGridPlugin,
          resourceTimelinePlugin,
          resourceTimeGridPlugin,
          listPlugin,
          multiMonthPlugin
        ]}
        locale={koLocale} // 한국어 설정
        initialView={currentView}
        nowIndicator={true}
        businessHours={businessHours}
        events={events}
        eventClick={handleEventClick}
        resourceAreaHeaderContent={'회의실'}
        headerToolbar={{
          left: 'prevYear,prev,next,nextYear today,resourceTimelineMonth',
          // ,dayGridMonth',
          // ,multiMonthYear',
          // resourceTimeGridDay,',
          center: 'title',
          right: 'resourceTimelineDay,listWeek'
        }}
        views={{
          resourceTimeGridDay: {
            buttonText: '회의실'
          },
          resourceTimelineDay: {
            buttonText: '시간대'
          },
          resourceTimelineMonth: {
            eventMaxStack: 0,
            buttonText: '월',
            // eventContent: function (arg) {
            //   return arg.event.extendedProps.description;
            // },
            views: {
              eventMaxStack: 10
            }
          },
          listWeek: {
            buttonText: '리스트',
            eventContent: function (arg) {
              return arg.event.extendedProps.description;
            }
          },
          // dayGridMonth: {
          //   // eventMaxStack: 0,
          //   dayMaxEventRows: 0,
          //   buttonText: '월2',
          //   eventContent: function (arg) {
          //     return arg.event.extendedProps.description;
          //   }
          // },
          multiMonthYear: {
            eventMaxStack: 0,
            buttonText: '년도',
            title: events.description,
            multiMonthMaxColumns: 6,
            dayMaxEventRows: 3,
            eventContent: function (arg) {
              return arg.event.extendedProps.description;
            },
            // duration: { months: 6 },
            views: {
              eventMaxStack: 5,
              dayMaxEventRows: 3
            }
          }
        }}
        resources={resources}
        schedulerLicenseKey="CC-Attribution-NonCommercial-NoDerivatives"
        slotMinTime={businessHours.startTime}
        slotMaxTime={businessHours.endTime} // 11pm
        resourceAreaWidth="15%"
        navLinks="true"
        resourceAreaColumns={[
          {
            field: resources.title,
            width: 150
          }
        ]}
        // eventColor="blue"
      />
      <Modal
        open={open}
        modalTitle={'회의실 예약 정보'}
        handleModal={handleModal}
        content={<ModalContentExample />}
      />
    </div>
  );
};

export default TimeLineCalendar;

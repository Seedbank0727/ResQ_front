import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
// theme
import ThemeProvider from './theme';
//
import Router from './routes/routes';
import store from './redux/store';
//실시간 처리?? 기원
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import JWTdecode from './components/common/JWTdecode';

const queryClient = new QueryClient();

const App = () => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <JWTdecode />
        <BrowserRouter>
          <ThemeProvider>
            <Router isAdminMode={isAdminMode} setIsAdminMode={setIsAdminMode} />
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;

import Routes from './routes/index'
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { Toaster } from 'react-hot-toast';
import './App.css'

function App() {
  return (
    <>
      <AuthProvider>
        <EventProvider>
          <Toaster reverseOrder={false} toastOptions={{ duration: 3500, style: { marginTop: '40vh', transform: 'translateY(-50%)' } }}/>
          <Routes />
        </EventProvider>
      </AuthProvider>
    </>
  )
}

export default App
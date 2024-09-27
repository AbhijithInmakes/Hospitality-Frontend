import './App.css';
import LoginPage from './components/usercomponents/Login';
import SignupPage from './components/usercomponents/Signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import PatientDashboard from './components/patientcomponents/PatientDashboard';
import Appointments from './components/patientcomponents/Appointments';
import MedicalHistories from './components/patientcomponents/MedicalHistory';
import AdminDashboard from './components/admincomponents/AdminDashboard';
import UserDetail from './components/admincomponents/UserDetail';
import FacilityManagement from './components/admincomponents/FacilityManagement';
import AppointmentCrud from './components/admincomponents/AppointmentCrud';
import DoctorDashboard from './components/doctorcomponents/DoctorDashboard';
import PatientTable from './components/doctorcomponents/PatientList';
import DoctorAppointments from './components/doctorcomponents/Appointments';

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/patient-dashboard" element={<PatientDashboard/>} />
      <Route path="/appointments" element={<Appointments/>}/>
      <Route path="/medical-histories" element={<MedicalHistories/>}/>
       <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
       <Route path='/users' element={<UserDetail/>}/>
       <Route path='/facility' element={<FacilityManagement/>}/>
       <Route path='/appointment-management' element={<AppointmentCrud/>}/>
       <Route path='/doctor-dashboard' element={<DoctorDashboard/>}/>
       <Route path='/patient-list' element={<PatientTable/>}/>
       <Route path='/doctor-appointments' element={<DoctorAppointments/>}/>

    </Routes>
  </Router>
   
  );
}

export default App;

import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faClipboardList, faUser} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      name: '',
      date_of_birth: '',
      address: '',
      phone_number: '',
      gender: 'Male',
    }
  });

 

  

  const handleUsers = () => {
    navigate('/users');
  };

  const handleFacility = () => {
    navigate('/facility');
  };

  const handleAppointment=()=>{
    navigate('/appointment-management')
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">Admin Dashboard</h2>
      </div>

      <div className="table-responsive">
        <div className="mb-3 d-flex justify-content-end">
         
          
          <button className="btn btn-info btn-sm me-1" onClick={handleUsers}>
            <FontAwesomeIcon icon={faUser} /> View Users
          </button>
          <button className="btn btn-warning btn-sm me-1" onClick={handleFacility}>
            <FontAwesomeIcon icon={faBuilding} /> Facility Management
          </button>
          <button className="btn btn-warning btn-sm me-1" onClick={handleAppointment}>
            <FontAwesomeIcon icon={faClipboardList} /> Appointment Management
          </button>
        </div>
      </div>
      </div>

     
      

     
     
     
     
  );
};

export default AdminDashboard;

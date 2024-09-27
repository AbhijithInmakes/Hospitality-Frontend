import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faUser} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { axiosInstance } from '../../interceptor/axios';
import Modal from 'react-modal';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [doctorDetails, setDoctorDetails] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    defaultValues: {
      license_number: '',
      specialty: ''
     
    }
  });

 
  const handleViewDetails = async () => {
    try {
      const response = await axiosInstance.get('docter/doctor-detail-view/');
      setDoctorDetails(response.data); 
      setIsEditMode(true);
      populateForm(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setDoctorDetails(null);
      setIsEditMode(false);
      setIsModalOpen(true);
    }
  };

  

  const onSubmit = async (data) => {
    try {
    
        const response = await axiosInstance.post('docter/doctor-detail/', data);
        console.log(response);
        handleModalClose();
        setDoctorDetails(response.data.doctor);
        populateForm(response.data.doctor)
      } catch (error) {
        console.error('Error adding/updating Doctor:', error);
      }
         

      }
     
    
      useEffect(() => {
        const fetchDoctorDetails = async () => {
          try {
            const response = await axiosInstance.get('docter/doctor-detail-view/');
            setDoctorDetails(response.data);
            populateForm(response.data)
          } catch (error) {
            console.error(error);
            if (error === "Unauthorized") {
              localStorage.clear();
              navigate("/login");
            }
            setError('Failed to fetch patients');
          } finally {
            setLoading(false);
          }
        };
    
        fetchDoctorDetails();
      }, []);


  
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const populateForm = (data) => {
    setValue('license_number', data.license_number);
    setValue('specialty', data.specialty);
    
  };

  const handlePatients = () => {
    navigate('/patient-list');
  };

  const handleFacility = () => {
    navigate('/facility');
  };

  const handleAppointment=()=>{
    navigate('/doctor-appointments')
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">Doctor Dashboard</h2>
      </div>

      <div className="table-responsive">
        <div className="mb-3 d-flex justify-content-end">
         
          
          <button className="btn btn-info btn-sm me-1" onClick={handlePatients}>
            <FontAwesomeIcon icon={faUser} /> View Patients
          </button>
          <button className="btn btn-warning btn-sm me-1" onClick={handleAppointment}>
            <FontAwesomeIcon icon={faClipboardList} /> Scheduled Appointments
          </button>


        </div>
      </div>

      {doctorDetails && (
        <div className="card w-100 p-3 mb-4">
          <h4 className="text-center text-primary">{doctorDetails.name} Profile</h4>
          <p><strong>License Number:</strong> {doctorDetails.license_number}</p>
          <p><strong>Speciality:</strong> {doctorDetails.specialty}</p>
         
          <button className="btn btn-primary" onClick={handleViewDetails}>Update</button>
        </div>
      )}

{!doctorDetails && (
        <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>Add Details</button>
      )}

     
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleModalClose}
        contentLabel="Add/Update Patient Modal"
        style={{
          content: {
            width: '400px',
            height: 'auto',
            maxHeight: '100vh',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px',
          }
        }}
      >
        <h2 className="text-center text-primary fw-bold">{isEditMode ? 'Update Profile' : 'Add Profile'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="license_number" className="form-label">License Number</label>
            <input
              type="text"
              className="form-control"
              id="license_number"
              {...register('license_number', { required: 'License Number is required' })}
            />
            {errors.license_number && <span className="text-danger">{errors.license_number.message}</span>}
          </div>
         
          <div className="mb-3">
            <label htmlFor="specialty" className="form-label">Specality</label>
            <input
              type="text"
              className="form-control"
              id="address"
              {...register('specialty', { required: 'Spciality is required' })}
            />
            {errors.specialty && <span className="text-danger">{errors.specialty.message}</span>}
          </div>
          
          
          <button type="submit" className="btn btn-primary">
            {isEditMode ? 'Update Profile' : 'Add Profile'}
          </button>
          <button type="button" className="btn btn-secondary ms-2" onClick={handleModalClose}>Cancel</button>
        </form>
      </Modal>
    
      </div>

     
      

     
     
     
     
  );
};

export default DoctorDashboard;

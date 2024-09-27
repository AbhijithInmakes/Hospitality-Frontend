import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarCheck, faFileMedicalAlt} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { axiosInstance } from '../../interceptor/axios';
import { useForm } from 'react-hook-form';
import Modal from 'react-modal';

const PatientDashboard = () => {
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

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get('patient/patients/detail');
        setPatients(response.data);
        if (response.data && response.data.length > 0) {
          setPatientDetails(response.data[0]); 
          setIsEditMode(true);
          populateForm(response.data[0]);
        }
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

    fetchPatients();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (isEditMode && patientDetails) {
        const response = await axiosInstance.put(`patient/patients/${patientDetails.id}/update/`, data);
        const updatedPatients = patients.map((patient) =>
          patient.id === response.data.id ? response.data : patient
        );
        setPatients(updatedPatients);
        console.log(response);
        
        setPatientDetails(response.data.data);
      } else {
         console.log(data);
         
        const response = await axiosInstance.post('patient/create-patient/', data);
        console.log(response);
        
        setPatientDetails(response.data.data);
      }
      handleModalClose();
    } catch (error) {
      console.error('Error adding/updating patient:', error);
    }
  };

  const handleViewDetails = async () => {
    try {
      const response = await axiosInstance.get('patient/patients/detail');
      setPatientDetails(response.data[0]); 
      setIsEditMode(true);
      populateForm(response.data[0]);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setPatientDetails(null);
      setIsEditMode(false);
      setIsModalOpen(true);
    }
  };

  const populateForm = (data) => {
    setValue('name', data.name);
    setValue('date_of_birth', data.date_of_birth);
    setValue('address', data.address);
    setValue('phone_number', data.phone_number);
    setValue('gender', data.gender);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleScheduleAppointment = () => {
    navigate('/appointments');
  };

  const handleViewMedicalHistory = () => {
    navigate('/medical-histories');
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center mb-4">
        <h2 className="text-primary fw-bold">Patient Dashboard</h2>
      </div>

      <div className="table-responsive">
        <div className="mb-3 d-flex justify-content-end">
         
          
          <button className="btn btn-info btn-sm me-1" onClick={handleScheduleAppointment}>
            <FontAwesomeIcon icon={faCalendarCheck} /> View Appointments
          </button>
          <button className="btn btn-warning btn-sm me-1" onClick={handleViewMedicalHistory}>
            <FontAwesomeIcon icon={faFileMedicalAlt} /> View Medical History
          </button>
        </div>
      </div>

     
      {patientDetails && (
        <div className="card w-100 p-3 mb-4">
          <h4 className="text-center text-info">Patient Details</h4>
          <p><strong>Name:</strong> {patientDetails.name}</p>
          <p><strong>Date of Birth:</strong> {patientDetails.date_of_birth}</p>
          <p><strong>Address:</strong> {patientDetails.address}</p>
          <p><strong>Phone Number:</strong> {patientDetails.phone_number}</p>
          <p><strong>Gender:</strong> {patientDetails.gender}</p>
         
          <button className="btn btn-primary" onClick={handleViewDetails}>Update</button>
        </div>
      )}

     
      {!patientDetails && (
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
        <h2 className="text-center text-primary fw-bold">{isEditMode ? 'Update Patient' : 'Add New Patient'}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              id="name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <span className="text-danger">{errors.name.message}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="date_of_birth" className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              id="date_of_birth"
              {...register('date_of_birth', { required: 'Date of birth is required' })}
            />
            {errors.date_of_birth && <span className="text-danger">{errors.date_of_birth.message}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              id="address"
              {...register('address', { required: 'Address is required' })}
            />
            {errors.address && <span className="text-danger">{errors.address.message}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="phone_number" className="form-label">Phone Number</label>
            <input
              type="text"
              className="form-control"
              id="phone_number"
              {...register('phone_number', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Phone number must be 10 digits'
                }
              })}
            />
            {errors.phone_number && <span className="text-danger">{errors.phone_number.message}</span>}
          </div>
          <div className="mb-3">
            <label htmlFor="gender" className="form-label">Gender</label>
            <select
              className="form-control"
              id="gender"
              {...register('gender', { required: 'Gender is required' })}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
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

export default PatientDashboard;

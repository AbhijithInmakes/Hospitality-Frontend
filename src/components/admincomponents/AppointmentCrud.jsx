import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { axiosInstance } from "../../interceptor/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

function AppointmentCrud() {
  const { register, handleSubmit, reset,setValue } = useForm(); 
  const [appointments, setAppointments] = useState([]);
  const fetchAppointments = async () => {
    try {
      const response = await axiosInstance.get('patient/all-appointments/');
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };
  useEffect(() => {
   
   
    fetchAppointments();
  }, []);

  const deleteAppointment = async (id) => {
    try {
      await axiosInstance.delete(`patient/appointments/${id}/delete`);
      setAppointments(appointments.filter((appointment) => appointment.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const updateAppointmentStatus = async (id, newStatus) => {
    try {
      await axiosInstance.put(`patient/appointments/${id}/update`, { status: newStatus });
     
      setValue('status',newStatus)
     
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  const handleStatusUpdate = (data, id) => {
    const newStatus = parseInt(data.status);
    updateAppointmentStatus(id, newStatus);
    reset(); 
  };

  return (
    <div className="container mt-4">
      <h2 className="heading-primary mb-4">Appointment Management</h2>

      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Appointment Details</h5>
        </div>

        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Patient Name</th>
                <th>Doctor Name</th>
                <th>Doctor Specialty</th>
                <th>Appointment Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.patient.name}</td>
                  <td>{appointment.doctor.name}</td>
                  <td>{appointment.doctor.specialty}</td>
                  <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                  <td>
                    
                    <form onSubmit={handleSubmit((data) => handleStatusUpdate(data, appointment.id))}>
                      <select
                        {...register('status')}
                        defaultValue={appointment.status}
                        className="form-select form-select-sm"
                      >
                        <option value={0}>Scheduled</option>
                        <option value={1}>Cancelled</option>
                        <option value={2}>Completed</option>
                      </select>
                      <button type="submit" className="btn btn-sm btn-primary mt-2">
                        <FontAwesomeIcon icon={faEdit} /> Update
                      </button>
                    </form>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteAppointment(appointment.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-muted">Manage appointment status and delete appointments if needed.</p>
      </div>
    </div>
  );
}

export default AppointmentCrud;

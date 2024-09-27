import { useState, useEffect } from "react";
import { Table} from "react-bootstrap"; 
import { axiosInstance } from "../../interceptor/axios"; 

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);

  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("patient/doctor-appointments"); 
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };
    fetchAppointments();
  }, []);

  
  

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="heading-primary">Appointments</h2>
        
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Appointments</h5>
        </div>
        <div className="card-body p-0">
          <Table striped hover className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Doctor Name</th>
                <th>Specialty</th>
                <th>Patient Name</th>
                <th>Appointment Date</th>
                <th>Status</th>
               
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment, index) => (
                <tr key={appointment.id}>
                  <td>{index + 1}</td>
                  <td>{appointment.doctor.name}</td>
                  <td>{appointment.doctor.specialty}</td>
                  <td>{appointment.patient.name}</td>
                  <td>{new Date(appointment.appointment_date).toLocaleString()}</td>
                  <td>{appointment.status === 0 ? "Pending" : "Completed"}</td>
                 
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}

export default DoctorAppointments;

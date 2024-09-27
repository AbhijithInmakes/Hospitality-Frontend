import { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Button, Modal, Form, Row, Col } from 'react-bootstrap';
import { axiosInstance } from '../../interceptor/axios';
import 'react-datepicker/dist/react-datepicker.css';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';


const Appointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [doctors, setDoctors] = useState([]);

    const fetchAppointments = async () => {
        try {
            const response = await axiosInstance.get('/patient/appointments/'); 
            setAppointments(response.data);
        } catch (err) {
           console.log(err);
           
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        

        fetchAppointments();
    }, []);

    const fetchDoctors = async () => {
        try {
            const response = await axiosInstance.get('docter/doctors/');
            console.log(response.data);
            
            setDoctors(response.data); 
        } catch (err) {
            setError(err.message);
        }
    };

    const handleOpenModal = () => {
        setShowModal(true);
        fetchDoctors(); 
    };

    const handleCloseModal = () => {
        setShowModal(false);
        reset(); 
    };
    const onSubmit = (data) => {
       
        const appointmentDate = new Date(
            selectedDate.setHours(selectedTime.getHours(), selectedTime.getMinutes())
        ).toISOString();

        const appointmentData = {
            doctor_id: data.doctor,
            appointment_date: appointmentDate,
            status: 0,
        };
        console.log(appointmentData);
        

       
        axiosInstance.post('/patient/create-appointment/', appointmentData)
            .then(response => {
                toast.success("Appointment scheduled successfully")
                console.log('Appointment Scheduled:', response.data);
                fetchAppointments()
                handleCloseModal();
            })
            .catch(err => {
                toast.error(err)
               
            });
    };

    if (loading) {
        return (
            <div className="text-center mt-4">
                <Spinner animation="border" />
                <p>Loading appointments...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center mt-4">
                <Alert variant="danger">Error: {error}</Alert>
            </div>
        );
    }

    return (
        <div className="container mt-4">
           <ToastContainer/>
            <div className="d-flex justify-content-center mb-3">
                <Button variant="primary" onClick={handleOpenModal}>
                    Schedule New Appointment
                </Button>
            </div>
            <div className="d-flex justify-content-center">
                <Table className="w-75">
                    <thead className="thead-dark">
                        <tr>
                            <th>S.No</th>
                            <th>Doctor Name</th>
                            <th>Specialty</th>
                            <th>Appointment Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment, index) => {
                            const { doctor, appointment_date, status } = appointment;
                            let statusText;
                            let statusClass;

                            switch (status) {
                                case 0:
                                    statusText = 'Scheduled';
                                    statusClass = 'text-info'; 
                                    break;
                                case 1:
                                    statusText = 'Cancelled';
                                    statusClass = 'text-danger';
                                    break;
                                case 2:
                                    statusText = 'Completed';
                                    statusClass = 'text-success';
                                    break;
                                default:
                                    statusText = 'Unknown';
                                    statusClass = '';
                            }

                            return (
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.specialty}</td>
                                    <td>{new Date(appointment_date).toLocaleString()}</td>
                                    <td className={statusClass}>{statusText}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group as={Row} controlId="doctorSelect" className='mb-3'>
                            <Form.Label column sm={4}>Select Doctor</Form.Label>
                            <Col sm={8}>
                                <Form.Control as="select" {...register('doctor', { required: true })}>
                                    <option value="">-- Select Doctor --</option>
                                    {doctors.map(doctor => (
                                        <option key={doctor.id} value={doctor.id}>
                                            {doctor.name} {doctor.specialty}
                                        </option>
                                    ))}
                                </Form.Control>
                                {errors.doctor && <Alert variant="danger">Doctor is required</Alert>}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="dateSelect" className='mb-3'>
                            <Form.Label column sm={4}>Select Date</Form.Label>
                            <Col sm={8}>
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={(date) => setSelectedDate(date)}
                                    minDate={new Date()} 
                                    className="form-control"
                                    placeholderText="Select appointment date"
                                />
                                {errors.date && <Alert variant="danger">Date is required</Alert>}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} controlId="timeSelect" className='mb-3'>
                            <Form.Label column sm={4}>Select Time</Form.Label>
                            <Col sm={8}>
                                <DatePicker
                                    selected={selectedTime}
                                    onChange={(time) => setSelectedTime(time)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    className="form-control"
                                    placeholderText="Select appointment time"
                                />
                                {errors.time && <span variant="danger">Time is required</span>}
                            </Col>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Schedule Appointment
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Appointments;

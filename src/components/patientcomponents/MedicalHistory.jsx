import { useEffect, useState } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import { axiosInstance } from '../../interceptor/axios';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';


const MedicalHistories = () => {
    const [medicalHistories, setMedicalHistories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMedicalHistories = async () => {
        try {
            const response = await axiosInstance.get('/patient/medical-history/');
            setMedicalHistories(response.data);
        } catch (err) {
            setError('Failed to fetch medical histories. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMedicalHistories();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-4">
                <Spinner animation="border" variant="primary" />
                <p>Loading medical histories...</p>
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
        <div className="container-fluid d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
            <ToastContainer />

            <div className="w-100 text-center mb-4">
                <h2 className="mb-4 heading-primary">Medical History</h2>
            </div>

            <div className="medical-history-container">
                <Table striped bordered hover responsive className="w-75 shadow-sm bg-white">
                    <thead className="thead-dark">
                        <tr>
                            <th className="text-center">S.No</th>
                            <th>Diagnosis</th>
                            <th>Medications</th>
                            <th>Allergies</th>
                            <th>Treatment History</th>
                        </tr>
                    </thead>
                    <tbody>
                        {medicalHistories.map((medicalHistory, index) => {
                            const allergiesList = medicalHistory.allergies
                                ? medicalHistory.allergies.split(',').map(allergy => allergy.trim())
                                : [];

                            return (
                                <tr key={index} className="text-center">
                                    <td>{index + 1}</td>
                                    <td>{medicalHistory.diagnosis}</td>
                                    <td>{medicalHistory.medications}</td>
                                    <td>
                                        <ul className="list-unstyled">
                                            {allergiesList.map((allergy, i) => (
                                                <li key={i} className="text-danger">
                                                    <i className="fas fa-exclamation-triangle"></i> {allergy}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td>{medicalHistory.treatment_history}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default MedicalHistories;

import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { axiosInstance } from "../../interceptor/axios";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';



function PatientTable() {
 
  const [patients, setPatients] = useState([]);
 
  const [selectedPatientHistory, setSelectedPatientHistory] = useState([]);
  const [selectedPatientPrescription,setSelectedPatientPrescription] = useState([])
  const [showModal, setShowModal] = useState(false); 
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPrescriptionAddModal,setShowPrescriptionAddModal]=useState(false)
  const [selectedPatient, setSelectedPatient] = useState(null);
  const {
    register: registerPrescription,
    handleSubmit: handleSubmitPrescription,
    formState: { errors: prescriptionErrors },
    
  } = useForm();

  const {
    register: registerMedicalHistory,
    handleSubmit: handleSubmitMedicalHistory,
    formState: { errors: medicalHistoryErrors },
    reset
  } = useForm();

  // Separate submit handlers
 
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPrescriptionModal,setShowPrescriptionModal] = useState(false)

  
  const onError = (errors) => {
    console.error("Form errors:", errors);
  };
 
  useEffect(() => {
    const fetchPatients = async () => {
      const response = await axiosInstance.get("/patient/all-patients");
      setPatients(response.data);
    };
    fetchPatients();
  }, []);

 
  const fetchMedicalHistory = async (patientId,patient) => {
    try {
      const response = await axiosInstance.get(`docter/patients/${patientId}/medical-history/`);
      console.log(response);
       setSelectedPatient(patient)
      setSelectedPatientHistory(response.data);
      setShowHistoryModal(true); 
    } catch (error) {
      console.error("Error fetching medical history", error);
    }
  };

  const fetchPrescriptions = async(patientId,patient) =>{

    try{
        const response = await axiosInstance.get(`docter/prescription/${patientId}/`)
        console.log(response);
        setSelectedPatient(patient)
        setSelectedPatientPrescription(response.data)
        setShowPrescriptionModal(true)
        
    }catch(error){
        console.error("Error fetching prescription",error)
    }
  }

  const handleDeleteMedicalHistory = async (historyId) => {
    try {
      await axiosInstance.delete(`/docter/medical-history/${historyId}/remove/`);
      setSelectedPatientHistory(selectedPatientHistory.filter(history => history.id !== historyId));
    } catch (error) {
      console.error("Error deleting medical history", error);
    }
  };

  const handleDeletePrescription = async(prescriptionId)=>{
    try{
        await axiosInstance.delete(`/docter/prescription/${prescriptionId}/remove`)
        setSelectedPatientPrescription(selectedPatientPrescription.filter(prescription=>prescription.id!==prescriptionId))
    }catch (error) {
        console.error("Error deleting medical history", error);
      }
  }

  const handleAddMedicalHistory = (patient) => {
    console.log("Here I am calling the form with",patient.name);
    
    setSelectedPatient(patient);
    reset(); 
    setShowAddModal(true);
  };

  const handleAddPrescription = (patient)=>{
    setSelectedPatientPrescription(patient);
    setSelectedPatient(patient)
    reset()
    setShowPrescriptionAddModal(true)
  }

  const onSubmitMedicalHistory = async (data) => {
    try {
      const response = await axiosInstance.post(`/patient/medical-history/${selectedPatient.id}/create/`, data);
      console.log("Medical history added:", response.data);
      console.log(response);
      
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding medical history", error);
    }
  };

  const onSubmitPrescription = async (data) => {
    console.log("Form Data:", data); 
    try {
      const response = await axiosInstance.post(`docter/create-prescription/${selectedPatient.id}/`, data);
      console.log("Prescription added:", response.data);
      setShowPrescriptionAddModal(false);
    } catch (error) {
      console.error("Error adding prescription", error);
    }
  };
  


  
  const handleCloseHistoryModal = () => setShowHistoryModal(false);
  const handleCloseAddPrescriptionModel= ()=>setShowPrescriptionAddModal(false);
  const handleCloseShowPrescriptionModal = ()=>setShowPrescriptionModal(false)
  const handleCloseAddModal = () => setShowAddModal(false);

  return (
    <div className="container mt-4">
      <h2 className="text-primary mb-4">Patients Management</h2>
      <table className="table table-striped table-hover" style={{ width: "100%" }}>
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th style={{ width: "320px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id}>
              <td>{patient.name}</td>
              <td>{patient.date_of_birth}</td>
              <td>{patient.gender}</td>
              <td>{patient.address}</td>
              <td >{patient.phone_number}</td>
              <td >
                <Button
                  variant="info"
                  onClick={() => fetchMedicalHistory(patient.id,patient)}
                  className="me-1 custom-btn-sm mb-2"
                  size="sm"
                  style={{ padding: "5px 8px", fontSize: "12px", width: "130px" }}
                >
                  View Medical History
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleAddMedicalHistory(patient)}
                  size="sm"
                   className="me-1 custom-btn-sm mb-2"
                   style={{ padding: "5px 8px", fontSize: "12px", width: "130px" }}
                >
                  Add Medical History
                </Button>
                <Button
                  variant="info"
                  onClick={() => fetchPrescriptions(patient.id,patient)}
                  className="me-1 custom-btn-sm"
                  size="sm"
                  style={{ padding: "5px 8px", fontSize: "12px", width: "130px" }}
                >
                  View Prescription 
                </Button>
                <Button
                  variant="primary"
                  onClick={() => handleAddPrescription(patient)}
                  size="sm"
                   className="me-1 custom-btn-sm"
                   style={{ padding: "5px 8px", fontSize: "12px", width: "130px" }}
                >
                  Add Prescription
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      
      <Modal show={showHistoryModal} onHide={handleCloseHistoryModal}>
  <Modal.Header closeButton>
    <Modal.Title>Medical History {selectedPatient?.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedPatientHistory && selectedPatientHistory.length > 0 ? (
      selectedPatientHistory.map((history, index) => (
        <div key={index} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Medical History (Added on {new Date(history.created_at).toLocaleDateString()}):</h5>
            <FontAwesomeIcon
              icon={faTrash}
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDeleteMedicalHistory(history.id)}
            />
          </div>
          <p><strong>Diagnosis:</strong> {history.diagnosis}</p>
          <p><strong>Medications:</strong> {history.medications}</p>
          <p><strong>Allergies:</strong> {history.allergies || "None"}</p>
          <p><strong>Treatment History:</strong> {history.treatment_history}</p>
          <hr />
        </div>
      ))
    ) : (
      <p>No medical history available.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseHistoryModal}>
      Close
    </Button>
  </Modal.Footer>
  </Modal>

  <Modal show={showPrescriptionModal} onHide={handleCloseShowPrescriptionModal}>
  <Modal.Header closeButton>
    <Modal.Title>Prescription {selectedPatient?.name}</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedPatientPrescription && selectedPatientPrescription.length > 0 ? (
      selectedPatientPrescription.map((prescription, index) => (
        <div key={index} className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <h5>Prescription (Added on {new Date(prescription.created_at).toLocaleDateString()}):</h5>
            <FontAwesomeIcon
              icon={faTrash}
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDeletePrescription(prescription.id)}
            />
          </div>
          <p><strong>Medication:</strong> {prescription.medication}</p>
          <p><strong>dosage:</strong> {prescription.dosage}</p>
          <p><strong>Instructions:</strong> {prescription.instructions || "None"}</p>
          
          <hr />
        </div>
      ))
    ) : (
      <p>No Prescription available.</p>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={handleCloseShowPrescriptionModal}>
      Close
    </Button>
  </Modal.Footer>
</Modal>

<Modal show={showPrescriptionAddModal} onHide={handleCloseAddPrescriptionModel}>
        <Modal.Header closeButton>
          <Modal.Title>Add Prescription for {selectedPatient?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitPrescription(onSubmitPrescription, onError)}>
            <Form.Group className="mb-3">
              <Form.Label>Medication</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...registerPrescription("medication", { required: true })}
              />
              {prescriptionErrors.medication && <p>Medication is required</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dosage</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...registerPrescription("dosage", { required: true })}
              />
              {prescriptionErrors.dosage && <p>Dosage is required</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                {...registerPrescription("instructions")}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddPrescriptionModel}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Medical History Form */}
      <Modal show={showAddModal} onHide={handleCloseAddModal}>
        <Modal.Header closeButton>
          <Modal.Title>Add Medical History for {selectedPatient?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmitMedicalHistory(onSubmitMedicalHistory, onError)}>
            <Form.Group className="mb-3">
              <Form.Label>Diagnosis</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...registerMedicalHistory("diagnosis", { required: true })}
              />
              {medicalHistoryErrors.diagnosis && <p>Diagnosis is required</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Medications</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...registerMedicalHistory("medications", { required: true })}
              />
              {medicalHistoryErrors.medications && <p>Medications are required</p>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Allergies</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                {...registerMedicalHistory("allergies")}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Treatment History</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                {...registerMedicalHistory("treatment_history", { required: true })}
              />
              {medicalHistoryErrors.treatment_history && <p>Treatment History is required</p>}
            </Form.Group>

            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default PatientTable;

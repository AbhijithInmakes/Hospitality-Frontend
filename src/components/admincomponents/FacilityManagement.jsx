import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from "../../interceptor/axios";
import { Modal, Button, Table, Spinner } from "react-bootstrap";
import { useForm } from "react-hook-form";

function FacilityManagement() {
  const [facilities, setFacilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchFacilities();
  }, []);

  
  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('admins/facility/');
      setFacilities(response.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Modal
  const toggleModal = (type = 'add', facility = null) => {
    setModalType(type);
    setSelectedFacility(facility);
    if (facility) {
      reset({ name: facility.name, location: facility.location, department: facility.department });
    } else {
      reset({ name: '', location: '', department: '' });
    }
    setShowModal(true);
  };

  // Submit Add/Edit form
  const onSubmit = async (data) => {
    try {
      if (modalType === 'add') {
        await axiosInstance.post('admins/facility/', data);
      } else if (modalType === 'edit') {
        await axiosInstance.put(`admins/facility/${selectedFacility.id}/`, data);
      }
      fetchFacilities();
      setShowModal(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Delete facility
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await axiosInstance.delete(`admins/facility/${id}/`);
        fetchFacilities();
      } catch (error) {
        console.error('Error deleting facility:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" />
        <p>Loading facilities...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="heading-primary">Facility Management</h2>
        <Button variant="primary" onClick={() => toggleModal('add')}>
          <FontAwesomeIcon icon={faPlus} /> Add Facility
        </Button>
      </div>

     
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">Facilities</h5>
        </div>
        <div className="card-body p-0">
          <Table striped hover className="mb-0">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Location</th>
                <th>Department</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((facility, index) => (
                <tr key={facility.id}>
                  <td>{index + 1}</td>
                  <td>{facility.name}</td>
                  <td>{facility.location}</td>
                  <td>{facility.department}</td>
                  <td className="text-center">
                    <Button variant="warning" className="me-2" onClick={() => toggleModal('edit', facility)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button variant="danger" onClick={() => handleDelete(facility.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

     
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Add Facility' : 'Edit Facility'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Facility Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                {...register('name', { required: 'Facility name is required' })}
              />
              {errors.name && <small className="text-danger">{errors.name.message}</small>}
            </div>

            <div className="form-group mt-3">
              <label>Location</label>
              <input
                type="text"
                className={`form-control ${errors.location ? 'is-invalid' : ''}`}
                {...register('location', { required: 'Location is required' })}
              />
              {errors.location && <small className="text-danger">{errors.location.message}</small>}
            </div>

            <div className="form-group mt-3">
              <label>Department</label>
              <input
                type="text"
                className={`form-control ${errors.department ? 'is-invalid' : ''}`}
                {...register('department', { required: 'Department is required' })}
              />
              {errors.department && <small className="text-danger">{errors.department.message}</small>}
            </div>

            <Button variant="primary" type="submit" className="mt-4">
              {modalType === 'add' ? 'Add Facility' : 'Update Facility'}
            </Button>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default FacilityManagement;

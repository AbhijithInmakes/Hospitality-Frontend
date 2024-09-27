import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons'; // For icons
import { axiosInstance } from "../../interceptor/axios";

function UserDetail() {
  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    const fetchData = async () => {
      const response = await axiosInstance.get('user/details')
      setUsers(response.data);
    };
    
    fetchData();
  }, []);

  const updateUserStatus=async(id)=>{
    const response = await axiosInstance.put(`user/update-status/${id}/`)
  }

  
  const handleToggleActive = (id) => {
    updateUserStatus(id)
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, is_active: !user.is_active };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">User Management</h2>
       
      </div>

     
      <div className="card shadow-sm">
        <div className="card-header bg-info text-white">
          <h5 className="mb-0">User Details</h5>
        </div>
        <div className="card-body p-0">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${
                        user.is_active ? "btn-success" : "btn-danger"
                      }`}
                      onClick={() => handleToggleActive(user.id)}
                    >
                      <FontAwesomeIcon icon={user.is_active ? faCheckCircle : faTimesCircle} />
                      {` ${user.is_active ? "Activated" : "Inactive"}`}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Footer or Information */}
      <div className="mt-4">
        <p className="text-muted">Manage the status of users by activating or deactivating their accounts.</p>
      </div>
    </div>
  );
}

export default UserDetail;

import { useForm } from 'react-hook-form';
import { axiosInstance } from '../../interceptor/axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate()

  const onSubmit = async(data) => {
    console.log('Form Data:', data);
   
    try{
        const response=await axiosInstance.post('user/login/',data)
        console.log(response);
        localStorage.setItem("access_token",response.data.access)
        if (response.data.user_type==0){
          navigate('/patient-dashboard')
        }else if(response.data.user_type==1){
          navigate('/admin-dashboard')
        }else{
          navigate('/doctor-dashboard')
        }
        
    }catch(error){
        console.log(error);
        
    }
   
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4" style={{ width: '400px' }}>
    <h2 className="text-center mb-4 text-primary fw-bold">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
       
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            id="email"
            type="email"
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
                message: 'Enter a valid email address',
              },
            })}
            placeholder="Enter your email"
          />
          {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
        </div>

        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            id="password"
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            {...register('password', { required: true})}
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="invalid-feedback">
              
                 Password is required
            </div>
          )}
        </div>

       

        <button type="submit" className="btn btn-success w-100">Log in</button>
      </form>
    </div>
  </div>

  );
};

export default LoginPage;

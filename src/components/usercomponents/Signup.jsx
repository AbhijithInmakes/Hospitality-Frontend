import { useForm } from 'react-hook-form';
import { axiosInstance } from '../../interceptor/axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer} from 'react-toastify';


const SignupPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate= useNavigate()

  const onSubmit = async(data) => {
    console.log('Form Data:', data);
    data["user_type"]=parseInt(data["user_type"])
    try{
        const response=await axiosInstance.post('user/sign-up/',data)
        console.log(response);
        if(response.status===201){
            
        toast.success('Signup successful! Redirecting to login...', {
                
              }); 
          navigate('/login')

        }
        
    }catch(error){
      console.log(error);
      
       toast.error(error)

        
    }
   
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
    <div className="card p-4" style={{ width: '400px' }}>
    <ToastContainer/>
    <h2 className="text-center mb-4 text-primary fw-bold">Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username:</label>
          <input
            id="username"
            type="text"
            className={`form-control ${errors.username ? 'is-invalid' : ''}`}
            {...register('username', { required: true })}
            placeholder="Enter your username"
          />
          {errors.username && <div className="invalid-feedback">Username is required</div>}
        </div>

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
            {...register('password', { required: true, minLength: 6 })}
            placeholder="Enter your password"
          />
          {errors.password && (
            <div className="invalid-feedback">
              {errors.password.type === 'minLength'
                ? 'Password must be at least 6 characters'
                : 'Password is required'}
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="user_type" className="form-label">User Type:</label>
          <select id="user_type" className={`form-select ${errors.userType ? 'is-invalid' : ''}`} {...register('user_type', { required: true })}>
            <option value="">Select user type</option>
            <option value="0">Patient</option>
            <option value="1">Admin</option>
            <option value="2">Doctor</option>
          </select>
          {errors.user_ype && <div className="invalid-feedback">User type is required</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">Sign Up</button>
      </form>
    </div>
  </div>


  );
};

export default SignupPage;

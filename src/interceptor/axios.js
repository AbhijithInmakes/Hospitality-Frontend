import axios from 'axios'

const axiosInstance=axios.create({
    baseURL:'http://localhost:8000/'
})


axiosInstance.interceptors.request.use(
    (config)=>{
        const token=localStorage.getItem('access_token')
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config
    },
    (error)=>{
        console.log("I am error",error.response);
        
        throw Promise.reject(error);  
    }
);

axiosInstance.interceptors.response.use(
    (response) => {

      return response;
    },
    (error) => {
        if (error.response) {
           
            if (error.response.status === 401) {
               throw "Unauthorized"
            } else {
              console.log("Error:", error.response.status, error.response.data);
            }
          } else {
            
            console.log("Network error:", error.message);
          }
      
      throw error.response.data.message
    }
  );
  
  
  export { axiosInstance};
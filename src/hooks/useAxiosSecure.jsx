import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import useAuth from './useAuth'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

const useAxiosSecure = () => {
  const { user, logOut, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user?.accessToken) {
      const requestInterceptor = axiosInstance.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${user.accessToken}`
        return config
      })

      const responseInterceptor = axiosInstance.interceptors.response.use(
        res => res,
        err => {
          if (err?.response?.status === 401 || err?.response?.status === 403) {
            logOut()
              .then(() => console.log('Logged out successfully.'))
              .catch(console.error)
            navigate('/login')
          }
          return Promise.reject(err)
        }
      )

      return () => {
        axiosInstance.interceptors.request.eject(requestInterceptor)
        axiosInstance.interceptors.response.eject(responseInterceptor)
      }
    }
  }, [user, loading, logOut, navigate])

  // Always attach token if available (handles initial render race condition)
  if (user?.accessToken) {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${user.accessToken}`
  }

  return axiosInstance
}

export default useAxiosSecure

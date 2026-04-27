import useAuth from './useAuth'
import useAxiosSecure from './useAxiosSecure'
import { useQuery } from '@tanstack/react-query'

const useRole = () => {
    const { user, loading } = useAuth()
    const axiosSecure = useAxiosSecure()

    const { data: role, isLoading: isRoleLoading } = useQuery({
        enabled: !loading && !!user?.email,
        queryKey: ['role', user?.email],
        queryFn: async () => {
            const result = await axiosSecure.get(`/user/role`)
            return result.data?.role
        },
        staleTime: 5 * 60 * 1000,
    })

    return [role, isRoleLoading]
}

export default useRole

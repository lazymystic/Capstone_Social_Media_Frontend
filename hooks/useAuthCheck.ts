import { handleAuthRequest } from "@/components/utils/apiRequest";
import { BASE_API_URL } from "@/server";
import { setAuthUser } from "@/store/authSlice";
import axios from "axios"
import { useDispatch } from "react-redux";
import { toast } from "sonner";



export const useFollowUnfollow= ()=> {
    const dispatch = useDispatch();
    const handleFollowUnfollow = async (userId: string) => {
    
        const followRequest = async () => {
            return await axios.post(`${BASE_API_URL}/users/follow-unfollow/${userId}`, {}, { withCredentials: true });
        }
        const result = await handleAuthRequest(followRequest);
        if(result?.data.status === 'success') {
            dispatch(setAuthUser(result.data.data.user));
            toast.success(result.data.message);
        }
    }
    
    return { handleFollowUnfollow };
}
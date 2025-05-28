import API from '@/utils/AxiosInstance';

export const problemSolved = async (pid:string)=>{
   const response = await API.get("/problem/solved/all-problems",{
    withCredentials:true
    });

    const allProblems = response.data.data;
    return allProblems.includes(pid)
}
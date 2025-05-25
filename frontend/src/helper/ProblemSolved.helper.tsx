import axios from 'axios'

export const problemSolved = async (pid:string)=>{
   const response = await axios.get("http://localhost:3000/api/problem/solved/all-problems",{
    withCredentials:true
    });

    console.log("response: ",response);
    const allProblems = response.data.data;
    return allProblems.includes(pid)
}
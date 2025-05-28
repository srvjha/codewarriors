import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import API from "@/utils/AxiosInstance";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Toast, ToastError, ToastSuccess } from "@/utils/ToastContainers";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying...");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {userData}  = useSelector((state:RootState)=>state.auth)

  useEffect(() => {
    API
      .get(`/auth/verify/email/${token}`)
      .then((res) => {
        // console.log(res);
        setMessage(`✅ ${res.data.message}`);
        setIsSuccess(true);
        setIsLoading(false);
        setTimeout(() => navigate("/"), 3000);
      })
      .catch((error:any) => {
        setMessage(`❌ ${error.response.data.error} `);
        setIsSuccess(false);
        setIsLoading(false);
      });
  }, [token, navigate]);

  const LoadingSpinner = () => (
    <div className="w-8 h-8 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
  );

  const handleRequestVerificationLink = async()=>{
    try {
      const res = await API.post("/auth/resend/verify/email",{
        email:userData?.email
      },{withCredentials:true})

      if(res.data.success){
        ToastSuccess(res.data.message)
      }
    } catch (error:any) {
      ToastError(error.response.data.error)
    }
  }

  return (
    <>
    <Toast/>
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-zinc-900 border border-neutral-800  shadow-xl shadow-neutral-800">
        <CardHeader className="text-center pb-6 pt-8">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-700">
            <Mail className="w-8 h-8 text-blue-400" />
          </div>
          <CardTitle className="text-xl font-semibold text-white ">
            Email Verification
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center gap-6 pb-8">
          {isLoading && (
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner />
              <p className="text-gray-400 text-sm">Verifying your email...</p>
            </div>
          )}

          {!isLoading && (
            <>
              
              
              <h3 className={`text-lg font-medium text-center ${
                isSuccess ? "text-green-400" : "text-red-400"
              }`}>
                {message}
              </h3>

              {isSuccess ? (
                <p className="text-sm text-gray-400 text-center">
                  Redirecting to home...
                </p>
              ) : (
                <div className="flex gap-2">
                <Button 
                  onClick={() => navigate("/")}
                  className=" text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Go to Home
                </Button>

                <Button onClick={handleRequestVerificationLink}>Request Verification Link</Button>
               </div>
                
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  );
};

export default VerifyEmail;
import { setToken } from "@/lib/token";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Login(){

    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    const [loading, setLoading] = useState(false);

    const router = useRouter()

    const handleLogin = async (e:React.FormEvent) =>{

        e.preventDefault()

        if(!email || !password){
            alert("Email and password are required to login")
            return
        }

        try{
            setLoading(true)
            const res = await fetch("/api/auth/login",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({email,password})
            })

            const data = await res.json()

            if(res.ok){
                setToken(data.token)
                router.push("/")
            }else{
                alert("Login failed")
            }
        }catch(error){
            console.log(error)
            alert("Something went wrong")
        }finally{
            setLoading(false)
        }
    }

    return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white text-center">
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mt-2">
          Login to access your notes
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50 cursor-pointer  hover:scale-110 transition duration-300"
          >
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don't have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-blue-400 hover:underline cursor-pointer  hover:scale-110 transition duration-300"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
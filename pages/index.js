import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react';
import { firebaseApp } from "@/lib/firebase.js";
import { useRouter } from 'next/router';
import { Button, Input } from '@/components/ui-components/atoms/input';


export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const router = useRouter();

  //login function
  const login = async (event) => {
    event.preventDefault(firebaseApp);
    console.log(username, password);
    signInWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
        
        console.log(userCredential.user.email)
        router.push('/dashboard')
    })
    .catch((error) => {
        console.log(error.message);
    });
  }


  
  return (
    <div style={{height:'100vh', display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
    <div style={{ display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      
      {/* Fastracker Logo */}
        <div style={{padding: 10}}>
          <Image  src="/fastracker-icon-2.png" height={120} width={120}/>
        </div>
          
          <h1 style={{color: '#00C853', fontSize: 40}}>Fastracker</h1>
          <br/>
      
      {/* Login Form */}
      <form  onSubmit={login}>
              <Input placeholder='email address' type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <br/><Input  placeholder='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            
            <br/>
            <br/>
            <Button  type="submit">Login</Button>
        </form>
        
    </div>
    </div>
  )
}

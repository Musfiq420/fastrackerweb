
import '@/styles/globals.css'
import Head from 'next/head';
import { Provider } from 'react-redux';
import { wrapper } from '@/store/store';
import { ThemeProvider } from '@emotion/react'
import { Inter } from '@next/font/google'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { auth } from '@/lib/firebase';
import { useState } from 'react';
import theme from "../lib/theme.json";
import SquareNews from '@/components/data-components/squareNews';
import Sidebar from '@/components/layout/sidebar';
import LoadingComponent from '@/lib/LoadingComponent';


const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, ...rest }) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();


  // If loading variable is true then "LoadingComponet" will be shown. 
  // If there is user and current page is login page then it will be navigated to dashboard page
  // If there is no user and current page is other than login page then it will be navigated to login page

  if(loading)
  {
    return <main className={inter.className}><LoadingComponent /></main>
  }
  else if(user && router.pathname === '/')
  {
    router.push('/dashboard')
    return <main className={inter.className}><LoadingComponent /></main>
  }
  else if(!user && router.pathname !== '/')
  {
    router.push('/')
    return <main className={inter.className}><LoadingComponent /></main>
  }
  
  return (
  <Provider store={store}>
    <ThemeProvider theme={theme}>

      {/* Heading */}
    <Head>
      <title>Fastracker</title>
      <link rel="icon" href="/fastracker-icon-2.png" />
    </Head>

    {/* Sidebar */}
    <main className={inter.className}>
      <Sidebar />

      {/* Main Screen */}
      <div>
          <Component {...pageProps} />
      </div>

      {/* Square News */}
      <SquareNews />
    </main>
    
    </ThemeProvider>
  </Provider> );
}

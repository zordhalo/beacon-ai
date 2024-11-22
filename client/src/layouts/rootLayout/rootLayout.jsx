import './rootLayout.css';
import { Outlet, Link } from 'react-router-dom';
import { dark } from '@clerk/themes'
import { ClerkProvider, SignedIn, UserButton } from '@clerk/clerk-react';
import {QueryClient,QueryClientProvider,} from '@tanstack/react-query'


const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


const queryClient = new QueryClient()

const RootLayout = () => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/"
    appearance={{
      baseTheme: dark,
    }}>

          <QueryClientProvider client={queryClient}>


    <div className='rootLayout'>
        <header>
        <Link to="/" className="logo">
         <img src="/logo.png" alt="" />
         <span>Beacon.ai</span>
         </Link> 
            <div className="user">
          <SignedIn>
          <UserButton />
          </SignedIn>
            </div>
        </header>

        <main>
            <Outlet/>
        </main>

        </div>
      </QueryClientProvider>
    </ClerkProvider>
  )
}

export default RootLayout;
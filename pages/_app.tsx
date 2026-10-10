import { Analytics } from '@vercel/analytics/next'
import '../styles/globals.css'
import '../styles/wii-modding.css'


export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}


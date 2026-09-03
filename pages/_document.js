import { Html, Head, Main, NextScript } from 'next/document'

const WII_RODIN_WEIGHTS = [400, 500, 700, 800, 900]

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {WII_RODIN_WEIGHTS.map((weight) => (
          <link
            key={weight}
            rel="preload"
            href={`/fonts/mplus-rounded-${weight}.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

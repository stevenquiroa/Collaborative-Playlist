import Document, { Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <html>
        <Head/>
        <body className="custom_class">
          <Main />
          <NextScript />
          <script src="https://sdk.scdn.co/spotify-player.js"/>
        </body>
      </html>
    )
  }
}
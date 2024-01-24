/* eslint-disable react/no-danger */
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const cache = createCache()
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = () =>
        originalRenderPage({
          // eslint-disable-next-line react/display-name
          enhanceApp: (App) => (props) =>
              (
                  <StyleProvider cache={cache}>
                    <App {...props} />
                  </StyleProvider>
              ),
        })

    const initialProps = await Document.getInitialProps(ctx)
    return {
      ...initialProps,
      styles: (
          <>
            {initialProps.styles}
            <style
                data-test="extract"
                dangerouslySetInnerHTML={{ __html: extractStyle(cache) }}
            />
          </>
      ),
    }
  }

  render() {
    return (
        <Html lang="en">
          <Head>
            <link
                rel="icon"
                href="https://developers.line.biz/assets/icon/favicon.ico"
            />
            <link
                rel="shortcut icon"
                href="https://developers.line.biz/assets/icon/favicon.ico"
            />
          </Head>
          <body>
          <Main />
          <NextScript />
          </body>
        </Html>
    )
  }
}

export default MyDocument

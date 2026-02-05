import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'CodexLM Docs',
  description: 'Documentation for CodexLM'
}

const navbar = (
  <Navbar
    logo={<b>CodexLM Docs</b>}
  />
)
const footer = <Footer>CodexLM Documentation {new Date().getFullYear()}</Footer>

export default async function RootLayout({ children }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          docsRepositoryBase="https://github.com/your-repo/codexlm-docs"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

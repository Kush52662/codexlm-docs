import { Layout, Navbar, Footer } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'

export const metadata = {
  title: 'CodexLM Docs'
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap()
  
  const navbar = (
    <Navbar 
      logo={<b>CodexLM Docs</b>}
      projectLink="https://github.com/your-repo/codexlm-docs"
    />
  )
  
  const footer = (
    <Footer>
      CodexLM Documentation {new Date().getFullYear()}
    </Footer>
  )

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body>
        <Layout
          navbar={navbar}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/your-repo/codexlm-docs"
          footer={footer}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}

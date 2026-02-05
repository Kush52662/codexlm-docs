import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import './globals.css'
import RightChatDock from '@/components/RightChatDock'

export const metadata = {
  title: 'CodexLM Docs',
  description: 'Documentation for CodexLM'
}

export default async function RootLayout({ children }) {
  const pageMap = await getPageMap();
  
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head />
      <body className="codexlm-chat-docked">
        <Layout
          navbar={<Navbar logo={<b>CodexLM Documentation</b>} />}
          pageMap={pageMap}
          docsRepositoryBase="https://github.com/Kush52662/codexlm-docs"
          footer={<Footer>CodexLM Documentation {new Date().getFullYear()}</Footer>}
          sidebar={{
            defaultMenuCollapseLevel: 1
          }}
        >
          {children}
        </Layout>
        <RightChatDock />
      </body>
    </html>
  )
}

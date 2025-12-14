import React from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface MarkdownRendererProps {
  content: string
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components: Components = {
    h1: ({ ...props }) => (
      <h1 className='text-4xl font-bold mt-4 mb-4' {...props} />
    ),
    h2: ({ ...props }) => (
      <h2 className='text-3xl font-semibold mt-4 mb-3' {...props} />
    ),
    h3: ({ ...props }) => (
      <h3 className='text-2xl font-medium mt-4 mb-2' {...props} />
    ),
    h4: ({ ...props }) => (
      <h4 className='text-xl font-medium mt-4 mb-2' {...props} />
    ),
    h5: ({ ...props }) => (
      <h5 className='text-lg font-medium mt-4 mb-2' {...props} />
    ),
    h6: ({ ...props }) => (
      <h6 className='text-base font-medium mt-4 mb-2' {...props} />
    ),
    p: ({ ...props }) => <p className='my-4' {...props} />,
    code: ({ className, children, ...props }) => {
      const isInline = !className?.includes('language-')
      return isInline ? (
        <code className='bg-muted px-1 py-0.5 rounded text-sm' {...props}>
          {children}
        </code>
      ) : (
        <code
          className={`${className} bg-muted p-4 rounded-lg block overflow-auto text-sm`}
          {...props}
        >
          {children}
        </code>
      )
    },
    pre: ({ ...props }) => (
      <pre className='bg-muted p-4 rounded-lg overflow-auto' {...props} />
    ),
    ul: ({ ...props }) => <ul className='list-disc pl-6 my-4' {...props} />,
    ol: ({ ...props }) => <ol className='list-decimal pl-6 my-4' {...props} />,
    li: ({ ...props }) => <li className='my-1' {...props} />,
    blockquote: ({ ...props }) => (
      <blockquote
        className='border-l-4 border-primary pl-4 italic my-4'
        {...props}
      />
    ),
    table: ({ ...props }) => (
      <table
        className='border-collapse border border-border my-4 w-full'
        {...props}
      />
    ),
    thead: ({ ...props }) => <thead className='bg-muted' {...props} />,
    tbody: ({ ...props }) => <tbody {...props} />,
    th: ({ ...props }) => (
      <th
        className='border border-border p-2 font-semibold text-left'
        {...props}
      />
    ),
    td: ({ ...props }) => (
      <td className='border border-border p-2' {...props} />
    ),
    tr: ({ ...props }) => <tr className='even:bg-muted/50' {...props} />,
    a: ({ ...props }) => (
      <a className='text-primary underline hover:text-primary/80' {...props} />
    ),
    img: ({ ...props }) => (
      <img className='max-w-full h-auto rounded-lg my-4' {...props} />
    ),
    hr: ({ ...props }) => <hr className='my-8 border-border' {...props} />,
    strong: ({ ...props }) => <strong className='font-bold' {...props} />,
    em: ({ ...props }) => <em className='italic' {...props} />,
    br: ({ ...props }) => <br {...props} />,
  }

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  )
}

export default MarkdownRenderer

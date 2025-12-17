/// <reference types="next" />
/// <reference types="next/image-types/global" />

declare module '*.gif' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.png' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGSVGElement>>
  export default content
} 
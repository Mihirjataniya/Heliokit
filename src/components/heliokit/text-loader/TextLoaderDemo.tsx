import TextLoader from './TextLoader'

const TextLoaderDemo = () => {
    const letters = ['H','E','L','I','O','K','I','T']
    return (
    <div className='h-full flex items-center justify-center bg-black'>
      <TextLoader letters={letters} />
    </div>
  )
}

export default TextLoaderDemo

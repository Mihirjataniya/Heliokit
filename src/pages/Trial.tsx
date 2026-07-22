import TextLoaderDemo from '@/components/heliokit/text-loader/TextLoaderDemo'
import Seo from '@/seo/Seo'

/** Internal sandbox route — kept out of the index via robots.txt + noindex. */
const Trial = () => {
  return (
    <div>
      <Seo path="/trial" title="Sandbox" noindex />
      <h1 className="sr-only">HelioKit sandbox</h1>
      <TextLoaderDemo />
    </div>
  )
}

export default Trial

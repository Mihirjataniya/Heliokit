import { NebullaBackGround } from "./NebullaBackGround"




const NebulaBackgroundDemo = () => {
  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <NebullaBackGround exclusionRadius={250} particleCount={200} />

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className="text-6xl uppercase font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Interactive<br />Abstract
        </h1>
        <p className="mt-4 text-lg text-slate-300">
          Move your cursor to interact with the flowing particles and waves
        </p>
        <div className="mt-6 flex gap-4">
          <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md">
            Explore More
          </button>
          <button className="px-6 py-3 border border-white/30 text-white font-semibold rounded-lg">
            Learn About Us
          </button>
        </div>
      </div>
    </div>

  )
}

export default NebulaBackgroundDemo

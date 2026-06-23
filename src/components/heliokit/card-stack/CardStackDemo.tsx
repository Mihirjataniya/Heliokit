import { MoveDown } from "lucide-react";
import CardStack from "./CardStack"



export default function CardStackDemo() {
  const cards = [
  { id: 1, content: <Card1 /> },
  { id: 2, content: <Card2 /> },
  { id: 3, content: <Card3 />  },
  { id: 4, content: <Card4 />  },
  { id: 5, content: <Card5 /> },
]

  return <div className="flex flex-col justify-center items-center h-full w-full ">
     <p className="text-sm text-[#c0c0c0] flex items-center justify-center gap-2">   <MoveDown /> Scroll!</p>
     <CardStack cards={cards} />
  </div> 
}

// Card components with responsive improvements
const Card1: React.FC = () => (
  <div className="w-full h-full flex flex-col text-[#c0c0c0] lg:flex-row gap-3 sm:gap-4 md:gap-6 p-3 sm:p-4 md:p-6">
    <div className="flex-1">
      <img 
        src={"/demo/card-stack/paris.jpg"}
        alt="Paris Skyline"
        className="w-full h-32 sm:h-40 md:h-48 lg:h-full object-cover rounded-xl sm:rounded-2xl"
      />
    </div>
    <div className="flex-1 flex flex-col justify-between">
      <div className="space-y-2 sm:space-y-3 md:space-y-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
          City of Light
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
          Paris, the enchanting capital of France, beckons with its timeless elegance and romantic charm. 
          From the iconic Eiffel Tower to the cobblestone streets of Montmartre.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-6">
        <div className="bg-muted/30 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">2.16M</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Population</div>
        </div>
        <div className="bg-muted/30 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">105 km²</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Area</div>
        </div>
        <div className="bg-muted/30 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">20</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Districts</div>
        </div>
        <div className="bg-muted/30 rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 text-center">
          <div className="text-sm sm:text-lg md:text-xl lg:text-2xl font-bold text-primary">130</div>
          <div className="text-xs sm:text-sm text-muted-foreground">Museums</div>
        </div>
      </div>
    </div>
  </div>
);

const Card2: React.FC = () => (
  <div className="w-full h-full p-4 sm:p-6 md:p-8 flex flex-col justify-center text-[#c0c0c0] space-y-4 sm:space-y-6 md:space-y-8">
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
        A Tale of Two Millennia
      </h2>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed">
        Founded as Lutetia by the Parisii tribe around 250 BC, Paris has been the heartbeat of France for over two thousand years.
      </p>
    </div>
    
    <div className="space-y-2 sm:space-y-3 md:space-y-4">
      <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">
        The City of Revolution
      </h3>
      <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
        The cobblestones have witnessed the French Revolution, the Belle Époque, and the liberation of 1944. 
        Each boulevard carries the echoes of history.
      </p>
    </div>
  </div>
);

const Card3: React.FC = () => (
  <div className="w-full h-full relative overflow-hidden">
    <img 
      src={"/demo/card-stack/eiffel.jpg"}
      alt="Eiffel Tower at sunset"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 text-white">
      <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-2 sm:mb-3 md:mb-4">
        La Dame de Fer
      </h2>
      <p className="text-sm sm:text-base md:text-lg lg:text-xl opacity-90 max-w-xs sm:max-w-sm md:max-w-md">
        Built for the 1889 World's Fair, the Iron Lady stands 330 meters tall, 
        welcoming millions of dreamers to the City of Light.
      </p>
    </div>
  </div>
);

const Card4: React.FC = () => (
  <div className="w-full h-full p-3 text-[#c0c0c0] sm:p-4 md:p-6">
    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4 md:mb-6 text-center">
      Parisian Treasures
    </h2>
    <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-3 h-4/5 sm:h-5/6">
      {[
        { src: "/demo/card-stack/g1.jpg", alt: "Parisian Café" },
        { src: "/demo/card-stack/g2.jpg", alt: "Notre Dame" },
        { src: "/demo/card-stack/g3.jpg", alt: "Louvre Museum" },
        { src: "/demo/card-stack/g4.jpg", alt: "Arc de Triomphe" },
        { src: "/demo/card-stack/g5.jpg", alt: "Seine River" },
        { src: "/demo/card-stack/g6.jpg", alt: "Montmartre" },
        { src: "/demo/card-stack/g7.jpg", alt: "French Pastries" },
        { src: "/demo/card-stack/g8.jpg", alt: "Street Art" },
        { src: "/demo/card-stack/g6.jpg", alt: "Latin Quarter" }
      ].map((img, index) => (
        <div key={index} className="relative overflow-hidden rounded-md sm:rounded-lg group">
          <img 
            src={img.src} 
            alt={img.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
        </div>
      ))}
    </div>
  </div>
);

const Card5: React.FC = () => (
  <div className="w-full h-full text-[#c0c0c0] flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 text-center">
    <blockquote className="space-y-3 sm:space-y-4 md:space-y-6">
      <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-light text-foreground leading-tight">
        "When good Americans die,
        <br />
        they go to Paris."
      </p>
      <footer className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground font-medium">
        — Oscar Wilde
      </footer>
    </blockquote>
    <div className="mt-4 sm:mt-6 md:mt-8 w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-primary rounded-full" />
  </div>
);
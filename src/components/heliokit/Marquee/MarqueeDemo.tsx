
import { Marquee, MarqueeTrack, MarqueeWord } from "@/components/heliokit/Marquee/Marquee";

export interface HoverImageWordProps {
  text: string;
  image: string;
  alt?: string;
  imageWidth?: number;
  imageHeight?: number;
  offset?: number;
}


export default function InfiniteMarqueeExample() {
  const words = [
    { word: "Mountain", image: "https://plus.unsplash.com/premium_photo-1672115680958-54438df0ab82?q=80&w=1184&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { word: "Ocean", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800" },
    { word: "Desert", image: "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { word: "Forest", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800" },
    { word: "Cityscape", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800" },
    { word: "Sunset", image: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800" },
    { word: "Waterfall", image: "https://images.unsplash.com/photo-1607989899519-0dd55b8da249?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { word: "Valley", image: "https://plus.unsplash.com/premium_photo-1661956197580-008967ad1500?q=80&w=696&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  ]

  return (
    <div className="overflow-hidden flex flex-col items-center h-[80vh] justify-center">
      <Marquee direction="left" fontSize="text-8xl" speed={2}>
        <MarqueeTrack className="mt-12">
          {words.map((item, index) => (
            <MarqueeWord
              key={`${item.word}-${index}`}
              text={item.word}
              image={item.image}
              imageWidth={260}
              imageHeight={160}
            />
          ))}
        </MarqueeTrack>
      </Marquee>
      <Marquee direction="right" fontSize="text-8xl" speed={2}>
        <MarqueeTrack className="mt-12">
          {words.map((item, index) => (
            <MarqueeWord
              key={`${item.word}-${index}`}
              text={item.word}
              image={item.image}
              imageWidth={260}
              imageHeight={160}
            />
          ))}
        </MarqueeTrack>
      </Marquee>
      
      <p className="text-lg text-white flex items-center gap-2 mt-18"><svg fill="#ffffff" width="30px" height="30px" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M 13 2 C 11.355469 2 10 3.355469 10 5 L 10 16.8125 L 9.34375 16.125 L 9.09375 15.90625 C 7.941406 14.753906 6.058594 14.753906 4.90625 15.90625 C 3.753906 17.058594 3.753906 18.941406 4.90625 20.09375 L 4.90625 20.125 L 13.09375 28.21875 L 13.15625 28.25 L 13.1875 28.3125 C 14.535156 29.324219 16.253906 30 18.1875 30 L 19.90625 30 C 24.441406 30 28.09375 26.347656 28.09375 21.8125 L 28.09375 14 C 28.09375 12.355469 26.738281 11 25.09375 11 C 24.667969 11 24.273438 11.117188 23.90625 11.28125 C 23.578125 9.980469 22.394531 9 21 9 C 20.234375 9 19.53125 9.300781 19 9.78125 C 18.46875 9.300781 17.765625 9 17 9 C 16.648438 9 16.316406 9.074219 16 9.1875 L 16 5 C 16 3.355469 14.644531 2 13 2 Z M 13 4 C 13.554688 4 14 4.445313 14 5 L 14 16 L 16 16 L 16 12 C 16 11.445313 16.445313 11 17 11 C 17.554688 11 18 11.445313 18 12 L 18 16 L 20 16 L 20 12 C 20 11.445313 20.445313 11 21 11 C 21.554688 11 22 11.445313 22 12 L 22 16 L 24.09375 16 L 24.09375 14 C 24.09375 13.445313 24.539063 13 25.09375 13 C 25.648438 13 26.09375 13.445313 26.09375 14 L 26.09375 21.8125 C 26.09375 25.277344 23.371094 28 19.90625 28 L 18.1875 28 C 16.722656 28 15.457031 27.476563 14.40625 26.6875 L 6.3125 18.6875 C 5.867188 18.242188 5.867188 17.757813 6.3125 17.3125 C 6.757813 16.867188 7.242188 16.867188 7.6875 17.3125 L 12 21.625 L 12 5 C 12 4.445313 12.445313 4 13 4 Z"/> </svg>HOVER ON ANY</p>
    </div>

  )
}

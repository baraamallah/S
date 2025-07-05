import Balloons from "./balloons";
import CuteCat from "./cute-cat";
import Sparkles from "./sparkles";
import { Card, CardContent } from "@/components/ui/card";

export default function BirthdayGreeting() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center p-4 animate-in fade-in duration-1000">
      <Balloons />
      <Sparkles />

      <Card className="z-10 max-w-2xl text-center bg-card/80 backdrop-blur-sm shadow-2xl rounded-2xl animate-in fade-in zoom-in-95 duration-700">
        <CardContent className="p-8 md:p-12">
          <h1 className="font-headline text-5xl md:text-7xl text-primary-foreground/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
            Happy Birthday, Sondos!
          </h1>
          <p className="font-body text-lg md:text-xl mt-8 text-foreground/80">
            A year of moments, bright and new,
            <br />
            With skies of turquoise, just for you.
            <br />
            Like pinkest roses, may you bloom,
            <br />
            And chase away all winter gloom.
            <br />
            May every day in sweet gold shine,
            <br />A very happy birthday, be forever thine!
          </p>
        </CardContent>
      </Card>
      
      <CuteCat />
    </div>
  );
}

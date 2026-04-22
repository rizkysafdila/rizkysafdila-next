import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BlurFade } from "@/components/magicui/blur-fade";
import { MapPin } from "lucide-react";

export function ContactCard() {
  return (
    <Card className="w-full h-full overflow-hidden p-4 bg-gradient-to-br from-blue-500 to-blue-900 dark:bg-blue-600 border-none text-white shadow-none gap-1.5">
      <CardHeader className="px-2 py-0">
        <BlurFade delay={0.5} inView className="flex justify-between items-center gap-2">
          <h2 className="text-lg font-semibold">
            Contacts
          </h2>
        </BlurFade>
      </CardHeader>
      <CardContent className="p-2">
        <div className="space-y-3">
          <ContactItem />
        </div>
      </CardContent>
    </Card>
  );
}

const ContactItem = () => {
  return (
    <div className="flex items-center gap-4 p-1 bg-background rounded-lg">
      <div className="w-10 h-10 bg-green-600/20 rounded-md flex items-center justify-center">
        <MapPin className="w-5 h-5 text-green-400" />
      </div>
      <div className="flex-1">
        <p className="text-foreground text-sm">Indonesia</p>
      </div>
    </div>
  )
}
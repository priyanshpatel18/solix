import { Montserrat } from "next/font/google";

const montserratFont = Montserrat({
  subsets: ['latin'],
});

export const montserrat = montserratFont.className;
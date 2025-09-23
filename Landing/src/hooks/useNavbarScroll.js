import { useEffect, useState } from "react";

// Hook para manejar sticky y color del navbar
export default function useNavbarScroll() {
  const [navClass, setNavClass] = useState("");
  const [imglight, setImglight] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollup = document.documentElement.scrollTop;
      if (scrollup > 80) {
        setNavClass("nav-sticky");
        setImglight(true);
      } else {
        setNavClass("");
        setImglight(false);
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  return { navClass, imglight };
}

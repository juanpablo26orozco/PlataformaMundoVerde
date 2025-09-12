import { useEffect, useState } from "react";

// Hook para manejar sticky y color del navbar
export default function useNavbarScroll() {
  const [navClass, setNavClass] = useState("");
  const [imglight, setImglight] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollup = document.documentElement.scrollTop;
      if (scrollup > 80) {
        setNavClass("nav-sticky");
        setImglight(false);
      } else {
        setNavClass("");
        setImglight(true);
      }
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, []);

  return { navClass, imglight };
}

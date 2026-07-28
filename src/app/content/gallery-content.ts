/**
 * Gallery page content
 * Update this file to change text and gallery items
 */

import imgImageModernKitchenInstallation from "figma:asset/6c9c81f004e621b623a432bdb1fdea2a2f3038e9.png";
import imgImageModernKitchenInstallation1 from "figma:asset/0947c4766c3b4a3b6f639f6e1266d28c06a80a54.png";
import imgImageModernKitchenInstallation2 from "figma:asset/44982355ec39e402c42f7cc7f9f5008aaeda90e7.png";
import imgImageModernKitchenInstallation3 from "figma:asset/a7be56811c496c3c82dfb076749d74d511e625a1.png";

export const galleryContent = {
  hero: {
    title: "Our Work",
    subtitle: "Explore completed and in-progress projects from Cstle Livn, including the planning, installation, and finishing details behind each space.",
  },
  
  items: [
    { 
      id: 1, 
      image: imgImageModernKitchenInstallation, 
      title: "Flooring and Trims Installation", 
      category: "Living room" 
    },
    { 
      id: 2, 
      image: imgImageModernKitchenInstallation1, 
      title: "Modern Kitchen Installation", 
      category: "Kitchen" 
    },
    { 
      id: 3, 
      image: imgImageModernKitchenInstallation2, 
      title: "Contemporary Living Space", 
      category: "Living Room" 
    },
    { 
      id: 4, 
      image: imgImageModernKitchenInstallation3, 
      title: "Elegant Bathroom Finishing", 
      category: "Bathroom" 
    },
  ]
};

import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import imgImages from "figma:asset/6c9c81f004e621b623a432bdb1fdea2a2f3038e9.png";
import imgImages1 from "figma:asset/12cf540d98a69dcc308b6a173967f0bf706c8d87.png";
import imgImages2 from "figma:asset/422d92a4b4b64f430262c128a46c784915312be8.png";
import imgImages3 from "figma:asset/922ad65d6d2d4df8360921da699d6c59b65ee84a.png";
import imgImages4 from "figma:asset/a021c63ccf1213cd5076121b00c280753ea0730d.png";
import imgImages5 from "figma:asset/a7be56811c496c3c82dfb076749d74d511e625a1.png";

function CarouselCard({ images }: { images: string[] }) {
  return (
    <div className="h-[500px] sm:h-[700px] md:h-[60vh] relative rounded-[20px] md:rounded-[30px] lg:rounded-[40px] shadow-[0px_111px_35.5px_-98px_rgba(0,0,0,0.25),0px_79px_36.1px_-55px_rgba(0,0,0,0.3)] shrink-0 w-[600px] sm:w-[1000px] md:w-[calc(60vh*1.82)]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[20px] md:rounded-[30px] lg:rounded-[40px]">
        <div className="absolute bg-[#191919] inset-0 rounded-[20px] md:rounded-[30px] lg:rounded-[40px]" />
        {images.map((img, imgIdx) => (
          <img 
            key={imgIdx}
            alt={`Project showcase ${imgIdx + 1}`}
            className="absolute max-w-none object-50%-50% object-cover rounded-[20px] md:rounded-[30px] lg:rounded-[40px] size-full" 
            src={img} 
          />
        ))}
        <div className="absolute inset-0 rounded-[20px] md:rounded-[30px] lg:rounded-[40px]" />
      </div>
    </div>
  );
}

const carouselImages = [
  [imgImages],
  [imgImages1, imgImages2, imgImages3, imgImages4],
  [imgImages1, imgImages5],
  [imgImages2, imgImages3],
  [imgImages4, imgImages5]
];

export function Home() {
  return (
    <div className="bg-black content-stretch flex flex-col items-center relative min-h-screen w-full">
      {/* Hero Section */}
      <div className="bg-gradient-to-b box-border content-stretch flex flex-col from-75% from-[#f1f1f1] gap-[24px] md:gap-[48px] min-h-[600px] md:h-[915px] items-center pb-[80px] md:pb-[202px] pt-[28px] md:pt-[56px] px-0 relative shrink-0 w-full to-[rgba(255,255,255,0)]">
        <Header />
        
        {/* Main Content */}
        <div className="content-stretch flex flex-col gap-[24px] md:gap-[45px] items-center relative shrink-0 w-full">
          {/* Slogan */}
          <div className="box-border content-stretch flex flex-col items-center justify-center gap-[12px] px-[20px] md:px-[80px] lg:px-[175px] py-0 relative shrink-0 w-full">
            <h1 className="font-['Anybody',_sans-serif] leading-[1.031] relative text-[#191919] text-[24px] sm:text-[32px] md:text-[39.075px] text-center tracking-[-0.96px] md:tracking-[-1.563px] hyphens-none" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
              Install. Perfect. Finish.
            </h1>
            <p className="font-['Anybody',_sans-serif] leading-[1.5] relative text-[#191919]/70 text-center tracking-[-0.4px] max-w-[600px] text-[10px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
              Basement finishing, interior renovations, flooring, millwork, painting, and detail-driven installations in Saskatchewan and British Columbia.
            </p>
          </div>
          
          {/* Image Carousel */}
          <div className="relative w-full h-[500px] sm:h-[700px] md:h-[60vh] overflow-hidden flex items-center justify-center">
            {/* Scrolling cards */}
            <div 
              className="flex gap-[20px] md:gap-[35px] lg:gap-[45px] items-center animate-[scroll-left_100s_linear_infinite]" 
              style={{ width: 'max-content' }}
            >
              {/* First set of cards */}
              {carouselImages.map((images, idx) => (
                <CarouselCard key={`first-${idx}`} images={images} />
              ))}
              {/* Duplicate set of cards for seamless loop */}
              {carouselImages.map((images, idx) => (
                <CarouselCard key={`second-${idx}`} images={images} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement & CTA */}
      <div className="box-border content-stretch flex flex-col gap-[60px] md:gap-[120px] lg:gap-[162px] items-center justify-center px-[20px] md:px-[40px] lg:px-[80px] py-[80px] md:py-[120px] lg:py-[169px] relative shrink-0 w-full max-w-[1400px] mx-auto">
        <div className="font-['Anybody',_sans-serif] leading-[1.47] max-w-[900px] relative shrink-0 text-[15px] md:text-[17px] lg:text-[20px] text-center text-white tracking-[-0.6px] md:tracking-[-0.68px] lg:tracking-[-0.8px] w-full px-[10px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
          <p className="mb-0">We complete basements and interior spaces with clear planning, careful installation, and clean finishing. No guesswork, no unnecessary handoffs, and no shortcuts—just dependable execution and attention to the details that bring a space together.</p>
        </div>

        <div className="content-stretch flex flex-col sm:flex-row gap-[10px] items-center justify-center relative shrink-0 w-full">
          <Link
            to="/book"
            className="bg-white box-border content-stretch flex items-start px-[40px] md:px-[53px] py-[16px] md:py-[18px] relative rounded-[32.238px] shrink-0 hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col font-['Roboto_Mono',_sans-serif] justify-center leading-[0] relative shrink-0 text-[12px] md:text-[14px] text-black text-center text-nowrap uppercase">
              <p className="leading-[1.2] whitespace-pre">Request a Free Estimate</p>
            </div>
          </Link>
          <Link
            to="/gallery"
            className="bg-transparent border border-white/40 box-border content-stretch flex items-start px-[40px] md:px-[53px] py-[16px] md:py-[18px] relative rounded-[32.238px] shrink-0 hover:bg-white/10 transition-colors"
          >
            <div className="flex flex-col font-['Roboto_Mono',_sans-serif] justify-center leading-[0] relative shrink-0 text-[12px] md:text-[14px] text-white text-center text-nowrap uppercase">
              <p className="leading-[1.2] whitespace-pre">View Our Work</p>
            </div>
          </Link>
        </div>
      </div>

      {/* What We Do */}
      <div className="bg-[#f1f1f1] relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-col gap-[40px] md:gap-[56px] items-center px-[20px] md:px-[40px] lg:px-[80px] py-[60px] md:py-[100px] relative w-full max-w-[1200px] mx-auto">
          <div className="flex flex-col gap-[12px] items-center text-center">
            <h2 className="font-['Anybody',_sans-serif] leading-[1.031] text-[#191919] text-[22px] sm:text-[28px] md:text-[32px] tracking-[-0.88px] md:tracking-[-1.28px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
              What We Do
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[20px] w-full">
            {[
              { title: "Basement Finishing & Development", desc: "Planning and completing functional basement spaces through the final finish." },
              { title: "Interior Renovations", desc: "Focused improvements for individual rooms and larger interior transformations." },
              { title: "Flooring & Millwork Installation", desc: "Precise installation of flooring, trim, baseboards, doors, and interior millwork." },
              { title: "Painting & Drywall Finishing", desc: "Surface preparation, drywall finishing, and clean interior painting." },
              { title: "Final Finishing & Detail Work", desc: "The finishing work that brings the completed space together." },
              { title: "Project Planning & Coordination", desc: "Clear project planning, scheduling, and trade coordination to keep the work organized from start to finish." },
            ].map((service) => (
              <div key={service.title} className="bg-white rounded-[16px] md:rounded-[20px] px-[24px] py-[24px] md:py-[28px] flex flex-col gap-[8px]">
                <p className="font-['Anybody',_sans-serif] leading-[1.3] text-[#191919] text-[14px] md:text-[15px] tracking-[-0.56px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                  {service.title}
                </p>
                <p className="font-['Anybody',_sans-serif] leading-[1.6] text-[#191919]/60 text-[13px] md:text-[14px] tracking-[-0.4px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
          <Link
            to="/book"
            className="bg-[#191919] box-border content-stretch flex items-start px-[40px] md:px-[53px] py-[16px] md:py-[18px] relative rounded-[32.238px] shrink-0 hover:bg-black transition-colors"
          >
            <div className="flex flex-col font-['Roboto_Mono',_sans-serif] justify-center leading-[0] relative shrink-0 text-[12px] md:text-[14px] text-white text-center text-nowrap uppercase">
              <p className="leading-[1.2] whitespace-pre">Discuss Your Project</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Service Areas */}
      <div className="relative shrink-0 w-full">
        <div className="box-border content-stretch flex flex-col gap-[16px] items-center px-[20px] md:px-[40px] py-[48px] md:py-[72px] relative w-full max-w-[800px] mx-auto text-center">
          <p className="font-['Roboto_Mono',_sans-serif] text-[11px] text-[#848580] uppercase tracking-[0.12em]">Service Areas</p>
          <p className="font-['Anybody',_sans-serif] leading-[1.6] text-white text-[14px] md:text-[15px] tracking-[-0.56px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
           Proudly serving Central Saskatchewan, British Columbia’s Lower Mainland, and the Fraser Valley. Contact us to confirm availability in your community.
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import imgImageOurCraftsmanship from "figma:asset/12cf540d98a69dcc308b6a173967f0bf706c8d87.png";

export function Mission() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start relative min-h-screen w-full">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-[#d9d9d9] to-[#ffffff] w-full flex flex-col items-center pt-[28px] md:pt-[56px] pb-[28px] md:pb-[56px]">
        <div className="content-stretch flex flex-col gap-[40px] md:gap-[80px] items-center w-full">
          <Header />
          
          <div className="box-border content-stretch flex flex-col items-start px-[20px] md:px-[16px] py-0 relative shrink-0 w-full max-w-[704px]">
            <div className="relative shrink-0 w-full">
              <div className="flex flex-row items-center justify-center size-full">
                <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-[10px] md:px-[23px] py-0 relative w-full">
                  <h1 className="font-['Anybody',_sans-serif] leading-[1.031] relative shrink-0 text-[#191919] text-[28px] md:text-[39.075px] text-center tracking-[-1.12px] md:tracking-[-1.563px] hyphens-none" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                    Our Mission
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Content */}
      <div className="w-full px-[20px] md:px-[40px] lg:px-[80px] py-[50px] md:py-[80px] lg:py-[100px] max-w-[1600px] mx-auto">
        <div className="content-stretch flex flex-col gap-[48px] md:gap-[72px] lg:gap-[96px] items-start w-full">
          {/* Main Content Grid */}
          <div className="gap-[32px] md:gap-[48px] lg:gap-[64px] grid grid-cols-1 lg:grid-cols-2 relative shrink-0 w-full">
            {/* Image */}
            <div className="relative rounded-[16px] md:rounded-[24px] lg:rounded-[32px] shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] shrink-0 h-[300px] md:h-[400px] lg:h-auto">
              <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px] md:rounded-[24px] lg:rounded-[32px]">
                <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[16px] md:rounded-[24px] lg:rounded-[32px]" />
                <img alt="Our craftsmanship" className="absolute max-w-none object-50%-50% object-cover rounded-[16px] md:rounded-[24px] lg:rounded-[32px] size-full" src={imgImageOurCraftsmanship} />
              </div>
            </div>

            {/* Content Column */}
            <div className="content-stretch flex flex-col gap-[20px] md:gap-[28px] lg:gap-[32px] items-start relative shrink-0 w-full">
              {/* Heading and intro */}
              <div className="content-stretch flex flex-col gap-[12px] md:gap-[16px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
                  <h2 className="font-['Anybody',_sans-serif] leading-[1.2] md:leading-[32px] relative shrink-0 text-[#191919] text-[20px] md:text-[24px] tracking-[-0.8px] md:tracking-[-0.96px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                    Forging Dreams, Fortifying Legacies
                  </h2>
                </div>
                <div className="box-border content-stretch flex gap-[10px] items-center justify-center px-0 py-px relative shrink-0 w-full">
                  <p className="font-['Anybody',_sans-serif] leading-[1.64] relative text-[#191919] text-[13px] md:text-[14px] tracking-[-0.52px] md:tracking-[-0.56px] w-full" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                    At Cstle Livn, we know that your space reflects who you are. We believe that exceptional finishing work is essential to showcasing your refined living. We're not just installers—we're finishing experts who understand that every detail matters.
                  </p>
                </div>
              </div>

              {/* What We Stand For */}
              <div className="content-stretch flex flex-col gap-[10px] md:gap-[12px] items-start relative shrink-0 w-full">
                <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
                  <h3 className="font-['Anybody',_sans-serif] leading-[1.64] relative shrink-0 text-[#191919] text-[14px] md:text-[15px] tracking-[-0.56px] md:tracking-[-0.6px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                    What We Stand For
                  </h3>
                </div>
                <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                  {[
                    "Precision in every installation",
                    "Design-focused execution",
                    "Quality materials and techniques",
                    "Timely, professional service",
                    "Collaboration with contractors and designers"
                  ].map((item, idx) => (
                    <div key={idx} className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                      <div className="h-[24px] relative shrink-0 w-[14.18px]">
                        <p className="absolute font-['Inter',_sans-serif] leading-[24px] left-0 text-[#191919] text-[16px] text-nowrap top-[-0.5px] tracking-[-0.3125px] whitespace-pre">→</p>
                      </div>
                      <div className="relative shrink-0">
                        <p className="font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[13px] md:text-[14px] tracking-[-0.52px] md:tracking-[-0.56px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                          {item}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="bg-[#f1f1f1] relative rounded-[16px] md:rounded-[20px] lg:rounded-[24px] shrink-0 w-full">
                <div className="flex flex-col justify-center size-full">
                  <div className="box-border content-stretch flex flex-col items-start justify-center p-[20px] md:p-[28px] lg:p-[32px] relative size-full">
                    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                      <p className="font-['Anybody',_sans-serif] leading-[1.64] relative shrink-0 text-[#191919] text-[14px] md:text-[15px] tracking-[-0.56px] md:tracking-[-0.6px] w-full" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                        "We transform spaces through meticulous attention to detail and a deep respect for the design vision."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="content-stretch flex flex-col md:flex-row gap-[32px] md:gap-[46px] items-start justify-center relative shrink-0 w-full">
            {[
              {
                title: "Design-Driven",
                description: "We understand aesthetics is as important as function and work closely with clients to bring their vision to life with precision."
              },
              {
                title: "Expert Execution",
                description: "Years of experience in finishing installations, painting, and detail work ensure flawless results."
              },
              {
                title: "Professional Partnership",
                description: "Whether you're a contractor, designer, or homeowner, we deliver reliable, quality service every time."
              }
            ].map((value, idx) => (
              <div key={idx} className="w-full md:basis-0 md:grow min-h-px min-w-px relative shrink-0">
                <div className="size-full">
                  <div className="box-border content-stretch flex flex-col gap-[12px] md:gap-[16px] items-start p-[20px] md:pb-0 md:pt-[24px] md:px-[24px] relative w-full">
                    <div className="relative shrink-0 w-full">
                      <p className="font-['Anybody',_sans-serif] leading-[1.64] relative text-[#191919] text-[15px] md:text-[15px] text-center tracking-[-0.6px] w-full" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 700 }}>
                        {value.title}
                      </p>
                    </div>
                    <div className="relative shrink-0 w-full">
                      <p className="font-['Anybody',_sans-serif] leading-[1.64] text-[#191919] text-[13px] md:text-[14px] text-center tracking-[-0.56px]" style={{ fontVariationSettings: "'wdth' 137", fontWeight: 500 }}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
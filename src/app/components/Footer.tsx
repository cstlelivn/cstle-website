import { Link } from "react-router-dom";
import svgPaths from "../imports/svg-tblcf7tjug";
import logoSvgPaths from "../imports/svg-n1ofvmf1l9";

export function Footer() {
  return (
    <div className="bg-black box-border content-stretch flex flex-col gap-[20px] items-center pb-[22px] pt-[50px] md:pt-[99px] px-0 relative shrink-0 w-full">
      {/* Main Footer Content */}
      <div className="relative shrink-0 w-full">
        <div aria-hidden="true" className="hidden md:block absolute border-[#999999] border-[1px_0px] border-solid inset-0 pointer-events-none" />
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col md:flex-row items-start md:items-start justify-between px-[20px] md:px-[50px] lg:px-[100px] py-[30px] md:py-[43px] relative w-full gap-[40px] md:gap-0">
            {/* Logo */}
            <div className="content-stretch flex flex-col gap-[32px] md:gap-[52px] items-center md:items-center justify-center relative shrink-0 w-full md:w-auto">
              <Link to="/" className="h-[28px] md:h-[35px] relative shrink-0 w-[72px] md:w-[89px]">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 89 35">
                  <path d={logoSvgPaths.p2f280900} fill="white" />
                  <path d={logoSvgPaths.pf83e772} fill="white" />
                </svg>
              </Link>
            </div>

            {/* Links Container */}
            <div className="content-stretch flex flex-col md:flex-row items-start justify-between relative shrink-0 w-full md:w-auto gap-[40px] md:gap-[60px] lg:gap-[80px]">
              {/* Company Links */}
              <div className="content-stretch flex flex-col gap-[25px] items-start leading-[0] relative shrink-0 text-[14px] uppercase">
                <div className="flex flex-col font-['Roboto_Mono',_sans-serif] h-[28px] justify-center relative shrink-0 text-[#eeeeee] w-[99.734px]">
                  <p className="leading-[1.2]">Company</p>
                </div>
                <div className="flex flex-col font-['Roboto_Mono',_sans-serif] justify-center leading-[1.2] relative shrink-0 text-[#cccccc] w-[100.65px]">
                  <Link to="/mission" className="mb-0 hover:text-white transition-colors">Our Approach</Link>
                  <Link to="/gallery" className="mb-[4px] hover:text-white transition-colors">Our Work</Link>
                  <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
                </div>
              </div>

              {/* Information Links */}
              <div className="content-stretch flex flex-col gap-[25px] items-start leading-[0] relative shrink-0 text-[14px] uppercase">
                <div className="flex flex-col font-['Roboto_Mono',_sans-serif] h-[28px] justify-center relative shrink-0 text-[#eeeeee] w-[111.813px]">
                  <p className="leading-[1.2]">Infomation</p>
                </div>
                <div className="flex flex-col font-['Roboto_Mono',_sans-serif] justify-center leading-[1.2] relative shrink-0 text-[#cccccc] w-[146.13px]">
                  <Link to="/contact" className="mb-0 hover:text-white transition-colors">Contact Us</Link>
                  <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
                  {/* Terms link removed while page is disabled -- see App.tsx */}
                </div>
              </div>
            </div>

            {/* Review & Social */}
            <div className="content-stretch flex flex-col gap-[30px] md:gap-[50px] items-start relative shrink-0 w-full md:w-auto">
              <div className="content-stretch flex gap-[10px] items-center justify-center md:justify-start relative shrink-0 w-full md:w-auto">
                <div className="flex flex-col font-['Roboto_Mono',_sans-serif] justify-center leading-[0] relative shrink-0 text-[#eeeeee] text-[0px] uppercase w-full md:w-auto max-w-full">
                  <p className="leading-[1.2] text-[12px] md:text-[14px] text-center md:text-left break-words">
                    <span>Saskatchewan & British Columbia</span>
                  </p>
                </div>
              </div>

              {/* Social Icons */}
              <div className="content-stretch flex gap-[23px] items-start justify-center md:justify-start relative shrink-0 w-full md:w-auto">
                {/* Instagram */}
                <a href="#" className="relative shrink-0 size-[16px] hover:opacity-70 transition-opacity">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g clipPath="url(#clip0_53_1591)">
                      <path d={svgPaths.pf942f00} fill="white" />
                      <path d={svgPaths.p82b6300} fill="white" />
                      <path d={svgPaths.p890df80} fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_53_1591">
                        <rect fill="white" height="16" width="16" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                
                {/* Facebook */}
                <a href="#" className="h-[16px] relative shrink-0 w-[17.073px] hover:opacity-70 transition-opacity">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 16">
                    <g clipPath="url(#clip0_53_1588)">
                      <path d={svgPaths.p399459f0} fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_53_1588">
                        <rect fill="white" height="16" width="17.0728" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
                
                {/* X/Twitter */}
                <a href="#" className="relative shrink-0 size-[16px] hover:opacity-70 transition-opacity">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <path d={svgPaths.p1ed3a780} fill="white" />
                  </svg>
                </a>
                
                {/* LinkedIn */}
                <a href="#" className="relative shrink-0 size-[16px] hover:opacity-70 transition-opacity">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
                    <g clipPath="url(#clip0_53_1582)">
                      <path d={svgPaths.p114d3270} fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_53_1582">
                        <rect fill="white" height="16" width="16" />
                      </clipPath>
                    </defs>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="relative shrink-0 w-full">
        <div className="flex flex-row items-center size-full">
          <div className="box-border content-stretch flex flex-col md:flex-row font-['Inter',_sans-serif] items-center justify-between gap-[10px] md:gap-0 leading-[0] px-[20px] md:px-[50px] py-[10px] relative text-[#848580] text-[10px] md:text-[12px] w-full">
            <div className="flex flex-col h-[24px] justify-center relative shrink-0 w-full md:w-auto text-center md:text-left">
              <p className="leading-[24px]">© 2025 Cstle Livn Inc.</p>
            </div>
            <div className="flex flex-col h-[24px] justify-center relative shrink-0 text-center md:text-right w-full md:w-auto">
              <p className="leading-[24px]">Designed by Dhemian.ca</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
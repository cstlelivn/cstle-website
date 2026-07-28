import { useState } from "react";
import { Link } from "react-router-dom";
import svgPaths from "../imports/svg-n1ofvmf1l9";
import { Menu, X } from "lucide-react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        {/* Desktop Navigation - Only show on screens 768px and wider */}
        <div className="hidden md:block box-border content-stretch px-[40px] lg:px-[79px] py-0 relative w-full">
          <div className="flex items-start justify-between w-full">
            {/* Left Menu */}
            <div className="basis-0 content-stretch flex flex-col font-['Roboto_Mono',_sans-serif] gap-[9px] grow items-start leading-[0] min-h-px min-w-px relative shrink-0 text-[#191919] text-[12px] lg:text-[14px] text-nowrap text-right uppercase">
              <Link to="/book" className="flex flex-col justify-center relative shrink-0 hover:opacity-70 transition-opacity">
                <p className="leading-[1.2] text-nowrap whitespace-pre">Request an Estimate</p>
              </Link>
              <Link to="/gallery" className="flex flex-col justify-center relative shrink-0 hover:opacity-70 transition-opacity">
                <p className="leading-[1.2] text-nowrap whitespace-pre">Our Work</p>
              </Link>
            </div>

            {/* Center Logo */}
            <Link to="/" className="h-[28px] lg:h-[35px] relative shrink-0 w-[72px] lg:w-[89px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 89 35">
                <path d={svgPaths.p2f280900} fill="#191919" />
                <path d={svgPaths.pf83e772} fill="#191919" />
              </svg>
            </Link>

            {/* Right Menu */}
            <div className="basis-0 content-stretch flex flex-col font-['Roboto_Mono',_sans-serif] gap-[9px] grow items-end leading-[0] min-h-px min-w-px relative shrink-0 text-[#191919] text-[12px] lg:text-[14px] text-nowrap text-right uppercase">
              <Link to="/mission" className="flex flex-col justify-center relative shrink-0 hover:opacity-70 transition-opacity">
                <p className="leading-[1.2] text-nowrap whitespace-pre">Our Approach</p>
              </Link>
              <Link to="/contact" className="flex flex-col justify-center relative shrink-0 hover:opacity-70 transition-opacity">
                <p className="leading-[1.2] text-nowrap whitespace-pre">Contact</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Navigation - Only show on screens smaller than 768px */}
        <div className="block md:hidden px-[20px] py-[16px] flex items-center justify-between w-full relative z-50">
          {/* Mobile Logo */}
          <Link to="/" className="h-[28px] w-[72px]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 89 35">
              <path d={svgPaths.p2f280900} fill="#191919" />
              <path d={svgPaths.pf83e772} fill="#191919" />
            </svg>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-[#191919] hover:opacity-70 transition-opacity z-50 relative"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} strokeWidth={2} /> : <Menu size={28} strokeWidth={2} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="block md:hidden absolute top-full left-0 w-full bg-white z-40 shadow-lg border-t border-gray-200">
            <nav className="flex flex-col font-['Roboto_Mono',_sans-serif] text-[14px] uppercase text-[#191919] py-[20px]">
              <Link
                to="/book"
                className="px-[20px] py-[16px] hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Request an Estimate
              </Link>
              <Link
                to="/gallery"
                className="px-[20px] py-[16px] hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Work
              </Link>
              <Link
                to="/mission"
                className="px-[20px] py-[16px] hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Our Approach
              </Link>
              <Link
                to="/contact"
                className="px-[20px] py-[16px] hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/faq"
                className="px-[20px] py-[16px] hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ
              </Link>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

export function Terms() {
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
                    Terms & Conditions
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="w-full px-[20px] md:px-[40px] lg:px-[80px] py-[50px] md:py-[80px] lg:py-[100px] max-w-[900px] mx-auto">
        <div className="content-stretch flex flex-col gap-[32px] md:gap-[48px] items-start w-full">
          
          {/* Document Header */}
          <div className="w-full border-b border-[#191919] pb-[16px]">
            <h2 className="font-['Roboto_Mono',_monospace] text-[14px] uppercase mb-[8px]" style={{ fontWeight: 700 }}>
              CSTLE LIVN INC. — STANDARD SERVICE TERMS & CONDITIONS
            </h2>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] mb-[4px]" style={{ fontWeight: 400 }}>
              Last Updated: October 2025
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] mb-[4px]" style={{ fontWeight: 400 }}>
              Website: www.cstlelivn.ca
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] mb-[4px]" style={{ fontWeight: 400 }}>
              Email: info@cstlelivn.ca
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px]" style={{ fontWeight: 400 }}>
              Registered Office: Regina, Saskatchewan, Canada
            </p>
          </div>

          {/* Section 1 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              1. Introduction
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Welcome to Cstle Livn Inc. ("we", "our", or "the Company").
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              These Service Terms and Conditions ("Terms") govern all agreements, projects, and professional services performed by Cstle Livn Inc. for any client, contractor, partner, or organization ("the Client").
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              By engaging our services, granting site access, or paying any invoice issued by Cstle Livn Inc., the Client acknowledges having read, understood, and agreed to these Terms.
            </p>
          </div>

          {/* Section 2 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              2. Legal Relationship
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Cstle Livn Inc. operates as an independent contractor.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              No partnership, employment, agency, or joint venture relationship is created between the Company and any Client, contractor, or partner through engagement or communication.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              All correspondence, contracts, and invoices are issued in the legal name: Cstle Livn Inc., a corporation registered in Saskatchewan, Canada.
            </p>
          </div>

          {/* Section 3 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              3. Scope of Work
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Our services include but are not limited to:
            </p>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "Residential and commercial finishing",
                "Painting and wall finishing",
                "Flooring installation",
                "Custom carpentry and millwork",
                "Design and renovation coordination",
                "Project management and general contracting support"
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Specific deliverables are defined per project proposal, quotation, or invoice.
            </p>
          </div>

          {/* Section 4 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              4. Engagement and Acceptance
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Work commences when:
            </p>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "A quotation or estimate is approved (verbally or in writing),",
                "Site access is granted, or",
                "A payment, deposit, or invoice acknowledgment is made."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              All projects are subject to these Terms regardless of the medium of communication.
            </p>
          </div>

          {/* Section 5 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              5. Change Orders and Variations
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Any request for additional work, alterations, or material substitutions outside the original scope must be:
            </p>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "Documented via written or digital Change Order, and",
                "Approved by both parties before execution."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Costs and timelines may adjust accordingly.
            </p>
          </div>

          {/* Section 6 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              6. Materials and Equipment
            </h3>
            <ul className="ml-[24px]">
              {[
                "Unless otherwise stated, materials are provided by the Client or Builder.",
                "When Cstle Livn Inc. supplies materials, costs will be itemized and billed with a standard markup to cover sourcing, logistics, and overhead.",
                "Substitutions of equal or superior quality may be made if a specified product is unavailable."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc mb-[6px]" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 7 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              7. Workmanship and Warranty
            </h3>
            <ul className="ml-[24px]">
              {[
                "Cstle Livn Inc. guarantees workmanship quality for seven (7) days following completion or handover.",
                "The warranty covers direct workmanship defects only and excludes issues caused by misuse, structural deficiencies, third-party interference, or material failures.",
                "Warranty claims must be submitted in writing with photographic evidence within the warranty period.",
                "Post-warranty service or rework will be invoiced separately."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc mb-[6px]" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 8 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              8. Payment Terms
            </h3>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "Payment due date: within 7 calendar days of invoice issuance unless otherwise agreed in writing.",
                "Late payment fee: 2% per week (or maximum permitted by law).",
                "Non-payment: Work may be suspended until outstanding amounts are settled.",
                "Cancellations or suspension: Completed work to date shall be invoiced and payable immediately."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc mb-[6px]" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              The Company reserves the right to apply mechanic's liens or builder's liens on unpaid balances as permitted under The Builders' Lien Act (Saskatchewan).
            </p>
          </div>

          {/* Section 9 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              9. Liability and Risk Allocation
            </h3>
            <ul className="ml-[24px]">
              {[
                "The Client acknowledges that construction and renovation work involves inherent risks.",
                "Cstle Livn Inc. maintains commercial general liability insurance and follows all provincial safety standards.",
                "The Company shall not be held liable for indirect, incidental, consequential, or special damages, including loss of profit, project delays, or inconvenience.",
                "Liability is strictly limited to the total amount paid by the Client for the specific service under dispute."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc mb-[6px]" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 10 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              10. Site Conditions and Client Responsibilities
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              The Client must:
            </p>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "Provide a safe and accessible job site compliant with provincial safety standards;",
                "Ensure all relevant permits, utility markings, and inspections are in place;",
                "Notify Cstle Livn Inc. of any known hazards, property conditions, or environmental concerns."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Cstle Livn Inc. reserves the right to pause work if unsafe conditions exist.
            </p>
          </div>

          {/* Section 11 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              11. Photography, Videography, and Promotional Use
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Cstle Livn Inc. takes pride in its craftsmanship and reserves the right to document and publish its work for promotional purposes.
            </p>
            
            <h4 className="font-['Roboto_Mono',_monospace] text-[11px] mt-[12px] mb-[8px]" style={{ fontWeight: 700 }}>
              11.1 Ownership of Visual Content
            </h4>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              All photos and videos captured by or for Cstle Livn Inc. during or after a project are the exclusive property of the Company.
            </p>

            <h4 className="font-['Roboto_Mono',_monospace] text-[11px] mt-[12px] mb-[8px]" style={{ fontWeight: 700 }}>
              11.2 Authorized Use
            </h4>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              The Company may use, publish, reproduce, and distribute such materials—without compensation to the Client—for:
            </p>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "Portfolio presentation (website, print, or video)",
                "Social media posts (Instagram, TikTok, YouTube, LinkedIn, etc.)",
                "Marketing and advertising campaigns",
                "Training and internal documentation"
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>

            <h4 className="font-['Roboto_Mono',_monospace] text-[11px] mt-[12px] mb-[8px]" style={{ fontWeight: 700 }}>
              11.3 Privacy Compliance
            </h4>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "Cstle Livn Inc. complies with the Personal Information Protection and Electronic Documents Act (PIPEDA).",
                "The Company will not intentionally feature faces, private family images, personal items, or identifying information without consent.",
                "Content will focus solely on the craftsmanship, architectural features, and design results."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>

            <h4 className="font-['Roboto_Mono',_monospace] text-[11px] mt-[12px] mb-[8px]" style={{ fontWeight: 700 }}>
              11.4 Client Opt-Out
            </h4>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Clients may request exclusion of their property from media use in writing prior to project commencement.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Absent such written request, Cstle Livn Inc. retains full media rights.
            </p>
          </div>

          {/* Section 12 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              12. Intellectual Property
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              All design concepts, drawings, technical methods, and visuals produced by Cstle Livn Inc. remain its intellectual property.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Clients may not reproduce, share, or alter such materials for other projects without written permission.
            </p>
          </div>

          {/* Section 13 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              13. Subcontracting and Personnel
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Cstle Livn Inc. may engage subcontractors or affiliated professionals to perform specialized aspects of a project.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              All subcontractors operate under the Company's quality and safety standards.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              The Client agrees not to directly solicit or hire any Cstle Livn Inc. contractor or employee for 12 months following project completion.
            </p>
          </div>

          {/* Section 14 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              14. Delays and Force Majeure
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Cstle Livn Inc. shall not be liable for delays caused by events beyond its control, including:
            </p>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "Adverse weather,",
                "Labour disputes,",
                "Supply chain disruptions,",
                "Government restrictions, or",
                "Unforeseen emergencies."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Timelines will be extended reasonably under such circumstances.
            </p>
          </div>

          {/* Section 15 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              15. Termination
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Either party may terminate the engagement with 7 days' written notice.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Immediate termination is permitted for misconduct, safety violations, or breach of contract.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              All completed work and expenses up to the termination date remain payable.
            </p>
          </div>

          {/* Section 16 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              16. Confidentiality
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Both parties agree to maintain confidentiality regarding any proprietary information, pricing, or trade methods shared during the course of work.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              This obligation survives the completion or termination of the project.
            </p>
          </div>

          {/* Section 17 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              17. Dispute Resolution
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              In the event of a disagreement, both parties shall first attempt to resolve the matter amicably.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              If unresolved within 14 days, the issue shall be referred to mediation or arbitration in Saskatchewan before court action.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Each party shall bear its own legal costs unless otherwise directed by the mediator or arbitrator.
            </p>
          </div>

          {/* Section 18 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              18. Compliance with Laws
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              Cstle Livn Inc. adheres to all applicable:
            </p>
            <ul className="ml-[24px] mb-[10px]">
              {[
                "Provincial building codes,",
                "Occupational Health and Safety regulations,",
                "Environmental standards, and",
                "Canadian privacy and commercial laws."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Clients are expected to ensure their property complies with relevant zoning and permit requirements.
            </p>
          </div>

          {/* Section 19 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              19. Indemnification
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              The Client agrees to indemnify and hold harmless Cstle Livn Inc., its directors, employees, and contractors from any claim, loss, or damage arising out of:
            </p>
            <ul className="ml-[24px]">
              {[
                "Client-provided materials or instructions,",
                "Unsafe site conditions, or",
                "Misuse of completed work by third parties."
              ].map((item, idx) => (
                <li key={idx} className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] list-disc" style={{ fontWeight: 400 }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Section 20 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              20. Severability
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              If any provision of these Terms is found invalid or unenforceable, the remaining provisions shall continue in full force.
            </p>
          </div>

          {/* Section 21 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              21. Governing Law
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[10px]" style={{ fontWeight: 400 }}>
              These Terms are governed by and construed under the laws of the Province of Saskatchewan and the federal laws of Canada.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              Jurisdiction for all matters lies exclusively with the courts of Saskatchewan.
            </p>
          </div>

          {/* Section 22 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              22. Entire Agreement
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
              These Terms, together with any signed proposals, estimates, or invoices, constitute the entire agreement between the Client and Cstle Livn Inc. and supersede any prior verbal or written understandings.
            </p>
          </div>

          {/* Section 23 */}
          <div className="w-full">
            <h3 className="font-['Roboto_Mono',_monospace] text-[14px] mb-[12px]" style={{ fontWeight: 700 }}>
              23. Contact Information
            </h3>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[6px]" style={{ fontWeight: 400 }}>
              Cstle Livn Inc.
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[6px]" style={{ fontWeight: 400 }}>
              Regina, Saskatchewan, Canada
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6] mb-[6px]" style={{ fontWeight: 400 }}>
              E: info@cstlelivn.ca
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] leading-[1.6]" style={{ fontWeight: 400 }}>
             W: www.cstlelivn.ca
            </p>
          </div>

          {/* Footer */}
          <div className="w-full border-t border-[#191919] pt-[16px] mt-[16px]">
            <p className="font-['Roboto_Mono',_monospace] text-[11px] text-center mb-[8px]" style={{ fontWeight: 700 }}>
              © 2025 Cstle Livn Inc. — All Rights Reserved
            </p>
            <p className="font-['Roboto_Mono',_monospace] text-[11px] text-center" style={{ fontWeight: 400 }}>
              Unauthorized reproduction, distribution, or adaptation of these Terms is strictly prohibited.
            </p>
          </div>

        </div>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}

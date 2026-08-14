import { motion } from "motion/react";
import { useWeddingData } from "@/lib/useWeddingData";
import { Phone, MessageCircle, Users } from "lucide-react";

export function DepartmentDetailsSection() {
  const { departmentDetails, departments } = useWeddingData();

  if (departmentDetails?.enabled === false) {
    return null;
  }

  const rawDepts = departmentDetails?.departments || departments || [];
  const activeDepartments = rawDepts.filter((d) => d.active !== false);

  if (activeDepartments.length === 0) {
    return null;
  }

  return (
    <section
      id="departments"
      className="relative overflow-hidden bg-[#FDFBF7] text-[#2D1B22] py-10 sm:py-14 border-t border-[#E5DBCA]"
    >
      <div id="department-details" className="absolute -top-24" />
      {/* Background Ambience */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(201, 168, 76, 0.1) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 1.2 }}
          className="text-center mb-6"
        >
          <span className="label-caps text-[0.62rem] tracking-[0.25em] text-[#8C6D3B] uppercase font-semibold">
            {departmentDetails?.sectionLabel || "Event Operations & Coordination"}
          </span>
          <h2 className="font-display text-xl sm:text-2xl text-[#531427] mt-1 tracking-wide font-medium">
            {departmentDetails?.sectionTitle || "Department Details"}
          </h2>
          {departmentDetails?.subtitle && (
            <p className="font-body text-[0.72rem] text-[#6A5A52] mt-1 max-w-md mx-auto italic">
              {departmentDetails.subtitle}
            </p>
          )}
        </motion.div>

        {/* Desktop Table View */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="hidden sm:block overflow-hidden rounded-xl border border-[#E2D5BE] bg-white/90 backdrop-blur-md shadow-[0_6px_25px_rgba(83,20,39,0.06)]"
        >
          <table className="w-full text-left text-xs text-[#2D1B22]">
            <thead className="border-b border-[#E2D5BE] bg-[#F4EFE6] text-[#531427] font-heading tracking-wider uppercase text-[0.62rem]">
              <tr>
                <th scope="col" className="px-4 py-2.5">Department</th>
                <th scope="col" className="px-3 py-2.5">Head Name</th>
                <th scope="col" className="px-3 py-2.5">Phone Number</th>
                <th scope="col" className="px-3 py-2.5 text-center">Team</th>
                <th scope="col" className="px-3 py-2.5">WhatsApp</th>
                <th scope="col" className="px-4 py-2.5 text-right">Connect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFE8D9] text-[0.75rem]">
              {activeDepartments.map((dept, idx) => {
                const phoneClean = (dept.phone || "").replace(/\s+/g, "");
                const waClean = (dept.whatsapp || dept.phone || "").replace(/\D/g, "");
                const waFull = waClean.length === 10 ? `91${waClean}` : waClean;

                return (
                  <tr
                    key={dept.id || idx}
                    className="hover:bg-[#F9F5EC] transition-colors duration-150"
                  >
                    {/* 1. Department Name */}
                    <td className="px-4 py-2.5 font-medium text-[#531427] whitespace-nowrap">
                      <span className="font-heading text-[0.72rem] uppercase tracking-wider font-semibold">
                        {dept.name}
                      </span>
                    </td>

                    {/* 2. Head Name */}
                    <td className="px-3 py-2.5 text-[#2D1B22] font-display text-[0.8rem] whitespace-nowrap">
                      {dept.headName}
                    </td>

                    {/* 3. Phone Number */}
                    <td className="px-3 py-2.5 font-mono text-[0.72rem] whitespace-nowrap">
                      <a
                        href={`tel:${phoneClean}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors inline-flex items-center gap-1.5 font-medium"
                        title={`Call ${dept.headName} (${dept.name})`}
                      >
                        <Phone className="h-3 w-3 text-blue-600 shrink-0" />
                        {dept.phone}
                      </a>
                    </td>

                    {/* 4. Team Members Count */}
                    <td className="px-3 py-2.5 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F4EFE6] border border-[#E2D5BE] px-2 py-0.5 text-[0.62rem] text-[#531427] font-mono">
                        <Users className="h-2.5 w-2.5 text-[#8C6D3B]" />
                        {dept.teamMembersCount}
                      </span>
                    </td>

                    {/* 5. WhatsApp Number */}
                    <td className="px-3 py-2.5 font-mono text-[0.72rem] whitespace-nowrap">
                      <a
                        href={`https://wa.me/${waFull}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-900 transition-colors font-medium"
                        title={`WhatsApp chat with ${dept.headName} (${dept.name})`}
                      >
                        {dept.whatsapp || dept.phone}
                      </a>
                    </td>

                    {/* 6. Contact Action Icons */}
                    <td className="px-4 py-2.5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        {dept.phone && (
                          <a
                            href={`tel:${phoneClean}`}
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition-all border border-blue-200 shadow-xs"
                            title={`Call ${dept.headName} (${dept.name})`}
                            aria-label={`Call ${dept.headName}`}
                          >
                            <Phone className="h-3 w-3 text-blue-600 hover:text-white" />
                          </a>
                        )}
                        {(dept.whatsapp || dept.phone) && (
                          <a
                            href={`https://wa.me/${waFull}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all border border-emerald-200 shadow-xs"
                            title={`WhatsApp ${dept.headName} (${dept.name})`}
                            aria-label={`WhatsApp message to ${dept.headName}`}
                          >
                            <MessageCircle className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Mobile Rows View */}
        <div className="sm:hidden space-y-2.5">
          {activeDepartments.map((dept, idx) => {
            const phoneClean = (dept.phone || "").replace(/\s+/g, "");
            const waClean = (dept.whatsapp || dept.phone || "").replace(/\D/g, "");
            const waFull = waClean.length === 10 ? `91${waClean}` : waClean;

            return (
              <div
                key={dept.id || idx}
                className="rounded-xl border border-[#E2D5BE] bg-white p-3.5 space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-heading text-[0.68rem] font-semibold uppercase tracking-wider text-[#531427]">
                      {dept.name}
                    </span>
                    <p className="font-display text-sm text-[#2D1B22] font-medium">{dept.headName}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#F4EFE6] border border-[#E2D5BE] px-2 py-0.5 text-[0.62rem] text-[#531427] font-mono">
                    <Users className="h-2.5 w-2.5 text-[#8C6D3B]" />
                    {dept.teamMembersCount} Members
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[0.68rem] text-[#6A5A52] border-t border-[#EFE8D9] pt-2">
                  <div>
                    <span className="text-[0.58rem] label-caps text-[#8C6D3B] block">Phone</span>
                    <a href={`tel:${phoneClean}`} className="font-mono text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1">
                      <Phone className="h-2.5 w-2.5 text-blue-600" />
                      {dept.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-[0.58rem] label-caps text-[#8C6D3B] block">WhatsApp</span>
                    <a
                      href={`https://wa.me/${waFull}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-emerald-700 hover:text-emerald-900 font-medium"
                    >
                      {dept.whatsapp || dept.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  {dept.phone && (
                    <a
                      href={`tel:${phoneClean}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 text-blue-600 text-[0.68rem] label-caps font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                    >
                      <Phone className="h-3 w-3 text-blue-600" /> Call
                    </a>
                  )}
                  {(dept.whatsapp || dept.phone) && (
                    <a
                      href={`https://wa.me/${waFull}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 text-[0.68rem] label-caps font-semibold hover:bg-emerald-600 hover:text-white transition-all shadow-xs"
                    >
                      <MessageCircle className="h-3 w-3" /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Made by Aranea Den Credit */}
        <div className="mt-8 pt-4 border-t border-[#E5DBCA]/80 flex items-center justify-center">
          <a
            href="https://www.araneaden.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D8C8A8] bg-white/90 text-[#2D1B22] hover:text-[#531427] hover:border-[#8C6D3B] transition-all duration-300 shadow-xs group"
          >
            <span className="text-[0.68rem] label-caps tracking-widest text-[#6A5A52] group-hover:text-[#531427] transition-colors">
              Made by
            </span>
            <img
              src="/images/araneaden_logo.png"
              alt="Aranea Den Logo"
              className="h-4 w-4 rounded-full object-cover border border-[#8C6D3B]/40 group-hover:scale-110 transition-transform"
            />
            <span className="text-[0.72rem] font-heading tracking-widest uppercase text-[#531427] font-semibold group-hover:underline">
              Aranea Den
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

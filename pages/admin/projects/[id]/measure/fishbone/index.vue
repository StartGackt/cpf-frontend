<script setup lang="ts">
import { ref } from 'vue'

const route = useRoute()
const projectId = (route.params.id as string) || 'example-total-yield'

const categories = [
  { name: 'Material', count: 7, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { name: 'Machine', count: 12, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { name: 'Method', count: 13, color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { name: 'Measurement', count: 3, color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { name: 'Man', count: 3, color: 'bg-rose-100 text-rose-800 border-rose-200' },
  { name: 'Environment', count: 3, color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { name: 'Total', count: 41, color: 'bg-gray-100 text-gray-800 border-gray-300 font-bold' }
]
</script>

<template>
  <div class="space-y-4 -mt-2">
    <!-- Breadcrumbs -->
    <div class="flex items-center gap-2 text-xs text-gray-500 pb-2">
      <NuxtLink to="/admin" class="hover:text-[#008779] flex items-center gap-1">
        <UIcon name="i-lucide-home" class="size-3.5" />
        <span>Home</span>
      </NuxtLink>
      <span>›</span>
      <NuxtLink to="/admin/projects" class="hover:text-[#008779]">
        Projects
      </NuxtLink>
      <span>›</span>
      <span class="text-gray-700 font-medium">Example เพิ่ม %Total Yield สินค้าไก่ทอด</span>
      <span>›</span>
      <span class="text-gray-700 font-medium">Measure</span>
      <span>›</span>
      <span class="text-gray-900 font-bold">Fishbone Diagram</span>
    </div>

    <!-- Workspace Layout with DMAIC Sidebar -->
    <div class="flex gap-6 items-start">
      <DmaicSidebar
        :project-id="projectId"
        active-phase="Measure"
        active-step="Fishbone Diagram"
      />

      <!-- Main Content Area -->
      <div class="flex-1 space-y-4 min-w-0">
        <!-- Main Fishbone Container Card (Image 3) -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-xs p-6 space-y-6">
          <!-- Top Category Counts Pills Bar -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 class="text-base font-bold text-gray-900">
                Fishbone Diagram Analysis
              </h2>
              <span class="text-[11px] text-gray-400">Page 1 of 2</span>
            </div>

            <!-- Categories Badges -->
            <div class="flex items-center gap-2 flex-wrap">
              <span
                v-for="cat in categories"
                :key="cat.name"
                class="px-2.5 py-1 rounded text-xs font-semibold border flex items-center gap-1"
                :class="cat.color"
              >
                <span>{{ cat.name }}:</span>
                <span>{{ cat.count }}</span>
              </span>
            </div>
          </div>

          <!-- ISHIKAWA FISHBONE DIAGRAM (SVG Canvas) -->
          <div class="w-full overflow-x-auto bg-gray-50/20 border border-gray-200/80 rounded-xl p-4 flex items-center justify-center">
            <svg class="w-full max-w-[1000px] h-[520px]" viewBox="0 0 920 480">
              <!-- Center Backbone Horizontal Arrow -->
              <line x1="80" y1="240" x2="680" y2="240" stroke="#1e293b" stroke-width="2" />
              <!-- Arrow head -->
              <polygon points="680,235 695,240 680,245" fill="#1e293b" />

              <!-- Central Target Box (Effect) -->
              <rect x="710" y="215" width="160" height="50" rx="4" fill="#0f172a" />
              <text x="790" y="238" font-size="11" fill="#ffffff" font-weight="bold" text-anchor="middle">
                %Total Yield
              </text>
              <text x="790" y="252" font-size="10" fill="#cbd5e1" text-anchor="middle">
                สินค้าไก่ทอดต่ำ
              </text>

              <!-- ================= TOP BONES ================= -->
              <!-- 1. MATERIAL (Top Left) -->
              <rect x="180" y="70" width="70" height="24" rx="2" fill="#0f172a" />
              <text x="215" y="86" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Material</text>
              <line x1="215" y1="94" x2="295" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <!-- Sub-bones for Material -->
              <line x1="160" y1="120" x2="230" y2="120" stroke="#64748b" stroke-width="1" />
              <text x="155" y="118" font-size="7.5" fill="#334155" text-anchor="end">ความหนืด Batter ต่ำกว่า STD</text>

              <line x1="180" y1="140" x2="240" y2="140" stroke="#64748b" stroke-width="1" />
              <text x="175" y="138" font-size="7.5" fill="#334155" text-anchor="end">Coating ไม่เกาะทั่วชิ้น</text>

              <line x1="190" y1="160" x2="250" y2="160" stroke="#64748b" stroke-width="1" />
              <text x="185" y="158" font-size="7.5" fill="#334155" text-anchor="end">ตำหนิสูงจากโรงเชือด/RM</text>

              <line x1="210" y1="180" x2="265" y2="180" stroke="#64748b" stroke-width="1" />
              <text x="205" y="178" font-size="7.5" fill="#334155" text-anchor="end">สารเคลือบหมดอายุ</text>

              <line x1="225" y1="200" x2="275" y2="200" stroke="#64748b" stroke-width="1" />
              <text x="220" y="198" font-size="7.5" fill="#334155" text-anchor="end">เศษเนื้อ/เศษเล็ก</text>

              <line x1="240" y1="220" x2="285" y2="220" stroke="#64748b" stroke-width="1" />
              <text x="235" y="218" font-size="7.5" fill="#334155" text-anchor="end">น้ำหนักเนื้อ RM ต่อชิ้นสูง</text>

              <!-- 2. METHOD (Top Center) -->
              <rect x="360" y="70" width="70" height="24" rx="2" fill="#0f172a" />
              <text x="395" y="86" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Method</text>
              <line x1="395" y1="94" x2="475" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <!-- Sub-bones for Method -->
              <line x1="330" y1="110" x2="405" y2="110" stroke="#64748b" stroke-width="1" />
              <text x="325" y="108" font-size="7.5" fill="#334155" text-anchor="end">Cap การอบเชื่อมต่อกับเวลาช้า</text>

              <line x1="335" y1="125" x2="415" y2="125" stroke="#64748b" stroke-width="1" />
              <text x="330" y="123" font-size="7.5" fill="#334155" text-anchor="end">เวลาทำความสะอาดเกินไป</text>

              <line x1="345" y1="140" x2="422" y2="140" stroke="#64748b" stroke-width="1" />
              <text x="340" y="138" font-size="7.5" fill="#334155" text-anchor="end">อุณหภูมิสินค้าหลังสุก</text>

              <line x1="355" y1="155" x2="430" y2="155" stroke="#64748b" stroke-width="1" />
              <text x="350" y="153" font-size="7.5" fill="#334155" text-anchor="end">วางแผนการผลิตไม่ต่อเนื่อง</text>

              <line x1="365" y1="170" x2="438" y2="170" stroke="#64748b" stroke-width="1" />
              <text x="360" y="168" font-size="7.5" fill="#334155" text-anchor="end">ความเร็วเครื่องเติมแป้ง Predust</text>

              <line x1="375" y1="185" x2="445" y2="185" stroke="#64748b" stroke-width="1" />
              <text x="370" y="183" font-size="7.5" fill="#334155" text-anchor="end">ความเร็วเครื่องป้อนแป้งปีกบน DB4</text>

              <line x1="385" y1="200" x2="455" y2="200" stroke="#64748b" stroke-width="1" />
              <text x="380" y="198" font-size="7.5" fill="#334155" text-anchor="end">ระดับความสูงแผงเครื่องเติมแป้ง Predust</text>

              <line x1="395" y1="215" x2="462" y2="215" stroke="#64748b" stroke-width="1" />
              <text x="390" y="213" font-size="7.5" fill="#334155" text-anchor="end">ความแรงการสั่นDFของเครื่องMultihead</text>

              <!-- 3. MAN (Top Right) -->
              <rect x="540" y="70" width="70" height="24" rx="2" fill="#0f172a" />
              <text x="575" y="86" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Man</text>
              <line x1="575" y1="94" x2="655" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <!-- Sub-bones for Man -->
              <line x1="510" y1="130" x2="595" y2="130" stroke="#64748b" stroke-width="1" />
              <text x="505" y="128" font-size="7.5" fill="#334155" text-anchor="end">พนักงานโรยแป้งมากเกินไป</text>

              <line x1="535" y1="170" x2="618" y2="170" stroke="#64748b" stroke-width="1" />
              <text x="530" y="168" font-size="7.5" fill="#334155" text-anchor="end">พนักงานเติมแป้งร่วงพื้น</text>

              <line x1="550" y1="205" x2="635" y2="205" stroke="#64748b" stroke-width="1" />
              <text x="545" y="203" font-size="7.5" fill="#334155" text-anchor="end">พนักงานหยิบสินค้าไม่ทัน</text>

              <!-- ================= BOTTOM BONES ================= -->
              <!-- 4. MACHINE (Bottom Left) -->
              <rect x="230" y="380" width="70" height="24" rx="2" fill="#0f172a" />
              <text x="265" y="396" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Machine</text>
              <line x1="265" y1="380" x2="345" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <!-- Sub-bones for Machine -->
              <line x1="200" y1="265" x2="330" y2="265" stroke="#64748b" stroke-width="1" />
              <text x="195" y="267" font-size="7.5" fill="#334155" text-anchor="end">สายพานเครื่อง Multihead เดินตกขอบ</text>

              <line x1="220" y1="285" x2="320" y2="285" stroke="#64748b" stroke-width="1" />
              <text x="215" y="287" font-size="7.5" fill="#334155" text-anchor="end">เครื่อง Multihead เสีย</text>

              <line x1="230" y1="305" x2="310" y2="305" stroke="#64748b" stroke-width="1" />
              <text x="225" y="307" font-size="7.5" fill="#334155" text-anchor="end">เครื่องเติมแป้งเสีย</text>

              <line x1="240" y1="325" x2="300" y2="325" stroke="#64748b" stroke-width="1" />
              <text x="235" y="327" font-size="7.5" fill="#334155" text-anchor="end">เครื่องแป้งเสียดสีพบโลหะ</text>

              <line x1="250" y1="345" x2="290" y2="345" stroke="#64748b" stroke-width="1" />
              <text x="245" y="347" font-size="7.5" fill="#334155" text-anchor="end">Hot air หยุดเดิน / Fryer หยุดเดิน</text>

              <!-- 5. MEASUREMENT (Bottom Center) -->
              <rect x="400" y="380" width="85" height="24" rx="2" fill="#0f172a" />
              <text x="442" y="396" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Measurement</text>
              <line x1="442" y1="380" x2="522" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <!-- Sub-bones for Measurement -->
              <line x1="370" y1="280" x2="495" y2="280" stroke="#64748b" stroke-width="1" />
              <text x="365" y="282" font-size="7.5" fill="#334155" text-anchor="end">เช็คค่าไม่ต่อเนื่อง/ไม่เหมาะสม</text>

              <line x1="390" y1="315" x2="480" y2="315" stroke="#64748b" stroke-width="1" />
              <text x="385" y="317" font-size="7.5" fill="#334155" text-anchor="end">ไม่ Calibrate เครื่องชั่ง</text>

              <line x1="400" y1="350" x2="460" y2="350" stroke="#64748b" stroke-width="1" />
              <text x="395" y="352" font-size="7.5" fill="#334155" text-anchor="end">ตั้งค่า Giveaway ไม่ถูกต้อง</text>

              <!-- 6. ENVIRONMENT (Bottom Right) -->
              <rect x="570" y="380" width="80" height="24" rx="2" fill="#0f172a" />
              <text x="610" y="396" font-size="10" fill="#ffffff" font-weight="bold" text-anchor="middle">Environment</text>
              <line x1="610" y1="380" x2="680" y2="240" stroke="#1e293b" stroke-width="1.8" />
              <!-- Sub-bones for Environment -->
              <line x1="535" y1="280" x2="660" y2="280" stroke="#64748b" stroke-width="1" />
              <text x="530" y="282" font-size="7.5" fill="#334155" text-anchor="end">อุณหภูมิห้อง Cooking สูง</text>

              <line x1="550" y1="320" x2="640" y2="320" stroke="#64748b" stroke-width="1" />
              <text x="545" y="322" font-size="7.5" fill="#334155" text-anchor="end">แสงสว่างไม่เหมาะสม</text>

              <line x1="570" y1="355" x2="625" y2="355" stroke="#64748b" stroke-width="1" />
              <text x="565" y="357" font-size="7.5" fill="#334155" text-anchor="end">ความชื้น</text>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating Actions -->
    <div class="fixed bottom-6 right-24 flex items-center gap-3 z-30">
      <button class="bg-[#008779] hover:bg-[#007366] text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5 text-sm font-medium transition-all hover:scale-105 cursor-pointer">
        <UIcon name="i-lucide-eye" class="size-4" />
        <span>View</span>
      </button>
    </div>
  </div>
</template>

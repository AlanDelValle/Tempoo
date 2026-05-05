<script setup lang="ts">
import { computed } from 'vue'

interface HourlyWeather {
    time: string[]
    temperature_2m: number[]
    precipitation: number[]
    precipitation_probability: number[]
}

const props = defineProps<{
    hourly: HourlyWeather
}>()

// Encontra o índice da hora atual e pega as próximas 8
const slice = computed(() => {
    const now = new Date()
    const currentHour = now.toISOString().slice(0, 13) // "YYYY-MM-DDTHH"
    let idx = props.hourly.time.findIndex(t => t.startsWith(currentHour))
    if (idx === -1) idx = 0

    return props.hourly.time.slice(idx, idx + 8).map((t, i) => ({
        label: new Date(t).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        temp: props.hourly.temperature_2m[idx + i],
        precip: props.hourly.precipitation[idx + i] ?? 0,
        precipProb: props.hourly.precipitation_probability[idx + i] ?? 0,
    }))
})

// ─── Gráfico de temperatura (line + area) ─────────────────
const TEMP_W = 320
const TEMP_H = 80
const TEMP_PAD = { top: 16, right: 8, bottom: 0, left: 8 }

const tempValues = computed(() => slice.value.map(d => d.temp))
const tempMin    = computed(() => Math.min(...tempValues.value) - 1)
const tempMax    = computed(() => Math.max(...tempValues.value) + 1)

function tempY(val: number) {
    const range = tempMax.value - tempMin.value || 1
    const ratio = 1 - (val - tempMin.value) / range
    return TEMP_PAD.top + ratio * (TEMP_H - TEMP_PAD.top - TEMP_PAD.bottom)
}

function tempX(i: number) {
    const count = slice.value.length - 1
    return TEMP_PAD.left + (i / count) * (TEMP_W - TEMP_PAD.left - TEMP_PAD.right)
}

const tempLinePath = computed(() =>
    slice.value.map((d, i) => `${i === 0 ? 'M' : 'L'} ${tempX(i)} ${tempY(d.temp)}`).join(' ')
)

const tempAreaPath = computed(() => {
    const baseline = TEMP_H
    const pts = slice.value.map((d, i) => `${tempX(i)} ${tempY(d.temp)}`).join(' L ')
    const first = `${tempX(0)} ${baseline}`
    const last  = `${tempX(slice.value.length - 1)} ${baseline}`
    return `M ${first} L ${pts} L ${last} Z`
})

// ─── Gráfico de precipitação (barras) ─────────────────────
const PREC_W   = 320
const PREC_H   = 72
const PREC_PAD = { top: 8, right: 8, bottom: 0, left: 8 }
const BAR_GAP  = 6

const precipMax = computed(() => {
    const m = Math.max(...slice.value.map(d => d.precip))
    return m < 0.5 ? 1 : m * 1.2
})

function barProps(i: number) {
    const count    = slice.value.length
    const totalW   = PREC_W - PREC_PAD.left - PREC_PAD.right
    const barW     = totalW / count - BAR_GAP
    const x        = PREC_PAD.left + i * (totalW / count) + BAR_GAP / 2
    const maxH     = PREC_H - PREC_PAD.top - PREC_PAD.bottom
    const ratio    = slice.value[i].precip / precipMax.value
    const h        = Math.max(ratio * maxH, slice.value[i].precip > 0 ? 2 : 0)
    const y        = PREC_H - h
    return { x, y, w: barW, h }
}
</script>

<template>
    <div class="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-5 flex flex-col gap-5">
        <p class="text-white/45 text-xs font-semibold uppercase tracking-widest">
            Próximas 8 horas
        </p>

        <!-- ── Temperatura ───────────────────────────────── -->
        <div>
            <p class="text-white/55 text-xs mb-3 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-orange-300" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
                </svg>
                Temperatura (°C)
            </p>

            <svg :viewBox="`0 0 ${TEMP_W} ${TEMP_H}`" class="w-full overflow-visible">
                <defs>
                    <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stop-color="#fb923c" stop-opacity="0.35"/>
                        <stop offset="100%" stop-color="#fb923c" stop-opacity="0.02"/>
                    </linearGradient>
                </defs>

                <!-- Área de preenchimento -->
                <path :d="tempAreaPath" fill="url(#tempGrad)" />

                <!-- Linha -->
                <path :d="tempLinePath" fill="none" stroke="#fb923c"
                      stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

                <!-- Pontos + labels de temperatura -->
                <g v-for="(d, i) in slice" :key="i">
                    <circle :cx="tempX(i)" :cy="tempY(d.temp)" r="3"
                            fill="#fb923c" stroke="rgba(255,255,255,0.2)" stroke-width="1.5"/>
                    <text :x="tempX(i)" :y="tempY(d.temp) - 7"
                          text-anchor="middle" font-size="9" fill="rgba(255,255,255,0.8)"
                          font-family="sans-serif" font-weight="600">
                        {{ Math.round(d.temp) }}°
                    </text>
                </g>
            </svg>

            <!-- Labels de horário -->
            <div class="flex justify-between mt-1.5 px-1">
                <span v-for="(d, i) in slice" :key="i"
                      class="text-white/35 text-[10px] text-center"
                      :style="{ width: `${100 / slice.length}%` }">
                    {{ d.label }}
                </span>
            </div>
        </div>

        <!-- Divisor -->
        <div class="border-t border-white/10" />

        <!-- ── Precipitação ──────────────────────────────── -->
        <div>
            <p class="text-white/55 text-xs mb-3 flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-sky-300" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                    <path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/>
                </svg>
                Precipitação (mm)
            </p>

            <svg :viewBox="`0 0 ${PREC_W} ${PREC_H}`" class="w-full overflow-visible">
                <defs>
                    <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%"   stop-color="#7dd3fc" stop-opacity="0.9"/>
                        <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.4"/>
                    </linearGradient>
                </defs>

                <g v-for="(d, i) in slice" :key="i">
                    <!-- Barra -->
                    <rect
                        :x="barProps(i).x"
                        :y="barProps(i).y"
                        :width="barProps(i).w"
                        :height="barProps(i).h"
                        rx="3" ry="3"
                        fill="url(#precipGrad)"
                    />
                    <!-- Label mm (só se > 0) -->
                    <text v-if="d.precip > 0"
                          :x="barProps(i).x + barProps(i).w / 2"
                          :y="barProps(i).y - 4"
                          text-anchor="middle" font-size="8.5" fill="rgba(186,230,253,0.9)"
                          font-family="sans-serif" font-weight="600">
                        {{ d.precip.toFixed(1) }}
                    </text>
                </g>

                <!-- Linha base de 0mm quando não há chuva -->
                <line v-if="slice.every(d => d.precip === 0)"
                      :x1="PREC_PAD.left" :y1="PREC_H - 1"
                      :x2="PREC_W - PREC_PAD.right" :y2="PREC_H - 1"
                      stroke="rgba(125,211,252,0.2)" stroke-width="1" stroke-dasharray="4 3"/>
            </svg>

            <!-- Labels de horário + probabilidade -->
            <div class="flex justify-between mt-1.5 px-1">
                <div v-for="(d, i) in slice" :key="i"
                     class="flex flex-col items-center"
                     :style="{ width: `${100 / slice.length}%` }">
                    <span class="text-white/35 text-[10px]">{{ d.label }}</span>
                    <span class="text-sky-300/60 text-[9px] mt-0.5">{{ d.precipProb }}%</span>
                </div>
            </div>
        </div>
    </div>
</template>
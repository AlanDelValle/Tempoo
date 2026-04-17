<script setup lang="ts">
import type { WeatherIconType } from '@/types/weather'

defineProps<{
    type: WeatherIconType
    size?: number
}>()
</script>

<template>
    <div :style="{ width: (size ?? 80) + 'px', height: (size ?? 80) + 'px' }">

        <!-- ☀️ Clear -->
        <svg v-if="type === 'clear'" viewBox="0 0 100 100" class="w-full h-full">
            <g class="sun-spin">
                <line x1="50" y1="8"  x2="50" y2="23" stroke="#FCD34D" stroke-width="5" stroke-linecap="round"/>
                <line x1="50" y1="77" x2="50" y2="92" stroke="#FCD34D" stroke-width="5" stroke-linecap="round"/>
                <line x1="8"  y1="50" x2="23" y2="50" stroke="#FCD34D" stroke-width="5" stroke-linecap="round"/>
                <line x1="77" y1="50" x2="92" y2="50" stroke="#FCD34D" stroke-width="5" stroke-linecap="round"/>
                <line x1="20" y1="20" x2="31" y2="31" stroke="#FCD34D" stroke-width="5" stroke-linecap="round"/>
                <line x1="69" y1="69" x2="80" y2="80" stroke="#FCD34D" stroke-width="5" stroke-linecap="round"/>
                <line x1="80" y1="20" x2="69" y2="31" stroke="#FCD34D" stroke-width="5" stroke-linecap="round"/>
                <line x1="20" y1="80" x2="31" y2="69" stroke="#FCD34D" stroke-width="5" stroke-linecap="round"/>
                <circle cx="50" cy="50" r="19" fill="#FCD34D"/>
                <circle cx="50" cy="50" r="13" fill="#FDE68A"/>
            </g>
        </svg>

        <!-- ⛅ Partly Cloudy -->
        <svg v-else-if="type === 'partly-cloudy'" viewBox="0 0 100 100" class="w-full h-full">
            <g class="mini-sun-spin">
                <line x1="32" y1="14" x2="32" y2="23" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="32" y1="53" x2="32" y2="62" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="9"  y1="38" x2="18" y2="38" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="46" y1="38" x2="55" y2="38" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="16" y1="22" x2="23" y2="29" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="41" y1="47" x2="48" y2="54" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="48" y1="22" x2="41" y2="29" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round"/>
                <line x1="16" y1="54" x2="23" y2="47" stroke="#FCD34D" stroke-width="3.5" stroke-linecap="round"/>
                <circle cx="32" cy="38" r="13" fill="#FCD34D"/>
            </g>
            <g class="cloud-float">
                <circle cx="36" cy="66" r="14" fill="white"/>
                <circle cx="53" cy="59" r="17" fill="white"/>
                <circle cx="70" cy="64" r="13" fill="white"/>
                <rect x="22" y="64" width="61" height="20" fill="white"/>
            </g>
        </svg>

        <!-- ☁️ Cloudy -->
        <svg v-else-if="type === 'cloudy'" viewBox="0 0 100 100" class="w-full h-full">
            <g class="cloud-float-slow" opacity="0.55">
                <circle cx="48" cy="48" r="12" fill="white"/>
                <circle cx="63" cy="52" r="11" fill="white"/>
                <circle cx="34" cy="53" r="10" fill="white"/>
                <rect x="24" y="52" width="50" height="14" fill="white"/>
            </g>
            <g class="cloud-float">
                <circle cx="34" cy="65" r="15" fill="white"/>
                <circle cx="52" cy="57" r="18" fill="white"/>
                <circle cx="70" cy="63" r="14" fill="white"/>
                <rect x="19" y="63" width="65" height="20" fill="white"/>
            </g>
        </svg>

        <!-- 🌫️ Fog -->
        <svg v-else-if="type === 'fog'" viewBox="0 0 100 100" class="w-full h-full">
            <g opacity="0.75">
                <circle cx="34" cy="38" r="13" fill="white"/>
                <circle cx="51" cy="32" r="16" fill="white"/>
                <circle cx="67" cy="37" r="13" fill="white"/>
                <rect x="21" y="36" width="59" height="16" fill="white"/>
            </g>
            <line x1="8"  y1="58" x2="92" y2="58" stroke="white" stroke-width="5" stroke-linecap="round" opacity="0.75" class="fog-1"/>
            <line x1="16" y1="71" x2="84" y2="71" stroke="white" stroke-width="5" stroke-linecap="round" opacity="0.50" class="fog-2"/>
            <line x1="8"  y1="84" x2="92" y2="84" stroke="white" stroke-width="5" stroke-linecap="round" opacity="0.30" class="fog-3"/>
        </svg>

        <!-- 🌦️ Drizzle -->
        <svg v-else-if="type === 'drizzle'" viewBox="0 0 100 100" class="w-full h-full">
            <g>
                <circle cx="32" cy="42" r="14" fill="white"/>
                <circle cx="50" cy="34" r="17" fill="white"/>
                <circle cx="67" cy="41" r="14" fill="white"/>
                <rect x="18" y="40" width="63" height="16" fill="white"/>
            </g>
            <line x1="30" y1="64" x2="26" y2="78" stroke="#93C5FD" stroke-width="3"   stroke-linecap="round" class="rain-1"/>
            <line x1="50" y1="62" x2="46" y2="76" stroke="#93C5FD" stroke-width="3"   stroke-linecap="round" class="rain-2"/>
            <line x1="70" y1="64" x2="66" y2="78" stroke="#93C5FD" stroke-width="3"   stroke-linecap="round" class="rain-3"/>
        </svg>

        <!-- 🌧️ Rain -->
        <svg v-else-if="type === 'rain'" viewBox="0 0 100 100" class="w-full h-full">
            <g opacity="0.9">
                <circle cx="30" cy="40" r="14" fill="#94A3B8"/>
                <circle cx="50" cy="31" r="18" fill="#94A3B8"/>
                <circle cx="68" cy="39" r="14" fill="#94A3B8"/>
                <rect x="16" y="38" width="66" height="17" fill="#94A3B8"/>
            </g>
            <line x1="24" y1="62" x2="18" y2="80" stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round" class="rain-1"/>
            <line x1="39" y1="58" x2="33" y2="76" stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round" class="rain-2"/>
            <line x1="55" y1="62" x2="49" y2="80" stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round" class="rain-3"/>
            <line x1="70" y1="58" x2="64" y2="76" stroke="#60A5FA" stroke-width="3.5" stroke-linecap="round" class="rain-4"/>
        </svg>

        <!-- ❄️ Snow -->
        <svg v-else-if="type === 'snow'" viewBox="0 0 100 100" class="w-full h-full">
            <g opacity="0.85">
                <circle cx="30" cy="40" r="14" fill="#CBD5E1"/>
                <circle cx="50" cy="31" r="18" fill="#CBD5E1"/>
                <circle cx="68" cy="39" r="14" fill="#CBD5E1"/>
                <rect x="16" y="38" width="66" height="17" fill="#CBD5E1"/>
            </g>
            <circle cx="26" cy="66" r="4"   fill="white" opacity="0.9"  class="snow-1"/>
            <circle cx="44" cy="62" r="3"   fill="white" opacity="0.75" class="snow-2"/>
            <circle cx="60" cy="66" r="3.5" fill="white" opacity="0.85" class="snow-3"/>
            <circle cx="76" cy="63" r="2.5" fill="white" opacity="0.70" class="snow-4"/>
            <circle cx="34" cy="79" r="3"   fill="white" opacity="0.75" class="snow-5"/>
            <circle cx="65" cy="78" r="3.5" fill="white" opacity="0.85" class="snow-6"/>
        </svg>

        <!-- ⛈️ Thunder -->
        <svg v-else-if="type === 'thunder'" viewBox="0 0 100 100" class="w-full h-full">
            <g opacity="0.9">
                <circle cx="28" cy="40" r="14" fill="#64748B"/>
                <circle cx="50" cy="30" r="18" fill="#64748B"/>
                <circle cx="70" cy="38" r="15" fill="#64748B"/>
                <rect x="14" y="38" width="71" height="18" fill="#64748B"/>
            </g>
            <line x1="18" y1="62" x2="12" y2="78" stroke="#60A5FA" stroke-width="3" stroke-linecap="round" opacity="0.7" class="rain-1"/>
            <line x1="80" y1="62" x2="74" y2="78" stroke="#60A5FA" stroke-width="3" stroke-linecap="round" opacity="0.7" class="rain-2"/>
            <polygon points="54,56 43,74 51,74 39,92 62,70 53,70 64,56" fill="#FBBF24" class="lightning"/>
        </svg>

    </div>
</template>

<style scoped>
/* Sun */
.sun-spin {
    animation: sunSpin 12s linear infinite;
    transform-box: view-box;
    transform-origin: center;
}
.mini-sun-spin {
    animation: sunSpin 12s linear infinite;
    transform-box: fill-box;
    transform-origin: 32px 38px;
}

/* Clouds */
.cloud-float      { animation: cloudFloat 4s   ease-in-out infinite; }
.cloud-float-slow { animation: cloudFloat 5.5s ease-in-out infinite 0.8s; }

/* Fog */
.fog-1 { animation: fogDrift 3.5s ease-in-out infinite 0s; }
.fog-2 { animation: fogDrift 3.5s ease-in-out infinite 0.6s; }
.fog-3 { animation: fogDrift 3.5s ease-in-out infinite 1.2s; }

/* Rain (drizzle uses same, slower via duration in keyframe) */
.rain-1 { animation: rainFall 1.2s linear infinite 0.0s; }
.rain-2 { animation: rainFall 1.2s linear infinite 0.3s; }
.rain-3 { animation: rainFall 1.2s linear infinite 0.6s; }
.rain-4 { animation: rainFall 1.2s linear infinite 0.9s; }

/* Snow */
.snow-1 { animation: snowFall 2.2s ease-in-out infinite 0.0s; }
.snow-2 { animation: snowFall 2.2s ease-in-out infinite 0.5s; }
.snow-3 { animation: snowFall 2.2s ease-in-out infinite 1.0s; }
.snow-4 { animation: snowFall 2.2s ease-in-out infinite 1.5s; }
.snow-5 { animation: snowFall 2.2s ease-in-out infinite 0.8s; }
.snow-6 { animation: snowFall 2.2s ease-in-out infinite 0.2s; }

/* Lightning */
.lightning { animation: lightningFlash 2.5s ease-in-out infinite; }

@keyframes sunSpin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
}
@keyframes cloudFloat {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-5px); }
}
@keyframes fogDrift {
    0%, 100% { transform: translateX(0); }
    50%       { transform: translateX(9px); }
}
@keyframes rainFall {
    0%   { transform: translateY(-14px); opacity: 0; }
    20%  { opacity: 1; }
    100% { transform: translateY(22px);  opacity: 0; }
}
@keyframes snowFall {
    0%   { transform: translateY(-12px) rotate(0deg);   opacity: 0; }
    20%  { opacity: 1; }
    100% { transform: translateY(20px)  rotate(180deg); opacity: 0; }
}
@keyframes lightningFlash {
    0%, 72%, 100% { opacity: 1; }
    78%           { opacity: 0.05; }
    84%           { opacity: 1; }
    90%           { opacity: 0.15; }
    96%           { opacity: 1; }
}
</style>
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class WeatherController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Weather/Index');
    }

    public function fetch(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'latitude'  => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
        ]);

        $lat = $validated['latitude'];
        $lon = $validated['longitude'];

        $weatherResponse = Http::timeout(10)->get('https://api.open-meteo.com/v1/forecast', [
            'latitude'     => $lat,
            'longitude'    => $lon,
            'current'      => implode(',', [
                'temperature_2m', 'apparent_temperature',
                'relative_humidity_2m', 'wind_speed_10m',
                'wind_direction_10m', 'precipitation', 'weather_code',
                'uv_index', 'surface_pressure', 'cloud_cover', 'visibility',
            ]),
            'daily'        => implode(',', [
                'temperature_2m_max', 'temperature_2m_min',
                'precipitation_sum', 'precipitation_probability_max',
                'weather_code', 'wind_speed_10m_max',
            ]),
            'timezone'       => 'auto',
            'forecast_days'  => 7,
            'wind_speed_unit' => 'kmh',
        ]);

        if ($weatherResponse->failed()) {
            return response()->json(['error' => 'Falha ao buscar dados do clima.'], 503);
        }

        $geoResponse = Http::timeout(5)
            ->withHeaders(['User-Agent' => 'Tempoo/1.0 weather-app'])
            ->get('https://nominatim.openstreetmap.org/reverse', [
                'lat'             => $lat,
                'lon'             => $lon,
                'format'          => 'json',
                'accept-language' => 'pt-BR',
            ]);

        $address = $geoResponse->successful()
            ? ($geoResponse->json()['address'] ?? [])
            : [];

        $city = $address['city']
            ?? $address['town']
            ?? $address['village']
            ?? $address['municipality']
            ?? $address['county']
            ?? 'Local desconhecido';

        return response()->json([
            'weather'  => $weatherResponse->json(),
            'location' => [
                'city'      => $city,
                'state'     => $address['state'] ?? '',
                'country'   => $address['country'] ?? '',
                'latitude'  => $lat,
                'longitude' => $lon,
            ],
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:100'],
        ]);

        $response = Http::timeout(8)->get('https://geocoding-api.open-meteo.com/v1/search', [
            'name'     => $validated['q'],
            'count'    => 6,
            'language' => 'pt',
            'format'   => 'json',
        ]);

        if ($response->failed()) {
            return response()->json(['results' => []]);
        }

        $results = collect($response->json('results') ?? [])
            ->map(fn($r) => [
                'name'      => $r['name'],
                'state'     => $r['admin1']  ?? '',
                'country'   => $r['country'] ?? '',
                'latitude'  => $r['latitude'],
                'longitude' => $r['longitude'],
            ])
            ->values();

        return response()->json(['results' => $results]);
    }

}
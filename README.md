# TEMPOO

# Requisitos

- PHP 8+
- Composer
- Node.js + NPM

---

# Instalação

- git clone
- cd projeto

- cp .env.example .env
- composer install
- npm install

- php artisan key:generate

---

# Rodando o projeto

**Opçao 1 - Usando Laravel Herd**

- Coloque o projeto dentro da pasta monitorada pelo Herd (ex: ~/Herd)
- Acesse no navegador: http://tempoo.test

**Opção 2 - Sem Herd**

- php artisan serve
- npm run dev
- acesse: http://localhost:8000

---

# Página Principal

**Geolocalização**

- Ao abrir a Home Page, a aplicação buscará informações do clima baseada na localização do usuário.
- O usuário tem a opção de buscar por outra cidade.

**Busca Geral**

- Ao buscar a cidade, a aplicação retornará as seguintes informações:
    - Nome da cidade, estado e país;
    - Temperatura atual (°C);
    - Sensação térmica (°C);
    - Umidade relativa do ar (%);
    - Velocidade do vento e direção (km/h);
    - Precipitação (mm);
    - Nível de raios UV;
    - Pressão atmosférica (hPa);
    - Cobertura de nuvens (%);
    - Visibilidade (km);
    - Alertas meteorológicos, caso seja emitido; e
    - Previsão para os próximos 7 (sete) dias.

**Dados**

- Open-Meteo; e
- OpenStreetMap
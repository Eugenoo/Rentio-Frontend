# Rentio Frontend

Frontend aplikacji **Rentio** służącej do zarządzania wynajmem pojazdów. Projekt został zbudowany z wykorzystaniem **Vue 3**, **Vite** oraz **Pinia**.

---

## Technologie

- Vue 3
- Vite
- Vue Router
- Pinia
- Axios
- Tailwind CSS
- Heroicons
- Headless UI

---

## Wymagania

Przed uruchomieniem projektu upewnij się, że posiadasz:

- Node.js 18+ (zalecana najnowsza wersja LTS)
- npm

Sprawdzenie wersji:

```bash
node -v
npm -v
```

---

## Instalacja

Sklonuj repozytorium:

```bash
git clone <adres_repozytorium>
```

Przejdź do katalogu projektu:

```bash
cd Rentio-Frontend
```

Zainstaluj zależności:

```bash
npm install
```

---

## Uruchomienie aplikacji

Tryb developerski:

```bash
npm run dev
```

Po uruchomieniu aplikacja będzie dostępna pod adresem:

```
http://localhost:5173
```

---

## Budowanie wersji produkcyjnej

```bash
npm run build
```

Pliki produkcyjne zostaną wygenerowane w katalogu:

```
dist/
```

---

## Podgląd wersji produkcyjnej

```bash
npm run preview
```

---

## Dostępne skrypty

| Komenda | Opis |
|----------|------|
| `npm run dev` | Uruchamia serwer developerski |
| `npm run build` | Buduje aplikację do produkcji |
| `npm run preview` | Uruchamia podgląd wersji produkcyjnej |
| `npm run format` | Formatuje kod przy użyciu Prettier |
| `npm run lint` | Uruchamia lintowanie projektu |

---

## Struktura projektu

```
src/
│
├── assets/          # Zasoby statyczne
├── components/      # Komponenty wielokrotnego użytku
├── layouts/         # Layouty aplikacji
├── router/          # Konfiguracja Vue Router
├── stores/          # Store'y Pinia
├── views/           # Widoki aplikacji
├── services/        # Komunikacja z API
├── App.vue
└── main.js
```

*(Struktura może się nieznacznie różnić w zależności od wersji projektu.)*

---

## Konfiguracja środowiska

Projekt wykorzystuje plik `.env`.

Przykładowa konfiguracja:

```env
VITE_API_URL=http://localhost:8000/api
```

---

## Funkcjonalności

- logowanie użytkowników,
- zarządzanie najmem pojazdów,
- komunikacja z backendem przez REST API,
- routing pomiędzy widokami,
- zarządzanie stanem aplikacji przy użyciu Pinia,
- responsywny interfejs użytkownika.

---

## Autor

Projekt został przygotowany jako frontend aplikacji **Rentio**.

---

## Licencja

Projekt przeznaczony do celów edukacyjnych lub rozwoju własnego. W razie potrzeby dodaj odpowiednią licencję (np. MIT).

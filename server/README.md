## Server Compete me


### Dodatkowe funkcjonalności projektowe:
- [X] Kod jest automatycznie budowany w gradle, a wynik budowania są widoczne w repozytorium.
- [ ] Kod powinien być automatycznie testowany, przynajmniej na dwóch poziomach: jednostkowo i poprzez interfejs HTTP.
  - [ ] Testowanie powinno być elementem budowania projektu.
  - [ ] Wyniki testowania powinny być widoczne w repozytorium.
- [ ] Aplikację należy przetestować wydajnościowo z użyciem np Gatlinga. Nie powinien to być element budowania automatycznego, ale powinno być możliwe uruchomienie takiego testu jedną komendą.
- [X] Kod jest automatycznie skanowany pod kątem bezpieczeństwa w gitlab actions. - Snyk.
- [X] Dokumentację API jest wygenerowana w formie Swaggera i udostępniana pod ścieżką `app/api/api.json`.
- [ ] Usługa powinna udostępniać poprawnie skonstruowane REST API, łącznie z obsługą błędów.
- [ ] Musi być wykorzystywana data i czas, z poprawnym użyciem klasy Clock. Funkcjonalność powinna obejmować strefy czasowe, które należy poprawnie obsłużyć.
- [X] Jest zastosowana Dependency Injection za pomocą adnotacji @RequiredArgsConstructor z lomboka i spring boot.
- [ ] Należy używać bibliotekę do logów.
- [ ] Proces budowania powinien wytwarzać gotowy do wdrożenia artefakt: plik jar.
- [ ] Należy dostarczyć pliki: Dockerfile oraz Docker Compose, zawierające kompletne środowisko uruchomieniowe.
- [ ] Usługa powinna zawierać persystencję. Baza danych w odrębnym Dockerfile, połączona poprzez compose.
- [ ] Usługa powinna być monitorowana jakimś środowiskiem monitorującym, np ELK. Środowisko to powinno być dostarczone w odrębnym Dockerfile, połączone poprzez compose z pozostałymi komponentami.
- [ ] Usługa powinna korzystać z jakiegoś zewnętrznego, ogólnodostępnego źródła danych w Internecie. Przykłady: OpenWheatherMap, JokeAPI, NASA API, CoinGecko API, InPost API.
- [X] Istnieje logowanie za pomocą JWT. Każdy endpoint poza logowaniem jest zabezpieczony.
- [ ] Usługa zawierać minimum 3 poziomy uprawnień użytkowników, z czego jeden (user-admin) powinien służyć do zarządzania użytkownikami.
- [X] Użytkownicy posiadają dostępy tylko do swoich zasobów albo do zasobów swoich znajomych.
- [ ] Należy przygotować demo serwisu, z użyciem np Postmana (i innych narzędzi), które zademonstrują działanie i monitorowanie systemu.

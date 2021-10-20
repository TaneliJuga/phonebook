# phonebook
Simppeli puhelinluettelo-sovellus react-frontendillä ja express backendillä.

Palvelimen REST-rajapinnan kuvaus:
- Palvelimeen on määritelty resurssi contact joka vastaa puhelinluettelossa olevaa henkilötietoa.
- Resurssi sijaitsee reitissä /api
- Kaikki tieto palautetaan JSON-formaatissa

Kutsut:
kutsu: GET /api/contacts
kuvaus: palauttaa taulukon kaikista henkilötiedoista

kutsu: GET /api/contacts/:id
kuvaus: palauttaa parametriä id vastaavan henkilötiedon.

kutsu: POST /api/contacts/
kuvaus: Lisää kutsun body-kentässä olevan JSON-muotoisen henkilötiedon palvelimelle.

kutsu: DELETE /api/contacts/:id
kuvaus: Poistaa parametriä id vastaavan henkilötiedon.

kutsu: PUT /api/contacts/:id
kuvaus: Muokkaa parametriä id vastaavan henkilötiedon kutsun body-kentässä olevan JSON-muotoisen arvojen mukaisiksi.

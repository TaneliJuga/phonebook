# phonebook
Simppeli puhelinluettelo-sovellus react-frontendillä ja express backendillä.

Palvelimen REST-rajapinnan kuvaus:
- Palvelimeen on määritelty resurssi nimeltä "contact" joka vastaa puhelinluettelossa olevaa henkilötietoa.
- Resurssi sijaitsee reitissä /api
- Kaikki tieto palautetaan JSON-formaatissa
- Contact-resurssi sisältää kolme kenttää: id, name, number. 
- Palvelin lukee sille lähetetyn JSON-tiedon kentät name ja number.

Kutsut:

- GET /api/contacts

kuvaus: palauttaa taulukon kaikista henkilötiedoista

- GET /api/contacts/:id

kuvaus: palauttaa parametriä id vastaavan henkilötiedon.

- POST /api/contacts/

kuvaus: Lisää kutsun body-kentässä olevan JSON-muotoisen henkilötiedon palvelimelle.

- DELETE /api/contacts/:id

Poistaa parametriä id vastaavan henkilötiedon.

- PUT /api/contacts/:id

kuvaus: Muokkaa parametriä id vastaavan henkilötiedon kutsun body-kentässä olevan JSON-muotoisen arvojen mukaisiksi.

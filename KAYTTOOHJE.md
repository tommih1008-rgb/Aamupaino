# Aamupaino – käyttöön Windowsilla ja puhelimella

Valmis, suomenkielinen PWA. Ei Macia, Xcodea, tietokantaa, kirjautumista eikä maksullista palvelua. GitHub-tunnuksen tarvitset vain julkaisemiseen.

## 1. Pura projekti

1. Lataa `aamupaino.zip` tietokoneellesi.
2. Napsauta tiedostoa hiiren oikealla painikkeella → **Pura kaikki**.
3. Avaa purettu `aamupaino`-kansio. Siellä pitää näkyä `index.html`, `manifest.json`, `sw.js` ja muut tiedostot.

Voit siirtyä suoraan kohtaan 3 ja julkaista sovelluksen ilman mitään ohjelma-asennuksia. Paikallinen kokeilu on vapaaehtoinen.

## 2. Kokeile Windowsissa ennen julkaisemista

1. Asenna Node.js:n **LTS-versio** osoitteesta <https://nodejs.org/> oletusasetuksilla. Sulje ja avaa pääte uudelleen asennuksen jälkeen.
2. Avaa purettu `aamupaino`-kansio Resurssienhallinnassa.
3. Kirjoita kansion osoiteriville `powershell` ja paina Enter. Näin pääte avautuu oikeaan kansioon.
4. Kirjoita alla oleva komento ja paina Enter:

   ```powershell
   node server.cjs
   ```

5. Avaa Edgessä tai Chromessa <http://127.0.0.1:8080>.
6. Kirjoita esimerkiksi `75,4` ja paina **Tallenna**. Päivitä sivu: painon pitäisi säilyä. Tallennus uudelleen samana päivänä päivittää saman merkinnän.
7. Pidä pääte auki käytön ajan. Lopeta palvelin painamalla päätteessä Ctrl+C.

Älä käynnistä sovellusta vain kaksoisnapsauttamalla `index.html`-tiedostoa: `file://`-osoite ei mahdollista service workeria ja kunnollista PWA-asennusta. HTTPS tai paikallinen localhost/127.0.0.1 tarvitaan. Puhelimen `127.0.0.1` viittaa puhelimeen, ei Windows-koneeseen; käytä puhelimessa julkaistua HTTPS-osoitetta.

## 3. Julkaise ilmaiseksi GitHub Pagesiin

GitHub Free sallii Pages-julkaisemisen julkisista repositorioista. Sivuston lähdekoodi on julkinen. Sovellukseen syöttämäsi painot eivät kuulu lähdekoodiin: ne tallennetaan vain omaan selaimeesi.

1. Avaa <https://github.com/> ja luo maksuton tili tai kirjaudu sisään.
2. Valitse oikean yläkulman **+ → New repository**.
3. Anna nimeksi `aamupaino`, valitse **Public** ja ota **Add a README file** käyttöön. Paina **Create repository**.
4. Avaa uuden repositorion **Code**-välilehti. Valitse **Add file → Upload files**.
5. Raahaa puretun `aamupaino`-kansion **sisältämät tiedostot** latausalueelle. Älä lataa ZIP-tiedostoa tai koko kansiota sisäkkäisenä. `index.html` pitää tulla repositorion juureen, samalle tasolle README-tiedoston kanssa.
6. Varmista, että mukana ovat kaikki nämä sovellustiedostot:

   ```text
   index.html
   style.css
   core.js
   app.js
   manifest.json
   sw.js
   icon.svg
   icon-192.png
   icon-512.png
   icon-maskable.png
   .nojekyll
   ```

   `server.cjs` ja tämä ohjetiedosto saavat myös olla mukana, mutta julkaistu sovellus ei tarvitse niitä. `.nojekyll` on tyhjä tiedosto; jos latausnäkymä jättää sen pois, tämän projektin tavalliset tiedostot toimivat myös ilman sitä.
7. Kirjoita tallennusviestiksi esimerkiksi `Ensimmäinen versio` ja paina **Commit changes**.
8. Avaa repositorion **Settings → Pages** vasemmasta valikosta.
9. Valitse kohdassa **Build and deployment → Source** vaihtoehto **Deploy from a branch**.
10. Valitse haaraksi **main** ja kansioksi **/ (root)**. Paina **Save**.
11. Odota, että julkaisu valmistuu. **Actions**-välilehdellä näet julkaisun tilanteen. Ensimmäinen julkaisu voi kestää useita minuutteja.
12. Avaa **Settings → Pages** uudelleen ja käytä siinä näkyvää **Visit site** -linkkiä. Osoite on tavallisesti `https://OMA-TUNNUS.github.io/aamupaino/`, missä OMA-TUNNUS on GitHub-käyttäjätunnuksesi.
13. Käytä HTTPS-osoitetta. Jos **Enforce HTTPS** on valittavissa, pidä se käytössä.

Jos sivu näyttää 404-virhettä, odota julkaisun valmistumista ja varmista, että `index.html` on suoraan main-haaran juuressa. Kaikki sovelluksen polut ovat suhteellisia, joten GitHub Pagesin `/aamupaino/`-alihakemisto toimii sellaisenaan.

### Jos käytössäsi on vain puhelin

Julkaisemisen voi tehdä myös puhelimen selaimella. Lataa ZIP ja pura se Tiedostot-sovelluksessa. Avaa GitHub selaimessa, tarvittaessa **Pyydä työpöytäsivusto** -tilassa, ja tee samat vaiheet 1–13. Upload files -näkymässä valitse puretut tiedostot tiedostovalitsimella. Node.js:ää tai paikallista palvelinta ei tarvita. Tiedostojen lataaminen on yleensä helpompaa Windows-koneelta.

## 4. Asenna puhelimen kotinäytölle

### iPhone

1. Avaa julkaistu HTTPS-osoite **Safarissa**.
2. Avaa **Jaa**-valikko ja valitse **Lisää Koti-valikkoon**. Jos valinta ei näy, etsi sitä toimintoluettelosta tai Muokkaa toimintoja -kohdasta.
3. Jos näkyvissä on **Avaa verkkosovelluksena**, kytke se päälle.
4. Valitse nimeksi Aamupaino ja paina **Lisää**.
5. Avaa sovellus kotinäytön kuvakkeesta verkkoyhteydellä. Asennus ja tietojen säilyminen -kohdassa tulee näkyä, että sovellus on valmis offline-käyttöön.
6. Aloita varsinainen seuranta tästä kotinäytön sovelluksesta. Älä oleta aiemmassa selainikkunassa syötettyjen tietojen siirtyvän siihen kaikissa selainversioissa.

### Android

1. Avaa julkaistu osoite Chromessa.
2. Avaa selaimen kolmen pisteen valikko ja valitse **Asenna sovellus** tai **Lisää aloitusnäyttöön**. Sanamuoto vaihtelee selainversion mukaan.
3. Hyväksy asennus ja avaa kuvake kerran verkkoyhteydellä.

### Windows

Avaa julkaistu osoite Edgessä tai Chromessa ja käytä osoiterivin asennuspainiketta tai selaimen valikon sovelluksen asennustoimintoa, jos se on näkyvissä. Sovellus toimii myös tavallisessa selainvälilehdessä.

## 5. Päivittäinen käyttö ja laskenta

- Päivämäärä tulee laitteen paikallisesta kellosta. Pidä laitteen päivämäärä ja aikavyöhyke oikein.
- Anna paino pilkulla tai pisteellä, esimerkiksi `75,4` tai `75.4`. Enintään kaksi desimaalia, paino yli 0 ja enintään 500 kg.
- Päivän uusi syöttö korvaa aiemman. Päivä vaihtuu myös sovelluksen ollessa auki, viimeistään 30 sekunnissa sekä ennen tallennusta.
- Historia näyttää kaikki tallennetut mittaukset uusimmasta vanhimpaan. **Poista** kysyy vahvistuksen ennen poistamista.
- Käyrä näyttää viimeisen 30 kalenteripäivän mittaukset. Historiaa ei rajata 30 päivään.
- 7 päivän trendi sisältää tämän päivän ja kuusi edellistä päivää; 14 päivän trendi tämän päivän ja kolmetoista edellistä päivää. Kyse on kalenteripäivistä, ei viimeisistä 7 tai 14 mittauksesta.
- Trendi lasketaan vasta, kun jaksolla on vähintään kaksi eri päivän mittausta. Muuten näkyy viiva. Jos tänään ei ole mittausta, aiemmat jaksoon kuuluvat mittaukset ovat silti mukana.
- Miinus tarkoittaa painon laskua ja plus nousua. Tulos on sovitetun trendin muutosnopeus, ei jakson ensimmäisen ja viimeisen arvon suora erotus.

OLS-laskenta: `kg/vko = 7 × Σ((x − x̄)(y − ȳ)) / Σ((x − x̄)²)`, missä x on kalenteripäivän järjestysnumero ja y paino. Päivämäärät muutetaan UTC-päivänumeroiksi paikallisen päivämäärän valinnan jälkeen: kesäajan vaihdos ei vääristä päivävälejä. Puuttuvia päiviä ei täytetä eikä niitä tulkita nollapainoksi.

Esimerkki: maanantaina 80,0 kg, keskiviikkona 79,8 kg ja sunnuntaina 79,4 kg antaa trendiksi −0,70 kg/vko. Väleinä käytetään 2 ja 4 päivää.

## 6. Offline-käyttö, tietojen säilyminen ja päivitykset

Kun offline-valmius on ilmoitettu, sulje sovellus ja kokeile avaamista lentotilassa. Tallennus, historia ja laskenta toimivat ilman verkkoyhteyttä. Ensimmäinen lataus ja uusien versioiden lataus vaativat verkon.

Tietoja ei synkronoida, eikä tässä versiossa ole varmuuskopiointia. Paikallinen kokeilu ja GitHub Pages -osoite ovat eri tallennuspaikkoja. Samoin eri selaimet ja laitteet ovat erillisiä. Selaintietojen poisto, yksityinen selaus tai laitteen tallennustilan siivous voi hävittää tiedot. Sovellus kertoo, jos tallentaminen epäonnistuu; virheellistä vanhaa tallennusta ei korvata hiljaisesti.

Kun muokkaat sovellusta myöhemmin, muuta `sw.js`-tiedoston `VERSION='v1'` seuraavaan arvoon, esimerkiksi `v2`, ja lataa muuttuneet tiedostot GitHubiin. Avaa sovellus verkkoyhteydellä, sulje kaikki saman sovelluksen välilehdet ja ikkunat, ja avaa se uudelleen, jotta odottava versio aktivoituu. Päivitys ei poista painotietoja. Säilytä sama osoite ja tallennusavaimen toteutus.

## Viralliset ohjeet

- GitHub Pagesin julkaisulähde ja maksuton käyttö: <https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site>
- iPhone: verkkosivun lisääminen sovellukseksi: <https://support.apple.com/en-eg/guide/iphone/iphea86e5236/ios>
- PWA-asennuksen vaatimukset: <https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable>

Ohje tarkistettu 3.10.2026. Valikoiden nimet voivat vaihdella kielen ja selainversion mukaan.

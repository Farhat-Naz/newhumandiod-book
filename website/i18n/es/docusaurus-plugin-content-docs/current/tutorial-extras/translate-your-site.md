---
sidebar_position: 2
---

# Traduce tu sitio

Traduzcamos`docs/intro.md`al francés.

## Configurar i18n

Modificar`docusaurus.config.js`para añadir soporte para el`fr`locale:```js title="docusaurus.config.js"
export default {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
  },
};
```## Traducir un documento

Copiar el`docs/intro.md`archivar al`i18n/fr`carpeta:```bash
mkdir -p i18n/fr/docusaurus-plugin-content-docs/current/

cp docs/intro.md i18n/fr/docusaurus-plugin-content-docs/current/intro.md
```Traducir`i18n/fr/docusaurus-plugin-content-docs/current/intro.md`en francés.&#10;&#10; ## Comienza tu sitio localizado&#10;&#10; Comience su sitio en la configuración regional francesa:```bash
npm run start -- --locale fr
```Se puede acceder a su sitio localizado en [http://localhost:3000/fr/](http://localhost:3000/fr/) y el`Getting Started`página está traducida.

:::precaución

En desarrollo, solo puede usar una configuración regional a la vez.

:::

## Añadir un menú desplegable de configuración regional

Para navegar sin problemas entre idiomas, añade un menú desplegable de configuración regional.

Modificar la`docusaurus.config.js`archivo:```js title="docusaurus.config.js"
export default {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'localeDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```El menú desplegable de configuración regional aparece ahora en la barra de navegación:

![Desplegable de configuración regional](./img/localeDropdown.png)

## Construye tu sitio localizado

Crea tu sitio para una configuración regional específica:```bash
npm run build -- --locale fr
```O crea tu sitio para incluir todas las ubicaciones a la vez:```bash
npm run build
```

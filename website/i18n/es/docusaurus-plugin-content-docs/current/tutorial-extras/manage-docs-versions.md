---
sidebar_position: 1
---

# Gestionar versiones de documentos

Docusaurus puede gestionar varias versiones de tus documentos.

## Crear una versión de documentos

Libera una versión 1.0 de tu proyecto:```bash
npm run docusaurus docs:version 1.0
```La`docs`la carpeta se copia en`versioned_docs/version-1.0`y`versions.json`se crea.

Tus documentos ahora tienen 2 versiones:

-`1.0`a las`http://localhost:3000/docs/`para los documentos de la versión 1.0
-`current`a las`http://localhost:3000/docs/next/`para los **próximos documentos inéditos **

## Añadir un menú desplegable de versión

Para navegar sin problemas entre las versiones, añade un menú desplegable de versiones.

Modificar la`docusaurus.config.js`archivo:```js title="docusaurus.config.js"
export default {
  themeConfig: {
    navbar: {
      items: [
        // highlight-start
        {
          type: 'docsVersionDropdown',
        },
        // highlight-end
      ],
    },
  },
};
```El menú desplegable de la versión de documentos aparece en la barra de navegación:

![Menú desplegable de la versión de documentos](./img/docsVersionDropdown.png)

## Actualizar una versión existente

Es posible editar documentos versionados en sus respectivas carpetas:

-`versioned_docs/version-1.0/hello.md`actualizaciones`http://localhost:3000/docs/hello`-`docs/hello.md`actualizaciones`http://localhost:3000/docs/next/hello`

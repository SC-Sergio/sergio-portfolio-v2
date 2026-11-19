// Transcripción de una ejecución real de LiterAlura (19-nov-2026), generada desde la salida estándar.
// Entorno: Java 17, PostgreSQL 17 aislado en local, API pública de Gutendex, rama fix/gutendex-redirect
// (SC-Sergio/Challengeliteralura#2). Las entradas se enviaron por stdin y se intercalan tras cada prompt.

export type TerminalLine = { text: string; input?: boolean; prompt?: string };
export type TerminalRun = { command: string; caption: string; lines: TerminalLine[] };

export const literaluraRun: TerminalRun = {
  command: "java -jar target/literalura-0.0.1-SNAPSHOT.jar",
  caption:
    "Salida real del 19-nov-2026 con PostgreSQL local aislado y la API pública de Gutendex, usando el arreglo de la PR #2 del repositorio. Las entradas (en cian) se enviaron por stdin; tras la primera vez se omite la repetición del menú.",
  lines: [
  {
    "text": "LiterAlura - catálogo de libros con Gutendex"
  },
  {
    "text": ""
  },
  {
    "text": "----- Menú -----"
  },
  {
    "text": "1. Buscar y registrar libro por título"
  },
  {
    "text": "2. Listar libros registrados"
  },
  {
    "text": "3. Listar autores registrados"
  },
  {
    "text": "4. Listar autores vivos en un año"
  },
  {
    "text": "5. Listar libros por idioma"
  },
  {
    "text": "0. Salir"
  },
  {
    "prompt": "Elija una opción: ",
    "text": "1",
    "input": true
  },
  {
    "prompt": "Ingrese el título del libro: ",
    "text": "Frankenstein",
    "input": true
  },
  {
    "text": "Libro registrado correctamente desde Gutendex."
  },
  {
    "prompt": "Elija una opción: ",
    "text": "1",
    "input": true
  },
  {
    "prompt": "Ingrese el título del libro: ",
    "text": "Pride and Prejudice",
    "input": true
  },
  {
    "text": "Libro registrado correctamente desde Gutendex."
  },
  {
    "prompt": "Elija una opción: ",
    "text": "1",
    "input": true
  },
  {
    "prompt": "Ingrese el título del libro: ",
    "text": "Pride and Prejudice",
    "input": true
  },
  {
    "text": "Ese libro ya está registrado."
  },
  {
    "prompt": "Elija una opción: ",
    "text": "1",
    "input": true
  },
  {
    "prompt": "Ingrese el título del libro: ",
    "text": "Dracula",
    "input": true
  },
  {
    "text": "Libro registrado correctamente desde Gutendex."
  },
  {
    "prompt": "Elija una opción: ",
    "text": "2",
    "input": true
  },
  {
    "text": "Título: Dracula"
  },
  {
    "text": "Autor(es): Stoker, Bram"
  },
  {
    "text": "Idioma(s): en"
  },
  {
    "text": "Descargas: 78131"
  },
  {
    "text": "Gutendex ID: 345"
  },
  {
    "text": "-----------------------------"
  },
  {
    "text": "Título: Frankenstein"
  },
  {
    "text": "Autor(es): Shelley, Mary Wollstonecraft"
  },
  {
    "text": "Idioma(s): en"
  },
  {
    "text": "Descargas: 1559"
  },
  {
    "text": "Gutendex ID: 6542"
  },
  {
    "text": "-----------------------------"
  },
  {
    "text": "Título: Pride and Prejudice"
  },
  {
    "text": "Autor(es): Austen, Jane"
  },
  {
    "text": "Idioma(s): en"
  },
  {
    "text": "Descargas: 208430"
  },
  {
    "text": "Gutendex ID: 1342"
  },
  {
    "text": "-----------------------------"
  },
  {
    "prompt": "Elija una opción: ",
    "text": "3",
    "input": true
  },
  {
    "text": "Autor: Austen, Jane"
  },
  {
    "text": "Nacimiento: 1775"
  },
  {
    "text": "Fallecimiento: 1817"
  },
  {
    "text": "-----------------------------"
  },
  {
    "text": "Autor: Shelley, Mary Wollstonecraft"
  },
  {
    "text": "Nacimiento: 1797"
  },
  {
    "text": "Fallecimiento: 1851"
  },
  {
    "text": "-----------------------------"
  },
  {
    "text": "Autor: Stoker, Bram"
  },
  {
    "text": "Nacimiento: 1847"
  },
  {
    "text": "Fallecimiento: 1912"
  },
  {
    "text": "-----------------------------"
  },
  {
    "prompt": "Elija una opción: ",
    "text": "4",
    "input": true
  },
  {
    "prompt": "Ingrese el año: ",
    "text": "1820",
    "input": true
  },
  {
    "text": "Shelley, Mary Wollstonecraft (1797 - 1851)"
  },
  {
    "prompt": "Elija una opción: ",
    "text": "5",
    "input": true
  },
  {
    "prompt": "Ingrese el código de idioma (por ejemplo: es, en, fr, pt): ",
    "text": "en",
    "input": true
  },
  {
    "text": "Título: Dracula"
  },
  {
    "text": "Autor(es): Stoker, Bram"
  },
  {
    "text": "Idioma(s): en"
  },
  {
    "text": "Descargas: 78131"
  },
  {
    "text": "Gutendex ID: 345"
  },
  {
    "text": "-----------------------------"
  },
  {
    "text": "Título: Frankenstein"
  },
  {
    "text": "Autor(es): Shelley, Mary Wollstonecraft"
  },
  {
    "text": "Idioma(s): en"
  },
  {
    "text": "Descargas: 1559"
  },
  {
    "text": "Gutendex ID: 6542"
  },
  {
    "text": "-----------------------------"
  },
  {
    "text": "Título: Pride and Prejudice"
  },
  {
    "text": "Autor(es): Austen, Jane"
  },
  {
    "text": "Idioma(s): en"
  },
  {
    "text": "Descargas: 208430"
  },
  {
    "text": "Gutendex ID: 1342"
  },
  {
    "text": "-----------------------------"
  },
  {
    "prompt": "Elija una opción: ",
    "text": "9",
    "input": true
  },
  {
    "text": "Opción no válida. Intente nuevamente."
  },
  {
    "prompt": "Elija una opción: ",
    "text": "0",
    "input": true
  },
  {
    "text": "Saliendo..."
  }
],
};

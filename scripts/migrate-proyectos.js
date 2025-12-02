import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Configuración Firebase
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

console.log('🔧 Configurando Firebase...');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Datos de proyectos extraídos de proyecto_wws/src/data/proyectos.ts
const proyectosData = [
  {
    "nombre": "Estaciones Levadoras Barranquillita, El Rebolo y Felicidad",
    "descripcion": "Suministro de rejas, bandas, cucharas bivalva y compuertas para tres estaciones elevadoras",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 10.9685,
      "lng": -74.7813,
      "ciudad": "Barranquilla",
      "departamento": "Atlántico"
    },
    "fecha": "2013",
    "detalles": "Equipos suministrados: rejas, bandas, cucharas bivalva y compuertas",
    "capacidad": "N/A",
    "historia": "Durante el año 2013, se llevó a cabo el suministro de rejas, bandas transportadoras, cucharas bivalva y compuertas como parte del equipamiento de tres estaciones elevadoras. Estos elementos fueron seleccionados por su eficiencia y durabilidad, aportando al adecuado funcionamiento de los sistemas de pretratamiento y manejo de aguas residuales.",
    "imagenPrincipal": "/assets/BARRANQUILLA 1.jpg",
    "imagen30proyectos": [
      "/assets/BARRANQUILLA 6.JPG",
      "/assets/BARRANQUILLA 3.JPG"
    ],
    "imagenesEquipos": [
      "/assets/BARRANQUILLA 6.JPG",
      "/assets/BARRANQUILLA 4.JPG",
      "/assets/PIEDECUESTA 4.jpg",
      "/assets/BARRANQUILLA 2.JPG"
    ],
    "equipos": [
      "Banda",
      "Cuchara Bilvalba",
      "Compuerta",
      "Rejas"
    ],
    "resumen": "Este proyecto permitió mejorar la infraestructura de saneamiento en Barranquilla, beneficiando a miles de habitantes y optimizando el tratamiento de aguas residuales.",
    "linkNoticia": "https://www.elheraldo.co/barranquilla/proyecto-elevadoras"
  },
  {
    "nombre": "Estación Elevadora Rebolo",
    "descripcion": "Proyecto de estación elevadora",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 10.9673908,
      "lng": -74.7769595,
      "ciudad": "Barranquilla",
      "departamento": "Atlántico"
    },
    "fecha": "2013",
    "detalles": "Estación elevadora",
    "capacidad": "N/A",
    "historia": null,
    "imagenPrincipal": "/assets/BARRANQUILLA 2.JPG",
    "imagen30proyectos": [
      "/assets/BARRANQUILLA 2.JPG"
    ],
    "imagenesEquipos": [
      "/assets/BARRANQUILLA 2.JPG"
    ],
    "equipos": [
      "Rejas"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "Bocatoma Río Cauca",
    "descripcion": "Suministro de rejilla fina, puente desarenador y sistema de rejillas dobles",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 3.4516,
      "lng": -76.532,
      "ciudad": "Cali",
      "departamento": "Valle del Cauca"
    },
    "fecha": "2015",
    "detalles": "Floculadores tipo vertical",
    "capacidad": "N/A",
    "historia": "En esta planta de tratamiento de agua potable se suministraron todos los floculadores tipo vertical. Esta infraestructura es esencial para la decantación de partículas y sólidos, asegurando un proceso eficiente de potabilización del agua. Finalizó operaciones en 2017.",
    "imagenPrincipal": "/assets/Bocatoma rio cauca 2.jpg",
    "imagen30proyectos": [
      "/assets/Bocatoma rio cauca 3.JPG",
      "/assets/Bocatoma rio cauca 1.jpg"
    ],
    "imagenesEquipos": [
      "/assets/Bocatoma rio cauca 2.jpg"
    ],
    "equipos": [
      "Floculadores"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Buenaventura",
    "descripcion": "Suministro de floculadores tipo vertical",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 3.8833,
      "lng": -77.0167,
      "ciudad": "Buenaventura",
      "departamento": "Valle del Cauca"
    },
    "fecha": "2017",
    "detalles": "Rejilla fina tipo zaranda de flujo dual, Puente desarenador, Sistema de rejillas dobles",
    "capacidad": "N/A",
    "historia": "Para este proyecto, finalizado en 2015, suministramos una rejilla fina tipo zaranda de flujo dual, un puente desarenador y un sistema de rejillas dobles, todos diseñados para optimizar la captación y protección del sistema. La bocatoma tiene una capacidad de captación de hasta 11 m³/s, lo que la convierte en una infraestructura clave para garantizar un flujo constante y eficiente.",
    "imagenPrincipal": "/assets/BUENAVENTURA 1.jpg",
    "imagen30proyectos": [
      "/assets/BUENAVENTURA 1.jpg",
      "/assets/BUENAVENTURA 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/BUENAVENTURA 1.jpg",
      "/assets/BUENAVENTURA 2.jpg"
    ],
    "equipos": [
      "Puente Desarenador",
      "Rejillas dobles"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Yumbo",
    "descripcion": "Sistema completo de tratamiento de aguas residuales",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 3.5833,
      "lng": -76.5,
      "ciudad": "Yumbo",
      "departamento": "Valle del Cauca"
    },
    "fecha": "2022",
    "detalles": "Rejas de cribado, distribuidor de flujo para filtro percolador, sedimentador, espesador de lodos, tea quemadora de gas",
    "capacidad": "543 l/s",
    "historia": "Proyecto de tratamiento de aguas residuales que incluye la instalación de rejas de cribado para el pretratamiento, distribuidor de flujo para filtro percolador, sedimentador, espesador de lodos y una tea quemadora de gas. Esta planta tiene una capacidad máxima de 543 l/s y fue puesta en funcionamiento en 2022.",
    "imagenPrincipal": "/assets/Yumbo 1.webp",
    "imagen30proyectos": [
      "/assets/Yumbo 2.webp",
      "/assets/Yumbo 1.webp"
    ],
    "imagenesEquipos": [
      "/assets/Yumbo 1.webp",
      "/assets/Yumbo 2.webp",
      "/assets/Yumbo 3.webp"
    ],
    "equipos": [],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Buga",
    "descripcion": "Sistema completo de tratamiento de aguas residuales",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 3.9,
      "lng": -76.3,
      "ciudad": "Buga",
      "departamento": "Valle del Cauca"
    },
    "fecha": "2024",
    "detalles": "Rejas de cribado, distribuidores de flujo, sedimentadores y espesador",
    "capacidad": "887 l/s",
    "historia": "En esta planta se suministraron rejas de cribado para pretratamiento, dos distribuidores de flujo para filtros percoladores, dos sedimentadores y un espesador. La capacidad máxima es de 887 l/s y comenzó operaciones en 2024.",
    "imagenPrincipal": "/assets/Buga 1.jpg",
    "imagen30proyectos": [
      "/assets/Buga 2.jpg",
      "/assets/Buga 3.jpg"
    ],
    "imagenesEquipos": [
      "/assets/Buga 1.jpg",
      "/assets/Buga 2.jpg",
      "/assets/Buga 3.jpg",
      "/assets/Buga 4.webp"
    ],
    "equipos": [
      "Distribuidor de flujo",
      "Sedimentador",
      "Espesador de Lodos",
      "Rejilla"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Florida",
    "descripcion": "Sistema de sedimentación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 3.3167,
      "lng": -76.2333,
      "ciudad": "Florida",
      "departamento": "Valle del Cauca"
    },
    "fecha": "2024",
    "detalles": "Sedimentador",
    "capacidad": "157 l/s",
    "historia": "Proyecto enfocado en el tratamiento de aguas residuales, donde se suministró un sedimentador. Esta planta entró en funcionamiento en 2024 con una capacidad de tratamiento de 157 l/s.",
    "imagenPrincipal": "/assets/Florida 1.webp",
    "imagen30proyectos": [
      "/assets/Florida 1.webp"
    ],
    "imagenesEquipos": [
      "/assets/Florida 1.webp"
    ],
    "equipos": [
      "Sedimentador"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Acacias",
    "descripcion": "Sistema de sedimentación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 3.9833,
      "lng": -73.7667,
      "ciudad": "Acacías",
      "departamento": "Meta"
    },
    "fecha": "2011",
    "detalles": "Sedimentador",
    "capacidad": "220 l/s",
    "historia": "Para esta planta de tratamiento de aguas residuales se suministró un sedimentador en el año 2011. La planta fue diseñada para tratar un caudal de 220 l/s.",
    "imagenPrincipal": "/assets/acacias 1.jpg",
    "imagen30proyectos": [
      "/assets/acasias 1.jpg"
    ],
    "imagenesEquipos": [
      "/assets/acasias 1.jpg"
    ],
    "equipos": [
      "Sedimentador"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Chichimene",
    "descripcion": "Sistema de percolación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 3.9833,
      "lng": -73.765,
      "ciudad": "Acacías",
      "departamento": "Meta"
    },
    "fecha": "2017",
    "detalles": "Percolador para el floculador",
    "capacidad": "N/A",
    "historia": "En este proyecto se suministró un percolador para el floculador. Forma parte del sistema de tratamiento de aguas del municipio de Acacías y fue ejecutado en 2017.",
    "imagenPrincipal": "/assets/acacias 2.jpg",
    "imagen30proyectos": [
      "/assets/acacias 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/acacias 2.jpg"
    ],
    "equipos": [
      "Percolador"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Villavicencio",
    "descripcion": "Sistema de agitación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 4.142,
      "lng": -73.6266,
      "ciudad": "Villavicencio",
      "departamento": "Meta"
    },
    "fecha": "2021",
    "detalles": "Agitadores para floculación lenta, floculación rápida y mezcla",
    "capacidad": "2 m³/s",
    "historia": "Proyecto integral de tratamiento de agua con el suministro de todos los agitadores necesarios para las etapas de floculación lenta, floculación rápida y mezcla. Entró en funcionamiento en 2021 y su diseño está optimizado para un caudal de 2 m³/s.",
    "imagenPrincipal": "/assets/esmerlada 3.jpg",
    "imagen30proyectos": [
      "/assets/esmerlada 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/esmerlada 1.jpg"
    ],
    "equipos": [
      "Agitadores"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Aeropuerto El Dorado",
    "descripcion": "Sistema de sedimentación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 4.7016,
      "lng": -74.1469,
      "ciudad": "Bogotá",
      "departamento": "Cundinamarca"
    },
    "fecha": "2013",
    "detalles": "Sedimentador",
    "capacidad": "57 l/s",
    "historia": "Se suministró el sedimentador para esta planta de tratamiento que da servicio al aeropuerto internacional. Diseñada para tratar 57 l/s de aguas residuales.",
    "imagenPrincipal": "/assets/AREOPUERTO EL DORADO 1.jpg",
    "imagen30proyectos": [
      "/assets/AREOPUERTO EL DORADO 1.jpg"
    ],
    "imagenesEquipos": [
      "/assets/AREOPUERTO EL DORADO 1.jpg"
    ],
    "equipos": [
      "Sedimentador"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Tenjo",
    "descripcion": "Sistema de sedimentación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 4.8667,
      "lng": -74.1667,
      "ciudad": "Tenjo",
      "departamento": "Cundinamarca"
    },
    "fecha": "2017",
    "detalles": "Sedimentador",
    "capacidad": "40 l/s",
    "historia": "Para esta planta se suministró un sedimentador, diseñada para una capacidad de 40 l/s.",
    "imagenPrincipal": "/assets/Tenjo 1.png",
    "imagen30proyectos": [
      "/assets/Tenjo 1.png"
    ],
    "imagenesEquipos": [
      "/assets/Tenjo 1.png"
    ],
    "equipos": [
      "Sedimentador"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Nemocón",
    "descripcion": "Sistema completo de tratamiento",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 5.0667,
      "lng": -73.8833,
      "ciudad": "Nemocón",
      "departamento": "Cundinamarca"
    },
    "fecha": "2016",
    "detalles": "Sedimentador, compuertas, espesadores de lodos gravimétricos, filtro prensa y filtros de arenas",
    "capacidad": "32 l/s",
    "historia": "En esta planta se entregaron sedimentador, compuertas, espesadores de lodos gravimétricos, filtro prensa y filtros de arena. La planta fue diseñada para un caudal de 32 l/s.",
    "imagenPrincipal": "/assets/NEMOCON 1.jpg",
    "imagen30proyectos": [
      "/assets/NEMOCON 2.jpg",
      "/assets/NEMOCON 1.jpg"
    ],
    "imagenesEquipos": [
      "/assets/NEMOCON 1.jpg",
      "/assets/NEMOCON 3.jpg",
      "/assets/NEMOCON 2.jpg",
      "/assets/NEMOCON 4.jpg"
    ],
    "equipos": [
      "Sedimentador",
      "Compuertas",
      "Espesadores de lodos gravimétricos",
      "Filtro prensa",
      "Filtros de arenas"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Sesquilé",
    "descripcion": "Sistema de sedimentación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 5.05,
      "lng": -73.8,
      "ciudad": "Sesquilé",
      "departamento": "Cundinamarca"
    },
    "fecha": "2010",
    "detalles": "Sedimentador",
    "capacidad": "15 l/s",
    "historia": "Suministro de sedimentador en esta planta diseñada para tratar 15 l/s de aguas residuales, lo que la convierte en una planta pequeña pero eficiente.",
    "imagenPrincipal": "/assets/SESQUILE 1.JPG",
    "imagen30proyectos": [
      "/assets/SESQUILE 1.JPG"
    ],
    "imagenesEquipos": [
      "/assets/SESQUILE 1.JPG"
    ],
    "equipos": [
      "Sedimentador"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR y PTAP Tocancipá Los Patos",
    "descripcion": "Sistema de sedimentación y floculación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 4.9667,
      "lng": -73.9,
      "ciudad": "Tocancipá",
      "departamento": "Cundinamarca"
    },
    "fecha": "2018",
    "detalles": "Sedimentador y trenes de floculación",
    "capacidad": "70 l/s",
    "historia": "Se suministró el sedimentador y todos los trenes de floculación. Esta infraestructura fue diseñada para un tratamiento combinado de aguas residuales y potables con una capacidad de 70 l/s.",
    "imagenPrincipal": "/assets/LOS PATOS 1.jpg",
    "imagen30proyectos": [
      "/assets/LOS PATOS 1.jpg",
      "/assets/LOS PATOS 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/LOS PATOS 1.jpg",
      "/assets/LOS PATOS 2.jpg"
    ],
    "equipos": [
      "Sedimentador",
      "Trenes de floculación"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Fusagasugá",
    "descripcion": "Sistema completo de tratamiento",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 4.3333,
      "lng": -74.3667,
      "ciudad": "Fusagasugá",
      "departamento": "Cundinamarca"
    },
    "fecha": "2020",
    "detalles": "Sedimentador, distribuidor de flujo, compuertas y tamiz rotativo",
    "capacidad": "90 l/s",
    "historia": "Se suministró el sedimentador, distribuidor de flujo, compuertas y tamiz rotativo. Esta infraestructura fue diseñada para un tratamiento combinado de aguas residuales y potables con una capacidad de 90 l/s.",
    "imagenPrincipal": "/assets/fusagasuga 1.jpg",
    "imagen30proyectos": [
      "/assets/fusagasuga 1.jpg",
      "/assets/fusagasuga 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/fusagasuga 1.jpg",
      "/assets/fusagasuga 4.jpg",
      "/assets/fusagasuga 3.jpg",
      "/assets/fusagasuga 2.jpg"
    ],
    "equipos": [
      "Sedimentador",
      "Distribuidor de flujo",
      "Compuertas",
      "Tamiz rotativo"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Verganzo, Tocancipá",
    "descripcion": "Sistema de cribado",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 4.9667,
      "lng": -73.905,
      "ciudad": "Tocancipá",
      "departamento": "Cundinamarca"
    },
    "fecha": "2024",
    "detalles": "Reja de cribado auto limpiante especialmente profunda",
    "capacidad": "60 l/s",
    "historia": "Se suministró la reja de cribado auto limpiante especialmente profunda. Esta infraestructura fue diseñada para un tratamiento combinado de aguas residuales y potables con una capacidad de 60 l/s.",
    "imagenPrincipal": "/assets/Verganzo 1.jpg",
    "imagen30proyectos": [
      "/assets/Verganzo 1.jpg",
      "/assets/Verganzo 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/Verganzo 2.jpg"
    ],
    "equipos": [
      "Reja de cribado auto limpiante"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Armenia",
    "descripcion": "Sistema completo de tratamiento",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 4.5333,
      "lng": -75.6833,
      "ciudad": "Armenia",
      "departamento": "Quindío"
    },
    "fecha": "2015",
    "detalles": "Espesador de lodos, distribuidor de flujo, barredor de lodos y desengrasador",
    "capacidad": "87 l/s",
    "historia": "para este proyecto suministramos el espesador de lodos, el distribuidor de flujo para el filtro percolador, el barredor de lodos para el sedimentador, y el desengrasador, en el año 2015, esta planta está diseñada para 87 l/s.",
    "imagenPrincipal": "/assets/ARMENIA 1.jpg",
    "imagen30proyectos": [
      "/assets/ARMENIA 1.jpg",
      "/assets/ARMENIA 3.jpg"
    ],
    "imagenesEquipos": [
      "/assets/ARMENIA 1.jpg",
      "/assets/ARMENIA 2.JPG",
      "/assets/ARMENIA 3.jpg"
    ],
    "equipos": [
      "Espesador de lodos",
      "Distribuidor de flujo",
      "Desengrasador"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Chitré",
    "descripcion": "Sistema de barredores y mantenimiento",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 7.9667,
      "lng": -80.4333,
      "ciudad": "Chitré",
      "departamento": "Panamá"
    },
    "fecha": "2015-2025",
    "detalles": "4 barredores de lodos para sedimentador, 2 barredores para espesadores y repuestos",
    "capacidad": "1100 m³/h",
    "historia": "Proyecto internacional en el cual se suministraron 4 barredores de lodos para sedimentadores y 2 para espesadores de lodos. En 2025 se realizó la venta de repuestos. La planta tiene una capacidad de 1100 m³/h",
    "imagenPrincipal": "/assets/CHITRE 1.jpg",
    "imagen30proyectos": [
      "/assets/CHITRE 1.jpg",
      "/assets/CHITRE 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/CHITRE 1.jpg",
      "/assets/CHITRE 2.jpg"
    ],
    "equipos": [
      "Barredores de lodos",
      "Repuestos"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR El Santuario",
    "descripcion": "Sistema de desarenado y aireación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 7.0833,
      "lng": -73,
      "ciudad": "Piedecuesta",
      "departamento": "Santander"
    },
    "fecha": "2015",
    "detalles": "Puentes desarenadores, compuertas de accionamiento manual y sistema de aireación",
    "capacidad": "672 l/s",
    "historia": "Incluyó el suministro de puentes desarenadores, compuertas de accionamiento manual y sistema de aireación. Está diseñada para 672 l/s.",
    "imagenPrincipal": "/assets/PIEDECUESTA 1.jpg",
    "imagen30proyectos": [
      "/assets/PIEDECUESTA 1.jpg",
      "/assets/PIEDECUESTA 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/PIEDECUESTA 1.jpg",
      "/assets/PIEDECUESTA 2.jpg",
      "/assets/PIEDECUESTA 3.jpg"
    ],
    "equipos": [
      "Puentes desarenadores",
      "Compuertas de accionamiento manual",
      "Sistema de aireación"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Tunja",
    "descripcion": "Sistema completo de tratamiento",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 5.5333,
      "lng": -73.3667,
      "ciudad": "Tunja",
      "departamento": "Boyacá"
    },
    "fecha": "2015",
    "detalles": "6 sedimentadores, 4 espesadores gravimétricos y 1 tea quemador de gas",
    "capacidad": "384 l/s",
    "historia": "Para este proyecto se suministraron 6 sedimentadores, 4 espesadores gravimétricos y una 1 tea quemador de gas.  En este proyecto se trabajaron en diferentes años, los primeros equipos se entregaron en el 2015. Este proyecto esta diseñado para un caudal de 384 l/s.",
    "imagenPrincipal": "/assets/Tunja 1.jpg",
    "imagen30proyectos": [
      "/assets/Tunja 1.jpg"
    ],
    "imagenesEquipos": [
      "/assets/Tunja 1.jpg",
      "/assets/Tunja 2.jpg",
      "/assets/Tunja 3.jpg"
    ],
    "equipos": [
      "Sedimentadores",
      "Espesadores gravimétricos",
      "Tea quemador de gas"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Gramalote",
    "descripcion": "Sistema completo de tratamiento",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 7.8833,
      "lng": -72.8,
      "ciudad": "Gramalote",
      "departamento": "Norte de Santander"
    },
    "fecha": "2017",
    "detalles": "2 sedimentadores, 2 distribuidores de flujo, tea quemadora de gas, compuertas y rejillas",
    "capacidad": "18 l/s",
    "historia": "Se suministraron 2 sedimentadores, 2 distribuidores de flujo para percoladores, una tea quemadora de gas, compuertas y rejillas de pretratamiento. Capacidad de 18 l/s.",
    "imagenPrincipal": "/assets/Gramalote 1.jpg",
    "imagen30proyectos": [
      "/assets/Gramalote 1.jpg",
      "/assets/Gramalote 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/Gramalote 1.jpg",
      "/assets/Gramalote 2.jpg",
      "/assets/Gramalote 3.jpg"
    ],
    "equipos": [
      "Sedimentadores",
      "Distribuidores de flujo",
      "Tea quemadora de gas",
      "Compuertas",
      "Rejillas"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Montería",
    "descripcion": "Sistema completo de tratamiento",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": 8.75,
      "lng": -75.8833,
      "ciudad": "Montería",
      "departamento": "Córdoba"
    },
    "fecha": "2021-2023",
    "detalles": "3 sedimentadores, 3 distribuidores para percoladores y 2 espesadores de lodos",
    "capacidad": "525 l/s",
    "historia": "Suministro en dos fases. Se entregaron 3 sedimentadores, 3 distribuidores de flujo para percoladores y 2 espesadores de lodos. La planta está diseñada para tratar 525 l/s.",
    "imagenPrincipal": "/assets/monteria 1.jpg",
    "imagen30proyectos": [
      "/assets/monteria 1.jpg",
      "/assets/monteria 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/monteria 1.jpg",
      "/assets/monteria 2.jpg",
      "/assets/monteria 3.jpg"
    ],
    "equipos": [
      "Sedimentadores",
      "Distribuidores de flujo",
      "Espesadores de lodos"
    ],
    "resumen": null,
    "linkNoticia": null
  },
  {
    "nombre": "PTAR Chone",
    "descripcion": "Sistema de sedimentación",
    "tipo": "instalacion",
    "ubicacion": {
      "lat": -0.6833,
      "lng": -80.1,
      "ciudad": "Chone",
      "departamento": "Manabí"
    },
    "fecha": "2025",
    "detalles": "2 sedimentadores",
    "capacidad": "30.000 m³/día",
    "historia": "Proyecto internacional en Ecuador. Se suministraron 2 sedimentadores. La planta está diseñada para una capacidad de 30.000 m³/día.",
    "imagenPrincipal": "/assets/Chone 1.jpg",
    "imagen30proyectos": [
      "/assets/Chone 1.jpg",
      "/assets/Chone 2.jpg"
    ],
    "imagenesEquipos": [
      "/assets/Chone 1.jpg"
    ],
    "equipos": [
      "Sedimentadores"
    ],
    "resumen": null,
    "linkNoticia": null
  }
];

async function migrateProyectos() {
  console.log('🚀 Iniciando migración de proyectos...\n');
  
  let successCount = 0;
  let errorCount = 0;
  let idCounter = 1;

  for (const proyecto of proyectosData) {
    try {
      console.log(`📍 Migrando: ${proyecto.nombre}`);

      const proyectoToSave = {
        id: idCounter++,
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion,
        tipo: proyecto.tipo,
        ubicacion: proyecto.ubicacion,
        fecha: proyecto.fecha,
        detalles: proyecto.detalles,
        capacidad: proyecto.capacidad,
        historia: proyecto.historia || null,
        imagenPrincipal: proyecto.imagenPrincipal || null,
        imagen30proyectos: proyecto.imagen30proyectos || [],
        imagenesEquipos: proyecto.imagenesEquipos || [],
        equipos: proyecto.equipos || [],
        resumen: proyecto.resumen || null,
        linkNoticia: proyecto.linkNoticia || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'proyectos'), proyectoToSave);
      console.log(`   ✅ Proyecto guardado con ID: ${proyectoToSave.id}`);
      console.log(`   📍 Ubicación: ${proyecto.ubicacion.ciudad}, ${proyecto.ubicacion.departamento}`);
      console.log('');

      successCount++;
    } catch (error) {
      console.error(`   ❌ Error al migrar "${proyecto.nombre}":`, error.message);
      errorCount++;
      console.log('');
    }
  }

  console.log('═══════════════════════════════════════');
  console.log('🎉 Migración completada!');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log(`📊 Total: ${proyectosData.length}`);
  console.log('═══════════════════════════════════════');
}

// Ejecutar migración
migrateProyectos()
  .then(() => {
    console.log('\n✅ Script finalizado correctamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error fatal:', error);
    process.exit(1);
  });



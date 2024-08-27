# Nombre del Proyecto

Entrevista técnica para Flapp⚡️

## Supuestos en archivo supuestos.txt
## Estructura del Proyecto

```
Flapp
├── backend
│   └── api
│   └── backend
│   └── manage.py
│   └── requirements.txt
├── frontend
│   └── public
│   └── src
│   └── package.json
├── .gitattributes
├── .gitignore
├── supuestos.txt
└── README.md
```

## Requisitos

- Python 3.x
- Node.js y npm

## Instalación

### Backend

1. Navega a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Crea un entorno virtual (opcional pero recomendado):

   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows usa `venv\Scripts\activate`
   ```

3. Instala las dependencias:

   ```bash
   pip install -r requirements.txt
   ```

4. Realiza las migraciones de la base de datos:

   ```bash
   python manage.py migrate
   ```

5. Inicia el servidor de desarrollo:

   ```bash
   python manage.py runserver
   ```

### Frontend

1. Crea un archivo dentro de la carpeta frontend llamado `.env` con la URL del servidor de desarrollo, debe llamarse `VITE_API_URL`:
```
VITE_API_URL="http://127.0.0.1:8000/" 
```

2. Navega a la carpeta del frontend:

   ```bash
   cd frontend
   ```

3. Instala las dependencias:

   ```bash
   npm install
   ```

4. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

## Uso

Accede a la aplicación en tu navegador en `http://localhost:3000` (o el puerto correspondiente para el frontend) y `http://localhost:8000` (o el puerto correspondiente para el backend).

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).